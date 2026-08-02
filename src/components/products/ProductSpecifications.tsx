"use client";

import { useState } from "react";
import {
  ChevronDown,
  CheckCircle2,
  Smartphone,
  Cpu,
  Camera,
  BatteryCharging,
  Wifi,
  Ruler,
  Settings,
  Volume2,
  Fingerprint,
  ListChecks,
  Monitor,
  Watch,
  Tv,
  Gamepad2,
  Video,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getKeySpecs } from "@/lib/product-specs";
import type { ProductSpecifications as Specifications } from "@/types/specifications";

const GROUP_ICONS: Record<string, LucideIcon> = {
  display: Monitor,
  performance: Cpu,
  camera: Camera,
  battery: BatteryCharging,
  connectivity: Wifi,
  design: Ruler,
  software: Settings,
  system: Settings,
  sound: Volume2,
  audio: Volume2,
  "sensors & features": Fingerprint,
  sensors: Fingerprint,
  features: ListChecks,
  network: Wifi,
  video: Video,
  watch: Watch,
  tv: Tv,
  gaming: Gamepad2,
  smartphone: Smartphone,
};

function iconForGroup(name: string): LucideIcon {
  return GROUP_ICONS[name.toLowerCase()] ?? ListChecks;
}

/**
 * Compact grid of the most important specs, shown near the top of the
 * product page. Category-aware and never renders empty entries.
 */
export function KeySpecifications({
  specifications,
  categorySlug,
}: {
  specifications: Specifications;
  categorySlug?: string | null;
}) {
  const keySpecs = getKeySpecs(specifications, categorySlug);
  if (keySpecs.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {keySpecs.map((spec) => {
        const Icon = iconForGroup(spec.group);
        return (
          <div
            key={spec.label}
            className="rounded-card border border-ocean/8 bg-white px-4 py-4 transition-all duration-200 hover:border-ocean/18 hover:shadow-sm"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-btn bg-ocean/7 text-ocean">
              <Icon className="h-4 w-4" />
            </div>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-ocean-deeper/45">
              {spec.label}
            </p>
            <p className="mt-1 text-sm font-bold text-ocean-deeper leading-snug">{spec.value}</p>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Full technical specifications, grouped into an accordion.
 * Animated open/close with CSS max-height transition.
 */
export function SpecificationsAccordion({ specifications }: { specifications: Specifications }) {
  const groups = specifications.filter((g) => g.specs.length > 0);
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(groups.slice(0, 1).map((g) => g.name))
  );

  if (groups.length === 0) return null;

  const allExpanded = openGroups.size === groups.length;

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleAll = () => {
    setOpenGroups(allExpanded ? new Set() : new Set(groups.map((g) => g.name)));
  };

  return (
    <div className="space-y-2">
      {groups.length > 1 && (
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={toggleAll}
            aria-expanded={allExpanded}
            className="inline-flex items-center gap-1.5 rounded-btn border border-ocean/12 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-ocean-deeper/60 transition-all duration-200 hover:border-ocean/25 hover:text-ocean-deeper cursor-pointer"
          >
            {allExpanded ? "Collapse all" : "Expand all"}
          </button>
        </div>
      )}

      {groups.map((group) => {
        const isOpen = openGroups.has(group.name);
        const Icon = iconForGroup(group.name);
        const panelId = `spec-panel-${group.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        const buttonId = `spec-button-${group.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

        return (
          <div
            key={group.name}
            className={cn(
              "overflow-hidden rounded-card border bg-white transition-colors duration-200",
              isOpen ? "border-ocean/15" : "border-ocean/7"
            )}
          >
            <button
              id={buttonId}
              type="button"
              onClick={() => toggleGroup(group.name)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left hover:bg-ocean/[0.02] transition-colors duration-150"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-btn bg-ocean/7 text-ocean">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-bold text-ocean-deeper">{group.name}</span>
                <span className="hidden text-[11px] font-medium text-ocean/35 sm:inline">
                  {group.specs.length} {group.specs.length === 1 ? "spec" : "specs"}
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-ocean-deeper/35 transition-transform duration-300 ease-in-out",
                  isOpen && "rotate-180 text-ocean"
                )}
              />
            </button>

            {/* Animated panel */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div className="border-t border-ocean/6 px-5 py-4 sm:pl-16">
                  <dl className="divide-y divide-ocean/5">
                    {group.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="flex items-start justify-between gap-4 py-2.5 text-sm"
                      >
                        <dt className="text-ocean-deeper/50 shrink-0 max-w-[45%]">{spec.label}</dt>
                        <dd className="text-right font-semibold text-ocean-deeper">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Admin-authored marketing highlights. */
export function ProductHighlightsList({ highlights }: { highlights: string[] }) {
  const items = highlights.filter(Boolean);
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((highlight) => (
        <div
          key={highlight}
          className="flex items-start gap-3 rounded-card border border-ocean/8 bg-white px-4 py-4 transition-colors duration-200 hover:border-ocean/15"
        >
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ocean/8 text-ocean">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-semibold text-ocean-deeper leading-snug">{highlight}</span>
        </div>
      ))}
    </div>
  );
}
