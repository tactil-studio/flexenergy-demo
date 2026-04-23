import { Check, Clock, Mail, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconBox } from "@/components/ui/icon-box";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/context/AppContext";

const TIME_INPUT_CLASS =
  "w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all";

function QuietHoursForm() {
  const { state, updateAlertSettings } = useApp();

  const savedStart = state?.alerts.startHour || "08:00";
  const savedEnd = state?.alerts.endHour || "22:00";

  const [startHour, setStartHour] = useState(savedStart);
  const [endHour, setEndHour] = useState(savedEnd);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setStartHour(savedStart);
    setEndHour(savedEnd);
  }, [savedStart, savedEnd]);

  const isDirty = startHour !== savedStart || endHour !== savedEnd;

  const handleSave = async () => {
    if (!isDirty || saving) return;
    setSaving(true);
    try {
      await updateAlertSettings({ startHour, endHour });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-start gap-3 md:gap-4 p-4 md:p-6">
      <IconBox variant="muted" size="md" className="shrink-0">
        <Clock className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
      </IconBox>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p className="font-semibold text-xs md:text-base text-foreground">Available Hours</p>
          {saved && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-success">
              <Check className="size-3" />
              Saved
            </span>
          )}
        </div>
        <p className="text-[10px] md:text-xs text-muted-foreground mb-3">
          Only send notifications between these hours
        </p>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label htmlFor="alert-start-hour" className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
              From
            </label>
            <input
              id="alert-start-hour"
              type="time"
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
              className={TIME_INPUT_CLASS}
            />
          </div>
          <span className="text-muted-foreground font-bold pb-2.5" aria-hidden="true">—</span>
          <div className="flex-1">
            <label htmlFor="alert-end-hour" className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
              To
            </label>
            <input
              id="alert-end-hour"
              type="time"
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
              className={TIME_INPUT_CLASS}
            />
          </div>
          <Button
            size="sm"
            variant={isDirty ? "primary" : "ghost"}
            disabled={!isDirty || saving}
            loading={saving}
            onClick={handleSave}
            className="shrink-0 mb-0.5"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AlertSection() {
  const { state, toggleAlert } = useApp();

  if (!state) return null;

  return (
    <section className="mb-4 md:mb-10">
      <h2 className="font-bold text-base md:text-xl mb-3 md:mb-6 px-2 text-foreground">
        Threshold & Alerts
      </h2>
      <div className="bg-card rounded-[20px] md:rounded-4xl border border-border shadow-sm overflow-hidden">
        <label className="flex justify-between items-center gap-4 p-4 md:p-6 cursor-pointer hover:bg-muted/30 transition-colors">
          <div className="flex items-center gap-3 md:gap-4">
            <IconBox variant="primary" size="md">
              <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </IconBox>
            <div>
              <p className="font-semibold text-xs md:text-base text-foreground">Email Notifications</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">Receive alerts and updates via email</p>
            </div>
          </div>
          <Switch checked={state.alerts.lowBalance} onCheckedChange={() => toggleAlert("lowBalance")} />
        </label>

        <Separator />

        <label className="flex justify-between items-center gap-4 p-4 md:p-6 cursor-pointer hover:bg-muted/30 transition-colors">
          <div className="flex items-center gap-3 md:gap-4">
            <IconBox variant="warning" size="md">
              <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-warning" />
            </IconBox>
            <div>
              <p className="font-semibold text-xs md:text-base text-foreground">SMS Notifications</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">Receive alerts and updates via SMS</p>
            </div>
          </div>
          <Switch checked={state.alerts.peakUsage} onCheckedChange={() => toggleAlert("peakUsage")} />
        </label>

        <Separator />

        <QuietHoursForm />
      </div>
    </section>
  );
}
