import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { getDashboardData, type RecentMessage } from "@/data/admin";
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
  Zap,
  Activity,
  Mail,
  MessageSquare,
  Inbox,
} from "lucide-react";
import { createAuthClient } from "@/lib/supabase-server-auth";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const formatRWF = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(amount);

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
    <div className="space-y-8 pb-10">

      {/* ── Welcome Banner ──────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0a1628] p-[1px] shadow-2xl shadow-[#0b5497]/20">
        <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-gradient-to-br from-[#0d1f3c] via-[#0a1628] to-[#0b2a50] px-7 py-8 md:px-9 md:py-9">
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
            <div className="space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/80 ring-1 ring-white/15">
                  <Zap className="h-3.5 w-3.5 fill-white/40 text-white/40" />
                  Store Overview
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300 ring-1 ring-emerald-500/20">
                  <Activity className="h-3.5 w-3.5" />
                  Live
                </span>
              </div>
              <h1 className="font-clash text-3xl font-bold text-white md:text-4xl tracking-tight">
                {greeting}, {displayName}
              </h1>
              <p className="text-base text-white/70 max-w-lg leading-relaxed">{dayName}, {dateStr} — here&apos;s your store snapshot.</p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/admin/products/new"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0b5497] shadow-lg shadow-black/20 transition-all duration-200 hover:bg-ocean-light hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
                Add Product
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="relative mt-6 grid grid-cols-2 gap-px rounded-xl bg-white/8 overflow-hidden sm:grid-cols-4">
            {[
              { label: "Date", value: dateStr },
              { label: "Status", value: "All Systems Operational" },
              { label: "Region", value: "Kigali, Rwanda" },
              { label: "Platform", value: "Galaxy Hub v1.0" },
            ].map((item) => (
              <div key={item.label} className="bg-[#0a1628] px-4 py-3.5 sm:px-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-white/90 truncate">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content (fetched once) ──────────────────────────── */}
      <Suspense
        fallback={
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </div>
            <div className="h-32 animate-pulse rounded-2xl bg-white/5" />
            <div className="h-72 animate-pulse rounded-2xl bg-white/5" />
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
    <div className="space-y-8">
      <StatsCards stats={data.stats} />
      <QuickActions unreadMessages={data.stats.unreadMessages} />
      <RecentMessages messages={data.recentMessages} />
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentOrders orders={data.recentOrders} />
        <RecentProducts products={data.recentProducts} />
      </div>
    </div>
  );
}

