import { ArrowDownUp, History, Search, SlidersHorizontal, X } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { TransactionSkeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { HistorySummary } from '../components/HistorySummary';
import { TransactionRow } from '../components/TransactionRow';
import type { FilterStatus, FilterType, SortField } from '../hooks/useHistory';
import { useHistory } from '../hooks/useHistory';

const TYPE_FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Credit', value: 'credit' },
  { label: 'Debit', value: 'debit' },
];

const STATUS_FILTERS: { label: string; value: FilterStatus }[] = [
  { label: 'Any status', value: 'all' },
  { label: 'Settled', value: 'Settled' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Failed', value: 'Failed' },
];

const SORT_OPTIONS: { label: string; value: SortField }[] = [
  { label: 'Newest first', value: 'date-desc' },
  { label: 'Oldest first', value: 'date-asc' },
  { label: 'Highest amount', value: 'amount-desc' },
  { label: 'Lowest amount', value: 'amount-asc' },
];

export function HistoryView() {
  const {
    transactions,
    filteredTransactions,
    isLoading,
    weeklySpent,
    weeklyRecharged,
    chartData,
    efficiencyScore,
    search,
    setSearch,
    sortBy,
    setSortBy,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
  } = useHistory();

  const hasActiveFilters =
    search.trim() !== '' || filterType !== 'all' || filterStatus !== 'all' || sortBy !== 'date-desc';

  function clearFilters() {
    setSearch('');
    setFilterType('all');
    setFilterStatus('all');
    setSortBy('date-desc');
  }

  return (
    <div className="space-y-6 md:space-y-8 pt-4 lg:pt-6">
      <HistorySummary
        weeklySpent={weeklySpent}
        weeklyRecharged={weeklyRecharged}
        efficiencyScore={efficiencyScore}
        chartData={chartData}
        isLoading={isLoading}
      />

      <section>
        <div className="mb-3 px-1 flex items-center justify-between gap-3">
          <h2 className="font-bold text-lg md:text-xl text-foreground tracking-tight flex items-center gap-2">
            Transactions
            {!isLoading && transactions.length > 0 && (
              <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {filteredTransactions.length}/{transactions.length}
              </span>
            )}
          </h2>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-3" />
              Clear
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-3 mb-4">
          <Input
            placeholder="Search transactions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="size-4" />}
            className="py-3 text-sm"
          />

          <div className="flex gap-2 flex-wrap items-center">
            {/* Type filter chips */}
            <div className="flex p-1 bg-muted rounded-2xl gap-0.5">
              {TYPE_FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilterType(f.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                    filterType === f.value
                      ? 'bg-card text-foreground shadow-sm border border-border'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Status filter */}
            <div className="relative flex items-center">
              <SlidersHorizontal className="absolute left-3 size-3.5 text-muted-foreground pointer-events-none" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className={cn(
                  'pl-8 pr-3 py-2 rounded-2xl text-xs font-semibold bg-muted border border-transparent transition-all outline-none appearance-none cursor-pointer',
                  'focus:ring-2 focus:ring-ring',
                  filterStatus !== 'all' ? 'text-foreground border-border bg-card shadow-sm' : 'text-muted-foreground',
                )}
              >
                {STATUS_FILTERS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative flex items-center ml-auto">
              <ArrowDownUp className="absolute left-3 size-3.5 text-muted-foreground pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortField)}
                className={cn(
                  'pl-8 pr-3 py-2 rounded-2xl text-xs font-semibold bg-muted border border-transparent transition-all outline-none appearance-none cursor-pointer',
                  'focus:ring-2 focus:ring-ring',
                  sortBy !== 'date-desc' ? 'text-foreground border-border bg-card shadow-sm' : 'text-muted-foreground',
                )}
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm">
          {isLoading ? (
            <div className="divide-y divide-border/50">
              {Array.from({ length: 5 }, (_, i) => <TransactionSkeleton key={i} />)}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <EmptyState
              icon={History}
              title={hasActiveFilters ? 'No matching transactions' : 'No transactions yet'}
              description={
                hasActiveFilters
                  ? 'Try adjusting your search or filters.'
                  : 'Your transaction history will appear here once activity is recorded.'
              }
              action={hasActiveFilters ? { label: 'Clear filters', onClick: clearFilters } : undefined}
              variant="plain"
              className="py-16"
            />
          ) : (
            <ol className="list-none p-0">
              {filteredTransactions.map((tx, i) => {
                const rowKey = String(tx.orderId ?? tx.transactionDate ?? i);
                return <TransactionRow key={rowKey} tx={tx} />;
              })}
            </ol>
          )}
        </div>
      </section>
    </div>
  );
}
