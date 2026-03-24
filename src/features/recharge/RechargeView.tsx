import { Check, CreditCard, Plus, Smartphone, Wallet } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { type PaymentMethod, useRecharge } from "./useRecharge";
import { formatCurrency, toMinorUnits } from "@/types";

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
        return <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />;
      case "google_pay":
        return <Smartphone className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />;
      case "apple_pay":
        return <Wallet className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />;
    }
  };

  const currentMethod =
    paymentMethods.find((m) => m.id === selectedMethod) || paymentMethods[0];

  return (
    <div className="space-y-6 md:space-y-8">
      <section>
        <h2 className="font-bold text-lg md:text-xl mb-4 md:mb-6 px-2 text-slate-900">
          Quick Recharge
        </h2>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {amounts.map((amt) => (
            <button
              type="button"
              key={amt}
              onClick={() => selectPredefinedAmount(amt)}
              className={`p-4 md:p-6 rounded-[24px] md:rounded-3xl border-2 transition-all ${
                amount === amt
                  ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm"
                  : "border-slate-100 bg-white text-slate-500 hover:border-blue-200"
              }`}
            >
              <span className="text-xl md:text-2xl font-bold">{formatCurrency(toMinorUnits(amt))}</span>
            </button>
          ))}
          <div
            className={`p-3 md:p-4 rounded-[24px] md:rounded-3xl border-2 transition-all flex flex-col justify-center min-h-[80px] md:min-h-[100px] ${
              isCustom
                ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm"
                : "border-slate-100 bg-white text-slate-500 hover:border-blue-200"
            }`}
          >
            <span className="text-[8px] md:text-[10px] uppercase font-bold mb-0.5 md:mb-1 ml-1 opacity-60">
              Custom Amount
            </span>
            <div className="flex items-center">
              <span className="text-lg md:text-xl font-bold mr-1">CHF</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                placeholder="0.00"
                className="bg-transparent border-none p-0 focus:ring-0 text-lg md:text-xl font-bold w-full placeholder:text-slate-300"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-50 shadow-sm space-y-4 md:space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-50 flex items-center justify-center">
                {getMethodIcon(currentMethod.type)}
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base text-slate-900">
                  {currentMethod.label}
                </h3>
                <p className="text-[11px] md:text-xs text-slate-500 font-medium">
                  {currentMethod.details}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsMethodSelectorOpen(!isMethodSelectorOpen)}
              className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
            >
              Change
            </button>
          </div>

          <AnimatePresence>
            {isMethodSelectorOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-2"
              >
                {paymentMethods.map((method) => (
                  <button
                    type="button"
                    key={method.id}
                    onClick={() => {
                      setSelectedMethod(method.id);
                      setIsMethodSelectorOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                      selectedMethod === method.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-50 bg-slate-50/50 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 text-left">
                      {getMethodIcon(method.type)}
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {method.label}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {method.details}
                        </p>
                      </div>
                    </div>
                    {selectedMethod === method.id && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                ))}
                <button
                  type="button"
                  className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-600 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold">Add New Method</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={handleRecharge}
            disabled={amount <= 0}
            className="w-full bg-blue-600 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            Add {formatCurrency(toMinorUnits(amount))} to Balance
          </button>

          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-emerald-600 font-bold text-sm"
            >
              Recharge Successful!
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
