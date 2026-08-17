"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Section shell ─────────────────────────────────────────────────────────
   The admin workspace uses one restrained card pattern: subtle border, low
   contrast fill, compact uppercase label. No gradients, no glow, no pills. */

export function Section({
  title,
  icon,
  actions,
  children,
  className,
}: {
  title: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] p-5 sm:p-6", className)}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {icon}
          {title}
        </h2>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function Field({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">{value || "—"}</p>
    </div>
  );
}

export function EmptyState({ icon, message }: { icon?: React.ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-8 text-center">
      {icon && <div className="mb-2 text-slate-300 dark:text-slate-600">{icon}</div>}
      <p className="text-sm text-slate-400 dark:text-slate-500">{message}</p>
    </div>
  );
}

/* ─── Status visuals ────────────────────────────────────────────────────────
   Restrained: small dot + muted label, colored text only. */

export const statusStyle: Record<string, string> = {
  pending: "text-amber-600 dark:text-amber-300",
  under_review: "text-blue-600 dark:text-blue-300",
  offer_sent: "text-violet-600 dark:text-violet-300",
  accepted: "text-emerald-600 dark:text-emerald-300",
  rejected: "text-red-600 dark:text-red-300",
  completed: "text-teal-600 dark:text-teal-300",
  cancelled: "text-slate-500 dark:text-slate-400",
};

export const statusDot: Record<string, string> = {
  pending: "bg-amber-400",
  under_review: "bg-blue-400",
  offer_sent: "bg-violet-400",
  accepted: "bg-emerald-400",
  rejected: "bg-red-400",
  completed: "bg-teal-400",
  cancelled: "bg-slate-200 dark:bg-slate-600",
};

export function StatusIndicator({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold capitalize", statusStyle[status] ?? "text-slate-500 dark:text-slate-400")}>
      <span className={cn("h-1.5 w-1.5 rounded-full", statusDot[status] ?? "bg-slate-200 dark:bg-slate-600")} />
      {status.replace(/_/g, " ")}
    </span>
  );
}

/* ─── Buttons ────────────────────────────────────────────────────────────── */

export function ActionButton({
  onClick,
  disabled,
  busy,
  variant = "default",
  children,
  className,
}: {
  onClick?: () => void;
  disabled?: boolean;
  busy?: boolean;
  variant?: "default" | "primary" | "danger" | "success" | "subtle";
  children: React.ReactNode;
  className?: string;
}) {
  const variants: Record<string, string> = {
    default:
      "bg-[#0f70c9]/15 border-[#0f70c9]/25 text-[#69b1e8] hover:bg-[#0f70c9]/30",
    primary:
      "bg-[#0f70c9] border-transparent text-slate-900 dark:text-slate-100 hover:bg-[#0b5497]",
    danger:
      "bg-red-50 dark:bg-red-500/15 border-red-500/20 text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20",
    success:
      "bg-emerald-50 dark:bg-emerald-500/15 border-emerald-500/20 text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20",
    subtle:
      "border-slate-200 dark:border-[#1e3a5f] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1c3a5c] hover:text-slate-700 dark:hover:text-slate-200",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || busy}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all disabled:cursor-default disabled:opacity-60",
        variants[variant],
        className,
      )}
    >
      {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {children}
    </button>
  );
}

export function confirmAction(message: string): boolean {
  return window.confirm(message);
}

/* ─── Formatting ─────────────────────────────────────────────────────────── */

export function formatRWF(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `RWF ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)}`;
}

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(iso).toLocaleString("en-GB", opts);
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function staffName(createdBy: string | null | undefined): string {
  return createdBy ?? "Admin";
}