import type { LucideIcon } from "lucide-react";
import { BarChart3, History, Home, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import type { ViewType } from "@/types";

const navItems: { icon: LucideIcon; label: string; id: ViewType }[] = [
  { icon: Home, label: "Home", id: "dashboard" },
  { icon: Zap, label: "Recharge", id: "recharge" },
  { icon: BarChart3, label: "Usage", id: "usage" },
  { icon: History, label: "History", id: "history" },
];

export function BottomNav() {
  const { currentView, setView } = useApp();

  const handleNavClick = (viewId: ViewType) => {
    setView(viewId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="fixed max-md:w-full bottom-0 left-0 md:bottom-2 md:left-2 md:right-2 max-w-lg mx-auto flex justify-around items-center p-2 bg-card/80 backdrop-blur-2xl border border-border/50 z-50 shadow-xl md:rounded-[28px]">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            type="button"
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={cn(
              "flex flex-col flex-1 items-center justify-center py-2 px-4 transition-all duration-300 rounded-2xl cursor-pointer group relative focus:outline-primary",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <item.icon
              className={cn(
                "w-5 h-5 mb-1 transition-all duration-300 z-10",
                isActive
                  ? "scale-110 stroke-[2.5px]"
                  : "group-hover:scale-110 stroke-[2px]",
              )}
            />
            <span
              className={cn(
                "text-[10px] font-medium z-10 transition-all duration-300",
                isActive
                  ? "opacity-100"
                  : "opacity-0 scale-90 h-0 overflow-hidden",
              )}
            >
              {item.label}
            </span>
            {isActive && (
              <motion.div
                layoutId="active-nav"
                className="absolute inset-0 bg-primary/8 rounded-2xl z-0"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
