"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Search, Smartphone, X, CheckCircle2 } from "lucide-react";
import {
  searchDeviceSpecifications,
  getDeviceSpecificationPreview,
  type DeviceSearchResultItem,
  type DeviceSpecPreview,
} from "@/actions/device-specs";
import type { ProductSpecifications } from "@/types/specifications";

interface MobileApiImportPanelProps {
  onImport: (specifications: ProductSpecifications) => void;
}

const SEARCH_DEBOUNCE_MS = 450;

const DEVICE_TYPE_LABELS: Record<string, string> = {
  phone: "Phone",
  smartphone: "Phone",
  mobile: "Phone",
  tablet: "Tablet",
  wearable: "Smartwatch",
  smartwatch: "Smartwatch",
  laptop: "Laptop",
  notebook: "Laptop",
  computer: "Computer",
  other: "Device",
};

/**
 * Import technical specifications from MobileAPI.dev for any device type —
 * smartphones, tablets, smartwatches, laptops and more. Same UX as before,
 * no longer limited to phones.
 */
export function MobileApiImportPanel({ onImport }: MobileApiImportPanelProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DeviceSearchResultItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [preview, setPreview] = useState<DeviceSpecPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const [importedName, setImportedName] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(async (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setSearchError(null);
      setHasSearched(false);
      return;
    }

    setSearching(true);
    setSearchError(null);
    const result = await searchDeviceSpecifications(trimmed);
    setSearching(false);
    setHasSearched(true);

    if ("error" in result) {
      setSearchError(result.error);
      setResults([]);
      return;
    }
    setResults(result.results);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query), SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

  const handleSelect = useCallback(async (deviceId: number) => {
    setPreviewLoading(true);
    setPreviewError(null);
    setPreview(null);
    const result = await getDeviceSpecificationPreview(deviceId);
    setPreviewLoading(false);

    if ("error" in result) {
      setPreviewError(result.error);
      return;
    }
    setPreview(result.preview);
  }, []);

  const handleImport = useCallback(() => {
    if (!preview) return;
    onImport(preview.specifications);
    setImportedName(preview.deviceName);
    setPreview(null);
    setResults([]);
    setQuery("");
  }, [preview, onImport]);

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] p-4">
      <div className="flex items-center gap-2">
        <Smartphone className="h-4 w-4 text-accent dark:text-[#8ec5f2]" />
        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Import Device Specifications (MobileAPI)</p>
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500">
        Search for the exact smartphone, tablet, smartwatch, or laptop model to automatically fill in technical
        specifications. You can still edit everything afterwards, and this never affects your price.
      </p>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Galaxy S25, iPhone 16 Pro, Galaxy Tab S10, MacBook Air"
            className="w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] py-2.5 pl-9 pr-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
          />
        </div>
        {searching && <Loader2 className="mt-2.5 h-4 w-4 shrink-0 animate-spin text-accent dark:text-[#8ec5f2]" />}
      </div>

      {searchError && (
        <p className="rounded-lg border border-red-500/20 bg-red-50 dark:bg-red-500/15 px-3 py-2 text-xs text-red-600 dark:text-red-300">
          {searchError}
        </p>
      )}

      {importedName && !searchError && (
        <p className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/15 px-3 py-2 text-xs text-emerald-600 dark:text-emerald-300">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          Imported specifications from &ldquo;{importedName}&rdquo;. Review them below and edit anything necessary.
        </p>
      )}

      {!searching && hasSearched && !searchError && results.length === 0 && (
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Couldn&apos;t find an exact match. Try searching with model keywords like &ldquo;Galaxy S25&rdquo;,
          &ldquo;iPhone 16&rdquo;, &ldquo;MacBook Pro&rdquo;, or &ldquo;Galaxy Watch&rdquo;. You can also add
          specifications manually below.
        </p>
      )}

      {results.length > 0 && (
        <ul className="max-h-64 space-y-1.5 overflow-y-auto">
          {results.map((result) => (
            <li
              key={result.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100/85">
                  {result.name}
                  {result.deviceType && (
                    <span className="ml-2 rounded bg-ocean/20 px-1.5 py-0.5 text-caption font-bold uppercase tracking-wider text-accent/80">
                      {DEVICE_TYPE_LABELS[result.deviceType] || result.deviceType}
                    </span>
                  )}
                </p>
                {result.summary && <p className="truncate text-xs text-slate-400 dark:text-slate-500">{result.summary}</p>}
              </div>
              <button
                type="button"
                onClick={() => handleSelect(result.id)}
                disabled={previewLoading}
                className="shrink-0 rounded-lg border border-ocean/30 bg-ocean/10 px-3 py-1.5 text-xs font-semibold text-accent dark:text-[#8ec5f2] transition-colors hover:bg-ocean/20 disabled:opacity-40"
              >
                Select
              </button>
            </li>
          ))}
        </ul>
      )}

      {previewLoading && (
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-3 py-3 text-xs text-slate-400 dark:text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading specifications preview…
        </div>
      )}

      {previewError && (
        <p className="rounded-lg border border-red-500/20 bg-red-50 dark:bg-red-500/15 px-3 py-2 text-xs text-red-600 dark:text-red-300">
          {previewError}
        </p>
      )}

      {preview && (
        <div className="space-y-3 rounded-xl border border-ocean/25 bg-ocean/[0.06] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-accent/70">Preview</p>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {preview.deviceName}
                {preview.deviceType && (
                  <span className="ml-2 rounded bg-ocean/20 px-1.5 py-0.5 text-caption font-bold uppercase tracking-wider text-accent/80">
                    {DEVICE_TYPE_LABELS[preview.deviceType] || preview.deviceType}
                  </span>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="rounded-lg p-1 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1c3a5c] hover:text-slate-500"
              aria-label="Close preview"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {preview.specifications.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500">No specifications were returned for this device.</p>
          ) : (
            <div className="max-h-72 space-y-3 overflow-y-auto">
              {preview.specifications.map((group) => (
                <div key={group.name}>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{group.name}</p>
                  <ul className="mt-1 space-y-1">
                    {group.specs.map((spec) => (
                      <li key={spec.label} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
                        <span>
                          <span className="text-slate-500 dark:text-slate-400">{spec.label}:</span> {spec.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 border-t border-slate-200 dark:border-[#1e3a5f] pt-3">
            <button
              type="button"
              onClick={handleImport}
              disabled={preview.specifications.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-ocean px-4 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 transition-colors hover:bg-ocean-dark disabled:opacity-40"
            >
              Import Specifications
            </button>
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="rounded-lg border border-slate-200 dark:border-[#1e3a5f] px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1c3a5c]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
