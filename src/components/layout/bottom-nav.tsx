import type { LucideIcon } from "lucide-react";
import { BarChart3, History, Home, Settings, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import type { ViewType } from "@/types";

const mobileNavItems: { icon: LucideIcon; label: string; id: ViewType }[] = [
  { icon: Home, label: "Home", id: "dashboard" },
  { icon: Zap, label: "Recharge", id: "recharge" },
  { icon: BarChart3, label: "Usage", id: "usage" },
  { icon: History, label: "History", id: "history" },
];

const sidebarNavItems: { icon: LucideIcon; label: string; id: ViewType }[] = [
  ...mobileNavItems,
  { icon: Settings, label: "Settings", id: "settings" },
];

export function BottomNav() {
  const { currentView, setView } = useApp();
  const { user } = useAuth();

  const handleNavClick = (viewId: ViewType) => {
    setView(viewId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((n) => (n as string)[0].toUpperCase())
    .join("") || "?";

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-60 flex-col bg-card border-r border-border z-50 shadow-sm">
        {/* Brand */}
        <div className="p-5 border-b border-border">
          <hgroup className="flex items-center gap-2.5">
            <span className="size-8 bg-primary rounded-xl flex items-center justify-center shadow-sm" aria-hidden="true">
              <Zap className="size-4 text-white" />
            </span>
            <strong className="font-bold text-foreground text-base tracking-tight">FlexEnergy</strong>
          </hgroup>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {sidebarNavItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* User footer */}
        <address className="p-4 border-t border-border not-italic">
          <div className="flex items-center gap-3">
            <span className="size-8 rounded-full bg-primary/10 border border-border flex items-center justify-center shrink-0" aria-hidden="true">
              <span className="text-xs font-bold text-primary">{initials}</span>
            </span>
            <dl className="min-w-0">
              <dt className="sr-only">Name</dt>
              <dd className="text-sm font-semibold text-foreground truncate">
                {user?.firstName} {user?.lastName}
              </dd>
              <dt className="sr-only">Email</dt>
              <dd className="text-xs text-muted-foreground truncate">{user?.email}</dd>
            </dl>
          </div>
        </address>
      </aside>

      {/* ── Mobile bottom nav ───────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 flex justify-around items-center p-2 bg-card/80 backdrop-blur-2xl border-t border-border/50 z-50 shadow-xl">
        {mobileNavItems.map((item) => {
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
              <span className={cn("text-[10px] font-semibold z-10 transition-colors duration-300", isActive ? "opacity-100" : "opacity-60")}>
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
    </>
  );
}
