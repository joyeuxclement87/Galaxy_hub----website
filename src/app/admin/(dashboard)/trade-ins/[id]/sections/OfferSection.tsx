"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send, CheckCircle2, XCircle } from "lucide-react";
import { sendTradeInOffer, markTradeInAccepted, markTradeInRejected } from "@/actions/trade-ins";
import type { TradeInWorkspace } from "@/actions/trade-ins";
import { Section, ActionButton, EmptyState, confirmAction, formatRWF, formatDateTime } from "../components";

/* ─── TRADE-IN OFFER ────────────────────────────────────────────────────────
   The final value becomes the official offer once sent. Acceptance and
   rejection are recorded by staff from customer response. */

export function OfferSection({ workspace }: { workspace: TradeInWorkspace }) {
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

  const offerStatus = tradeIn.offer_status;
  const hasFinal = tradeIn.final_value !== null;

  if (!hasFinal && offerStatus === null) {
    return (
      <Section title="Trade-In Offer" icon={<Send className="h-3.5 w-3.5" />}>
        <EmptyState
          icon={<Send className="h-8 w-8" />}
          message="Save a final trade-in value to create an offer."
        />
      </Section>
    );
  }

  const statusLabel: Record<string, string> = {
    ready: "Ready to send",
    sent: "Sent",
    accepted: "Accepted",
    rejected: "Rejected",
  };

  return (
    <Section
      title="Trade-In Offer"
      icon={<Send className="h-3.5 w-3.5" />}
      actions={
        offerStatus ? (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 dark:border-[#1e3a5f] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {statusLabel[offerStatus] ?? offerStatus}
          </span>
        ) : undefined
      }
    >
      <div className="rounded-xl border border-slate-100 dark:border-[#1a3352] bg-slate-50 dark:bg-[#0f2438] p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Trade-In Value
        </p>
        <p className="mt-1 font-clash text-xl font-bold text-slate-900 dark:text-slate-100">{formatRWF(Number(tradeIn.final_value))}</p>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
          For {tradeIn.wanted_product_name}
          {tradeIn.wanted_product_storage ? ` · ${tradeIn.wanted_product_storage}` : ""}
        </p>
      </div>

      {(offerStatus === null || offerStatus === "ready") && (
        <div className="mt-4">
          <ActionButton
            variant="primary"
            onClick={() =>
              run(
                "send",
                `Send this trade-in offer?\n\nTrade-in value: ${formatRWF(Number(tradeIn.final_value))}\nCustomer: ${tradeIn.customer_name}`,
                () => sendTradeInOffer(tradeIn.id),
              )
            }
            busy={isPending && busy === "send"}
          >
            Send Offer to Customer
          </ActionButton>
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            Delivered via Telegram. The record is kept even if delivery fails.
          </p>
        </div>
      )}

      {offerStatus === "sent" && (
        <div className="mt-4 flex flex-wrap gap-2">
          <ActionButton
            variant="success"
            onClick={() =>
              run(
                "accept",
                `Mark this offer as accepted by ${tradeIn.customer_name}?`,
                () => markTradeInAccepted(tradeIn.id),
              )
            }
            busy={isPending && busy === "accept"}
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Mark Accepted
          </ActionButton>
          <ActionButton
            variant="danger"
            onClick={() =>
              run(
                "reject",
                `Record that ${tradeIn.customer_name} rejected this offer? This cannot be undone.`,
                () => markTradeInRejected(tradeIn.id),
              )
            }
            busy={isPending && busy === "reject"}
          >
            <XCircle className="h-3.5 w-3.5" /> Mark Rejected
          </ActionButton>
          <p className="w-full text-xs text-slate-400 dark:text-slate-500">
            {tradeIn.offer_sent_at
              ? `Sent ${formatDateTime(tradeIn.offer_sent_at)} via Telegram.`
              : "Offer sent."}
          </p>
        </div>
      )}

      {offerStatus === "accepted" && (
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
          Accepted by the customer{tradeIn.offer_accepted_at ? ` on ${formatDateTime(tradeIn.offer_accepted_at)}` : ""}.
          {tradeIn.status === "accepted" ? " You can now complete the trade-in." : ""}
        </p>
      )}

      {offerStatus === "rejected" && (
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
          The customer declined the offer{tradeIn.offer_rejected_at ? ` on ${formatDateTime(tradeIn.offer_rejected_at)}` : ""}.
        </p>
      )}
    </Section>
  );
}