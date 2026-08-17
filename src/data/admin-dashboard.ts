import "server-only";
import { createClient } from "@/lib/supabase-server";

/* ─────────────────────────────────────────────────────────────────────────
   Dashboard data layer — every number is computed from the real database.
   Queries are kept minimal (counts, small projections). No fabricated data.
   ───────────────────────────────────────────────────────────────────────── */

export interface DashboardKpis {
  totalRevenue: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  pendingTradeIns: number;
  unreadMessages: number;
}

export async function getDashboardKpis(): Promise<DashboardKpis> {
  const supabase = createClient();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

  const [products, orders, revenueRes, revenueMonthRes, revenueLastMonthRes, pendingOrdersRes, tradeInsRes, unreadContacts, unreadEnquiries] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("total_amount").neq("status", "cancelled"),
      supabase.from("orders").select("total_amount").neq("status", "cancelled").gte("created_at", monthStart),
      supabase
        .from("orders")
        .select("total_amount")
        .neq("status", "cancelled")
        .gte("created_at", lastMonthStart)
        .lt("created_at", monthStart),
      supabase.from("orders").select("*", { count: "exact", head: true }).in("status", ["pending", "processing"]),
      supabase.from("trade_ins").select("*", { count: "exact", head: true }).in("status", ["pending", "under_review"]),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("product_enquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
    ]);

  const sum = (res: { data: { total_amount: number | null }[] | null }) =>
    (res?.data ?? []).reduce((acc, r) => acc + Number(r?.total_amount ?? 0), 0);

  return {
    totalRevenue: sum(revenueRes),
    revenueThisMonth: sum(revenueMonthRes),
    revenueLastMonth: sum(revenueLastMonthRes),
    totalOrders: orders.count ?? 0,
    pendingOrders: pendingOrdersRes.count ?? 0,
    totalProducts: products.count ?? 0,
    pendingTradeIns: tradeInsRes.count ?? 0,
    unreadMessages: (unreadContacts.count ?? 0) + (unreadEnquiries.count ?? 0),
  };
}

/* ─── Sales series ──────────────────────────────────────────────────────── */

export type SalesPoint = { label: string; revenue: number; orders: number };

const DAY_MS = 86_400_000;

export async function getSalesSeries(days: 7 | 30 | 90 | 365): Promise<SalesPoint[]> {
  const supabase = createClient();
  const since = new Date(Date.now() - days * DAY_MS);

  const { data } = await supabase
    .from("orders")
    .select("created_at, total_amount, status")
    .gte("created_at", since.toISOString());

  const orders = data ?? [];
  const points: SalesPoint[] = [];

  if (days <= 30) {
    for (let i = 0; i < days; i++) {
      const d = new Date(since.getTime() + i * DAY_MS);
      points.push({ label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }), revenue: 0, orders: 0 });
    }
    orders.forEach((o) => {
      if (o.status === "cancelled") return;
      const idx = Math.floor((new Date(o.created_at).getTime() - since.getTime()) / DAY_MS);
      if (idx >= 0 && idx < points.length) {
        points[idx].revenue += Number(o.total_amount ?? 0);
        points[idx].orders += 1;
      }
    });
  } else if (days === 90) {
    for (let w = 0; w < 13; w++) {
      const d = new Date(since.getTime() + w * 7 * DAY_MS);
      points.push({ label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }), revenue: 0, orders: 0 });
    }
    orders.forEach((o) => {
      if (o.status === "cancelled") return;
      const idx = Math.floor((new Date(o.created_at).getTime() - since.getTime()) / (7 * DAY_MS));
      if (idx >= 0 && idx < points.length) {
        points[idx].revenue += Number(o.total_amount ?? 0);
        points[idx].orders += 1;
      }
    });
  } else {
    for (let m = 0; m < 12; m++) {
      const d = new Date(nowMonthStart(days, m));
      points.push({ label: d.toLocaleDateString("en-GB", { month: "short" }), revenue: 0, orders: 0 });
    }
    orders.forEach((o) => {
      if (o.status === "cancelled") return;
      const date = new Date(o.created_at);
      const idx = (date.getFullYear() - since.getFullYear()) * 12 + (date.getMonth() - since.getMonth());
      if (idx >= 0 && idx < points.length) {
        points[idx].revenue += Number(o.total_amount ?? 0);
        points[idx].orders += 1;
      }
    });
  }

  return points;
}

