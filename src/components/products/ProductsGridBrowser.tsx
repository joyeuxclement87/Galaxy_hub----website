"use client";

import React, { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import ProductsGrid from "@/components/ui/products-grid";
import { ProductGridSkeleton } from "@/components/ui/LoadingSkeleton";
import { fetchProductsPage } from "@/actions/products-data";
import type { PublicProduct } from "@/data/public-products";
import type { Product } from "@/data/mock-data";
import { cn } from "@/lib/utils";

export const PAGE_SIZES = { desktop: 24, tablet: 18, mobile: 12 } as const;

function devicePageSize(): number {
  if (typeof window === "undefined") return PAGE_SIZES.desktop;
  if (window.matchMedia("(min-width: 1024px)").matches) return PAGE_SIZES.desktop;
  if (window.matchMedia("(min-width: 768px)").matches) return PAGE_SIZES.tablet;
  return PAGE_SIZES.mobile;
}

function subscribeViewport(callback: () => void) {
  const queries = [
    window.matchMedia("(min-width: 1024px)"),
    window.matchMedia("(min-width: 768px)"),
    window.matchMedia("(max-width: 767px)"),
  ];
  queries.forEach((q) => q.addEventListener("change", callback));
  return () => queries.forEach((q) => q.removeEventListener("change", callback));
}

function buildHref(params: Record<string, string>, page: number) {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (k === "page") return;
    if (v !== undefined && v !== null && String(v) !== "") u.set(k, String(v));
  });
  if (page > 1) u.set("page", String(page));
  const s = u.toString();
  return s ? `/products?${s}` : "/products";
}

function getPaginationPages(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  const window = 1;
  const left = Math.max(2, current - window);
  const right = Math.min(total - 1, current + window);
  pages.push(1);
  if (left > 2) pages.push("...");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("...");
  pages.push(total);
  return pages;
}

function toGridProduct(p: PublicProduct): Product {
  return {
    id: p.id, slug: p.slug, title: p.name,
    tagline: p.short_description || "", description: p.description || "",
    price: p.price, originalPrice: p.old_price || undefined, currency: "RWF",
    category: p.category_name || "", brand: p.brand_name || "",
    image: p.main_image_url || "", featured: p.is_featured,
    specifications: {},
    availability: p.stock_status === "available" ? "In Stock" : p.stock_status === "coming_soon" ? "Limited Stock" : "Out of Stock",
    badge: p.is_new ? "NEW" : p.discount_percentage ? "ON DISCOUNT" : undefined,
    rating: p.rating ?? 4.8, reviewCount: p.review_count ?? 32,
  };
}

interface Props {
  initialProducts: PublicProduct[];
  initialTotal: number;
  params: Record<string, string>;
  page: number;
}

