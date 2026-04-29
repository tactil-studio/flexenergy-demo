import { format, parseISO } from "date-fns";
import { BarChart2, ChevronRight } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { MeasureData } from "@/types";

const BAR_PEAK = "oklch(0.53 0.195 258)";
const BAR_REST = "oklch(0.9 0.012 258)";

interface DashboardUsagePreviewProps {
  data: MeasureData[];
  isLoading: boolean;
  onViewUsage: () => void;
}

function formatTick(v: string) {
  try {
    return format(parseISO(v), "EEE");
  } catch {
    return v;
  }
}

function UsageEmptyState({ onViewUsage }: { onViewUsage: () => void }) {
  return (
    <section className="bg-card rounded-[28px] border border-border shadow-sm p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <div className="flex items-center gap-2">
          <BarChart2 className="size-4 text-primary" aria-hidden="true" />
          <h2 className="font-semibold text-sm md:text-base text-foreground">Usage analysis</h2>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-muted text-muted-foreground">
            This week
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onViewUsage} className="text-xs text-muted-foreground gap-1 pr-1">
          View all <ChevronRight className="size-3.5" />
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center h-28 md:h-36 gap-2 text-center">
        <BarChart2 className="size-6 text-muted-foreground/40" />
        <p className="text-xs text-muted-foreground/70">No usage data for this week</p>
      </div>
    </section>
  );
}

function UsageLoadingSkeleton() {
  return (
    <section className="bg-card rounded-[28px] border border-border shadow-sm p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-28 md:h-36 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-14 rounded-2xl" />
        <Skeleton className="h-14 rounded-2xl" />
      </div>
    </section>
  );
}

export function DashboardUsagePreview({
  data,
  isLoading,
  onViewUsage,
}: DashboardUsagePreviewProps) {
  if (isLoading) return <UsageLoadingSkeleton />;
  if (!data.length) return <UsageEmptyState onViewUsage={onViewUsage} />;

  const peakEntry = data.reduce(
    (max, d) => (d.value > max.value ? d : max),
    data[0],
  );

  const peakLabel = (() => {
    try {
      return format(parseISO(peakEntry.timestamp), "EEEE");
    } catch {
      return "—";
    }
  })();

  const avgValue = data.reduce((s, d) => s + d.value, 0) / data.length;
  // Load factor (avg/peak): higher = more consistent = better efficiency
  const efficiency = Math.round((avgValue / peakEntry.value) * 100);

  const effVariant =
    efficiency >= 70 ? "success" : efficiency >= 40 ? "warning" : "destructive";
  const effLabel =
    efficiency >= 70 ? "Consistent" : efficiency >= 40 ? "Moderate" : "Spiky";

  return (
    <section className="bg-card rounded-[28px] border border-border shadow-sm p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <div className="flex items-center gap-2">
          <BarChart2 className="size-4 text-primary" aria-hidden="true" />
          <h2 className="font-semibold text-sm md:text-base text-foreground">
            Usage analysis
          </h2>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-muted text-muted-foreground">
            This week
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewUsage}
          className="text-xs text-muted-foreground gap-1 pr-1"
        >
          View all
          <ChevronRight className="size-3.5" />
        </Button>
      </div>

      {/* Bar chart */}
      <div className="h-28 md:h-36 w-full mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, left: -32, bottom: 0 }}
          >
            <XAxis
              dataKey="timestamp"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "oklch(0.555 0.018 258)", fontSize: 9, fontWeight: 600 }}
              tickFormatter={formatTick}
              dy={8}
            />
            <Tooltip
              cursor={{ fill: "oklch(0.945 0.008 258)", radius: 8 }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-foreground text-background px-2.5 py-1.5 rounded-xl shadow-xl text-xs font-semibold">
                    {(payload[0].value as number).toFixed(2)} kWh
                  </div>
                );
              }}
            />
            <Bar dataKey="value" radius={[5, 5, 5, 5]} animationDuration={700}>
              {data.map((entry) => (
                <Cell
                  key={entry.timestamp}
                  fill={entry === peakEntry ? BAR_PEAK : BAR_REST}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <dl className="grid grid-cols-2 gap-3">
        <div className="p-3 md:p-4 bg-muted/40 rounded-2xl">
          <dt className="text-[10px] md:text-xs text-muted-foreground mb-1">
            Peak day
          </dt>
          <dd className="text-sm md:text-base font-semibold text-foreground">
            {peakLabel}
          </dd>
        </div>
        <div className="p-3 md:p-4 bg-muted/40 rounded-2xl">
          <dt className="text-[10px] md:text-xs text-muted-foreground mb-1">
            Efficiency
          </dt>
          <dd
            className={cn(
              "text-sm md:text-base font-semibold flex items-baseline gap-1.5",
              effVariant === "success" && "text-success",
              effVariant === "warning" && "text-warning",
              effVariant === "destructive" && "text-destructive",
            )}
          >
            {efficiency}%
            <span className="text-[10px] font-medium opacity-70">{effLabel}</span>
          </dd>
        </div>
      </dl>
    </section>
  );
}