function nowMonthStart(_days: number, _m: number): string {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - (11 - _m));
  return d.toISOString();
}

/* ─── Order status overview ─────────────────────────────────────────────── */

export interface OrderStatusCount {
  status: string;
  count: number;
}

const STATUS_ORDER = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export async function getOrderStatusCounts(): Promise<OrderStatusCount[]> {
  const supabase = createClient();
  const { data } = await supabase.from("orders").select("status");

  const counts: Record<string, number> = {};
  (data ?? []).forEach((o) => {
    counts[o.status] = (counts[o.status] ?? 0) + 1;
  });

  return STATUS_ORDER.map((s) => ({ status: s, count: counts[s] ?? 0 })).filter((c) => c.count > 0);
}

/* ─── Recent orders ─────────────────────────────────────────────────────── */

export interface RecentOrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  items: number;
  total_amount: number;
  status: string;
  created_at: string;
}

export async function getRecentOrderRows(limit = 7): Promise<RecentOrderRow[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("orders")
    .select("id, order_number, customer_name, total_amount, status, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  const orders = data ?? [];
  const ids = orders.map((o) => o.id);
  let itemCounts: Record<string, number> = {};
  if (ids.length > 0) {
    const { data: items } = await supabase
      .from("order_items")
      .select("order_id")
      .in("order_id", ids);
    itemCounts = {};
    (items ?? []).forEach((i) => {
      if (!i.order_id) return;
      itemCounts[i.order_id] = (itemCounts[i.order_id] ?? 0) + 1;
    });
  }

  return orders.map((o) => ({
    id: o.id,
    order_number: o.order_number,
    customer_name: o.customer_name,
    items: itemCounts[o.id] ?? 0,
    total_amount: Number(o.total_amount),
    status: o.status,
    created_at: o.created_at,
  }));
}

/* ─── Product health ────────────────────────────────────────────────────── */

export interface ProductHealth {
  total: number;
  inStock: number;
  limited: number;
  outOfStock: number;
  comingSoon: number;
  inactive: number;
}

export interface ProductAlert {
  id: string;
  name: string;
  slug: string;
  issue: string;
  tone: "red" | "amber" | "blue" | "purple";
  href: string;
}

export async function getProductHealth(): Promise<{ health: ProductHealth; alerts: ProductAlert[] }> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, price, description, main_image_url, stock_status, is_active");

  const rows = data ?? [];
  const health: ProductHealth = {
    total: rows.length,
    inStock: 0,
    limited: 0,
    outOfStock: 0,
    comingSoon: 0,
    inactive: 0,
  };

  const alerts: ProductAlert[] = [];

  rows.forEach((p) => {
    if (p.stock_status === "in_stock") health.inStock += 1;
    else if (p.stock_status === "limited") health.limited += 1;
    else if (p.stock_status === "out_of_stock") health.outOfStock += 1;
    else if (p.stock_status === "coming_soon") health.comingSoon += 1;
    if (!p.is_active) health.inactive += 1;

    if (p.stock_status === "out_of_stock") {
      alerts.push({ id: p.id, name: p.name, slug: p.slug, issue: "Out of stock", tone: "red", href: `/admin/products/${p.id}/edit` });
    } else if (p.stock_status === "limited") {
      alerts.push({ id: p.id, name: p.name, slug: p.slug, issue: "Low stock", tone: "amber", href: `/admin/products/${p.id}/edit` });
    } else if (p.stock_status === "coming_soon") {
      alerts.push({ id: p.id, name: p.name, slug: p.slug, issue: "Coming soon", tone: "purple", href: `/admin/products/${p.id}/edit` });
    } else if (!p.is_active) {
      alerts.push({ id: p.id, name: p.name, slug: p.slug, issue: "Inactive", tone: "blue", href: `/admin/products/${p.id}/edit` });
    } else if (!p.main_image_url) {
      alerts.push({ id: p.id, name: p.name, slug: p.slug, issue: "Missing image", tone: "amber", href: `/admin/products/${p.id}/edit` });
    } else if (p.price == null) {
      alerts.push({ id: p.id, name: p.name, slug: p.slug, issue: "Missing price", tone: "red", href: `/admin/products/${p.id}/edit` });
    } else if (!p.description) {
      alerts.push({ id: p.id, name: p.name, slug: p.slug, issue: "Missing description", tone: "amber", href: `/admin/products/${p.id}/edit` });
    }
  });

  return { health, alerts: alerts.slice(0, 8) };
}

