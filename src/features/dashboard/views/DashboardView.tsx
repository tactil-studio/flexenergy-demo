import { AlertTriangle, Calendar, Clock, TrendingDown, Zap } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useDashboard } from "../hooks/useDashboard";
import type { ContractSummary } from "../hooks/useDashboard";

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "Active";
  const isWarning = status === "Warning" || status === "Grace";
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${
        isActive
          ? "bg-success/10 text-success"
          : isWarning
            ? "bg-warning/10 text-warning"
            : "bg-destructive/10 text-destructive"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-success" : isWarning ? "bg-warning" : "bg-destructive"}`} />
      {status}
    </span>
  );
}

function ContractCard({ c, onRecharge }: { c: ContractSummary; onRecharge: () => void }) {
  return (
    <div className={`bg-card rounded-[24px] md:rounded-[28px] border shadow-sm overflow-hidden ${c.isLowBalance ? "border-warning/40" : "border-border"}`}>
      {c.isLowBalance && (
        <div className="bg-warning/10 border-b border-warning/20 px-5 py-2.5 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0" />
          <p className="text-xs font-medium text-warning">{c.depletionLabel}</p>
        </div>
      )}
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Contract {c.buContractId ? `· ${c.buContractId}` : `#${c.contractId}`}
            </p>
            <p className="text-2xl font-bold tracking-tight text-foreground">{c.balanceFormatted}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Current balance</p>
          </div>
          <StatusBadge status={c.serviceStatus} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-muted/50 rounded-xl p-3 border border-border">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingDown className="w-3 h-3 text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground font-medium">Daily avg</p>
            </div>
            <p className="text-sm font-semibold text-foreground">{c.avgCostFormatted}</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-3 border border-border">
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar className="w-3 h-3 text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground font-medium">Forecast</p>
            </div>
            <p className="text-sm font-semibold text-foreground">{c.forecastFormatted}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-3 h-3 shrink-0" />
            <p className="text-[10px]">Last data: {c.lastMeasureLabel}</p>
          </div>
          {!c.isLowBalance && (
            <p className="text-[10px] text-muted-foreground">{c.depletionLabel}</p>
          )}
          {c.isLowBalance && (
            <button
              type="button"
              onClick={onRecharge}
              className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Top up →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function DashboardView() {
  const { totalBalanceFormatted, contracts, consume, isLoading } = useDashboard();
  const { setView } = useApp();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-muted-foreground">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Balance hero */}
      <section className="bg-foreground rounded-[24px] md:rounded-[32px] p-6 md:p-8 text-background shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <span className="text-background/50 text-xs">Total balance</span>
            <div className="p-1.5 bg-primary/20 rounded-lg">
              <Zap className="w-3.5 h-3.5 text-primary/70" />
            </div>
          </div>
          <p className="text-4xl md:text-5xl font-extrabold tracking-tight mb-1">{totalBalanceFormatted}</p>
          <p className="text-xs text-background/40">{consume.toFixed(1)} kWh consumed</p>
        </div>
      </section>

      {/* Contract cards */}
      {contracts.length > 0 ? (
        contracts.map((c) => (
          <ContractCard key={c.contractId} c={c} onRecharge={() => setView("recharge")} />
        ))
      ) : (
        <div className="bg-card rounded-[24px] border border-border p-10 text-center text-sm text-muted-foreground">
          No contracts found.
        </div>
      )}
    </div>
  );
}
