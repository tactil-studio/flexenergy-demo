import {
  AlertTriangle,
  BarChart3,
  Clock,
  FileText,
  Settings,
  TrendingDown,
  TrendingUp,
  Wifi,
  WifiOff,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { EmptyState } from '@/components/ui/empty-state';
import { ContractCardSkeleton, HeroSkeleton } from '@/components/ui/skeleton';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import type { ContractSummary } from '../hooks/useDashboard';
import { useDashboard } from '../hooks/useDashboard';
import { useDashboardChart } from '../hooks/useDashboardChart';

// ── Radial ring progress ────────────────────────────────────────────────────
function RadialRing({ percent, isLow }: { percent: number; isLow: boolean }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(100, Math.max(0, percent)) / 100) * circ;
  const stroke = percent > 30 ? '#22c55e' : isLow ? '#ef4444' : '#f59e0b';
  return (
    <svg width={56} height={56} viewBox="0 0 56 56" aria-hidden="true">
      <circle cx="28" cy="28" r={r} fill="none" stroke="currentColor" strokeWidth="4" className="text-muted/40" />
      <circle
        cx="28" cy="28" r={r} fill="none"
        stroke={stroke} strokeWidth="4" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        transform="rotate(-90 28 28)"
        style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)' }}
      />
      <text x="28" y="33" textAnchor="middle" fontSize="11" fontWeight="800" fill={stroke}>{Math.round(percent)}%</text>
    </svg>
  );
}

