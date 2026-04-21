import { Check, CreditCard, Plus, Smartphone, Wallet } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { formatCurrency, toMinorUnits } from "@/types";
import { type PaymentMethod, useRecharge } from "../hooks/useRecharge";

export function RechargeView() {
  const {
    amount,
    isCustom,
    customAmount,
    isSuccess,
    selectedMethod,
    paymentMethods,
    setSelectedMethod,
    handleRecharge,
    selectPredefinedAmount,
    handleCustomAmountChange,
  } = useRecharge();

  const [isMethodSelectorOpen, setIsMethodSelectorOpen] = useState(false);

  const amounts = [10, 20, 50];

  const getMethodIcon = (type: PaymentMethod["type"]) => {
    switch (type) {
      case "card":
        return <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-primary" />;
      case "google_pay":
        return <Smartphone className="w-5 h-5 md:w-6 md:h-6 text-primary" />;
      case "apple_pay":
        return <Wallet className="w-5 h-5 md:w-6 md:h-6 text-primary" />;
    }
  };

  const currentMethod =
    paymentMethods.find((m) => m.id === selectedMethod) || paymentMethods[0];

  return (
    <main className="pt-4 lg:pt-6">
      <h2 className="font-bold text-lg md:text-xl mb-4 md:mb-6 px-2 text-foreground lg:px-0">
        Quick Recharge
      </h2>

      {/* Desktop: two-column layout */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 space-y-6 lg:space-y-0">
        {/* Left: Amount selector */}
        <section>
          <p className="text-xs text-muted-foreground font-medium mb-3 px-1 hidden lg:block">Select amount</p>
          <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
            {amounts.map((amt) => (
              <button
                type="button"
                key={amt}
                onClick={() => selectPredefinedAmount(amt)}
                className={`p-4 md:p-6 rounded-3xl md:rounded-3xl border-2 transition-all flex items-center justify-center min-h-[80px] md:min-h-[100px] ${amount === amt
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30"
                  }`}
              >
                <span className="text-xl md:text-2xl font-bold">{formatCurrency(toMinorUnits(amt))}</span>
              </button>
            ))}
            <label
              className={`p-4 md:p-6 rounded-3xl md:rounded-3xl border-2 transition-all flex flex-col justify-center min-h-[80px] md:min-h-[100px] ${isCustom
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-primary/30"
                }`}
            >
              <span className="text-[10px] text-current mb-0.5 md:mb-1 ml-1 opacity-60">
                Custom amount
              </span>
              <div className="flex items-center">
                <span className="text-lg md:text-xl font-bold mr-1">CHF</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  placeholder="0.00"
                  aria-label="Custom recharge amount in CHF"
                  className="bg-transparent border-none p-0 focus:ring-0 text-lg md:text-xl font-bold w-full placeholder:text-muted-foreground/30"
                />
              </div>
            </label>
          </div>
        </section>

        {/* Right: Payment method + confirm */}
        <section className="space-y-4">
          <p className="text-xs text-muted-foreground font-medium mb-3 px-1 hidden lg:block">Payment & confirm</p>
          <div className="bg-card p-4 md:p-6 rounded-3xl md:rounded-4xl border border-border shadow-sm space-y-4 md:space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                <span className="size-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center" aria-hidden="true">
                  {getMethodIcon(currentMethod.type)}
                </span>
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
                onClick={() => setIsMethodSelectorOpen(!isMethodSelectorOpen)}
                className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
              >
                {isMethodSelectorOpen ? "Cancel" : "Change"}
              </button>
            </div>

            <AnimatePresence>
              {isMethodSelectorOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-1"
                >
                  {paymentMethods.map((method) => (
                    <button
                      type="button"
                      key={method.id}
                      onClick={() => {
                        setSelectedMethod(method.id);
                        setIsMethodSelectorOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${selectedMethod === method.id
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted/50 text-foreground"
                        }`}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <span aria-hidden="true">{getMethodIcon(method.type)}</span>
                        <div>
                          <p className="text-xs font-medium">
                            {method.label}
                          </p>
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

            <button
              type="button"
              onClick={handleRecharge}
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
        </section>
      </div>
    </main>
  );
}
