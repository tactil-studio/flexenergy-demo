import { BarChart3, Clock, Settings, Zap } from "lucide-react";
import { motion } from "motion/react";
import { IconBox } from "@/components/ui/icon-box";

interface QuickActionsProps {
  onRecharge: () => void;
  onUsage: () => void;
  onHistory: () => void;
  onSettings: () => void;
}

const btnBase =
  "flex flex-col items-start gap-2 bg-card border border-border rounded-2xl px-4 py-3.5 hover:bg-muted/40 active:scale-[0.98] transition-all";

export function QuickActions({
  onRecharge,
  onUsage,
  onHistory,
  onSettings,
}: QuickActionsProps) {
  return (
    <motion.nav
      aria-label="Quick actions"
      className="grid xs:grid-cols-2 lg:grid-cols-4 gap-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
    >
      {/* Primary CTA — full width on mobile */}
      <button
        type="button"
        onClick={onRecharge}
        className="flex max-md:flex-col items-start gap-2 bg-primary border text-background border-border rounded-2xl px-4 py-3.5 hover:bg-primary/90 active:scale-[0.98] transition-all"
      >
        <IconBox variant="on-dark">
          <Zap className="size-4" />
        </IconBox>
        <div className="flex items-center justify-between gap-4 w-full">
          <span className="text-sm font-semibold">Recharge</span>
          <span className="text-xs opacity-70">Top up →</span>
        </div>
      </button>

      <button type="button" onClick={onUsage} className={btnBase}>
        <IconBox variant="primary">
          <BarChart3 className="size-4 text-primary" />
        </IconBox>
        <span className="text-sm font-semibold text-foreground">Usage</span>
      </button>

      {/* History — hidden on lg (shown via the 4th slot) */}
      <button
        type="button"
        onClick={onHistory}
        className={`${btnBase} lg:hidden`}
      >
        <IconBox variant="primary">
          <Clock className="size-4 text-primary" />
        </IconBox>
        <span className="text-sm font-semibold text-foreground">History</span>
      </button>

      {/* History — shown on lg only */}
      <button
        type="button"
        onClick={onHistory}
        className={`${btnBase} max-lg:hidden`}
      >
        <IconBox variant="primary">
          <Clock className="size-4 text-primary" />
        </IconBox>
        <span className="text-sm font-semibold text-foreground">History</span>
      </button>

      <button
        type="button"
        onClick={onSettings}
        className={`${btnBase} hidden lg:flex`}
      >
        <IconBox variant="muted">
          <Settings className="size-4 text-muted-foreground" />
        </IconBox>
        <span className="text-sm font-semibold text-foreground">Settings</span>
      </button>
    </motion.nav>
  );
}
