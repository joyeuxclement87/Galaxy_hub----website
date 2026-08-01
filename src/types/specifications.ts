/**
 * Galaxy Hub's own flexible product specification structure.
 *
 * Stored as JSONB in `products.specifications`. Works for any product
 * category (phones, laptops, earbuds, TVs, accessories, ...) because it's
 * just an ordered list of named groups, each containing label/value pairs —
 * no fixed per-category schema.
 *
 * This same shape is:
 *  - produced by the MobileAPI.dev normalizer (src/lib/phone-spec-normalizer.ts)
 *  - rendered directly by the admin's generic spec editor (add/edit/delete/reorder)
 *  - rendered directly by the public product page (key specs + full accordion)
 */
export interface SpecEntry {
  label: string;
  value: string;
}

export interface SpecGroup {
  name: string;
  specs: SpecEntry[];
}

export type ProductSpecifications = SpecGroup[];

/**
 * Product highlights are short marketing bullet points, always controlled
 * manually by the admin (never sourced automatically from an import).
 */
export type ProductHighlights = string[];

/**
 * Safely coerce an unknown JSONB value (e.g. straight from Supabase) into a
 * valid ProductSpecifications array. Falls back to an empty list instead of
 * throwing on malformed/legacy data.
 */
export function toProductSpecifications(value: unknown): ProductSpecifications {
  if (!Array.isArray(value)) return [];

  const groups: SpecGroup[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const name = (item as Record<string, unknown>).name;
    const specsRaw = (item as Record<string, unknown>).specs;
    if (typeof name !== "string" || !Array.isArray(specsRaw)) continue;

    const specs: SpecEntry[] = [];
    for (const spec of specsRaw) {
      if (!spec || typeof spec !== "object") continue;
      const label = (spec as Record<string, unknown>).label;
      const val = (spec as Record<string, unknown>).value;
      if (typeof label === "string" && typeof val === "string") {
        specs.push({ label, value: val });
      }
    }

    groups.push({ name, specs });
  }
  return groups;
}

/**
 * Safely coerce an unknown JSONB value into a valid ProductHighlights array.
 */
export function toProductHighlights(value: unknown): ProductHighlights {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

/**
 * Safely coerce an unknown JSONB value into a valid list of selectable
 * storage options (e.g. ["128GB", "256GB", "512GB"]).
 */
export function toStorageOptions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
}
