import { AlertTriangle, ChevronRight, Clock, TrendingDown, Zap } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    ? `Contract · ${c.buContractId}`
    : `Contract #${c.contractId}`;

  const daysVariant =
    c.daysLeft === null
      ? null
      : c.daysLeft <= 3
        ? "destructive"
        : c.daysLeft <= 7
          ? "warning"
          : "muted";

  const barColor =
    pct > 40
      ? "bg-success"
      : pct > 15
        ? "bg-warning"
        : "bg-destructive";

  return (
    <article
      className={cn(
        "bg-card rounded-2xl border shadow-sm overflow-hidden flex flex-col",
        c.isLowBalance ? "border-warning/30" : "border-border",
      )}
    >
      {/* ── Alert strip ───────────────────────────────────── */}
      {c.isLowBalance && (
        <div
          role="alert"
          className="flex items-center gap-2 px-5 py-2.5 bg-warning/8 border-b border-warning/20"
        >
          <AlertTriangle className="size-3.5 shrink-0 text-warning" />
          <span className="text-xs font-semibold text-warning">{c.depletionLabel}</span>
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* ── Header: ID + status ───────────────────────── */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium text-muted-foreground tracking-wide">
            {contractLabel}
          </span>
          <StatusBadge status={c.serviceStatus} />
        </div>

        {/* ── Balance + days ────────────────────────────── */}
        <div className="flex items-end justify-between gap-4">
          <p className="font-bold text-3xl tracking-tight text-foreground tabular-nums leading-none">
            {c.balanceFormatted}
          </p>
          {daysVariant && c.daysLeft !== null && (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0",
                daysVariant === "destructive" && "bg-destructive/10 text-destructive",
                daysVariant === "warning" && "bg-warning/10 text-warning",
                daysVariant === "muted" && "bg-muted text-muted-foreground",
              )}
            >
              <Clock className="size-3" />
              {c.daysLeft}d left
            </span>
          )}
        </div>

        {/* ── Balance bar ───────────────────────────────── */}
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-700", barColor)}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground tabular-nums">
            {pct.toFixed(0)}% of contract balance remaining
          </p>
        </div>

        {/* ── Stats ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-0 pt-1 border-t border-border">
          <div className="py-3 border-r border-border pr-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Daily avg</p>
            <div className="flex items-center gap-1">
              <TrendingDown className="size-3 text-muted-foreground/60" />
              <p className="text-sm font-semibold text-foreground tabular-nums">{c.avgCostFormatted}</p>
            </div>
          </div>
          <div className="py-3 pl-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Forecast</p>
            <p className="text-sm font-semibold text-foreground tabular-nums">{c.forecastFormatted}</p>
          </div>
        </div>

        {/* ── Actions ───────────────────────────────────── */}
        <footer className="flex items-center gap-3 mt-auto pt-1">
          <TariffDrawer contractLabel={contractLabel}>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs flex-1">
              Tariff details
              <ChevronRight className="size-3.5" />
            </Button>
          </TariffDrawer>

          <Button
            size="sm"
            className={cn("gap-1.5 text-xs", c.isLowBalance ? "flex-1" : "opacity-0 pointer-events-none")}
            onClick={onRecharge}
            tabIndex={c.isLowBalance ? 0 : -1}
            aria-hidden={!c.isLowBalance}
          >
            <Zap className="size-3.5" />
            Top up
          </Button>
        </footer>
      </div>
    </article>
  );
}
