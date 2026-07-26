import { cn } from "@/lib/utils";

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-white/8",
        className
      )}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/8 bg-white/5 p-5">
      <div className="space-y-3">
        <SkeletonPulse className="h-3 w-20" />
        <SkeletonPulse className="h-8 w-16" />
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
          <SkeletonPulse className="h-9 w-9 rounded-xl" />
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
