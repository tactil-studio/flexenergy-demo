/**
 * StatusBadge — maps a service status string to the correct semantic colour.
 * Active → success, Warning/Grace → warning, everything else → destructive.
 */
interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isActive = status === "Active";
  const isWarning = status === "Warning" || status === "Grace";

  const cls = isActive
    ? "bg-success/10 text-success"
    : isWarning
      ? "bg-warning/10 text-warning"
      : "bg-destructive/10 text-destructive";

  const dot = isActive
    ? "bg-success"
    : isWarning
      ? "bg-warning"
      : "bg-destructive";

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}
