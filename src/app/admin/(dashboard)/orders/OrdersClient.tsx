"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  Search,
} from "lucide-react";
import { updateOrderStatus, deleteOrder } from "@/actions/orders";
import { ORDER_STATUSES } from "@/lib/order-statuses";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/ui";

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
    case "pending": return { bg: "bg-amber-50 dark:bg-amber-500/15", text: "text-amber-600 dark:text-amber-300", ring: "ring-amber-100 dark:ring-amber-500/25", dot: "bg-amber-400" };
    case "confirmed": return { bg: "bg-blue-50 dark:bg-blue-500/15", text: "text-blue-600 dark:text-blue-300", ring: "ring-blue-100 dark:ring-blue-500/25", dot: "bg-blue-400" };
    case "processing": return { bg: "bg-violet-50 dark:bg-violet-500/15", text: "text-violet-600 dark:text-violet-300", ring: "ring-violet-100 dark:ring-violet-500/25", dot: "bg-violet-400" };
    case "shipped": return { bg: "bg-purple-50 dark:bg-purple-500/15", text: "text-purple-600 dark:text-purple-300", ring: "ring-purple-100 dark:ring-purple-500/25", dot: "bg-purple-400" };
    case "delivered": return { bg: "bg-emerald-50 dark:bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-300", ring: "ring-emerald-100 dark:ring-emerald-500/25", dot: "bg-emerald-400" };
    case "cancelled": return { bg: "bg-red-50 dark:bg-red-500/15", text: "text-red-600 dark:text-red-300", ring: "ring-red-100 dark:ring-red-500/25", dot: "bg-red-400" };
    default: return { bg: "bg-slate-50 dark:bg-[#0f2438]", text: "text-slate-500 dark:text-slate-400", ring: "ring-slate-200", dot: "bg-slate-200 dark:bg-slate-600" };
  }
};

const formatRWF = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(amount);

