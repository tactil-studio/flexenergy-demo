import { useRecharge } from '../hooks/useRecharge';
import { AmountSelector } from '../components/AmountSelector';
import { PaymentMethodSelector } from '../components/PaymentMethodSelector';

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

  return (
    <main className="pt-4 lg:pt-6">
      <h2 className="font-bold text-lg md:text-xl mb-4 md:mb-6 px-2 text-foreground lg:px-0">
        Quick Recharge
      </h2>

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