/* ─── Top products (from real order items) ──────────────────────────────── */

export interface TopProduct {
  name: string;
  units: number;
  revenue: number;
}

export async function getTopProducts(limit = 5): Promise<TopProduct[]> {
  const supabase = createClient();
  const { data: items } = await supabase
    .from("order_items")
    .select("product_name, quantity, price");

  const map = new Map<string, { units: number; revenue: number }>();
  (items ?? []).forEach((i) => {
    const cur = map.get(i.product_name) ?? { units: 0, revenue: 0 };
    cur.units += i.quantity;
    cur.revenue += Number(i.price ?? 0) * i.quantity;
    map.set(i.product_name, cur);
  });

  return [...map.entries()]
    .map(([name, v]) => ({ name, units: v.units, revenue: v.revenue }))
    .sort((a, b) => b.units - a.units)
    .slice(0, limit);
}

/* ─── Trade-in overview ─────────────────────────────────────────────────── */

export interface TradeInOverview {
  pending: number;
  underReview: number;
  offerSent: number;
  accepted: number;
  completed: number;
  rejected: number;
  cancelled: number;
}

export async function getTradeInOverview(): Promise<TradeInOverview> {
  const supabase = createClient();
  const { data } = await supabase.from("trade_ins").select("status");

  const counts: TradeInOverview = {
    pending: 0,
    underReview: 0,
    offerSent: 0,
    accepted: 0,
    completed: 0,
    rejected: 0,
    cancelled: 0,
  };
  (data ?? []).forEach((t) => {
    const key = t.status.replace(/_(.)/g, (_m, c: string) => c.toUpperCase()) as keyof TradeInOverview;
    if (key in counts) counts[key] += 1;
  });

  return counts;
}

/* ─── Messages overview ─────────────────────────────────────────────────── */

export interface MessageOverview {
  unread: number;
  recent: {
    id: string;
    type: "contact" | "enquiry";
    name: string;
    subject: string | null;
    status: string;
    created_at: string;
  }[];
}

