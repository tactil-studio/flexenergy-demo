import { AlertTriangle, Clock } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import type { ContractSummary } from "../hooks/useDashboard";
import { RadialRing } from "./RadialRing";

interface ContractCardProps {
  c: ContractSummary;
  onRecharge: () => void;
}

export function ContractCard({ c, onRecharge }: ContractCardProps) {
  const balancePercent = c.balancePercent ?? 100;

  return (
    <article
      className={`bg-card rounded-[28px] border shadow-sm overflow-hidden ${c.isLowBalance ? "border-warning/40" : "border-border"
        }`}
    >
      {c.isLowBalance && (
        <p
          role="alert"
          className="bg-warning/8 border-b border-warning/20 px-5 py-2.5 flex items-center gap-2 text-xs font-semibold text-warning"
        >
          <AlertTriangle className="size-3.5 shrink-0" />
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
                {c.buContractId
                  ? `Contract · ${c.buContractId}`
                  : `Contract #${c.contractId}`}
              </p>
              <StatusBadge status={c.serviceStatus} />
            </div>
            <p className="font-heading font-bold text-2xl tracking-tight text-foreground tabular-nums">
              {c.balanceFormatted}
            </p>
          </div>
        </div>

        {/* Days remaining pill */}
        {c.daysLeft !== null && (
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold mb-4 ${c.daysLeft <= 3
                ? "bg-destructive/10 text-destructive"
                : c.daysLeft <= 7
                  ? "bg-warning/10 text-warning"
                  : "bg-muted text-muted-foreground"
              }`}
          >
            <Clock className="size-3" />
            {c.daysLeft} day{c.daysLeft !== 1 ? "s" : ""} remaining
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
            type="button"
            onClick={onRecharge}
            className="mt-4 w-full py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            Top up now
          </button>
        )}
      </div>
    </article>
  );
}
