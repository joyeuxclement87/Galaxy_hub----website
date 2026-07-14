"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/data/mock-data";
import { Button } from "./button";
import { Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onReserve: (product: Product) => void;
}

export function ProductCard({ product, onReserve }: ProductCardProps) {
  // Format price beautifully in Space Grotesk
  const formattedPrice = new Intl.NumberFormat("en-US").format(product.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6 }}
      className="group relative flex flex-col justify-between bg-white/50 border border-black/5 rounded-card p-6 shadow-premium hover:shadow-[0_30px_70px_rgba(11,84,151,0.12)] transition-all duration-500 overflow-hidden"
    >
      <div>
        {/* Floating Appearance Image Container */}
        <div className="relative w-full h-64 flex items-center justify-center mb-6 overflow-hidden rounded-img bg-radial from-ocean/5 to-transparent">
          <div className="absolute inset-0 bg-radial from-white/40 to-transparent pointer-events-none" />
          <motion.div
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-52 h-52 flex items-center justify-center"
          >
            <img
              src={product.image}
              alt={product.title}
              className="object-contain w-full h-full max-h-48 drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] rounded-img"
              loading="lazy"
            />
          </motion.div>
          
          {/* Top Badge */}
          <span className="absolute top-4 left-4 bg-white/80 backdrop-blur-md border border-black/5 text-[10px] tracking-[0.15em] uppercase font-semibold text-ocean rounded-badge px-3 py-1 shadow-sm">
            {product.brand}
          </span>
        </div>

        {/* Small Label */}
        <span className="text-xs uppercase tracking-[0.05em] text-ocean/60 font-medium mb-1 block">
          {product.category}
        </span>

        {/* Large Sora Title */}
        <h3 className="font-sora text-xl font-bold text-ocean mb-2 leading-tight group-hover:text-accent transition-colors duration-300">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-ocean/70 leading-relaxed font-sans mb-4 min-h-[4.5rem]">
          {product.tagline}
        </p>

        {/* Specifications list (Subtle preview) */}
        <ul className="space-y-1.5 mb-6">
          {Object.entries(product.specifications).slice(0, 2).map(([key, value]) => (
            <li key={key} className="flex items-center text-xs text-ocean/60">
              <Check className="w-3.5 h-3.5 mr-2 text-accent/80 shrink-0" />
              <span className="truncate">{value}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-ocean/5 flex items-center justify-between gap-4">
        {/* Space Grotesk Price */}
        <div>
          <span className="text-[10px] uppercase tracking-[0.1em] text-ocean/50 block">Price</span>
          <span className="font-space text-lg font-bold text-ocean whitespace-nowrap">
            {product.currency} {formattedPrice}
          </span>
        </div>

        {/* Action Button */}
        <Button
          variant="primary"
          onClick={() => onReserve(product)}
          className="px-6 py-2.5 text-sm rounded-btn shadow-sm"
        >
          Reserve
        </Button>
      </div>
    </motion.div>
  );
}
