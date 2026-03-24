import { useState } from "react";
import { useApp } from "@/context/AppContext";

export type PaymentMethod = {
  id: string;
  type: "card" | "google_pay" | "apple_pay";
  label: string;
  details: string;
};

export function useRecharge() {
  const { recharge } = useApp();
  const [amount, setAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("visa_4242");

  const paymentMethods: PaymentMethod[] = [
    { id: "visa_4242", type: "card", label: "Visa", details: "ending in 4242" },
    { id: "gpay", type: "google_pay", label: "Google Pay", details: "alex.t@gmail.com" },
    { id: "apple_pay", type: "apple_pay", label: "Apple Pay", details: "Default Card" },
  ];

  const handleRecharge = async () => {
    const finalAmount = isCustom ? Number(customAmount) : amount;
    if (Number.isNaN(finalAmount) || finalAmount <= 0) return;
    
    await recharge(finalAmount);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const selectPredefinedAmount = (amt: number) => {
    setAmount(amt);
    setIsCustom(false);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (val: string) => {
    setCustomAmount(val);
    setIsCustom(true);
    // We don't automatically select a predefined amount here to avoid the "10" vs "100" issue
  };

  const currentAmount = isCustom ? Number(customAmount) || 0 : amount;

  return {
    amount: currentAmount,
    isCustom,
    customAmount,
    isSuccess,
    selectedMethod,
    paymentMethods,
    setSelectedMethod,
    handleRecharge,
    selectPredefinedAmount,
    handleCustomAmountChange,
  };
}
