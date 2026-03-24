import { AlertTriangle, BarChart2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/context/AppContext";

export function AlertSection() {
  const { state, toggleAlert } = useApp();

  if (!state) return null;

  return (
    <section className="mb-4 md:mb-10">
      <h2 className="font-bold text-base md:text-xl mb-3 md:mb-6 px-2 text-slate-900">
        Threshold & Alerts
      </h2>
      <div className="bg-white rounded-[20px] md:rounded-[32px] overflow-hidden border border-slate-50 shadow-sm">
        <div className="p-3.5 md:p-6 hover:bg-slate-50/50 transition-colors">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-2xl bg-orange-50 flex items-center justify-center">
                <AlertTriangle className="w-4.5 h-4.5 md:w-6 md:h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-xs md:text-base text-slate-900">
                  Low Balance Alert
                </h3>
                <p className="text-[9px] md:text-xs text-slate-500 font-medium">
                  Notify when balance is below $20.00
                </p>
              </div>
            </div>
            <Switch
              checked={state.alerts.lowBalance}
              onCheckedChange={() => toggleAlert("lowBalance")}
            />
          </div>
        </div>
        <div className="p-3.5 md:p-6 hover:bg-slate-50/50 transition-colors border-t border-slate-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-2xl bg-blue-50 flex items-center justify-center">
                <BarChart2 className="w-4.5 h-4.5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-xs md:text-base text-slate-900">
                  Peak Usage Warning
                </h3>
                <p className="text-[9px] md:text-xs text-slate-500 font-medium">
                  Instant alerts for unusual energy spikes
                </p>
              </div>
            </div>
            <Switch
              checked={state.alerts.peakUsage}
              onCheckedChange={() => toggleAlert("peakUsage")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
