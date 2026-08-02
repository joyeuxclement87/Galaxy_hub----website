"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import { updateOrderStatus } from "@/actions/orders";
import { ORDER_STATUSES } from "@/lib/order-statuses";
import type { OrderWithItems } from "@/data/admin-orders";

const statuses = [...ORDER_STATUSES];

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  confirmed: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  processing: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  shipped: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  delivered: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-300 border-red-500/20",
};

export function OrderDetailClient({ order: initial }: { order: OrderWithItems }) {
  const router = useRouter();
  const [order, setOrder] = useState(initial);
  const [pending, startTransition] = useTransition();

  const handleStatusChange = async (newStatus: string) => {
    startTransition(async () => {
      const result = await updateOrderStatus(order.id, newStatus);
      if (result?.error) { alert(result.error); return; }
      setOrder((prev) => ({ ...prev, status: newStatus }));
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div>
          <h1 className="font-clash text-2xl font-bold text-white tracking-tight">Order #{order.order_number || order.id.slice(0, 8)}</h1>
          <p className="mt-0.5 text-sm text-white/40">{new Date(order.created_at).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" })}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-white/8 bg-white/5 p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/30">Order Items</h2>
            {order.items.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-white/20">
                <Package className="mb-2 h-8 w-8" />
                <p className="text-sm">No items in this order</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {order.items.map((item, i) => (
                  <div key={item.id || i} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/8 text-xs font-bold text-white/40">{item.quantity}x</div>
                      <div>
                        <p className="text-sm font-medium text-white/80">
                          {item.product_name || `Product #${item.product_id?.slice(0, 8)}`}
                          {item.variant && <span className="ml-1.5 text-xs font-semibold text-ocean-light">({item.variant})</span>}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{new Intl.NumberFormat("en-US", { style: "currency", currency: "RWF" }).format(Number(item.price))}</p>
                      <p className="text-xs text-white/30">× {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/8 bg-white/5 p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/30">Status</h2>
            <div className="space-y-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={pending}
                  onClick={() => handleStatusChange(s)}
                  className={`block w-full cursor-pointer rounded-xl border px-4 py-2.5 text-left text-sm font-medium capitalize transition-all ${order.status === s ? (statusColors[s] || "") + " ring-2 ring-offset-1 ring-offset-[#0a1628]" : "border-white/8 text-white/50 hover:bg-white/8 hover:text-white/70"}`}
                >
                  {s}
                  {s === order.status && pending && <Loader2 className="ml-2 inline h-3 w-3 animate-spin" />}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/5 p-6">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white/30">Customer</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-white/40">Name</dt>
                <dd className="font-medium text-white/80">{order.customer_name || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/40">Email</dt>
                <dd className="font-medium text-white/80">{order.email || "—"}</dd>
              </div>
              {order.phone && <div className="flex justify-between">
                <dt className="text-white/40">Phone</dt>
                <dd className="font-medium text-white/80">{order.phone}</dd>
              </div>}
            </dl>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/5 p-6">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white/30">Total</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between border-t border-white/5 pt-2">
                <dt className="font-semibold text-white/60">Total</dt>
                <dd className="font-bold text-white">{new Intl.NumberFormat("en-US", { style: "currency", currency: "RWF" }).format(Number(order.total_amount))}</dd>
              </div>
            </dl>
          </div>

          {order.address && <div className="rounded-2xl border border-white/8 bg-white/5 p-6">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white/30">Shipping Address</h2>
            <p className="text-sm text-white/60 whitespace-pre-line">{order.address}</p>
          </div>}

          {order.notes && <div className="rounded-2xl border border-white/8 bg-white/5 p-6">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white/30">Notes</h2>
            <p className="text-sm text-white/60 whitespace-pre-line">{order.notes}</p>
          </div>}
        </div>
      </div>
    </div>
  );
}
