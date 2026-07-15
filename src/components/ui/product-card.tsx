"use client";

import React from "react";
import { motion } from "framer-motion";
import { Product } from "@/data/mock-data";
import { Button } from "./button";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onReserve: (product: Product) => void;
}

const AVAILABILITY_STYLES: Record<string, string> = {
  "In Stock": "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Limited Stock": "bg-amber-50 text-amber-700 border-amber-100",
  "Out of Stock": "bg-black/5 text-ocean/50 border-black/5",
};

export function ProductCard({ product, onReserve }: ProductCardProps) {
  const availability = product.availability ?? "In Stock";
  const formattedPrice = new Intl.NumberFormat("en-US").format(product.price);
  const isAvailable = availability !== "Out of Stock";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6 }}
      className="group flex flex-col overflow-hidden rounded-[24px] border border-black/8 bg-white shadow-[0_10px_28px_rgba(16,35,61,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(16,35,61,0.14)]"
    >
      {/* Product image — ~65% of the card */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[radial-gradient(circle,rgba(11,84,151,0.06)_0%,transparent_70%)]">
        <span className="absolute left-4 top-4 z-10 rounded-full border border-black/8 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ocean shadow-sm">
          {product.category}
        </span>

        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="font-clash text-base font-bold leading-snug text-[#10233D]">
            {product.title}
          </h3>
          <span
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.06em]",
              AVAILABILITY_STYLES[availability]
            )}
          >
            {availability}
          </span>
        </div>

        <p className="mb-4 line-clamp-1 text-sm text-ocean/65">{product.tagline}</p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-ocean/8 pt-4">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.1em] text-ocean/45">Price</span>
            {product.priceOnRequest ? (
              <span className="font-space text-sm font-bold text-ocean">Contact for Price</span>
            ) : (
              <span className="whitespace-nowrap font-space text-base font-bold text-ocean">
                {product.currency} {formattedPrice}
              </span>
            )}
          </div>

          <Button
            variant="primary"
            onClick={() => onReserve(product)}
            disabled={!isAvailable}
            className="gap-1.5 rounded-btn px-4 py-2.5 text-xs shadow-sm"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Order Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
