"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheck, UserCheck } from "lucide-react";
import { saveTradeInInspection } from "@/actions/trade-ins";
import type { TradeInWorkspace } from "@/actions/trade-ins";
import {
  DEVICE_CONDITIONS,
  SCREEN_CONDITIONS,
  FUNCTIONAL_STATUSES,
  conditionLabel,
} from "@/lib/trade-in";
import { Section, ActionButton, EmptyState, Field, formatDateTime, staffName } from "../components";

const selectClass =
  "rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-[#0f70c9] focus:outline-none";
const textClass =
  "w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#0f70c9] focus:outline-none resize-none";

function OptionSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {label}
      </span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className={`${selectClass} w-full`}
      >
        <option value="">—</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function InspectionSection({ workspace }: { workspace: TradeInWorkspace }) {
  const router = useRouter();
  const { tradeIn, inspection } = workspace;

  const [editing, setEditing] = useState(!inspection);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<{
    inspected_condition: string | null;
    battery_health: string;
    screen_condition: string | null;
    body_condition: string | null;
    functional_status: string | null;
    imei_verified: boolean;
    additional_faults: string;
    inspection_notes: string;
  }>({
    inspected_condition: inspection?.inspected_condition ?? null,
    battery_health: inspection?.battery_health ?? "",
    screen_condition: inspection?.screen_condition ?? null,
    body_condition: inspection?.body_condition ?? null,
    functional_status: inspection?.functional_status ?? null,
    imei_verified: inspection?.imei_verified ?? false,
    additional_faults: inspection?.additional_faults ?? "",
    inspection_notes: inspection?.inspection_notes ?? "",
  });

  const save = () => {
    startTransition(async () => {
      const res = await saveTradeInInspection(tradeIn.id, {
        inspected_condition: form.inspected_condition,
        battery_health: form.battery_health || null,
        screen_condition: form.screen_condition,
        body_condition: form.body_condition,
        functional_status: form.functional_status,
        imei_verified: form.imei_verified,
        additional_faults: form.additional_faults || null,
        inspection_notes: form.inspection_notes || null,
      });
      if (res?.error) {
        alert(res.error);
        return;
      }
      setEditing(false);
      router.refresh();
    });
  };

  return (
    <Section
      title="Staff Inspection"
      icon={<ClipboardCheck className="h-3.5 w-3.5" />}
      actions={
        inspection ? (
          <ActionButton variant="subtle" onClick={() => setEditing((v) => !v)}>
            {editing ? "Cancel" : "Edit Inspection"}
          </ActionButton>
        ) : undefined
      }
    >
      {!inspection && !editing ? (
        <EmptyState
          icon={<ClipboardCheck className="h-8 w-8" />}
          message="Inspection not completed"
        />
      ) : editing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <OptionSelect
              label="Verified Condition"
              value={form.inspected_condition}
              onChange={(v) => setForm((f) => ({ ...f, inspected_condition: v }))}
              options={DEVICE_CONDITIONS}
            />
            <OptionSelect
              label="Screen Condition"
              value={form.screen_condition}
              onChange={(v) => setForm((f) => ({ ...f, screen_condition: v }))}
              options={SCREEN_CONDITIONS}
            />
            <OptionSelect
              label="Body Condition"
              value={form.body_condition}
              onChange={(v) => setForm((f) => ({ ...f, body_condition: v }))}
              options={DEVICE_CONDITIONS}
            />
            <OptionSelect
              label="Functional Status"
              value={form.functional_status}
              onChange={(v) => setForm((f) => ({ ...f, functional_status: v }))}
              options={FUNCTIONAL_STATUSES}
            />
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Battery Health
              </span>
              <input
                type="text"
                value={form.battery_health}
                onChange={(e) => setForm((f) => ({ ...f, battery_health: e.target.value }))}
                placeholder="e.g. 82%"
                className={`${selectClass} w-full`}
              />
            </label>
            <label className="flex items-end gap-2 pb-2">
              <input
                type="checkbox"
                checked={form.imei_verified}
                onChange={(e) => setForm((f) => ({ ...f, imei_verified: e.target.checked }))}
                className="h-4 w-4 accent-[#0f70c9]"
              />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">IMEI / serial verified</span>
            </label>
          </div>

          <div>
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Additional Faults
            </span>
            <textarea
              value={form.additional_faults}
              onChange={(e) => setForm((f) => ({ ...f, additional_faults: e.target.value }))}
              rows={2}
              maxLength={1000}
              placeholder="e.g. Face ID not working…"
              className={textClass}
            />
          </div>

          <div>
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Inspection Notes
            </span>
            <textarea
              value={form.inspection_notes}
              onChange={(e) => setForm((f) => ({ ...f, inspection_notes: e.target.value }))}
              rows={3}
              maxLength={2000}
              placeholder="Internal observations for valuation…"
              className={textClass}
            />
          </div>

          <div className="flex justify-end">
            <ActionButton variant="primary" onClick={save} busy={isPending}>
              Save Inspection
            </ActionButton>
          </div>
        </div>
      ) : inspection ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
            <Field label="Verified Condition" value={conditionLabel(inspection.inspected_condition)} />
            <Field label="Screen" value={conditionLabel(inspection.screen_condition)} />
            <Field label="Body" value={conditionLabel(inspection.body_condition)} />
            <Field label="Functional" value={conditionLabel(inspection.functional_status)} />
            <Field label="Battery Health" value={inspection.battery_health} />
            <Field
              label="IMEI Verified"
              value={inspection.imei_verified ? "Yes" : "No"}
              className={inspection.imei_verified ? undefined : undefined}
            />
          </div>
          {inspection.additional_faults && (
            <Field label="Additional Faults" value={inspection.additional_faults} />
          )}
          {inspection.inspection_notes && (
            <Field label="Inspection Notes" value={inspection.inspection_notes} />
          )}
          <p className="flex items-center gap-1.5 border-t border-slate-100 dark:border-[#1a3352] pt-3 text-xs text-slate-400 dark:text-slate-500">
            <UserCheck className="h-3.5 w-3.5" />
            {staffName(inspection.inspected_by)} · {formatDateTime(inspection.inspected_at)}
          </p>
        </div>
      ) : null}
    </Section>
  );
}