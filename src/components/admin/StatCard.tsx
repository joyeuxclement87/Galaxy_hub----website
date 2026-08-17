import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: string; positive: boolean };
  gradient?: string;
  className?: string;
}

export function StatCard({ label, value, icon, trend, gradient = "from-[#0b5497] to-[#0f70c9]", className }: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 hover:border-slate-300 dark:hover:border-slate-500",
        className
      )}
    >
      <div className={cn("absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r opacity-80", gradient)} />

      <div className={cn(
        "pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-[0.06] blur-2xl transition-all duration-500 group-hover:opacity-[0.12] group-hover:scale-150",
        gradient
      )} />

      <div className="relative flex items-start justify-between gap-4">
        <div className="space-y-2 min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="font-clash text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{value}</p>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1.5 text-sm font-semibold",
                trend.positive ? "text-emerald-400" : "text-red-400"
              )}
            >
              <span className={cn(
                "flex h-5 w-5 items-center justify-center rounded",
                trend.positive ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300"
              )}>
                {trend.positive ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
              </span>
              {trend.value}
            </div>
          )}
        </div>
        {icon && (
          <div className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-slate-900 dark:text-slate-100 shadow-md shadow-slate-300/40 transition-all duration-300 group-hover:scale-110 group-hover:rotate-2",
            gradient
          )}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
