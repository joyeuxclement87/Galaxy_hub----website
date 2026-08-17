"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Smartphone, Inbox, Clock, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import type { Database } from "@/types/database";
import { TRADE_IN_STATUSES } from "@/lib/trade-in";
import { cn } from "@/lib/utils";

type TradeIn = Database["public"]["Tables"]["trade_ins"]["Row"];

const statusConfig = (status: string) => {
  switch (status) {
    case "pending": return { bg: "bg-amber-50 dark:bg-amber-500/15", text: "text-amber-600 dark:text-amber-300", ring: "ring-amber-100 dark:ring-amber-500/25", dot: "bg-amber-400" };
    case "under_review": return { bg: "bg-blue-50 dark:bg-blue-500/15", text: "text-blue-600 dark:text-blue-300", ring: "ring-blue-100 dark:ring-blue-500/25", dot: "bg-blue-400" };
    case "offer_sent": return { bg: "bg-violet-50 dark:bg-violet-500/15", text: "text-violet-600 dark:text-violet-300", ring: "ring-violet-100 dark:ring-violet-500/25", dot: "bg-violet-400" };
    case "accepted": return { bg: "bg-emerald-50 dark:bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-300", ring: "ring-emerald-100 dark:ring-emerald-500/25", dot: "bg-emerald-400" };
    case "rejected": return { bg: "bg-red-50 dark:bg-red-500/15", text: "text-red-600 dark:text-red-300", ring: "ring-red-100 dark:ring-red-500/25", dot: "bg-red-400" };
    case "completed": return { bg: "bg-teal-50 dark:bg-teal-500/15", text: "text-teal-600 dark:text-teal-300", ring: "ring-teal-100 dark:ring-teal-500/25", dot: "bg-teal-400" };
    case "cancelled": return { bg: "bg-slate-100 dark:bg-[#162f4a]", text: "text-slate-500 dark:text-slate-400", ring: "ring-slate-200", dot: "bg-slate-200 dark:bg-slate-600" };
    default: return { bg: "bg-slate-50 dark:bg-[#0f2438]", text: "text-slate-500 dark:text-slate-400", ring: "ring-slate-200", dot: "bg-slate-200 dark:bg-slate-600" };
  }
};

const formatRWF = (amount: number | null) =>
  amount === null
    ? "—"
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(amount);

const formatDate = (iso: string, opts?: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleString("en-GB", opts);

export function TradeInsClient({ tradeIns }: { tradeIns: TradeIn[] }) {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = tradeIns.filter((t) => {
    if (statusFilter === "all") return true;
    return t.status === statusFilter;
  });

  if (tradeIns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-6 py-16 text-center">
        <Smartphone className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
        <p className="font-clash text-base font-semibold text-slate-500 dark:text-slate-400">No trade-in requests yet</p>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Submissions will appear here once customers trade in their devices.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-caption font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Filter Status
        </span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 focus:outline-none"
        >
          <option value="all">All Requests</option>
          {TRADE_IN_STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ")}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] py-20 text-center">
          <Inbox className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No trade-ins match filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
          {filtered.map((t) => {
            const cfg = statusConfig(t.status);
            return (
              <Link
                key={t.id}
                href={`/admin/trade-ins/${t.id}`}
                className="group rounded-2xl border border-slate-100 dark:border-[#1a3352] bg-slate-50 dark:bg-[#0f2438] p-4 transition-all hover:border-[#0f70c9]/50 hover:bg-white dark:hover:bg-[#132c46]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#0f70c9] transition-colors">
                    {t.trade_in_id}
                  </span>
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 shrink-0", cfg.bg, cfg.text, cfg.ring)}>
                    <span className={cn("h-1 w-1 rounded-full", cfg.dot)} />
                    {t.status.replace(/_/g, " ")}
                  </span>
                </div>

                <p className="mt-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 line-clamp-1">
                  <span className="text-[#0f70c9]">→</span> {t.wanted_product_name}
                  {t.wanted_product_storage && (
                    <span className="text-slate-400 dark:text-slate-500 font-medium"> · {t.wanted_product_storage}</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  <span className="text-slate-400 dark:text-slate-500">←</span> {t.trade_device_brand}{" "}
                  {t.trade_device_model}
                  {t.trade_device_storage && (
                    <span className="text-slate-400 dark:text-slate-500"> · {t.trade_device_storage}</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {t.customer_name}
                  {t.phone && <span className="text-slate-400 dark:text-slate-500"> · {t.phone}</span>}
                </p>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {t.final_value !== null ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {formatRWF(t.final_value)}
                      </span>
                    ) : t.estimated_value !== null ? (
                      <span className="text-xs font-bold text-[#0f70c9]">{formatRWF(t.estimated_value)}</span>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500">No value set</span>
                    )}
                    {!t.telegram_sent && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-400/80">
                        <XCircle className="h-3 w-3" />
                        Telegram failed
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500">
                    <Clock className="h-3 w-3" />
                    {formatDate(t.created_at, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}