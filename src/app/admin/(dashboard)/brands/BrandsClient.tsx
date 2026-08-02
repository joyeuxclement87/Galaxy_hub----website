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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/8 bg-white/[0.02] px-6 py-16 text-center">
      <Building2 className="mb-4 h-12 w-12 text-white/20" />
      <p className="font-clash text-base font-semibold text-white/50">No brands found</p>
      <p className="mt-1 text-sm text-white/30">Add your first brand to get started.</p>
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
      <div className="rounded-2xl border border-white/8 bg-white/5 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-white/15">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 text-left">
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
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-white/30">Brand</th>
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-white/30">Slug</th>
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-white/30">Description</th>
              <th className="px-5 py-3.5 text-center text-caption font-bold uppercase tracking-[0.12em] text-white/30">Products</th>
              <th className="px-5 py-3.5 text-center text-caption font-bold uppercase tracking-[0.12em] text-white/30">Active</th>
              <th className="px-5 py-3.5 text-right text-caption font-bold uppercase tracking-[0.12em] text-white/30">Created</th>
              <th className="px-5 py-3.5 text-right text-caption font-bold uppercase tracking-[0.12em] text-white/30">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {brands.map((b) => (
              <tr key={b.id} className="group transition-colors hover:bg-white/[0.03]">
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
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-white/8 border border-white/10 transition-transform group-hover:scale-105">
                      {b.logo_url ? <Image src={b.logo_url} alt={b.name} fill className="object-contain p-1" sizes="36px" unoptimized />
                      : <div className="flex h-full w-full items-center justify-center text-white/20"><Building2 className="h-4 w-4" /></div>}
                    </div>
                    <span className="text-sm font-semibold text-white leading-tight">{b.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-white/30 font-mono text-xs">{b.slug}</td>
                <td className="px-5 py-3.5 text-sm text-white/30 max-w-xs truncate">{b.description || "—"}</td>
                <td className="px-5 py-3.5 text-center text-sm font-semibold text-white/70">{b.product_count}</td>
                <td className="px-5 py-3.5 text-center">{b.is_active ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-red-400">✗</span>}</td>
                <td className="px-5 py-3.5 whitespace-nowrap text-right"><span className="text-xs text-white/30">{new Date(b.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span></td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/brands/${b.id}/edit`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-ocean hover:bg-ocean/15 transition-colors">Edit</Link>
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
