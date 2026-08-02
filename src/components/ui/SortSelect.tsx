"use client";

import { useCallback } from "react";
import { ArrowUpDown } from "lucide-react";

function buildHref(params: Record<string, string | number | undefined>) {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v) !== "") u.set(k, String(v));
  });
  const s = u.toString();
  return s ? `/products?${s}` : "/products";
}

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest first" },
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "name",       label: "Name A–Z" },
];

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
    <label
      className="inline-flex items-center gap-2.5 rounded-btn border border-ocean/12 bg-white px-4 py-2.5 shadow-sm shadow-ocean/4 cursor-pointer hover:border-ocean/25 transition-colors duration-250"
      title="Sort products"
    >
      <ArrowUpDown className="h-4 w-4 text-ocean/40 shrink-0" />
      <select
        name="sort"
        value={currentSort}
        onChange={handleChange}
        className="border-none bg-transparent text-sm font-semibold text-ocean-deeper cursor-pointer focus:outline-none min-w-[130px]"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
