import { format, parseISO } from 'date-fns';
import { ArrowDownLeft, ArrowUpRight, History, TrendingUp } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton, TransactionSkeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/types';
import { useHistory } from '../hooks/useHistory';

export function HistoryView() {
  const { transactions, isLoading, weeklySpent, weeklyRecharged, chartData, efficiencyScore } = useHistory();
  const net = weeklyRecharged - weeklySpent;

  return (
    <div className="space-y-6 md:space-y-8 pt-4 lg:pt-6">
      {/* Summary strip */}
      <section className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <article className="bg-card rounded-3xl p-5 border border-border shadow-sm">
          <header className="flex items-center gap-2 mb-3">
            <span className="p-1.5 bg-primary/10 rounded-xl" aria-hidden="true">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
            </span>
            <h3 className="font-semibold text-xs text-muted-foreground">This week</h3>
          </header>
          {isLoading ? (
            <div className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></div>
          ) : (
            <dl className="space-y-2">
              <div className="flex justify-between items-center">
                <dt className="text-xs text-muted-foreground">Spent</dt>
                <dd className="text-sm font-bold text-foreground">{formatCurrency(weeklySpent * 100)}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-xs text-muted-foreground">Recharged</dt>
                <dd className="text-sm font-bold text-success">+{formatCurrency(weeklyRecharged * 100)}</dd>
              </div>
              {efficiencyScore !== null && (
                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Settlement</span>
                    <span className="font-semibold text-foreground">{efficiencyScore}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${efficiencyScore}%` }} />
                  </div>
                </div>
              )}
            </dl>
          )}
        </article>

        <article className="bg-card rounded-3xl p-5 border border-border shadow-sm">
          <header className="flex items-center gap-2 mb-3">
            <span className="p-1.5 bg-warning/10 rounded-xl" aria-hidden="true">
              <ArrowUpRight className="w-3.5 h-3.5 text-warning" />
            </span>
            <h3 className="font-semibold text-xs text-muted-foreground">Net balance</h3>
          </header>
          {isLoading ? (
            <Skeleton className="h-8 w-3/4" />
          ) : (
            <>
              <p className={`text-2xl font-bold tracking-tight font-heading ${net >= 0 ? 'text-success' : 'text-destructive'}`}>
                {net >= 0 ? '+' : '-'}{formatCurrency(Math.abs(net * 100))}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Recharged minus spent</p>
            </>
          )}
        </article>

        <article className="hidden lg:block bg-card rounded-3xl p-5 border border-border shadow-sm">
          <header className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-xs text-muted-foreground">Activity trend</h3>
          </header>
          <figure className="h-20 w-full" aria-label="Activity trend chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.530 0.195 258)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="oklch(0.530 0.195 258)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload?.length) {
                      return <div className="bg-foreground text-background p-2 rounded-xl text-[10px] font-semibold shadow-xl">{formatCurrency(Number(payload[0].value) * 100)}</div>;
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="amount" stroke="oklch(0.530 0.195 258)" strokeWidth={2} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </figure>
        </article>
      </section>

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
                <li key={tx.orderId ?? tx.transactionDate ?? i} className="p-4 md:p-5 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                  <article className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className={`w-10 h-10 rounded-2xl flex items-center justify-center ${tx.amountMinor > 0 ? 'bg-success/10' : 'bg-primary/10'}`} aria-hidden="true">
                        {tx.amountMinor > 0
                          ? <ArrowDownLeft className="w-5 h-5 text-success" />
                          : <ArrowUpRight className="w-5 h-5 text-primary" />}
                      </span>
                      <div>
                        <h3 className="font-semibold text-sm text-foreground capitalize">{tx.description}</h3>
                        <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
                          <time dateTime={tx.transactionDate}>{format(parseISO(tx.transactionDate), 'MMM dd, yyyy')}</time>
                          <span aria-hidden="true">&middot;</span>
                          <span>{tx.transactionSource}</span>
                        </p>
                      </div>
                    </div>
                    <dl className="text-right">
                      <dt className="sr-only">Amount</dt>
                      <dd className={`font-bold text-base tracking-tight ${tx.amountMinor > 0 ? 'text-success' : 'text-foreground'}`}>
                        {tx.amountMinor > 0 ? '+' : '-'}{formatCurrency(Math.abs(tx.amountMinor), tx.currency, tx.scale)}
                      </dd>
                      <dt className="sr-only">Status</dt>
                      <dd className={`text-[10px] ${tx.transactionStatus === 'Settled' ? 'text-muted-foreground' : tx.transactionStatus === 'Failed' ? 'text-destructive' : 'text-warning'}`}>
                        {tx.transactionStatus}
                      </dd>
                    </dl>
                  </article>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </div>
  );
}
