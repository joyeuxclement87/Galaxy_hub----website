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

  const now = new Date().toISOString();

  const [products, categories, brands, promotions, pendingOrders, totalOrders] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("brands").select("*", { count: "exact", head: true }),
      supabase
        .from("promotions")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true)
        .lte("starts_at", now)
        .gte("ends_at", now),
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase.from("orders").select("*", { count: "exact", head: true }),
    ]);

  return {
    totalProducts: products.count ?? 0,
    totalCategories: categories.count ?? 0,
    totalBrands: brands.count ?? 0,
    activePromotions: promotions.count ?? 0,
    pendingOrders: pendingOrders.count ?? 0,
    totalOrders: totalOrders.count ?? 0,
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

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  recentProducts: RecentProduct[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const [statsResult, ordersResult, productsResult] = await Promise.allSettled([
    getDashboardStats(),
    getRecentOrders(),
    getRecentProducts(),
  ]);

  const empty: DashboardData = {
    stats: {
      totalProducts: 0,
      totalCategories: 0,
      totalBrands: 0,
      activePromotions: 0,
      pendingOrders: 0,
      totalOrders: 0,
    },
    recentOrders: [],
    recentProducts: [],
  };

  return {
    stats: statsResult.status === "fulfilled" ? statsResult.value : empty.stats,
    recentOrders:
      ordersResult.status === "fulfilled" ? ordersResult.value : empty.recentOrders,
    recentProducts:
      productsResult.status === "fulfilled" ? productsResult.value : empty.recentProducts,
  };
}
