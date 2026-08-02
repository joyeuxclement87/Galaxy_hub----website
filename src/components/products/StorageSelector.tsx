"use client";

import { Check, HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Chip row for picking a product's storage size. Renders nothing when the
 * product has no storage options (e.g. accessories), so non-phone listings
 * are unaffected.
 */
export function StorageSelector({
  options,
  value,
  onChange,
  compact = false,
}: {
  options: string[];
  value: string;
  onChange: (storage: string) => void;
  compact?: boolean;
}) {
  if (options.length === 0) return null;

  return (
    <div>
      <p className={cn("flex items-center gap-1.5 text-caption font-bold uppercase tracking-wider text-ocean/50", compact ? "mb-1.5" : "mb-2")}>
        <HardDrive className="h-3.5 w-3.5" />
        Storage
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option === value;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              aria-pressed={selected}
              className={cn(
                "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-btn border px-3.5 text-xs font-bold transition-all duration-200",
                selected
                  ? "border-ocean bg-ocean text-white shadow-sm"
                  : "border-ocean/[0.15] bg-white text-ocean-deeper hover:border-ocean/40 hover:bg-ocean/[0.04]"
              )}
            >
              {selected && <Check className="h-3.5 w-3.5" />}
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
