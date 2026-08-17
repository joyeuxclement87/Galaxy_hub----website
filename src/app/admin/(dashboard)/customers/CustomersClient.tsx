"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Users, Phone, Mail, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/ui";
import type { CustomerWithDetail } from "@/data/admin-customers";

const formatRWF = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(amount);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export function CustomersClient({ customers }: { customers: CustomerWithDetail[] }) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.phone ?? "").toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q)
    );
  }, [customers, search]);

  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438]/60 px-6 py-16 text-center">
        <Users className="mb-4 h-10 w-10 text-slate-300 dark:text-slate-600" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No customers yet</p>
        <p className="mt-1 max-w-sm text-sm text-slate-400 dark:text-slate-500">
          Customers are built automatically from orders, trade-ins and enquiries — no setup needed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone or email…"
          className="h-10 w-full rounded-lg border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] pl-9 pr-3 text-sm text-slate-700 dark:text-slate-300 shadow-sm placeholder:text-slate-400 focus:border-ocean/50 focus:outline-none focus:ring-2 focus:ring-ocean/10"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-[#1a3352] text-left">
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Customer</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Phone</th>
                <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Orders</th>
                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Total Spent</th>
                <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Trade-Ins</th>
                <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Messages</th>
                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Last Activity</th>
                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-[#1a3352]">
              {filtered.map((c) => {
                const open = expanded === c.key;
                return (
                  <CustomerRow key={c.key} customer={c} open={open} onToggle={() => setExpanded(open ? null : c.key)} />
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-slate-400 dark:text-slate-500">No customers match your search.</p>
        )}
      </div>
    </div>
  );
}

function CustomerRow({
  customer: c,
  open,
  onToggle,
}: {
  customer: CustomerWithDetail;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr
        className={cn("transition-colors hover:bg-slate-50 dark:hover:bg-[#132c46]/70", open && "bg-ocean-subtle dark:bg-ocean/15")}
      >
        <td className="px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ocean-light dark:bg-ocean/15 text-xs font-bold text-ocean dark:text-[#8ec5f2]">
              {c.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">{c.name}</p>
              {c.email && (
                <p className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                  <Mail className="h-3 w-3" />
                  {c.email}
                </p>
              )}
            </div>
          </div>
        </td>
        <td className="px-5 py-3">
          <span className="flex items-center gap-1.5 text-[13px] text-slate-500 dark:text-slate-400">
            <Phone className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            {c.phone ?? "—"}
          </span>
        </td>
        <td className="px-5 py-3 text-center text-[13px] font-bold text-slate-800 dark:text-slate-200">{c.orders}</td>
        <td className="px-5 py-3 text-right text-[13px] font-semibold text-slate-700 dark:text-slate-300">
          {formatRWF(c.totalSpent)}
        </td>
        <td className="px-5 py-3 text-center text-[13px] text-slate-600 dark:text-slate-400">{c.tradeIns}</td>
        <td className="px-5 py-3 text-center text-[13px] text-slate-600 dark:text-slate-400">{c.messages}</td>
        <td className="whitespace-nowrap px-5 py-3 text-right text-xs text-slate-400 dark:text-slate-500">
          {c.lastActivity ? formatDate(c.lastActivity) : "—"}
        </td>
        <td className="px-5 py-3 text-right">
          <button
            onClick={onToggle}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 dark:border-[#1e3a5f] px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-[#132c46]"
          >
            {open ? "Hide" : "View"}
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
          </button>
        </td>
      </tr>
      {open && (
        <tr className="border-b border-slate-100 dark:border-[#1a3352] bg-slate-50 dark:bg-[#0f2438]/60">
          <td colSpan={8} className="px-5 py-4">
            <CustomerDetailView customer={c} />
          </td>
        </tr>
      )}
    </>
  );
}

function CustomerDetailView({ customer: c }: { customer: CustomerWithDetail }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-lg border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] p-4">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Orders</h3>
        {c.detail.orders.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500">No orders yet</p>
        ) : (
          <ul className="space-y-1.5">
            {c.detail.orders.slice(0, 6).map((o) => (
              <li key={o.id}>
                <Link href={`/admin/orders/${o.id}`} className="flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-slate-50 dark:hover:bg-[#132c46]">
                  <span className="font-mono text-xs font-semibold text-ocean dark:text-[#8ec5f2]">#{o.order_number}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{formatRWF(o.total_amount)}</span>
                    <StatusBadge status={o.status} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] p-4">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Trade-Ins</h3>
        {c.detail.tradeIns.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500">No trade-ins</p>
        ) : (
          <ul className="space-y-1.5">
            {c.detail.tradeIns.slice(0, 6).map((t) => (
              <li key={t.id}>
                <Link href={`/admin/trade-ins/${t.id}`} className="flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-slate-50 dark:hover:bg-[#132c46]">
                  <span className="min-w-0">
                    <span className="block font-mono text-xs font-semibold text-ocean dark:text-[#8ec5f2]">{t.trade_in_id}</span>
                    <span className="block truncate text-[11px] text-slate-400 dark:text-slate-500">{t.wanted_product_name}</span>
                  </span>
                  <StatusBadge status={t.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] p-4">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Messages</h3>
        {c.detail.messages.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500">No messages</p>
        ) : (
          <ul className="space-y-1.5">
            {c.detail.messages.slice(0, 6).map((m) => (
              <li key={`${m.type}-${m.id}`}>
                <Link href="/admin/messages" className="flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-slate-50 dark:hover:bg-[#132c46]">
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {m.type === "contact" ? m.subject || "Contact message" : `Quote: ${m.subject || "Product"}`}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">{formatDate(m.created_at)}</span>
                  </span>
                  <StatusBadge status={m.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}