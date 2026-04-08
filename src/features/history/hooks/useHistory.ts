import {
  endOfWeek,
  format,
  isWithinInterval,
  parseISO,
  startOfWeek,
} from "date-fns";
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/services/api";
import type { Transaction } from "@/types";
import { fromMinorUnits } from "@/types";

export function useHistory() {
  const { contractId } = useApp();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.customerId || !contractId) return;
    setIsLoading(true);
    apiService
      .getTransactions(user.customerId, contractId)
      .then((res) => {
        setTransactions(res);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [user?.customerId, contractId]);

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
    .reduce(
      (acc, curr) =>
        acc + Math.abs(fromMinorUnits(curr.amountMinor, curr.scale)),
      0,
    );

  const weeklyRecharged = weeklyTransactions
    .filter((tx) => tx.amountMinor > 0)
    .reduce(
      (acc, curr) => acc + fromMinorUnits(curr.amountMinor, curr.scale),
      0,
    );

  // Prepare data for mini area chart (last 7 days)
  const chartData = transactions
    .slice(0, 7)
    .reverse()
    .map((tx) => ({
      date: format(parseISO(tx.transactionDate), "MMM dd"),
      amount: fromMinorUnits(tx.amountMinor, tx.scale),
    }));

  // Settled vs total as a simple efficiency proxy
  const settledCount = transactions.filter(
    (tx) => tx.transactionStatus === "Settled",
  ).length;
  const efficiencyScore =
    transactions.length > 0
      ? Math.round((settledCount / transactions.length) * 100)
      : null;

  return {
    transactions,
    isLoading,
    weeklySpent,
    weeklyRecharged,
    chartData,
    efficiencyScore,
  };
}
