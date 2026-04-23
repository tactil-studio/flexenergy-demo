import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Loader2, Zap } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getClient } from "@/lib/smartsphere";
import type { TariffDataDto, TariffRateDataDto } from "@/lib/smartsphere/modules/tariffs";

interface TariffDrawerProps {
  contractLabel: string;
  children: React.ReactNode;
}

function formatAmount(minor: number, scale: number): string {
  return (minor / Math.pow(10, scale)).toFixed(scale);
}

function RateRow({ rate }: { rate: TariffRateDataDto }) {
  const formatted = formatAmount(rate.amountMinor, rate.scale);
  const validFrom = format(parseISO(rate.validFrom as string), "d MMM yyyy");
  const validTo = format(parseISO(rate.validTo as string), "d MMM yyyy");
  return (
    <div className="px-5 py-3.5 flex items-start justify-between gap-3 border-b border-border last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">
          {formatted} {rate.unitOfMeasure ?? "CHF/kWh"}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {validFrom} → {validTo}
        </p>
      </div>
      {rate.assigned && (
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          Active
        </span>
      )}
    </div>
  );
}

export function TariffDrawer({ contractLabel, children }: TariffDrawerProps) {
  const [open, setOpen] = useState(false);
  const [tariffs, setTariffs] = useState<TariffDataDto[]>([]);
  const [rates, setRates] = useState<TariffRateDataDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setIsLoading(true);
    setError(null);

    getClient()
      .tariffs.listElectricalTariffs({ enabled: true })
      .then(async (res) => {
        const list = res.tariffs ?? [];
        setTariffs(list);
        // Fetch rates for the first assigned tariff
        const assigned = list.find((t) => t.assigned) ?? list[0];
        if (assigned?.tariffId) {
          const ratesRes = await getClient().tariffs.listElectricalTariffRates({
            tariffId: assigned.tariffId,
          });
          setRates(ratesRes.tariffRates ?? []);
        }
      })
      .catch(() => setError("Could not load tariff details."))
      .finally(() => setIsLoading(false));
  }, [open]);

  const activeTariff = tariffs.find((t) => t.assigned) ?? tariffs[0];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Zap className="size-4 text-primary" />
            Tariff details
          </SheetTitle>
          <SheetDescription>{contractLabel}</SheetDescription>
        </SheetHeader>

        <div className="pb-6 px-5 pt-2">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <p className="text-xs text-destructive text-center py-6">{error}</p>
          ) : (
            <>
              {activeTariff && (
                <div className="mb-4 bg-muted/50 rounded-2xl px-4 py-3 border border-border">
                  <p className="text-[10px] text-muted-foreground mb-0.5 font-medium uppercase tracking-wider">Plan</p>
                  <p className="text-sm font-bold text-foreground">
                    {activeTariff.tariffName ?? activeTariff.tariffId}
                  </p>
                  {activeTariff.currency && (
                    <p className="text-[11px] text-muted-foreground">{activeTariff.currency}</p>
                  )}
                </div>
              )}
              {rates.length > 0 ? (
                <div className="rounded-2xl border border-border overflow-hidden bg-card">
                  <p className="px-5 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30 border-b border-border">
                    Rate schedule
                  </p>
                  {rates.map((r) => (
                    <RateRow key={r.tariffRateId} rate={r} />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">No rate schedule available.</p>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
