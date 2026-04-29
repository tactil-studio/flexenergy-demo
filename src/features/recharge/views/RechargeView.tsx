import { FileText } from "lucide-react";
import { Fragment } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { ContractCardSkeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { CartDrawer } from "../components/CartDrawer";
import { ContractRechargeCard } from "../components/ContractRechargeCard";
import { useRechargeCart } from "../hooks/useRechargeCart";

export function RechargeView() {
  const { contracts, isLoading } = useDashboard();
  const { items, count, addToCart, removeFromCart, clearCart, totalFormatted, cart } =
    useRechargeCart();

  return (
    <main className="pt-4 lg:pt-6">
      <div className="flex items-center justify-between gap-4 mb-6 px-2 lg:px-0">
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
