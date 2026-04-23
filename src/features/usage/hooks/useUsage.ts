import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { apiService } from "@/services/api";
import type { MeasureData } from "@/types";

export type UsageMode = "kwh" | "cost";

export function useUsage() {
  const { contractId, state } = useApp();
  const [period, setPeriod] = useState<"day" | "week" | "month">("week");
  const [mode, setMode] = useState<UsageMode>("kwh");
  const [selectedContract, setSelectedContract] = useState<"all" | number>(
    "all",
  );
  const [data, setData] = useState<MeasureData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Build contracts list from app state
  const contracts = (state?.dashboard?.contracts ?? []).map((c) => ({
    contractId: c.contractId,
    label: c.description ?? c.buContractId ?? String(c.contractId),
  }));

  // Effective contract IDs based on selection
  const activeContractIDs =
    selectedContract === "all"
      ? contracts.map((c) => c.contractId)
      : [selectedContract];

  useEffect(() => {
    if (!contractId) return;
    setIsLoading(true);

    const effectiveIds =
      activeContractIDs.length > 0 ? activeContractIDs : [contractId];
    const effectiveId =
      selectedContract === "all" ? contractId : (selectedContract as number);

    const fetch =
      mode === "cost"
        ? apiService.getGroupedCostsData(period, effectiveIds)
        : apiService.getUsageData(period, effectiveId);

    fetch
      .then((res) => {
        setData([...res].reverse());
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, contractId, mode, selectedContract]);

  const totalUsage = data.reduce((acc, curr) => acc + curr.value, 0).toFixed(1);
  const avgUsage = (Number(totalUsage) / (data.length || 1)).toFixed(1);

  // Derive peak hour from the highest-value data point
  const peakEntry = data.length
    ? data.reduce((max, curr) => (curr.value > max.value ? curr : max), data[0])
    : null;

  const peakLabel = peakEntry
    ? (() => {
        try {
          const d = parseISO(peakEntry.timestamp);
          if (period === "day") {
            const h = format(d, "HH");
            const next = String(Number(h) + 1).padStart(2, "0");
            return `${h}:00 – ${next}:00`;
          }
          if (period === "week") return format(d, "EEEE");
          return format(d, "dd MMM");
        } catch {
          return "—";
        }
      })()
    : "—";

  const formatXAxis = (tickItem: string) => {
    try {
      const date = parseISO(tickItem);
      if (period === "day") return format(date, "HH:mm");
      if (period === "week") return format(date, "EEE");
      return format(date, "dd MMM");
    } catch {
      return tickItem;
    }
  };

  return {
    period,
    setPeriod,
    mode,
    setMode,
    selectedContract,
    setSelectedContract,
    contracts,
    data,
    isLoading,
    totalUsage,
    avgUsage,
    peakLabel,
    formatXAxis,
  };
}
