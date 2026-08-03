"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Clock,
  Trash2,
  CheckCircle,
  ShoppingBag,
  Inbox,
  Package,
  Loader2,
} from "lucide-react";
import { updateOrderStatus, deleteOrder } from "@/actions/orders";
import { ORDER_STATUSES } from "@/lib/order-statuses";
import { cn } from "@/lib/utils";

interface OrderItem {
  id: string | null;
  order_id: string | null;
  product_id: string | null;
  product_name: string | null;
  variant: string | null;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  email: string | null;
  phone: string;
  address: string | null;
  notes: string | null;
  total_amount: number;
  status: string;
  created_at: string;
}

interface OrdersClientProps {
  orders: Order[];
  itemsByOrder: Record<string, OrderItem[]>;
}

const statusConfig = (status: string) => {
  switch (status) {
    case "pending": return { bg: "bg-amber-500/10", text: "text-amber-300", ring: "ring-amber-500/20", dot: "bg-amber-400" };
    case "confirmed": return { bg: "bg-blue-500/10", text: "text-blue-300", ring: "ring-blue-500/20", dot: "bg-blue-400" };
    case "processing": return { bg: "bg-violet-500/10", text: "text-violet-300", ring: "ring-violet-500/20", dot: "bg-violet-400" };
    case "shipped": return { bg: "bg-purple-500/10", text: "text-purple-300", ring: "ring-purple-500/20", dot: "bg-purple-400" };
    case "delivered": return { bg: "bg-emerald-500/10", text: "text-emerald-300", ring: "ring-emerald-500/20", dot: "bg-emerald-400" };
    case "cancelled": return { bg: "bg-red-500/10", text: "text-red-300", ring: "ring-red-500/20", dot: "bg-red-400" };
    default: return { bg: "bg-white/5", text: "text-white/50", ring: "ring-white/10", dot: "bg-white/30" };
  }
};

const formatRWF = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(amount);

