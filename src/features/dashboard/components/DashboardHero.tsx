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

export function DashboardHero({
  totalBalanceFormatted,
  consume,
  chartData,
  chartLoading,
  trend,
  firstName,
  firstDaysLeft,
}: DashboardHeroProps) {
  const isPositiveTrend = trend > 0;
  const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden bg-foreground -mx-4 lg:-mx-10"
    >
      {/* Background video */}
      <video
        aria-hidden="true"
        autoPlay
        loop
        muted
        playsInline
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-60"
        src="/5145-183300148.mp4"
      />
      {/* Gradient overlay — dark at top/bottom, lighter in the middle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/30 to-foreground/80"
      />

      {/* Content */}
      <div className="relative z-10 px-6 md:px-10 lg:px-10 pt-28 pb-8 md:pt-32 md:pb-16 flex flex-col items-center text-center">

        {/* Balance */}
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-2">Total balance</p>
        <p className="font-heading font-bold text-4xl md:text-6xl tracking-tight text-white tabular-nums leading-none mb-16">
          {totalBalanceFormatted}
        </p>

        {/* Stat pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 backdrop-blur-sm text-white/80 border border-white/10">
            <Zap className="size-3" />
            {consume.toFixed(1)} kWh
          </span>

          {!chartLoading && chartData.length > 1 && (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-sm border ${isPositiveTrend
                  ? "bg-warning/20 text-warning border-warning/20"
                  : "bg-success/20 text-success border-success/20"
                }`}
            >
              <TrendIcon className="size-3" />
              {Math.abs(trend).toFixed(1)} kWh this week
            </span>
          )}

          {firstDaysLeft != null && (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-sm border ${firstDaysLeft <= 7
                  ? "bg-warning/20 text-warning border-warning/20"
                  : "bg-white/10 text-white/80 border-white/10"
                }`}
            >
              <Clock className="size-3" />
              {firstDaysLeft}d left
            </span>
          )}
        </div>
      </div>
    </motion.section>
  );
}
