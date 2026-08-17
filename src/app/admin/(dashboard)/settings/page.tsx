import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-server";
import { createAuthClient } from "@/lib/supabase-server-auth";
import { redirect } from "next/navigation";
import { ORDER_STATUSES } from "@/lib/order-statuses";
import { TRADE_IN_STATUSES, MAX_TRADE_IN_PHOTOS } from "@/lib/trade-in";
import { PageHeader, Card } from "@/components/admin/ui";
import { AppearanceSettings, NotificationPreferences } from "./SettingsClient";
import {
  Building2,
  ShoppingBag,
  RefreshCw,
  Send,
  BellRing,
  ShieldCheck,
  Palette,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Settings · Galaxy Hub Admin",
};

const telegramConfigured = Boolean(
  process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID
);

function InfoRow({
  label,
  value,
  muted,
}: {
  label: string;
  value: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <p className="text-[13px] text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`text-right text-[13px] font-semibold ${muted ? "text-slate-400 dark:text-slate-500" : "text-slate-800 dark:text-slate-200"}`}>
        {value}
      </p>
    </div>
  );
}

export default async function SettingsPage() {
  const supabase = createClient();
  const auth = await createAuthClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) redirect("/admin/login");

  const [categories, brands, products, promotions, reviews, hero, orders, tradeIns, messages, enquiries, telegramFailures] =
    await Promise.all([
      supabase.from("categories").select("id", { count: "exact", head: true }),
      supabase.from("brands").select("id", { count: "exact", head: true }),
      supabase
        .from("products")
        .select("id, is_active, is_featured", { count: "exact", head: false }),
      supabase
        .from("promotions")
        .select("id, is_active", { count: "exact", head: false }),
      supabase.from("reviews").select("id, is_active", { count: "exact", head: false }),
      supabase
        .from("hero_sections")
        .select("id, title, is_active")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("orders")
        .select("status", { count: "exact", head: false }),
      supabase
        .from("trade_ins")
        .select("telegram_error", { count: "exact", head: false })
        .not("telegram_error", "is", null),
      supabase.from("contact_messages").select("status").eq("status", "new"),
      supabase.from("product_enquiries").select("status").eq("status", "new"),
      supabase.from("trade_ins").select("id").not("telegram_error", "is", null).limit(1),
    ]);

  const productCount = products.count ?? 0;
  const activeProducts = (products.data ?? []).filter((p) => p.is_active).length;
  const featuredProducts = (products.data ?? []).filter((p) => p.is_featured).length;
  const activePromotions = (promotions.data ?? []).filter((p) => p.is_active).length;
  const activeReviews = (reviews.data ?? []).filter((r) => r.is_active).length;
  const totalReviews = reviews.count ?? 0;
  const pendingOrders = (orders.data ?? []).filter((o) => o.status === "pending").length;
  const pendingTradeIns = (tradeIns.data ?? []).length;
  const unreadCount = (messages.count ?? 0) + (enquiries.count ?? 0);
  const telegramFailureCount = telegramFailures.count ?? 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="Settings"
        description="System control center for Galaxy Hub — store, workflows, integrations and preferences."
      />

      <Card>
        <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-[#1a3352] px-5 py-4">
          <Building2 className="h-4 w-4 text-ocean dark:text-[#8ec5f2]" />
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Store</h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-[#1a3352] px-5">
          <InfoRow label="Store name" value="Galaxy Hub" />
          <InfoRow label="Region" value="Kigali, Rwanda" />
          <InfoRow label="Site URL" value={process.env.NEXT_PUBLIC_SITE_URL || "https://galaxyhub.rw"} />
          <InfoRow label="Categories" value={categories.count ?? 0} />
          <InfoRow label="Brands" value={brands.count ?? 0} />
          <InfoRow label="Products" value={productCount} />
          <InfoRow label="Active products" value={activeProducts} />
          <InfoRow label="Featured products" value={featuredProducts} />
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-[#1a3352] px-5 py-4">
            <ShoppingBag className="h-4 w-4 text-ocean dark:text-[#8ec5f2]" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Orders workflow</h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-[#1a3352] px-5">
            <InfoRow label="Statuses" value={ORDER_STATUSES.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" · ")} muted />
            <InfoRow label="Pending now" value={pendingOrders} />
            <InfoRow label="Order numbering" value="Automatic (GH prefix)" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-[#1a3352] px-5 py-4">
            <RefreshCw className="h-4 w-4 text-ocean dark:text-[#8ec5f2]" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Trade-Ins workflow</h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-[#1a3352] px-5">
            <InfoRow
              label="Statuses"
              value={TRADE_IN_STATUSES.map((s) => s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ")).join(" · ")}
              muted
            />
            <InfoRow label="Photos per submission" value={MAX_TRADE_IN_PHOTOS} />
            <InfoRow label="Pending review now" value={pendingTradeIns} />
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-[#1a3352] px-5 py-4">
          <Send className="h-4 w-4 text-ocean dark:text-[#8ec5f2]" />
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Telegram notifications</h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-[#1a3352] px-5">
          <div className="flex items-center justify-between gap-4 py-2.5">
            <p className="text-[13px] text-slate-500 dark:text-slate-400">Bot configured</p>
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-800 dark:text-slate-200">
              {telegramConfigured ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-red-500" />
              )}
              {telegramConfigured ? "Yes" : "Not configured"}
            </p>
          </div>
          <InfoRow
            label="Failed deliveries (all time)"
            value={telegramFailureCount}
          />
          <p className="py-2.5 text-xs text-slate-400 dark:text-slate-500">
            New orders and trade-in submissions are delivered to the shop&rsquo;s Telegram channel. Setup lives in the server
            environment — credentials are never shown here.
          </p>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-[#1a3352] px-5 py-4">
          <BellRing className="h-4 w-4 text-ocean dark:text-[#8ec5f2]" />
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Notifications</h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-[#1a3352] px-5">
          <InfoRow label="New messages" value={unreadCount} />
          <InfoRow label="Active reviews" value={`${activeReviews} / ${totalReviews}`} />
          <InfoRow label="Active promotions" value={activePromotions} />
          <InfoRow label="Hero section" value={hero.data && hero.data.length ? `${hero.data.length} slide(s)` : "None"} />
          <div className="py-3">
            <NotificationPreferences />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-[#1a3352] px-5 py-4">
            <Palette className="h-4 w-4 text-ocean dark:text-[#8ec5f2]" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Appearance</h2>
          </div>
          <div className="px-5 py-3">
            <AppearanceSettings />
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-[#1a3352] px-5 py-4">
            <ShieldCheck className="h-4 w-4 text-ocean dark:text-[#8ec5f2]" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Administrator</h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-[#1a3352] px-5">
            <InfoRow label="Account" value={user.email ?? "—"} />
            <InfoRow label="Access" value="Full access" muted />
          </div>
        </Card>
      </div>
    </div>
  );
}