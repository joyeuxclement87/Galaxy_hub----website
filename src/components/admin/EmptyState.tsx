import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438]/60 px-6 py-10 text-center",
        className
      )}
    >
      {icon && <div className="mb-3 text-slate-300 dark:text-slate-600">{icon}</div>}
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-400 dark:text-slate-500">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}