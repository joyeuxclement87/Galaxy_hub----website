"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Send,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Link2,
  StickyNote,
  Plus,
  X,
  History,
  PackageOpen,
} from "lucide-react";
import {
  addTradeInNote,
  linkTradeInOrder,
  resendTradeInTelegram,
} from "@/actions/trade-ins";
import type { TradeInWorkspace } from "@/actions/trade-ins";
import { Section, ActionButton, EmptyState, staffName, formatDateTime, formatRWF } from "../components";

/* ─── CUSTOMER ────────────────────────────────────────────────────────────── */

export function CustomerSection({ workspace }: { workspace: TradeInWorkspace }) {
  const { tradeIn } = workspace;
  return (
    <Section title="Customer" icon={<User className="h-3.5 w-3.5" />}>
      <dl className="space-y-2.5 text-sm">
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-white/30">Name</dt>
          <dd className="mt-0.5 font-medium text-white/80">{tradeIn.customer_name}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-white/30">Phone</dt>
          <dd className="mt-0.5">
            <a href={`tel:${tradeIn.phone}`} className="font-medium text-white/80 hover:underline">
              {tradeIn.phone}
            </a>
          </dd>
        </div>
        {tradeIn.email && (
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-wider text-white/30">Email</dt>
            <dd className="mt-0.5">
              <a href={`mailto:${tradeIn.email}`} className="font-medium text-[#69b1e8] hover:underline">
                {tradeIn.email}
              </a>
            </dd>
          </div>
        )}
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-white/30">Submitted</dt>
          <dd className="mt-0.5 font-medium text-white/60">{formatDateTime(tradeIn.created_at)}</dd>
        </div>
      </dl>
    </Section>
  );
}

/* ─── TELEGRAM DELIVERY ───────────────────────────────────────────────────── */

export function TelegramSection({ workspace }: { workspace: TradeInWorkspace }) {
  const router = useRouter();
  const { tradeIn } = workspace;
  const [isPending, startTransition] = useTransition();

  const retry = () => {
    startTransition(async () => {
      const res = await resendTradeInTelegram(tradeIn.id);
      if (res?.error) {
        alert(res.error);
        return;
      }
      router.refresh();
    });
  };

  const failed = !tradeIn.telegram_sent;

  return (
    <Section title="Telegram" icon={<Send className="h-3.5 w-3.5" />}>
      {tradeIn.telegram_sent ? (
        <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-300">
          <CheckCircle2 className="h-4 w-4" /> Sent
          {tradeIn.telegram_sent_at && (
            <span className="font-normal text-white/40">· {formatDateTime(tradeIn.telegram_sent_at)}</span>
          )}
        </p>
      ) : (
        <div>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-red-300">
            <XCircle className="h-4 w-4" /> Not sent
          </p>
          {tradeIn.telegram_error && (
            <p className="mt-1 text-xs text-white/40">{tradeIn.telegram_error}</p>
          )}
          <ActionButton variant="default" onClick={retry} busy={isPending} className="mt-3">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </ActionButton>
        </div>
      )}
      {failed && !tradeIn.telegram_error && (
        <p className="mt-1 text-xs text-white/40">Delivery never confirmed.</p>
      )}
    </Section>
  );
}

/* ─── LINKED ORDER ────────────────────────────────────────────────────────── */

