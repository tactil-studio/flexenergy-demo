import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { apiService } from "@/services/api";
import type { MeasureData } from "@/types";

export function useDashboardChart() {
  const { contractId } = useApp();
  const [data, setData] = useState<MeasureData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!contractId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    apiService
      .getUsageData("week", contractId)
      .then((res) => setData([...res].reverse()))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [contractId]);

  const totalUsage = data.reduce(
    (acc: number, d: MeasureData) => acc + d.value,
    0,
  );
  // Positive trend = consumption increased vs 7 days ago (bad), negative = decreased (good)
  const trend =
    data.length >= 2 ? data[data.length - 1].value - data[0].value : 0;

  return { data, isLoading, totalUsage, trend };
}
