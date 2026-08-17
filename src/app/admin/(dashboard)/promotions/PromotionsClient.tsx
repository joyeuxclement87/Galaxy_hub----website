"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Megaphone, Trash2 } from "lucide-react";
import { deletePromotion, deletePromotions } from "@/actions/promotions";
import { useBulkSelection } from "@/hooks/use-bulk-selection";
import { BulkDeleteBar } from "@/components/admin/BulkDeleteBar";

export function PromotionsTable({ promotions }: { promotions: { id: string; title: string; description: string | null; image_url: string | null; discount_percentage: number | null; starts_at: string | null; ends_at: string | null; is_active: boolean; created_at: string }[] }) {
  const router = useRouter();
  const { selected, toggle, toggleAll, clear, allSelected, count } = useBulkSelection(
    useMemo(() => promotions.map((p) => p.id), [promotions]),
  );

  if (promotions.length === 0) return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-6 py-16 text-center">
      <Megaphone className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
      <p className="font-clash text-base font-semibold text-slate-500 dark:text-slate-400">No promotions found</p>
      <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Add your first promotion to get started.</p>
    </div>
  );

  const now = new Date();

  return (
    <div className="space-y-3">
      <BulkDeleteBar
        count={count}
        label={count === 1 ? "promotion" : "promotions"}
        onDelete={async () => {
          const result = await deletePromotions([...selected]);
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
                  disabled={promotions.length === 0}
                  aria-label="Select all promotions"
                  className="h-4 w-4 cursor-pointer rounded accent-ocean"
                />
              </th>
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Title</th>
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Discount</th>
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Period</th>
              <th className="px-5 py-3.5 text-center text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Status</th>
              <th className="px-5 py-3.5 text-center text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Active</th>
              <th className="px-5 py-3.5 text-right text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1a3352]">
            {promotions.map((p) => {
              const active = p.is_active && (!p.starts_at || new Date(p.starts_at) <= now) && (!p.ends_at || new Date(p.ends_at) >= now);
              return (
                <tr key={p.id} className="group transition-colors hover:bg-slate-50 dark:hover:bg-[#132c46]">
                  <td className="px-5 py-3.5">
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      onChange={() => toggle(p.id)}
                      aria-label={`Select ${p.title}`}
                      className="h-4 w-4 cursor-pointer rounded accent-ocean"
                    />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-[#162f4a] border border-slate-200 dark:border-[#1e3a5f] transition-transform group-hover:scale-105">
                        {p.image_url ? <Image src={p.image_url} alt={p.title} fill className="object-cover" sizes="64px" unoptimized />
                        : <div className="flex h-full w-full items-center justify-center text-slate-300 dark:text-slate-600"><Megaphone className="h-4 w-4" /></div>}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">{p.title}</span>
                        {p.description && <p className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-60 mt-0.5">{p.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {p.discount_percentage ? <span className="inline-flex rounded-full bg-emerald-50 dark:bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300 ring-1 ring-emerald-100 dark:ring-emerald-500/25">{p.discount_percentage}% OFF</span> : <span className="text-slate-300 dark:text-slate-600">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                    {p.starts_at ? new Date(p.starts_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—"}
                    &nbsp;→&nbsp;
                    {p.ends_at ? new Date(p.ends_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${active ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 ring-emerald-100 dark:ring-emerald-500/25" : p.is_active ? "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-300 ring-blue-100 dark:ring-blue-500/25" : "bg-slate-50 dark:bg-[#0f2438] text-slate-400 dark:text-slate-500 ring-slate-200"}`}>
                      {active ? "Live" : p.is_active ? "Scheduled" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">{p.is_active ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-red-400">✗</span>}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/promotions/${p.id}/edit`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-ocean dark:text-[#8ec5f2] hover:bg-ocean/15 transition-colors">Edit</Link>
                      <form action={async () => {
                        if (!window.confirm("Delete this promotion? This action cannot be undone.")) return;
                        const r = await deletePromotion(p.id);
                        if (r?.error) alert(r.error);
                      }}>
                        <button type="submit" className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/15 transition-colors"><Trash2 className="h-3 w-3" /> Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
