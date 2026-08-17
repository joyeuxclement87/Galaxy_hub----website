"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Download, RefreshCw } from "lucide-react";
import { StatusBadge, adminInputClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

type ReportRow = Record<string, string | number | boolean | null>;

export function ReportsClient({ rows }: { rows: ReportRow[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [type, setType] = useState<string>(searchParams.get("type") ?? "sales");
  const [from, setFrom] = useState(searchParams.get("from") ?? "");
  const [to, setTo] = useState(searchParams.get("to") ?? "");
  const [copied, setCopied] = useState(false);

  const apply = () => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    params.set("type", type);
    router.push(`/admin/reports?${params.toString()}`);
  };

  const exportCsv = () => {
    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const escape = (v: string | number | boolean | null) => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `galaxy-hub-${type}-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const columnHeaders = rows.length > 0 ? Object.keys(rows[0]) : [];

  const formatCell = (value: string | number | boolean | null) => {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
  };

  const TYPES = [
    { id: "sales", label: "Sales" },
    { id: "products", label: "Products" },
    { id: "trade-ins", label: "Trade-Ins" },
    { id: "promotions", label: "Promotions" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] p-0.5">
          {TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={cn(
                "cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                type === t.id ? "bg-white dark:bg-[#0f2438] text-ocean dark:text-[#8ec5f2] shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {type !== "products" && type !== "promotions" && (
          <>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">From</label>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={adminInputClass} />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">To</label>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={adminInputClass} />
            </div>
            <button
              onClick={apply}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-ocean px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-ocean-dark"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Apply
            </button>
          </>
        )}

        <button
          onClick={exportCsv}
          disabled={rows.length === 0}
          className="ml-auto inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] px-4 text-sm font-semibold text-slate-600 dark:text-slate-400 shadow-sm transition-colors hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-[#132c46] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          {copied ? "Exported!" : "Export CSV"}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] shadow-sm">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No records for this report</p>
            <p className="mt-1 max-w-sm text-sm text-slate-400 dark:text-slate-500">
              {type === "sales"
                ? "Orders placed in the selected period will appear here."
                : type === "trade-ins"
                  ? "Trade-in submissions in the selected period will appear here."
                  : type === "products"
                    ? "Products in the catalog will appear here."
                    : "Promotions will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-[#1a3352] text-left">
                  {columnHeaders.map((h) => (
                    <th key={h} className="whitespace-nowrap px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                      {h.replace(/_/g, " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-[#1a3352]">
                {rows.map((r, i) => (
                  <tr key={i} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#132c46]/70">
                    {columnHeaders.map((h) => (
                      <td key={h} className="whitespace-nowrap px-5 py-3 text-[13px] text-slate-600 dark:text-slate-400">
                        {h === "status" ? (
                          <StatusBadge status={String(r[h])} />
                        ) : h === "is_active" ? (
                          <span className={cn("font-semibold", r[h] ? "text-emerald-600 dark:text-emerald-300" : "text-slate-400 dark:text-slate-500")}>
                            {r[h] ? "Active" : "Inactive"}
                          </span>
                        ) : (
                          formatCell(r[h])
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500">
        {rows.length} record{rows.length === 1 ? "" : "s"} · Exports are generated from the current filtered data.
      </p>
    </div>
  );
}