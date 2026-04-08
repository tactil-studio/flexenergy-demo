import { getClient, SOURCE_ID } from "../lib/smartsphere";
import type { ApiTransaction } from "../lib/smartsphere/modules/financial";
import type { GraphicMulti } from "../lib/smartsphere/modules/graphics";
import type {
  AlertSettings,
  AppState,
  CustomerDashboard,
  MeasureData,
  Notification,
  Transaction,
} from "../types";

// ─── Mappers ───────────────────────────────────────────────────────────────────
const TX_SOURCE: Record<number, Transaction["transactionSource"]> = {
  0: "System",
  1: "Stripe",
  2: "Manual",
  3: "Shop",
};
const TX_STATUS: Record<number, Transaction["transactionStatus"]> = {
  0: "Pending",
  1: "Settled",
  2: "Failed",
  3: "Refunded",
  4: "Cancelled",
};

function mapTransaction(
  tx: ApiTransaction,
  scale: number,
  currency: string,
): Transaction {
  return {
    customerId: tx.customerId,
    contractId: tx.contractId,
    orderId: tx.orderId ?? undefined,
    amountMinor: tx.amountRaw,
    scale,
    currency,
    transactionSource: TX_SOURCE[tx.transactionSource ?? 0] ?? "System",
    transactionStatus: TX_STATUS[tx.transactionStatus ?? 0] ?? "Settled",
    description: tx.description ?? undefined,
    cardBrand: tx.cardBrand ?? undefined,
    cardNumber: tx.cardNumber ?? undefined,
    cardHolder: tx.cardHolder ?? undefined,
    paymentId: tx.paymentId ?? undefined,
    transactionDate:
      typeof tx.createdAt === "string"
        ? tx.createdAt
        : new Date(tx.createdAt as Date).toISOString(),
  };
}

function mapGraphicMultiToMeasures(
  data: GraphicMulti,
  period: "day" | "week" | "month",
): MeasureData[] {
  const labels = data.categories?.[0]?.category ?? [];
  const values = data.dataset?.[0]?.data ?? [];
  const count = Math.min(labels.length, values.length);
  if (count === 0) return [];

  // Generate ISO timestamps since API labels may be formatted strings ("01 Jan")
  const interval = period === "day" ? 3_600_000 : 86_400_000;
  const now = Date.now();

  return Array.from({ length: count }, (_, i) => ({
    timestamp: new Date(now - interval * (count - 1 - i)).toISOString(),
    value: parseFloat(values[i]?.value ?? "0"),
    unit: "kWh",
  }));
}

// ─── Local-only state (alerts & notifications persist to localStorage only) ────
const ALERTS_KEY = "flex_energy_alerts";
const NOTIFICATIONS_KEY = "flex_energy_notifications";

function loadAlerts(): AlertSettings {
  try {
    return (
      JSON.parse(localStorage.getItem(ALERTS_KEY) ?? "null") ?? {
        lowBalance: true,
        peakUsage: false,
      }
    );
  } catch {
    return { lowBalance: true, peakUsage: false };
  }
}
function loadNotifications(): Notification[] {
  try {
    return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) ?? "null") ?? [];
  } catch {
    return [];
  }
}

// ─── Service ───────────────────────────────────────────────────────────────────
export const apiService = {
  /**
   * Loads the full app state from the real API.
   * Requires the customer ID (from the authenticated JWT).
   */
  async getAppState(customerId: number): Promise<AppState> {
    const client = getClient();

    const dashRes = await client.contract.getCustomerDashboard({
      sourceID: SOURCE_ID,
      customerID: customerId,
    });

    const dashboard: CustomerDashboard = {
      sourceId: dashRes.sourceID,
      status: dashRes.status,
      balance: dashRes.balanceRaw,
      consume: dashRes.consume,
      scale: dashRes.scale,
      contracts: (dashRes.contracts ?? []).map((c) => ({
        contractId: c.contractID,
        buContractId: c.buContractID ?? undefined,
        description: undefined,
        startDate:
          typeof c.startDate === "string"
            ? c.startDate
            : new Date(c.startDate as Date).toISOString(),
        endDate:
          typeof c.endDate === "string"
            ? c.endDate
            : new Date(c.endDate as Date).toISOString(),
        serviceStatus:
          (c.serviceStatus as CustomerDashboard["contracts"][number]["serviceStatus"]) ??
          "Active",
        customerId,
      })),
    };

    return {
      dashboard,
      contracts: [],
      alerts: loadAlerts(),
      notifications: loadNotifications(),
    };
  },

  async getTransactions(
    customerId: number,
    contractId: number,
  ): Promise<Transaction[]> {
    const res = await getClient().financial.listTransactions({
      customerId,
      contractId,
    });
    return (res.transactions ?? []).map((tx) =>
      mapTransaction(tx, res.scale, res.currency ?? "CHF"),
    );
  },

  async getUsageData(
    period: "day" | "week" | "month",
    contractId: number,
  ): Promise<MeasureData[]> {
    const now = new Date();
    const msBack =
      period === "day"
        ? 86_400_000
        : period === "week"
          ? 604_800_000
          : 2_592_000_000;
    const dateFrom = new Date(now.getTime() - msBack);
    // SumMethod: 2 = Hourly (day), 3 = Daily (week/month)
    const sumMethod = period === "day" ? 2 : 3;

    const res = await getClient().graphics.getMeasures({
      contractID: contractId,
      dateFrom: dateFrom.toISOString(),
      dateTo: now.toISOString(),
      sumMethod,
    });

    return mapGraphicMultiToMeasures(res, period);
  },

  /**
   * Persists a recharge transaction via the real API.
   * Returns the new balance raw amount.
   */
  async rechargeBalance(
    customerId: number,
    contractId: number,
    amountMinor: number,
    scale: number,
  ): Promise<void> {
    const amount = amountMinor / 10 ** scale;
    await getClient().financial.setTransaction({
      transactionDate: new Date().toISOString(),
      contractId,
      customerId,
      amount,
      transactionSource: 1, // Stripe
      transactionStatus: 1, // Settled
      description: "Manual Recharge",
    });
  },

  // ─── Local-only (no API equivalent for a consumer app) ─────────────────────
  async updateAlerts(alerts: Partial<AlertSettings>): Promise<AlertSettings> {
    const current = loadAlerts();
    const updated = { ...current, ...alerts };
    localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
    return updated;
  },

  async updateNotifications(
    notifications: Notification[],
  ): Promise<Notification[]> {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    return notifications;
  },
};
