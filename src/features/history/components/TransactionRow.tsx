import { format, parseISO } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, FileText, Loader2 } from "lucide-react";
import type { Key } from "react";
import { useState } from "react";
import { IconBox } from "@/components/ui/icon-box";
import { getClient } from "@/lib/smartsphere";
import type { Transaction } from "@/types";
import { formatCurrency } from "@/types";

export interface TransactionRowProps {
  tx: Transaction;
  key?: Key | null;
}

export function TransactionRow({ tx }: TransactionRowProps) {
  const isCredit = tx.amountMinor > 0;
  const [loadingPdf, setLoadingPdf] = useState(false);

  const handleViewPdf = async () => {
    if (!tx.exportId) return;
    setLoadingPdf(true);
    try {
      const response = await getClient().fileManager.downloadExport(tx.exportId);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      // Revoke after a delay to allow the new tab to load
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch {
      // silent — non-critical
    } finally {
      setLoadingPdf(false);
    }
  };

  return (
    <li className="p-4 md:p-5 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
      <article className="flex justify-between items-center gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <IconBox variant={isCredit ? "success" : "primary"} size="lg">
            {isCredit ? (
              <ArrowDownLeft className="w-5 h-5 text-success" />
            ) : (
              <ArrowUpRight className="w-5 h-5 text-primary" />
            )}
          </IconBox>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm text-foreground capitalize truncate">
              {tx.description}
            </h3>
            <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
              <time dateTime={tx.transactionDate}>
                {format(parseISO(tx.transactionDate), "MMM dd, yyyy")}
              </time>
              <span aria-hidden="true">&middot;</span>
              <span>{tx.transactionSource}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {tx.exportId && (
            <button
              type="button"
              onClick={handleViewPdf}
              disabled={loadingPdf}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 disabled:opacity-50 transition-colors"
              aria-label="View PDF"
            >
              {loadingPdf ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <FileText className="size-3.5" />
              )}
              PDF
            </button>
          )}

          <dl className="text-right">
            <dt className="sr-only">Amount</dt>
            <dd
              className={`font-bold text-base tracking-tight ${isCredit ? "text-success" : "text-foreground"}`}
            >
              {isCredit ? "+" : "-"}
              {formatCurrency(Math.abs(tx.amountMinor), tx.currency, tx.scale)}
            </dd>
            <dt className="sr-only">Status</dt>
            <dd
              className={`text-[10px] ${tx.transactionStatus === "Settled"
                ? "text-muted-foreground"
                : tx.transactionStatus === "Failed"
                  ? "text-destructive"
                  : "text-warning"
                }`}
            >
              {tx.transactionStatus}
            </dd>
          </dl>
        </div>
      </article>
    </li>
  );
}
