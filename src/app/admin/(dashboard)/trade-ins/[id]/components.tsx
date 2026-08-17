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
    <section className={cn("rounded-2xl border border-white/8 bg-white/5 p-5 sm:p-6", className)}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/30">
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
      <p className="text-[10px] font-bold uppercase tracking-wider text-white/30 leading-none">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-white/80">{value || "—"}</p>
    </div>
  );
}

export function EmptyState({ icon, message }: { icon?: React.ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/8 bg-white/[0.02] px-4 py-8 text-center">
      {icon && <div className="mb-2 text-white/20">{icon}</div>}
      <p className="text-sm text-white/40">{message}</p>
    </div>
  );
}

/* ─── Status visuals ────────────────────────────────────────────────────────
   Restrained: small dot + muted label, colored text only. */

export const statusStyle: Record<string, string> = {
  pending: "text-amber-300",
  under_review: "text-blue-300",
  offer_sent: "text-violet-300",
  accepted: "text-emerald-300",
  rejected: "text-red-300",
  completed: "text-teal-300",
  cancelled: "text-white/50",
};

export const statusDot: Record<string, string> = {
  pending: "bg-amber-400",
  under_review: "bg-blue-400",
  offer_sent: "bg-violet-400",
  accepted: "bg-emerald-400",
  rejected: "bg-red-400",
  completed: "bg-teal-400",
  cancelled: "bg-white/30",
};

export function StatusIndicator({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold capitalize", statusStyle[status] ?? "text-white/50")}>
      <span className={cn("h-1.5 w-1.5 rounded-full", statusDot[status] ?? "bg-white/30")} />
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
      "bg-[#0f70c9] border-transparent text-white hover:bg-[#0b5497]",
    danger:
      "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/25",
    success:
      "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25",
    subtle:
      "border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80",
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