function StatsCards({ stats }: { stats: { totalProducts: number; totalCategories: number; totalBrands: number; activePromotions: number; pendingOrders: number; totalOrders: number; unreadMessages: number } }) {
  const cards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: <ShoppingCart className="h-5 w-5" />,
      gradient: "from-cyan-500 to-sky-600",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: <Clock className="h-5 w-5" />,
      gradient: "from-rose-500 to-pink-600",
      trend: { value: stats.pendingOrders > 0 ? "Needs attention" : "All clear", positive: stats.pendingOrders === 0 },
    },
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: <Package className="h-5 w-5" />,
      gradient: "from-[#0b5497] to-[#0f70c9]",
      trend: { value: `${stats.totalCategories} categories · ${stats.totalBrands} brands`, positive: true },
    },
    {
      label: "New Messages",
      value: stats.unreadMessages,
      icon: <Mail className="h-5 w-5" />,
      gradient: "from-violet-500 to-purple-600",
      trend: { value: stats.unreadMessages > 0 ? "Awaiting reply" : "Inbox clear", positive: stats.unreadMessages === 0 },
    },
    {
      label: "Active Promotions",
      value: stats.activePromotions,
      icon: <Percent className="h-5 w-5" />,
      gradient: "from-orange-500 to-amber-500",
    },
    {
      label: "Total Brands",
      value: stats.totalBrands,
      icon: <Building2 className="h-5 w-5" />,
      gradient: "from-emerald-500 to-teal-600",
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

function QuickActions({ unreadMessages }: { unreadMessages: number }) {
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
    {
      label: "View Messages",
      description: unreadMessages > 0 ? `${unreadMessages} unread` : "Inbox is clear",
      icon: Mail,
      href: "/admin/messages",
      gradient: "from-purple-500 to-fuchsia-600",
      badge: unreadMessages > 0 ? unreadMessages : undefined,
    },
    {
      label: "Manage Products",
      description: "Edit catalog listings",
      icon: Package,
      href: "/admin/products",
      gradient: "from-cyan-500 to-sky-600",
    },
    {
      label: "Manage Brands",
      description: "Update brand catalog",
      icon: Building2,
      href: "/admin/brands",
      gradient: "from-teal-500 to-emerald-600",
    },
    {
      label: "Manage Categories",
      description: "Organize categories",
      icon: Tags,
      href: "/admin/categories",
      gradient: "from-rose-500 to-red-600",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <h2 className="font-clash text-xl font-bold text-white">Quick Actions</h2>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white/50">{actions.length} shortcuts</span>
        </div>
        <TrendingUp className="h-5 w-5 text-white/30" />
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
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-clash text-base font-bold text-white">{action.label}</p>
                <p className="mt-0.5 text-sm text-white/55">{action.description}</p>
              </div>
              {action.badge !== undefined && action.badge > 0 ? (
                <span className="inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">
                  {action.badge}
                </span>
              ) : (
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-white/30 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-white/60" />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const messageStatusConfig = (status: string) => {
  switch (status) {
    case "new": return { bg: "bg-blue-500/10", text: "text-blue-300", ring: "ring-blue-500/20" };
    case "read":
    case "contacted": return { bg: "bg-amber-500/10", text: "text-amber-300", ring: "ring-amber-500/20" };
    case "responded":
    case "closed": return { bg: "bg-emerald-500/10", text: "text-emerald-300", ring: "ring-emerald-500/20" };
    case "archived": return { bg: "bg-white/5", text: "text-white/40", ring: "ring-white/10" };
    default: return { bg: "bg-white/5", text: "text-white/50", ring: "ring-white/10" };
  }
};

function RecentMessages({ messages }: { messages: RecentMessage[] }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-white/15">
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <h2 className="font-clash text-lg font-bold text-white">Recent Messages</h2>
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold text-white/60">{messages.length}</span>
        </div>
        <Link
          href="/admin/messages"
          className="group flex items-center gap-1.5 text-sm font-semibold text-ocean hover:text-ocean-light transition-colors"
        >
          View All <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {messages.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-10 w-10" />}
          title="No messages yet"
          description="Contact form submissions and product enquiries will appear here."
          className="border-none rounded-none"
        />
      ) : (
        <div className="divide-y divide-white/5">
          {messages.map((msg) => {
            const cfg = messageStatusConfig(msg.status);
            const isUnread = msg.status === "new";
            const title = msg.type === "contact" ? msg.subject || "Contact Form" : `Quote: ${msg.product_name || "Product"}`;
            const snippet = msg.type === "contact" ? msg.message || "" : msg.notes || "";
            return (
              <Link
                key={`${msg.type}-${msg.id}`}
                href="/admin/messages"
                className={cn(
                  "group flex items-start gap-4 px-5 py-4 transition-colors hover:bg-white/[0.03]",
                  isUnread && "bg-blue-500/[0.04]"
                )}
              >
                <div className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors",
                  msg.type === "contact"
                    ? "border-violet-500/20 bg-violet-500/10 text-violet-300 group-hover:bg-violet-500/20"
                    : "border-cyan-500/20 bg-cyan-500/10 text-cyan-300 group-hover:bg-cyan-500/20"
                )}>
                  {msg.type === "contact" ? <Mail className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={cn("text-base font-bold truncate", isUnread ? "text-white" : "text-white/85")}>
                        {msg.name}
                      </span>
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white/60 shrink-0">
                        {msg.type === "contact" ? "Contact" : "Enquiry"}
                      </span>
                      {isUnread && (
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-400 animate-pulse" />
                      )}
                    </div>
                    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ring-1 shrink-0", cfg.bg, cfg.text, cfg.ring)}>
                      {msg.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-white/75 line-clamp-1">{title}</p>
                  {snippet && (
                    <p className="mt-0.5 text-sm text-white/55 line-clamp-1">{snippet}</p>
                  )}
                  <p className="mt-1 text-xs text-white/40">
                    {new Date(msg.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

async function RecentOrders({ orders }: { orders: { id: string; order_number: string; customer_name: string; status: string; total_amount: number; created_at: string }[] }) {
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
        <div className="flex items-center gap-2.5">
          <h2 className="font-clash text-lg font-bold text-white">Recent Orders</h2>
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold text-white/60">{orders.length}</span>
        </div>
        <Link
          href="/admin/orders"
          className="group flex items-center gap-1.5 text-sm font-semibold text-ocean hover:text-ocean-light transition-colors"
        >
          View All <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {orders.length === 0 ? (
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
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-[0.12em] text-white/50">Order</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-[0.12em] text-white/50">Customer</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-[0.12em] text-white/50">Status</th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-[0.12em] text-white/50">Total</th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-[0.12em] text-white/50">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order) => {
                const cfg = statusConfig(order.status);
                return (
                  <tr key={order.id} className="group transition-colors hover:bg-white/[0.03]">
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-sm font-bold text-ocean">#{order.order_number}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-semibold text-white/90">{order.customer_name}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-sm font-bold text-white">{formatRWF(Number(order.total_amount))}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-sm text-white/55 whitespace-nowrap">
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

async function RecentProducts({ products }: { products: { id: string; name: string; main_image_url: string | null; category_name: string | null; price: number; created_at: string }[] }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-white/15">
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <h2 className="font-clash text-lg font-bold text-white">Recent Products</h2>
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold text-white/60">{products.length}</span>
        </div>
        <Link
          href="/admin/products"
          className="group flex items-center gap-1.5 text-sm font-semibold text-ocean hover:text-ocean-light transition-colors"
        >
          View All <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {products.length === 0 ? (
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
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-[0.12em] text-white/50">Product</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-[0.12em] text-white/50">Category</th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-[0.12em] text-white/50">Price</th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-[0.12em] text-white/50">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((product) => (
                <tr key={product.id} className="group transition-colors hover:bg-white/[0.03]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white/8 border border-white/10 transition-transform group-hover:scale-105">
                        {product.main_image_url ? (
                          <Image
                            src={product.main_image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-white/25">
                            <Package className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-white/90 leading-tight">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex rounded-lg bg-white/10 px-2.5 py-1 text-sm font-medium text-white/70 group-hover:bg-white/15 transition-colors">
                      {product.category_name ?? "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-sm font-bold text-white">{formatRWF(Number(product.price))}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-sm text-white/55 whitespace-nowrap">
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
