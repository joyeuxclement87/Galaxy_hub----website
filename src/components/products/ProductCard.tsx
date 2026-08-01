"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, ArrowRight } from "lucide-react";
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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInCart) return;
    await addCartItemBySlug(getSessionId(), product.slug);
    setIsInCart(true);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col overflow-hidden rounded-card bg-white border border-ocean/[0.06] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-premium hover:border-ocean/[0.12]"
    >
      {/* Image area */}
      <div className="relative aspect-square w-full overflow-hidden bg-ivory-dark/30 flex items-center justify-center p-5">
        {product.badge && (
          <span className={cn(
            "absolute left-4 top-4 z-10 rounded-btn px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-widest",
            badgeClass
          )}>
            {product.badge}
          </span>
        )}

        {product.externalUrl ? (
          <a href={product.externalUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center p-8">
            <img
              src={product.image}
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 mix-blend-multiply"
            />
          </a>
        ) : (
          <Link href={`/product/${product.slug}`} className="absolute inset-0 flex items-center justify-center p-8">
            <img
              src={product.image}
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 mix-blend-multiply"
            />
          </Link>
        )}
      </div>

      {/* Content area */}
      <div className="flex flex-1 flex-col p-5">
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="flex items-center gap-[2px] text-amber-400">
            {[...Array(4)].map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-current" />
            ))}
            <Star className="h-3 w-3 fill-current opacity-40" />
          </div>
          <span className="text-[10px] font-semibold text-ocean-deeper">{product.rating ?? "4.8"}</span>
          <span className="text-[10px] text-ocean/35">({product.reviewCount ?? 32})</span>
        </div>

        {/* Title */}
        {product.externalUrl ? (
          <a href={product.externalUrl} target="_blank" rel="noopener noreferrer">
            <h3 className="font-display text-[15px] font-bold leading-snug text-ocean-deeper line-clamp-1">
              {product.title}
            </h3>
          </a>
        ) : (
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-display text-[15px] font-bold leading-snug text-ocean-deeper line-clamp-1 hover:text-ocean transition-colors duration-200">
              {product.title}
            </h3>
          </Link>
        )}

        {/* Specs summary */}
        <p className="mt-1 text-[11px] text-ocean/45 line-clamp-1">
          {product.specsSummary ?? product.tagline}
        </p>

        {/* Price */}
        <div className="mt-auto pt-4 border-t border-ocean/[0.05]">
          {product.priceOnRequest ? (
            <span className="font-display text-sm font-bold text-ocean">Contact for Price</span>
          ) : (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-end gap-2">
                <span className="font-display text-lg font-bold text-ocean-deeper">
                  {product.currency} {formattedPrice}
                </span>
                {product.originalPrice && (
                  <span className="text-[10px] text-ocean/30 line-through mb-0.5">
                    {new Intl.NumberFormat("en-US").format(product.originalPrice)}
                  </span>
                )}
              </div>
              {formattedMonthly && (
                <span className="text-[9px] font-bold text-ocean/35 uppercase tracking-wide">
                  From RWF {formattedMonthly}/mo
                </span>
              )}
            </div>
          )}
        </div>

        {/* Add to Cart button */}
        <div className="mt-4">
          <Button
            variant="primary"
            onClick={handleAddToCart}
            className={cn(
              "w-full justify-center gap-2 rounded-btn px-4 py-2.5 text-xs",
              isInCart && "!bg-gradient-to-b from-emerald-600 to-emerald-700"
            )}
          >
            <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
            {isInCart ? "Added" : "Add to Cart"}
          </Button>
        </div>

        {/* View Details link */}
        {product.externalUrl ? (
          <a href={product.externalUrl} target="_blank" rel="noopener noreferrer" className="mt-3 hidden items-center justify-center gap-1.5 text-[10px] font-semibold text-ocean/40 hover:text-ocean transition-colors duration-200 md:flex">
            View Details <ArrowRight className="h-3 w-3" />
          </a>
        ) : (
          <Link href={`/product/${product.slug}`} className="mt-3 hidden items-center justify-center gap-1.5 text-[10px] font-semibold text-ocean/40 hover:text-ocean transition-colors duration-200 md:flex">
            View Details <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}
