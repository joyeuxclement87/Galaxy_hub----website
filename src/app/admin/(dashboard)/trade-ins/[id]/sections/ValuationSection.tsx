"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Coins, History } from "lucide-react";
import { saveTradeInValuation } from "@/actions/trade-ins";
import type { TradeInWorkspace } from "@/actions/trade-ins";
import { Section, ActionButton, formatRWF, formatDateTime, staffName } from "../components";

const inputClass =
  "w-full rounded-xl border border-white/8 bg-[#0a1628] px-3 py-2 text-sm text-white focus:border-[#0f70c9] focus:outline-none";
const textareaClass =
  "w-full rounded-xl border border-white/8 bg-[#0a1628] px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#0f70c9] focus:outline-none resize-none";

/* ─── VALUATION ─────────────────────────────────────────────────────────────
   Staff sets the estimated and final values. The final value becomes the
   official offer only when saved here. Every save appends a history entry;
   the current value always lives on the trade_ins record. */

export function ValuationSection({ workspace }: { workspace: TradeInWorkspace }) {
  const router = useRouter();
  const { tradeIn, valuations } = workspace;

  const [estimated, setEstimated] = useState(
    tradeIn.estimated_value === null ? "" : String(tradeIn.estimated_value),
  );
  const [final, setFinal] = useState(tradeIn.final_value === null ? "" : String(tradeIn.final_value));
  const [notes, setNotes] = useState(tradeIn.valuation_notes ?? "");
  const [isPending, startTransition] = useTransition();
  const [saving, setSaving] = useState<"estimate" | "final" | null>(null);

  const parse = (raw: string): number | null => {
    if (raw.trim() === "") return null;
    const value = Number(raw.replace(/[^\d]/g, ""));
    if (!Number.isFinite(value) || value < 0) return NaN;
    return value;
  };

  const save = (target: "estimate" | "final") => {
    const estimateValue = parse(estimated);
    const finalValue = parse(final);
    if (estimateValue !== null && Number.isNaN(estimateValue)) {
      alert("Please enter a valid positive number for the estimate.");
      return;
    }
    if (finalValue !== null && Number.isNaN(finalValue)) {
      alert("Please enter a valid positive number for the final value.");
      return;
    }
    setSaving(target);
    startTransition(async () => {
      const res = await saveTradeInValuation(tradeIn.id, {
        estimated_value: target === "estimate" ? estimateValue : tradeIn.estimated_value,
        final_value: target === "final" ? finalValue : tradeIn.final_value,
        valuation_notes: notes || null,
      });
      setSaving(null);
      if (res?.error) {
        alert(res.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <Section title="Valuation" icon={<Coins className="h-3.5 w-3.5" />}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/30">
            Estimated Trade-In Value (RWF)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={estimated}
              onChange={(e) => setEstimated(e.target.value)}
              placeholder="e.g. 200000"
              className={inputClass}
            />
            <ActionButton variant="default" onClick={() => save("estimate")} busy={isPending && saving === "estimate"}>
              Save Estimate
            </ActionButton>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/30">
            Final Trade-In Value (RWF)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={final}
              onChange={(e) => setFinal(e.target.value)}
              placeholder="e.g. 165000"
              className={inputClass}
            />
            <ActionButton variant="success" onClick={() => save("final")} busy={isPending && saving === "final"}>
              Save Final Value
            </ActionButton>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/30">
          Valuation Notes
        </span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder="Notes about market price, condition-adjusted value…"
          className={textareaClass}
        />
      </div>

      {(tradeIn.valued_by || tradeIn.valued_at) && (
        <p className="mt-3 text-xs text-white/40">
          Last valued by {staffName(tradeIn.valued_by)} · {tradeIn.valued_at ? formatDateTime(tradeIn.valued_at) : ""}
        </p>
      )}

      {valuations.length > 0 && (
        <div className="mt-5 border-t border-white/5 pt-4">
          <p className="mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/30">
            <History className="h-3 w-3" /> Valuation History
          </p>
          <div className="space-y-2">
            {valuations.map((v) => (
              <div key={v.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="text-xs text-white/70">
                    <span className="text-white/35">Est.</span> {formatRWF(Number(v.estimated_value))}
                  </span>
                  <span className="text-xs text-white/70">
                    <span className="text-white/35">Final</span> {formatRWF(Number(v.final_value))}
                  </span>
                  {v.notes && <span className="max-w-xs truncate text-xs text-white/40">{v.notes}</span>}
                </div>
                <span className="text-[10px] text-white/35">
                  {staffName(v.created_by)} · {formatDateTime(v.created_at)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}