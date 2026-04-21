import { History } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { TransactionSkeleton } from '@/components/ui/skeleton';
import { HistorySummary } from '../components/HistorySummary';
import { TransactionRow } from '../components/TransactionRow';
import { useHistory } from '../hooks/useHistory';

export function HistoryView() {
  const { transactions, isLoading, weeklySpent, weeklyRecharged, chartData, efficiencyScore } = useHistory();

  return (
    <div className="space-y-6 md:space-y-8 pt-4 lg:pt-6">
      <HistorySummary
        weeklySpent={weeklySpent}
        weeklyRecharged={weeklyRecharged}
        efficiencyScore={efficiencyScore}
        chartData={chartData}
        isLoading={isLoading}
      />

      {/* Transaction list */}
      <section>
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="font-bold text-lg md:text-xl text-foreground tracking-tight">Recent activity</h2>
          <button type="button" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">View all</button>
        </div>
        <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm">
          {isLoading ? (
            <div className="divide-y divide-border/50">{Array.from({ length: 5 }, (_, i) => <TransactionSkeleton key={i} />)}</div>
          ) : transactions.length === 0 ? (
            <EmptyState icon={History} title="No transactions yet" description="Your transaction history will appear here once activity is recorded." variant="plain" className="py-16" />
          ) : (
            <ol className="list-none p-0">
              {transactions.map((tx, i) => (
                <TransactionRow key={String(tx.orderId ?? tx.transactionDate ?? i)} tx={tx} />
              ))}
            </ol>
          )}
        </div>
      </section>
    </div>
  );
}
