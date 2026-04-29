import { Clock, TrendingDown, Zap } from "lucide-react";
import { motion } from "motion/react";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fromMinorUnits } from "@/types";
import type { ContractSummary } from "../hooks/useDashboard";
import { TariffDrawer } from "./TariffDrawer";

interface ContractCardProps {
  c: ContractSummary;
  onRecharge: () => void;
}

export function ContractCard({ c, onRecharge }: ContractCardProps) {
  const pct = Math.min(100, Math.max(0, c.balancePercent ?? 100));
  const contractLabel = c.buContractId ? `${c.buContractId}` : `#${c.contractId}`;
  const balanceDecimal = fromMinorUnits(c.balanceRaw, c.scale);
  const isHighBalance = !c.isLowBalance && balanceDecimal > 20;

  const barColor = pct > 40 ? "bg-primary" : pct > 15 ? "bg-warning" : "bg-destructive";

  return (
    <TariffDrawer contractLabel={contractLabel}>
      <motion.article
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className={cn(
          "relative bg-card rounded-3xl overflow-hidden flex flex-col ring-1 cursor-pointer transition-all hover:shadow-md hover:ring-primary/30",
          c.isLowBalance ? "ring-warning/40" : "ring-border",
        )}
      >
        {/* ── Alert strip ──────────────────────────────── */}
        {c.isLowBalance && (
          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.3 }}
            role="alert"
            className="flex items-center gap-2 px-5 py-2.5 bg-warning/8 border-b border-warning/15"
          >
            <span className="text-xs font-semibold text-warning">{c.depletionLabel}</span>
          </motion.div>
        )}

        {/* ── Header: ID + status ──────────────────────── */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: -8 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={cn(
            "flex items-center justify-between gap-2 px-5 pt-4 pb-3",
            c.isLowBalance ? "bg-warning/6" : "bg-muted/40",
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className={cn(
              "w-7 h-7 rounded-xl flex items-center justify-center shrink-0",
              c.isLowBalance ? "bg-warning/15" : "bg-primary/10",
            )}>
              <Zap className={cn("size-3.5", c.isLowBalance ? "text-warning" : "text-primary")} />
            </span>
            <p className="text-xs font-semibold text-foreground/60 truncate">{contractLabel}</p>
          </div>
          <StatusBadge status={c.serviceStatus} />
        </motion.div>

        {/* ── Body ──────────────────────────────────────── */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col flex-1 px-5 pt-4 pb-5 gap-4"
        >
          {c.isLowBalance ? (
            /* ── Low-balance state: illustration alongside info ── */
            <div className="flex items-end gap-2">
              <div className="flex-1 flex flex-col gap-3 min-w-0">
                {/* Balance + days */}
                <div className="flex items-end justify-between gap-4">
                  <p className="font-bold text-2xl tracking-tight text-foreground tabular-nums leading-none">
                    {c.balanceFormatted}
                  </p>
                  {c.daysLeft !== null && (
                    <span className={cn(
                      "inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0",
                      c.daysLeft <= 3 ? "bg-destructive/10 text-destructive" :
                      c.daysLeft <= 7 ? "bg-warning/10 text-warning" :
                      "bg-muted text-muted-foreground",
                    )}>
                      <Clock className="size-3" />
                      {c.daysLeft}d left
                    </span>
                  )}
                </div>
                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700", barColor)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground tabular-nums">{pct.toFixed(0)}% remaining</p>
                </div>
              </div>
              {/* Illustration */}
              <img
                src="/Low battery-pana.svg"
                alt="Low battery"
                className="w-32 h-32 shrink-0 object-contain select-none pointer-events-none"
                draggable={false}
              />
            </div>
          ) : isHighBalance ? (
            /* ── High-balance state: sun energy illustration alongside info ── */
            <div className="flex items-end gap-2">
              <div className="flex-1 flex flex-col gap-3 min-w-0">
                {/* Balance + days */}
                <div className="flex items-end justify-between gap-4">
                  <p className="font-bold text-2xl tracking-tight text-foreground tabular-nums leading-none">
                    {c.balanceFormatted}
                  </p>
                  {c.daysLeft !== null && (
                    <span className={cn(
                      "inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0",
                      "bg-muted text-muted-foreground",
                    )}>
                      <Clock className="size-3" />
                      {c.daysLeft}d left
                    </span>
                  )}
                </div>
                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700", barColor)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground tabular-nums">{pct.toFixed(0)}% remaining</p>
                </div>
              </div>
              {/* Illustration */}
              <img
                src="/Sun energy-bro.svg"
                alt="Good balance"
                className="w-32 h-32 shrink-0 object-contain select-none pointer-events-none"
                draggable={false}
              />
            </div>
          ) : (
            /* ── Normal state ── */
            <>
              {/* Balance + days */}
              <div className="flex items-end justify-between gap-4">
                <p className="font-bold text-4xl tracking-tight text-foreground tabular-nums leading-none">
                  {c.balanceFormatted}
                </p>
                {c.daysLeft !== null && (
                  <span className={cn(
                    "inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0",
                    c.daysLeft <= 3 ? "bg-destructive/10 text-destructive" :
                    c.daysLeft <= 7 ? "bg-warning/10 text-warning" :
                    "bg-muted text-muted-foreground",
                  )}>
                    <Clock className="size-3" />
                    {c.daysLeft}d left
                  </span>
                )}
              </div>
              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", barColor)}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground tabular-nums">{pct.toFixed(0)}% remaining</p>
              </div>
            </>
          )}

          {/* ── Footer row: stat + top up ─────────────── */}
          <div className="flex items-center gap-4 border-t border-border pt-4 mt-auto">
            {/* Daily avg stat */}
            <div className="flex-1 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <TrendingDown className="size-3.5 text-muted-foreground" />
              </span>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Daily avg</p>
                <p className="text-sm font-bold text-foreground tabular-nums leading-tight">{c.avgCostFormatted}</p>
              </div>
            </div>

            {/* Top up button — centered and prominent */}
            {c.isLowBalance && (
              <Button
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onRecharge();
                }}
                className="gap-1.5"
              >
                <Zap className="size-4" />
                Top up
              </Button>
            )}
          </div>
        </motion.div>
      </motion.article>
    </TariffDrawer>
  );
}
