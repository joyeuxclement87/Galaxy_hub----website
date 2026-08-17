"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Trash2 } from "lucide-react";
import { deleteBrand, deleteBrands } from "@/actions/brands";
import { useBulkSelection } from "@/hooks/use-bulk-selection";
import { BulkDeleteBar } from "@/components/admin/BulkDeleteBar";

export function BrandsTable({ brands }: { brands: { id: string; name: string; slug: string; description: string | null; logo_url: string | null; is_active: boolean; product_count: number; created_at: string }[] }) {
  const router = useRouter();
  const { selected, toggle, toggleAll, clear, allSelected, count } = useBulkSelection(
    useMemo(() => brands.map((b) => b.id), [brands]),
  );

  if (brands.length === 0) return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-6 py-16 text-center">
      <Building2 className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
      <p className="font-clash text-base font-semibold text-slate-500 dark:text-slate-400">No brands found</p>
      <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Add your first brand to get started.</p>
    </div>
  );

  return (
    <div className="space-y-3">
      <BulkDeleteBar
        count={count}
        label={count === 1 ? "brand" : "brands"}
        onDelete={async () => {
          const result = await deleteBrands([...selected]);
          if (!result?.error) router.refresh();
          return result;
        }}
        onClear={clear}
      />
      <div className="rounded-2xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-500">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-[#1a3352] text-left">
              <th className="px-5 py-3.5 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  disabled={brands.length === 0}
                  aria-label="Select all brands"
                  className="h-4 w-4 cursor-pointer rounded accent-ocean"
                />
              </th>
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Brand</th>
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Slug</th>
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Description</th>
              <th className="px-5 py-3.5 text-center text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Products</th>
              <th className="px-5 py-3.5 text-center text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Active</th>
              <th className="px-5 py-3.5 text-right text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Created</th>
              <th className="px-5 py-3.5 text-right text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1a3352]">
            {brands.map((b) => (
              <tr key={b.id} className="group transition-colors hover:bg-slate-50 dark:hover:bg-[#132c46]">
                <td className="px-5 py-3.5">
                  <input
                    type="checkbox"
                    checked={selected.has(b.id)}
                    onChange={() => toggle(b.id)}
                    aria-label={`Select ${b.name}`}
                    className="h-4 w-4 cursor-pointer rounded accent-ocean"
                  />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-[#162f4a] border border-slate-200 dark:border-[#1e3a5f] transition-transform group-hover:scale-105">
                      {b.logo_url ? <Image src={b.logo_url} alt={b.name} fill className="object-contain p-1" sizes="36px" unoptimized />
                      : <div className="flex h-full w-full items-center justify-center text-slate-300 dark:text-slate-600"><Building2 className="h-4 w-4" /></div>}
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">{b.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-400 dark:text-slate-500 font-mono text-xs">{b.slug}</td>
                <td className="px-5 py-3.5 text-sm text-slate-400 dark:text-slate-500 max-w-xs truncate">{b.description || "—"}</td>
                <td className="px-5 py-3.5 text-center text-sm font-semibold text-slate-600 dark:text-slate-400">{b.product_count}</td>
                <td className="px-5 py-3.5 text-center">{b.is_active ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-red-400">✗</span>}</td>
                <td className="px-5 py-3.5 whitespace-nowrap text-right"><span className="text-xs text-slate-400 dark:text-slate-500">{new Date(b.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span></td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/brands/${b.id}/edit`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-ocean dark:text-[#8ec5f2] hover:bg-ocean/15 transition-colors">Edit</Link>
                    <form action={async () => {
                      if (!window.confirm("Delete this brand? This action cannot be undone.")) return;
                      const r = await deleteBrand(b.id);
                      if (r?.error) alert(r.error);
                    }}>
                      <button type="submit" className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/15 transition-colors"><Trash2 className="h-3 w-3" /> Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
