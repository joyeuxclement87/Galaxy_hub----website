import { PackageOpen } from "lucide-react";

export function EmptyState({
  icon: Icon = PackageOpen,
  title = "Nothing here yet",
  description,
  action,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-ocean-light/40 text-ocean/50">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="font-clash text-lg font-bold text-[#10233D]">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-ocean/60">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
