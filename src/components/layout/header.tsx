import * as Popover from "@radix-ui/react-popover";
import { AlertCircle, Bell, CheckCircle2, Info, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/types";

export function Header() {
  const { state, markNotificationAsRead, clearNotifications, setView } =
    useApp();

  const balanceMinor = state?.dashboard?.balance ?? 0;
  const notifications = state?.notifications ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="flex justify-between items-center px-6 h-16 w-full max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setView("settings")}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 hover:ring-2 hover:ring-blue-500 transition-all active:scale-95"
          >
            <img
              alt="User profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1iN5215bFBQ8p7aCPHj1Xya1AhQR1dnxxz1ACZ0IVU8q_GEVUKKjNwC48EI_oVze1i9QKHAODwefwVOVub3pU3tqk3o70i-i_454s1l404RJxmCsXSiOyH5uhinaP60DiKo95yfsyQOkytRBaC8Qdl2vqifxfbWN_6vPdBkagP7FI1-4EYmVLAkmJ6_SJovyxvkvUkHA_ujvdxystB7-A98IBCpeiIIQMKswUCUlvlzsuU7iGZ3YTsK3St3cayHAtiYGlxNkl0cAx"
              referrerPolicy="no-referrer"
            />
          </button>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-slate-900">
              {formatCurrency(balanceMinor)}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
              FlexEnergy Balance
            </span>
          </div>
        </div>

        <div className="relative">
          <Popover.Root>
            <Popover.Trigger asChild>
              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors active:scale-95 relative outline-none"
              >
                <Bell className="w-5 h-5 text-slate-500" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[8px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            </Popover.Trigger>

            <Popover.Portal>
              <Popover.Content
                className="z-50 w-80 bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden outline-none animate-in fade-in zoom-in-95 duration-200"
                align="end"
                sideOffset={8}
              >
                <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-xs text-slate-900 uppercase tracking-widest">
                    Notifications
                  </h3>
                  <div className="flex gap-3 items-center">
                    <button
                      type="button"
                      onClick={() => clearNotifications()}
                      className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
                    >
                      Clear All
                    </button>
                    <Popover.Close className="text-slate-400 hover:text-slate-600 transition-colors">
                      <X className="w-4 h-4" />
                    </Popover.Close>
                  </div>
                </div>
                <div className="max-h-[70vh] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center space-y-3">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                        <Bell className="w-6 h-6 text-slate-200" />
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        No new notifications
                      </p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <button
                        type="button"
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`w-full text-left p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer relative group ${!n.read ? "bg-blue-50/30" : ""}`}
                      >
                        {!n.read && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                        )}
                        <div className="flex gap-3">
                          <div className="mt-0.5 shrink-0">
                            {getIcon(n.type)}
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                              {n.title}
                            </p>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              {n.message}
                            </p>
                            <p className="text-[9px] text-slate-400 font-medium">
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
