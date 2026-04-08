import { format, formatDistanceToNow, isPast, parseISO } from "date-fns";
import { useApp } from "@/context/AppContext";
import { formatCurrency, fromMinorUnits } from "@/types";
import type { DashboardContract } from "@/types";

export interface ContractSummary {
  contractId: number;
  buContractId?: string;
  serviceStatus: string;
  /** Formatted balance string, e.g. "CHF 142.50" */
  balanceFormatted: string;
  /** Raw balance in minor units (for sign checks) */
  balanceRaw: number;
  /** Average daily cost formatted */
  avgCostFormatted: string;
  /** Forecast total cost formatted */
  forecastFormatted: string;
  /** Human-readable depletion label, e.g. "Runs out in 12 days" or "Expired" */
  depletionLabel: string;
  /** ISO string of depletion date */
  depletionDate: string;
  /** Last measure formatted */
  lastMeasureLabel: string;
  isLowBalance: boolean;
}

function summariseContract(c: DashboardContract): ContractSummary {
  const depletionDate = parseISO(c.depletionDate);
  const expired = isPast(depletionDate);
  const depletionLabel = expired
    ? "Balance depleted"
    : `Runs out ${formatDistanceToNow(depletionDate, { addSuffix: true })}`;

  const lastMeasureDate = parseISO(c.lastMeasure);
  const lastMeasureLabel = format(lastMeasureDate, "d MMM yyyy, HH:mm");

  const dailyAvgMinor = c.averageCost;
  const balanceMinor = c.balanceRaw;
  const daysLeft = dailyAvgMinor > 0
    ? Math.floor(fromMinorUnits(balanceMinor, c.scale) / fromMinorUnits(dailyAvgMinor, c.scale))
    : null;

  return {
    contractId: c.contractId,
    buContractId: c.buContractId,
    serviceStatus: c.serviceStatus,
    balanceFormatted: formatCurrency(balanceMinor, c.currency, c.scale),
    balanceRaw: balanceMinor,
    avgCostFormatted: formatCurrency(dailyAvgMinor, c.currency, c.scale),
    forecastFormatted: formatCurrency(c.forecastTotalCost, c.currency, c.scale),
    depletionLabel: daysLeft !== null
      ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} remaining`
      : depletionLabel,
    depletionDate: c.depletionDate,
    lastMeasureLabel,
    isLowBalance: daysLeft !== null && daysLeft <= 7,
  };
}

export function useDashboard() {
  const { state, isLoading } = useApp();
  const dashboard = state?.dashboard ?? null;

  const totalBalanceFormatted = dashboard
    ? formatCurrency(dashboard.balance, dashboard.contracts[0]?.currency ?? "CHF", dashboard.scale)
    : "—";

  const contracts: ContractSummary[] = (dashboard?.contracts ?? []).map(summariseContract);
  const hasLowBalance = contracts.some((c) => c.isLowBalance);

  return {
    isLoading,
    dashboard,
    totalBalanceFormatted,
    contracts,
    hasLowBalance,
    consume: dashboard?.consume ?? 0,
    scale: dashboard?.scale ?? 2,
  };
}
