"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft, PackageOpen } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { CartSkeleton } from "@/components/ui/LoadingSkeleton";
import { getOrCreateCart, updateCartItemQuantity, removeCartItem, clearCart } from "@/actions/cart";

function getSessionId() {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem("gh-session");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("gh-session", sid);
  }
  return sid;
}

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string; name: string; slug: string; price: number;
    old_price: number | null; main_image_url: string | null;
    stock_status: string; discount_percentage: number | null;
  } | null;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState("");

  const loadCart = useCallback(async () => {
    const sid = getSessionId();
    setSessionId(sid);
    const result = await getOrCreateCart(sid);
    if (result) setItems(result.items as CartItem[]);
    setLoading(false);
  }, []);

  useEffect(() => { loadCart(); }, [loadCart]);

  const handleQuantity = async (itemId: string, qty: number) => {
    if (qty < 1) return;
    await updateCartItemQuantity(itemId, qty);
    await loadCart();
  };

  const handleRemove = async (itemId: string) => {
    await removeCartItem(itemId);
    await loadCart();
  };

  const handleClear = async () => {
    await clearCart(sessionId);
    await loadCart();
  };

  const validItems = items.filter((i) => i.product);
  const subtotal = validItems.reduce((sum, i) => sum + Number(i.product!.price) * i.quantity, 0);
  const formatPrice = (v: number) => new Intl.NumberFormat("en-US").format(v);

  if (loading) {
    return (
      <div className="flex-1 pt-20 lg:pt-28">
        <Navbar />
        <main className="mx-auto max-w-[1320px] px-6 py-12 md:px-12">
          <CartSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 pt-20 lg:pt-28 min-h-screen bg-ivory">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-6 py-12 md:px-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="mb-4 inline-flex items-center gap-2 text-sm text-ocean/50 hover:text-ocean transition-colors">
              <ArrowLeft className="h-4 w-4" /> Continue Shopping
            </Link>
            <h1 className="font-clash text-3xl font-bold text-ocean-deeper mt-2">Shopping Cart</h1>
            <p className="text-sm text-ocean/50 mt-1">{validItems.length} {validItems.length === 1 ? "item" : "items"}</p>
          </div>
          {validItems.length > 0 && (
            <button onClick={handleClear} className="text-sm text-red-400 hover:text-red-500 transition-colors cursor-pointer">
              Clear Cart
            </button>
          )}
        </div>

        {validItems.length === 0 ? (
          <EmptyState
            icon={PackageOpen}
            title="Your cart is empty"
            description="Browse our collection and add items you'd like to order."
            action={
              <Link href="/products">
                <Button variant="primary" className="gap-2">
                  <ShoppingBag className="h-4 w-4" /> Browse Products
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
            <div className="space-y-4">
              {validItems.map((item) => {
                const p = item.product!;
                const discount = p.old_price ? Math.round((1 - Number(p.price) / Number(p.old_price)) * 100) : 0;
                return (
                  <div key={item.id} className="flex gap-4 rounded-2xl border border-ocean/8 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                    <Link href={`/product/${p.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-ivory-dark/40">
                      {p.main_image_url ? (
                        <img src={p.main_image_url} alt={p.name} className="h-full w-full object-contain p-2" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-ocean/15"><ShoppingBag className="h-8 w-8" /></div>
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link href={`/product/${p.slug}`} className="font-clash text-base font-bold text-ocean-deeper hover:text-ocean transition-colors">{p.name}</Link>
                          <p className="mt-0.5 text-xs text-ocean/45 capitalize">{p.stock_status.replace("_", " ")}</p>
                        </div>
                        <button onClick={() => handleRemove(item.id)} className="shrink-0 p-1 text-ocean/25 hover:text-red-500 transition-colors cursor-pointer" aria-label="Remove item">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="flex h-8 w-8 items-center justify-center rounded-xl border border-ocean/8 bg-white text-ocean/50 hover:bg-ivory-dark/30 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" aria-label="Decrease quantity">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-ocean-deeper">{item.quantity}</span>
                          <button onClick={() => handleQuantity(item.id, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center rounded-xl border border-ocean/8 bg-white text-ocean/50 hover:bg-ivory-dark/30 transition-colors cursor-pointer" aria-label="Increase quantity">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="font-clash text-lg font-bold text-ocean-deeper">RWF {formatPrice(Number(p.price) * item.quantity)}</span>
                          {discount > 0 && <p className="text-[10px] text-ocean/35">RWF {formatPrice(Number(p.price))} each</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-ocean/8 bg-white p-6 shadow-sm">
                <h3 className="font-clash text-lg font-bold text-ocean-deeper mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-ocean/60">
                    <span>Subtotal ({validItems.length} {validItems.length === 1 ? "item" : "items"})</span>
                    <span className="font-semibold text-ocean-deeper">RWF {formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-ocean/60">
                    <span>Delivery</span>
                    <span className="text-ocean/40">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-ocean/5 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-ocean-deeper">Estimated Total</span>
                      <span className="font-clash text-xl font-bold text-ocean">RWF {formatPrice(subtotal)}</span>
                    </div>
                  </div>
                </div>
                <Link href="/checkout">
                  <Button variant="primary" className="mt-6 w-full gap-2">
                    <ShoppingBag className="h-4 w-4" /> Proceed to Checkout
                  </Button>
                </Link>
                <p className="mt-3 text-center text-[10px] text-ocean/35">No payment required now. Pay on pickup or delivery.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
