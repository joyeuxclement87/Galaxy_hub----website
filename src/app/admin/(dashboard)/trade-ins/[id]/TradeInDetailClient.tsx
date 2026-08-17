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
  RefreshCw,
  CheckCircle2,
  XCircle,
  ImageIcon,
  Save,
  Loader2,
  Smartphone,
  PackageOpen,
  StickyNote,
  AlertTriangle,
  ArrowDown,
} from "lucide-react";
import { updateTradeIn, resendTradeInTelegram, deleteTradeIn } from "@/actions/trade-ins";
import { TRADE_IN_STATUSES, conditionLabel, formatTradeInValue } from "@/lib/trade-in";
import type { Database } from "@/types/database";
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

const formatDate = (iso: string, opts?: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleString("en-GB", opts);

export function TradeInDetailClient({ tradeIn }: { tradeIn: TradeIn }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statusBusy, setStatusBusy] = useState(false);

  const [estimatedValue, setEstimatedValue] = useState(
    tradeIn.estimated_value === null ? "" : String(tradeIn.estimated_value)
  );
  const [finalValue, setFinalValue] = useState(
    tradeIn.final_value === null ? "" : String(tradeIn.final_value)
  );
  const [adminNotes, setAdminNotes] = useState(tradeIn.admin_notes ?? "");
  const [valueSaved, setValueSaved] = useState<"estimated" | "final" | "notes" | null>(null);

  const cfg = statusConfig(tradeIn.status);

  const changeStatus = (status: string) => {
    if (status === tradeIn.status) return;
    setStatusBusy(true);
    startTransition(async () => {
      const res = await updateTradeIn(tradeIn.id, { status });
      setStatusBusy(false);
      if (res?.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    });
  };

  const saveValue = (field: "estimated" | "final") => {
    const raw = field === "estimated" ? estimatedValue : finalValue;
    const value = raw.trim() === "" ? null : Number(raw.replace(/[^\d]/g, ""));
    if (value !== null && (!Number.isFinite(value) || value < 0)) {
      alert("Please enter a valid positive number.");
      return;
    }
    startTransition(async () => {
      const res = await updateTradeIn(tradeIn.id, {
        [field === "estimated" ? "estimated_value" : "final_value"]: value,
      });
      if (res?.error) {
        alert(res.error);
      } else {
        setValueSaved(field);
        setTimeout(() => setValueSaved(null), 2000);
        router.refresh();
      }
    });
  };

  const saveNotes = () => {
    startTransition(async () => {
      const res = await updateTradeIn(tradeIn.id, { admin_notes: adminNotes || null });
      if (res?.error) {
        alert(res.error);
      } else {
        setValueSaved("notes");
        setTimeout(() => setValueSaved(null), 2000);
        router.refresh();
      }
    });
  };

  const retryTelegram = () => {
    startTransition(async () => {
      const res = await resendTradeInTelegram(tradeIn.id);
      if (res?.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    });
  };

  const handleDelete = () => {
    if (!window.confirm(`Delete ${tradeIn.trade_in_id}? This cannot be undone.`)) return;
    startTransition(async () => {
      const res = await deleteTradeIn(tradeIn.id);
      if (res?.error) {
        alert(res.error);
      } else {
        router.push("/admin/trade-ins");
        router.refresh();
      }
    });
  };

  const valueInputClass =
    "w-full rounded-xl border border-white/8 bg-[#0a1628] px-3 py-2 text-sm text-white focus:border-[#0f70c9] focus:outline-none";

  return (
    <div className="space-y-6">
      {/* Header action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/5 p-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 block mb-1">
            Status
          </span>
          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ring-1", cfg.bg, cfg.text, cfg.ring)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
            {tradeIn.status.replace(/_/g, " ")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {tradeIn.telegram_sent ? (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Telegram Sent
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-400">
              <XCircle className="h-3.5 w-3.5" />
              Telegram Not Sent
            </span>
          )}
          <button
            onClick={retryTelegram}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f70c9]/15 border border-[#0f70c9]/25 px-3 py-1.5 text-xs font-semibold text-[#69b1e8] hover:bg-[#0f70c9]/30 transition-all cursor-pointer disabled:opacity-60"
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Retry Telegram
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/25 transition-all cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>

      {/* Status update */}
      <div className="rounded-2xl border border-white/8 bg-white/5 p-6">
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 block mb-3">
          Update Status
        </span>
        <div className="flex flex-wrap gap-2">
          {TRADE_IN_STATUSES.map((s) => {
            const active = tradeIn.status === s;
            const c = statusConfig(s);
            return (
              <button
                key={s}
                disabled={statusBusy || active}
                onClick={() => changeStatus(s)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold capitalize transition-all cursor-pointer disabled:cursor-default",
                  active
                    ? `${c.bg} ${c.text} ${c.ring} ring-1`
                    : "border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80"
                )}
              >
                <CheckCircle className="h-3.5 w-3.5" />
                {s.replace(/_/g, " ")}
              </button>
            );
          })}
        </div>
      </div>

      {/* Customer + device details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/8 bg-white/5 p-6 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 block">
            Customer
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2.5 text-sm">
              <User className="h-4 w-4 text-white/30 shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/30 leading-none">Name</p>
                <p className="text-white/80 font-medium mt-0.5">{tradeIn.customer_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Phone className="h-4 w-4 text-white/30 shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/30 leading-none">Phone</p>
                <a href={`tel:${tradeIn.phone}`} className="text-white/80 hover:underline font-medium mt-0.5 block">{tradeIn.phone}</a>
              </div>
            </div>
            {tradeIn.email && (
              <div className="flex items-center gap-2.5 text-sm md:col-span-2">
                <Mail className="h-4 w-4 text-white/30 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/30 leading-none">Email</p>
                  <a href={`mailto:${tradeIn.email}`} className="text-[#0f70c9] hover:underline font-medium mt-0.5 block">{tradeIn.email}</a>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2.5 text-sm">
              <Clock className="h-4 w-4 text-white/30 shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/30 leading-none">Submitted</p>
                <p className="text-white/80 font-medium mt-0.5">{formatDate(tradeIn.created_at, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 space-y-4">
            {/* Device wanted */}
            <div className="rounded-xl border border-[#0f70c9]/20 bg-[#0f70c9]/[0.06] p-4">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#69b1e8]">
                <ArrowDown className="h-3 w-3" /> Device Wanted
              </p>
              <p className="mt-2 font-clash text-base font-bold text-white">
                {tradeIn.wanted_product_name || "—"}
                {tradeIn.wanted_product_storage && (
                  <span className="text-white/40 font-medium"> · {tradeIn.wanted_product_storage}</span>
                )}
              </p>
              {tradeIn.wanted_product_id && (
                <p className="mt-1.5 text-xs text-white/45">
                  Product ID:{" "}
                  <a
                    href={`/admin/products/${tradeIn.wanted_product_id}/edit`}
                    className="font-mono text-[#69b1e8] hover:underline"
                  >
                    {tradeIn.wanted_product_id}
                  </a>
                </p>
              )}
            </div>

            {/* Device being traded in */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/30">
                <Smartphone className="h-3 w-3" /> Device to Trade In
              </p>
              <p className="mt-2 text-sm font-bold text-white">
                {tradeIn.trade_device_brand} {tradeIn.trade_device_model}
                {tradeIn.trade_device_storage && (
                  <span className="text-white/40 font-medium"> · {tradeIn.trade_device_storage}</span>
                )}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/30 leading-none">Condition</p>
                  <p className="text-white/80 font-medium mt-0.5">{conditionLabel(tradeIn.device_condition)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/30 leading-none">Screen</p>
                  <p className="text-white/80 font-medium mt-0.5">{conditionLabel(tradeIn.screen_condition)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/30 leading-none">Battery</p>
                  <p className="text-white/80 font-medium mt-0.5">{conditionLabel(tradeIn.battery_condition)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/30 leading-none">Functional</p>
                  <p className="text-white/80 font-medium mt-0.5">{conditionLabel(tradeIn.functional_status)}</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/30">
                    <PackageOpen className="h-3 w-3" /> Accessories
                  </p>
                  <p className="mt-1.5 text-sm text-white/80">
                    {tradeIn.accessories.length > 0 ? tradeIn.accessories.join(", ") : "None"}
                  </p>
                </div>
                {tradeIn.faults && (
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/30">
                      <AlertTriangle className="h-3 w-3" /> Faults
                    </p>
                    <p className="mt-1.5 text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{tradeIn.faults}</p>
                  </div>
                )}
              </div>
            </div>

            {tradeIn.customer_notes && (
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/30">
                  <StickyNote className="h-3 w-3" /> Customer Notes
                </p>
                <p className="mt-1.5 text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{tradeIn.customer_notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Values + notes */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/8 bg-white/5 p-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 block mb-4">
              Valuation
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/30 mb-2">
                  Estimated Value (RWF)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(e.target.value)}
                    placeholder="e.g. 250000"
                    className={valueInputClass}
                  />
                  <button
                    onClick={() => saveValue("estimated")}
                    disabled={isPending}
                    className="inline-flex items-center gap-1 rounded-xl bg-[#0f70c9]/15 border border-[#0f70c9]/25 px-3 text-xs font-semibold text-[#69b1e8] hover:bg-[#0f70c9]/30 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {valueSaved === "estimated" ? <CheckCircle2 className="h-3.5 w-3.5" /> : isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    Save
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/30 mb-2">
                  Final Value (RWF)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={finalValue}
                    onChange={(e) => setFinalValue(e.target.value)}
                    placeholder="e.g. 250000"
                    className={valueInputClass}
                  />
                  <button
                    onClick={() => saveValue("final")}
                    disabled={isPending}
                    className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/25 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {valueSaved === "final" ? <CheckCircle2 className="h-3.5 w-3.5" /> : isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    Save
                  </button>
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-white/30">
              Current: estimated {formatTradeInValue(tradeIn.estimated_value)} · final {formatTradeInValue(tradeIn.final_value)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/5 p-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 block mb-3">
              Admin Notes
            </span>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="Internal notes about this trade-in…"
              className="w-full rounded-xl border border-white/8 bg-[#0a1628] px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#0f70c9] focus:outline-none resize-none"
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={saveNotes}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f70c9]/15 border border-[#0f70c9]/25 px-3 py-1.5 text-xs font-semibold text-[#69b1e8] hover:bg-[#0f70c9]/30 transition-all cursor-pointer disabled:opacity-60"
              >
                {valueSaved === "notes" ? <CheckCircle2 className="h-3.5 w-3.5" /> : isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                Save Notes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Photos */}
      <div className="rounded-2xl border border-white/8 bg-white/5 p-6">
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 block mb-3">
          Device Photos ({tradeIn.photos.length})
        </span>
        {tradeIn.photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/8 bg-white/[0.02] py-12 text-center">
            <ImageIcon className="h-8 w-8 text-white/15 mb-2" />
            <p className="text-sm text-white/30">No photos provided by the customer.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {tradeIn.photos.map((url, index) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-xl border border-white/8 bg-[#0a1628]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Device photo ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-2 right-2 rounded-md bg-ocean-deeper/70 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                  {index + 1}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}