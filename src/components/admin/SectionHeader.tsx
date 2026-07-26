import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  action?: { label: string; href: string };
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-clash text-lg font-bold text-ocean">{title}</h2>
      {action && (
        <Link
          href={action.href}
          className="flex items-center gap-1 text-sm font-medium text-ocean hover:text-ocean-dark transition-colors"
        >
          {action.label}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
