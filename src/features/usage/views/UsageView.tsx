import { format, parseISO } from "date-fns";
import { TrendingDown, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useUsage } from "../hooks/useUsage";

export function UsageView() {
  const {
    period,
    setPeriod,
    data,
    isLoading,
    totalUsage,
    avgUsage,
    formatXAxis,
  } = useUsage();

  return (
    <div className="space-y-4 md:space-y-6">
      <section className="bg-slate-900 rounded-[24px] md:rounded-[32px] p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2 md:mb-4">
            <span className="text-slate-400 text-xs block">
              Total consumption · {period}
            </span>
            <div className="p-1.5 md:p-2 bg-blue-500/20 rounded-lg md:rounded-xl">
              <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 md:gap-2 mb-4 md:mb-6">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {totalUsage}
            </h2>
            <span className="text-lg md:text-xl font-bold text-slate-400">
              kWh
            </span>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-medium bg-emerald-500/10 text-emerald-400 px-2.5 py-1 md:py-1.5 rounded-full border border-emerald-500/20">
              <TrendingDown className="w-3 h-3 md:w-3.5 md:h-3.5" />
              <span>8% vs last {period}</span>
            </div>
            <div className="text-xs text-slate-500">
              Avg {avgUsage} kWh
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-[24px] md:rounded-[32px] p-5 md:p-6 border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <h3 className="font-bold text-base md:text-lg text-slate-900 tracking-tight">
            Usage Analysis
          </h3>
          <div className="flex p-1 bg-slate-100 rounded-xl md:rounded-2xl w-full sm:w-auto">
            {(["day", "week", "month"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`flex-1 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${period === p
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="h-56 md:h-64 w-full">
          <AnimatePresence mode="wait">
            {!isLoading && (
              <motion.div
                key={period}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="barGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                        <stop
                          offset="100%"
                          stopColor="#60a5fa"
                          stopOpacity={0.8}
                        />
                      </linearGradient>
                      <linearGradient
                        id="barGradientInactive"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#e2e8f0" stopOpacity={1} />
                        <stop
                          offset="100%"
                          stopColor="#f1f5f9"
                          stopOpacity={0.8}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="timestamp"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
                      tickFormatter={formatXAxis}
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip
                      cursor={{ fill: "#f8fafc", radius: 12 }}
                      content={({ active, payload }) => {
                        if (active && payload?.length) {
                          return (
                            <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-800">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                                {format(
                                  parseISO(payload[0].payload.timestamp),
                                  "PPP p",
                                )}
                              </p>
                              <p className="text-sm font-bold">
                                {payload[0].value.toFixed(2)} kWh
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="value"
                      radius={[6, 6, 6, 6]}
                      animationDuration={1000}
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={entry.timestamp}
                          fill={
                            index === data.length - 1
                              ? "url(#barGradient)"
                              : "url(#barGradientInactive)"
                          }
                          className="hover:fill-blue-400 transition-colors duration-300"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-400 mb-1">Peak hour</p>
            <p className="text-sm font-semibold text-slate-900">14:00 – 15:00</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-400 mb-1">Efficiency</p>
            <p className="text-sm font-semibold text-emerald-600">+12.4%</p>
          </div>
        </div>
      </section>
    </div>
  );
}
