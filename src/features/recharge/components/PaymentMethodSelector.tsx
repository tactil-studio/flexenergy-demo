import { Check, CreditCard, Plus, Smartphone, Wallet } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { IconBox } from "@/components/ui/icon-box";
import { formatCurrency, toMinorUnits } from "@/types";
import type { PaymentMethod } from "../hooks/useRecharge";

interface PaymentMethodSelectorProps {
  amount: number;
  selectedMethod: string;
  paymentMethods: PaymentMethod[];
  isSuccess: boolean;
  onSelectMethod: (id: string) => void;
  onConfirm: () => void;
}

function MethodIcon({ type }: { type: PaymentMethod["type"] }) {
  const cls = "w-5 h-5 md:w-6 md:h-6 text-primary";
  if (type === "card") return <CreditCard className={cls} />;
  if (type === "google_pay") return <Smartphone className={cls} />;
  return <Wallet className={cls} />;
}

export function PaymentMethodSelector({
  amount,
  selectedMethod,
  paymentMethods,
  isSuccess,
  onSelectMethod,
  onConfirm,
}: PaymentMethodSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentMethod =
    paymentMethods.find((m) => m.id === selectedMethod) ?? paymentMethods[0];

  return (
    <div className="bg-card p-4 md:p-6 rounded-3xl md:rounded-4xl border border-border shadow-sm space-y-4 md:space-y-6">
      {/* Current method row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          <IconBox variant="primary" size="lg">
            <MethodIcon type={currentMethod.type} />
          </IconBox>
          <div>
            <h3 className="font-semibold text-sm md:text-base text-foreground">
              {currentMethod.label}
            </h3>
            <p className="text-[11px] md:text-xs text-muted-foreground">
              {currentMethod.details}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
        >
          {isOpen ? "Cancel" : "Change"}
        </button>
      </div>

      {/* Method picker */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-1"
          >
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => {
                  onSelectMethod(method.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  selectedMethod === method.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted/50 text-foreground"
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <span aria-hidden="true">
                    <MethodIcon type={method.type} />
                  </span>
                  <div>
                    <p className="text-xs font-medium">{method.label}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {method.details}
                    </p>
                  </div>
                </div>
                {selectedMethod === method.id && (
                  <Check className="size-4 text-primary" />
                )}
              </button>
            ))}

            <button
              type="button"
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-border text-muted-foreground hover:border-primary/30 hover:text-primary transition-all"
            >
              <Plus className="size-4" />
              <span className="text-xs font-medium">Add payment method</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm button */}
      <button
        type="button"
        onClick={onConfirm}
        disabled={amount <= 0}
        className="w-full bg-foreground text-background py-3.5 md:py-4 rounded-xl md:rounded-2xl font-semibold active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-foreground/90"
      >
        Top up {formatCurrency(toMinorUnits(amount))}
      </button>

      {isSuccess && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-xs text-success"
        >
          Balance updated successfully
        </motion.p>
      )}
    </div>
  );
}
