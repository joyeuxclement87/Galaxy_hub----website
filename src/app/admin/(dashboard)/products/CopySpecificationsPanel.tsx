"use client";

import { useCallback, useRef, useState } from "react";
import { Loader2, Search, X, CheckCircle2, ClipboardCopy, PackageSearch } from "lucide-react";
import {
  searchProductsForCopy,
  getProductSpecificationsForCopy,
  type CopySearchResultItem,
} from "@/actions/copy-specs";
import type { ProductSpecifications } from "@/types/specifications";

interface CopySpecificationsPanelProps {
  onImport: (specifications: ProductSpecifications) => void;
}

const SEARCH_DEBOUNCE_MS = 450;

/**
 * Copy specifications from an existing Galaxy Hub product into the same
 * unified specification editor. Only the specifications are copied — never
 * price, stock, images, slug or product name.
 */
export function CopySpecificationsPanel({ onImport }: CopySpecificationsPanelProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CopySearchResultItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [selected, setSelected] = useState<CopySearchResultItem | null>(null);
  const [loadingSpecs, setLoadingSpecs] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const [copiedName, setCopiedName] = useState<string | null>(null);

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
    const result = await searchProductsForCopy(trimmed);
    setSearching(false);
    setHasSearched(true);

    if ("error" in result) {
      setSearchError(result.error);
      setResults([]);
      return;
    }
    setResults(result.results);
  }, []);

  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value);
      setSelected(null);
      setCopiedName(null);
      setCopyError(null);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => runSearch(value), SEARCH_DEBOUNCE_MS);
    },
    [runSearch]
  );

  const handleSelect = useCallback(async (result: CopySearchResultItem) => {
    setSelected(result);
    setCopiedName(null);
    setCopyError(null);
    setLoadingSpecs(true);
    const copy = await getProductSpecificationsForCopy(result.id);
    setLoadingSpecs(false);

    if ("error" in copy) {
      setCopyError(copy.error);
      return;
    }
    if (copy.specifications.length === 0) {
      setCopiedName(null);
      setCopyError(`"${copy.productName}" has no specifications to copy. You can add them manually below.`);
      return;
    }
    onImport(copy.specifications);
    setCopiedName(copy.productName);
  }, [onImport]);

  return (
    <div className="space-y-4 rounded-xl border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2">
        <ClipboardCopy className="h-4 w-4 text-ocean-light" />
        <p className="text-sm font-bold text-white">Copy Specifications from Existing Product</p>
      </div>
      <p className="text-xs text-white/40">
        Search for a product already in your store (e.g. Galaxy Z Fold7) and copy its specifications.
        Only the specifications are copied — never the price, stock, images, or name. You can still
        edit everything afterwards.
      </p>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="e.g. Galaxy Z Fold, iPhone 16 Pro, MacBook Air"
            className="w-full rounded-xl border border-white/8 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/25 focus:border-ocean/40 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
          />
        </div>
        {searching && <Loader2 className="mt-2.5 h-4 w-4 shrink-0 animate-spin text-ocean-light" />}
      </div>

      {searchError && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {searchError}
        </p>
      )}

      {copiedName && !searchError && (
        <p className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          Copied specifications from &ldquo;{copiedName}&rdquo;. Review them below and edit anything necessary.
        </p>
      )}

      {!searching && hasSearched && !searchError && results.length === 0 && (
        <p className="text-xs text-white/40">
          No products match that name. Try a different keyword, e.g. &ldquo;Galaxy Z&rdquo;, &ldquo;iPhone&rdquo;,
          or &ldquo;MacBook&rdquo;.
        </p>
      )}

      {results.length > 0 && (
        <ul className="max-h-64 space-y-1.5 overflow-y-auto">
          {results.map((result) => (
            <li
              key={result.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white/85">
                  {[result.brandName, result.name].filter(Boolean).join(" ")}
                </p>
                {result.categoryName && (
                  <p className="truncate text-xs text-white/35">
                    {result.categoryName}
                    {result.specificationCount > 0 && (
                      <span className="ml-2">
                        · {result.specificationCount} {result.specificationCount === 1 ? "specification" : "specifications"}
                      </span>
                    )}
                  </p>
                )}
                {(result.categoryName === null || !result.categoryName) && result.specificationCount > 0 && (
                  <p className="truncate text-xs text-white/35">
                    {result.specificationCount} {result.specificationCount === 1 ? "specification" : "specifications"}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleSelect(result)}
                disabled={loadingSpecs}
                className="shrink-0 rounded-lg border border-ocean/30 bg-ocean/10 px-3 py-1.5 text-xs font-semibold text-ocean-light transition-colors hover:bg-ocean/20 disabled:opacity-40"
              >
                Select
              </button>
            </li>
          ))}
        </ul>
      )}

      {loadingSpecs && (
        <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.02] px-3 py-3 text-xs text-white/40">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading specifications…
        </div>
      )}

      {copyError && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {copyError}
        </p>
      )}

      {selected && (
        <div className="flex items-center gap-2.5 rounded-xl border border-ocean/25 bg-ocean/[0.06] px-4 py-3">
          <PackageSearch className="h-4 w-4 shrink-0 text-ocean-light" />
          <p className="min-w-0 text-xs text-white/60">
            <span className="font-semibold text-white">Selected:</span>{" "}
            <span className="truncate">{selected.name}</span>
          </p>
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="ml-auto rounded-lg p-1 text-white/30 hover:bg-white/10 hover:text-white/60"
            aria-label="Clear selection"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}