"use client";

import React, { useRef, useState } from "react";
import Fuse from "fuse.js";
import { AlertCircle, Search } from "lucide-react";
import { ProductCard } from "@/components/ui/product-card";
import { PRODUCTS, Product } from "@/data/mock-data";

interface TrendingProductsProps {
  onReserve: (product: Product) => void;
}

export function TrendingProducts({ onReserve }: TrendingProductsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const fuse = new Fuse(PRODUCTS, {
    keys: ["title", "tagline", "description", "category", "brand", "specifications"],
    threshold: 0.3,
  });

  const categories = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];
  const brandsList = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.brand)))];

  let displayedProducts = PRODUCTS;

  if (searchQuery.trim() !== "") {
    displayedProducts = fuse.search(searchQuery).map((result) => result.item);
  }

  if (selectedCategory !== "All") {
    displayedProducts = displayedProducts.filter((p) => p.category === selectedCategory);
  }

  if (selectedBrand !== "All") {
    displayedProducts = displayedProducts.filter((p) => p.brand === selectedBrand);
  }

  return (
    <section id="products" className="mx-auto max-w-[1320px] space-y-12 px-6 py-24 md:px-12">
      <div className="max-w-2xl space-y-4">
        <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
          FEATURED PRODUCTS
        </span>
        <h2 className="font-clash text-3xl font-bold leading-tight text-[#10233D] sm:text-4xl lg:text-[44px]">
          Discover Our Latest Collection
        </h2>
        <p className="text-sm leading-relaxed text-ocean/70 sm:text-base">
          Explore the newest smartphones, laptops, and smart accessories available in Rwanda — all genuine, all ready to order.
        </p>
      </div>

      <div className="glass-panel rounded-card p-6 shadow-premium space-y-6">
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
          <div className="relative md:col-span-6">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean/40" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model, brand, spec..."
              className="w-full rounded-input border border-ocean/10 bg-white/70 py-3 pr-4 pl-11 text-sm transition-all duration-300 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full cursor-pointer rounded-input border border-ocean/10 bg-white/70 px-4 py-3 text-sm transition-all duration-300 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
            >
              <option value="All">All Categories</option>
              {categories
                .filter((c) => c !== "All")
                .map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full cursor-pointer rounded-input border border-ocean/10 bg-white/70 px-4 py-3 text-sm transition-all duration-300 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
            >
              <option value="All">All Brands</option>
              {brandsList
                .filter((b) => b !== "All")
                .map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {(searchQuery || selectedCategory !== "All" || selectedBrand !== "All") && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ocean/5 pt-2 text-xs text-ocean/60">
            <p>Showing {displayedProducts.length} premium results</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedBrand("All");
              }}
              className="font-semibold text-accent hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} onReserve={onReserve} />
          ))}
        </div>
      ) : (
        <div className="space-y-4 rounded-card border border-dashed border-black/5 bg-white/30 py-20 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-ocean/40" />
          <h3 className="font-sora text-lg font-bold text-ocean">No showroom items matched</h3>
          <p className="mx-auto max-w-md text-sm text-ocean/60">
            We couldn&apos;t find matches for your search. Try resetting filters or search terms.
          </p>
        </div>
      )}
    </section>
  );
}
