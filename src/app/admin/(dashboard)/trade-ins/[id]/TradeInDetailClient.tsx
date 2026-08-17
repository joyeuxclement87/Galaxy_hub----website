"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, PlayCircle } from "lucide-react";
import {
  updateTradeIn,
  startTradeInReview,
  completeTradeIn,
  cancelTradeIn,
  deleteTradeIn,
} from "@/actions/trade-ins";
import type { TradeInWorkspace } from "@/actions/trade-ins";
import { TRADE_IN_STATUSES, tradeInStatusLabel } from "@/lib/trade-in";
import {
  StatusIndicator,
  ActionButton,
  confirmAction,
  formatDate,
} from "./components";
import { WantedDevice, TradedDevice } from "./sections/Devices";
import { PhotosGallery } from "./sections/PhotosGallery";
import { InspectionSection } from "./sections/InspectionSection";
import { ValuationSection } from "./sections/ValuationSection";
import { OfferSection } from "./sections/OfferSection";
import {
  CustomerSection,
  TelegramSection,
  OrderSection,
  NotesSection,
  ActivitySection,
} from "./sections/SidebarSections";

/* ─── TRADE-IN DETAIL WORKSPACE ─────────────────────────────────────────────
   Single operational page for the whole trade-in lifecycle: review,
   inspection, valuation, offer, notes, activity, order link, Telegram. */

export function TradeInDetailClient({ workspace }: { workspace: TradeInWorkspace }) {
  const router = useRouter();
  const { tradeIn } = workspace;
  const [isPending, startTransition] = useTransition();
  const [busy, setBusy] = useState<string | null>(null);

  const run = (key: string, confirmMessage: string | null, action: () => Promise<{ error?: string } | undefined>) => {
    if (confirmMessage && !confirmAction(confirmMessage)) return;
    setBusy(key);
    startTransition(async () => {
      const res = await action();
      setBusy(null);
      if (res?.error) {
        alert(res.error);
        return;
      }
      router.refresh();
    });
  };

  const changeStatus = (status: string) => {
    if (status === tradeIn.status) return;
    if (["rejected", "cancelled"].includes(status)) {
      const message =
        status === "cancelled"
          ? `Cancel trade-in ${tradeIn.trade_in_id}? This closes the request and cannot be undone.`
          : `Mark trade-in ${tradeIn.trade_in_id} as rejected? This cannot be undone.`;
      if (!confirmAction(message)) return;
    }
    setBusy("status");
    startTransition(async () => {
      const res = await updateTradeIn(tradeIn.id, { status });
      setBusy(null);
      if (res?.error) {
        alert(res.error);
        return;
      }
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!confirmAction(`Delete ${tradeIn.trade_in_id} and its photos? This cannot be undone.`)) return;
    setBusy("delete");
    startTransition(async () => {
      const res = await deleteTradeIn(tradeIn.id);
      setBusy(null);
      if (res?.error) {
        alert(res.error);
        return;
      }
      router.push("/admin/trade-ins");
      router.refresh();
    });
  };

  const status = tradeIn.status;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] p-5 sm:p-6">
        <Link
          href="/admin/trade-ins"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 transition-colors hover:text-slate-700 dark:hover:text-slate-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Trade-Ins
        </Link>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-mono text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight sm:text-2xl">
              {tradeIn.trade_in_id}
            </h1>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              Created: {formatDate(tradeIn.created_at, { day: "numeric", month: "short", year: "numeric" })}
              <span className="mx-2 text-slate-300 dark:text-slate-600">·</span>
              <StatusIndicator status={status} />
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Controlled status dropdown */}
            <label className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Status</span>
              <select
                value={status}
                onChange={(e) => changeStatus(e.target.value)}
                disabled={isPending}
                className="cursor-pointer rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 focus:border-[#0f70c9] focus:outline-none disabled:opacity-60"
              >
                {TRADE_IN_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {tradeInStatusLabel(s)}
                  </option>
                ))}
              </select>
            </label>

            {/* Contextual lifecycle actions */}
            {status === "pending" && (
              <ActionButton
                variant="default"
                onClick={() => run("review", null, () => startTradeInReview(tradeIn.id))}
                busy={isPending && busy === "review"}
              >
                <PlayCircle className="h-3.5 w-3.5" /> Start Review
              </ActionButton>
            )}
            {status === "accepted" && (
              <ActionButton
                variant="primary"
                onClick={() =>
                  run(
                    "complete",
                    `Complete trade-in ${tradeIn.trade_in_id}? The customer has accepted the offer.`,
                    () => completeTradeIn(tradeIn.id),
                  )
                }
                busy={isPending && busy === "complete"}
              >
                Complete Trade-In
              </ActionButton>
            )}
            {!["completed", "cancelled", "rejected"].includes(status) && (
              <ActionButton
                variant="danger"
                onClick={() =>
                  run(
                    "cancel",
                    `Cancel trade-in ${tradeIn.trade_in_id}? This closes the request and cannot be undone.`,
                    () => cancelTradeIn(tradeIn.id),
                  )
                }
                busy={isPending && busy === "cancel"}
              >
                Cancel
              </ActionButton>
            )}
            <ActionButton variant="subtle" onClick={handleDelete} busy={isPending && busy === "delete"}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </ActionButton>
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          <WantedDevice workspace={workspace} />
          <TradedDevice workspace={workspace} />
          <PhotosGallery photos={tradeIn.photos} />
          <InspectionSection workspace={workspace} />
          <ValuationSection workspace={workspace} />
          <OfferSection workspace={workspace} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <CustomerSection workspace={workspace} />
          <TelegramSection workspace={workspace} />
          <OrderSection workspace={workspace} />
          <NotesSection workspace={workspace} />
          <ActivitySection workspace={workspace} />
        </div>
      </div>
    </div>
  );
}