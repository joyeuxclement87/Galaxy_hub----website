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
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-white/8 bg-white/[0.02] px-6 py-12 text-center",
        className
      )}
    >
      {icon && <div className="mb-4 text-white/20">{icon}</div>}
      <p className="font-clash text-base font-semibold text-white/50">
        {title}
      </p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-white/30">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
