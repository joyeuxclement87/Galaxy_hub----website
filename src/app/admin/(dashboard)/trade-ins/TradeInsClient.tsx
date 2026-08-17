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
    case "pending": return { bg: "bg-amber-500/10", text: "text-amber-300", ring: "ring-amber-500/20", dot: "bg-amber-400" };
    case "under_review": return { bg: "bg-blue-500/10", text: "text-blue-300", ring: "ring-blue-500/20", dot: "bg-blue-400" };
    case "offer_sent": return { bg: "bg-violet-500/10", text: "text-violet-300", ring: "ring-violet-500/20", dot: "bg-violet-400" };
    case "accepted": return { bg: "bg-emerald-500/10", text: "text-emerald-300", ring: "ring-emerald-500/20", dot: "bg-emerald-400" };
    case "rejected": return { bg: "bg-red-500/10", text: "text-red-300", ring: "ring-red-500/20", dot: "bg-red-400" };
    case "completed": return { bg: "bg-teal-500/10", text: "text-teal-300", ring: "ring-teal-500/20", dot: "bg-teal-400" };
    case "cancelled": return { bg: "bg-white/10", text: "text-white/50", ring: "ring-white/15", dot: "bg-white/30" };
    default: return { bg: "bg-white/5", text: "text-white/50", ring: "ring-white/10", dot: "bg-white/30" };
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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/8 bg-white/[0.02] px-6 py-16 text-center">
        <Smartphone className="mb-4 h-12 w-12 text-white/20" />
        <p className="font-clash text-base font-semibold text-white/50">No trade-in requests yet</p>
        <p className="mt-1 text-sm text-white/30">Submissions will appear here once customers trade in their devices.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-caption font-bold uppercase tracking-wider text-white/30">
          Filter Status
        </span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-white/8 bg-[#0a1628] px-3 py-1.5 text-xs text-white/70 focus:outline-none"
        >
          <option value="all">All Requests</option>
          {TRADE_IN_STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ")}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/8 bg-white/[0.02] py-20 text-center">
          <Inbox className="h-10 w-10 text-white/20 mb-3" />
          <p className="text-sm font-semibold text-white/50">No trade-ins match filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
          {filtered.map((t) => {
            const cfg = statusConfig(t.status);
            return (
              <Link
                key={t.id}
                href={`/admin/trade-ins/${t.id}`}
                className="group rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:border-[#0f70c9]/50 hover:bg-white/[0.07]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-bold text-white group-hover:text-[#0f70c9] transition-colors">
                    {t.trade_in_id}
                  </span>
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 shrink-0", cfg.bg, cfg.text, cfg.ring)}>
                    <span className={cn("h-1 w-1 rounded-full", cfg.dot)} />
                    {t.status.replace(/_/g, " ")}
                  </span>
                </div>

                <p className="mt-2.5 text-xs font-semibold text-white/70 line-clamp-1">
                  <span className="text-[#0f70c9]">→</span> {t.wanted_product_name}
                  {t.wanted_product_storage && (
                    <span className="text-white/40 font-medium"> · {t.wanted_product_storage}</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-white/45 line-clamp-1">
                  <span className="text-white/30">←</span> {t.trade_device_brand}{" "}
                  {t.trade_device_model}
                  {t.trade_device_storage && (
                    <span className="text-white/30"> · {t.trade_device_storage}</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-white/45 line-clamp-1">
                  {t.customer_name}
                  {t.phone && <span className="text-white/30"> · {t.phone}</span>}
                </p>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {t.final_value !== null ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {formatRWF(t.final_value)}
                      </span>
                    ) : t.estimated_value !== null ? (
                      <span className="text-xs font-bold text-[#0f70c9]">{formatRWF(t.estimated_value)}</span>
                    ) : (
                      <span className="text-xs text-white/30">No value set</span>
                    )}
                    {!t.telegram_sent && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-400/80">
                        <XCircle className="h-3 w-3" />
                        Telegram failed
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] text-white/30">
                    <Clock className="h-3 w-3" />
                    {formatDate(t.created_at, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <ChevronRight className="h-4 w-4 text-white/25 transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}