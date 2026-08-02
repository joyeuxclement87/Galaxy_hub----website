"use server";

import { createClient } from "@/lib/supabase-server";
import { sendNotification } from "@/lib/notifications";

export async function submitOrder(formData: {
  customer_name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  session_id: string;
  directProduct?: {
    productId: string;
    variant?: string | null;
    quantity?: number;
  } | null;
}) {
  const supabase = createClient();

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("session_id", formData.session_id)
    .maybeSingle();

  const { data: items } = cart
    ? await supabase
        .from("cart_items")
        .select(`quantity, variant, product:product_id(id, name, price)`)
        .eq("cart_id", cart.id)
    : { data: null };

  const cartLines = items ?? [];

  let directLine: { product_id: string; product_name: string; price: number; quantity: number; variant: string | null } | null = null;

  if (formData.directProduct) {
    const { data: product } = await supabase
      .from("products")
      .select("id, name, price")
      .eq("id", formData.directProduct.productId)
      .maybeSingle();

    if (product) {
      directLine = {
        product_id: product.id,
        product_name: product.name,
        price: Number(product.price),
        quantity: formData.directProduct.quantity ?? 1,
        variant: formData.directProduct.variant || null,
      };
    }
  }

  if (cartLines.length === 0 && !directLine) return { error: "Cart is empty" };

  let totalAmount = 0;
  const orderItems = cartLines.map((item: any) => {
    const price = Number(item.product.price);
    const qty = item.quantity;
    totalAmount += price * qty;
    return {
      product_id: item.product.id,
      product_name: item.product.name,
      price,
      quantity: qty,
      variant: item.variant || null,
    };
  });

  if (directLine) {
    totalAmount += directLine.price * directLine.quantity;
    orderItems.push(directLine);
  }

  const { data: orderNumber, error: numberError } = await supabase.rpc("next_order_number");
  if (numberError || !orderNumber) {
    console.error("[checkout] Failed to generate order number:", numberError);
    return { error: "Failed to generate order number" };
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: formData.customer_name,
      phone: formData.phone,
      email: formData.email || null,
      address: formData.address || null,
      notes: formData.notes || null,
      total_amount: totalAmount,
      order_number: orderNumber,
    })
    .select("id, order_number, total_amount")
    .single();

  if (orderError || !order) return { error: orderError?.message || "Failed to create order" };

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems.map((item: any) => ({ ...item, order_id: order.id })));

  if (itemsError) return { error: itemsError.message };

  if (cart) {
    await supabase.from("cart_items").delete().eq("cart_id", cart.id);
  }

  // Best-effort staff notification — never interrupts checkout.
  await sendNotification({
    topic: "order",
    data: {
      order: {
        id: order.id,
        order_number: order.order_number,
        total_amount: totalAmount,
      },
      customer: {
        name: formData.customer_name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        notes: formData.notes,
      },
      items: orderItems,
    },
  });

  return { success: true, order };
}
