"use client";

import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  label: string;
  active: boolean;
  count?: number;
  href: string;
}

export interface ProductFilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
}

export function ProductFilters({
  groups,
  activeCount,
  className,
}: {
  groups: ProductFilterGroup[];
  activeCount: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-6", className)}>
      {groups.map((group, gi) => {
        const activeOption = group.options.find((o) => o.active);
        const allOption = group.options[0]; // first is always "All X"

        return (
          <div key={group.id}>
            {gi > 0 && <div className="divider-subtle mb-6" />}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-ocean-deeper/50">
                {group.title}
              </h3>
              {activeOption && activeOption.label !== allOption?.label && (
                <Link
                  href={allOption?.href ?? "/products"}
                  className="text-[11px] font-semibold text-ocean/40 hover:text-ocean transition-colors"
                >
                  Clear
                </Link>
              )}
            </div>
            <ul className="space-y-0.5">
              {group.options.map((option) => (
                <li key={option.label}>
                  <Link
                    href={option.href}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-btn px-3 py-2 text-[11px] transition-all duration-200",
                      option.active
                        ? "bg-ocean text-white font-semibold shadow-btn"
                        : "text-ocean-deeper/65 hover:bg-ocean/5 hover:text-ocean-deeper font-medium"
                    )}
                  >
                    <span className="flex items-center gap-1.5 line-clamp-1">
                      {option.active && <Check className="h-2.5 w-2.5 shrink-0" />}
                      {option.label}
                    </span>
                    {option.count !== undefined && (
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-1.5 py-px text-[11px] font-bold tabular-nums",
                          option.active
                            ? "bg-white/20 text-white"
                            : "bg-ocean/6 text-ocean/40"
                        )}
                      >
                        {option.count.toLocaleString()}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {activeCount > 0 && (
        <div className="pt-2">
          <Link
            href="/products"
            className="flex items-center justify-center gap-1.5 rounded-btn border border-ocean/15 bg-white/60 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-ocean transition-all duration-250 hover:border-ocean/30 hover:bg-white"
          >
            <X className="h-3 w-3" />
            Reset filters ({activeCount})
          </Link>
        </div>
      )}
    </div>
  );
}

// ─── Mobile Filters ───────────────────────────────────────────────────────────

/**
 * The overlay portal renders directly into document.body to escape any
 * CSS stacking-context created by parent elements (e.g. backdrop-filter
 * on the sticky toolbar). Without this, position:fixed children get
 * trapped and don't appear over all page content.
 */
function FilterDrawerPortal({
  open,
  onClose,
  groups,
  activeCount,
  clearAllHref,
}: {
  open: boolean;
  onClose: () => void;
  groups: ProductFilterGroup[];
  activeCount: number;
  clearAllHref: string;
}) {
  // Lock body scroll while drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — covers everything including navbar */}
          <motion.div
            key="filter-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            style={{ zIndex: 9998 }}
            className="fixed inset-0 bg-ocean-deeper/40 backdrop-blur-[2px]"
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            key="filter-drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.9 }}
            style={{ zIndex: 9999 }}
            className="fixed inset-y-0 left-0 flex w-[min(88vw,360px)] flex-col bg-ivory shadow-premium-lg"
            role="dialog"
            aria-modal="true"
            aria-label="Filter products"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ocean/8 px-5 pt-safe py-4">
              <div>
                <p className="font-display text-[11px] font-bold text-ocean-deeper">
                  Filter products
                </p>
                <p className="mt-0.5 text-[11px] text-ocean/45">
                  {activeCount > 0
                    ? `${activeCount} active filter${activeCount === 1 ? "" : "s"}`
                    : "Refine your results"}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ocean/10 bg-white/60 text-ocean/50 transition-colors hover:border-ocean/25 hover:text-ocean cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Active filter — clear all chip */}
            {activeCount > 0 && (
              <div className="border-b border-ocean/6 px-5 py-3">
                <Link
                  href={clearAllHref}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ocean/15 bg-white px-3 py-1.5 text-[11px] font-bold text-ocean transition-colors hover:border-ocean/30 hover:bg-ocean/4"
                >
                  <X className="h-2.5 w-2.5" />
                  Clear all filters
                </Link>
              </div>
            )}

            {/* Filter groups — scrollable */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 space-y-6">
              {groups.map((group, gi) => {
                const activeOption = group.options.find((o) => o.active);
                const allOption = group.options[0];

                return (
                  <div key={group.id}>
                    {gi > 0 && <div className="divider-subtle mb-6" />}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-ocean-deeper/45">
                        {group.title}
                      </h3>
                      {activeOption && activeOption.label !== allOption?.label && (
                        <Link
                          href={allOption?.href ?? "/products"}
                          onClick={onClose}
                          className="text-[11px] font-semibold text-ocean/40 hover:text-ocean transition-colors"
                        >
                          Clear
                        </Link>
                      )}
                    </div>
                    <ul className="space-y-0.5">
                      {group.options.map((option) => (
                        <li key={option.label}>
                          <Link
                            href={option.href}
                            onClick={onClose}
                            className={cn(
                              "flex items-center justify-between gap-2 rounded-btn px-3 py-2 text-[11px] transition-all duration-200 min-h-[38px]",
                              option.active
                                ? "bg-ocean text-white font-semibold shadow-btn"
                                : "text-ocean-deeper/65 hover:bg-ocean/5 hover:text-ocean-deeper font-medium"
                            )}
                          >
                            <span className="flex items-center gap-2 line-clamp-1">
                              {option.active && (
                                <Check className="h-3 w-3 shrink-0" />
                              )}
                              {option.label}
                            </span>
                            {option.count !== undefined && (
                              <span
                                className={cn(
                                  "shrink-0 rounded-full px-1.5 py-px text-[11px] font-bold tabular-nums",
                                  option.active
                                    ? "bg-white/20 text-white"
                                    : "bg-ocean/8 text-ocean/40"
                                )}
                              >
                                {option.count.toLocaleString()}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Footer — show results CTA */}
            <div className="border-t border-ocean/8 px-5 py-4 pb-safe">
              <button
                type="button"
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-btn bg-ocean-deeper h-11 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-btn transition-all duration-250 hover:bg-ocean-dark active:scale-[0.98]"
              >
                Show results
                {activeCount > 0 && (
                  <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-white/20 px-1 text-[11px]">
                    {activeCount}
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function MobileFilters({
  groups,
  activeCount,
  currentQ,
}: {
  groups: ProductFilterGroup[];
  activeCount: number;
  currentQ?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  // Only render portal on client
  useEffect(() => { setMounted(true); }, []);

  const clearAllHref = currentQ
    ? `/products?q=${encodeURIComponent(currentQ)}`
    : "/products";

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-btn border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-250 min-h-[40px]",
          activeCount > 0
            ? "border-ocean bg-ocean text-white shadow-btn"
            : "border-ocean/12 bg-white text-ocean-deeper hover:border-ocean/25 hover:bg-ocean/4"
        )}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filters
        {activeCount > 0 && (
          <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-white/25 px-1 text-[11px] font-bold">
            {activeCount}
          </span>
        )}
      </button>

      {/* Portal overlay — renders at document.body, escaping all stacking contexts */}
      {mounted && (
        <FilterDrawerPortal
          open={open}
          onClose={close}
          groups={groups}
          activeCount={activeCount}
          clearAllHref={clearAllHref}
        />
      )}
    </>
  );
}
