/**
 * StatusBadge — maps a service status string to a friendly label + semantic colour.
 * Active → success, Warning/Grace/GraceState → warning, everything else → destructive.
 */
interface StatusBadgeProps {
  status: string;
}

const STATUS_LABEL: Record<string, string> = {
  Active: "Active",
  Warning: "Warning",
  Grace: "Grace period",
  GraceState: "Grace period",
  Suspended: "Suspended",
  Closed: "Closed",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const label = STATUS_LABEL[status] ?? status;

  const isActive = status === "Active";
  const isWarning = ["Warning", "Grace", "GraceState"].includes(status);

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
      {label}
    </span>
  );
}
