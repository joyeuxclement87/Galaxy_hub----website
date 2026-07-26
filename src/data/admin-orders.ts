import "server-only";
import { createClient } from "@/lib/supabase-server";
import type { Database } from "@/types/database";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];

export type OrderListItem = OrderRow;

export interface OrderWithItems extends OrderRow {
  items: OrderItemRow[];
}

export async function getOrders() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as OrderListItem[];
}

export async function getOrderById(id: string) {
  const supabase = createClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !order) return null;

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id)
    .order("created_at");

  return {
    ...order,
    items: items ?? [],
  } as OrderWithItems;
}
