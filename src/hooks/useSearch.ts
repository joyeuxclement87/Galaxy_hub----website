"use client";

import { useMemo } from "react";
import { Product } from "@/data/mock-data";

export interface SearchFilters {
  category: string;
  brand: string;
  dealsOnly: boolean;
}

export const DEFAULT_FILTERS: SearchFilters = {
  category: "All",
  brand: "All",
  dealsOnly: false,
};

export function useSearch(products: Product[], query: string, filters: SearchFilters = DEFAULT_FILTERS) {
  return useMemo(() => {
    let results = products;

    if (query.trim()) {
      const rawTerm = query.trim().toLowerCase();
      results = results.filter((p) => {
        const title = p.title.toLowerCase();
        const brand = p.brand.toLowerCase();
        const category = p.category.toLowerCase();
        const tagline = (p.tagline || "").toLowerCase();
        return (
          title.includes(rawTerm) ||
          brand.includes(rawTerm) ||
          category.includes(rawTerm) ||
          tagline.includes(rawTerm)
        );
      });

      results.sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        const aExact = aTitle === rawTerm || aTitle.startsWith(rawTerm);
        const bExact = bTitle === rawTerm || bTitle.startsWith(rawTerm);
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return 0;
      });
    }

    if (filters.dealsOnly) {
      results = results.filter((p) => p.originalPrice !== undefined || p.availability === "Limited Stock");
    }

    if (filters.category === "Wishlist") {
      results = results;
    } else if (filters.category !== "All") {
      results = results.filter((p) => p.category === filters.category);
    }

    if (filters.brand !== "All") {
      results = results.filter((p) => p.brand === filters.brand);
    }

    return results;
  }, [products, query, filters]);
}
