import { cn } from "@/lib/utils";

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-100 dark:bg-[#162f4a]",
        className
      )}
    />
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] p-5">
      <div className="space-y-3">
        <SkeletonPulse className="h-3 w-24" />
        <SkeletonPulse className="h-8 w-28" />
        <SkeletonPulse className="h-3 w-20" />
      </div>
    </div>
  );
}

export function WidgetSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] p-5">
      <SkeletonPulse className="h-4 w-32" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonPulse key={i} className={cn("h-9", i % 2 ? "w-full" : "w-5/6")} />
        ))}
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-3.5">
          <SkeletonPulse className={cn("h-4", i === 0 ? "w-32" : "w-20")} />
        </td>
      ))}
    </tr>
  );
}

export function ProductRowSkeleton() {
  return (
    <tr>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <SkeletonPulse className="h-9 w-9 rounded-lg" />
          <SkeletonPulse className="h-4 w-36" />
        </div>
      </td>
      <td className="px-5 py-3.5">
        <SkeletonPulse className="h-4 w-20" />
      </td>
      <td className="px-5 py-3.5">
        <SkeletonPulse className="h-4 w-16" />
      </td>
      <td className="px-5 py-3.5">
        <SkeletonPulse className="h-4 w-24" />
      </td>
    </tr>
  );
}