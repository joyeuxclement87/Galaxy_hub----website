import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

/* ─── Shared admin design tokens ────────────────────────────────────────────
   One restrained system for the whole admin panel:
   white cards on ivory, subtle slate borders, ocean accents.
   Dark mode: deep navy surfaces (#0a1628 page, #0f2438 cards) with the
   same ocean accent family. Toggle lives in the TopBar (`gh-admin-theme`).
   ──────────────────────────────────────────────────────────────────────── */

export const adminInputClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 transition-colors focus:border-ocean/50 focus:outline-none focus:ring-2 focus:ring-ocean/10 dark:border-[#1e3a5f] dark:bg-[#0f2438] dark:text-slate-300 dark:placeholder:text-slate-500";

export const adminSelectClass =
  "h-10 rounded-lg border border-slate-200 bg-white px-3 pr-8 text-sm text-slate-600 shadow-sm transition-colors focus:border-ocean/50 focus:outline-none focus:ring-2 focus:ring-ocean/10 dark:border-[#1e3a5f] dark:bg-[#0f2438] dark:text-slate-400";

export const adminButtonPrimary =
  "inline-flex cursor-pointer items-center gap-2 rounded-lg bg-ocean px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-ocean-dark disabled:opacity-50";

export const adminButtonSecondary =
  "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 dark:border-[#1e3a5f] dark:bg-[#0f2438] dark:text-slate-400 dark:hover:border-slate-500 dark:hover:bg-[#132c46]";

export const adminButtonDanger =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20";

export const adminCard =
  "rounded-xl border border-slate-200 bg-white shadow-sm dark:border-[#1e3a5f] dark:bg-[#0f2438]";

export const adminCardHeader =
  "flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5 dark:border-[#1a3352]";

export const adminSectionTitle =
  "font-display text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(adminCard, className)}>{children}</div>;
}

export function SectionTitle({
  children,
  hint,
  className,
}: {
  children: React.ReactNode;
  hint?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <h2 className={adminSectionTitle}>{children}</h2>
      {hint}
    </div>
  );
}

export function ViewAllLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1 text-xs font-semibold text-ocean transition-colors hover:text-ocean-dark dark:text-[#8ec5f2] dark:hover:text-[#a5d3f7]"
    >
      View All
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

/* ─── Page header ───────────────────────────────────────────────────────── */

export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        {breadcrumb && (
          <nav className="mb-1 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            {breadcrumb.map((b, i) => (
              <span key={b.href} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                <Link href={b.href} className="transition-colors hover:text-ocean dark:hover:text-[#8ec5f2]">
                  {b.label}
                </Link>
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h1>
        {description && (
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ─── Status badge ──────────────────────────────────────────────────────── */

export type StatusTone = "amber" | "blue" | "violet" | "emerald" | "red" | "teal" | "slate" | "purple";

const toneStyles: Record<StatusTone, { dot: string; text: string; bg: string }> = {
  amber: { dot: "bg-amber-500", text: "text-amber-700 dark:text-amber-300", bg: "bg-amber-50 dark:bg-amber-500/15" },
  blue: { dot: "bg-blue-500", text: "text-blue-700 dark:text-blue-300", bg: "bg-blue-50 dark:bg-blue-500/15" },
  violet: { dot: "bg-violet-500", text: "text-violet-700 dark:text-violet-300", bg: "bg-violet-50 dark:bg-violet-500/15" },
  emerald: { dot: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-500/15" },
  red: { dot: "bg-red-500", text: "text-red-700 dark:text-red-300", bg: "bg-red-50 dark:bg-red-500/15" },
  teal: { dot: "bg-teal-500", text: "text-teal-700 dark:text-teal-300", bg: "bg-teal-50 dark:bg-teal-500/15" },
  purple: { dot: "bg-purple-500", text: "text-purple-700 dark:text-purple-300", bg: "bg-purple-50 dark:bg-purple-500/15" },
  slate: { dot: "bg-slate-400", text: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-600/30" },
};

export function statusTone(status: string): StatusTone {
  const s = status.toLowerCase();
  if (s.includes("cancel") || s.includes("reject") || s.includes("out") || s.includes("fail")) return "red";
  if (s.includes("complet") || s.includes("accept") || s.includes("deliver") || s.includes("respond") || s.includes("close") || s.includes("live") || s.includes("active") || s.includes("in_stock")) return "emerald";
  if (s.includes("process") || s.includes("review") || s.includes("shipped") || s.includes("new") || s.includes("contact") || s.includes("scheduled")) return "blue";
  if (s.includes("offer") || s.includes("confirm")) return "violet";
  if (s.includes("limited") || s.includes("pending") || s.includes("read") || s.includes("expired")) return "amber";
  if (s.includes("soon")) return "purple";
  return "slate";
}

export function StatusBadge({
  status,
  tone,
  dot = true,
  className,
}: {
  status: string;
  tone?: StatusTone;
  dot?: boolean;
  className?: string;
}) {
  const t = tone ?? statusTone(status);
  const s = toneStyles[t];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold capitalize",
        s.bg,
        s.text,
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", s.dot)} />}
      {status.replace(/_/g, " ")}
    </span>
  );
}

/* ─── Small utility display ─────────────────────────────────────────────── */

export function MutedText({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("text-sm text-slate-400 dark:text-slate-500", className)}>{children}</span>;
}