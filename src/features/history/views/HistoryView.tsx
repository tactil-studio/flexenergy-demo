import { format, parseISO } from "date-fns";
import {
  ArrowDownLeft,
  ArrowUpRight,
  PieChart as PieChartIcon,
  TrendingUp,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/types";
import { useHistory } from "../hooks/useHistory";

export function HistoryView() {
  const { transactions, isLoading, weeklySpent, weeklyRecharged, chartData, efficiencyScore } =
    useHistory();

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="bg-card rounded-[24px] md:rounded-[32px] p-5 md:p-6 border border-border shadow-sm">
          <div className="flex items-center gap-2.5 md:gap-3 mb-3 md:mb-4">
            <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg md:rounded-xl">
              <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">
              Weekly insights
            </h3>
          </div>
          <div className="space-y-3 md:space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[11px] md:text-xs text-muted-foreground font-medium">
                Spent this week
              </span>
              <span className="text-xs md:text-sm font-bold text-foreground">
                {formatCurrency(weeklySpent * 100)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] md:text-xs text-muted-foreground font-medium">
                Recharged
              </span>
              <span className="text-xs md:text-sm font-bold text-success">
                +{formatCurrency(weeklyRecharged * 100)}
              </span>
            </div>
            {efficiencyScore !== null && (
              <div className="pt-1.5 md:pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Settlement rate:{" "}
                  <span className="font-medium text-foreground">{efficiencyScore}%</span>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-foreground rounded-[24px] md:rounded-[32px] p-5 md:p-6 text-background shadow-xl relative overflow-hidden">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3 md:mb-4">
              <span className="text-xs text-background/50">
                Activity trend
              </span>
              <PieChartIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary/70" />
            </div>
            <div className="h-20 md:h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload?.length) {
                        return (
                          <div className="bg-card text-foreground p-2 rounded-lg text-[10px] font-semibold shadow-xl border border-border">
                            {formatCurrency(Number(payload[0].value) * 100)}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAmt)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4 md:mb-6 px-2">
          <h2 className="font-bold text-lg md:text-xl text-foreground tracking-tight">
            Recent activity
          </h2>
          <button
            type="button"
            className="text-xs font-medium text-primary hover:text-primary/80"
          >
            View all
          </button>
        </div>
        <div className="bg-card rounded-[24px] md:rounded-[32px] overflow-hidden border border-border shadow-sm">
          {isLoading ? (
            <div className="p-10 md:p-12 text-center">
              <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3 md:mb-4" />
              <p className="text-xs text-muted-foreground">
                Loading history...
              </p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-10 text-center text-xs text-muted-foreground">
              No transactions found.
            </div>
          ) : (
            transactions.map((tx, i) => (
              <div
                key={tx.orderId ?? tx.transactionDate ?? i}
                className="p-4 md:p-6 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${tx.amountMinor > 0 ? "bg-success/10" : "bg-primary/10"}`}
                    >
                      {tx.amountMinor > 0 ? (
                        <ArrowDownLeft className="w-5 h-5 md:w-6 md:h-6 text-success" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm md:text-base text-foreground capitalize tracking-tight">
                        {tx.description}
                      </h3>
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[10px] text-muted-foreground">
                          {format(parseISO(tx.transactionDate), "MMM dd, yyyy")}
                        </span>
                        <span className="w-1 h-1 bg-border rounded-full" />
                        <span className="text-[10px] text-muted-foreground">
                          {tx.transactionSource}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-base md:text-lg tracking-tight ${tx.amountMinor > 0 ? "text-success" : "text-foreground"}`}>
                      {tx.amountMinor > 0 ? "+" : "-"}
                      {formatCurrency(Math.abs(tx.amountMinor), tx.currency, tx.scale)}
                    </p>
                    <p className={`text-[10px] ${tx.transactionStatus === "Settled" ? "text-muted-foreground" :
                      tx.transactionStatus === "Failed" ? "text-destructive" : "text-warning"
                      }`}>
                      {tx.transactionStatus}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