// ── Tiny sparkline ──────────────────────────────────────────────────────────
function MiniSparkline({ data }: { data: { value: number }[] }) {
  if (data.length < 2) return null;
  return (
    <div className="w-24 h-10" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.530 0.195 258)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="oklch(0.530 0.195 258)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="value" stroke="oklch(0.530 0.195 258)" strokeWidth={2} fill="url(#sparkGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Status badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'Active';
  const isWarning = status === 'Warning' || status === 'Grace';
  const cls = isActive ? 'bg-success/10 text-success' : isWarning ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive';
  const dot = isActive ? 'bg-success' : isWarning ? 'bg-warning' : 'bg-destructive';
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

// ── Contract card ────────────────────────────────────────────────────────────
function ContractCard({ c, onRecharge }: { c: ContractSummary; onRecharge: () => void }) {
  const balancePercent = c.balancePercent ?? 100;
  return (
    <article className={`bg-card rounded-[28px] border shadow-sm overflow-hidden ${c.isLowBalance ? 'border-warning/40' : 'border-border'}`}>
      {c.isLowBalance && (
        <p role="alert" className="bg-warning/8 border-b border-warning/20 px-5 py-2.5 flex items-center gap-2 text-xs font-semibold text-warning">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {c.depletionLabel}
        </p>
      )}
      <div className="p-5">
        {/* Top row: ring + balance + status */}
        <div className="flex items-start gap-4 mb-4">
          <RadialRing percent={balancePercent} isLow={c.isLowBalance} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-[11px] text-muted-foreground">
                {c.buContractId ? `Contract · ${c.buContractId}` : `Contract #${c.contractId}`}
              </p>
              <StatusBadge status={c.serviceStatus} />
            </div>
            <p className="font-heading font-bold text-2xl tracking-tight text-foreground tabular-nums">{c.balanceFormatted}</p>
          </div>
        </div>

        {/* Days remaining pill */}
        {c.daysLeft !== null && (
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold mb-4 ${c.daysLeft <= 3 ? 'bg-destructive/10 text-destructive' : c.daysLeft <= 7 ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'}`}>
            <Clock className="size-3" />
            {c.daysLeft} day{c.daysLeft !== 1 ? 's' : ''} remaining
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
          <div>
            <p className="text-[10px] text-muted-foreground mb-0.5">Daily avg</p>
            <p className="text-sm font-bold text-foreground">{c.avgCostFormatted}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground mb-0.5">Forecast</p>
            <p className="text-sm font-bold text-foreground">{c.forecastFormatted}</p>
          </div>
        </div>

        {c.isLowBalance && (
          <button
            type="button" onClick={onRecharge}
            className="mt-4 w-full py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            Top up now
          </button>
        )}
      </div>
    </article>
  );
}

// ── Main view ────────────────────────────────────────────────────────────────
export function DashboardView() {
  const { totalBalanceFormatted, contracts, consume, isLoading } = useDashboard();
  const { data: chartData, isLoading: chartLoading, trend } = useDashboardChart();
  const { setView, state } = useApp();
  const { user } = useAuth();
  const meterState = state?.meterState ?? null;

  const TrendIcon = trend <= 0 ? TrendingDown : TrendingUp;
  const trendColor = trend <= 0 ? 'text-success' : 'text-warning';
  const trendBg = trend <= 0 ? 'bg-success/10' : 'bg-warning/10';
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  const firstDaysLeft = contracts[0]?.daysLeft;

  return (
    <div className="space-y-5 md:space-y-6 pt-4 lg:pt-6">

      {/* ── Hero ── */}
      {isLoading ? <HeroSkeleton /> : (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="pb-2"
        >
          <p className="text-sm font-semibold text-muted-foreground mb-3">
            Good {timeOfDay}{user?.firstName ? `, ${user.firstName}` : ''}
          </p>

          {/* Balance + sparkline side-by-side */}
          <div className="flex items-end justify-between gap-4 mb-4">
            <p className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl tracking-tight text-foreground tabular-nums leading-none">
              {totalBalanceFormatted}
            </p>
            {!chartLoading && <MiniSparkline data={chartData} />}
          </div>

          {/* Stat chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-muted text-muted-foreground px-3 py-1.5 rounded-xl text-xs font-semibold">
              <Zap className="size-3" />
              {consume.toFixed(1)} kWh
            </span>
            {!chartLoading && chartData.length > 1 && (
              <span className={`inline-flex items-center gap-1.5 ${trendBg} ${trendColor} px-3 py-1.5 rounded-xl text-xs font-bold`}>
                <TrendIcon className="size-3" />
                {Math.abs(trend).toFixed(1)} kWh this week
              </span>
            )}
            {firstDaysLeft !== null && firstDaysLeft !== undefined && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${firstDaysLeft <= 7 ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'}`}>
                <Clock className="size-3" />
                {firstDaysLeft}d left
              </span>
            )}
            {meterState !== null && (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${meterState === 'Online' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}
                title={`Meter: ${meterState}`}
              >
                {meterState === 'Online' ? <Wifi className="size-3" /> : <WifiOff className="size-3" />}
                Meter {meterState}
              </span>
            )}
          </div>
        </motion.section>
      )}

      {/* ── Quick actions ── */}
      <motion.nav
        aria-label="Quick actions"
        className="grid xs:grid-cols-2 lg:grid-cols-4 gap-3"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
      >
        {/* Primary CTA */}
        <button
          type="button" onClick={() => setView('usage')}
          className="flex max-md:flex-col items-start gap-2 bg-primary border text-background border-border rounded-2xl px-4 py-3.5 hover:bg-muted/40 active:scale-[0.98] transition-all"
        >
          <span className="size-8 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap className="size-4" />
          </span>
          <div className="flex items-center justify-between gap-4 w-full">

            <span className="text-sm font-semibold">Top up</span>
            <span className="text-xs opacity-70">Recharge &rarr;</span>

          </div>
        </button>

        <button
          type="button" onClick={() => setView('usage')}
          className="flex flex-col items-start gap-2 bg-card border border-border rounded-2xl px-4 py-3.5 hover:bg-muted/40 active:scale-[0.98] transition-all"
        >
          <span className="size-8 bg-primary/10 rounded-xl flex items-center justify-center">
            <BarChart3 className="size-4 text-primary" />
          </span>
          <span className="text-sm font-semibold text-foreground">Usage</span>
        </button>


        <button
          type="button" onClick={() => setView('history')}
          className="flex flex-col items-start gap-2 bg-card border border-border rounded-2xl px-4 py-3.5 hover:bg-muted/40 active:scale-[0.98] transition-all"
        >
          <span className="size-8 bg-muted rounded-xl flex items-center justify-center">
            <Clock className="size-4 text-primary" />
          </span>
          <span className="text-sm font-semibold text-foreground">History</span>
        </button>
        <button
          type="button" onClick={() => setView('settings')}
          className="flex flex-col items-start gap-2 bg-card border border-border rounded-2xl px-4 py-3.5 hover:bg-muted/40 active:scale-[0.98] transition-all"
        >
          <span className="size-8 bg-primary/10 rounded-xl flex items-center justify-center">
            <Settings className="size-4 text-primary" />
          </span>
          <span className="text-sm font-semibold text-foreground">Settings</span>
        </button>

      </motion.nav>

      {/* ── Contract cards ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <ContractCardSkeleton /><ContractCardSkeleton />
        </div>
      ) : contracts.length > 0 ? (
        <motion.ul
          className={`list-none p-0 ${contracts.length > 1 ? 'grid grid-cols-1 xl:grid-cols-2 gap-4' : ''}`}
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {contracts.map((c) => (
            <motion.li
              key={c.contractId}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <ContractCard c={c} onRecharge={() => setView('recharge')} />
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <EmptyState icon={FileText} title="No contracts found" description="There are no active contracts associated with your account." />
      )}
    </div>
  );
}
