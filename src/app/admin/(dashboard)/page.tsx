import { Suspense } from "react";
import Link from "next/link";
import { createAuthClient } from "@/lib/supabase-server-auth";
import {
  Plus,
  Sparkles,
  RefreshCw,
  ShoppingCart,
  MessageSquare,
  ChevronRight,
  AlertTriangle,
  Package,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Inbox,
  Users,
  ImageIcon,
  Clock,
  CircleAlert,
} from "lucide-react";
import { getDashboardData } from "@/data/admin-dashboard";
import { SalesChart } from "@/components/admin/SalesChart";
import { Card, PageHeader, StatusBadge } from "@/components/admin/ui";
import { KpiCardSkeleton, WidgetSkeleton } from "@/components/admin/Skeleton";
import { EmptyState } from "@/components/admin/EmptyState";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const formatRWF = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(amount);

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  return `${days}d ago`;
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 dark:bg-amber-500/15",
  confirmed: "bg-blue-50 dark:bg-blue-500/15",
  processing: "bg-violet-50 dark:bg-violet-500/15",
  shipped: "bg-purple-50 dark:bg-purple-500/15",
  delivered: "bg-emerald-50 dark:bg-emerald-500/15",
  cancelled: "bg-red-50 dark:bg-red-500/15",
};

export default async function AdminDashboardPage() {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const firstName = user?.email?.split("@")[0] ?? "Admin";
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title={`${greeting}, ${displayName}`}
        description={dateStr}
        actions={
          <>
            <Link
              href="/admin/orders"
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] px-3.5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 shadow-sm transition-colors hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-[#132c46]"
            >
              <ShoppingCart className="h-4 w-4" />
              Orders
            </Link>
            <Link
              href="/admin/products/new"
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-ocean px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-ocean-dark"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
          </>
        }
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
              <WidgetSkeleton rows={3} />
              <WidgetSkeleton rows={4} />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <WidgetSkeleton rows={5} />
              <WidgetSkeleton rows={5} />
            </div>
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </div>
  );
}

async function DashboardContent() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <KpiRow data={data} />
      <div className="grid gap-6 lg:grid-cols-3">
        <QuickActions data={data} />
        <NeedsAttention items={data.attention} />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="font-display text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">
              Sales Overview
            </h2>
          </div>
          <SalesChart />
        </Card>
        <OrderStatusPanel counts={data.orderStatus} />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden">
          <RecentOrders orders={data.recentOrders} />
        </Card>
        <TradeInPanel overview={data.tradeIns} />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <ProductHealthPanel health={data.productHealth.health} />
        <Card className="p-5">
          <AttentionProducts alerts={data.productHealth.alerts} />
        </Card>
        <TopProductsPanel products={data.topProducts} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <MessagesPanel overview={data.messages} />
        </Card>
        <MarketingPanel overview={data.marketing} reviewsAvg={data.reviews.average} reviewsTotal={data.reviews.total} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <ReviewsPanel overview={data.reviews} />
        </Card>
        <CustomerActivityPanel activity={data.customerActivity} />
      </div>
    </div>
  );
}

/* ─── KPI row ───────────────────────────────────────────────────────────── */

interface DashboardDataShape {
  kpis: {
    totalRevenue: number;
    revenueThisMonth: number;
    revenueLastMonth: number;
    totalOrders: number;
    pendingOrders: number;
    totalProducts: number;
    pendingTradeIns: number;
    unreadMessages: number;
  };
  productHealth: { alerts: unknown[] };
}

