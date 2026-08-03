import "server-only";
import { createClient } from "@/lib/supabase-server";
import type { Database } from "@/types/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalBrands: number;
  activePromotions: number;
  pendingOrders: number;
  totalOrders: number;
  totalRevenue: number;
  revenueThisMonth: number;
  unreadMessages: number;
}

export interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  status: string;
  total_amount: number;
  created_at: string;
}

export interface RecentProduct {
  id: string;
  name: string;
  main_image_url: string | null;
  category_name: string | null;
  price: number;
  created_at: string;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const nowIso = now.toISOString();

  const [products, categories, brands, promotions, pendingOrders, totalOrders, revenue, revenueMonth, newContacts, newEnquiries] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("brands").select("*", { count: "exact", head: true }),
      supabase
        .from("promotions")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true)
        .lte("starts_at", nowIso)
        .gte("ends_at", nowIso),
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("total_amount").neq("status", "cancelled"),
      supabase.from("orders").select("total_amount").neq("status", "cancelled").gte("created_at", monthStart),
      supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("status", "new"),
      supabase
        .from("product_enquiries")
        .select("*", { count: "exact", head: true })
        .eq("status", "new"),
    ]);

  const sumRevenue = (res: { data: { total_amount: number | null }[] | null }) =>
    (res?.data || []).reduce((sum, r) => sum + Number(r?.total_amount ?? 0), 0);

  return {
    totalProducts: products.count ?? 0,
    totalCategories: categories.count ?? 0,
    totalBrands: brands.count ?? 0,
    activePromotions: promotions.count ?? 0,
    pendingOrders: pendingOrders.count ?? 0,
    totalOrders: totalOrders.count ?? 0,
    totalRevenue: sumRevenue(revenue),
    revenueThisMonth: sumRevenue(revenueMonth),
    unreadMessages: (newContacts.count ?? 0) + (newEnquiries.count ?? 0),
  };
}

export async function getRecentOrders(limit = 5): Promise<RecentOrder[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, customer_name, status, total_amount, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data;
}

export async function getRecentProducts(limit = 5): Promise<RecentProduct[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id, name, main_image_url, price, created_at,
      category:category_id(name)
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return (data as unknown as (ProductRow & { category: { name: string } | null })[]).map(
    (p) => ({
      id: p.id,
      name: p.name,
      main_image_url: p.main_image_url,
      category_name: p.category?.name ?? null,
      price: Number(p.price),
      created_at: p.created_at,
    })
  );
}

export interface RecentMessage {
  id: string;
  type: "contact" | "enquiry";
  name: string;
  subject: string | null;
  message: string | null;
  product_name: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

export async function getRecentMessages(limit = 6): Promise<RecentMessage[]> {
  const supabase = createClient();

  const [contacts, enquiries] = await Promise.all([
    supabase
      .from("contact_messages")
      .select("id, name, subject, message, status, created_at")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("product_enquiries")
      .select("id, name, product_name, notes, status, created_at")
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  const merged: RecentMessage[] = [
    ...(contacts.data || []).map((c) => ({
      id: c.id,
      type: "contact" as const,
      name: c.name,
      subject: c.subject,
      message: c.message,
      product_name: null,
      notes: null,
      status: c.status,
      created_at: c.created_at,
    })),
    ...(enquiries.data || []).map((e) => ({
      id: e.id,
      type: "enquiry" as const,
      name: e.name,
      subject: null,
      message: null,
      product_name: e.product_name,
      notes: e.notes,
      status: e.status,
      created_at: e.created_at,
    })),
  ];

  return merged
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  recentProducts: RecentProduct[];
  recentMessages: RecentMessage[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const [statsResult, ordersResult, productsResult, messagesResult] = await Promise.allSettled([
    getDashboardStats(),
    getRecentOrders(),
    getRecentProducts(),
    getRecentMessages(),
  ]);

  const empty: DashboardData = {
    stats: {
      totalProducts: 0,
      totalCategories: 0,
      totalBrands: 0,
      activePromotions: 0,
      pendingOrders: 0,
      totalOrders: 0,
      totalRevenue: 0,
      revenueThisMonth: 0,
      unreadMessages: 0,
    },
    recentOrders: [],
    recentProducts: [],
    recentMessages: [],
  };

  return {
    stats: statsResult.status === "fulfilled" ? statsResult.value : empty.stats,
    recentOrders:
      ordersResult.status === "fulfilled" ? ordersResult.value : empty.recentOrders,
    recentProducts:
      productsResult.status === "fulfilled" ? productsResult.value : empty.recentProducts,
    recentMessages:
      messagesResult.status === "fulfilled" ? messagesResult.value : empty.recentMessages,
  };
}
