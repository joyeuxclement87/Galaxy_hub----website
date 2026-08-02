"use client";

import React, { useRef, useState } from "react";
import Fuse from "fuse.js";
import { AlertCircle, Search } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
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
    <section id="products" className="mx-auto max-w-[1320px] space-y-8 px-4 py-16 sm:px-6">
      {/* Section header */}
      <div className="max-w-2xl space-y-3">
        <span className="section-label">FEATURED PRODUCTS</span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight text-ocean-deeper">
          Discover Our Latest Collection
        </h2>
        <p className="text-sm leading-relaxed text-ocean-deeper/60 sm:text-base">
          Explore the newest smartphones, laptops, and smart accessories available in Rwanda — all genuine, all ready to order.
        </p>
      </div>

      {/* Filter bar */}
      <div className="rounded-card border border-ocean/[0.06] bg-white/70 backdrop-blur-sm p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-12">
          <div className="relative md:col-span-6">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean/35" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model, brand, spec..."
              className="w-full rounded-btn border border-ocean/[0.08] bg-ivory/60 py-3 pr-4 pl-11 text-sm transition-all duration-250 focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent/30 focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full cursor-pointer rounded-btn border border-ocean/[0.08] bg-ivory/60 px-4 py-3 text-sm transition-all duration-250 focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent/30 focus:outline-none"
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
              className="w-full cursor-pointer rounded-btn border border-ocean/[0.08] bg-ivory/60 px-4 py-3 text-sm transition-all duration-250 focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent/30 focus:outline-none"
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
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ocean/[0.05] pt-3 text-xs text-ocean/55">
            <p>Showing {displayedProducts.length} premium results</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedBrand("All");
              }}
              className="rounded-btn px-3 py-1 text-xs font-semibold text-ocean/55 hover:text-ocean hover:bg-ocean/[0.04] transition-all duration-250"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Product grid */}
      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} onReserve={onReserve} />
          ))}
        </div>
      ) : (
        <div className="space-y-3 rounded-card border border-dashed border-ocean/[0.08] bg-white/50 backdrop-blur-sm py-16 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-ocean/30" />
          <h3 className="font-display text-lg font-bold text-ocean-deeper">No shop items matched</h3>
          <p className="mx-auto max-w-md text-sm text-ocean/55">
            We couldn&apos;t find matches for your search. Try resetting filters or search terms.
          </p>
        </div>
      )}
    </section>
  );
}
