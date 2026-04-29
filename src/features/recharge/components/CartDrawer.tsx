import { AlertCircle, CheckCircle, Loader2, ShoppingCart, Trash2, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useApp } from "@/context/AppContext";
import { formatCurrency, toMinorUnits } from "@/types";
import type { CartItem } from "../hooks/useRechargeCart";

interface CartDrawerProps {
  items: CartItem[];
  count: number;
  totalFormatted: string;
  onRemove: (contractId: number) => void;
  onClear: () => void;
  floating?: boolean;
}

export function CartDrawer({
  items,
  count,
  totalFormatted,
  onRemove,
  onClear,
  floating = false,
}: CartDrawerProps) {
  const { rechargeCart } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handlePay = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    setError(null);
    try {
      await rechargeCart(
        items.map((item) => ({
          contractId: item.contractId,
          amount: item.amount,
          scale: item.scale,
        })),
      );
      setSuccess(true);
      onClear();
      setTimeout(() => {
        setSuccess(false);
        setOpen(false);
      }, 2500);
    } catch {
      setError("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {floating ? (
          <button
            type="button"
            className="flex items-center gap-3 px-5 py-3 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all font-semibold text-sm"
          >
            <ShoppingCart className="size-4" />
            <span>{count} {count === 1 ? "item" : "items"}</span>
            <span className="opacity-70">·</span>
            <span>{totalFormatted}</span>
          </button>
        ) : (
          <Button
            className="relative gap-2"
            variant={count > 0 ? "default" : "outline"}
            disabled={count === 0}
          >
            <ShoppingCart className="size-4" />
            Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-2 size-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center border-2 border-background">
                {count}
              </span>
            )}
          </Button>
        )}
      </SheetTrigger>

      <SheetContent side="bottom" className="pb-8">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <CheckCircle className="size-12 text-primary" />
            <p className="font-semibold text-foreground">Payment successful!</p>
            <p className="text-sm text-muted-foreground text-center">
              Your balances have been updated.
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
            <ShoppingCart className="size-10 opacity-30" />
            <p className="text-sm">Your cart is empty</p>
          </div>
        ) : (
          <div className="px-5 space-y-4">
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.contractId} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.balanceFormatted} current balance</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-foreground">
                      {formatCurrency(toMinorUnits(item.amount, item.scale), item.currency, item.scale)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-7 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemove(item.contractId)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <Separator />

            <div className="flex items-center justify-between font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-foreground text-lg">{totalFormatted}</span>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            )}

            <Button
              className="w-full gap-2"
              size="lg"
              disabled={isProcessing}
              onClick={handlePay}
            >
              {isProcessing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Zap className="size-4" />
              )}
              {isProcessing ? "Processing…" : "Confirm Payment"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
