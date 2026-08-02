"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  getOrCreateCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "@/actions/cart";

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

interface CartContextType {
  items: CartLine[];
  loading: boolean;
  count: number;
  subtotal: number;
  refresh: () => Promise<void>;
  remove: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Single shared Supabase cart instance for the whole app.
 *
 * Previously every ProductCard / Navbar / Hero mounted its own cart hook,
 * so a page with 24 products fired 25+ identical `getOrCreateCart`
 * roundtrips and every add/remove triggered a refresh of ALL of them.
 * Now the provider owns the state once and every consumer reads context,
 * keeping add/remove at a single server roundtrip each.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(true);
  const refreshRef = useRef<Promise<void> | null>(null);

  // Collapse concurrent refreshes (e.g. action + change event) into one fetch.
  const refresh = useCallback((): Promise<void> => {
    if (!refreshRef.current) {
      refreshRef.current = (async () => {
        const sid = getSessionId();
        const result = await getOrCreateCart(sid);
        const valid = ((result?.items ?? []).filter((i) => i.product !== null) as CartLine[]);
        setItems(valid);
        setLoading(false);
      })().finally(() => {
        refreshRef.current = null;
      });
    }
    return refreshRef.current;
  }, []);

  // Initial load once per app mount.
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

  // Keep the cart in sync whenever any part of the app mutates it.
  useEffect(() => {
    window.addEventListener(CART_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(CART_CHANGED_EVENT, refresh);
  }, [refresh]);

  const remove = useCallback(
    async (itemId: string) => {
      await removeCartItem(itemId);
      await refresh();
    },
    [refresh],
  );

  const clear = useCallback(async () => {
    await clearCart(getSessionId());
    await refresh();
  }, [refresh]);

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (quantity < 1) return;
      await updateCartItemQuantity(itemId, quantity);
      await refresh();
    },
    [refresh],
  );

  const value = useMemo<CartContextType>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + Number(item.product!.price) * item.quantity, 0);
    return { items, loading, count, subtotal, refresh, remove, clear, updateQuantity };
  }, [items, loading, refresh, remove, clear, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Shared session-based Supabase cart state, backed by the single
 * <CartProvider /> mounted in the root layout. Every consumer (navbar,
 * product cards, hero, cart and order pages) reads the same instance, so a
 * page of 24 cards performs exactly one cart fetch instead of 25+.
 */
export function useSupabaseCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useSupabaseCart must be used within a CartProvider");
  return ctx;
}
