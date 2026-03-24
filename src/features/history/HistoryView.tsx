import { format, parseISO } from "date-fns";
import {
  ArrowDownLeft,
  ArrowUpRight,
  PieChart as PieChartIcon,
  TrendingUp,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { useHistory } from "./useHistory";
import { formatCurrency } from "@/types";

export function HistoryView() {
  const { transactions, isLoading, weeklySpent, weeklyRecharged, chartData } =
    useHistory();

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="bg-white rounded-[24px] md:rounded-[32px] p-5 md:p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2.5 md:gap-3 mb-3 md:mb-4">
            <div className="p-1.5 md:p-2 bg-blue-50 rounded-lg md:rounded-xl">
              <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
            </div>
            <h3 className="font-bold text-xs md:text-sm text-slate-900 uppercase tracking-tight">
              Weekly Insights
            </h3>
          </div>
          <div className="space-y-3 md:space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[11px] md:text-xs text-slate-500 font-medium">
                Spent this week
              </span>
              <span className="text-xs md:text-sm font-bold text-slate-900">
                {formatCurrency(weeklySpent * 100)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] md:text-xs text-slate-500 font-medium">
                Recharged
              </span>
              <span className="text-xs md:text-sm font-bold text-emerald-600">
                +{formatCurrency(weeklyRecharged * 100)}
              </span>
            </div>
            <div className="pt-1.5 md:pt-2 border-t border-slate-50">
              <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Efficiency Score: 84%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[24px] md:rounded-[32px] p-5 md:p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3 md:mb-4">
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Activity Trend
              </span>
              <PieChartIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400" />
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
                          <div className="bg-white text-slate-900 p-2 rounded-lg text-[10px] font-bold shadow-xl border border-slate-100">
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
          <h2 className="font-bold text-lg md:text-xl text-slate-900 tracking-tight">
            Recent Activity
          </h2>
          <button
            type="button"
            className="text-[9px] md:text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:text-blue-700"
          >
            View All
          </button>
        </div>
        <div className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
          {isLoading ? (
            <div className="p-10 md:p-12 text-center">
              <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3 md:mb-4" />
              <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Loading history...
              </p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.transactionId}
                className="p-4 md:p-6 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors group"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                        tx.amountMinor > 0 ? "bg-emerald-50" : "bg-blue-50"
                      }`}
                    >
                      {tx.amountMinor > 0 ? (
                        <ArrowDownLeft className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm md:text-base text-slate-900 capitalize tracking-tight">
                        {tx.description}
                      </h3>
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {format(parseISO(tx.transactionDate), "MMM dd, yyyy")}
                        </span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {tx.transactionSource}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold text-base md:text-lg tracking-tight ${
                        tx.amountMinor > 0
                          ? "text-emerald-600"
                          : "text-slate-900"
                      }`}
                    >
                      {tx.amountMinor > 0 ? "+" : "-"}
                      {formatCurrency(Math.abs(tx.amountMinor), tx.currency, tx.scale)}
                    </p>
                    <p className={`text-[8px] md:text-[9px] font-bold uppercase tracking-widest ${
                      tx.transactionStatus === 'Settled' ? 'text-slate-400' : 
                      tx.transactionStatus === 'Failed' ? 'text-red-400' : 'text-amber-400'
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
