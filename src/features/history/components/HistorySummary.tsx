import { ArrowUpRight, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { SectionCard } from "@/components/ui/card";
import { IconBox } from "@/components/ui/icon-box";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/types";

const PRIMARY = "oklch(0.53 0.195 258)";

interface HistorySummaryProps {
  weeklySpent: number;
  weeklyRecharged: number;
  efficiencyScore: number | null;
  chartData: { date: string; amount: number }[];
  isLoading: boolean;
}

export function HistorySummary({
  weeklySpent,
  weeklyRecharged,
  efficiencyScore,
  chartData,
  isLoading,
}: HistorySummaryProps) {
  const net = weeklyRecharged - weeklySpent;

  return (
    <section className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {/* This week */}
      <SectionCard className="rounded-3xl p-5">
        <header className="flex items-center gap-2 mb-3">
          <IconBox variant="primary" size="sm">
            <TrendingUp className="size-3.5 text-primary" />
          </IconBox>
          <h3 className="font-semibold text-xs text-muted-foreground">
            This week
          </h3>
        </header>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <dl className="space-y-2">
            <div className="flex justify-between items-center">
              <dt className="text-xs text-muted-foreground">Spent</dt>
              <dd className="text-sm font-bold text-foreground">
                {formatCurrency(weeklySpent * 100)}
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-xs text-muted-foreground">Recharged</dt>
              <dd className="text-sm font-bold text-success">
                +{formatCurrency(weeklyRecharged * 100)}
              </dd>
            </div>
            {efficiencyScore !== null && (
              <div className="pt-2 border-t border-border">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Settlement</span>
                  <span className="font-semibold text-foreground">
                    {efficiencyScore}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${efficiencyScore}%` }}
                  />
                </div>
              </div>
            )}
          </dl>
        )}
      </SectionCard>

      {/* Net balance */}
      <SectionCard className="rounded-3xl p-5">
        <header className="flex items-center gap-2 mb-3">
          <IconBox variant="warning" size="sm">
            <ArrowUpRight className="size-3.5 text-warning" />
          </IconBox>
          <h3 className="font-semibold text-xs text-muted-foreground">
            Net balance
          </h3>
        </header>

        {isLoading ? (
          <Skeleton className="h-8 w-3/4" />
        ) : (
          <>
            <p
              className={`text-2xl font-bold tracking-tight font-heading ${net >= 0 ? "text-success" : "text-destructive"
                }`}
            >
              {net >= 0 ? "+" : "-"}
              {formatCurrency(Math.abs(net * 100))}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Recharged minus spent
            </p>
          </>
        )}
      </SectionCard>

      {/* Activity trend — desktop only */}
      <SectionCard className="hidden lg:block rounded-3xl p-5">
        <header className="mb-3">
          <h3 className="font-semibold text-xs text-muted-foreground">
            Activity trend
          </h3>
        </header>
        <figure className="h-20 w-full" aria-label="Activity trend chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={PRIMARY} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    return (
                      <div className="bg-foreground text-background p-2 rounded-xl text-[10px] font-semibold shadow-xl">
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
                stroke={PRIMARY}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAmt)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </figure>
      </SectionCard>
    </section>
  );
}
