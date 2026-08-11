import type { ProductSpecifications } from "@/types/specifications";

/**
 * Pure helpers for deriving "key specifications" from a product's stored
 * specifications. Kept server-safe (no "use client") so pages can decide
 * server-side whether a section should render at all.
 *
 * Category-aware: the priority list of specs depends on the product category
 * (smartphones, laptops, audio, ...). Categories that don't exist simply
 * match nothing — no empty cards are ever produced.
 */

export interface KeySpecEntry {
  label: string;
  value: string;
  group: string;
}

interface KeySpecDefinition {
  label: string;
  labelMatches: string[];
  combine?: string[];
  exclude?: string[];
}

type CategoryType =
  | "smartphones"
  | "tablets"
  | "laptops"
  | "audio"
  | "watches"
  | "tvs"
  | "cameras"
  | "gaming"
  | "default";

function categoryType(slug?: string | null): CategoryType {
  const s = (slug || "").toLowerCase();
  if (s.includes("phone")) return "smartphones";
  if (s.includes("tablet")) return "tablets";
  if (s.includes("laptop") || s.includes("computer") || s.includes("macbook")) return "laptops";
  if (s.includes("earbud") || s.includes("audio") || s.includes("headphone") || s.includes("speaker")) return "audio";
  if (s.includes("watch")) return "watches";
  if (s.includes("tv") || s.includes("television")) return "tvs";
  if (s.includes("camera")) return "cameras";
  if (s.includes("gaming") || s.includes("console")) return "gaming";
  return "default";
}

const D = { label: "Display", labelMatches: ["Screen Size", "Display Type"], combine: ["Screen Size", "Display Type"] };
const P = { label: "Processor", labelMatches: ["Processor", "Chipset"] };
const R = { label: "RAM", labelMatches: ["RAM", "Memory"], exclude: ["internal", "flash", "rom", "storage"] };
const S = { label: "Storage", labelMatches: ["Storage", "Internal Memory"] };
const C = { label: "Camera", labelMatches: ["Main Camera", "Rear Camera"] };
const B = { label: "Battery", labelMatches: ["Capacity", "Battery"] };
const N = { label: "Network", labelMatches: ["Network", "5G"] };
const OS = { label: "Operating System", labelMatches: ["Operating System", "OS"] };
const G = { label: "Graphics", labelMatches: ["GPU", "Graphics"] };
const W = { label: "Weight", labelMatches: ["Weight"] };
const AU = { label: "Audio", labelMatches: ["Loudspeaker", "Drivers", "ANC", "Audio"] };
const MIC = { label: "Microphones", labelMatches: ["Microphone"] };
const CON = { label: "Connectivity", labelMatches: ["Bluetooth", "Wi-Fi"] };
const SENS = { label: "Sensors", labelMatches: ["Sensors"] };
const FEAT = { label: "Features", labelMatches: ["Other Features", "Features"] };
const VID = { label: "Video", labelMatches: ["Video Recording"] };
const REF = { label: "Refresh Rate", labelMatches: ["Refresh Rate"] };

const KEY_SPEC_DEFINITIONS: Record<CategoryType, KeySpecDefinition[]> = {
  smartphones: [D, P, R, S, C, B, N, OS],
  tablets: [D, P, R, S, C, B, N, OS],
  laptops: [D, P, R, S, G, B, OS, W],
  audio: [AU, B, CON, MIC, FEAT],
  watches: [D, REF, SENS, B, CON, OS],
  tvs: [D, REF, AU, CON, OS],
  cameras: [C, VID, S, B, W, CON],
  gaming: [P, G, R, S, D, B],
  default: [D, P, R, S, C, B, N, OS],
};

function findSpecValues(
  specifications: ProductSpecifications,
  labelMatches: string[],
  exclude: string[] = []
): { value: string; group: string }[] {
  const found: { value: string; group: string }[] = [];
  const seen = new Set<string>();
  for (const group of specifications) {
    for (const wanted of labelMatches) {
      for (const spec of group.specs) {
        const label = spec.label.toLowerCase();
        if (label.includes(wanted.toLowerCase()) && spec.value) {
          if (exclude.some((x) => label.includes(x.toLowerCase()))) continue;
          const key = `${group.name}:${spec.label}`;
          if (!seen.has(key)) {
            seen.add(key);
            found.push({ value: spec.value, group: group.name });
          }
        }
      }
    }
  }
  return found;
}

export function getKeySpecs(
  specifications: ProductSpecifications,
  categorySlug?: string | null
): KeySpecEntry[] {
  if (specifications.length === 0) {
    return [];
  }

  const type = categoryType(categorySlug);
  const defs = KEY_SPEC_DEFINITIONS[type];
  const entries: KeySpecEntry[] = [];

  for (const def of defs) {
    const matches = findSpecValues(specifications, def.combine || def.labelMatches, def.exclude);
    if (matches.length === 0) continue;
    entries.push({
      label: def.label,
      value: matches.map((m) => m.value).join(" · "),
      group: matches[0].group,
    });
  }

  return entries;
}