const formatDate = (iso: string, opts?: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleString("en-GB", opts);

export function OrdersTable({ orders, itemsByOrder }: OrdersClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    orders[0]?.id || null
  );

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === "all") return true;
    return o.status === statusFilter;
  });

  const activeOrder = filteredOrders.find((o) => o.id === selectedOrderId) || filteredOrders[0];

  const handleStatusChange = (id: string, status: string) => {
    startTransition(async () => {
      const res = await updateOrderStatus(id, status);
      if (res?.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    });
  };

  const handleDelete = (id: string) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    if (!window.confirm(`Delete order #${order.order_number}? This cannot be undone.`)) return;
    startTransition(async () => {
      const res = await deleteOrder(id);
      if (res?.error) {
        alert(res.error);
      } else {
        setSelectedOrderId(null);
        router.refresh();
      }
    });
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/8 bg-white/[0.02] px-6 py-16 text-center">
        <ShoppingBag className="mb-4 h-12 w-12 text-white/20" />
        <p className="font-clash text-base font-semibold text-white/50">No orders found</p>
        <p className="mt-1 text-sm text-white/30">Orders will appear here once customers start purchasing.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
      {/* Master List Column */}
      <div className="lg:col-span-5 flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-caption font-bold uppercase tracking-wider text-white/30">
            Filter Status
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-white/8 bg-[#0a1628] px-3 py-1.5 text-xs text-white/70 focus:outline-none"
          >
            <option value="all">All Orders</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/8 bg-white/[0.02] py-20 text-center flex-1">
            <Inbox className="h-10 w-10 text-white/20 mb-3" />
            <p className="text-sm font-semibold text-white/50">No orders match filter</p>
          </div>
        ) : (
          <div className="space-y-2.5 overflow-y-auto max-h-[550px] pr-1 no-scrollbar">
            {filteredOrders.map((order) => {
              const active = activeOrder?.id === order.id;
              const cfg = statusConfig(order.status);
              return (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all flex flex-col gap-2 relative overflow-hidden group cursor-pointer",
                    active
                      ? "border-[#0f70c9] bg-[#0b2447]/60 shadow-lg"
                      : "border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/[0.07]"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-[#0f70c9] transition-colors truncate font-mono">
                      #{order.order_number}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring} shrink-0`}>
                      <span className={`h-1 w-1 rounded-full ${cfg.dot}`} />
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-white/70 line-clamp-1">
                    {order.customer_name}
                    {order.phone && <span className="text-white/40 font-medium"> · {order.phone}</span>}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#0f70c9]">
                      {formatRWF(Number(order.total_amount))}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] text-white/30">
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatDate(order.created_at, {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Column */}
      <div className="lg:col-span-7">
        {activeOrder ? (
          <div className="rounded-2xl border border-white/8 bg-white/5 p-6 space-y-6">
            {/* Header Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-caption font-bold uppercase tracking-wider text-white/30">
                  Order Actions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ring-1", statusConfig(activeOrder.status).bg, statusConfig(activeOrder.status).text, statusConfig(activeOrder.status).ring)}>
                  <span className={`h-1.5 w-1.5 rounded-full ${statusConfig(activeOrder.status).dot}`} />
                  {activeOrder.status}
                </span>
                <button
                  onClick={() => handleDelete(activeOrder.id)}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/25 transition-all cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>

            {/* Status Update */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 block mb-2">
                Update Status
              </span>
              <div className="flex flex-wrap gap-2">
                {ORDER_STATUSES.map((s) => {
                  const active = activeOrder.status === s;
                  const cfg = statusConfig(s);
                  return (
                    <button
                      key={s}
                      disabled={isPending}
                      onClick={() => handleStatusChange(activeOrder.id, s)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold capitalize transition-all cursor-pointer",
                        active
                          ? `${cfg.bg} ${cfg.text} ${cfg.ring} ring-1`
                          : "border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80"
                      )}
                    >
                      {active && isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                      <CheckCircle className="h-3.5 w-3.5" />
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Details Body */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 block mb-1">
                    Order
                  </span>
                  <h2 className="text-lg font-bold text-white font-clash font-mono">
                    #{activeOrder.order_number}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 block mb-1">
                    Ordered On
                  </span>
                  <p className="text-sm font-semibold text-white/70">
                    {formatDate(activeOrder.created_at, { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/[0.02] rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-2.5 text-sm">
                  <User className="h-4 w-4 text-white/30 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/30 leading-none">Customer Name</p>
                    <p className="text-white/80 font-medium mt-0.5">{activeOrder.customer_name || "—"}</p>
                  </div>
                </div>
                {activeOrder.email && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Mail className="h-4 w-4 text-white/30 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/30 leading-none">Email Address</p>
                      <a href={`mailto:${activeOrder.email}`} className="text-[#0f70c9] hover:underline font-medium mt-0.5 block">{activeOrder.email}</a>
                    </div>
                  </div>
                )}
                {activeOrder.phone && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Phone className="h-4 w-4 text-white/30 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/30 leading-none">Phone Number</p>
                      <a href={`tel:${activeOrder.phone}`} className="text-white/80 hover:underline font-medium mt-0.5 block">{activeOrder.phone}</a>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2.5 text-sm">
                  <Package className="h-4 w-4 text-white/30 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/30 leading-none">Items Count</p>
                    <p className="text-white/80 font-medium mt-0.5">
                      {(itemsByOrder[activeOrder.id] || []).length} item{(itemsByOrder[activeOrder.id] || []).length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 block mb-1.5">
                  Order Items
                </span>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 divide-y divide-white/5">
                  {(itemsByOrder[activeOrder.id] || []).length === 0 ? (
                    <p className="text-sm text-white/30 py-2">No items in this order</p>
                  ) : (
                    itemsByOrder[activeOrder.id].map((item, i) => (
                      <div key={item.id || i} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/8 text-[11px] font-bold text-white/40">
                            {item.quantity}x
                          </div>
                          <p className="text-sm font-medium text-white/80 truncate">
                            {item.product_name || `Product #${item.product_id?.slice(0, 8)}`}
                            {item.variant && (
                              <span className="ml-1.5 text-xs font-semibold text-[#0f70c9]">({item.variant})</span>
                            )}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-white">{formatRWF(Number(item.price))}</p>
                          <p className="text-[10px] text-white/30">× {item.quantity}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Total + Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 block mb-2">
                    Order Total
                  </span>
                  <p className="text-xl font-bold text-white font-clash">
                    {formatRWF(Number(activeOrder.total_amount))}
                  </p>
                </div>
                {activeOrder.address && (
                  <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 block mb-2">
                      Delivery Address
                    </span>
                    <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{activeOrder.address}</p>
                  </div>
                )}
              </div>

              {activeOrder.notes && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 block mb-1.5">
                    Customer Notes
                  </span>
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5 text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                    {activeOrder.notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/8 bg-white/[0.02] h-full py-32 text-center">
            <Inbox className="h-12 w-12 text-white/10 mb-4 animate-pulse" />
            <h3 className="font-clash text-lg font-bold text-white/70">No order selected</h3>
            <p className="text-sm text-white/30 mt-1">Select an order from the list to view its full details.</p>
          </div>
        )}
      </div>
    </div>
  );
}
