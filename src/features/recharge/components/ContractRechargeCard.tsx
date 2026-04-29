import { Check, Clock, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ContractSummary } from "@/features/dashboard/hooks/useDashboard";
import { cn } from "@/lib/utils";
import { formatCurrency, toMinorUnits } from "@/types";
import type { CartItem } from "../hooks/useRechargeCart";

const PRESET_AMOUNTS = [20, 50, 100, 200] as const;

interface ContractRechargeCardProps {
  contract: ContractSummary;
  cartItem: CartItem | undefined;
  onAddToCart: (item: CartItem) => void;
  onRemove: (contractId: number) => void;
}

export function ContractRechargeCard({
  contract: c,
  cartItem,
  onAddToCart,
  onRemove,
}: ContractRechargeCardProps) {
  const [amount, setAmount] = useState<number>(cartItem?.amount ?? 0);
  const [customValue, setCustomValue] = useState<string>(
    cartItem ? String(cartItem.amount) : "",
  );
  const [isCustom, setIsCustom] = useState(false);

  const currentAmount = isCustom ? Number(customValue) || 0 : amount;
  const inCart = !!cartItem;
  const label = c.buContractId ? `Contract · ${c.buContractId}` : `Contract #${c.contractId}`;

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
          <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
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
      <div className="grid grid-cols-4 gap-2">
        {PRESET_AMOUNTS.map((amt) => (
          <Button
            key={amt}
            variant="ghost"
            size="sm"
            onClick={() => handlePreset(amt)}
            className={cn(
              "rounded-xl border font-bold text-sm",
              !isCustom && amount === amt
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/30",
            )}
          >
            {formatCurrency(toMinorUnits(amt), c.currency, c.scale)}
          </Button>
        ))}
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
