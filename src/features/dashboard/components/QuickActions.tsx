import { BarChart3, Clock, Settings, Zap } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { IconBox } from "@/components/ui/icon-box";

interface QuickActionsProps {
  onRecharge: () => void;
  onUsage: () => void;
  onHistory: () => void;
  onSettings: () => void;
}

const actionCls =
  "flex flex-col items-start gap-2 h-auto bg-card border border-border rounded-2xl px-4 py-3.5 hover:bg-muted/40 text-foreground justify-start";

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
      <Button
        variant="primary"
        onClick={onRecharge}
        className="flex max-md:flex-col items-start gap-2 h-auto rounded-2xl px-4 py-3.5 justify-start"
      >
        <IconBox variant="on-dark">
          <Zap className="size-4" />
        </IconBox>
        <div className="flex items-center justify-between gap-4 w-full">
          <span className="text-sm font-semibold">Recharge</span>
          <span className="text-xs opacity-70">Top up →</span>
        </div>
      </Button>

      <Button variant="ghost" onClick={onUsage} className={actionCls}>
        <IconBox variant="primary">
          <BarChart3 className="size-4 text-primary" />
        </IconBox>
        <span className="text-sm font-semibold">Usage</span>
      </Button>

      {/* History — hidden on lg */}
      <Button variant="ghost" onClick={onHistory} className={`${actionCls} lg:hidden`}>
        <IconBox variant="primary">
          <Clock className="size-4 text-primary" />
        </IconBox>
        <span className="text-sm font-semibold">History</span>
      </Button>

      {/* History — shown on lg only */}
      <Button variant="ghost" onClick={onHistory} className={`${actionCls} max-lg:hidden`}>
        <IconBox variant="primary">
          <Clock className="size-4 text-primary" />
        </IconBox>
        <span className="text-sm font-semibold">History</span>
      </Button>

      <Button variant="ghost" onClick={onSettings} className={`${actionCls} hidden lg:flex`}>
        <IconBox variant="muted">
          <Settings className="size-4 text-muted-foreground" />
        </IconBox>
        <span className="text-sm font-semibold">Settings</span>
      </Button>
    </motion.nav>
  );
}
