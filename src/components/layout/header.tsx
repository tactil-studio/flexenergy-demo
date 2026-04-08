import { AlertCircle, Bell, CheckCircle2, Info, X } from "lucide-react";
import { Popover } from "radix-ui";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/types";

function UserAvatar({ onClick }: { onClick: () => void }) {
  const { user } = useAuth();
  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((n) => n![0].toUpperCase())
    .join("") || "?";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-border hover:ring-2 hover:ring-ring transition-all active:scale-95 shrink-0"
      aria-label="Open settings"
    >
      <span className="text-sm font-bold text-primary">{initials}</span>
    </button>
  );
}

export function Header() {
  const { state, markNotificationAsRead, clearNotifications, setView } =
    useApp();

  const balanceMinor = state?.dashboard?.balance ?? 0;
  const scale = state?.dashboard?.scale ?? 2;
  const notifications = state?.notifications ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-warning" />;
      default:
        return <Info className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="flex justify-between items-center px-6 h-16 w-full max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <UserAvatar onClick={() => setView("settings")} />
          <div className="flex flex-col">
            <span className="font-semibold text-lg tracking-tight text-foreground">
              {formatCurrency(balanceMinor, "CHF", scale)}
            </span>
            <span className="text-xs text-muted-foreground">Current balance</span>
          </div>
        </div>

        <div className="relative">
          <Popover.Root>
            <Popover.Trigger asChild>
              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors active:scale-95 relative outline-none"
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[8px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            </Popover.Trigger>

            <Popover.Portal>
              <Popover.Content
                className="z-50 w-80 bg-card rounded-[32px] shadow-2xl border border-border overflow-hidden outline-none animate-in fade-in zoom-in-95 duration-200"
                align="end"
                sideOffset={8}
              >
                <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                  <h3 className="font-semibold text-sm text-foreground">
                    Notifications
                  </h3>
                  <div className="flex gap-3 items-center">
                    <button
                      type="button"
                      onClick={() => clearNotifications()}
                      className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Clear all
                    </button>
                    <Popover.Close className="text-muted-foreground hover:text-foreground transition-colors">
                      <X className="w-4 h-4" />
                    </Popover.Close>
                  </div>
                </div>
                <div className="max-h-[70vh] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center space-y-3">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Bell className="w-6 h-6 text-border" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        No new notifications
                      </p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <button
                        type="button"
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`w-full text-left p-4 border-b border-border/50 hover:bg-muted/40 transition-colors cursor-pointer relative group ${!n.read ? "bg-primary/5" : ""}`}
                      >
                        {!n.read && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                        )}
                        <div className="flex gap-3">
                          <div className="mt-0.5 shrink-0">
                            {getIcon(n.type)}
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-foreground tracking-tight">
                              {n.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              {n.message}
                            </p>
                            <p className="text-[10px] text-muted-foreground/70">
                              {new Date(n.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>
    </header>
  );
}
