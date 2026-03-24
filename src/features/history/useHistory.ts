import {
  endOfWeek,
  format,
  isWithinInterval,
  parseISO,
  startOfWeek,
} from "date-fns";
import { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import type { Transaction } from "@/types";
import { fromMinorUnits } from "@/types";

export function useHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiService.getTransactions().then((res) => {
      setTransactions(res);
      setIsLoading(false);
    });
  }, []);

  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);

  const weeklyTransactions = transactions.filter((tx) =>
    isWithinInterval(parseISO(tx.transactionDate), {
      start: weekStart,
      end: weekEnd,
    }),
  );

  const weeklySpent = weeklyTransactions
    .filter((tx) => tx.amountMinor < 0)
    .reduce((acc, curr) => acc + Math.abs(fromMinorUnits(curr.amountMinor, curr.scale)), 0);

  const weeklyRecharged = weeklyTransactions
    .filter((tx) => tx.amountMinor > 0)
    .reduce((acc, curr) => acc + fromMinorUnits(curr.amountMinor, curr.scale), 0);

  // Prepare data for mini area chart (last 7 days)
  const chartData = transactions
    .slice(0, 7)
    .reverse()
    .map((tx) => ({
      date: format(parseISO(tx.transactionDate), "MMM dd"),
      amount: fromMinorUnits(tx.amountMinor, tx.scale),
    }));

  return {
    transactions,
    isLoading,
    weeklySpent,
    weeklyRecharged,
    chartData,
  };
}