export function OrderSection({ workspace }: { workspace: TradeInWorkspace }) {
  const router = useRouter();
  const { tradeIn, linkedOrder } = workspace;
  const [isPending, startTransition] = useTransition();
  const [orderInput, setOrderInput] = useState("");
  const [linking, setLinking] = useState(false);

  const link = () => {
    if (!orderInput.trim()) return;
    setLinking(true);
    startTransition(async () => {
      const res = await linkTradeInOrder(tradeIn.id, orderInput.trim());
      setLinking(false);
      if (res?.error) {
        alert(res.error);
        return;
      }
      setOrderInput("");
      router.refresh();
    });
  };

  return (
    <Section title="Linked Order" icon={<PackageOpen className="h-3.5 w-3.5" />}>
      {linkedOrder ? (
        <div className="space-y-2">
          <p className="font-mono text-sm font-bold text-white">{linkedOrder.order_number}</p>
          <p className="text-xs text-white/40">
            {formatRWF(Number(linkedOrder.total_amount))} · {linkedOrder.status}
          </p>
          <Link
            href={`/admin/orders/${linkedOrder.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#69b1e8] hover:text-[#69b1e8]/80"
          >
            View Order <span aria-hidden>→</span>
          </Link>
        </div>
      ) : (
        <div>
          <EmptyState
            icon={<Link2 className="h-8 w-8" />}
            message="No order linked. Link an existing order after the customer accepts."
          />
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={orderInput}
              onChange={(e) => setOrderInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && link()}
              placeholder="Order number (GH-2026-…)"
              className="min-w-0 flex-1 rounded-xl border border-white/8 bg-[#0a1628] px-3 py-2 text-sm text-white placeholder:text-white/25 focus:border-[#0f70c9] focus:outline-none"
            />
            <ActionButton variant="default" onClick={link} busy={isPending && linking}>
              Link
            </ActionButton>
          </div>
        </div>
      )}
    </Section>
  );
}

/* ─── INTERNAL NOTES ────────────────────────────────────────────────────────
   Private staff notes. Each Add Note creates a new record; nothing here is
   ever sent to customers. */

export function NotesSection({ workspace }: { workspace: TradeInWorkspace }) {
  const router = useRouter();
  const { tradeIn, notes } = workspace;
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const add = () => {
    if (!draft.trim()) return;
    startTransition(async () => {
      const res = await addTradeInNote(tradeIn.id, draft);
      if (res?.error) {
        alert(res.error);
        return;
      }
      setDraft("");
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <Section
      title="Internal Notes"
      icon={<StickyNote className="h-3.5 w-3.5" />}
      actions={
        <ActionButton variant="subtle" onClick={() => setOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> Add Note
        </ActionButton>
      }
    >
      {notes.length === 0 ? (
        <EmptyState icon={<StickyNote className="h-8 w-8" />} message="No internal notes yet." />
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">
                {staffName(note.created_by)}
                <span className="font-normal normal-case text-white/30">
                  {" "}· {formatDateTime(note.created_at)}
                </span>
              </p>
              <p className="mt-1.5 text-sm text-white/80 whitespace-pre-wrap">{note.note}</p>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1f3c] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">Add Internal Note</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer rounded-lg p-1 text-white/40 hover:text-white/80"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={4}
              maxLength={2000}
              autoFocus
              placeholder="Private note — never sent to the customer…"
              className="w-full rounded-xl border border-white/8 bg-[#0a1628] px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#0f70c9] focus:outline-none resize-none"
            />
            <div className="mt-3 flex justify-end gap-2">
              <ActionButton variant="subtle" onClick={() => setOpen(false)}>
                Cancel
              </ActionButton>
              <ActionButton variant="primary" onClick={add} busy={isPending}>
                Add Note
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}

/* ─── ACTIVITY ────────────────────────────────────────────────────────────── */

export function ActivitySection({ workspace }: { workspace: TradeInWorkspace }) {
  const { activity } = workspace;

  return (
    <Section title="Activity" icon={<History className="h-3.5 w-3.5" />}>
      {activity.length === 0 ? (
        <EmptyState icon={<History className="h-8 w-8" />} message="No activity recorded." />
      ) : (
        <ol className="space-y-0">
          {activity.map((event, index) => (
            <li key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
              {index < activity.length - 1 && (
                <span className="absolute left-[5px] top-4 h-full w-px bg-white/10" aria-hidden />
              )}
              <span className="mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border-2 border-[#0f70c9]/60 bg-[#0a1628]" aria-hidden />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">
                  {formatDateTime(event.created_at)}
                  {event.created_by && (
                    <span className="font-normal normal-case text-white/30"> · {staffName(event.created_by)}</span>
                  )}
                </p>
                <p className="mt-0.5 text-sm text-white/75">{event.description}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Section>
  );
}