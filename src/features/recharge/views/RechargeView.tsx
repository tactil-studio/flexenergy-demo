import { FileText, Loader2, Sparkles, Zap } from "lucide-react";
import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { ContractCardSkeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { cn } from "@/lib/utils";
import { apiService } from "@/services/api";
import { formatCurrency, toMinorUnits } from "@/types";
import { CartDrawer } from "../components/CartDrawer";
import { ContractRechargeCard } from "../components/ContractRechargeCard";
import { useRechargeCart } from "../hooks/useRechargeCart";

interface SuggestionResult {
  contractID: number;
  suggestedAmount: number;
  suggestedAmountRaw: number;
}

export function RechargeView() {
  const { contracts, isLoading } = useDashboard();
  const { items, count, addToCart, removeFromCart, clearCart, totalFormatted, cart } =
    useRechargeCart();

  // Smart Suggest state
  const [days, setDays] = useState<number>(30);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionResult[] | null>(null);
  const [suggestError, setSuggestError] = useState<string | null>(null);
  /** contractId → prefill amount (display units) */
  const [prefills, setPrefills] = useState<Map<number, number>>(new Map());

  const handleSuggest = async () => {
    if (contracts.length === 0) return;
    setIsSuggesting(true);
    setSuggestError(null);
    setSuggestions(null);
    try {
      const contractIds = contracts.map((c) => c.contractId);
      const result = await apiService.suggestRecharge(contractIds, days);
      setSuggestions(result.filter((s) => s.suggestedAmount > 0));
    } catch {
      setSuggestError("Could not load suggestions. Please try again.");
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleApplyOne = (s: SuggestionResult) => {
    setPrefills((prev) => {
      const next = new Map(prev);
      next.set(s.contractID, s.suggestedAmount);
      return next;
    });
  };

  const handleApplyAll = () => {
    if (!suggestions) return;
    setPrefills(new Map(suggestions.map((s) => [s.contractID, s.suggestedAmount])));
  };

  return (
    <main className="pt-4 lg:pt-6 space-y-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-lg md:text-xl text-foreground">Recharge</h2>
          <p className="text-xs text-muted-foreground mt-0.5 text-balance">
            Top up your contracts. Select an amount and confirm payment.
          </p>
        </div>
        <CartDrawer
          items={items}
          count={count}
          totalFormatted={totalFormatted}
          onRemove={removeFromCart}
          onClear={clearCart}
        />
      </div>

      {/* ── Smart Suggest Card ── */}
      {!isLoading && contracts.length > 0 && (
        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-5">
          {/* Title row */}
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <Sparkles className="size-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground leading-tight">Smart Suggest</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                We'll calculate the recommended amount to cover your usage.
              </p>
            </div>
          </div>

          {/* Input + button */}
          <div className="flex items-center gap-2">
            <div className="relative w-32 shrink-0">
              <Input
                type="number"
                min={1}
                max={365}
                value={days}
                onChange={(e) => setDays(Math.max(1, Number(e.target.value)))}
                className="pr-12 font-semibold bg-background"
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground pointer-events-none">
                days
              </span>
            </div>
            <Button
              onClick={handleSuggest}
              disabled={isSuggesting || contracts.length === 0}
              className="gap-2"
            >
              {isSuggesting
                ? <Loader2 className="size-4 animate-spin" />
                : <Sparkles className="size-4" />}
              {isSuggesting ? "Calculating…" : "Suggest"}
            </Button>
          </div>

          {/* Error */}
          {suggestError && (
            <p className="text-xs text-destructive">{suggestError}</p>
          )}

          {/* Empty result */}
          {suggestions && suggestions.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No suggestions for {days} days. Try a different value.
            </p>
          )}

          {/* Results */}
          {suggestions && suggestions.length > 0 && (
            <div className="space-y-3">
              <div className="h-px bg-primary/15" />
              <p className="text-[11px] font-semibold text-primary/70 uppercase tracking-wider">
                Suggested for {days} days
              </p>
              <ul className="space-y-2">
                {suggestions.map((s: SuggestionResult) => {
                  const contract = contracts.find((c) => c.contractId === s.contractID);
                  if (!contract) return null;
                  const label = contract.buContractId
                    ? `Contract · ${contract.buContractId}`
                    : `Contract #${contract.contractId}`;
                  const formatted = formatCurrency(
                    toMinorUnits(s.suggestedAmount, contract.scale),
                    contract.currency,
                    contract.scale,
                  );
                  const isPrefilled = prefills.get(s.contractID) === s.suggestedAmount;
                  return (
                    <li
                      key={s.contractID}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 bg-background border",
                        isPrefilled ? "border-primary/30" : "border-border",
                      )}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{label}</p>
                        <p className="text-xs text-muted-foreground">{contract.balanceFormatted} current</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-bold text-foreground tabular-nums">{formatted}</span>
                        <Button
                          size="sm"
                          variant={isPrefilled ? "ghost" : "outline"}
                          className="h-7 px-3 text-xs gap-1"
                          onClick={() => handleApplyOne(s)}
                          disabled={isPrefilled}
                        >
                          <Zap className="size-3" />
                          {isPrefilled ? "Applied" : "Apply"}
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <Button className="w-full gap-2" variant="outline" onClick={handleApplyAll}>
                <Zap className="size-4" />
                Apply All
              </Button>
            </div>
          )}
        </section>
      )}

      {/* ── Contract cards ── */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Your contracts
        </h3>
        {isLoading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <ContractCardSkeleton />
            <ContractCardSkeleton />
          </div>
        ) : contracts.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No contracts found"
            description="There are no active contracts associated with your account."
          />
        ) : (
          <div className={cn(contracts.length > 1 && "grid grid-cols-1 xl:grid-cols-2 gap-4")}>
            {contracts.map((c) => (
              <Fragment key={c.contractId}>
                <ContractRechargeCard
                  contract={c}
                  cartItem={cart.get(c.contractId)}
                  onAddToCart={addToCart}
                  onRemove={removeFromCart}
                  prefillAmount={prefills.get(c.contractId)}
                />
              </Fragment>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
