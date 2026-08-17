"use client";

import { useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { ProductHighlights } from "@/types/specifications";

interface HighlightsEditorProps {
  value: ProductHighlights;
  onChange: (value: ProductHighlights) => void;
}

const MAX_HIGHLIGHTS = 5;

/**
 * Simple manual list of 3-5 marketing highlight lines, e.g. "200MP Pro
 * Camera". Always admin-authored — never sourced automatically from an
 * import, per Galaxy Hub's commercial-independence requirement.
 */
export function HighlightsEditor({ value, onChange }: HighlightsEditorProps) {
  const updateAt = useCallback(
    (index: number, next: string) => {
      const items = [...value];
      items[index] = next;
      onChange(items);
    },
    [value, onChange]
  );

  const removeAt = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange]
  );

  const add = useCallback(() => {
    if (value.length >= MAX_HIGHLIGHTS) return;
    onChange([...value, ""]);
  }, [value, onChange]);

  return (
    <div className="space-y-2">
      {value.map((highlight, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={highlight}
            onChange={(e) => updateAt(index, e.target.value)}
            placeholder="e.g. 200MP Pro Camera"
            className="flex-1 rounded-lg border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:outline-none focus:ring-2 focus:ring-ocean/20"
          />
          <button
            type="button"
            onClick={() => removeAt(index)}
            className="rounded-lg p-2 text-red-400/70 hover:bg-red-50 hover:text-red-400"
            aria-label="Remove highlight"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}

      {value.length < MAX_HIGHLIGHTS && (
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-accent dark:text-[#8ec5f2] hover:bg-ocean/10"
        >
          <Plus className="h-3.5 w-3.5" /> Add Highlight
        </button>
      )}
      <p className="text-xs text-slate-400 dark:text-slate-500">Up to {MAX_HIGHLIGHTS} short highlights, shown on the product page.</p>
    </div>
  );
}
