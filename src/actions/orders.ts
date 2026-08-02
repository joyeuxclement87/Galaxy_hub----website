"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { sendNotification } from "@/lib/notifications";
import { revalidatePath } from "next/cache";
import { ORDER_STATUSES } from "@/lib/order-statuses";

/**
 * Updates an order's status, records the change in
 * order_status_changes and pings the staff Telegram group.
 * Staff notification is best-effort: the status update itself is
 * the source of truth and is never rolled back on notify failure.
 */
export async function updateOrderStatus(id: string, status: string) {
  if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
    return { error: `Invalid status: "${status}"` };
  }

  const supabase = await createAdminClient();

  const { data: existing } = await supabase
    .from("orders")
    .select("id, order_number, status")
    .eq("id", id)
    .maybeSingle();

  if (!existing) return { error: "Order not found" };
  if (existing.status === status) return { success: true };

  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) return { error: error.message };

  const { error: historyError } = await supabase.from("order_status_changes").insert({
    order_id: id,
    previous_status: existing.status,
    new_status: status,
  });
  if (historyError) {
    console.error("[orders] Failed to record status change:", historyError);
  }

  await sendNotification({
    topic: "order-status",
    data: {
      order: { id, order_number: existing.order_number, total_amount: 0 },
      status: { previous: existing.status, next: status },
    },
  });

  revalidatePath("/admin/orders");
  return { success: true };
}

/**
 * Permanently deletes an order. Items and status-change history
 * are removed via on-delete cascade.
 */
export async function deleteOrder(id: string) {
  const supabase = await createAdminClient();

  const { data: existing } = await supabase
    .from("orders")
    .select("id, order_number")
    .eq("id", id)
    .maybeSingle();

  if (!existing) return { error: "Order not found" };

  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/orders");
  return { success: true, order_number: existing.order_number };
}

export async function deleteOrders(ids: string[]) {
  const supabase = await createAdminClient();

  const { error } = await supabase.from("orders").delete().in("id", ids);
  if (error) return { error: error.message };

  revalidatePath("/admin/orders");
  return { success: true };
}
