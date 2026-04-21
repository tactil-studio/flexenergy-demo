import { format, parseISO } from "date-fns";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { Key } from "react";
import { IconBox } from "@/components/ui/icon-box";
import type { Transaction } from "@/types";
import { formatCurrency } from "@/types";

export interface TransactionRowProps {
  tx: Transaction;
  key?: Key | null;
}

export function TransactionRow({ tx }: TransactionRowProps) {
  const isCredit = tx.amountMinor > 0;

  return (
    <li className="p-4 md:p-5 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
      <article className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <IconBox variant={isCredit ? "success" : "primary"} size="lg">
            {isCredit ? (
              <ArrowDownLeft className="w-5 h-5 text-success" />
            ) : (
              <ArrowUpRight className="w-5 h-5 text-primary" />
            )}
          </IconBox>
          <div>
            <h3 className="font-semibold text-sm text-foreground capitalize">
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
      </article>
    </li>
  );
}
