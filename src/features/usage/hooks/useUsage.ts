import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { apiService } from "@/services/api";
import type { MeasureData } from "@/types";

export type UsageMode = "kwh" | "cost";

export function useUsage() {
  const { contractId } = useApp();
  const [period, setPeriod] = useState<"day" | "week" | "month">("week");
  const [mode, setMode] = useState<UsageMode>("kwh");
  const [data, setData] = useState<MeasureData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!contractId) return;
    setIsLoading(true);
    const fetch =
      mode === "cost"
        ? apiService.getCostData(period, contractId)
        : apiService.getUsageData(period, contractId);
    fetch
      .then((res) => {
        setData([...res].reverse());
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [period, contractId, mode]);

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
    data,
    isLoading,
    totalUsage,
    avgUsage,
    peakLabel,
    formatXAxis,
  };
}
