import type { LucideIcon } from "lucide-react";
import { BarChart3, History, Settings, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import type { ViewType } from "@/types";

const navItems: { icon: LucideIcon; label: string; id: ViewType }[] = [
  { icon: BarChart3, label: "Usage", id: "usage" },
  { icon: Zap, label: "Recharge", id: "recharge" },
  { icon: History, label: "History", id: "history" },
  { icon: Settings, label: "Settings", id: "settings" },
];

export function BottomNav() {
  const { currentView, setView } = useApp();

  const handleNavClick = (viewId: ViewType) => {
    setView(viewId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto flex justify-around items-center px-4 py-3 bg-white/80 backdrop-blur-2xl border border-slate-100/50 z-50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[28px]">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            type="button"
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={cn(
              "flex flex-col items-center justify-center py-2 px-4 transition-all duration-300 rounded-2xl cursor-pointer group relative",
              isActive
                ? "text-blue-600"
                : "text-slate-400 hover:text-slate-600",
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
                "text-[9px] font-bold uppercase tracking-[0.1em] z-10 transition-all duration-300",
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
                className="absolute inset-0 bg-blue-50/50 rounded-2xl -z-0"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
