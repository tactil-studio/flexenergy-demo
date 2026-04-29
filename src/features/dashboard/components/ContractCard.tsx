import { AlertTriangle, ChevronRight, Clock, TrendingDown, Zap } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ContractSummary } from "../hooks/useDashboard";
import { TariffDrawer } from "./TariffDrawer";

interface ContractCardProps {
  c: ContractSummary;
  onRecharge: () => void;
}

export function ContractCard({ c, onRecharge }: ContractCardProps) {
  const pct = Math.min(100, Math.max(0, c.balancePercent ?? 100));
  const contractLabel = c.buContractId
    ? `${c.buContractId}`
    : `#${c.contractId}`;

  const barColor =
    pct > 40 ? "bg-primary" : pct > 15 ? "bg-warning" : "bg-destructive";

  return (
    <article
      className={cn(
        "relative bg-card rounded-3xl overflow-hidden flex flex-col ring-1",
        c.isLowBalance ? "ring-warning/30" : "ring-border",
      )}
    >
      {/* Alert strip */}
      {c.isLowBalance && (
        <div role="alert" className="flex items-center gap-2 px-5 py-2.5 bg-warning/8 border-b border-warning/15">
          <AlertTriangle className="size-3.5 shrink-0 text-warning" />
          <span className="text-xs font-semibold text-warning">{c.depletionLabel}</span>
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* ── Header: ID + status ───────────────────────── */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          <p className="text-xs text-muted-foreground truncate">
            {contractLabel}
          </p>
          <StatusBadge status={c.serviceStatus} />
        </div>

        {/* Balance + days */}
        <div className="flex items-end justify-between gap-4">
          <p className="font-bold text-3xl tracking-tight text-foreground tabular-nums leading-none">
            {c.balanceFormatted}
          </p>
          {c.daysLeft !== null && (
            <span className={cn(
              "inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0",
              c.daysLeft <= 3 ? "bg-destructive/10 text-destructive" :
              c.daysLeft <= 7 ? "bg-warning/10 text-warning" :
              "bg-muted text-muted-foreground"
            )}>
              <Clock className="size-3" />
              {c.daysLeft}d left
            </span>
          )}
        </div>

        {/* Balance bar */}
        <div className="space-y-1.5">
          <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-700", barColor)}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground tabular-nums">
            {pct.toFixed(0)}% remaining
          </p>
        </div>

        {/* Stats + Actions */}
        <div className="grid grid-cols-2 gap-x-4 pt-1">
          <div className="py-3 border-r border-border pr-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Daily avg</p>
            <div className="flex items-center gap-1">
              <TrendingDown className="size-3 text-muted-foreground/50" />
              <p className="text-sm font-semibold text-foreground tabular-nums">{c.avgCostFormatted}</p>
            </div>
          </div>
          <div className="py-2 pl-4 flex items-center justify-around">
            <TariffDrawer contractLabel={contractLabel}>
              <button type="button" className="flex flex-col items-center gap-1.5 group">
                <span className="w-9 h-9 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-muted/70 transition-colors">
                  <ChevronRight className="size-4 text-foreground" />
                </span>
                <span className="text-[10px] font-medium text-muted-foreground">Details</span>
              </button>
            </TariffDrawer>

            {c.isLowBalance && (
              <button type="button" onClick={onRecharge} className="flex flex-col items-center gap-1.5 group">
                <span className="w-9 h-9 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Zap className="size-4 text-primary" />
                </span>
                <span className="text-[10px] font-medium text-primary">Top up</span>
              </button>
            )}

            {!c.isLowBalance && (
              <TariffDrawer contractLabel={contractLabel}>
                <button type="button" className="flex flex-col items-center gap-1.5 group opacity-0 pointer-events-none" aria-hidden>
                  <span className="w-9 h-9 rounded-2xl bg-muted flex items-center justify-center" />
                </button>
              </TariffDrawer>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