function KpiRow({ data }: { data: DashboardDataShape }) {
  const { kpis, productHealth } = data;
  const revenueTrend =
    kpis.revenueLastMonth > 0
      ? ((kpis.revenueThisMonth - kpis.revenueLastMonth) / kpis.revenueLastMonth) * 100
      : null;

  const cards: {
    label: string;
    value: string;
    supporting: React.ReactNode;
  }[] = [
    {
      label: "Total Revenue",
      value: formatRWF(kpis.totalRevenue),
      supporting:
        kpis.totalRevenue === 0 ? (
          <span className="text-xs text-slate-400 dark:text-slate-500">No sales yet</span>
        ) : revenueTrend === null ? (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            RWF {new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(kpis.revenueThisMonth)} this month
          </span>
        ) : (
          <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", revenueTrend >= 0 ? "text-emerald-600 dark:text-emerald-300" : "text-red-600 dark:text-red-300")}>
            {revenueTrend >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(revenueTrend).toFixed(1)}% vs last month
          </span>
        ),
    },
    {
      label: "Orders",
      value: String(kpis.totalOrders),
      supporting:
        kpis.pendingOrders > 0 ? (
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-300">{kpis.pendingOrders} need attention</span>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-500">All orders handled</span>
        ),
    },
    {
      label: "Products",
      value: String(kpis.totalProducts),
      supporting:
        productHealth.alerts.length > 0 ? (
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-300">{productHealth.alerts.length}+ need attention</span>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-500">Catalog healthy</span>
        ),
    },
    {
      label: "Pending Trade-Ins",
      value: String(kpis.pendingTradeIns),
      supporting:
        kpis.pendingTradeIns > 0 ? (
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-300">Awaiting review</span>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-500">No pending requests</span>
        ),
    },
    {
      label: "Messages",
      value: String(kpis.unreadMessages),
      supporting:
        kpis.unreadMessages > 0 ? (
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-300">Awaiting reply</span>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-500">Inbox clear</span>
        ),
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">{card.label}</p>
          <p className="mt-1.5 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {card.value}
          </p>
          <div className="mt-1">{card.supporting}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── Quick actions ─────────────────────────────────────────────────────── */

function QuickActions({ data }: { data: DashboardDataShape }) {
  const actions = [
    {
      label: "Add Product",
      href: "/admin/products/new",
      icon: Plus,
      detail: "New listing",
    },
    {
      label: "Create Promotion",
      href: "/admin/promotions/new",
      icon: Sparkles,
      detail: "New campaign",
    },
    {
      label: "Review Trade-Ins",
      href: "/admin/trade-ins",
      icon: RefreshCw,
      detail: data.kpis.pendingTradeIns > 0 ? `${data.kpis.pendingTradeIns} pending` : "All reviewed",
      badge: data.kpis.pendingTradeIns,
    },
    {
      label: "View Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
      detail: data.kpis.pendingOrders > 0 ? `${data.kpis.pendingOrders} pending` : "All clear",
      badge: data.kpis.pendingOrders,
    },
    {
      label: "View Messages",
      href: "/admin/messages",
      icon: MessageSquare,
      detail: data.kpis.unreadMessages > 0 ? `${data.kpis.unreadMessages} unread` : "Inbox clear",
      badge: data.kpis.unreadMessages,
    },
  ];

  return (
    <Card className="p-5">
      <h2 className="mb-3 font-display text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {actions.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="group relative flex flex-col gap-1.5 rounded-lg border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] p-3 transition-colors hover:border-ocean/40 hover:bg-ocean-subtle dark:bg-ocean/15"
          >
            <div className="flex items-center justify-between">
              <a.icon className="h-4 w-4 text-ocean dark:text-[#8ec5f2]" />
              {a.badge ? (
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/15 px-1 text-[10px] font-bold text-red-600 dark:text-red-300">
                  {a.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[13px] font-semibold leading-tight text-slate-700 dark:text-slate-300">{a.label}</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">{a.detail}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}

/* ─── Needs attention ───────────────────────────────────────────────────── */

const TONE_STYLES: Record<string, { icon: string; text: string }> = {
  red: { icon: "bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-300", text: "text-red-700 dark:text-red-300" },
  amber: { icon: "bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-300", text: "text-amber-700 dark:text-amber-300" },
  blue: { icon: "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-300", text: "text-blue-700 dark:text-blue-300" },
  purple: { icon: "bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-300", text: "text-purple-700 dark:text-purple-300" },
};

function NeedsAttention({ items }: { items: { label: string; detail: string; href: string; tone: string }[] }) {
  return (
    <div className="rounded-xl border border-amber-200/70 bg-amber-50 p-5 dark:border-amber-500/30 dark:bg-amber-500/15 lg:col-span-2">
      <div className="mb-3 flex items-center gap-2">
        <CircleAlert className="h-4 w-4 text-amber-600 dark:text-amber-300" />
        <h2 className="font-display text-sm font-bold tracking-tight text-amber-900 dark:text-amber-200">Needs Attention</h2>
        {items.length > 0 && (
          <span className="rounded-md bg-amber-100 dark:bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
            {items.length}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-400 dark:text-slate-500">Nothing needs your attention right now.</p>
      ) : (
        <ul className="divide-y divide-amber-100/70 dark:divide-amber-500/15">
          {items.map((item) => {
            const s = TONE_STYLES[item.tone] ?? TONE_STYLES.blue;
            return (
              <li key={item.label + item.detail}>
                <Link
                  href={item.href}
                  className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-amber-100 dark:hover:bg-amber-500/20"
                >
                  <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-md", s.icon)}>
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block truncate text-[13px] font-semibold", s.text)}>{item.label}</span>
                    <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{item.detail}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-400" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ─── Order status panel ────────────────────────────────────────────────── */

function OrderStatusPanel({ counts }: { counts: { status: string; count: number }[] }) {
  const total = counts.reduce((a, c) => a + c.count, 0);

  if (total === 0) {
    return (
      <Card className="p-5">
        <h2 className="font-display text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">Order Status</h2>
        <EmptyState
          icon={<ShoppingCart className="h-8 w-8" />}
          title="No orders yet"
          description="Orders placed by customers will appear here."
          className="mt-4"
        />
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">Order Status</h2>
        <Link href="/admin/orders" className="text-xs font-semibold text-ocean dark:text-[#8ec5f2] hover:text-ocean dark:hover:text-[#a5d3f7]">
          View all
        </Link>
      </div>

      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-[#162f4a]">
        {counts.map((c) => (
          <div
            key={c.status}
            style={{ width: `${(c.count / total) * 100}%` }}
            className={cn("h-full", STATUS_COLORS[c.status] ?? "bg-slate-400")}
            title={`${c.status}: ${c.count}`}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {counts.map((c) => (
          <Link
            key={c.status}
            href={`/admin/orders?status=${c.status}`}
            className="group flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] px-2.5 py-1.5 transition-colors hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-[#132c46]"
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_COLORS[c.status] ?? "bg-slate-400")} />
            <span className="text-xs font-medium capitalize text-slate-600 dark:text-slate-400 group-hover:text-slate-800">
              {c.status.replace(/_/g, " ")}
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{c.count}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}

/* ─── Recent orders table ───────────────────────────────────────────────── */

function RecentOrders({ orders }: { orders: { id: string; order_number: string; customer_name: string; items: number; total_amount: number; status: string; created_at: string }[] }) {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1a3352] px-5 py-3.5">
        <h2 className="font-display text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">Recent Orders</h2>
        <span className="text-xs text-slate-400 dark:text-slate-500">Latest {orders.length}</span>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-8 w-8" />}
          title="No orders yet"
          description="Orders placed by customers will appear here."
          className="m-5"
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-[#1a3352] text-left">
                <th className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Order</th>
                <th className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Customer</th>
                <th className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Items</th>
                <th className="px-5 py-2.5 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Total</th>
                <th className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Status</th>
                <th className="px-5 py-2.5 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Date</th>
                <th className="px-5 py-2.5 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-[#1a3352]">
              {orders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#132c46]/70">
                  <td className="px-5 py-3">
                    <span className="font-mono text-[13px] font-semibold text-ocean dark:text-[#8ec5f2]">#{order.order_number}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">{order.customer_name}</span>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-slate-500 dark:text-slate-400">
                    {order.items} item{order.items === 1 ? "" : "s"}
                  </td>
                  <td className="px-5 py-3 text-right text-[13px] font-semibold text-slate-800 dark:text-slate-200">
                    {formatRWF(order.total_amount)}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right text-xs text-slate-400 dark:text-slate-500">
                    {timeAgo(order.created_at)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs font-semibold text-ocean dark:text-[#8ec5f2] transition-colors hover:text-ocean dark:hover:text-[#a5d3f7]"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="border-t border-slate-100 dark:border-[#1a3352] px-5 py-3 text-right">
        <Link href="/admin/orders" className="text-xs font-semibold text-ocean dark:text-[#8ec5f2] hover:text-ocean dark:hover:text-[#a5d3f7]">
          View All Orders →
        </Link>
      </div>
    </div>
  );
}

/* ─── Trade-in panel ────────────────────────────────────────────────────── */

function TradeInPanel({ overview }: { overview: { pending: number; underReview: number; offerSent: number; accepted: number; completed: number } }) {
  const rows = [
    { key: "pending", label: "Pending", count: overview.pending, dot: "bg-amber-50 dark:bg-amber-500/15", href: "/admin/trade-ins" },
    { key: "under_review", label: "Under Review", count: overview.underReview, dot: "bg-blue-50 dark:bg-blue-500/15", href: "/admin/trade-ins" },
    { key: "offer_sent", label: "Offer Sent", count: overview.offerSent, dot: "bg-violet-50 dark:bg-violet-500/15", href: "/admin/trade-ins" },
    { key: "accepted", label: "Accepted", count: overview.accepted, dot: "bg-emerald-50 dark:bg-emerald-500/15", href: "/admin/trade-ins" },
    { key: "completed", label: "Completed", count: overview.completed, dot: "bg-teal-50 dark:bg-teal-500/15", href: "/admin/trade-ins" },
  ];
  const actionable = overview.pending + overview.underReview;

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">Trade-Ins</h2>
        {actionable > 0 && (
          <span className="rounded-md bg-amber-50 dark:bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
            {actionable} pending review
          </span>
        )}
      </div>

      {rows.every((r) => r.count === 0) ? (
        <EmptyState
          icon={<RefreshCw className="h-8 w-8" />}
          title="No trade-ins yet"
          description="Customer device submissions will appear here."
        />
      ) : (
        <ul className="space-y-1">
          {rows.map((r) => (
            <li key={r.key}>
              <Link
                href={r.href}
                className="group flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-[#132c46]"
              >
                <span className="flex items-center gap-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-400">
                  <span className={cn("h-1.5 w-1.5 rounded-full", r.dot)} />
                  {r.label}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{r.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/admin/trade-ins"
        className="mt-4 flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#1e3a5f] px-3 py-2 text-[13px] font-semibold text-slate-600 dark:text-slate-400 transition-colors hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-[#132c46]"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Review Trade-Ins
      </Link>
    </Card>
  );
}

/* ─── Product health ────────────────────────────────────────────────────── */

function ProductHealthPanel({ health }: { health: { total: number; inStock: number; limited: number; outOfStock: number; comingSoon: number } }) {
  const rows = [
    { label: "In Stock", count: health.inStock, href: "/admin/products?stock_status=in_stock", tone: "text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/15" },
    { label: "Low Stock", count: health.limited, href: "/admin/products?stock_status=limited", tone: "text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/15" },
    { label: "Out of Stock", count: health.outOfStock, href: "/admin/products?stock_status=out_of_stock", tone: "text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-500/15" },
    { label: "Coming Soon", count: health.comingSoon, href: "/admin/products?stock_status=coming_soon", tone: "text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-500/15" },
  ];

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">Inventory Health</h2>
        <Link href="/admin/products" className="text-xs font-semibold text-ocean dark:text-[#8ec5f2] hover:text-ocean dark:hover:text-[#a5d3f7]">
          Catalog
        </Link>
      </div>

      <div className="mb-4 flex items-end gap-2">
        <p className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{health.total}</p>
        <p className="pb-1 text-xs text-slate-400 dark:text-slate-500">total products</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {rows.map((r) => (
          <Link
            key={r.label}
            href={r.href}
            className={cn("flex items-center justify-between rounded-lg border border-slate-100 dark:border-[#1a3352] px-3 py-2.5 transition-colors hover:border-slate-200 dark:border-[#1e3a5f] dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-[#132c46]")}
          >
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{r.label}</span>
            <span className={cn("rounded-md px-1.5 py-0.5 text-xs font-bold", r.tone)}>{r.count}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}

/* ─── Products needing attention ────────────────────────────────────────── */

function AttentionProducts({ alerts }: { alerts: { id: string; name: string; issue: string; tone: string; href: string }[] }) {
  const toneText: Record<string, string> = {
    red: "bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-300",
    amber: "bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-300",
    blue: "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-300",
    purple: "bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-300",
  };

  return (
    <div>
      <h2 className="mb-3 font-display text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">
        Products Needing Attention
      </h2>
      {alerts.length === 0 ? (
        <EmptyState
          icon={<Package className="h-8 w-8" />}
          title="All products healthy"
          description="Products with missing details or stock issues will appear here."
        />
      ) : (
        <ul className="divide-y divide-slate-50 dark:divide-[#1a3352]">
          {alerts.map((a) => (
            <li key={a.id}>
              <Link
                href={a.href}
                className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-[#132c46]"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold text-slate-700 dark:text-slate-300">{a.name}</span>
                </span>
                <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", toneText[a.tone])}>
                  {a.issue}
                </span>
                <span className="text-xs font-semibold text-ocean dark:text-[#8ec5f2] group-hover:text-ocean dark:hover:text-[#a5d3f7]">Manage →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─── Top products ──────────────────────────────────────────────────────── */

function TopProductsPanel({ products }: { products: { name: string; units: number; revenue: number }[] }) {
  return (
    <Card className="p-5">
      <h2 className="mb-3 font-display text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">Top Products</h2>
      {products.length === 0 ? (
        <EmptyState
          icon={<Package className="h-8 w-8" />}
          title="No sales data yet"
          description="Product rankings will appear here once orders come in."
        />
      ) : (
        <ul className="space-y-2">
          {products.map((p, i) => (
            <li key={p.name} className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-[#162f4a] text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-slate-700 dark:text-slate-300">{p.name}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">{p.units} sold</p>
              </div>
              <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200">{formatRWF(p.revenue)}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* ─── Messages ──────────────────────────────────────────────────────────── */

function MessagesPanel({ overview }: { overview: { unread: number; recent: { id: string; type: string; name: string; subject: string | null; status: string; created_at: string }[] } }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">Customer Messages</h2>
        <Link href="/admin/messages" className="text-xs font-semibold text-ocean dark:text-[#8ec5f2] hover:text-ocean dark:hover:text-[#a5d3f7]">
          View →
        </Link>
      </div>

      {overview.unread > 0 && (
        <p className="mb-3 rounded-lg bg-blue-50 dark:bg-blue-500/15 px-3 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300">
          {overview.unread} unread message{overview.unread === 1 ? "" : "s"} waiting for a reply
        </p>
      )}

      {overview.recent.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-8 w-8" />}
          title="No messages yet"
          description="Contact form submissions and product enquiries will appear here."
        />
      ) : (
        <ul className="divide-y divide-slate-50 dark:divide-[#1a3352]">
          {overview.recent.map((m) => (
            <li key={`${m.type}-${m.id}`}>
              <Link
                href="/admin/messages"
                className="group flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-[#132c46]"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-[#162f4a] text-slate-500 dark:text-slate-400">
                  <MessageSquare className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-[13px] font-semibold text-slate-700 dark:text-slate-300">{m.name}</span>
                    <span className="shrink-0 text-[10px] text-slate-400 dark:text-slate-500">{timeAgo(m.created_at)}</span>
                  </span>
                  <span className="block truncate text-xs text-slate-400 dark:text-slate-500">
                    {m.subject || "No subject"}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─── Marketing ─────────────────────────────────────────────────────────── */

function MarketingPanel({
  overview,
  reviewsAvg,
  reviewsTotal,
}: {
  overview: { activePromotions: number; endingSoon: { id: string; title: string; daysLeft: number }[]; heroPublished: boolean; heroTitle: string | null; pendingReviews: number };
  reviewsAvg: number;
  reviewsTotal: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438]/60 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">Marketing</h2>
        <Link href="/admin/promotions" className="text-xs font-semibold text-ocean dark:text-[#8ec5f2] hover:text-ocean dark:hover:text-[#a5d3f7]">
          Manage Promotions
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg bg-white dark:bg-[#0f2438] p-3 shadow-sm ring-1 ring-slate-100 dark:ring-slate-600">
          <p className="font-display text-xl font-bold text-slate-900 dark:text-slate-100">{overview.activePromotions}</p>
          <p className="mt-0.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">Active promotions</p>
        </div>
        <div className="rounded-lg bg-white dark:bg-[#0f2438] p-3 shadow-sm ring-1 ring-slate-100 dark:ring-slate-600">
          <p className="font-display text-xl font-bold text-slate-900 dark:text-slate-100">{overview.pendingReviews}</p>
          <p className="mt-0.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">Unpublished reviews</p>
        </div>
        <div className="rounded-lg bg-white dark:bg-[#0f2438] p-3 shadow-sm ring-1 ring-slate-100 dark:ring-slate-600">
          <p className="font-display text-xl font-bold text-slate-900 dark:text-slate-100">{reviewsTotal}</p>
          <p className="mt-0.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">Total reviews</p>
        </div>
        <div className="rounded-lg bg-white dark:bg-[#0f2438] p-3 shadow-sm ring-1 ring-slate-100 dark:ring-slate-600">
          <div className="flex items-center gap-1">
            <p className="font-display text-xl font-bold text-slate-900 dark:text-slate-100">{reviewsAvg || "—"}</p>
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          </div>
          <p className="mt-0.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">Average rating</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2.5 rounded-lg bg-white dark:bg-[#0f2438] px-3 py-2.5 shadow-sm ring-1 ring-slate-100 dark:ring-slate-600">
          <ImageIcon className="h-4 w-4 text-ocean dark:text-[#8ec5f2]" />
          <span className="text-[13px] text-slate-600 dark:text-slate-400">
            {overview.heroPublished ? (
              <>Hero published: <span className="font-semibold text-slate-800 dark:text-slate-200">{overview.heroTitle || "Active"}</span></>
            ) : (
              <span className="font-semibold text-amber-600 dark:text-amber-300">No hero content published</span>
            )}
          </span>
          <Link href="/admin/hero" className="ml-auto text-xs font-semibold text-ocean dark:text-[#8ec5f2] hover:text-ocean dark:hover:text-[#a5d3f7]">
            Edit →
          </Link>
        </div>

        {overview.endingSoon.length > 0 && (
          <div className="rounded-lg bg-amber-50 dark:bg-amber-500/15 px-3 py-2.5 ring-1 ring-amber-100 dark:ring-amber-500/25">
            <p className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              <Clock className="h-3 w-3" /> Ending soon
            </p>
            <ul className="space-y-1">
              {overview.endingSoon.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2 text-[13px]">
                  <span className="truncate font-semibold text-amber-800 dark:text-amber-200">{p.title}</span>
                  <span className="shrink-0 text-xs text-amber-600 dark:text-amber-300">
                    {p.daysLeft <= 1 ? "ends tomorrow" : `ends in ${p.daysLeft} days`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Reviews ───────────────────────────────────────────────────────────── */

function ReviewsPanel({ overview }: { overview: { average: number; total: number; active: number; recent: { id: string; author: string; rating: number; content: string }[] } }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">Reviews</h2>
        <Link href="/admin/reviews" className="text-xs font-semibold text-ocean dark:text-[#8ec5f2] hover:text-ocean dark:hover:text-[#a5d3f7]">
          View Reviews →
        </Link>
      </div>

      <div className="mb-4 flex items-end gap-4">
        <div>
          <p className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {overview.average || "—"}
          </p>
          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            Average from {overview.active} published review{overview.active === 1 ? "" : "s"}
          </p>
        </div>
        <div className="pb-1">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.round(overview.average) ? "fill-amber-400 text-amber-400" : "text-slate-200"
                )}
              />
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{overview.total} total review{overview.total === 1 ? "" : "s"}</p>
        </div>
      </div>

      {overview.recent.length === 0 ? (
        <EmptyState
          icon={<Star className="h-8 w-8" />}
          title="No reviews yet"
          description="Customer reviews will appear here."
        />
      ) : (
        <ul className="space-y-2.5">
          {overview.recent.map((r) => (
            <li key={r.id} className="rounded-lg border border-slate-100 dark:border-[#1a3352] px-3 py-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">{r.author}</span>
                <span className="text-xs text-amber-500">
                  {"★".repeat(r.rating)}
                  <span className="text-slate-200">{"★".repeat(5 - r.rating)}</span>
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">&ldquo;{r.content}&rdquo;</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─── Customer activity ─────────────────────────────────────────────────── */

function CustomerActivityPanel({ activity }: { activity: { totalCustomers: number; newThisMonth: number; returning: number; newInquiries: number } }) {
  const stats = [
    { label: "Total customers", value: activity.totalCustomers },
    { label: "New this month", value: activity.newThisMonth },
    { label: "Returning", value: activity.returning },
    { label: "New inquiries", value: activity.newInquiries },
  ];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">Customer Activity</h2>
        <Link href="/admin/customers" className="text-xs font-semibold text-ocean dark:text-[#8ec5f2] hover:text-ocean dark:hover:text-[#a5d3f7]">
          View Customers →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-slate-100 dark:border-[#1a3352] px-3 py-3">
            <p className="font-display text-xl font-bold text-slate-900 dark:text-slate-100">{s.value}</p>
            <p className="mt-0.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 dark:bg-[#0f2438] px-3 py-2.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
        Customers are identified by phone or name across orders, trade-ins and enquiries. No duplicate records are stored.
      </p>
    </div>
  );
}