export async function getMessagesOverview(): Promise<MessageOverview> {
  const supabase = createClient();
  const [contacts, enquiries, unreadContacts, unreadEnquiries] = await Promise.all([
    supabase.from("contact_messages").select("id, name, subject, status, created_at").order("created_at", { ascending: false }).limit(4),
    supabase.from("product_enquiries").select("id, name, product_name, status, created_at").order("created_at", { ascending: false }).limit(4),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("product_enquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
  ]);

  const merged = [
    ...(contacts.data ?? []).map((c) => ({ id: c.id, type: "contact" as const, name: c.name, subject: c.subject, status: c.status, created_at: c.created_at })),
    ...(enquiries.data ?? []).map((e) => ({ id: e.id, type: "enquiry" as const, name: e.name, subject: e.product_name, status: e.status, created_at: e.created_at })),
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  return {
    unread: (unreadContacts.count ?? 0) + (unreadEnquiries.count ?? 0),
    recent: merged,
  };
}

/* ─── Marketing overview ────────────────────────────────────────────────── */

export interface MarketingOverview {
  activePromotions: number;
  endingSoon: { id: string; title: string; ends_at: string | null; daysLeft: number }[];
  heroPublished: boolean;
  heroTitle: string | null;
  pendingReviews: number;
}

export async function getMarketingOverview(): Promise<MarketingOverview> {
  const supabase = createClient();
  const now = new Date();
  const soonIso = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();

  const [promos, heroRes, reviewsRes] = await Promise.all([
    supabase.from("promotions").select("id, title, is_active, ends_at").order("ends_at", { ascending: true }),
    supabase.from("hero_sections").select("id, title, is_active").eq("is_active", true).limit(1),
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("is_active", false),
  ]);

  const promosList = promos.data ?? [];
  const activePromotions = promosList.filter(
    (p) => p.is_active && (!p.ends_at || new Date(p.ends_at) >= now)
  ).length;

  const endingSoon = promosList
    .filter((p) => p.is_active && p.ends_at && new Date(p.ends_at) >= now && new Date(p.ends_at) <= new Date(soonIso))
    .map((p) => ({
      id: p.id,
      title: p.title,
      ends_at: p.ends_at,
      daysLeft: Math.ceil((new Date(p.ends_at!).getTime() - now.getTime()) / 86_400_000),
    }))
    .slice(0, 3);

  return {
    activePromotions,
    endingSoon,
    heroPublished: (heroRes.data?.length ?? 0) > 0,
    heroTitle: heroRes.data?.[0]?.title ?? null,
    pendingReviews: reviewsRes.count ?? 0,
  };
}

/* ─── Reviews overview ──────────────────────────────────────────────────── */

export interface ReviewsOverview {
  average: number;
  total: number;
  active: number;
  recent: { id: string; author: string; rating: number; content: string; created_at: string }[];
}

export async function getReviewsOverview(): Promise<ReviewsOverview> {
  const supabase = createClient();
  const { data } = await supabase
    .from("reviews")
    .select("id, author, rating, content, is_active, created_at")
    .order("created_at", { ascending: false });

  const reviews = data ?? [];
  const active = reviews.filter((r) => r.is_active);
  const average = active.length > 0 ? active.reduce((a, r) => a + r.rating, 0) / active.length : 0;

  return {
    average: Math.round(average * 10) / 10,
    total: reviews.length,
    active: active.length,
    recent: reviews.slice(0, 3).map((r) => ({
      id: r.id,
      author: r.author,
      rating: r.rating,
      content: r.content,
      created_at: r.created_at,
    })),
  };
}

/* ─── Customer activity (derived, no new tables) ───────────────────────── */

export interface CustomerActivity {
  totalCustomers: number;
  newThisMonth: number;
  returning: number;
  newInquiries: number;
}

export async function getCustomerActivity(): Promise<CustomerActivity> {
  const supabase = createClient();
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  const [orders, tradeIns, contacts, enquiries] = await Promise.all([
    supabase.from("orders").select("customer_name, phone, created_at"),
    supabase.from("trade_ins").select("customer_name, phone, created_at"),
    supabase.from("contact_messages").select("name, phone, created_at"),
    supabase.from("product_enquiries").select("name, phone, created_at"),
  ]);

  const seen = new Map<string, string>();
  const firstSeen = new Map<string, string>();

  const add = (name: string, phone: string | null, createdAt: string) => {
    const key = (phone ?? name).toLowerCase().trim();
    if (!key) return;
    seen.set(key, name);
    if (!firstSeen.has(key) || createdAt < firstSeen.get(key)!) firstSeen.set(key, createdAt);
  };

  (orders.data ?? []).forEach((o) => add(o.customer_name, o.phone, o.created_at));
  (tradeIns.data ?? []).forEach((t) => add(t.customer_name, t.phone, t.created_at));
  (contacts.data ?? []).forEach((c) => add(c.name, c.phone, c.created_at));
  (enquiries.data ?? []).forEach((e) => add(e.name, e.phone, e.created_at));

  let newThisMonth = 0;
  seen.forEach((_, key) => {
    const first = firstSeen.get(key);
    if (first && first >= monthStart) newThisMonth += 1;
  });

  return {
    totalCustomers: seen.size,
    newThisMonth,
    returning: Math.max(0, seen.size - newThisMonth),
    newInquiries: (contacts.data?.length ?? 0) + (enquiries.data?.length ?? 0),
  };
}

/* ─── Needs attention (aggregated alerts) ───────────────────────────────── */

export interface AttentionItem {
  label: string;
  detail: string;
  href: string;
  tone: "red" | "amber" | "blue" | "purple";
}

export async function getNeedsAttention(): Promise<AttentionItem[]> {
  const supabase = createClient();
  const now = new Date();
  const nowIso = now.toISOString();
  const threeDaysIso = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();

  const [unreadContacts, unreadEnquiries, pendingTradeIns, stockIssues, endingPromos, telegramFailures] =
    await Promise.all([
      supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("product_enquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("trade_ins").select("*", { count: "exact", head: true }).in("status", ["pending", "under_review"]),
      supabase
        .from("products")
        .select("id, name, stock_status")
        .in("stock_status", ["out_of_stock", "limited"]),
      supabase
        .from("promotions")
        .select("id, title, is_active, ends_at")
        .eq("is_active", true)
        .gte("ends_at", nowIso)
        .lte("ends_at", threeDaysIso)
        .order("ends_at", { ascending: true })
        .limit(5),
      supabase
        .from("trade_ins")
        .select("id, trade_in_id")
        .eq("telegram_sent", false)
        .not("telegram_error", "is", null)
        .limit(3),
    ]);

  const items: AttentionItem[] = [];

  const unreadMessages = (unreadContacts.count ?? 0) + (unreadEnquiries.count ?? 0);
  if (unreadMessages > 0) {
    items.push({
      label: `${unreadMessages} unread message${unreadMessages === 1 ? "" : "s"}`,
      detail: "Customer enquiries awaiting a reply",
      href: "/admin/messages",
      tone: "blue",
    });
  }

  const pendingTI = pendingTradeIns.count ?? 0;
  if (pendingTI > 0) {
    items.push({
      label: `${pendingTI} trade-in${pendingTI === 1 ? "" : "s"} waiting for review`,
      detail: "Device submissions need assessment",
      href: "/admin/trade-ins",
      tone: "amber",
    });
  }

  (stockIssues.data ?? []).forEach((p) => {
    items.push({
      label: p.name,
      detail: p.stock_status === "out_of_stock" ? "Out of stock" : "Low stock",
      href: `/admin/products/${p.id}/edit`,
      tone: p.stock_status === "out_of_stock" ? "red" : "amber",
    });
  });

  (endingPromos.data ?? []).forEach((p) => {
    const days = Math.ceil((new Date(p.ends_at!).getTime() - now.getTime()) / 86_400_000);
    items.push({
      label: p.title,
      detail: days <= 1 ? "Ends tomorrow" : `Ends in ${days} days`,
      href: `/admin/promotions/${p.id}/edit`,
      tone: "purple",
    });
  });

  (telegramFailures.data ?? []).forEach((t) => {
    items.push({
      label: t.trade_in_id,
      detail: "Telegram notification failed",
      href: `/admin/trade-ins/${t.id}`,
      tone: "red",
    });
  });

  return items.slice(0, 8);
}

/* ─── Single aggregated fetch for the dashboard ────────────────────────── */

export interface DashboardData {
  kpis: DashboardKpis;
  orderStatus: OrderStatusCount[];
  recentOrders: RecentOrderRow[];
  productHealth: { health: ProductHealth; alerts: ProductAlert[] };
  topProducts: TopProduct[];
  tradeIns: TradeInOverview;
  messages: MessageOverview;
  marketing: MarketingOverview;
  reviews: ReviewsOverview;
  customerActivity: CustomerActivity;
  attention: AttentionItem[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const [
    kpis,
    orderStatus,
    recentOrders,
    productHealth,
    topProducts,
    tradeIns,
    messages,
    marketing,
    reviews,
    customerActivity,
    attention,
  ] = await Promise.all([
    getDashboardKpis(),
    getOrderStatusCounts(),
    getRecentOrderRows(),
    getProductHealth(),
    getTopProducts(),
    getTradeInOverview(),
    getMessagesOverview(),
    getMarketingOverview(),
    getReviewsOverview(),
    getCustomerActivity(),
    getNeedsAttention(),
  ]);

  return {
    kpis,
    orderStatus,
    recentOrders,
    productHealth,
    topProducts,
    tradeIns,
    messages,
    marketing,
    reviews,
    customerActivity,
    attention,
  };
}