"use client";

import { useCallback, useEffect, useState } from "react";
import { getOrCreateCart, updateCartItemQuantity, removeCartItem, clearCart } from "@/actions/cart";

export interface CartLine {
  id: string;
  quantity: number;
  variant: string | null;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    old_price: number | null;
    main_image_url: string | null;
    stock_status: string;
    discount_percentage: number | null;
    storage_options: unknown;
  } | null;
}

export function getSessionId() {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem("gh-session");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("gh-session", sid);
  }
  return sid;
}

export const CART_CHANGED_EVENT = "gh:cart-changed";

export function notifyCartChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CART_CHANGED_EVENT));
}

/**
 * Shared session-based Supabase cart state used by the navbar (dropdown +
 * badge), cart page and order page. Keeps the whole site on one cart.
 */
export function useSupabaseCart() {
  const [items, setItems] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const sid = getSessionId();
    const result = await getOrCreateCart(sid);
    const valid = ((result?.items ?? []).filter((i) => i.product !== null) as CartLine[]);
    setItems(valid);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const sid = getSessionId();
      const result = await getOrCreateCart(sid);
      const valid = ((result?.items ?? []).filter((i) => i.product !== null) as CartLine[]);
      if (!cancelled) {
        setItems(valid);
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onCartChanged = () => { refresh(); };
    window.addEventListener(CART_CHANGED_EVENT, onCartChanged);
    return () => window.removeEventListener(CART_CHANGED_EVENT, onCartChanged);
  }, [refresh]);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + Number(item.product!.price) * item.quantity, 0);

  const remove = useCallback(
    async (itemId: string) => {
      await removeCartItem(itemId);
      await refresh();
      notifyCartChanged();
    },
    [refresh]
  );

  const clear = useCallback(async () => {
    await clearCart(getSessionId());
    await refresh();
    notifyCartChanged();
  }, [refresh]);

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (quantity < 1) return;
      await updateCartItemQuantity(itemId, quantity);
      await refresh();
      notifyCartChanged();
    },
    [refresh]
  );

  return { items, loading, count, subtotal, refresh, remove, clear, updateQuantity };
}
