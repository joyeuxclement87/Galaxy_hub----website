"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Product } from "@/data/mock-data";
import { Star, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { BLUR_PLACEHOLDER } from "@/lib/image";
import { getSessionId, notifyCartChanged, useSupabaseCart } from "@/hooks/use-cart";
import { addCartItemBySlug } from "@/actions/cart";
import { getProductStatus } from "@/lib/product-status";
import { EASE, MOTION, REVEAL_VIEWPORT } from "@/lib/motion";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  onReserve?: (product: Product) => void;
  storage?: string;
  /** Stagger delay for grouped grid entrances (see gridStaggerDelay) */
  delay?: number;
}

export function ProductCard({ product, storage, delay = 0 }: ProductCardProps) {
  const [isInCart, setIsInCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
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

  const formattedPrice = new Intl.NumberFormat("en-US").format(product.price);
  const formattedMonthly = product.monthlyInstallment
    ? new Intl.NumberFormat("en-US").format(product.monthlyInstallment)
    : null;

  /* ── Status — shared with hero and everywhere else ── */
  const status = getProductStatus(product);

  const linkProps = product.externalUrl
    ? { href: product.externalUrl, target: "_blank", rel: "noopener noreferrer" }
    : { href: `/product/${product.slug}` };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: MOTION.reveal, delay, ease: EASE }}
      className="group relative flex flex-col overflow-hidden rounded-[22px] bg-white border border-ocean/[0.05] shadow-[0_1px_2px_rgba(11,84,151,0.04),0_4px_12px_rgba(11,84,151,0.04)] transition-shadow duration-[250ms] hover:border-ocean/[0.12] hover:shadow-[0_8px_24px_rgba(11,84,151,0.08)]"
    >
      {/* Image area — status label only */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#f6f7f8] p-3">
        {status && (
          <span className={cn(
            "absolute left-2.5 top-2.5 z-10 inline-flex items-center rounded-[9px] border px-[9px] py-1 text-[11px] font-semibold tracking-[0.05em]",
            status.className
          )}>
            {status.label.toUpperCase()}
          </span>
        )}

        <Link {...linkProps} className="absolute inset-0 z-0 flex items-center justify-center p-2">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
            onLoad={() => setImageLoaded(true)}
            className={cn(
              "h-full w-full object-contain mix-blend-multiply group-hover:scale-[1.02]",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            style={{ transition: "opacity 400ms ease, transform 300ms ease" }}
          />
        </Link>
      </div>

      {/* Content area */}
      <div className="flex flex-1 flex-col px-4 pt-3.5 pb-4">
        {/* Brand */}
        {product.brand && (
          <span className="truncate text-[11px] font-bold uppercase tracking-[0.14em] text-ocean/45">
            {product.brand}
          </span>
        )}

        {/* Title */}
        <Link {...linkProps} className="mt-1.5 block">
          <h3 className="font-display text-[1rem] font-bold leading-[1.3] text-ocean-deeper line-clamp-2 hover:text-ocean transition-colors duration-200 group-hover:text-ocean sm:text-[1.0625rem]">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex gap-[2px] text-amber-400">
            {[...Array(4)].map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-current" />
            ))}
            <Star className="h-3 w-3 fill-current opacity-30" />
          </div>
          <span className="text-[12px] font-semibold text-ocean-deeper/60 tabular-nums">
            {product.rating ?? "4.8"}
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price block */}
        <div className="mt-3.5">
          {product.priceOnRequest ? (
            <span className="font-display text-[15px] font-bold text-ocean">Contact for Price</span>
          ) : (
            <div>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="font-display text-[1.125rem] font-bold leading-none text-ocean-deeper">
                  {product.currency} {formattedPrice}
                </span>
                {product.originalPrice && (
                  <span className="text-[12px] font-medium text-ocean/30 line-through">
                    {product.currency} {new Intl.NumberFormat("en-US").format(product.originalPrice)}
                  </span>
                )}
              </div>
              {formattedMonthly && (
                <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.08em] text-ocean/35">
                  From {product.currency} {formattedMonthly}/mo
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action — compact, subtle; solid emerald when added */}
        <div className="mt-3.5">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={loading}
            className={cn(
              "inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-[10px] px-4 text-[14px] font-semibold transition-all duration-[200ms] touch-manipulation select-none",
              isInCart
                ? "border border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-700"
                : "border border-ocean/[0.14] bg-transparent text-ocean-deeper hover:border-ocean hover:bg-ocean hover:text-white",
              loading && "opacity-60"
            )}
          >
            {loading ? (
              "Adding…"
            ) : isInCart ? (
              <>
                <Check className="h-4 w-4 shrink-0" />
                Added
              </>
            ) : (
              <>
                <Plus className="h-[17px] w-[17px] shrink-0" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}