"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { BRAND_CATALOG, BRAND_FILTERS, type BrandFilter } from "@/data/brands";

export function Brands() {
  const [activeFilter, setActiveFilter] = useState<BrandFilter>("All");

  const filteredBrands = useMemo(() => {
    if (activeFilter === "All") return BRAND_CATALOG;
    return BRAND_CATALOG.filter((brand) => brand.filter === activeFilter);
  }, [activeFilter]);

  const featuredBrand    = filteredBrands.find((b) => b.featured) ?? filteredBrands[0];
  const secondaryBrands  = filteredBrands.filter((b) => b.slug !== featuredBrand?.slug);

  return (
    <section id="brands" className="bg-ivory py-20 md:py-28 border-t border-ocean/5">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 md:px-12 space-y-12">

        {/* Section Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <span className="section-label">BRANDS WE CARRY</span>
            <h2 className="font-clash text-3xl font-bold leading-tight text-[#10233D] sm:text-4xl">
              Trusted Technology Brands
            </h2>
            <p className="text-sm leading-[1.8] text-[#10233D]/60 font-manrope">
              Genuine devices and accessories from the world&apos;s leading technology brands, available in Kigali and delivered across Rwanda.
            </p>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex flex-wrap items-center gap-1.5">
            {BRAND_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeFilter === filter
                    ? "border-ocean bg-ocean text-white shadow-sm"
                    : "border-ocean/10 bg-white text-[#10233D]/65 hover:border-ocean/20 hover:text-ocean"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid layout */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

          {/* Featured Brand Card (double width and height row-span on large viewports) */}
          {featuredBrand && (
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5 }}
              className="group relative overflow-hidden rounded-[32px] border border-ocean/8 bg-white shadow-sm sm:col-span-2 lg:row-span-2 flex flex-col justify-between aspect-[1.2/1] lg:aspect-auto"
            >
              {/* Banner image with dark editorial overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={featuredBrand.image}
                  alt={featuredBrand.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-[#0B1F3A]/40 to-transparent" />
              </div>

              {/* Top Row: category badge */}
              <div className="relative z-10 p-6 md:p-8 flex justify-between items-start">
                <span className="rounded-full bg-white/15 border border-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                  Featured Partner
                </span>
              </div>

              {/* Bottom Row: content */}
              <div className="relative z-10 p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 text-sm font-bold text-[#10233D] shadow-sm">
                    {featuredBrand.logo}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 font-manrope">
                      {featuredBrand.tagline}
                    </span>
                    <h3 className="font-clash text-2xl font-bold text-white leading-tight">
                      {featuredBrand.name}
                    </h3>
                  </div>
                </div>
                <p className="text-sm leading-[1.75] text-white/75 font-manrope max-w-md">
                  {featuredBrand.description}
                </p>
                <Link
                  href={`/brands/${featuredBrand.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-bold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20"
                >
                  Explore {featuredBrand.name}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.article>
          )}

          {/* Secondary Brands - modern Bento grid cards */}
          {secondaryBrands.slice(0, 4).map((brand, index) => (
            <motion.article
              key={brand.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group flex flex-col justify-between rounded-[28px] border border-ocean/8 bg-white p-6 shadow-sm transition-all duration-255 hover:-translate-y-1.5 hover:border-ocean/20 hover:shadow-md aspect-[1.15/1]"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-ocean/50 font-manrope">
                    {brand.category}
                  </span>
                  <h3 className="font-clash text-lg font-bold text-[#10233D] leading-tight group-hover:text-ocean transition-colors">
                    {brand.name}
                  </h3>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-ocean/8 bg-ocean-light/15 text-xs font-bold text-ocean shrink-0">
                  {brand.logo}
                </div>
              </div>

              {/* Product categories segment */}
              <div className="my-4 flex flex-wrap gap-1.5">
                {brand.products.slice(0, 3).map((prod) => (
                  <span key={prod} className="rounded-full bg-ivory border border-black/5 px-2.5 py-1 text-[10px] font-medium text-ocean/70 font-manrope">
                    {prod}
                  </span>
                ))}
              </div>

              {/* Footer CTA */}
              <div className="border-t border-black/5 pt-4 flex items-center justify-between text-xs">
                <span className="text-[11px] text-ocean/45 font-manrope">Genuine Stock</span>
                <Link
                  href={`/brands/${brand.slug}`}
                  className="inline-flex items-center gap-1 font-bold text-[#10233D] hover:text-ocean transition-colors group"
                >
                  Explore <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="flex flex-col gap-4 rounded-[24px] border border-ocean/8 bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ocean/8 text-ocean shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#10233D]">Direct Brand Channels</p>
              <p className="text-xs text-[#10233D]/60 font-manrope">Galaxy Hub is an authorized partner supplying genuine warranties and authentic boxes across Rwanda.</p>
            </div>
          </div>
          <Link
            href="/brands"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ocean hover:text-ocean-dark transition-colors shrink-0 font-manrope"
          >
            View All Brands <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
