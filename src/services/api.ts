import { getClient, SOURCE_ID } from "../lib/smartsphere";
import type { ApiTransaction } from "../lib/smartsphere/modules/financial";
import type { GraphicMulti } from "../lib/smartsphere/modules/graphics";
import type {
  AlertSettings,
  AppState,
  CustomerDashboard,
  MeasureData,
  MeterState,
  Notification,
  Transaction,
} from "../types";

// ─── Notification settings helpers ────────────────────────────────────────────
/** Maps backend notification settings to the frontend AlertSettings shape. */
function notificationSettingsToAlerts(
  emailEnabled: boolean,
  smsEnabled: boolean,
  startHour = "08:00",
  endHour = "22:00",
): AlertSettings {
  return {
    lowBalance: emailEnabled,
    peakUsage: smsEnabled,
    startHour,
    endHour,
  };
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function toIsoString(v: string | Date | null | undefined): string {
  if (!v) return new Date(0).toISOString();
  if (typeof v === "string") return v;
  return (v as Date).toISOString();
}

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

// ─── Local-only state (notifications persist to localStorage) ─────────────────
const NOTIFICATIONS_KEY = "flex_energy_notifications";

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
        serviceStatus: c.serviceStatus ?? "Active",
        customerId,
        startDate: toIsoString(c.startDate),
        endDate: toIsoString(c.endDate),
        lastMeasure: toIsoString(c.lastMeasure),
        balanceRaw: c.balanceRaw,
        scale: c.scale,
        currency: c.currency ?? dashRes.currency ?? "CHF",
        averageCost: c.averageCost,
        forecastTotalCost: c.forecastTotalCost,
        depletionDate: toIsoString(c.depletionDate),
      })),
    };

    // Fetch notification settings from backend; fall back to safe defaults
    let alerts: AlertSettings = {
      lowBalance: true,
      peakUsage: false,
      startHour: "08:00",
      endHour: "22:00",
    };
    try {
      const notifRes = await client.notifications.getSettings({
        customerID: customerId,
      });
      alerts = notificationSettingsToAlerts(
        notifRes.email?.enabled ?? true,
        notifRes.sms?.enabled ?? false,
        notifRes.startHour || "08:00",
        notifRes.endHour || "22:00",
      );
    } catch {
      // non-fatal — keep defaults
    }

    // Fetch meter state for the first contract
    let meterState: MeterState = "Unknown";
    const firstContractId = dashboard.contracts[0]?.contractId;
    if (firstContractId) {
      try {
        const meterRes = await client.infrastructure.listMeterStatus({});
        const meter = meterRes.meters?.find(
          (m) => m.contractID === firstContractId,
        );
        if (meter) {
          meterState = meter.warningState === 0 ? "Online" : "Offline";
        }
      } catch {
        // non-fatal
      }
    }

    return {
      dashboard,
      contracts: [],
      alerts,
      notifications: loadNotifications(),
      meterState,
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
   * Two-step recharge: generate an orderId first for traceability, then settle.
   */
  async rechargeBalance(
    customerId: number,
    contractId: number,
    amountMinor: number,
    scale: number,
  ): Promise<void> {
    const client = getClient();
    const amount = amountMinor / 10 ** scale;

    // Step 1 — reserve an orderId so the transaction is traceable
    const orderRes = await client.financial.generateOrderId({
      customerId,
      contractId,
    });
    const orderId = orderRes.orderId ?? undefined;

    // Step 2 — settle the transaction, referencing the orderId
    await client.financial.setTransaction({
      transactionDate: new Date().toISOString(),
      contractId,
      customerId,
      orderId,
      amount,
      transactionSource: 1, // Stripe
      transactionStatus: 1, // Settled
      description: "Manual Recharge",
    });
  },

  /**
   * Persists notification toggles to the backend.
   * `customerId` is required to identify the user's settings record.
   */
  async updateAlerts(
    customerId: number,
    alerts: AlertSettings,
  ): Promise<AlertSettings> {
    await getClient().notifications.updateSettings({
      customerID: customerId,
      emailEnabled: alerts.lowBalance,
      smsEnabled: alerts.peakUsage,
      startHour: alerts.startHour || "08:00",
      endHour: alerts.endHour || "22:00",
    });
    return alerts;
  },

  async getCostData(
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
    const sumMethod = period === "day" ? 2 : 3;

    const res = await getClient().graphics.getCosts({
      contractID: contractId,
      dateFrom: dateFrom.toISOString(),
      dateTo: now.toISOString(),
      sumMethod,
    });

    return mapGraphicMultiToMeasures(res, period);
  },

  async updateNotifications(
    notifications: Notification[],
  ): Promise<Notification[]> {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    return notifications;
  },
};