export function ProductsGridBrowser({ initialProducts, initialTotal, params, page }: Props) {
  // SSR renders with the desktop page size (24); the client snapshot then
  // reports the real viewport size (24/18/12) without any setState-in-effect.
  const pageSize = useSyncExternalStore(
    subscribeViewport,
    devicePageSize,
    () => PAGE_SIZES.desktop,
  );

  const paramsKey = useMemo(() => JSON.stringify(params), [params]);
  const needsFetch = pageSize !== PAGE_SIZES.desktop;
  const requested = `${pageSize}|${page}|${paramsKey}`;

  const fetchArgs = useMemo(
    () => ({
      search: params.q || undefined,
      category_slug: params.category || undefined,
      brand_slug: params.brand || undefined,
      sort: params.sort || undefined,
      stock_status: params.stock || undefined,
      is_featured: params.featured === "true" ? true : undefined,
      is_new: params.new === "true" ? true : undefined,
    }),
    [params],
  );

  const [data, setData] = useState(() => ({
    products: initialProducts,
    total: initialTotal,
    for: `${PAGE_SIZES.desktop}|${page}|${paramsKey}`,
  }));

  // When the device page size is smaller than the server default (24),
  // fetch the correct page of products for this viewport. Data updates
  // happen in async callbacks only, so the grid never shows the wrong page.
  useEffect(() => {
    if (!needsFetch) return;
    let cancelled = false;

    fetchProductsPage(fetchArgs, page, pageSize)
      .then((result) => {
        if (cancelled) return;
        setData({ products: result.products, total: result.total, for: requested });
      })
      .catch((error) => {
        console.error("[products-grid] fetch failed:", error);
        if (!cancelled) setData({ products: initialProducts, total: initialTotal, for: requested });
      });

    return () => {
      cancelled = true;
    };
  }, [needsFetch, requested, pageSize, page, fetchArgs, initialProducts, initialTotal]);

  const { products, total } = data;
  const loading = needsFetch && data.for !== requested;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const paginationPages = getPaginationPages(page, totalPages);

  if (loading) {
    return (
      <div className="pt-2">
        <ProductGridSkeleton count={pageSize > 12 ? 12 : pageSize} />
      </div>
    );
  }

  return (
    <>
      {/* Results count + page info */}
      <div className="mb-5 flex items-center justify-between">
        <div className="text-xs text-ocean/50">
          {total > 0 ? (
            <>
              Showing{" "}
              <span className="font-bold text-ocean-deeper">{start + 1}–{Math.min(start + pageSize, total)}</span>
              {" "}of{" "}
              <span className="font-bold text-ocean-deeper">{total.toLocaleString()}</span>
              {" "}Products
            </>
          ) : (
            <span>No results</span>
          )}
        </div>
        {total >= 6 && (
          <div className="hidden sm:block text-xs text-ocean/40">
            Page {page} of {totalPages}
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-ocean/12 bg-white/60 py-16 text-center px-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ocean/5">
            <Search className="h-6 w-6 text-ocean/25" />
          </div>
          <h3 className="font-display text-lg font-bold text-ocean-deeper mt-5">No products found</h3>
          <p className="mt-2 text-sm text-ocean/50 max-w-xs">
            Try a different search term or clear your filters to browse all products.
          </p>
          <Link
            href="/products"
            className="mt-4 inline-flex items-center justify-center rounded-btn bg-ocean-deeper px-6 h-11 text-sm font-bold text-white shadow-btn transition-all duration-250 hover:bg-ocean-dark hover:shadow-btn-hover"
          >
            Clear all filters
          </Link>
        </div>
      ) : (
        <ProductsGrid products={products.map(toGridProduct)} />
      )}

      {/* Pagination — shown once products span 2+ rows (≥6 products) */}
      {total >= 6 && (
        <div className="mt-8 flex items-center justify-center gap-1.5">
          {totalPages === 1 ? (
            <span className="rounded-btn border border-ocean/8 bg-white px-4 py-2 text-sm font-semibold text-ocean-deeper/60">
              Page 1 of 1
            </span>
          ) : (
            <>
              <Link
                href={buildHref(params, Math.max(1, page - 1))}
                className={cn(
                  "rounded-btn border px-4 py-2 text-sm font-semibold transition-all duration-250",
                  page === 1
                    ? "pointer-events-none opacity-30 border-ocean/8 bg-white text-ocean"
                    : "border-ocean/8 bg-white text-ocean hover:border-ocean/30 hover:shadow-sm"
                )}
              >
                ← Prev
              </Link>

              {paginationPages.map((p, i) =>
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-ocean/25 text-sm select-none">
                    …
                  </span>
                ) : (
                  <Link
                    key={p}
                    href={buildHref(params, p)}
                    className={cn(
                      "rounded-btn w-9 h-9 flex items-center justify-center text-sm font-bold transition-all duration-250",
                      p === page
                        ? "bg-ocean text-white shadow-btn"
                        : "border border-ocean/8 bg-white text-ocean-deeper/60 hover:border-ocean/25 hover:text-ocean"
                    )}
                  >
                    {p}
                  </Link>
                )
              )}

              <Link
                href={buildHref(params, Math.min(totalPages, page + 1))}
                className={cn(
                  "rounded-btn border px-4 py-2 text-sm font-semibold transition-all duration-250",
                  page === totalPages
                    ? "pointer-events-none opacity-30 border-ocean/8 bg-white text-ocean"
                    : "border-ocean/8 bg-white text-ocean hover:border-ocean/30 hover:shadow-sm"
                )}
              >
                Next →
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}
