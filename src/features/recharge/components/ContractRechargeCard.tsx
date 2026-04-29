import { Check, Clock, Loader2, ShoppingCart, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ContractSummary } from "@/features/dashboard/hooks/useDashboard";
import { cn } from "@/lib/utils";
import { apiService } from "@/services/api";
import type { CartItem } from "../hooks/useRechargeCart";

const PRESET_AMOUNTS = [20, 50, 100, 200] as const;

interface ContractRechargeCardProps {
  contract: ContractSummary;
  cartItem: CartItem | undefined;
  onAddToCart: (item: CartItem) => void;
  onRemove: (contractId: number) => void;
  /** When set, pre-fills the custom input with this amount (display units). */
  prefillAmount?: number;
}

export function ContractRechargeCard({
  contract: c,
  cartItem,
  onAddToCart,
  onRemove,
  prefillAmount,
}: ContractRechargeCardProps) {
  const [amount, setAmount] = useState<number>(cartItem?.amount ?? 0);
  const [customValue, setCustomValue] = useState<string>(
    cartItem ? String(cartItem.amount) : "",
  );
  const [isCustom, setIsCustom] = useState(false);

  // Per-card smart suggest
  const [suggestDays, setSuggestDays] = useState(30);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState<number | null>(null);
  const [suggestError, setSuggestError] = useState(false);

  const handleSuggest = async () => {
    setIsSuggesting(true);
    setSuggestError(false);
    setSuggestion(null);
    try {
      const results = await apiService.suggestRecharge([c.contractId], suggestDays);
      const match = results.find((r) => r.contractID === c.contractId);
      setSuggestion(match?.suggestedAmount ?? null);
    } catch {
      setSuggestError(true);
    } finally {
      setIsSuggesting(false);
    }
  };

  // Sync externally suggested amount into the custom input
  useEffect(() => {
    if (prefillAmount !== undefined && prefillAmount > 0) {
      setCustomValue(String(prefillAmount));
      setIsCustom(true);
      setAmount(0);
    }
  }, [prefillAmount]);

  const currentAmount = isCustom ? Number(customValue) || 0 : amount;
  const inCart = !!cartItem;
  const label = c.buContractId ? `${c.buContractId}` : `#${c.contractId}`;

  const handlePreset = (amt: number) => {
    setAmount(amt);
    setIsCustom(false);
    setCustomValue("");
  };

  const handleAddToCart = () => {
    if (currentAmount <= 0) return;
    onAddToCart({
      contractId: c.contractId,
      amount: currentAmount,
      label,
      currency: c.currency,
      scale: c.scale,
      balanceFormatted: c.balanceFormatted,
    });
  };

  return (
    <article className={cn(
      "bg-card rounded-2xl border shadow-sm p-5 space-y-4 transition-all",
      inCart ? "border-primary/40 bg-primary/5" : "border-border",
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5 truncate">{label}</p>
          <p className="font-bold text-xl text-foreground tabular-nums">{c.balanceFormatted}</p>
        </div>
        <StatusBadge status={c.serviceStatus} />
      </div>

      {/* Days remaining */}
      {c.daysLeft !== null && (
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold",
          c.daysLeft < 0
            ? "bg-destructive/10 text-destructive"
            : c.daysLeft <= 7
              ? "bg-warning/10 text-warning"
              : "bg-muted text-muted-foreground",
        )}>
          <Clock className="size-3" />
          {c.daysLeft < 0 ? "Recharge needed" : `${c.daysLeft} day${c.daysLeft !== 1 ? "s" : ""} remaining`}
        </div>
      )}

      {/* Preset amounts */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Quick amounts</p>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_AMOUNTS.map((amt) => {
            const active = !isCustom && amount === amt;
            return (
              <button
                key={amt}
                type="button"
                onClick={() => handlePreset(amt)}
                className={cn(
                  "flex items-baseline justify-between px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-foreground hover:border-primary/30 hover:bg-muted/50",
                )}
              >
                <span className="text-[10px] font-bold text-muted-foreground mr-1">{c.currency}</span>
                <span className="tabular-nums">{amt.toFixed(2)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Smart Suggest */}
      <div className="rounded-xl border border-dashed border-primary/30 bg-primary/3 p-3 space-y-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-3.5 text-primary shrink-0" />
          <p className="text-xs font-semibold text-primary flex-1">Smart</p>
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <Input
                type="number"
                min={1}
                max={365}
                value={suggestDays}
                onChange={(e) => setSuggestDays(Math.max(1, Number(e.target.value)))}
                className="w-16 h-7 pr-7 text-xs font-semibold bg-background text-center"
              />
              <span className="absolute inset-y-0 right-2 flex items-center text-[10px] text-muted-foreground pointer-events-none">d</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSuggest}
              disabled={isSuggesting}
              className="h-8 px-2.5 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
            >
              {isSuggesting
                ? <Loader2 className="size-3 animate-spin" />
                : <Sparkles className="size-3" />}
              {isSuggesting ? "…" : "Calculate"}
            </Button>
          </div>
        </div>

        {/* Suggestion result */}
        {suggestion !== null && !isSuggesting && (
          <button
            type="button"
            onClick={() => {
              setCustomValue(String(suggestion));
              setIsCustom(true);
              setAmount(0);
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-primary/30 bg-primary/8 hover:bg-primary/15 transition-all group"
          >
            <span className="text-xs text-primary font-medium">Suggested for {suggestDays} days</span>
            <span className="font-bold text-sm text-primary tabular-nums">
              {c.currency} {suggestion.toFixed(2)}
            </span>
          </button>
        )}

        {suggestError && (
          <p className="text-[11px] text-destructive">Could not calculate. Try again.</p>
        )}
      </div>

      {/* Custom input */}
      <div className={cn(
        "flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all",
        isCustom ? "border-primary bg-primary/5" : "border-border bg-muted/30",
      )}>
        <span className="text-sm font-bold text-muted-foreground">{c.currency}</span>
        <Input
          type="number"
          min={0}
          value={customValue}
          placeholder="Custom amount"
          onChange={(e) => { setCustomValue(e.target.value); setIsCustom(true); setAmount(0); }}
          className="border-none shadow-none bg-transparent p-0 text-sm font-bold focus-visible:ring-0"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          className="flex-1"
          disabled={currentAmount <= 0}
          onClick={handleAddToCart}
          variant={inCart ? "outline" : "default"}
        >
          {inCart ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
          {inCart ? "Update" : "Add to Cart"}
        </Button>
        {inCart && (
          <Button variant="ghost" size="sm" onClick={() => onRemove(c.contractId)} className="text-destructive hover:text-destructive">
            Remove
          </Button>
        )}
      </div>
    </article>
  );
}
