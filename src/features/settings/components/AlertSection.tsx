import { Clock, Mail, MessageSquare } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/context/AppContext";

export function AlertSection() {
  const { state, toggleAlert, updateAlertSettings } = useApp();

  if (!state) return null;

  return (
    <section className="mb-4 md:mb-10">
      <h2 className="font-bold text-base md:text-xl mb-3 md:mb-6 px-2 text-foreground">
        Threshold & Alerts
      </h2>
      <ul className="bg-card rounded-[20px] md:rounded-[32px] overflow-hidden border border-border shadow-sm list-none p-0">
        <li className="p-3.5 md:p-6 hover:bg-muted/30 transition-colors">
          <label className="flex justify-between items-center gap-4 cursor-pointer">
            <div className="flex items-center gap-3 md:gap-4">
              <span className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-2xl bg-primary/10 flex items-center justify-center" aria-hidden="true">
                <Mail className="w-4.5 h-4.5 md:w-6 md:h-6 text-primary" />
              </span>
              <div>
                <p className="font-semibold text-xs md:text-base text-foreground">
                  Email Notifications
                </p>
                <p className="text-[10px] md:text-xs text-muted-foreground">
                  Receive alerts and updates via email
                </p>
              </div>
            </div>
            <Switch
              checked={state.alerts.lowBalance}
              onCheckedChange={() => toggleAlert("lowBalance")}
            />
          </label>
        </li>
        <li className="p-3.5 md:p-6 hover:bg-muted/30 transition-colors border-t border-border">
          <label className="flex justify-between items-center gap-4 cursor-pointer">
            <div className="flex items-center gap-3 md:gap-4">
              <span className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-2xl bg-warning/10 flex items-center justify-center" aria-hidden="true">
                <MessageSquare className="w-4.5 h-4.5 md:w-6 md:h-6 text-warning" />
              </span>
              <div>
                <p className="font-semibold text-xs md:text-base text-foreground">
                  SMS Notifications
                </p>
                <p className="text-[10px] md:text-xs text-muted-foreground">
                  Receive alerts and updates via SMS
                </p>
              </div>
            </div>
            <Switch
              checked={state.alerts.peakUsage}
              onCheckedChange={() => toggleAlert("peakUsage")}
            />
          </label>
        </li>
        <li className="p-3.5 md:p-6 border-t border-border">
          <div className="flex items-start gap-3 md:gap-4">
            <span className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-2xl bg-muted flex items-center justify-center shrink-0" aria-hidden="true">
              <Clock className="w-4.5 h-4.5 md:w-6 md:h-6 text-muted-foreground" />
            </span>
            <div className="flex-1">
              <p className="font-semibold text-xs md:text-base text-foreground mb-0.5">
                Quiet Hours
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground mb-3">
                Only send notifications between these hours
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label htmlFor="alert-start-hour" className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wide">From</label>
                  <input
                    id="alert-start-hour"
                    type="time"
                    value={state.alerts.startHour}
                    onChange={(e) => updateAlertSettings({ startHour: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>
                <span className="text-muted-foreground font-bold mt-5">—</span>
                <div className="flex-1">
                  <label htmlFor="alert-end-hour" className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wide">To</label>
                  <input
                    id="alert-end-hour"
                    type="time"
                    value={state.alerts.endHour}
                    onChange={(e) => updateAlertSettings({ endHour: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </section>
  );
}
