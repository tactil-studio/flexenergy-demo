import { cn } from "@/lib/utils";

/** Animated shimmer base block */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-muted",
        className,
      )}
    />
  );
}

/** Full hero card skeleton (dark background) */
export function HeroSkeleton() {
  return (
    <div className="bg-foreground/90 rounded-3xl p-6 md:p-8 shadow-2xl space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-3 w-24 bg-white/20" />
        <Skeleton className="h-7 w-7 rounded-xl bg-white/20" />
      </div>
      <Skeleton className="h-12 w-48 bg-white/25" />
      <Skeleton className="h-3 w-32 bg-white/15" />
      <Skeleton className="h-14 w-full bg-white/10 rounded-xl" />
    </div>
  );
}

/** Contract card skeleton */
export function ContractCardSkeleton() {
  return (
    <div className="bg-card rounded-3xl border border-border shadow-sm p-5 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-2.5 w-20" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-1.5 w-full rounded-full" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
      </div>
      <div className="flex justify-between pt-2 border-t border-border">
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

/** Chart area skeleton */
export function ChartSkeleton({ height = "h-56" }: { height?: string }) {
  return (
    <div className={cn("w-full flex items-end gap-1.5 px-2", height)}>
      {Array.from({ length: 7 }, (_, i) => (
        <Skeleton
          key={i}
          className="flex-1 rounded-t-lg"
          style={{ height: `${30 + Math.random() * 60}%` }}
        />
      ))}
    </div>
  );
}

/** Stat card row skeleton */
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="h-16 rounded-2xl" />
      <Skeleton className="h-16 rounded-2xl" />
    </div>
  );
}

/** Transaction list item skeleton */
export function TransactionSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-border/50 last:border-0">
      <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-2.5 w-20" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  );
}
