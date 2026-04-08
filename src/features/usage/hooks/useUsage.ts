import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { apiService } from "@/services/api";
import type { MeasureData } from "@/types";

export function useUsage() {
  const { contractId } = useApp();
  const [period, setPeriod] = useState<"day" | "week" | "month">("week");
  const [data, setData] = useState<MeasureData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!contractId) return;
    setIsLoading(true);
    apiService
      .getUsageData(period, contractId)
      .then((res) => {
        setData([...res].reverse());
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [period, contractId]);

  const totalUsage = data.reduce((acc, curr) => acc + curr.value, 0).toFixed(1);
  const avgUsage = (Number(totalUsage) / (data.length || 1)).toFixed(1);

  const formatXAxis = (tickItem: string) => {
    const date = parseISO(tickItem);
    if (period === "day") return format(date, "HH:mm");
    if (period === "week") return format(date, "EEE");
    return format(date, "dd MMM");
  };

  return {
    period,
    setPeriod,
    data,
    isLoading,
    totalUsage,
    avgUsage,
    formatXAxis,
  };
}
