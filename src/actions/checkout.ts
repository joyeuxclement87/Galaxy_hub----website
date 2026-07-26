"use server";

import { createClient } from "@/lib/supabase-server";

export async function submitOrder(formData: {
  customer_name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  session_id: string;
}) {
  const supabase = createClient();

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("session_id", formData.session_id)
    .maybeSingle();

  if (!cart) return { error: "Cart not found" };

  const { data: items } = await supabase
    .from("cart_items")
    .select(`quantity, product:product_id(id, name, price)`)
    .eq("cart_id", cart.id);

  if (!items || items.length === 0) return { error: "Cart is empty" };

  let totalAmount = 0;
  const orderItems = items.map((item: any) => {
    const price = Number(item.product.price);
    const qty = item.quantity;
    totalAmount += price * qty;
    return {
      product_id: item.product.id,
      product_name: item.product.name,
      price,
      quantity: qty,
    };
  });

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: formData.customer_name,
      phone: formData.phone,
      email: formData.email || null,
      address: formData.address || null,
      notes: formData.notes || null,
      total_amount: totalAmount,
      order_number: "",
    })
    .select("id, order_number, total_amount")
    .single();

  if (orderError || !order) return { error: orderError?.message || "Failed to create order" };

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems.map((item: any) => ({ ...item, order_id: order.id })));

  if (itemsError) return { error: itemsError.message };

  await supabase.from("cart_items").delete().eq("cart_id", cart.id);

  return { success: true, order };
}
