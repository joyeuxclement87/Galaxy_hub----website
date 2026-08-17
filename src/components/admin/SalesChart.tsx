"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SalesPoint {
  label: string;
  revenue: number;
  orders: number;
}

type Metric = "revenue" | "orders";

const PERIODS = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "3 months" },
  { days: 365, label: "12 months" },
] as const;

const formatRWF = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(amount);

function EmptyChart() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-300 dark:text-slate-600">
        <path d="M3 3v18h18" strokeLinecap="round" />
        <path d="M7 15l3-4 3 2 4-6" strokeLinecap="round" />
      </svg>
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Not enough sales data yet</p>
      <p className="max-w-xs text-xs text-slate-400 dark:text-slate-500">
        Your sales activity will appear here as orders are received.
      </p>
    </div>
  );
}

function AreaChart({ points, metric }: { points: SalesPoint[]; metric: Metric }) {
  const width = 640;
  const height = 190;
  const padL = 8;
  const padR = 8;
  const padT = 14;
  const padB = 24;

  const values = points.map((p) => (metric === "revenue" ? p.revenue : p.orders));
  const max = Math.max(...values, 1);
  const niceMax = Math.ceil(max / 4) * 4 || 1;

  const x = (i: number) => padL + (i / Math.max(points.length - 1, 1)) * (width - padL - padR);
  const y = (v: number) => height - padB - (v / niceMax) * (height - padT - padB);

  const line = points.map((p, i) => `${x(i)},${y(metric === "revenue" ? p.revenue : p.orders)}`).join(" ");
  const area = `${padL},${height - padB} ${line} ${x(points.length - 1)},${height - padB}`;

  const gridValues = [0, 0.5, 1].map((f) => niceMax * f);
  const labelEvery = Math.max(1, Math.floor(points.length / 6));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label={`${metric === "revenue" ? "Revenue" : "Orders"} over time`}>
      <defs>
        <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b5497" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#0b5497" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {gridValues.map((gv) => (
        <g key={gv}>
          <line x1={padL} y1={y(gv)} x2={width - padR} y2={y(gv)} strokeWidth="1" className="stroke-slate-200 dark:stroke-slate-700" />
          <text x={padL + 2} y={y(gv) - 4} fontSize="9" className="fill-slate-400 dark:fill-slate-500">
            {metric === "revenue" ? formatRWF(gv) : gv}
          </text>
        </g>
      ))}

      {points.map((p, i) =>
        i % labelEvery === 0 || i === points.length - 1 ? (
          <text key={p.label + i} x={x(i)} y={height - 8} fontSize="9" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500">
            {p.label}
          </text>
        ) : null
      )}

      <polygon points={area} fill="url(#salesFill)" />
      <polyline points={line} fill="none" stroke="#0b5497" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function SalesChart() {
  const [days, setDays] = useState<number>(30);
  const [metric, setMetric] = useState<Metric>("revenue");
  const [series, setSeries] = useState<SalesPoint[] | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch(`/admin/api/sales?days=${days}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (!data?.series) {
          setError(true);
          setSeries(null);
        } else {
          setSeries(data.series);
          setError(false);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [days, retryKey]);

  const totalRevenue = (series ?? []).reduce((a, p) => a + p.revenue, 0);
  const totalOrders = (series ?? []).reduce((a, p) => a + p.orders, 0);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] p-0.5">
          {PERIODS.map((p) => (
            <button
              key={p.days}
              onClick={() => setDays(p.days)}
              className={cn(
                "cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
                days === p.days ? "bg-white dark:bg-[#0f2438] text-ocean dark:text-[#8ec5f2] shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] p-0.5">
          {(["revenue", "orders"] as Metric[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={cn(
                "cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold capitalize transition-colors",
                metric === m ? "bg-white dark:bg-[#0f2438] text-ocean dark:text-[#8ec5f2] shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center text-slate-400 dark:text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Unable to load sales data.</p>
          <button
            onClick={() => setRetryKey((k) => k + 1)}
            className="cursor-pointer text-xs font-semibold text-ocean dark:text-[#8ec5f2] hover:underline"
          >
            Try again
          </button>
        </div>
      ) : !series || series.every((p) => p.revenue === 0 && p.orders === 0) ? (
        <EmptyChart />
      ) : (
        <>
          <div className="mb-3 flex items-center gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Revenue</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatRWF(totalRevenue)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Orders</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{totalOrders}</p>
            </div>
          </div>
          <AreaChart points={series} metric={metric} />
        </>
      )}
    </div>
  );
}