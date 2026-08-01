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
  Eye,
  EyeOff,
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
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {keySpecs.map((spec) => {
        const Icon = iconForGroup(spec.group);
        return (
          <div
            key={spec.label}
            className="rounded-card border border-ocean/8 bg-white px-4 py-4 transition-colors duration-200 hover:border-ocean/15"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-btn bg-ocean/8 text-ocean">
              <Icon className="h-4 w-4" />
            </div>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-ocean-deeper/50">{spec.label}</p>
            <p className="mt-1 text-sm font-bold text-ocean-deeper leading-snug">{spec.value}</p>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Full technical specifications, grouped into an accordion. Empty groups
 * never render. One group is open initially; a compact control expands or
 * collapses everything at once.
 */
export function SpecificationsAccordion({ specifications }: { specifications: Specifications }) {
  const groups = specifications.filter((g) => g.specs.length > 0);
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set(groups.slice(0, 1).map((g) => g.name)));

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
    <div className="space-y-3">
      {groups.length > 1 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={toggleAll}
            aria-expanded={allExpanded}
            className="group inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-btn border border-ocean/15 bg-white/60 px-4 text-[10px] font-bold uppercase tracking-[0.12em] text-ocean-deeper/70 backdrop-blur-sm transition-all duration-300 hover:border-ocean/30 hover:bg-white hover:text-ocean-deeper"
          >
            {allExpanded ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
            {allExpanded ? "Hide specifications" : "Show all specifications"}
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
              isOpen ? "border-ocean/15" : "border-ocean/8"
            )}
          >
            <button
              id={buttonId}
              type="button"
              onClick={() => toggleGroup(group.name)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-btn bg-ocean/8 text-ocean">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-bold text-ocean-deeper">{group.name}</span>
                <span className="hidden text-xs font-medium text-ocean/40 sm:inline">
                  {group.specs.length} {group.specs.length === 1 ? "item" : "items"}
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-ocean-deeper/40 transition-transform duration-300",
                  isOpen && "rotate-180 text-ocean"
                )}
              />
            </button>
            {isOpen && (
              <div id={panelId} role="region" aria-labelledby={buttonId} className="border-t border-ocean/6 px-5 py-4 sm:pl-16">
                <dl className="divide-y divide-ocean/6">
                  {group.specs.map((spec) => (
                    <div key={spec.label} className="flex items-start justify-between gap-4 py-2.5 text-sm">
                      <dt className="text-ocean-deeper/55">{spec.label}</dt>
                      <dd className="text-right font-semibold text-ocean-deeper">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
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
        <div key={highlight} className="flex items-start gap-2.5 rounded-card border border-ocean/8 bg-white px-4 py-3.5">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ocean" />
          <span className="text-sm font-semibold text-ocean-deeper leading-snug">{highlight}</span>
        </div>
      ))}
    </div>
  );
}
