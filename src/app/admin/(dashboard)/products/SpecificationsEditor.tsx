"use client";

import { useCallback, useMemo } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Sparkles } from "lucide-react";
import type { ProductSpecifications, SpecGroup } from "@/types/specifications";
import { getSpecificationTemplate } from "@/lib/category-spec-templates";

interface SpecificationsEditorProps {
  value: ProductSpecifications;
  onChange: (value: ProductSpecifications) => void;
  /** Optional category so the editor can suggest the right groups. */
  categoryName?: string | null;
  categorySlug?: string | null;
}

/**
 * Fully manual, non-technical editor for the flexible specifications
 * structure. Works whether the groups came from a MobileAPI import or were
 * typed in by hand — there is no JSON and no fixed schema, just group
 * names and label/value rows.
 */
export function SpecificationsEditor({ value, onChange, categoryName, categorySlug }: SpecificationsEditorProps) {
  const template = useMemo(
    () => getSpecificationTemplate(categoryName, categorySlug),
    [categoryName, categorySlug]
  );

  const existingGroupNames = useMemo(() => new Set(value.map((g) => g.name.trim().toLowerCase())), [value]);

  const addTemplateGroup = useCallback(
    (groupName: string, fields: string[]) => {
      onChange([
        ...value,
        {
          name: groupName,
          specs: fields.map((label) => ({ label, value: "" })),
        },
      ]);
    },
    [value, onChange]
  );

  const addAllTemplateGroups = useCallback(() => {
    if (!template) return;
    const missing = template.groups.filter((g) => !existingGroupNames.has(g.name.toLowerCase()));
    onChange([
      ...value,
      ...missing.map((g) => ({ name: g.name, specs: g.fields.map((label) => ({ label, value: "" })) })),
    ]);
  }, [template, existingGroupNames, value, onChange]);
  const updateGroup = useCallback(
    (index: number, next: SpecGroup) => {
      const groups = [...value];
      groups[index] = next;
      onChange(groups);
    },
    [value, onChange]
  );

  const removeGroup = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange]
  );

  const moveGroup = useCallback(
    (index: number, direction: -1 | 1) => {
      const target = index + direction;
      if (target < 0 || target >= value.length) return;
      const groups = [...value];
      [groups[index], groups[target]] = [groups[target], groups[index]];
      onChange(groups);
    },
    [value, onChange]
  );

  const addGroup = useCallback(() => {
    onChange([...value, { name: "New Group", specs: [{ label: "", value: "" }] }]);
  }, [value, onChange]);

  return (
    <div className="space-y-4">
      {template && (
        <div className="rounded-xl border border-ocean/20 bg-ocean/[0.05] p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-ocean-light" />
            <p className="text-sm font-bold text-white">
              Suggested groups for {template.displayName}
            </p>
          </div>
          <p className="mt-1 text-xs text-white/40">
            Click a group to add it with its usual fields — you only fill in the details that exist.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {template.groups.map((group) => {
              const alreadyAdded = existingGroupNames.has(group.name.toLowerCase());
              return (
                <button
                  key={group.name}
                  type="button"
                  onClick={() => addTemplateGroup(group.name, group.fields)}
                  disabled={alreadyAdded}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    alreadyAdded
                      ? "border-white/5 bg-white/[0.02] text-white/25"
                      : "border-ocean/25 bg-ocean/10 text-ocean-light hover:bg-ocean/20 cursor-pointer"
                  }`}
                >
                  {group.name}
                  {alreadyAdded && " ✓"}
                </button>
              );
            })}
          </div>
          {value.length === 0 && (
            <button
              type="button"
              onClick={addAllTemplateGroups}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-ocean px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-ocean-dark cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add all suggested groups
            </button>
          )}
        </div>
      )}

      {value.length === 0 && (
        <p className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-center text-xs text-white/30">
          No specifications yet. Import from a phone search above, copy from an existing product, or add a group manually.
        </p>
      )}

      {value.map((group, groupIndex) => (
        <div key={groupIndex} className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={group.name}
              onChange={(e) => updateGroup(groupIndex, { ...group, name: e.target.value })}
              placeholder="Group name, e.g. Display"
              className="flex-1 rounded-lg border border-white/8 bg-white/5 px-3 py-2 text-sm font-bold text-white placeholder:text-white/25 focus:border-ocean/40 focus:outline-none focus:ring-2 focus:ring-ocean/20"
            />
            <button
              type="button"
              onClick={() => moveGroup(groupIndex, -1)}
              disabled={groupIndex === 0}
              className="rounded-lg p-2 text-white/30 hover:bg-white/10 hover:text-white/60 disabled:opacity-20"
              aria-label="Move group up"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => moveGroup(groupIndex, 1)}
              disabled={groupIndex === value.length - 1}
              className="rounded-lg p-2 text-white/30 hover:bg-white/10 hover:text-white/60 disabled:opacity-20"
              aria-label="Move group down"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => removeGroup(groupIndex)}
              className="rounded-lg p-2 text-red-400/70 hover:bg-red-500/10 hover:text-red-400"
              aria-label="Remove group"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {group.specs.map((spec, specIndex) => (
              <div key={specIndex} className="flex items-center gap-2">
                <input
                  type="text"
                  value={spec.label}
                  onChange={(e) => {
                    const specs = [...group.specs];
                    specs[specIndex] = { ...specs[specIndex], label: e.target.value };
                    updateGroup(groupIndex, { ...group, specs });
                  }}
                  placeholder="Specification name, e.g. Screen Size"
                  className="w-1/3 rounded-lg border border-white/8 bg-white/5 px-3 py-2 text-xs text-white/70 placeholder:text-white/25 focus:border-ocean/40 focus:outline-none focus:ring-2 focus:ring-ocean/20"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => {
                    const specs = [...group.specs];
                    specs[specIndex] = { ...specs[specIndex], value: e.target.value };
                    updateGroup(groupIndex, { ...group, specs });
                  }}
                  placeholder="Value, e.g. 6.9 inches"
                  className="flex-1 rounded-lg border border-white/8 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/25 focus:border-ocean/40 focus:outline-none focus:ring-2 focus:ring-ocean/20"
                />
                <button
                  type="button"
                  onClick={() => {
                    const specs = group.specs.filter((_, i) => i !== specIndex);
                    updateGroup(groupIndex, { ...group, specs });
                  }}
                  className="rounded-lg p-2 text-red-400/70 hover:bg-red-500/10 hover:text-red-400"
                  aria-label="Remove specification"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => updateGroup(groupIndex, { ...group, specs: [...group.specs, { label: "", value: "" }] })}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-ocean-light hover:bg-ocean/10"
            >
              <Plus className="h-3.5 w-3.5" /> Add Specification
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addGroup}
        className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/60 hover:bg-white/10"
      >
        <Plus className="h-4 w-4" /> Add Specification Group
      </button>
    </div>
  );
}
