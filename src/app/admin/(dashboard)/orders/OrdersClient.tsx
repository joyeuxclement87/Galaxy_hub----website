"use client";

import Link from "next/link";
import { ShoppingBag, Eye } from "lucide-react";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-300 ring-amber-500/20",
  confirmed: "bg-blue-500/10 text-blue-300 ring-blue-500/20",
  processing: "bg-violet-500/10 text-violet-300 ring-violet-500/20",
  shipped: "bg-purple-500/10 text-purple-300 ring-purple-500/20",
  delivered: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-300 ring-red-500/20",
};

const statusDots: Record<string, string> = {
  pending: "bg-amber-400",
  confirmed: "bg-blue-400",
  processing: "bg-violet-400",
  shipped: "bg-purple-400",
  delivered: "bg-emerald-400",
  cancelled: "bg-red-400",
};

export function OrdersTable({ orders }: { orders: { id: string; order_number: string; customer_name: string; email: string | null; total_amount: number; status: string; created_at: string }[] }) {
  if (orders.length === 0) return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/8 bg-white/[0.02] px-6 py-16 text-center">
      <ShoppingBag className="mb-4 h-12 w-12 text-white/20" />
      <p className="font-clash text-base font-semibold text-white/50">No orders found</p>
      <p className="mt-1 text-sm text-white/30">Orders will appear here once customers start purchasing.</p>
    </div>
  );

  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-white/15">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 text-left">
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-white/30">Order</th>
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-white/30">Customer</th>
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-white/30">Email</th>
              <th className="px-5 py-3.5 text-right text-caption font-bold uppercase tracking-[0.12em] text-white/30">Total</th>
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-white/30">Status</th>
              <th className="px-5 py-3.5 text-right text-caption font-bold uppercase tracking-[0.12em] text-white/30">Date</th>
              <th className="px-5 py-3.5 text-right text-caption font-bold uppercase tracking-[0.12em] text-white/30">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((o) => (
              <tr key={o.id} className="group transition-colors hover:bg-white/[0.03]">
                <td className="px-5 py-3.5">
                  <span className="font-mono text-xs font-bold text-ocean">#{o.order_number || o.id.slice(0, 8)}</span>
                </td>
                <td className="px-5 py-3.5 text-sm font-semibold text-white/80">{o.customer_name || "—"}</td>
                <td className="px-5 py-3.5 text-sm text-white/30">{o.email || "—"}</td>
                <td className="px-5 py-3.5 text-right">
                  <span className="text-sm font-bold text-white">{new Intl.NumberFormat("en-US", { style: "currency", currency: "RWF" }).format(o.total_amount)}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${statusStyles[o.status] || "bg-white/5 text-white/40 ring-white/10"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${statusDots[o.status] || "bg-white/30"}`} />
                    {o.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right whitespace-nowrap">
                  <span className="text-xs text-white/30">{new Date(o.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link href={`/admin/orders/${o.id}`} className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ocean hover:bg-ocean/15 transition-colors"><Eye className="h-3 w-3" /> View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
