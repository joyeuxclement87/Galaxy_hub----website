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

  const featuredBrand = filteredBrands.find((brand) => brand.featured) ?? filteredBrands[0];
  const secondaryBrands = filteredBrands.filter((brand) => brand.slug !== featuredBrand?.slug);

  return (
    <section id="brands" className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFEF9_0%,#F7FAFD_100%)] py-24">
      <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-ocean/6 blur-3xl" />
      <div className="absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-[1320px] px-6 md:px-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
              BRANDS WE CARRY
            </span>
            <h2 className="font-clash text-3xl font-bold leading-tight text-[#10233D] sm:text-4xl">
              Trusted Technology Brands
            </h2>
            <p className="text-sm leading-relaxed text-ocean/70 sm:text-base">
              Explore genuine devices and accessories from the world&apos;s leading technology brands, available in Kigali and delivered across Rwanda.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {BRAND_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  activeFilter === filter
                    ? "border-[#0b5497] bg-[#0b5497] text-white shadow-[0_8px_24px_rgba(11,84,151,0.16)]"
                    : "border-[#0b5497]/10 bg-white/80 text-[#10233D]/70 hover:border-[#0b5497]/20 hover:text-[#0b5497]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          {featuredBrand ? (
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="group relative overflow-hidden rounded-[32px] border border-[#0b5497]/10 bg-white shadow-[0_18px_60px_rgba(11,84,151,0.08)]"
            >
              <img
                src={featuredBrand.image}
                alt={featuredBrand.name}
                loading="lazy"
                className="h-[420px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(7,24,42,0.3)_55%,rgba(7,24,42,0.92)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-7 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-lg font-semibold text-[#10233D]">
                    {featuredBrand.logo}
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">Featured Brand</p>
                    <h3 className="font-clash text-2xl font-semibold text-white">{featuredBrand.name}</h3>
                  </div>
                </div>
                <div className="max-w-xl space-y-2">
                  <p className="text-lg font-semibold text-white">{featuredBrand.tagline}</p>
                  <p className="text-sm leading-7 text-white/75">{featuredBrand.description}</p>
                </div>
                <Link href={`/brands/${featuredBrand.slug}`} className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20">
                  Explore {featuredBrand.name}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.article>
          ) : null}

          <div className="flex gap-4 overflow-x-auto pb-2 xl:flex-col xl:overflow-visible xl:pb-0">
            {secondaryBrands.slice(0, 4).map((brand, index) => (
              <motion.article
                key={brand.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                className="min-w-[260px] flex-1 rounded-[28px] border border-[#0b5497]/10 bg-white p-5 shadow-[0_14px_40px_rgba(11,84,151,0.06)] xl:min-w-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#0b5497]/70">{brand.category}</p>
                    <h3 className="mt-2 font-clash text-xl font-semibold text-[#10233D]">{brand.name}</h3>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#0b5497]/10 bg-[#f6fbff] text-lg font-semibold text-[#0b5497]">
                    {brand.logo}
                  </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-[20px]">
                  <img src={brand.image} alt={brand.name} loading="lazy" className="h-28 w-full object-cover transition-transform duration-500 hover:scale-105" />
                </div>

                <p className="mt-4 text-sm leading-7 text-[#10233D]/70">{brand.description}</p>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-semibold text-[#0b5497]">{brand.products.slice(0, 2).join(" • ")}</span>
                  <Link href={`/brands/${brand.slug}`} className="inline-flex items-center gap-2 font-semibold text-[#10233D] transition-colors duration-300 hover:text-[#0b5497]">
                    Explore
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-[28px] border border-[#0b5497]/10 bg-white/85 p-5 shadow-[0_12px_36px_rgba(11,84,151,0.05)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b5497]/10 text-[#0b5497]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#10233D]">Galaxy Hub brings the world&apos;s best technology brands closer to Rwanda.</p>
              <p className="text-sm text-[#10233D]/65">From flagship phones to premium audio and accessories, discover what trust looks like.</p>
            </div>
          </div>
          <Link href="/brands" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0b5497]">
            View All Brands
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
