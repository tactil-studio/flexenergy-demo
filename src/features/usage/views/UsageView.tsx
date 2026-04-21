import { format, parseISO } from 'date-fns';
import { BarChart3, Euro, TrendingDown, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { EmptyState } from '@/components/ui/empty-state';
import { ChartSkeleton, StatsSkeleton } from '@/components/ui/skeleton';
import { useUsage } from '../hooks/useUsage';

const BLUE_SOLID = 'oklch(0.530 0.195 258)';
const BLUE_MUTED = 'oklch(0.900 0.012 258)';

export function UsageView() {
  const { period, setPeriod, mode, setMode, data, isLoading, totalUsage, avgUsage, peakLabel, formatXAxis } = useUsage();
  const isCost = mode === 'cost';
  const unit = isCost ? 'CHF' : 'kWh';

  return (
    <main className="space-y-4 md:space-y-6 pt-4 lg:pt-6">
      {/* Stat strip */}
      <section className="bg-card rounded-3xl border border-border shadow-sm p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1">
              {isCost ? 'Total cost' : 'Total consumption'} &middot; {period}
            </p>
            <div className="flex items-baseline gap-2">
              {isCost && <span className="text-lg font-semibold text-muted-foreground">CHF</span>}
              <span className="font-heading font-bold text-4xl md:text-5xl tracking-tight text-foreground tabular-nums">
                {totalUsage}
              </span>
              {!isCost && <span className="text-lg font-semibold text-muted-foreground">kWh</span>}
            </div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
              <TrendingDown className="size-3.5" aria-hidden="true" />
              Avg {avgUsage} {unit} per period
            </p>
          </div>
          <div className="flex flex-col gap-2 self-start">
            {/* Mode toggle */}
            <div className="flex p-1 bg-muted rounded-2xl">
              <button
                type="button"
                onClick={() => setMode('kwh')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${!isCost ? 'bg-card text-foreground shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Zap className="size-3" aria-hidden="true" />
                kWh
              </button>
              <button
                type="button"
                onClick={() => setMode('cost')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isCost ? 'bg-card text-foreground shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Euro className="size-3" aria-hidden="true" />
                Cost
              </button>
            </div>
            {/* Period toggle */}
            <div className="flex p-1 bg-muted rounded-2xl">
              {(['day', 'week', 'month'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${period === p ? 'bg-card text-foreground shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chart card */}
      <section className="bg-card rounded-3xl md:rounded-[32px] p-5 md:p-6 lg:p-8 border border-border shadow-sm">
        <h3 className="font-bold text-base md:text-lg text-foreground tracking-tight mb-6">
          Usage Analysis
        </h3>

        {isLoading ? (
          <div className="space-y-4">
            <ChartSkeleton height="h-56 md:h-64 lg:h-80" />
            <StatsSkeleton />
          </div>
        ) : data.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title="No usage data available"
            description="There is no consumption data for this period. Try a different time range or check back later."
            variant="plain"
          />
        ) : (
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
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis
                        dataKey="timestamp"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'oklch(0.555 0.018 258)', fontSize: 10, fontWeight: 600 }}
                        tickFormatter={formatXAxis}
                        dy={10}
                      />
                      <YAxis hide />
                      <Tooltip
                        cursor={{ fill: 'oklch(0.945 0.008 258)', radius: 12 }}
                        content={({ active, payload }) => {
                          if (active && payload?.length) {
                            return (
                              <div className="bg-foreground text-background p-3 rounded-2xl shadow-xl">
                                <p className="text-[10px] text-background/50 mb-1">
                                  {format(parseISO(payload[0].payload.timestamp), 'PPP p')}
                                </p>
                                <p className="text-sm font-semibold">{isCost ? 'CHF ' : ''}{(payload[0].value as number).toFixed(2)}{!isCost ? ' kWh' : ''}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 6, 6]} animationDuration={800}>
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
                  {period === 'day' ? 'Peak hour' : period === 'week' ? 'Peak day' : 'Peak period'}
                </dt>
                <dd className="text-sm font-semibold text-foreground">{peakLabel}</dd>
              </div>
              <div className="p-4 bg-muted/50 rounded-2xl border border-border">
                <dt className="text-xs text-muted-foreground mb-1">Data points</dt>
                <dd className="text-sm font-semibold text-foreground">{data.length}</dd>
              </div>
            </dl>
          </>
        )}
      </section>
    </main>
  );
}
