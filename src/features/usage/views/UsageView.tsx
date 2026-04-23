import { BarChart3, ChevronDown, Euro, TrendingDown, Zap } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { PeriodToggle } from '@/components/ui/period-toggle';
import { ChartSkeleton, StatsSkeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { UsageChart } from '../components/UsageChart';
import { useUsage } from '../hooks/useUsage';

export function UsageView() {
  const {
    period, setPeriod,
    mode, setMode,
    selectedContract, setSelectedContract,
    contracts,
    data, isLoading,
    totalUsage, avgUsage, peakLabel, formatXAxis,
  } = useUsage();
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
          <div className="flex flex-col gap-2 self-start items-start">
            {/* Contract selector */}
            {contracts.length > 1 && (
              <div className="relative flex items-center w-full">
                <ChevronDown className="absolute right-3 size-3.5 text-muted-foreground pointer-events-none" />
                <select
                  value={selectedContract === 'all' ? 'all' : String(selectedContract)}
                  onChange={(e) =>
                    setSelectedContract(e.target.value === 'all' ? 'all' : Number(e.target.value))
                  }
                  className={cn(
                    'w-full pl-3 pr-8 py-2 rounded-2xl text-xs font-semibold bg-muted border border-transparent',
                    'transition-all outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-ring',
                    selectedContract !== 'all' ? 'text-foreground border-border bg-card shadow-sm' : 'text-muted-foreground',
                  )}
                >
                  <option value="all">All contracts</option>
                  {contracts.map((c) => (
                    <option key={c.contractId} value={String(c.contractId)}>{c.label}</option>
                  ))}
                </select>
              </div>
            )}
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
            <PeriodToggle
              options={['day', 'week', 'month'] as const}
              value={period}
              onChange={setPeriod}
            />
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
          <UsageChart
            data={data}
            period={period}
            peakLabel={peakLabel}
            formatXAxis={formatXAxis}
            mode={mode}
          />
        )}
      </section>
    </main>
  );
}
