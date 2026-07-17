"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function SortSelect({ params, currentSort }: { params: Record<string, string | undefined>; currentSort: string }) {
  const router = useRouter();

  function buildHref(newSort: string) {
    const u = new URLSearchParams();
    Object.entries(params || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v) !== "") u.set(k, String(v));
    });
    if (newSort) u.set("sort", newSort);
    const s = u.toString();
    return s ? `/products?${s}` : "/products";
  }

  return (
    <select
      name="sort"
      defaultValue={currentSort}
      onChange={(e) => {
        const href = buildHref(e.target.value);
        router.push(href);
      }}
      className="text-sm rounded-xl border border-black/8 px-3 py-2 bg-white"
    >
      <option value="featured">Featured</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
      <option value="newest">Newest</option>
    </select>
  );
}
