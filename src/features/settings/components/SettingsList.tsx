import type * as React from 'react';
import { ChevronRight, CreditCard, Lock, LogOut } from "lucide-react";
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

  return (
    <section className="mb-4 md:mb-10">
      <div className="bg-card rounded-[20px] md:rounded-[32px] border border-border shadow-sm overflow-hidden">
        {items.map((item, i) => (
          <div key={item.label}>
            {i > 0 && <Separator />}
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-between rounded-none px-4 py-3.5 md:py-4 text-foreground"
              onClick={item.onClick}
            >
              <span className="flex items-center gap-2.5 md:gap-4 text-muted-foreground">
                {item.icon}
                <span className="font-medium text-xs md:text-base text-foreground">
                  {item.label}
                </span>
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" aria-hidden="true" />
            </Button>
          </div>
        ))}
        <Separator />
        <Button
          variant="ghost"
          size="lg"
          className="w-full justify-start rounded-none px-4 py-3.5 md:py-4 text-destructive hover:bg-destructive/5 hover:text-destructive gap-2.5 md:gap-4"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" />
          <span className="font-medium text-xs md:text-base">Log out</span>
        </Button>
      </div>
    </section>
  );
}

