"use client";

import Link from "next/link";
import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft, PackageOpen } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import Footer from "@/components/ui/Footer";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { CartSkeleton } from "@/components/ui/LoadingSkeleton";
import { useSupabaseCart } from "@/hooks/use-cart";

export default function CartPage() {
  const cart = useSupabaseCart();

  const validItems = cart.items.filter((i) => i.product);
  const formatPrice = (v: number) => new Intl.NumberFormat("en-US").format(v);

  if (cart.loading) {
    return (
      <div className="flex-1 pt-24 min-h-screen bg-ivory">
        <Navbar />
        <main className="mx-auto max-w-[1320px] px-4 sm:px-6 py-8 md:px-12">
          <CartSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex-1 pt-24 min-h-screen bg-ivory">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-4 sm:px-6 py-8 md:px-12">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <Link href="/" className="mb-3 inline-flex items-center gap-1.5 text-xs sm:text-sm text-ocean/50 hover:text-ocean transition-colors">
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Continue Shopping
            </Link>
            <h1 className="font-clash text-2xl sm:text-3xl font-bold text-ocean-deeper mt-1">Shopping Cart</h1>
            <p className="text-xs sm:text-sm text-ocean/50 mt-1">{cart.count} {cart.count === 1 ? "item" : "items"}</p>
          </div>
          {validItems.length > 0 && (
            <Button variant="ghost" onClick={() => cart.clear()} className="text-xs sm:text-sm text-red-400 hover:text-red-500 hover:!bg-transparent self-start sm:self-auto">
              Clear Cart
            </Button>
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
          <div className="grid grid-cols-1 gap-6 lg:gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-3 sm:space-y-4">
              {validItems.map((item) => {
                const p = item.product!;
                const discount = p.old_price ? Math.round((1 - Number(p.price) / Number(p.old_price)) * 100) : 0;
                return (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-3 sm:gap-4 rounded-2xl border border-ocean/8 bg-white p-3 sm:p-4 shadow-sm transition-all hover:shadow-md">
                    <Link href={`/product/${p.slug}`} className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-ivory-dark/40 flex-shrink-0">
                      {p.main_image_url ? (
                        <img src={p.main_image_url} alt={p.name} className="h-full w-full object-contain p-2" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-ocean/15"><ShoppingBag className="h-7 w-7 sm:h-8 sm:w-8" /></div>
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link href={`/product/${p.slug}`} className="font-clash text-sm sm:text-base font-bold text-ocean-deeper hover:text-ocean transition-colors truncate block">{p.name}</Link>
                          {item.variant && (
                            <span className="ml-1.5 inline-flex items-center rounded-full bg-ocean/[0.08] px-1.5 py-0.5 text-[9px] sm:text-caption font-bold text-ocean align-middle mt-1">
                              {item.variant}
                            </span>
                          )}
                          <p className="mt-0.5 text-caption sm:text-xs text-ocean/45 capitalize">{p.stock_status.replace("_", " ")}</p>
                        </div>
                        <Button variant="icon" onClick={() => cart.remove(item.id)} className="h-8 w-8 text-ocean/25 hover:text-red-500 flex-shrink-0" aria-label="Remove item">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-3 pt-3 border-t border-ocean/5">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <button onClick={() => cart.updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-btn border border-ocean/10 bg-white text-ocean/50 hover:bg-ocean/4 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" aria-label="Decrease quantity">
                            <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                          <span className="w-8 sm:w-10 text-center text-sm sm:text-base font-semibold text-ocean-deeper">{item.quantity}</span>
                          <button onClick={() => cart.updateQuantity(item.id, item.quantity + 1)} className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-btn border border-ocean/10 bg-white text-ocean/50 hover:bg-ocean/4 transition-colors cursor-pointer" aria-label="Increase quantity">
                            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                        <div className="text-right sm:text-right w-full sm:w-auto">
                          <span className="font-clash text-base sm:text-lg font-bold text-ocean-deeper">RWF {formatPrice(Number(p.price) * item.quantity)}</span>
                          {discount > 0 && <p className="text-[9px] sm:text-caption text-ocean/35 mt-0.5">RWF {formatPrice(Number(p.price))} each</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-ocean/8 bg-white p-4 sm:p-6 shadow-sm">
                <h3 className="font-clash text-base sm:text-lg font-bold text-ocean-deeper mb-3 sm:mb-4">Order Summary</h3>
                <div className="space-y-2.5 sm:space-y-3 text-sm sm:text-base">
                  <div className="flex items-center justify-between text-ocean/60">
                    <span>Subtotal ({validItems.length} {validItems.length === 1 ? "item" : "items"})</span>
                    <span className="font-semibold text-ocean-deeper">RWF {formatPrice(cart.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-ocean/60">
                    <span>Delivery</span>
                    <span className="text-ocean/40">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-ocean/5 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-ocean-deeper">Estimated Total</span>
                      <span className="font-clash text-xl sm:text-2xl font-bold text-ocean">RWF {formatPrice(cart.subtotal)}</span>
                    </div>
                  </div>
                </div>
                <Link href="/order">
                <Button variant="primary" className="mt-4 sm:mt-6 w-full gap-2 justify-center h-11 sm:h-12 text-sm sm:text-base">
                  <ShoppingBag className="h-4 w-4" /> Proceed to Checkout
                </Button>
                </Link>
                <p className="mt-3 text-center text-[9px] sm:text-caption text-ocean/35">No payment required now. Pay on pickup or delivery.</p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
