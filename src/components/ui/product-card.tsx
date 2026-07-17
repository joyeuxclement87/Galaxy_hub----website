"use client";

import React from "react";
import { motion } from "framer-motion";
import { Product } from "@/data/mock-data";
import { Button } from "./button";
import { ShoppingBag, Heart, Star, ShoppingCart, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  onReserve: (product: Product) => void;
}

export function ProductCard({ product, onReserve }: ProductCardProps) {
  const { wishlist, toggleWishlist, cart, addToCart } = useApp();
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
      ? "bg-ocean text-ivory border border-ocean"
      : "bg-white border border-black/5 text-[#10233D]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-ocean/15 hover:-translate-y-1"
    >
      {/* ── Product Image ───────────────────────────────────────────────── */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F7F8FA] flex items-center justify-center p-6">

        {/* Badge */}
        {product.badge && (
          <span className={cn(
            "absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-widest shadow-sm",
            badgeClass
          )}>
            {product.badge}
          </span>
        )}

        {/* Wishlist button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={cn(
            "absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border bg-white/90 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer",
            isWishlisted
              ? "border-rose-100 text-rose-500 bg-rose-50/95"
              : "border-black/6 text-ocean/45 hover:text-ocean hover:bg-white"
          )}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-all duration-200",
              isWishlisted ? "fill-rose-500 text-rose-500" : ""
            )}
          />
        </button>

        {/* Product image */}
        {product.externalUrl ? (
          <a
            href={product.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center p-8"
          >
            <img
              src={product.image}
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 mix-blend-multiply"
            />
          </a>
        ) : (
          <Link
            href={`/product/${product.slug}`}
            className="absolute inset-0 flex items-center justify-center p-8"
          >
            <img
              src={product.image}
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 mix-blend-multiply"
            />
          </Link>
        )}
      </div>

      {/* ── Product Info ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Rating row */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-0.5 text-amber-400">
            {[...Array(4)].map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-current" />
            ))}
            <Star className="h-3 w-3 fill-current opacity-40" />
          </div>
          <span className="text-[11px] font-semibold text-[#10233D]">{product.rating ?? "4.8"}</span>
          <span className="text-[11px] text-ocean/40 font-manrope">({product.reviewCount ?? 32})</span>
        </div>

        {/* Title + tagline */}
        {product.externalUrl ? (
          <a href={product.externalUrl} target="_blank" rel="noopener noreferrer">
            <h3 className="font-clash text-base font-bold leading-snug text-[#10233D] line-clamp-1 sm:text-[17px]">
              {product.title}
            </h3>
          </a>
        ) : (
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-clash text-base font-bold leading-snug text-[#10233D] line-clamp-1 sm:text-[17px] hover:text-ocean transition-colors">
              {product.title}
            </h3>
          </Link>
        )}

        <p className="mt-0.5 text-[11px] text-ocean/50 font-manrope line-clamp-1">
          {product.specsSummary ?? product.tagline}
        </p>

        {/* Price block */}
        <div className="mt-3 border-t border-black/5 pt-3">
          {product.priceOnRequest ? (
            <span className="font-clash text-sm font-bold text-ocean">Contact for Price</span>
          ) : (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-end gap-2">
                <span className="font-clash text-lg font-bold text-[#10233D] sm:text-xl">
                  {product.currency} {formattedPrice}
                </span>
                {product.originalPrice && (
                  <span className="text-[11px] text-ocean/35 line-through mb-0.5">
                    {new Intl.NumberFormat("en-US").format(product.originalPrice)}
                  </span>
                )}
              </div>
              {formattedMonthly && (
                <span className="text-[10px] font-bold text-ocean/45 uppercase tracking-wide font-manrope">
                  From RWF {formattedMonthly}/mo
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Action buttons — always visible on mobile, overlay on desktop ── */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              if (!isInCart) addToCart(product.id);
            }}
            className={cn(
              "gap-1.5 rounded-xl text-[11px] font-bold w-full",
              isInCart
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "border-black/8 text-[#10233D] hover:bg-black/4"
            )}
          >
            <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
            {isInCart ? "Added" : "Add to Cart"}
          </Button>

          <Button
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              onReserve(product);
            }}
            className="gap-1.5 rounded-xl text-[11px] font-bold bg-ocean hover:bg-ocean-dark w-full shadow-sm"
          >
            <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
            Order Now
          </Button>
        </div>

        {/* Desktop "View Details" link */}
        {product.externalUrl ? (
          <a
            href={product.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 hidden items-center gap-1 text-[11px] font-semibold text-ocean/60 hover:text-ocean transition-colors md:flex"
          >
            View Details <ArrowRight className="h-3 w-3" />
          </a>
        ) : (
          <Link
            href={`/product/${product.slug}`}
            className="mt-3 hidden items-center gap-1 text-[11px] font-semibold text-ocean/60 hover:text-ocean transition-colors md:flex"
          >
            View Details <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}
