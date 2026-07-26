"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Navbar }             from "@/components/navbar/Navbar";
import { ProductCard }        from "@/components/products/ProductCard";
import { ReservationModal }   from "@/components/ui/reservation-modal";
import {
  Product,
  TRENDING_KEYWORDS, QUICK_FILTERS,
  POPULAR_SEARCH_CARDS, DEALS_QUICK_FILTERS,
  CATEGORIES as FALLBACK_CATEGORIES,
} from "@/data/mock-data";
import { useApp }             from "@/context/AppContext";
import { HeroSection, HeroSlideData } from "@/components/hero/Hero";
import { FeaturedCategories } from "@/app/(landing)/sections/FeaturedCategories";
import { Brands }             from "@/app/(landing)/sections/Brands";
import { Reviews }            from "@/app/(landing)/sections/Reviews";
import { FAQSupport }         from "@/app/(landing)/sections/FAQSupport";
import CTA                    from "@/app/(landing)/sections/CTA";
import { CreatorEssentials }  from "@/app/(landing)/sections/CreatorEssentials";
import { EverydayTech }       from "@/app/(landing)/sections/EverydayTech";
import Footer                 from "@/components/ui/Footer";
import type { HomepageData }  from "@/data/homepage";

function DealCountdown() {
  const [timeLeft, setTimeLeft] = React.useState({ days: "04", hours: "12", minutes: "18", seconds: "00" });

  React.useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 4);
    targetDate.setHours(targetDate.getHours() + 12);

    const updateTimer = () => {
      const diff = +targetDate - +new Date();
      if (diff <= 0) return;
      const days    = Math.floor(diff / 86400000);
      const hours   = Math.floor((diff / 3600000) % 24);
      const minutes = Math.floor((diff / 60000) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({
        days:    String(days).padStart(2, "0"),
        hours:   String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hrs",  value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <div className="space-y-2">
      <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-ocean-deeper/40 font-manrope">ENDS IN</span>
      <div className="flex items-end gap-2">
        {units.map((unit, i) => (
          <React.Fragment key={unit.label}>
            {i > 0 && <span className="mb-1.5 text-lg font-bold text-ocean-deeper/20">:</span>}
            <div className="text-center">
              <span className="block font-clash text-2xl font-bold text-ocean-deeper">{unit.value}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-ocean-deeper/30 font-manrope">{unit.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

interface HomeClientProps {
  data: HomepageData;
}

export default function HomeClient({ data }: HomeClientProps) {
  const [selectedProduct,       setSelectedProduct]       = useState<Product | null>(null);
  const [popularSearchFilter,   setPopularSearchFilter]   = useState("All");
  const [selectedDealsFilter,   setSelectedDealsFilter]   = useState("All Deals");

  const {
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    selectedBrand, setSelectedBrand,
    showDealsOnly, setShowDealsOnly,
    addToCart, wishlist,
  } = useApp();

  const products = data.allProducts;

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === "#deals") {
        setShowDealsOnly(true);
        setSelectedCategory("All");
        setSelectedBrand("All");
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
      } else if (hash === "#products") {
        setShowDealsOnly(false);
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
      } else if (hash === "#brands") {
        document.getElementById("brands")?.scrollIntoView({ behavior: "smooth" });
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [setSelectedCategory, setSelectedBrand, setShowDealsOnly]);

  const fuse = new Fuse(products, {
    keys: ["title", "tagline", "description", "category", "brand"],
    threshold: 0.3,
  });

  let displayedProducts = products;
  if (searchQuery.trim())     displayedProducts = fuse.search(searchQuery).map((r) => r.item);
  if (showDealsOnly)          displayedProducts = displayedProducts.filter((p) => p.originalPrice !== undefined || p.availability === "Limited Stock");
  if (selectedCategory === "Wishlist") displayedProducts = displayedProducts.filter((p) => wishlist.includes(p.id));
  else if (selectedCategory !== "All") displayedProducts = displayedProducts.filter((p) => p.category === selectedCategory);
  if (selectedBrand !== "All") displayedProducts = displayedProducts.filter((p) => p.brand === selectedBrand);

  const scrollToProducts = () => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });

  const heroSlidesRaw: HeroSlideData[] = data.heroSlides.length > 0
    ? data.heroSlides
    : products.slice(0, 1).map((p) => ({
        id: p.id, badge: p.badge || "NEW ARRIVAL", title: p.title,
        description: p.description, price: p.price, originalPrice: p.originalPrice,
        currency: p.currency, image: p.image, slug: p.slug,
      }));

  const heroSlides: HeroSlideData[] = heroSlidesRaw.length > 0
    ? heroSlidesRaw
    : [{
        id: "fallback-hero", badge: "NEW ARRIVAL",
        title: "Discover the Latest Tech",
        description: "Premium smartphones, laptops, and accessories at the best prices in Rwanda.",
        price: 0, currency: "RWF",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1200", slug: "products",
      }];

  const displayCategories = data.categories.length > 0 ? data.categories : FALLBACK_CATEGORIES;
  const displayDeals = data.promotions;

  return (
    <div className="flex-1 pt-[88px] sm:pt-[96px]">
      <Navbar />

      <HeroSection slides={heroSlides} onAddToCart={addToCart} />

      <FeaturedCategories categories={data.categories} />

      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 md:px-12">
        <hr className="divider-subtle" />
      </div>

      {/* ── POPULAR SEARCHES ── */}
      <section className="bg-white px-4 py-20 sm:px-6 md:px-12 md:py-28">
        <div className="mx-auto max-w-[1320px] space-y-10">
          <div className="flex flex-col gap-3 pb-6 sm:flex-row sm:items-center">
            <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-ocean/40 font-manrope whitespace-nowrap">
              Trending
            </span>
            <div className="flex flex-wrap gap-2">
              {TRENDING_KEYWORDS.map((keyword) => (
                <Link
                  key={keyword}
                  href={`/search?q=${encodeURIComponent(keyword)}`}
                  onClick={(e) => { e.preventDefault(); setSearchQuery(keyword); setShowDealsOnly(false); setSelectedCategory("All"); setSelectedBrand("All"); scrollToProducts(); }}
                  className="rounded-full border border-ocean/8 bg-ocean/[0.03] px-3 py-1 text-xs font-semibold text-ocean transition-all duration-200 hover:border-ocean/20 hover:bg-ocean-light/40 font-manrope"
                >
                  {keyword}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 pb-8 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3 max-w-2xl">
              <span className="section-label">POPULAR SEARCHES</span>
              <h2 className="font-clash text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight text-ocean-deeper">
                Quickly Find Your Next Device.
              </h2>
              <p className="text-sm leading-[1.8] text-ocean/50 font-manrope">
                Explore the gadgets, smartphones, accessories, and creator gear our community is looking for right now.
              </p>
            </div>
            <button
              onClick={scrollToProducts}
              className="inline-flex items-center gap-2 text-sm font-bold text-ocean transition-all duration-200 hover:gap-3 group cursor-pointer font-manrope"
            >
              Browse All Products
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 flex-nowrap no-scrollbar">
              {QUICK_FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPopularSearchFilter(filter)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer font-manrope ${
                    popularSearchFilter === filter
                      ? "bg-ocean text-white shadow-sm"
                      : "bg-ocean/[0.04] text-ocean/55 hover:bg-ocean/10 hover:text-ocean"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              {(() => {
                const filtered = POPULAR_SEARCH_CARDS.filter(
                  (card) => popularSearchFilter === "All" || card.category === popularSearchFilter
                );
                if (filtered.length === 0) {
                  return (
                    <div className="col-span-full py-16 text-center text-sm text-ocean/40">
                      No matches found in this category.
                    </div>
                  );
                }
                return filtered.map((card, index) => {
                  const isFeatured = index === 0;
                  return (
                    <Link
                      key={card.keyword}
                      href={`/search?q=${encodeURIComponent(card.keyword)}`}
                      onClick={(e) => { e.preventDefault(); setSearchQuery(card.keyword); setShowDealsOnly(false); setSelectedCategory("All"); setSelectedBrand("All"); scrollToProducts(); }}
                      className={`group relative overflow-hidden rounded-2xl bg-ocean-deeper shadow-sm transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lg ${
                        isFeatured
                          ? "col-span-1 sm:col-span-2 aspect-[16/10] sm:aspect-[2/1]"
                          : "col-span-1 aspect-[4/3] sm:aspect-square"
                      }`}
                    >
                      <div className="absolute inset-0 z-0">
                        <img
                          src={card.image}
                          alt={card.keyword}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] select-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 transition-opacity duration-300 group-hover:from-black/95" />
                      </div>
                      <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 md:p-6">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 font-manrope mb-1">
                          {card.category}
                        </span>
                        <h4 className={`font-clash text-white tracking-tight leading-tight ${
                          isFeatured ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
                        }`}>
                          {card.keyword}
                        </h4>
                        <p className="text-xs text-white/60 font-manrope mt-1">
                          {card.count} items configured
                        </p>
                        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-white/90 uppercase tracking-wider font-manrope opacity-0 -translate-x-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                          <span>Explore Category</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </Link>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 md:px-12">
        <hr className="divider-subtle" />
      </div>

      {/* ── FEATURED DEALS ── */}
      <section id="deals" className="bg-ivory px-4 py-20 sm:px-6 md:px-12 md:py-28">
        <div className="mx-auto max-w-[1320px] space-y-12">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3 max-w-2xl">
              <span className="section-label">FEATURED DEALS</span>
              <h2 className="font-clash text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight text-ocean-deeper">
                Today&apos;s Best Tech Deals
              </h2>
              <p className="text-sm leading-[1.8] text-ocean/50 font-manrope">
                Exclusive offers on genuine gadgets, accessories, and creator gear available across Rwanda.
              </p>
            </div>
            <Link
              href="/deals"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-ocean hover:text-ocean-dark transition-all duration-200 hover:gap-3 group font-manrope"
            >
              View All Deals
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 flex-nowrap no-scrollbar">
            {DEALS_QUICK_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedDealsFilter(filter)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer font-manrope ${
                  selectedDealsFilter === filter
                    ? "bg-ocean text-white shadow-sm"
                    : "bg-white border border-ocean/8 text-ocean/55 hover:bg-ocean/4"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {displayDeals.length > 0 && selectedDealsFilter === "All Deals" ? (
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <Link
                  href={`/deals/${displayDeals[0].slug}`}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-ocean/8 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:border-ocean/15 hover:shadow-md lg:col-span-2 sm:p-8"
                >
                  <div className="grid gap-8 sm:grid-cols-2 items-center">
                    <div className="space-y-6 z-10">
                      <span className="inline-block rounded-full bg-red-50 text-red-600 border border-red-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                        {displayDeals[0].badge}
                      </span>
                      <div className="space-y-2">
                        <h3 className="font-clash text-xl font-bold text-ocean-deeper sm:text-2xl tracking-tight leading-tight">
                          {displayDeals[0].title}
                        </h3>
                        <p className="text-sm leading-[1.8] text-ocean/55 font-manrope">
                          {displayDeals[0].description}
                        </p>
                      </div>
                      <DealCountdown />
                    </div>
                    <div className="relative aspect-square w-full rounded-xl bg-ivory-dark/40 overflow-hidden flex items-center justify-center p-4">
                      <img
                        src={displayDeals[0].image}
                        alt={displayDeals[0].title}
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105 select-none"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-ocean font-manrope">
                    <span>{displayDeals[0].ctaText}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>

                <div className="flex flex-col gap-6">
                  {displayDeals.slice(1, 3).map((deal) => (
                    <Link
                      key={deal.slug}
                      href={`/deals/${deal.slug}`}
                      className="group relative flex flex-row items-center justify-between rounded-2xl border border-ocean/8 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:border-ocean/15 hover:shadow-md flex-1"
                    >
                      <div className="flex-1 space-y-3 pr-3">
                        <span className="inline-block rounded-full bg-ocean/5 border border-ocean/10 px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ocean">
                          {deal.badge}
                        </span>
                        <div className="space-y-1">
                          <h4 className="font-clash text-base font-bold text-ocean-deeper tracking-tight">
                            {deal.title}
                          </h4>
                          <p className="text-xs leading-[1.7] text-ocean/45 font-manrope line-clamp-2">
                            {deal.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-ocean font-manrope">
                          <span>{deal.ctaText}</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </div>
                      </div>
                      <div className="relative aspect-square w-20 rounded-xl bg-ivory-dark/40 overflow-hidden shrink-0 flex items-center justify-center p-2">
                        <img
                          src={deal.image}
                          alt={deal.title}
                          loading="lazy"
                          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105 select-none"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {displayDeals.length > 3 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {displayDeals.slice(3, 6).map((deal) => (
                    <Link
                      key={deal.slug}
                      href={`/deals/${deal.slug}`}
                      className="group relative flex flex-col justify-between rounded-2xl border border-ocean/8 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:border-ocean/15 hover:shadow-md"
                    >
                      <div className="space-y-4">
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-ivory-dark/30 flex items-center justify-center p-3">
                          <img
                            src={deal.image}
                            alt={deal.title}
                            loading="lazy"
                            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105 select-none"
                          />
                          <span className="absolute left-3 top-3 rounded-full px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-sm bg-ocean text-white">
                            {deal.badge}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-clash text-base font-bold text-ocean-deeper tracking-tight">
                            {deal.title}
                          </h4>
                          <p className="text-xs leading-[1.7] text-ocean/45 font-manrope">
                            {deal.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-ocean font-manrope">
                        <span>{deal.ctaText}</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-ocean/45 font-manrope">No active deals at this time. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 md:px-12">
        <hr className="divider-subtle" />
      </div>

      {/* ── SHOP BY CATEGORY ── */}
      <section id="categories" className="bg-white px-4 py-20 sm:px-6 md:px-12 md:py-28">
        <div className="mx-auto max-w-[1320px] space-y-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3 max-w-2xl">
              <span className="section-label">SHOP BY CATEGORY</span>
              <h2 className="font-clash text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight text-ocean-deeper">
                Everything Tech.<br />One Place.
              </h2>
              <p className="text-sm leading-[1.8] text-ocean/50 font-manrope">
                Explore smartphones, accessories, creator equipment, and smart devices available in Kigali and delivered across Rwanda.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-ocean hover:text-ocean-dark transition-colors group font-manrope"
            >
              View All Products
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {displayCategories.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {displayCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products/${category.slug}`}
                  className={`group relative overflow-hidden rounded-2xl bg-ocean-deeper h-[220px] sm:h-[280px] md:h-[340px] col-span-1`}
                >
                  <div className="absolute inset-0">
                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent transition-colors duration-300 group-hover:from-black/65" />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-5 sm:p-6 z-10">
                    <h3 className="font-clash text-lg font-bold text-white sm:text-xl">{category.name}</h3>
                    {category.productCount > 0 && (
                      <p className="text-xs text-white/60 font-manrope mt-0.5">{category.productCount}+ Products</p>
                    )}
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-white/80 uppercase tracking-wider font-manrope opacity-0 translate-y-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      <span>Explore</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-ocean/45 font-manrope">Categories coming soon.</p>
            </div>
          )}
        </div>
      </section>

      <Brands brands={data.brands} filters={data.brandFilters} />

      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 md:px-12">
        <hr className="divider-subtle" />
      </div>

      {/* ── TRENDING PRODUCTS ── */}
      <section id="products" className="mx-auto max-w-[1320px] space-y-8 px-4 py-20 sm:px-6 md:px-12 md:py-28">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3 max-w-2xl">
            <span className="section-label">TRENDING NOW</span>
            <h2 className="font-clash text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight text-ocean-deeper">
              Popular Tech Picks
            </h2>
            <p className="text-sm leading-[1.8] text-ocean/50 font-manrope">
              Discover the devices and accessories customers are choosing most from Galaxy Hub.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-ocean hover:text-ocean-dark transition-colors group font-manrope"
          >
            View All Products
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-ocean/5 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto flex-nowrap no-scrollbar">
            {["All", "Smartphones", "Laptops", "Audio", "Accessories", "Creator Gear", "Deals"].map((tab) => {
              const isActive =
                tab === "All"   ? selectedCategory === "All" && !showDealsOnly :
                tab === "Deals" ? showDealsOnly :
                                  selectedCategory === tab && !showDealsOnly;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    if (tab === "All")   { setSelectedCategory("All"); setShowDealsOnly(false); }
                    else if (tab === "Deals") { setShowDealsOnly(true); }
                    else                 { setSelectedCategory(tab);  setShowDealsOnly(false); }
                  }}
                  className={`whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer font-manrope ${
                    isActive
                      ? "bg-ocean text-white shadow-sm"
                      : "text-ocean/40 hover:text-ocean hover:bg-ocean/4"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-ocean/40 font-manrope">Sort by:</span>
            <select className="bg-transparent border-none text-xs font-bold text-ocean-deeper focus:ring-0 outline-none cursor-pointer font-manrope">
              <option>Popular</option>
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
            </select>
          </div>
        </div>

        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onReserve={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4 rounded-2xl border border-dashed border-black/6 bg-white/40 py-24 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-ocean/15" />
            <h3 className="font-clash text-lg font-bold text-ocean-deeper">No products found</h3>
            <p className="mx-auto max-w-sm text-sm text-ocean/45 font-manrope">
              We couldn&apos;t find matches for your current filters. Try selecting a different category.
            </p>
          </div>
        )}
      </section>

      <CreatorEssentials />
      <EverydayTech />
      <Reviews />
      <FAQSupport />
      <CTA />
      <Footer />

      <ReservationModal
        key={selectedProduct?.id ?? "none"}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSuccess={(prod) => addToCart(prod.id)}
      />
    </div>
  );
}
