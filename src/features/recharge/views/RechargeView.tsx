import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, toMinorUnits } from '@/types';
import { AmountSelector } from '../components/AmountSelector';
import { PaymentMethodSelector } from '../components/PaymentMethodSelector';
import { useRecharge } from '../hooks/useRecharge';

export function RechargeView() {
  const {
    amount,
    isCustom,
    customAmount,
    isSuccess,
    selectedMethod,
    paymentMethods,
    suggestedAmount,
    setSelectedMethod,
    handleRecharge,
    selectPredefinedAmount,
    handleCustomAmountChange,
  } = useRecharge();

  return (
    <main className="pt-4 lg:pt-6">
      <h2 className="font-bold text-lg md:text-xl mb-4 md:mb-6 px-2 text-foreground lg:px-0">
        Quick Recharge
      </h2>

      {suggestedAmount != null && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="size-4 text-primary shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">Smart suggestion</p>
              <p className="text-[11px] text-muted-foreground">
                Based on your last 30 days usage
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10 font-bold shrink-0"
            onClick={() => selectPredefinedAmount(suggestedAmount)}
          >
            {formatCurrency(toMinorUnits(suggestedAmount))}
          </Button>
        </div>
      )}

      <div className="lg:grid lg:grid-cols-2 lg:gap-8 space-y-6 lg:space-y-0">
        <section>
          <p className="text-xs text-muted-foreground font-medium mb-3 px-1 hidden lg:block">Select amount</p>
          <AmountSelector
            amount={amount}
            isCustom={isCustom}
            customAmount={customAmount}
            onSelectPreset={selectPredefinedAmount}
            onCustomChange={handleCustomAmountChange}
          />
        </section>

        <section className="space-y-4">
          <p className="text-xs text-muted-foreground font-medium mb-3 px-1 hidden lg:block">Payment & confirm</p>
          <PaymentMethodSelector
            amount={amount}
            selectedMethod={selectedMethod}
            paymentMethods={paymentMethods}
            isSuccess={isSuccess}
            onSelectMethod={setSelectedMethod}
            onConfirm={handleRecharge}
          />
        </section>
      </div>
    </main>
  );
}
