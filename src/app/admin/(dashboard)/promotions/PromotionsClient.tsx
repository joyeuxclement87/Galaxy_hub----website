"use client";

import Image from "next/image";
import Link from "next/link";
import { Megaphone, Trash2 } from "lucide-react";
import { deletePromotion } from "@/actions/promotions";

export function PromotionsTable({ promotions }: { promotions: { id: string; title: string; description: string | null; image_url: string | null; discount_percentage: number | null; starts_at: string | null; ends_at: string | null; is_active: boolean; created_at: string }[] }) {
  if (promotions.length === 0) return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/8 bg-white/[0.02] px-6 py-16 text-center">
      <Megaphone className="mb-4 h-12 w-12 text-white/20" />
      <p className="font-clash text-base font-semibold text-white/50">No promotions found</p>
      <p className="mt-1 text-sm text-white/30">Add your first promotion to get started.</p>
    </div>
  );

  const now = new Date();

  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-white/15">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 text-left">
              <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">Title</th>
              <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">Discount</th>
              <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">Period</th>
              <th className="px-5 py-3.5 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">Status</th>
              <th className="px-5 py-3.5 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">Active</th>
              <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {promotions.map((p) => {
              const active = p.is_active && (!p.starts_at || new Date(p.starts_at) <= now) && (!p.ends_at || new Date(p.ends_at) >= now);
              return (
                <tr key={p.id} className="group transition-colors hover:bg-white/[0.03]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-16 shrink-0 overflow-hidden rounded-xl bg-white/8 border border-white/10 transition-transform group-hover:scale-105">
                        {p.image_url ? <Image src={p.image_url} alt={p.title} fill className="object-cover" sizes="64px" unoptimized />
                        : <div className="flex h-full w-full items-center justify-center text-white/20"><Megaphone className="h-4 w-4" /></div>}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-white leading-tight">{p.title}</span>
                        {p.description && <p className="text-xs text-white/30 truncate max-w-60 mt-0.5">{p.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {p.discount_percentage ? <span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/20">{p.discount_percentage}% OFF</span> : <span className="text-white/20">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-white/30 whitespace-nowrap">
                    {p.starts_at ? new Date(p.starts_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—"}
                    &nbsp;→&nbsp;
                    {p.ends_at ? new Date(p.ends_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${active ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20" : p.is_active ? "bg-blue-500/10 text-blue-300 ring-blue-500/20" : "bg-white/5 text-white/40 ring-white/10"}`}>
                      {active ? "Live" : p.is_active ? "Scheduled" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">{p.is_active ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-red-400">✗</span>}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/promotions/${p.id}/edit`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-ocean hover:bg-ocean/15 transition-colors">Edit</Link>
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
  );
}
