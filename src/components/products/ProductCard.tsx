"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Product } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Heart, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSessionId, notifyCartChanged, useSupabaseCart } from "@/hooks/use-cart";
import { addCartItemBySlug } from "@/actions/cart";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  onReserve?: (product: Product) => void;
  storage?: string;
}

export function ProductCard({ product, onReserve, storage }: ProductCardProps) {
  const [isInCart, setIsInCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const { items, loading: cartLoading, remove: removeFromCart } = useSupabaseCart();

  const getCartItem = () => {
    return items.find(item => 
      item.product?.slug === product.slug && 
      (!storage || item.variant === storage)
    );
  };

  useEffect(() => {
    if (!cartLoading) {
      setIsInCart(!!getCartItem());
    }
  }, [items, cartLoading, product.slug, storage]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    const cartItem = getCartItem();
    
    if (cartItem) {
      await removeFromCart(cartItem.id);
      setIsInCart(false);
      notifyCartChanged();
      return;
    }
    
    if (loading) return;
    setLoading(true);
    await addCartItemBySlug(getSessionId(), product.slug, storage);
    setIsInCart(true);
    setLoading(false);
    notifyCartChanged();
  };

  const formattedPrice   = new Intl.NumberFormat("en-US").format(product.price);
  const formattedMonthly = product.monthlyInstallment
    ? new Intl.NumberFormat("en-US").format(product.monthlyInstallment)
    : null;

  const badgeClass =
    product.badge === "SALE"
      ? "bg-rose-50 text-rose-600 border border-rose-100/60"
      : product.badge === "NEW"
      ? "bg-ocean text-ivory"
      : "bg-white/90 backdrop-blur-sm border border-black/5 text-ocean-deeper";

  const availabilityChip = product.availability === "In Stock"
    ? { label: "In Stock", cls: "bg-emerald-50 text-emerald-700" }
    : product.availability === "Limited Stock"
    ? { label: "Coming Soon", cls: "bg-amber-50 text-amber-700" }
    : null;

  const href = product.externalUrl ?? `/product/${product.slug}`;
  const linkProps = product.externalUrl
    ? { href: product.externalUrl, target: "_blank", rel: "noopener noreferrer" }
    : { href: `/product/${product.slug}` };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-32px" }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-card bg-white border border-ocean/[0.06] shadow-premium transition-all duration-250 hover:shadow-premium-lg hover:border-ocean/[0.12]"
    >
      {/* Image area */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#f8f9fa] p-3">
        {product.badge && (
          <span className={cn(
            "absolute left-2 top-2 z-10 rounded-badge px-2 py-0.5 text-xs font-bold uppercase tracking-widest",
            badgeClass
          )}>
            {product.badge}
          </span>
        )}
        {availabilityChip && !product.badge && (
          <span className={cn(
            "absolute left-2 top-2 z-10 rounded-badge px-2 py-0.5 text-xs font-bold",
            availabilityChip.cls
          )}>
            {availabilityChip.label}
          </span>
        )}

        {/* Wishlist heart icon */}
        <button
          type="button"
          aria-label="Add to wishlist"
          className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm text-ocean/40 opacity-0 transition-all duration-200 hover:bg-white hover:text-ocean group-hover:opacity-100"
        >
          <Heart className="h-4 w-4" />
        </button>

        <Link {...linkProps} className="absolute inset-0 flex items-center justify-center p-2">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.05] mix-blend-multiply"
          />
        </Link>
      </div>

      {/* Content area */}
      <div className="flex flex-1 flex-col px-3.5 pt-3 pb-4">
        {/* Brand */}
        {product.brand && (
          <span className="text-caption font-bold uppercase tracking-[0.12em] text-ocean/50 truncate">
            {product.brand}
          </span>
        )}

        {/* Title */}
        <Link {...linkProps} className="mt-1.5 block">
          <h3 className="font-display text-[1rem] font-bold leading-snug text-ocean-deeper line-clamp-2 hover:text-ocean transition-colors duration-200 group-hover:text-ocean sm:text-[1.15rem] lg:text-[1.25rem]">
            {product.title}
          </h3>
        </Link>

        {/* Rating - below title */}
        <div className="mt-2 flex items-center gap-1.5 shrink-0">
          <div className="flex gap-[2px] text-amber-400">
            {[...Array(4)].map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-current" />
            ))}
            <Star className="h-3 w-3 fill-current opacity-30" />
          </div>
          <span className="text-caption font-semibold text-ocean-deeper/70 tabular-nums">
            {product.rating ?? "4.8"}
          </span>
        </div>

        {/* Tagline / specs - 2 line clamp */}
        {(product.specsSummary || product.tagline) && (
          <p className="mt-1.5 text-caption text-ocean/40 line-clamp-2 leading-relaxed">
            {product.specsSummary ?? product.tagline}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price block */}
        <div className="mt-3">
          {product.priceOnRequest ? (
            <span className="font-display text-body font-bold text-ocean">Contact for Price</span>
          ) : (
            <div>
              <div className="flex items-end gap-2">
                <span className="font-display text-[0.9rem] font-bold text-ocean-deeper leading-none sm:text-[1rem] lg:text-[1.1rem]">
                  {product.currency} {formattedPrice}
                </span>
                {product.originalPrice && (
                  <span className="text-caption text-ocean/30 line-through mb-0.5">
                    {new Intl.NumberFormat("en-US").format(product.originalPrice)}
                  </span>
                )}
              </div>
              {formattedMonthly && (
                <span className="mt-0.5 block text-caption font-bold text-ocean/35 uppercase tracking-wide">
                  From RWF {formattedMonthly}/mo
                </span>
              )}
            </div>
          )}
        </div>

        {/* CTA - single primary action */}
        <div className="mt-3">
          <Button
            variant="primary"
            onClick={handleAddToCart}
            disabled={loading}
            className={cn(
              "w-full justify-center gap-1.5 rounded-btn px-2 py-2.5 text-[10px] sm:text-[11px] lg:text-[12px] font-bold whitespace-nowrap",
              isInCart && "!bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            )}
          >
            {isInCart
              ? <><Trash2 className="h-3.5 w-3.5 shrink-0" /> Remove<span className="hidden sm:inline"> from Cart</span></>
              : <><ShoppingCart className="h-3.5 w-3.5 shrink-0" /> Add to Cart</>
            }
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