const formatDate = (iso: string, opts?: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleString("en-GB", opts);

export function OrdersTable({ orders, itemsByOrder }: OrdersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") ?? "all");
  const [query, setQuery] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    orders[0]?.id || null
  );

  const setFilter = (status: string) => {
    setStatusFilter(status);
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") params.delete("status");
    else params.set("status", status);
    router.replace(`/admin/orders?${params.toString()}`, { scroll: false });
  };

  const statusCounts = (status: string) =>
    orders.filter((o) => o.status === status).length;

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      const hay = `${o.order_number} ${o.customer_name} ${o.phone ?? ""} ${o.email ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438]/50 px-6 py-16 text-center">
        <ShoppingBag className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
        <p className="font-display text-base font-semibold text-slate-500 dark:text-slate-400">No orders found</p>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Orders will appear here once customers start purchasing.</p>
      </div>
    );
  }

  return (
    <div className="grid min-h-[550px] grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Master List Column */}
      <div className="flex flex-col space-y-3 lg:col-span-5">
        <div className="flex flex-col gap-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search order number, name, phone…"
              className="h-9 w-full rounded-lg border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] pl-9 pr-3 text-sm text-slate-700 dark:text-slate-300 shadow-sm placeholder:text-slate-400 focus:border-ocean/50 focus:outline-none focus:ring-2 focus:ring-ocean/10"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "cursor-pointer rounded-md border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors",
                statusFilter === "all"
                  ? "border-ocean dark:border-[#4da3e0] bg-ocean text-white"
                  : "border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
              )}
            >
              All ({orders.length})
            </button>
            {ORDER_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "cursor-pointer rounded-md border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors",
                  statusFilter === s
                    ? "border-ocean dark:border-[#4da3e0] bg-ocean text-white"
                    : "border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                )}
              >
                {s} ({statusCounts(s)})
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438]/50 py-20 text-center">
            <Inbox className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No orders match filter</p>
          </div>
        ) : (
          <div className="no-scrollbar max-h-[550px] space-y-2.5 overflow-y-auto pr-1">
            {filteredOrders.map((order) => {
              const active = activeOrder?.id === order.id;
              const cfg = statusConfig(order.status);
              return (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={cn(
                    "group relative flex w-full cursor-pointer flex-col gap-2 overflow-hidden rounded-2xl border p-4 text-left transition-all",
                    active
                      ? "border-ocean dark:border-[#4da3e0] bg-ocean-light dark:bg-ocean/15 shadow-lg"
                      : "border-slate-100 dark:border-[#1a3352] bg-slate-50 dark:bg-[#0f2438] hover:border-slate-200 dark:border-[#1e3a5f] dark:hover:border-slate-600 hover:bg-white dark:hover:bg-[#132c46]"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-mono text-sm font-bold text-slate-900 dark:text-slate-100 transition-colors group-hover:text-ocean dark:group-hover:text-[#8ec5f2] dark:hover:text-[#8ec5f2]">
                      #{order.order_number}
                    </span>
                    <span className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1", cfg.bg, cfg.text, cfg.ring)}>
                      <span className={cn("h-1 w-1 rounded-full", cfg.dot)} />
                      {order.status}
                    </span>
                  </div>
                  <p className="line-clamp-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {order.customer_name}
                    {order.phone && <span className="font-medium text-slate-400 dark:text-slate-500"> · {order.phone}</span>}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-ocean dark:text-[#8ec5f2]">
                      {formatRWF(Number(order.total_amount))}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500">
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
          <div className="space-y-6 rounded-2xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] p-6">
            {/* Header Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-[#1a3352] pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Order Actions
              </span>
              <div className="flex items-center gap-2">
                <StatusBadge status={activeOrder.status} />
                <button
                  onClick={() => handleDelete(activeOrder.id)}
                  disabled={isPending}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-300 transition-colors hover:bg-red-100 dark:hover:bg-red-500/20 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>

            {/* Status Update */}
            <div>
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
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
                        "inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold capitalize transition-all disabled:opacity-50",
                        active
                          ? `${cfg.bg} ${cfg.text} ${cfg.ring} ring-1`
                          : "border-slate-200 dark:border-[#1e3a5f] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1c3a5c] hover:text-slate-700 dark:hover:text-slate-200"
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
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Order
                  </span>
                  <h2 className="font-display font-mono text-lg font-bold text-slate-900 dark:text-slate-100">
                    #{activeOrder.order_number}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Ordered On
                  </span>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    {formatDate(activeOrder.created_at, { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-100 dark:border-[#1a3352] bg-white dark:bg-[#0f2438] p-4 md:grid-cols-2">
                <div className="flex items-center gap-2.5 text-sm">
                  <User className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                  <div>
                    <p className="text-[10px] font-bold uppercase leading-none tracking-wider text-slate-400 dark:text-slate-500">Customer Name</p>
                    <p className="mt-0.5 font-medium text-slate-700 dark:text-slate-300">{activeOrder.customer_name || "—"}</p>
                  </div>
                </div>
                {activeOrder.email && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Mail className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                    <div>
                      <p className="text-[10px] font-bold uppercase leading-none tracking-wider text-slate-400 dark:text-slate-500">Email Address</p>
                      <a href={`mailto:${activeOrder.email}`} className="mt-0.5 block font-medium text-ocean dark:text-[#8ec5f2] hover:underline">{activeOrder.email}</a>
                    </div>
                  </div>
                )}
                {activeOrder.phone && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Phone className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                    <div>
                      <p className="text-[10px] font-bold uppercase leading-none tracking-wider text-slate-400 dark:text-slate-500">Phone Number</p>
                      <a href={`tel:${activeOrder.phone}`} className="mt-0.5 block font-medium text-slate-700 dark:text-slate-300 hover:underline">{activeOrder.phone}</a>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2.5 text-sm">
                  <Package className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                  <div>
                    <p className="text-[10px] font-bold uppercase leading-none tracking-wider text-slate-400 dark:text-slate-500">Items Count</p>
                    <p className="mt-0.5 font-medium text-slate-700 dark:text-slate-300">
                      {(itemsByOrder[activeOrder.id] || []).length} item{(itemsByOrder[activeOrder.id] || []).length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Order Items
                </span>
                <div className="divide-y divide-slate-100 dark:divide-[#1a3352] rounded-2xl border border-slate-100 dark:border-[#1a3352] bg-white dark:bg-[#0f2438] p-4">
                  {(itemsByOrder[activeOrder.id] || []).length === 0 ? (
                    <p className="py-2 text-sm text-slate-400 dark:text-slate-500">No items in this order</p>
                  ) : (
                    itemsByOrder[activeOrder.id].map((item, i) => (
                      <div key={item.id || i} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-[#162f4a] text-[11px] font-bold text-slate-400 dark:text-slate-500">
                            {item.quantity}x
                          </div>
                          <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                            {item.product_name || `Product #${item.product_id?.slice(0, 8)}`}
                            {item.variant && (
                              <span className="ml-1.5 text-xs font-semibold text-ocean dark:text-[#8ec5f2]">({item.variant})</span>
                            )}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{formatRWF(Number(item.price))}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500">× {item.quantity}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Total + Address */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 dark:border-[#1a3352] bg-white dark:bg-[#0f2438] p-4">
                  <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Order Total
                  </span>
                  <p className="font-display text-xl font-bold text-slate-900 dark:text-slate-100">
                    {formatRWF(Number(activeOrder.total_amount))}
                  </p>
                </div>
                {activeOrder.address && (
                  <div className="rounded-2xl border border-slate-100 dark:border-[#1a3352] bg-white dark:bg-[#0f2438] p-4">
                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Delivery Address
                    </span>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-400">{activeOrder.address}</p>
                  </div>
                )}
              </div>

              {activeOrder.notes && (
                <div>
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Customer Notes
                  </span>
                  <div className="whitespace-pre-wrap rounded-2xl border border-slate-100 dark:border-[#1a3352] bg-white dark:bg-[#0f2438] p-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {activeOrder.notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438]/50 py-32 text-center">
            <Inbox className="mb-4 h-12 w-12 animate-pulse text-slate-300 dark:text-slate-600" />
            <h3 className="font-display text-lg font-bold text-slate-600 dark:text-slate-400">No order selected</h3>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Select an order from the list to view its full details.</p>
          </div>
        )}
      </div>
    </div>
  );
}