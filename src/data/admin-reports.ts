import "server-only";
import { createClient } from "@/lib/supabase-server";

export interface SalesReportRow {
  order_number: string;
  customer_name: string;
  phone: string | null;
  items: number;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface ProductReportRow {
  name: string;
  category: string | null;
  brand: string | null;
  price: number;
  stock_status: string;
  is_active: boolean;
  is_new: boolean;
}

export interface TradeInReportRow {
  trade_in_id: string;
  customer_name: string;
  phone: string;
  wanted_product_name: string;
  trade_device: string;
  status: string;
  estimated_value: number | null;
  final_value: number | null;
  created_at: string;
}

export interface PromotionReportRow {
  title: string;
  discount_percentage: number | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
}

export async function getSalesReport(from: string, to: string): Promise<SalesReportRow[]> {
  const supabase = createClient();
  let query = supabase
    .from("orders")
    .select("id, order_number, customer_name, phone, total_amount, status, created_at")
    .order("created_at", { ascending: false });
  if (from) query = query.gte("created_at", new Date(from).toISOString());
  if (to) query = query.lte("created_at", new Date(new Date(to).getTime() + 86_400_000).toISOString());

  const { data } = await query;
  const orders = data ?? [];
  const ids = orders.map((o) => o.id);
  const itemCounts: Record<string, number> = {};
  if (ids.length > 0) {
    const { data: items } = await supabase.from("order_items").select("order_id").in("order_id", ids);
    (items ?? []).forEach((i) => {
      if (!i.order_id) return;
      itemCounts[i.order_id] = (itemCounts[i.order_id] ?? 0) + 1;
    });
  }

  return orders.map((o) => ({
    order_number: o.order_number,
    customer_name: o.customer_name,
    phone: o.phone,
    items: itemCounts[o.id] ?? 0,
    total_amount: Number(o.total_amount ?? 0),
    status: o.status,
    created_at: o.created_at,
  }));
}

export async function getProductReport(): Promise<ProductReportRow[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(`name, price, stock_status, is_active, is_new, category:category_id(name), brand:brand_id(name)`)
    .order("name");

  return (data ?? []).map((p) => ({
    name: p.name,
    category: (p as { category: { name: string } | null }).category?.name ?? null,
    brand: (p as { brand: { name: string } | null }).brand?.name ?? null,
    price: Number(p.price),
    stock_status: p.stock_status,
    is_active: p.is_active,
    is_new: p.is_new,
  }));
}

export async function getTradeInReport(from: string, to: string): Promise<TradeInReportRow[]> {
  const supabase = createClient();
  let query = supabase
    .from("trade_ins")
    .select("trade_in_id, customer_name, phone, wanted_product_name, trade_device_brand, trade_device_model, status, estimated_value, final_value, created_at")
    .order("created_at", { ascending: false });
  if (from) query = query.gte("created_at", new Date(from).toISOString());
  if (to) query = query.lte("created_at", new Date(new Date(to).getTime() + 86_400_000).toISOString());

  const { data } = await query;

  return (data ?? []).map((t) => ({
    trade_in_id: t.trade_in_id,
    customer_name: t.customer_name,
    phone: t.phone,
    wanted_product_name: t.wanted_product_name,
    trade_device: `${t.trade_device_brand} ${t.trade_device_model}`.trim(),
    status: t.status,
    estimated_value: t.estimated_value,
    final_value: t.final_value,
    created_at: t.created_at,
  }));
}

export async function getPromotionReport(): Promise<PromotionReportRow[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("promotions")
    .select("title, discount_percentage, starts_at, ends_at, is_active")
    .order("created_at", { ascending: false });

  return data ?? [];
}