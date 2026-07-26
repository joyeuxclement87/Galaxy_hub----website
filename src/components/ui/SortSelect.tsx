"use client";

import { useCallback } from "react";

function buildHref(params: Record<string, string | number | undefined>) {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v) !== "") u.set(k, String(v));
  });
  const s = u.toString();
  return s ? `/products?${s}` : "/products";
}

export function SortSelect({
  currentSort,
  params,
}: {
  currentSort: string;
  params: Record<string, string>;
}) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const url = buildHref({ ...params, sort: e.target.value, page: 1 });
      window.location.href = url;
    },
    [params]
  );

  return (
    <select
      name="sort"
      defaultValue={currentSort}
      onChange={handleChange}
      className="rounded-xl border border-black/8 bg-white px-3 py-3 text-sm text-[#10233D] focus:outline-none cursor-pointer"
    >
      <option value="newest">Newest</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
      <option value="name">Name</option>
    </select>
  );
}
