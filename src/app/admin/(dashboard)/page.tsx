import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { getDashboardData } from "@/data/admin";
import { StatCard } from "@/components/admin/StatCard";
import { EmptyState } from "@/components/admin/EmptyState";
import { StatCardSkeleton } from "@/components/admin/Skeleton";
import {
  Package,
  Tags,
  Building2,
  Percent,
  ShoppingCart,
  Clock,
  Plus,
  Sparkles,
  ImageIcon,
  ArrowRight,
  CreditCard,
  TrendingUp,
  Star,
  Zap,
  Activity,
} from "lucide-react";
import { createAuthClient } from "@/lib/supabase-server-auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  const firstName = user?.email?.split("@")[0] ?? "Admin";
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const dayName = now.toLocaleDateString("en-GB", { weekday: "long" });
  const dateStr = now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-7 pb-10">

      {/* ── Welcome Banner ──────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0a1628] p-[1px] shadow-2xl shadow-[#0b5497]/20">
        <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-gradient-to-br from-[#0d1f3c] via-[#0a1628] to-[#0b2a50] px-7 py-7 md:px-9 md:py-8">
          {/* Glow orbs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#0f70c9]/20 blur-3xl" />
            <div className="absolute -bottom-16 left-1/4 h-56 w-56 rounded-full bg-[#0b5497]/25 blur-3xl" />
            <div className="absolute right-1/3 top-1/2 h-40 w-40 rounded-full bg-white/[0.03] blur-2xl" />
            <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dashboard-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dashboard-dots)" />
            </svg>
          </div>

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1 text-caption font-bold uppercase tracking-[0.18em] text-white/50 ring-1 ring-white/10">
                  <Zap className="h-3 w-3 fill-white/30 text-white/30" />
                  Store Overview
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-caption font-bold uppercase tracking-[0.18em] text-emerald-400 ring-1 ring-emerald-500/20">
                  <Activity className="h-3 w-3" />
                  Live
                </span>
              </div>
              <h1 className="font-clash text-2xl font-bold text-white md:text-3xl tracking-tight">
                {greeting}, {displayName}
              </h1>
              <p className="text-sm text-white/45 max-w-lg leading-relaxed">{dayName}, {dateStr} — here&apos;s your store snapshot.</p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/admin/products/new"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#0b5497] shadow-lg shadow-black/20 transition-all duration-200 hover:bg-ocean-light hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
                Add Product
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="relative mt-6 grid grid-cols-2 gap-px rounded-xl bg-white/5 overflow-hidden sm:grid-cols-4">
            {[
              { label: "Date", value: dateStr },
              { label: "Status", value: "All Systems Operational" },
              { label: "Region", value: "Kigali, Rwanda" },
              { label: "Platform", value: "Galaxy Hub v1.0" },
            ].map((item, i) => (
              <div key={item.label} className="bg-[#0a1628] px-4 py-3 sm:px-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">{item.label}</p>
                <p className="mt-0.5 text-xs font-semibold text-white/70 truncate">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────── */}
      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <StatsCards />
      </Suspense>

      {/* ── Quick Actions ────────────────────────────────────── */}
      <QuickActions />

      {/* ── Tables ──────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense
          fallback={
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-4">
                <div className="h-5 w-32 animate-pulse rounded-lg bg-gray-100" />
              </div>
              <div className="divide-y divide-gray-50">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3">
                    <div className="h-4 w-4 animate-pulse rounded bg-gray-100" />
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <RecentOrders />
        </Suspense>

        <Suspense
          fallback={
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-4">
                <div className="h-5 w-36 animate-pulse rounded-lg bg-gray-100" />
              </div>
              <div className="divide-y divide-gray-50">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3">
                    <div className="h-9 w-9 animate-pulse rounded-xl bg-gray-100" />
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <RecentProducts />
        </Suspense>
      </div>
    </div>
  );
}

async function StatsCards() {
  const { stats } = await getDashboardData();

  const cards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: <Package className="h-5 w-5" />,
      gradient: "from-[#0b5497] to-[#0f70c9]",
      trend: { value: "+12% this month", positive: true },
    },
    {
      label: "Total Categories",
      value: stats.totalCategories,
      icon: <Tags className="h-5 w-5" />,
      gradient: "from-violet-500 to-purple-600",
    },
    {
      label: "Total Brands",
      value: stats.totalBrands,
      icon: <Building2 className="h-5 w-5" />,
      gradient: "from-emerald-500 to-teal-600",
      trend: { value: "+3 new", positive: true },
    },
    {
      label: "Active Promotions",
      value: stats.activePromotions,
      icon: <Percent className="h-5 w-5" />,
      gradient: "from-orange-500 to-amber-500",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: <Clock className="h-5 w-5" />,
      gradient: "from-rose-500 to-pink-600",
      trend: { value: stats.pendingOrders > 0 ? "Needs attention" : "All clear", positive: stats.pendingOrders === 0 },
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: <ShoppingCart className="h-5 w-5" />,
      gradient: "from-cyan-500 to-sky-600",
      trend: { value: "+8% this month", positive: true },
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}

function QuickActions() {
  const actions = [
    {
      label: "Add Product",
      description: "Create a new listing",
      icon: Plus,
      href: "/admin/products/new",
      gradient: "from-[#0b5497] to-[#0f70c9]",
    },
    {
      label: "New Promotion",
      description: "Set up a discount",
      icon: Sparkles,
      href: "/admin/promotions/new",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      label: "Manage Hero",
      description: "Update homepage banner",
      icon: ImageIcon,
      href: "/admin/hero",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      label: "View Orders",
      description: "Review customer orders",
      icon: CreditCard,
      href: "/admin/orders",
      gradient: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-clash text-lg font-bold text-white">Quick Actions</h2>
          <span className="rounded-full bg-white/8 px-2 py-0.5 text-caption font-bold uppercase tracking-wider text-white/30">4 shortcuts</span>
        </div>
        <TrendingUp className="h-4 w-4 text-white/20" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/5 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 hover:border-white/15"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
            <div className="relative flex items-start justify-between gap-3">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-clash text-sm font-bold text-white">{action.label}</p>
                <p className="mt-0.5 text-xs text-white/40">{action.description}</p>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-white/20 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-white/50" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

async function RecentOrders() {
  const { recentOrders } = await getDashboardData();

  const statusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return { bg: "bg-amber-500/10", text: "text-amber-300", dot: "bg-amber-400", ring: "ring-amber-500/20" };
      case "confirmed":
        return { bg: "bg-blue-500/10", text: "text-blue-300", dot: "bg-blue-400", ring: "ring-blue-500/20" };
      case "processing":
        return { bg: "bg-violet-500/10", text: "text-violet-300", dot: "bg-violet-400", ring: "ring-violet-500/20" };
      case "completed":
      case "delivered":
        return { bg: "bg-emerald-500/10", text: "text-emerald-300", dot: "bg-emerald-400", ring: "ring-emerald-500/20" };
      case "cancelled":
        return { bg: "bg-red-500/10", text: "text-red-300", dot: "bg-red-400", ring: "ring-red-500/20" };
      default:
        return { bg: "bg-white/5", text: "text-white/50", dot: "bg-white/30", ring: "ring-white/10" };
    }
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-white/15">
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
        <div className="flex items-center gap-2">
          <h2 className="font-clash text-base font-bold text-white">Recent Orders</h2>
          <span className="rounded-full bg-white/8 px-2 py-0.5 text-caption font-bold text-white/40">{recentOrders.length}</span>
        </div>
        <Link
          href="/admin/orders"
          className="group flex items-center gap-1 text-xs font-semibold text-ocean hover:text-ocean-light transition-colors"
        >
          View All <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {recentOrders.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart className="h-10 w-10" />}
          title="No orders yet"
          description="Orders placed by customers will appear here."
          className="border-none rounded-none"
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-5 py-3 text-left text-caption font-bold uppercase tracking-[0.12em] text-white/30">Order</th>
                <th className="px-5 py-3 text-left text-caption font-bold uppercase tracking-[0.12em] text-white/30">Customer</th>
                <th className="px-5 py-3 text-left text-caption font-bold uppercase tracking-[0.12em] text-white/30">Status</th>
                <th className="px-5 py-3 text-right text-caption font-bold uppercase tracking-[0.12em] text-white/30">Total</th>
                <th className="px-5 py-3 text-right text-caption font-bold uppercase tracking-[0.12em] text-white/30">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders.map((order, i) => {
                const cfg = statusConfig(order.status);
                return (
                  <tr key={order.id} className="group transition-colors hover:bg-white/[0.03]">
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs font-bold text-ocean">#{order.order_number}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium text-white/80">{order.customer_name}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-sm font-bold text-white">{Number(order.total_amount).toLocaleString()}</span>
                      <span className="ml-1 text-caption font-medium text-white/30">RWF</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-xs text-white/30 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

async function RecentProducts() {
  const { recentProducts } = await getDashboardData();

  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-white/15">
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
        <div className="flex items-center gap-2">
          <h2 className="font-clash text-base font-bold text-white">Recent Products</h2>
          <span className="rounded-full bg-white/8 px-2 py-0.5 text-caption font-bold text-white/40">{recentProducts.length}</span>
        </div>
        <Link
          href="/admin/products"
          className="group flex items-center gap-1 text-xs font-semibold text-ocean hover:text-ocean-light transition-colors"
        >
          View All <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {recentProducts.length === 0 ? (
        <EmptyState
          icon={<Package className="h-10 w-10" />}
          title="No products yet"
          description="Products added to the catalog will appear here."
          className="border-none rounded-none"
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-5 py-3 text-left text-caption font-bold uppercase tracking-[0.12em] text-white/30">Product</th>
                <th className="px-5 py-3 text-left text-caption font-bold uppercase tracking-[0.12em] text-white/30">Category</th>
                <th className="px-5 py-3 text-right text-caption font-bold uppercase tracking-[0.12em] text-white/30">Price</th>
                <th className="px-5 py-3 text-right text-caption font-bold uppercase tracking-[0.12em] text-white/30">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentProducts.map((product) => (
                <tr key={product.id} className="group transition-colors hover:bg-white/[0.03]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-white/8 border border-white/10 transition-transform group-hover:scale-105">
                        {product.main_image_url ? (
                          <Image
                            src={product.main_image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="36px"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-white/20">
                            <Package className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-white leading-tight">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex rounded-lg bg-white/8 px-2.5 py-1 text-xs font-medium text-white/50 group-hover:bg-white/12 transition-colors">
                      {product.category_name ?? "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-sm font-bold text-white">{Number(product.price).toLocaleString()}</span>
                    <span className="ml-1 text-caption font-medium text-white/30">RWF</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-xs text-white/30 whitespace-nowrap">
                      {new Date(product.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
