"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
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

function buildHref(params: Record<string, string | number | undefined>) {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v) !== "") u.set(k, String(v));
  });
  const s = u.toString();
  return s ? `/products?${s}` : "/products";
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
    <div className={cn("space-y-7", className)}>
      {groups.map((group) => (
        <div key={group.id}>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.14em] text-ocean-deeper">
              {group.title}
            </h3>
            {group.options.some((o) => o.active && o.label !== "All") && (
              <Link
                href={group.options.find((o) => !o.active)?.href ?? buildHref({})}
                className="text-[10px] font-semibold text-ocean/40 hover:text-ocean transition-colors"
              >
                Clear
              </Link>
            )}
          </div>
          <ul className="mt-3 space-y-1">
            {group.options.map((option) => (
              <li key={option.label}>
                <Link
                  href={option.href}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-btn px-2.5 py-2 text-[13px] transition-all duration-200",
                    option.active
                      ? "bg-ocean/[0.07] font-bold text-ocean"
                      : "text-ocean/60 hover:bg-ocean/[0.04] hover:text-ocean"
                  )}
                >
                  <span className="line-clamp-1">{option.label}</span>
                  {option.count !== undefined && (
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold",
                        option.active ? "bg-ocean text-white" : "bg-ocean/[0.06] text-ocean/40"
                      )}
                    >
                      {option.count}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {activeCount > 0 && (
        <div className="pt-1">
          <Link
            href="/products"
            className="flex items-center justify-center gap-1.5 rounded-btn border border-ocean/15 bg-white/60 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ocean transition-all duration-300 hover:border-ocean/30 hover:bg-white"
          >
            <X className="h-3.5 w-3.5" />
            Reset filters ({activeCount})
          </Link>
        </div>
      )}
    </div>
  );
}

export function MobileFilters({
  groups,
  activeCount,
}: {
  groups: ProductFilterGroup[];
  activeCount: number;
}) {
  const [open, setOpen] = React.useState(false);

  const close = useCallback(() => setOpen(false), []);

  const sortedGroups = groups.map((group) => ({
    ...group,
    options: [...group.options].sort((a, b) => {
      const aC = a.active ? 0 : 1;
      const bC = b.active ? 0 : 1;
      return aC - bC;
    }),
  }));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-btn border px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] transition-all duration-200",
          activeCount > 0
            ? "border-ocean bg-ocean text-white shadow-btn"
            : "border-ocean/12 bg-white text-ocean hover:border-ocean/30"
        )}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filters
        {activeCount > 0 && (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-[10px] font-bold">
            {activeCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              className="fixed inset-0 z-[60] bg-ocean-deeper/20 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-[61] flex w-[min(86vw,340px)] flex-col bg-ivory shadow-premium-lg lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-ocean/[0.06] px-5 py-4">
                <span className="font-display text-sm font-bold text-ocean-deeper">Filters</span>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close filters"
                  className="flex h-9 w-9 items-center justify-center rounded-btn text-ocean/50 transition-colors hover:bg-ocean/[0.05] hover:text-ocean cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-6">
                <ProductFilters groups={sortedGroups} activeCount={activeCount} />
              </div>
              <div className="border-t border-ocean/[0.06] px-5 py-4">
                <button
                  type="button"
                  onClick={close}
                  className="flex w-full items-center justify-center rounded-btn bg-ocean-deeper h-11 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-btn transition-all duration-300 hover:bg-ocean-dark"
                >
                  Show results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
