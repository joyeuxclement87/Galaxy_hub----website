"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function getOrCreateCart(sessionId: string) {
  const supabase = createClient();

  let { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (!cart) {
    const { data: newCart, error } = await supabase
      .from("carts")
      .insert({ session_id: sessionId })
      .select("id")
      .single();

    if (error || !newCart) return null;
    cart = newCart;
  }

  const { data: items } = await supabase
    .from("cart_items")
    .select(`*, product:product_id(id, name, slug, price, old_price, main_image_url, stock_status, discount_percentage)`)
    .eq("cart_id", cart.id);

  return { id: cart.id, items: items || [] };
}

export async function addCartItem(sessionId: string, productId: string) {
  const supabase = createClient();

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (!cart) return { error: "Cart not found" };

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cart.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + 1 })
      .eq("id", existing.id);

    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("cart_items")
      .insert({ cart_id: cart.id, product_id: productId, quantity: 1 });

    if (error) return { error: error.message };
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const supabase = createClient();

  if (quantity <= 0) {
    const { error } = await supabase.from("cart_items").delete().eq("id", itemId);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", itemId);
    if (error) return { error: error.message };
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function removeCartItem(itemId: string) {
  const supabase = createClient();

  const { error } = await supabase.from("cart_items").delete().eq("id", itemId);
  if (error) return { error: error.message };

  revalidatePath("/cart");
  return { success: true };
}

export async function clearCart(sessionId: string) {
  const supabase = createClient();

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (cart) {
    await supabase.from("cart_items").delete().eq("cart_id", cart.id);
  }

  revalidatePath("/cart");
  return { success: true };
}
