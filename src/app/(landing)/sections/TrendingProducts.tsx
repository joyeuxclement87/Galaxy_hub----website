"use client";

import React, { useRef, useState } from "react";
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

  const categories = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];
  const brandsList = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.brand)))];

  let displayedProducts = PRODUCTS;

  if (searchQuery.trim() !== "") {
    const rawTerm = searchQuery.trim().toLowerCase();
    displayedProducts = PRODUCTS.filter((p) => {
      const title = p.title.toLowerCase();
      const brand = p.brand.toLowerCase();
      const category = p.category.toLowerCase();
      const tagline = (p.tagline || "").toLowerCase();
      return (
        title.includes(rawTerm) ||
        brand.includes(rawTerm) ||
        category.includes(rawTerm) ||
        tagline.includes(rawTerm)
      );
    });

    displayedProducts.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const aExact = aTitle === rawTerm || aTitle.startsWith(rawTerm);
      const bExact = bTitle === rawTerm || bTitle.startsWith(rawTerm);
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return 0;
    });
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
        <div className="space-y-4 rounded-card border border-ocean/10 bg-white/80 backdrop-blur-md p-8 sm:p-12 text-center shadow-sm max-w-xl mx-auto my-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ocean/5 text-ocean">
            <AlertCircle className="h-7 w-7" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-ocean-deeper">
              No matching products found {searchQuery ? `for "${searchQuery}"` : ""}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-ocean/60 leading-relaxed">
              We couldn&apos;t find any tech items matching your search. Search terms are case-insensitive — try checking for typos or searching by brand like &ldquo;Samsung&rdquo; or &ldquo;Apple&rdquo;.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedBrand("All");
              }}
              className="inline-flex items-center justify-center rounded-btn bg-ocean-deeper px-5 h-10 text-xs font-bold text-white uppercase tracking-wider transition-all hover:bg-ocean-dark shadow-sm"
            >
              Reset Filters &amp; Search
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
