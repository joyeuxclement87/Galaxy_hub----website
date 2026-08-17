import { Suspense } from "react";
import Link from "next/link";
import {
  Banknote,
  ShoppingCart,
  Receipt,
  RefreshCw,
  Megaphone,
} from "lucide-react";
import { getAnalyticsSummary } from "@/data/admin-analytics";
import { getDashboardKpis } from "@/data/admin-dashboard";
import { Card, PageHeader, StatusBadge } from "@/components/admin/ui";
import { SalesChart } from "@/components/admin/SalesChart";
import { KpiCardSkeleton, WidgetSkeleton } from "@/components/admin/Skeleton";

export const dynamic = "force-dynamic";

const formatRWF = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(amount);

async function AnalyticsContent() {
  const [summary, kpis] = await Promise.all([getAnalyticsSummary(), getDashboardKpis()]);

  const kpiCards = [
    { label: "Total Revenue", value: formatRWF(summary.revenue), icon: Banknote, href: "/admin/orders" },
    { label: "Orders", value: String(summary.orders), icon: ShoppingCart, href: "/admin/orders" },
    { label: "Avg Order Value", value: formatRWF(summary.averageOrderValue), icon: Receipt, href: "/admin/orders" },
    { label: "Trade-Ins", value: String(summary.tradeIns), icon: RefreshCw, href: "/admin/trade-ins" },
    { label: "Active Promotions", value: String(summary.activePromotions), icon: Megaphone, href: "/admin/promotions" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {kpiCards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] p-4 shadow-sm transition-colors hover:border-slate-300 dark:hover:border-slate-500"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">{c.label}</p>
              <c.icon className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="mt-1.5 truncate font-display text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-1 font-display text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">Sales Trend</h2>
          <SalesChart />
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 font-display text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">Order Status</h2>
          {summary.orderStatus.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">No orders yet.</p>
          ) : (
            <div className="space-y-2">
              {summary.orderStatus.map((s) => (
                <Link
                  key={s.status}
                  href={`/admin/orders?status=${s.status}`}
                  className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-[#1a3352] px-3 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-[#132c46]"
                >
                  <StatusBadge status={s.status} />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{s.count}</span>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5">
          <h2 className="mb-3 font-display text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">Top Products</h2>
          {summary.topProducts.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">No sales data yet.</p>
          ) : (
            <ul className="space-y-2">
              {summary.topProducts.map((p, i) => (
                <li key={p.name} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-[#162f4a] text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-slate-700 dark:text-slate-300">{p.name}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">{p.units} units</p>
                  </div>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200">{formatRWF(p.revenue)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="mb-3 font-display text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">Top Categories</h2>
          {summary.topCategories.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">No sales data yet.</p>
          ) : (
            <ul className="space-y-2">
              {summary.topCategories.map((c, i) => (
                <li key={c.name ?? "uncategorized"} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-[#162f4a] text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-slate-700 dark:text-slate-300">{c.name ?? "Uncategorized"}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">{c.units} units</p>
                  </div>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200">{formatRWF(c.revenue)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="mb-3 font-display text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">
            Trade-In Volume <span className="font-normal text-slate-400 dark:text-slate-500">· last 6 months</span>
          </h2>
          <div className="flex h-32 items-end gap-2">
            {summary.tradeInVolume.map((m) => (
              <div key={m.label} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{m.count > 0 ? m.count : ""}</span>
                <div
                  className="w-full rounded-t-md bg-ocean/70"
                  style={{ height: `${Math.max((m.count / Math.max(...summary.tradeInVolume.map((x) => x.count), 1)) * 100, 4)}%` }}
                />
                <span className="text-[10px] text-slate-400 dark:text-slate-500">{m.label}</span>
              </div>
            ))}
          </div>

          <h2 className="mb-3 mt-5 font-display text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">Promotions</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Active", value: summary.promotionState.active },
              { label: "Scheduled", value: summary.promotionState.scheduled },
              { label: "Expired", value: summary.promotionState.expired },
              { label: "Draft", value: summary.promotionState.draft },
            ].map((p) => (
              <div key={p.label} className="rounded-lg border border-slate-100 dark:border-[#1a3352] px-3 py-2">
                <p className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">{p.value}</p>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">{p.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {kpis.totalRevenue > 0 && (
        <p className="text-xs text-slate-400 dark:text-slate-500">
          All figures are calculated live from orders, order items, trade-ins and promotions in the store database.
        </p>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Business performance across sales, products and trade-ins."
      />
      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <KpiCardSkeleton key={i} />
              ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <WidgetSkeleton rows={4} />
              <WidgetSkeleton rows={4} />
            </div>
          </div>
        }
      >
        <AnalyticsContent />
      </Suspense>
    </div>
  );
}