"use client";

import React from "react";
import { motion } from "framer-motion";
import { Product } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, Star, ShoppingCart, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  onReserve: (product: Product) => void;
}

export function ProductCard({ product, onReserve }: ProductCardProps) {
  const { wishlist, toggleWishlist, cart, addToCart, removeFromCart } = useApp();
  const isWishlisted = wishlist.includes(product.id);
  const isInCart     = cart.includes(product.id);

  const formattedPrice   = new Intl.NumberFormat("en-US").format(product.price);
  const formattedMonthly = product.monthlyInstallment
    ? new Intl.NumberFormat("en-US").format(product.monthlyInstallment)
    : null;

  const badgeClass =
    product.badge === "SALE"
      ? "bg-rose-50 text-rose-600 border border-rose-100"
      : product.badge === "NEW"
      ? "bg-ocean text-ivory"
      : "bg-white border border-black/5 text-ocean-deeper";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-[4px] hover:shadow-lg hover:shadow-ocean/5"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-ivory-dark/40 flex items-center justify-center p-4">
        {product.badge && (
          <span className={cn(
            "absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-widest shadow-sm",
            badgeClass
          )}>
            {product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
          className={cn(
            "absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-white/80 shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer",
            isWishlisted
              ? "border-rose-100 text-rose-500 bg-rose-50/95"
              : "border-black/[0.04] text-ocean/40 hover:text-ocean hover:bg-white"
          )}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("h-3.5 w-3.5 transition-all duration-200", isWishlisted ? "fill-rose-500 text-rose-500" : "")} />
        </button>

        {product.externalUrl ? (
          <a href={product.externalUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center p-6">
            <img
              src={product.image}
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 mix-blend-multiply"
            />
          </a>
        ) : (
          <Link href={`/product/${product.slug}`} className="absolute inset-0 flex items-center justify-center p-6">
            <img
              src={product.image}
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 mix-blend-multiply"
            />
          </Link>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-[1px] text-amber-400">
            {[...Array(4)].map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-current" />
            ))}
            <Star className="h-3 w-3 fill-current opacity-40" />
          </div>
          <span className="text-[10px] font-semibold text-ocean-deeper">{product.rating ?? "4.8"}</span>
          <span className="text-[10px] text-ocean/35 font-manrope">({product.reviewCount ?? 32})</span>
        </div>

        {product.externalUrl ? (
          <a href={product.externalUrl} target="_blank" rel="noopener noreferrer">
            <h3 className="font-clash text-[15px] font-bold leading-snug text-ocean-deeper line-clamp-1">
              {product.title}
            </h3>
          </a>
        ) : (
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-clash text-[15px] font-bold leading-snug text-ocean-deeper line-clamp-1 hover:text-ocean transition-colors">
              {product.title}
            </h3>
          </Link>
        )}

        <p className="mt-[2px] text-[11px] text-ocean/45 font-manrope line-clamp-1">
          {product.specsSummary ?? product.tagline}
        </p>

        <div className="mt-auto pt-3 border-t border-black/[0.04]">
          {product.priceOnRequest ? (
            <span className="font-clash text-sm font-bold text-ocean">Contact for Price</span>
          ) : (
            <div className="flex flex-col gap-[2px]">
              <div className="flex items-end gap-2">
                <span className="font-clash text-lg font-bold text-ocean-deeper">
                  {product.currency} {formattedPrice}
                </span>
                {product.originalPrice && (
                  <span className="text-[10px] text-ocean/30 line-through mb-0.5">
                    {new Intl.NumberFormat("en-US").format(product.originalPrice)}
                  </span>
                )}
              </div>
              {formattedMonthly && (
                <span className="text-[9px] font-bold text-ocean/35 uppercase tracking-wide font-manrope">
                  From RWF {formattedMonthly}/mo
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-3">
          <Button
            variant="primary"
            onClick={(e) => { e.preventDefault(); if (isInCart) { removeFromCart(product.id); } else { addToCart(product.id); } }}
            className={cn(
              "w-full justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[11px] font-semibold",
              isInCart
                ? "bg-gradient-to-b from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                : "bg-gradient-to-b from-ocean to-ocean-dark hover:from-ocean-dark hover:to-ocean"
            )}
          >
            <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
            {isInCart ? "Added" : "Add to Cart"}
          </Button>
        </div>

        {product.externalUrl ? (
          <a href={product.externalUrl} target="_blank" rel="noopener noreferrer" className="mt-2 hidden items-center gap-1 text-[10px] font-semibold text-ocean/45 hover:text-ocean transition-colors md:flex">
            View Details <ArrowRight className="h-3 w-3" />
          </a>
        ) : (
          <Link href={`/product/${product.slug}`} className="mt-2 hidden items-center gap-1 text-[10px] font-semibold text-ocean/45 hover:text-ocean transition-colors md:flex">
            View Details <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}
