import "server-only";
import { createClient } from "@/lib/supabase-server";
import type { AdminNotification } from "@/components/admin/NotificationBell";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export interface AdminSummary {
  badges: {
    unreadMessages: number;
    pendingOrders: number;
    pendingTradeIns: number;
  };
  notifications: AdminNotification[];
}

export async function getAdminSummary(): Promise<AdminSummary> {
  const supabase = createClient();
  const now = new Date();
  const nowIso = now.toISOString();
  const soonIso = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();

  const [
    unreadContacts,
    unreadEnquiries,
    pendingOrdersCount,
    pendingTradeInsCount,
    recentOrders,
    recentTradeIns,
    productAlerts,
    endingPromos,
    telegramFailures,
  ] = await Promise.all([
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("product_enquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("orders").select("*", { count: "exact", head: true }).in("status", ["pending", "processing"]),
    supabase.from("trade_ins").select("*", { count: "exact", head: true }).in("status", ["pending", "under_review"]),
    supabase
      .from("orders")
      .select("id, order_number, customer_name, status, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("trade_ins")
      .select("id, trade_in_id, customer_name, wanted_product_name, status, created_at")
      .in("status", ["pending", "under_review"])
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("products")
      .select("id, name, slug, stock_status")
      .in("stock_status", ["out_of_stock", "limited"])
      .order("updated_at", { ascending: false })
      .limit(5),
    supabase
      .from("promotions")
      .select("id, title, is_active, ends_at")
      .eq("is_active", true)
      .gte("ends_at", nowIso)
      .lte("ends_at", soonIso)
      .order("ends_at", { ascending: true })
      .limit(3),
    supabase
      .from("trade_ins")
      .select("id, trade_in_id, customer_name, created_at")
      .eq("telegram_sent", false)
      .not("telegram_error", "is", null)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const unreadMessages = (unreadContacts.count ?? 0) + (unreadEnquiries.count ?? 0);
  const notifications: AdminNotification[] = [];

  (recentOrders.data ?? []).forEach((o) => {
    notifications.push({
      id: `order-${o.id}`,
      kind: "order",
      title: `New order #${o.order_number}`,
      detail: `${o.customer_name} · ${o.status}`,
      href: `/admin/orders/${o.id}`,
      tone: "blue",
      time: timeAgo(o.created_at),
    });
  });

  (recentTradeIns.data ?? []).forEach((t) => {
    notifications.push({
      id: `tradein-${t.id}`,
      kind: "trade-in",
      title: `${t.trade_in_id} awaiting review`,
      detail: `${t.customer_name} · ${t.wanted_product_name}`,
      href: `/admin/trade-ins/${t.id}`,
      tone: "amber",
      time: timeAgo(t.created_at),
    });
  });

  (productAlerts.data ?? []).forEach((p) => {
    notifications.push({
      id: `product-${p.id}`,
      kind: "product",
      title: p.stock_status === "out_of_stock" ? `${p.name} is out of stock` : `${p.name} is low on stock`,
      detail: p.stock_status === "out_of_stock" ? "No units available" : "Limited units remaining",
      href: `/admin/products/${p.id}/edit`,
      tone: "red",
      time: "now",
    });
  });

  (endingPromos.data ?? []).forEach((promo) => {
    const days = Math.ceil((new Date(promo.ends_at!).getTime() - now.getTime()) / 86400000);
    notifications.push({
      id: `promo-${promo.id}`,
      kind: "promotion",
      title: `${promo.title} ends ${days <= 1 ? "tomorrow" : `in ${days} days`}`,
      detail: "Expiring promotion",
      href: `/admin/promotions/${promo.id}/edit`,
      tone: "amber",
      time: "now",
    });
  });

  (telegramFailures.data ?? []).forEach((t) => {
    notifications.push({
      id: `telegram-${t.id}`,
      kind: "telegram",
      title: `Telegram alert failed for ${t.trade_in_id}`,
      detail: "Staff was not notified of this trade-in",
      href: `/admin/trade-ins/${t.id}`,
      tone: "red",
      time: timeAgo(t.created_at),
    });
  });

  return {
    badges: {
      unreadMessages,
      pendingOrders: pendingOrdersCount.count ?? 0,
      pendingTradeIns: pendingTradeInsCount.count ?? 0,
    },
    notifications,
  };
}