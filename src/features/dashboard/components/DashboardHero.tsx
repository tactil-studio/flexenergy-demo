import { Clock, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { motion } from "motion/react";
import { MiniSparkline } from "./MiniSparkline";

interface DashboardHeroProps {
  totalBalanceFormatted: string;
  consume: number;
  chartData: { value: number }[];
  chartLoading: boolean;
  trend: number;
  firstName?: string;
  firstDaysLeft: number | null | undefined;
}

function getGreeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
}

export function DashboardHero({
  totalBalanceFormatted,
  consume,
  chartData,
  chartLoading,
  trend,
  firstName,
  firstDaysLeft,
}: DashboardHeroProps) {
  const timeOfDay = getGreeting();
  const isPositiveTrend = trend > 0;
  const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden rounded-3xl bg-foreground p-6 md:p-8 shadow-2xl"
    >
      {/* Subtle radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-primary/20 blur-3xl"
      />

      {/* Top row: greeting + sparkline */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <p className="text-sm font-semibold text-white/50">
          Good {timeOfDay}{firstName ? `, ${firstName}` : ""}
        </p>
        {!chartLoading && (
          <div className="w-28 h-12 shrink-0 opacity-80">
            <MiniSparkline data={chartData} />
          </div>
        )}
      </div>

      {/* Balance */}
      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-1">
        Total balance
      </p>
      <p className="font-heading font-bold text-5xl md:text-6xl tracking-tight text-white tabular-nums leading-none mb-6">
        {totalBalanceFormatted}
      </p>

      {/* Stat pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 text-white/70">
          <Zap className="size-3" />
          {consume.toFixed(1)} kWh
        </span>

        {!chartLoading && chartData.length > 1 && (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${isPositiveTrend
                ? "bg-warning/20 text-warning"
                : "bg-success/20 text-success"
              }`}
          >
            <TrendIcon className="size-3" />
            {Math.abs(trend).toFixed(1)} kWh this week
          </span>
        )}

        {firstDaysLeft != null && (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${firstDaysLeft <= 7
                ? "bg-warning/20 text-warning"
                : "bg-white/10 text-white/70"
              }`}
          >
            <Clock className="size-3" />
            {firstDaysLeft}d left
          </span>
        )}
      </div>
    </motion.section>
  );
}
