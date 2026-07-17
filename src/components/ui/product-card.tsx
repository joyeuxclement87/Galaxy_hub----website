"use client";

import React from "react";
import { motion } from "framer-motion";
import { Product } from "@/data/mock-data";
import { Button } from "./button";
import { ShoppingBag, Heart, Star, ShoppingCart } from "lucide-react";
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
  const isInCart = cart.includes(product.id);
  
  const formattedPrice = new Intl.NumberFormat("en-US").format(product.price);
  const formattedMonthly = product.monthlyInstallment 
    ? new Intl.NumberFormat("en-US").format(product.monthlyInstallment) 
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6 }}
      className="group relative flex flex-col overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-black/10"
    >
      {/* Quick View Overlay (Desktop Only) */}
      <div className="absolute inset-x-0 bottom-0 z-20 hidden md:flex flex-col bg-white/95 p-6 backdrop-blur-md transform translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 border-t border-black/5 shadow-2xl">
        <h4 className="font-clash text-lg font-bold text-[#10233D]">{product.title}</h4>
        <p className="text-sm text-ocean/70 font-manrope mt-1">{product.specsSummary || product.tagline}</p>
        
        <div className="mt-4 space-y-2 text-xs font-semibold text-[#10233D] font-manrope">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500">●</span> {product.availability || "In Stock"}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-accent">✓</span> 1 Year Warranty
          </div>
          <div className="flex items-center gap-2">
            <span className="text-accent">✓</span> Kigali Delivery
          </div>
        </div>

        <Link href={`/product/${product.slug}`} className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-ocean hover:text-accent transition-colors">
          View Full Details <span className="text-lg leading-none">→</span>
        </Link>
      </div>

      {/* Product Image Area */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F8F9FA] flex items-center justify-center p-8">
        {/* Badge */}
        {product.badge && (
          <span className={cn(
            "absolute left-5 top-5 z-10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm",
            product.badge === "SALE" ? "bg-rose-50 text-rose-600 border border-rose-100" :
            product.badge === "NEW" ? "bg-ocean text-white" :
            "bg-white border border-black/5 text-[#10233D]"
          )}>
            {product.badge}
          </span>
        )}

        {/* Wishlist Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={cn(
            "absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-white/80 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer",
            isWishlisted
              ? "border-rose-100 text-rose-500 bg-rose-50/90"
              : "border-black/5 text-ocean/50 hover:text-ocean hover:bg-white"
          )}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-all duration-300",
              isWishlisted ? "fill-rose-500 text-rose-500 scale-110" : ""
            )}
          />
        </button>

        {product.externalUrl ? (
          <a href={product.externalUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-0 flex items-center justify-center p-12">
            <img
              src={product.image}
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 mix-blend-multiply"
            />
          </a>
        ) : (
          <Link href={`/product/${product.slug}`} className="absolute inset-0 z-0 flex items-center justify-center p-12">
            <img
              src={product.image}
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 mix-blend-multiply"
            />
          </Link>
        )}
      </div>

      {/* Product Content Area */}
      <div className="flex flex-1 flex-col p-5 md:p-6 bg-white relative z-10">
        {/* Rating / Title / Summary block - wrapped by external link or internal Link */}
        {product.externalUrl ? (
          <a href={product.externalUrl} target="_blank" rel="noopener noreferrer" className="group-hover:opacity-0 transition-opacity duration-300 md:group-hover:invisible">
            <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center text-amber-400">
              <Star className="h-3.5 w-3.5 fill-current" />
              <Star className="h-3.5 w-3.5 fill-current" />
              <Star className="h-3.5 w-3.5 fill-current" />
              <Star className="h-3.5 w-3.5 fill-current" />
              <Star className="h-3.5 w-3.5 fill-current opacity-50" />
            </div>
            <span className="text-[11px] font-semibold text-[#10233D]">{product.rating || "4.8"}</span>
            <span className="text-[11px] text-ocean/40 font-manrope">({product.reviewCount || 32} reviews)</span>
          </div>
            <h3 className="font-clash text-lg font-bold leading-snug text-[#10233D] line-clamp-1">
              {product.title}
            </h3>

            <p className="mt-1 text-xs text-ocean/50 font-manrope line-clamp-1">
              {product.specsSummary || product.tagline}
            </p>

            <div className="mt-4 pt-4 border-t border-black/5">
              {product.priceOnRequest ? (
                <span className="font-space text-lg font-bold text-ocean">Contact for Price</span>
              ) : (
                <div className="flex flex-col">
                  <div className="flex items-end gap-2 mb-0.5">
                    <span className="font-space text-xl font-bold text-[#10233D]">
                      {product.currency} {formattedPrice}
                    </span>
                    {product.originalPrice && (
                      <span className="font-space text-xs text-ocean/40 line-through mb-1">
                        {new Intl.NumberFormat("en-US").format(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {formattedMonthly && (
                    <span className="text-[10px] font-bold text-ocean/50 uppercase tracking-wide">
                      From RWF {formattedMonthly}/month
                    </span>
                  )}
                </div>
              )}
            </div>
          </a>
        ) : (
          <Link href={`/product/${product.slug}`} className="group-hover:opacity-0 transition-opacity duration-300 md:group-hover:invisible">
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="flex items-center text-amber-400">
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current opacity-50" />
              </div>
              <span className="text-[11px] font-semibold text-[#10233D]">{product.rating || "4.8"}</span>
              <span className="text-[11px] text-ocean/40 font-manrope">({product.reviewCount || 32} reviews)</span>
            </div>

            <h3 className="font-clash text-lg font-bold leading-snug text-[#10233D] line-clamp-1">
              {product.title}
            </h3>

            <p className="mt-1 text-xs text-ocean/50 font-manrope line-clamp-1">
              {product.specsSummary || product.tagline}
            </p>

            <div className="mt-4 pt-4 border-t border-black/5">
              {product.priceOnRequest ? (
                <span className="font-space text-lg font-bold text-ocean">Contact for Price</span>
              ) : (
                <div className="flex flex-col">
                  <div className="flex items-end gap-2 mb-0.5">
                    <span className="font-space text-xl font-bold text-[#10233D]">
                      {product.currency} {formattedPrice}
                    </span>
                    {product.originalPrice && (
                      <span className="font-space text-xs text-ocean/40 line-through mb-1">
                        {new Intl.NumberFormat("en-US").format(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {formattedMonthly && (
                    <span className="text-[10px] font-bold text-ocean/50 uppercase tracking-wide">
                      From RWF {formattedMonthly}/month
                    </span>
                  )}
                </div>
              )}
            </div>
          </Link>
        )}

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-2 opacity-100 md:opacity-0 md:absolute md:bottom-6 md:left-6 md:right-6 md:translate-y-4 md:transition-all md:duration-300 md:group-hover:opacity-100 md:group-hover:translate-y-0 z-30">
          <Button
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              if (isInCart) {
                 // optionally handle remove from cart, but let's just use it as add
              } else {
                 addToCart(product.id);
              }
            }}
            className={cn(
              "gap-2 rounded-xl text-xs font-semibold w-full",
              isInCart ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300" : "border-black/10 text-[#10233D] hover:bg-black/5"
            )}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {isInCart ? "Added" : "Add to Cart"}
          </Button>
          
          <Button
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              onReserve(product);
            }}
            className="gap-2 rounded-xl text-xs font-semibold bg-ocean hover:bg-ocean-dark w-full shadow-sm"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Order Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
