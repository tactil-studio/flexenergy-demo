import { AlertCircle, Bell, CheckCircle2, Info, X } from "lucide-react";
import { Popover } from "radix-ui";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/types";

function UserAvatar({ onClick }: { onClick: () => void }) {
  const { user } = useAuth();
  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((n) => (n as string)[0].toUpperCase())
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
  const navigate = useNavigate();
  const { state, markNotificationAsRead, clearNotifications } = useApp();

  const balanceMinor = state?.dashboard?.balance ?? 0;
  const scale = state?.dashboard?.scale ?? 2;
  const notifications = state?.notifications ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="size-4 text-success" />;
      case "warning":
        return <AlertCircle className="size-4 text-warning" />;
      default:
        return <Info className="size-4 text-primary" />;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0  z-40 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="flex justify-between lg:ml-40 items-center px-6 lg:px-10 h-16 lg:h-18 w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <UserAvatar onClick={() => navigate("/settings")} />
          <dl className="flex flex-col">
            <dt className="sr-only">Current balance</dt>
            <dd className="font-semibold text-lg tracking-tight text-foreground">
              {formatCurrency(balanceMinor, "CHF", scale)}
            </dd>
            <dd className="text-xs text-muted-foreground">Current balance</dd>
          </dl>
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
                  <span className="absolute top-2 right-2 size-4 bg-red-500 text-white text-[8px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            </Popover.Trigger>

            <Popover.Portal>
              <Popover.Content
                className="z-50 w-80 bg-card rounded-4xl shadow-2xl border border-border overflow-hidden outline-none animate-in fade-in zoom-in-95 duration-200"
                align="end"
                sideOffset={8}
              >
                <header className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
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
                      <X className="size-4" />
                    </Popover.Close>
                  </div>
                </header>
                <ol className="max-h-[70vh] overflow-y-auto" aria-live="polite">
                  {notifications.length === 0 ? (
                    <li className="p-10 text-center space-y-3 list-none">
                      <figure className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Bell className="size-6 text-border" aria-hidden="true" />
                      </figure>
                      <p className="text-xs text-muted-foreground">
                        No new notifications
                      </p>
                    </li>
                  ) : (
                    notifications.map((n) => (
                      <li key={n.id} className="list-none">
                        <button
                          type="button"
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`w-full text-left p-4 border-b border-border/50 hover:bg-muted/40 transition-colors cursor-pointer relative group ${!n.read ? "bg-primary/5" : ""}`}
                        >
                          {!n.read && (
                            <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary" aria-hidden="true" />
                          )}
                          <article className="flex gap-3">
                            <span className="mt-0.5 shrink-0" aria-hidden="true">
                              {getIcon(n.type)}
                            </span>
                            <div className="space-y-1">
                              <p className="text-xs font-semibold text-foreground tracking-tight">
                                {n.title}
                              </p>
                              <p className="text-xs truncate text-muted-foreground leading-relaxed">
                                {n.message}
                              </p>
                              <time
                                dateTime={n.timestamp}
                                className="text-[10px] text-muted-foreground/70"
                              >
                                {new Date(n.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </time>
                            </div>
                          </article>
                        </button>
                      </li>
                    ))
                  )}
                </ol>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>
    </header>
  );
}
