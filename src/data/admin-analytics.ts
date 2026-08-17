import "server-only";
import { createClient } from "@/lib/supabase-server";

export interface AnalyticsSummary {
  revenue: number;
  orders: number;
  averageOrderValue: number;
  tradeIns: number;
  activePromotions: number;
  topProducts: { name: string; units: number; revenue: number }[];
  topCategories: { name: string | null; units: number; revenue: number }[];
  orderStatus: { status: string; count: number }[];
  tradeInVolume: { label: string; count: number }[];
  promotionState: { active: number; scheduled: number; expired: number; draft: number };
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const supabase = createClient();
  const now = new Date();

  const [ordersRes, itemsRes, tradeInsRes, promosRes] = await Promise.all([
    supabase.from("orders").select("id, status, total_amount"),
    supabase
      .from("order_items")
      .select("product_name, quantity, price, product:product_id(category:category_id(name))"),
    supabase.from("trade_ins").select("created_at, status"),
    supabase.from("promotions").select("is_active, starts_at, ends_at"),
  ]);

  const orders = ordersRes.data ?? [];
  const validOrders = orders.filter((o) => o.status !== "cancelled");
  const revenue = validOrders.reduce((a, o) => a + Number(o.total_amount ?? 0), 0);

  const productMap = new Map<string, { units: number; revenue: number }>();
  const categoryMap = new Map<string | null, { units: number; revenue: number }>();
  (itemsRes.data ?? []).forEach((i) => {
    const p = productMap.get(i.product_name) ?? { units: 0, revenue: 0 };
    p.units += i.quantity;
    p.revenue += Number(i.price ?? 0) * i.quantity;
    productMap.set(i.product_name, p);

    const cat = (i.product as { category: { name: string } | null } | null)?.category?.name ?? null;
    const c = categoryMap.get(cat) ?? { units: 0, revenue: 0 };
    c.units += i.quantity;
    c.revenue += Number(i.price ?? 0) * i.quantity;
    categoryMap.set(cat, c);
  });

  const statusCounts: Record<string, number> = {};
  orders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
  });
  const STATUS_ORDER = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
  const orderStatus = STATUS_ORDER.map((s) => ({ status: s, count: statusCounts[s] ?? 0 })).filter((c) => c.count > 0);

  const tradeInVolume: { label: string; count: number }[] = [];
  const tradeIns = tradeInsRes.data ?? [];
  for (let m = 5; m >= 0; m--) {
    const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const label = d.toLocaleDateString("en-GB", { month: "short" });
    const count = tradeIns.filter((t) => {
      const td = new Date(t.created_at);
      return td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth();
    }).length;
    tradeInVolume.push({ label, count });
  }

  const promos = promosRes.data ?? [];
  let active = 0;
  let scheduled = 0;
  let expired = 0;
  let draft = 0;
  promos.forEach((p) => {
    const started = !p.starts_at || new Date(p.starts_at) <= now;
    const notEnded = !p.ends_at || new Date(p.ends_at) >= now;
    if (!p.is_active) {
      draft += 1;
    } else if (!started) {
      scheduled += 1;
    } else if (!notEnded) {
      expired += 1;
    } else {
      active += 1;
    }
  });

  return {
    revenue,
    orders: validOrders.length,
    averageOrderValue: validOrders.length > 0 ? revenue / validOrders.length : 0,
    tradeIns: tradeIns.length,
    activePromotions: active,
    topProducts: [...productMap.entries()]
      .map(([name, v]) => ({ name, units: v.units, revenue: v.revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8),
    topCategories: [...categoryMap.entries()]
      .map(([name, v]) => ({ name, units: v.units, revenue: v.revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8),
    orderStatus,
    tradeInVolume,
    promotionState: { active, scheduled, expired, draft },
  };
}