import { FileText, Loader2, Sparkles, Zap } from "lucide-react";
import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { ContractCardSkeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
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
    const contract = contracts.find((c) => c.contractId === s.contractID);
    if (!contract) return;
    addToCart({
      contractId: s.contractID,
      amount: s.suggestedAmount,
      label: contract.buContractId
        ? `Contract · ${contract.buContractId}`
        : `Contract #${contract.contractId}`,
      currency: contract.currency,
      scale: contract.scale,
      balanceFormatted: contract.balanceFormatted,
    });
  };

  const handleApplyAll = () => {
    if (!suggestions) return;
    for (const s of suggestions) handleApplyOne(s);
  };

  return (
    <main className="pt-4 lg:pt-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-2 lg:px-0">
        <div>
          <h2 className="font-bold text-lg md:text-xl text-foreground">Recharge</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Select an amount for each contract you want to top up, then confirm.
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

      {/* Smart Suggest Panel */}
      {!isLoading && contracts.length > 0 && (
        <div className="bg-linear-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20 p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <Sparkles className="size-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">Smart Suggest</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Enter how many days you want to cover and we'll recommend how much to recharge each contract.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-35">
              <Input
                type="number"
                min={1}
                max={365}
                value={days}
                onChange={(e) => setDays(Math.max(1, Number(e.target.value)))}
                className="pr-12 font-semibold"
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
              {isSuggesting ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {isSuggesting ? "Calculating…" : "Get Suggestions"}
            </Button>
          </div>

          {suggestError && <p className="text-xs text-destructive">{suggestError}</p>}

          {suggestions && suggestions.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No suggestions available for {days} days. Try a different value.
            </p>
          )}

          {suggestions && suggestions.length > 0 && (
            <div className="space-y-3 pt-1">
              <div className="h-px bg-primary/15" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Suggestions for {days} days
              </p>
              <ul className="space-y-2">
                {suggestions.map((s) => {
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
                  return (
                    <li key={s.contractID} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{label}</p>
                        <p className="text-xs text-muted-foreground">{contract.balanceFormatted} current</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-bold text-foreground">{formatted}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-3 text-xs gap-1"
                          onClick={() => handleApplyOne(s)}
                        >
                          <Zap className="size-3" />
                          Apply
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <Button className="w-full gap-2" onClick={handleApplyAll}>
                <Zap className="size-4" />
                Apply All to Cart
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Contract cards */}
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
        <div className={contracts.length > 1 ? "grid grid-cols-1 xl:grid-cols-2 gap-4" : ""}>
          {contracts.map((c) => (
            <Fragment key={c.contractId}>
              <ContractRechargeCard
                contract={c}
                cartItem={cart.get(c.contractId)}
                onAddToCart={addToCart}
                onRemove={removeFromCart}
              />
            </Fragment>
          ))}
        </div>
      )}
    </main>
  );
}
