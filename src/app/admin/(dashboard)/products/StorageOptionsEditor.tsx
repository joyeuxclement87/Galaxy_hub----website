"use client";

import { useCallback, useState } from "react";
import { Plus, X } from "lucide-react";

export const DEVICE_STORAGE_OPTIONS = ["64GB", "128GB", "256GB", "512GB", "1TB", "2TB"];
export const SMARTWATCH_STORAGE_OPTIONS = ["8GB", "16GB", "32GB", "64GB"];
export const LAPTOP_RAM_OPTIONS = ["4GB", "8GB", "16GB", "32GB", "64GB"];

interface StorageOptionsEditorProps {
  value: string[];
  onChange: (value: string[]) => void;
  presets?: string[];
  ramPresets?: string[];
}

/**
 * Edits the selectable storage sizes offered for a product (e.g. 128GB,
 * 256GB, 512GB). Customers pick one of these when ordering. Empty for
 * products without storage variants.
 */
export function StorageOptionsEditor({ value, onChange, presets, ramPresets }: StorageOptionsEditorProps) {
  const [draft, setDraft] = useState("");

  const add = useCallback(() => {
    const option = draft.trim();
    if (!option) return;
    if (value.includes(option)) {
      setDraft("");
      return;
    }
    onChange([...value, option]);
    setDraft("");
  }, [draft, value, onChange]);

  const remove = useCallback(
    (option: string) => {
      onChange(value.filter((v) => v !== option));
    },
    [value, onChange]
  );

  const addPreset = useCallback(
    (option: string) => {
      if (option && !value.includes(option)) {
        onChange([...value, option]);
      }
    },
    [value, onChange]
  );

  const availablePresets = presets ? presets.filter((p) => !value.includes(p)) : [];
  const availableRamPresets = ramPresets ? ramPresets.filter((p) => !value.includes(p)) : [];

  const renderPresetSelect = (label: string, placeholder: string, options: string[]) => (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-1.5">
        {label}
      </label>
      <select
        value=""
        onChange={(e) => addPreset(e.target.value)}
        className="block w-full max-w-xs rounded-lg border border-white/8 bg-white/5 px-3 py-2 text-sm text-white focus:border-ocean/40 focus:outline-none focus:ring-2 focus:ring-ocean/20"
      >
        <option value="">{placeholder}</option>
        {options.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {value.map((option) => (
          <span
            key={option}
            className="inline-flex items-center gap-1.5 rounded-lg border border-ocean/25 bg-ocean/10 px-3 py-1.5 text-xs font-semibold text-ocean-light"
          >
            {option}
            <button
              type="button"
              onClick={() => remove(option)}
              className="rounded p-0.5 text-ocean-light/50 hover:bg-ocean/20 hover:text-white"
              aria-label={`Remove ${option}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {availablePresets.length > 0 && (
          renderPresetSelect("Add from storage presets", "Select a storage size…", availablePresets)
        )}
        {availableRamPresets.length > 0 && (
          renderPresetSelect("Add from RAM presets", "Select a RAM size…", availableRamPresets)
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="e.g. 256GB"
          className="w-40 rounded-lg border border-white/8 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/25 focus:border-ocean/40 focus:outline-none focus:ring-2 focus:ring-ocean/20"
        />
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-ocean-light hover:bg-ocean/10"
        >
          <Plus className="h-3.5 w-3.5" /> Add Storage Option
        </button>
      </div>
      <p className="text-xs text-white/25">
        Pick sizes from the preset list above (or type a custom one). Customers pick one of these sizes when ordering.
        Leave empty if the product has a single fixed size.
      </p>
    </div>
  );
}
