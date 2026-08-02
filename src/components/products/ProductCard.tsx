"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSessionId, notifyCartChanged } from "@/hooks/use-cart";
import { addCartItemBySlug } from "@/actions/cart";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  onReserve?: (product: Product) => void;
}

export function ProductCard({ product, onReserve }: ProductCardProps) {
  const [isInCart, setIsInCart] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInCart || loading) return;
    setLoading(true);
    await addCartItemBySlug(getSessionId(), product.slug);
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
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-card bg-white border border-ocean/[0.06] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-premium hover:border-ocean/[0.12]"
    >
      {/* Image area */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#f8f9fa] flex items-center justify-center p-5">
        {product.badge && (
          <span className={cn(
            "absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest",
            badgeClass
          )}>
            {product.badge}
          </span>
        )}
        {availabilityChip && !product.badge && (
          <span className={cn(
            "absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[9px] font-bold",
            availabilityChip.cls
          )}>
            {availabilityChip.label}
          </span>
        )}

        <Link {...linkProps} className="absolute inset-0 flex items-center justify-center p-7">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.06] mix-blend-multiply"
          />
        </Link>
      </div>

      {/* Content area */}
      <div className="flex flex-1 flex-col px-4 pt-3.5 pb-4">

        {/* Brand + Rating row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          {product.brand ? (
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ocean/50 truncate">
              {product.brand}
            </span>
          ) : <span />}
          <div className="flex items-center gap-1 shrink-0">
            <div className="flex gap-[2px] text-amber-400">
              {[...Array(4)].map((_, i) => (
                <Star key={i} className="h-2.5 w-2.5 fill-current" />
              ))}
              <Star className="h-2.5 w-2.5 fill-current opacity-30" />
            </div>
            <span className="text-[10px] font-semibold text-ocean-deeper/70 tabular-nums">
              {product.rating ?? "4.8"}
            </span>
          </div>
        </div>

        {/* Title */}
        <Link {...linkProps}>
          <h3 className="font-display text-[14px] font-bold leading-snug text-ocean-deeper line-clamp-2 hover:text-ocean transition-colors duration-200 group-hover:text-ocean">
            {product.title}
          </h3>
        </Link>

        {/* Tagline / specs */}
        {(product.specsSummary || product.tagline) && (
          <p className="mt-1 text-[11px] text-ocean/40 line-clamp-1 leading-relaxed">
            {product.specsSummary ?? product.tagline}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price block */}
        <div className="mt-3 pt-3 border-t border-ocean/[0.05]">
          {product.priceOnRequest ? (
            <span className="font-display text-sm font-bold text-ocean">Contact for Price</span>
          ) : (
            <div>
              <div className="flex items-end gap-2">
                <span className="font-display text-[17px] font-bold text-ocean-deeper leading-none">
                  {product.currency} {formattedPrice}
                </span>
                {product.originalPrice && (
                  <span className="text-[10px] text-ocean/30 line-through mb-0.5">
                    {new Intl.NumberFormat("en-US").format(product.originalPrice)}
                  </span>
                )}
              </div>
              {formattedMonthly && (
                <span className="mt-0.5 block text-[9px] font-bold text-ocean/35 uppercase tracking-wide">
                  From RWF {formattedMonthly}/mo
                </span>
              )}
            </div>
          )}
        </div>

        {/* CTA row */}
        <div className="mt-3 flex items-center gap-2">
          <Button
            variant="primary"
            onClick={handleAddToCart}
            className={cn(
              "flex-1 justify-center gap-1.5 rounded-btn px-3 py-2.5 text-[11px] min-h-0",
              isInCart && "!bg-gradient-to-b from-emerald-600 to-emerald-700"
            )}
          >
            {isInCart
              ? <><Check className="h-3 w-3 shrink-0" /> Added</>
              : <><ShoppingCart className="h-3 w-3 shrink-0" /> Add to Cart</>
            }
          </Button>
          <Link
            {...linkProps}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn border border-ocean/10 bg-white text-ocean/50 transition-all duration-200 hover:border-ocean/30 hover:text-ocean hover:shadow-sm"
            aria-label="View product details"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
