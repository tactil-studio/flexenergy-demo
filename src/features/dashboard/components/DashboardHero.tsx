import { Clock, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { motion } from "motion/react";
import { StatChip } from "@/components/ui/stat-chip";
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
  const TrendIcon = trend <= 0 ? TrendingDown : TrendingUp;
  const trendVariant = trend <= 0 ? "success" : "warning";

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="pb-2"
    >
      <p className="text-sm font-semibold text-muted-foreground mb-3">
        Good {timeOfDay}{firstName ? `, ${firstName}` : ""}
      </p>

      {/* Balance + sparkline */}
      <div className="flex items-end justify-between gap-4 mb-4">
        <p className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl tracking-tight text-foreground tabular-nums leading-none">
          {totalBalanceFormatted}
        </p>
        {!chartLoading && <MiniSparkline data={chartData} />}
      </div>

      {/* Stat chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <StatChip variant="muted">
          <Zap className="size-3" />
          {consume.toFixed(1)} kWh
        </StatChip>

        {!chartLoading && chartData.length > 1 && (
          <StatChip variant={trendVariant}>
            <TrendIcon className="size-3" />
            {Math.abs(trend).toFixed(1)} kWh this week
          </StatChip>
        )}

        {firstDaysLeft != null && (
          <StatChip variant={firstDaysLeft <= 7 ? "warning" : "muted"}>
            <Clock className="size-3" />
            {firstDaysLeft}d left
          </StatChip>
        )}
      </div>
    </motion.section>
  );
}
