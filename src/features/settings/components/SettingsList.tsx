import { ChevronRight, CreditCard, Lock, LogOut } from "lucide-react";
import { motion } from "motion/react";
import type * as React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";

interface SettingsItem {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: "default" | "destructive";
}

export function SettingsList() {
  const { logout } = useAuth();

  const items: SettingsItem[] = [
    { icon: <Lock className="w-4 h-4 md:w-5 md:h-5" />, label: "Privacy & Security" },
    { icon: <CreditCard className="w-4 h-4 md:w-5 md:h-5" />, label: "Payment Methods" },
  ];

  const allItems = [
    ...items,
    { icon: <LogOut className="w-4 h-4 md:w-5 md:h-5" />, label: "Log out", onClick: logout, variant: "destructive" as const },
  ];

  return (
    <section className="mb-4 md:mb-10">
      <motion.div
        className="bg-card rounded-[20px] md:rounded-[32px] border border-border shadow-sm overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      >
        {allItems.map((item, i) => (
          <motion.div
            key={item.label}
            variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {i > 0 && <Separator />}
            <Button
              variant="ghost"
              size="lg"
              className={
                item.variant === "destructive"
                  ? "w-full justify-start rounded-none px-4 py-3.5 md:py-4 text-destructive hover:bg-destructive/5 hover:text-destructive gap-2.5 md:gap-4"
                  : "w-full justify-between rounded-none px-4 py-3.5 md:py-4 text-foreground"
              }
              onClick={item.onClick}
            >
              {item.variant === "destructive" ? (
                <>
                  {item.icon}
                  <span className="font-medium text-xs md:text-base">{item.label}</span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-2.5 md:gap-4 text-muted-foreground">
                    {item.icon}
                    <span className="font-medium text-xs md:text-base text-foreground">{item.label}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50" aria-hidden="true" />
                </>
              )}
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

