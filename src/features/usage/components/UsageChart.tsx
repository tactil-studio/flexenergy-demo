import { format, parseISO } from "date-fns";
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

const BLUE_SOLID = "oklch(0.53 0.195 258)";
const BLUE_MUTED = "oklch(0.9 0.012 258)";

interface UsageChartProps {
  data: { timestamp: string; value: number }[];
  period: string;
  peakLabel: string;
  formatXAxis: (value: string) => string;
}

export function UsageChart({
  data,
  period,
  peakLabel,
  formatXAxis,
}: UsageChartProps) {
  return (
    <>
      <div className="h-56 md:h-64 lg:h-80 w-full">
        <AnimatePresence mode="wait">
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
                <XAxis
                  dataKey="timestamp"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "oklch(0.555 0.018 258)",
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                  tickFormatter={formatXAxis}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: "oklch(0.945 0.008 258)", radius: 12 }}
                  content={({ active, payload }) => {
                    if (active && payload?.length) {
                      return (
                        <div className="bg-foreground text-background p-3 rounded-2xl shadow-xl">
                          <p className="text-[10px] text-background/50 mb-1">
                            {format(
                              parseISO(payload[0].payload.timestamp),
                              "PPP p",
                            )}
                          </p>
                          <p className="text-sm font-semibold">
                            {(payload[0].value as number).toFixed(2)} kWh
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
                  animationDuration={800}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={entry.timestamp}
                      fill={index === data.length - 1 ? BLUE_SOLID : BLUE_MUTED}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 bg-muted/50 rounded-2xl border border-border">
          <dt className="text-xs text-muted-foreground mb-1">
            {period === "day"
              ? "Peak hour"
              : period === "week"
                ? "Peak day"
                : "Peak period"}
          </dt>
          <dd className="text-sm font-semibold text-foreground">{peakLabel}</dd>
        </div>
        <div className="p-4 bg-muted/50 rounded-2xl border border-border">
          <dt className="text-xs text-muted-foreground mb-1">Data points</dt>
          <dd className="text-sm font-semibold text-foreground">{data.length}</dd>
        </div>
      </dl>
    </>
  );
}
