"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import {
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  Shield,
  ShoppingBag,
  Star,
  Truck,
  BadgeCheck,
} from "lucide-react";
import { Navbar }             from "@/components/ui/navbar";
import { ProductCard }        from "@/components/ui/product-card";
import { ReservationModal }   from "@/components/ui/reservation-modal";
import {
  PRODUCTS, Product,
  HERO_CMS_CONTENT, HERO_SPOTLIGHT_SLIDES,
  TRENDING_KEYWORDS, QUICK_FILTERS,
  POPULAR_SEARCH_CARDS, DEALS_QUICK_FILTERS,
  DEAL_OFFERS, CATEGORIES,
} from "@/data/mock-data";
import { Button }             from "@/components/ui/button";
import { useApp }             from "@/context/AppContext";
import { Brands }             from "@/app/(landing)/sections/Brands";
import { Reviews }            from "@/app/(landing)/sections/Reviews";
import { FAQSupport }         from "@/app/(landing)/sections/FAQSupport";
import CTA                    from "@/app/(landing)/sections/CTA";
import { CreatorEssentials }  from "@/app/(landing)/sections/CreatorEssentials";
import { EverydayTech }       from "@/app/(landing)/sections/EverydayTech";
import Footer                 from "@/components/ui/Footer";

// ─── Deal Countdown ─────────────────────────────────────────────────────────
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
      <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#10233D]/40 font-manrope">ENDS IN</span>
      <div className="flex items-end gap-2">
        {units.map((unit, i) => (
          <React.Fragment key={unit.label}>
            {i > 0 && <span className="mb-1.5 text-lg font-bold text-[#10233D]/25">:</span>}
            <div className="text-center">
              <span className="block font-clash text-2xl font-bold text-[#10233D]">{unit.value}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#10233D]/35 font-manrope">{unit.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ShowroomHome() {
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

  const searchInputRef = useRef<HTMLInputElement>(null);

  // ── Hash listener ──────────────────────────────────────────────────────────
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

  // ── Product search + filters ───────────────────────────────────────────────
  const fuse = new Fuse(PRODUCTS, {
    keys: ["title", "tagline", "description", "category", "brand", "specifications"],
    threshold: 0.3,
  });

  let displayedProducts = PRODUCTS;
  if (searchQuery.trim())     displayedProducts = fuse.search(searchQuery).map((r) => r.item);
  if (showDealsOnly)          displayedProducts = displayedProducts.filter((p) => p.originalPrice !== undefined || p.availability === "Limited Stock");
  if (selectedCategory === "Wishlist") displayedProducts = displayedProducts.filter((p) => wishlist.includes(p.id));
  else if (selectedCategory !== "All") displayedProducts = displayedProducts.filter((p) => p.category === selectedCategory);
  if (selectedBrand !== "All") displayedProducts = displayedProducts.filter((p) => p.brand === selectedBrand);

  const focusSearchInput = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const scrollToProducts = () => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });

  // ── Hero carousel ──────────────────────────────────────────────────────────
  const [activeSlide,     setActiveSlide]     = useState(0);
  const [carouselPaused,  setCarouselPaused]  = useState(false);
  const heroSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (carouselPaused) return;
    const timer = setInterval(() => setActiveSlide((p) => (p + 1) % HERO_SPOTLIGHT_SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, [carouselPaused]);

  const goToSlide = (index: number) =>
    setActiveSlide(((index % HERO_SPOTLIGHT_SLIDES.length) + HERO_SPOTLIGHT_SLIDES.length) % HERO_SPOTLIGHT_SLIDES.length);

  const activeSpotlight = HERO_SPOTLIGHT_SLIDES[activeSlide];

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const val = heroSearchRef.current?.value?.trim() ?? "";
    if (!val) return;
    setSearchQuery(val);
    setShowDealsOnly(false);
    setSelectedCategory("All");
    setSelectedBrand("All");
    scrollToProducts();
  };

  const handlePillClick = (keyword: string) => {
    setSearchQuery(keyword);
    setShowDealsOnly(false);
    setSelectedCategory("All");
    setSelectedBrand("All");
    scrollToProducts();
  };

  return (
    <div className="flex-1 pt-[80px] sm:pt-[88px]">
      <Navbar onSearchFocus={focusSearchInput} />

      {/* ════════════════════════════════════════════════════════════════════
          01 — HERO
      ════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden bg-ivory px-4 pt-10 pb-10 sm:px-6 md:px-12 lg:pt-14 lg:pb-16"
        aria-label="Galaxy Hub featured products"
      >
        {/* Subtle tint accent behind carousel */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-[20%] opacity-60"
          style={{ background: activeSpotlight.bgAccent }}
        />

        <div className="relative z-10 mx-auto grid max-w-[1320px] items-start gap-10 lg:grid-cols-12 lg:gap-16">

          {/* ── Left column — text content ─────────────────────────────────── */}
          <div className="space-y-7 lg:col-span-5 lg:py-8">

            {/* Location badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ocean/15 bg-ivory px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.26em] text-ocean shadow-sm">
              <MapPin className="h-3 w-3 text-accent" />
              {HERO_CMS_CONTENT.badge}
            </span>

            {/* H1 */}
            <div className="space-y-4">
              <h1 className="font-clash text-[36px] font-bold leading-[1.04] tracking-[-0.02em] text-[#10233D] sm:text-[46px] lg:text-[54px]">
                {HERO_CMS_CONTENT.headline.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </h1>
              <p className="max-w-[460px] text-[14px] leading-[1.85] text-[#10233D]/60 sm:text-[15px] font-manrope">
                {HERO_CMS_CONTENT.description}
              </p>
            </div>

            {/* Hero search bar */}
            <div className="max-w-[480px]">
              <form
                onSubmit={handleHeroSearch}
                className="flex items-center gap-0 rounded-[14px] border border-ocean/12 bg-white shadow-sm transition-shadow duration-300 focus-within:shadow-[0_8px_24px_rgba(11,84,151,0.10)] focus-within:border-ocean/22"
              >
                <Search className="ml-4 h-4 w-4 shrink-0 text-ocean/40" />
                <input
                  ref={heroSearchRef}
                  type="search"
                  placeholder={HERO_CMS_CONTENT.searchPlaceholder}
                  className="flex-1 border-none bg-transparent px-3 py-3.5 text-sm text-[#10233D] placeholder:text-ocean/35 focus:outline-none font-manrope"
                />
                <button
                  type="submit"
                  className="mr-1.5 shrink-0 rounded-[10px] bg-ocean px-4 py-2.5 text-xs font-bold text-ivory transition-colors duration-200 hover:bg-ocean-dark cursor-pointer"
                >
                  Search
                </button>
              </form>

              {/* Popular pill searches */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ocean/40 font-manrope">Popular:</span>
                {HERO_CMS_CONTENT.popularSearches.map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => handlePillClick(kw)}
                    className="rounded-full border border-ocean/8 bg-ocean-light/25 px-3 py-1 text-[11px] font-medium text-ocean/65 transition-all duration-200 hover:border-ocean/18 hover:bg-ocean-light/50 hover:text-ocean cursor-pointer font-manrope"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" className="gap-2 px-6" onClick={scrollToProducts}>
                {HERO_CMS_CONTENT.primaryBtnText}
              </Button>
              <Button
                variant="secondary"
                className="gap-2 bg-transparent"
                onClick={() => setSelectedProduct(PRODUCTS.find((p) => p.featured) ?? PRODUCTS[0])}
              >
                <ShoppingBag className="h-4 w-4" />
                {HERO_CMS_CONTENT.secondaryBtnText}
              </Button>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {HERO_CMS_CONTENT.trustRow.map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#10233D]/55 font-manrope">
                  <BadgeCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  {item}
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#10233D]/55 font-manrope">
                <Truck className="h-3.5 w-3.5 text-ocean shrink-0" />
                Nationwide Delivery
              </span>
            </div>
          </div>

          {/* ── Right column — product carousel ───────────────────────────── */}
          <div
            className="lg:col-span-7"
            onMouseEnter={() => setCarouselPaused(true)}
            onMouseLeave={() => setCarouselPaused(false)}
          >
            <div className="relative mx-auto w-full max-w-[580px]">

              {/* Image container */}
              <div className="relative aspect-square w-full overflow-hidden rounded-[28px] bg-[#F4F4F2]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSpotlight.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeSpotlight.image}
                      alt={activeSpotlight.title}
                      fill
                      priority={activeSlide === 0}
                      sizes="(min-width: 1024px) 580px, 92vw"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Category badge */}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`cat-${activeSpotlight.id}`}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="absolute left-4 top-4 z-10 rounded-full border border-white/40 bg-white/85 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-ocean shadow-sm backdrop-blur-md"
                  >
                    {activeSpotlight.category}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Product title + features */}
              <div className="mt-5 space-y-3">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={`title-${activeSpotlight.id}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="font-clash text-xl font-bold text-[#10233D] sm:text-2xl"
                  >
                    {activeSpotlight.title}
                  </motion.h2>
                </AnimatePresence>

                <div className="flex flex-wrap gap-2">
                  <AnimatePresence mode="wait">
                    {activeSpotlight.features.map((feat, idx) => (
                      <motion.span
                        key={`${activeSpotlight.id}-feat-${idx}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.25, delay: 0.05 * idx }}
                        className="rounded-full border border-ocean/10 bg-white px-3.5 py-1.5 text-[11px] font-semibold text-ocean/70 shadow-sm font-manrope"
                      >
                        {feat}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Carousel controls */}
              <div className="mt-5 flex items-center justify-between">
                {/* Dot indicators */}
                <div className="flex items-center gap-2">
                  {HERO_SPOTLIGHT_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      aria-label={`Go to ${slide.title}`}
                      className={
                        idx === activeSlide
                          ? "h-1.5 w-8 rounded-full bg-ocean transition-all duration-300 cursor-pointer"
                          : "h-1.5 w-1.5 rounded-full bg-ocean/20 transition-all duration-300 cursor-pointer hover:bg-ocean/40"
                      }
                    />
                  ))}
                </div>

                {/* Prev/Next */}
                <div className="flex items-center gap-2">
                  {[
                    { label: "Previous", onClick: () => goToSlide(activeSlide - 1), icon: <ChevronLeft className="h-4 w-4" /> },
                    { label: "Next",     onClick: () => goToSlide(activeSlide + 1), icon: <ChevronRight className="h-4 w-4" /> },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      type="button"
                      onClick={btn.onClick}
                      aria-label={btn.label}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ocean/12 text-ocean/50 transition-all duration-200 hover:border-ocean/28 hover:text-ocean cursor-pointer"
                    >
                      {btn.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          Quick Statistics Banner
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-20 px-4 sm:px-6 md:px-12 -mt-4">
        <div className="mx-auto max-w-[1320px]">
          <div className="rounded-[22px] border border-ocean/8 bg-white p-6 shadow-[0_16px_40px_rgba(11,84,151,0.06)] md:p-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-0 md:divide-x md:divide-ocean/8">
              {HERO_CMS_CONTENT.statistics.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center text-center px-4 py-2">
                  <span className="block font-clash text-3xl font-bold tracking-tight text-[#10233D] sm:text-4xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-ocean/45 font-manrope">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          02 — POPULAR SEARCHES
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-t border-ocean/5 px-4 py-20 sm:px-6 md:px-12">
        <div className="mx-auto max-w-[1320px] space-y-10">

          {/* Trending strip */}
          <div className="flex flex-col gap-3 border-b border-ocean/6 pb-6 sm:flex-row sm:items-center">
            <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-ocean/45 font-manrope whitespace-nowrap">
              🔥 Trending
            </span>
            <div className="flex flex-wrap gap-2">
              {TRENDING_KEYWORDS.map((keyword) => (
                <Link
                  key={keyword}
                  href={`/search?q=${encodeURIComponent(keyword)}`}
                  onClick={(e) => { e.preventDefault(); handlePillClick(keyword); }}
                  className="rounded-full border border-ocean/8 bg-ocean-light/20 px-3.5 py-1 text-xs font-semibold text-ocean transition-all duration-200 hover:border-ocean/20 hover:bg-ocean-light/45 font-manrope"
                >
                  {keyword}
                </Link>
              ))}
            </div>
          </div>

          {/* Full-width Section Header */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-ocean/8 pb-8">
            <div className="space-y-3 max-w-2xl">
              <span className="section-label">POPULAR SEARCHES</span>
              <h2 className="font-clash text-3xl font-bold leading-tight text-[#10233D] sm:text-4xl">
                Quickly Find Your Next Device.
              </h2>
              <p className="text-sm leading-[1.8] text-[#10233D]/60 font-manrope">
                Explore the gadgets, smartphones, accessories, and creator gear our community is looking for right now.
              </p>
            </div>
            <div className="flex flex-col gap-4 items-start md:items-end">
              <button
                onClick={scrollToProducts}
                className="inline-flex items-center gap-2 text-sm font-bold text-ocean transition-all duration-200 hover:gap-3 group cursor-pointer font-manrope"
              >
                Browse All Products
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Filter pills & Bento Grid container */}
          <div className="space-y-6">
            {/* Filter tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 flex-nowrap no-scrollbar">
              {QUICK_FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPopularSearchFilter(filter)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer font-manrope ${
                    popularSearchFilter === filter
                      ? "bg-ocean text-white shadow-sm"
                      : "bg-ocean/5 text-ocean/65 hover:bg-ocean/10 hover:text-ocean"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Bento Grid layout */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              {(() => {
                const filtered = POPULAR_SEARCH_CARDS.filter(
                  (card) => popularSearchFilter === "All" || card.category === popularSearchFilter
                );

                if (filtered.length === 0) {
                  return (
                    <div className="col-span-full py-16 text-center text-sm text-[#10233D]/50">
                      No matches found in this category.
                    </div>
                  );
                }

                return filtered.map((card, index) => {
                  // Make the first card span 2 columns on tablet/desktop for bento aesthetics
                  const isFeatured = index === 0;

                  return (
                    <Link
                      key={card.keyword}
                      href={`/search?q=${encodeURIComponent(card.keyword)}`}
                      onClick={(e) => { e.preventDefault(); handlePillClick(card.keyword); }}
                      className={`group relative overflow-hidden rounded-[28px] bg-[#10233D] shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md ${
                        isFeatured
                          ? "col-span-1 sm:col-span-2 aspect-[16/10] sm:aspect-[2/1]"
                          : "col-span-1 aspect-[4/3] sm:aspect-square"
                      }`}
                    >
                      {/* Background image */}
                      <div className="absolute inset-0 z-0">
                        <img
                          src={card.image}
                          alt={card.keyword}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] select-none"
                        />
                        {/* Deep dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 transition-opacity duration-300 group-hover:from-black/95" />
                      </div>

                      {/* Content overlay inside card */}
                      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-8">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 font-manrope mb-1.5">
                          {card.category}
                        </span>
                        <h4 className={`font-clash text-white tracking-tight leading-tight ${
                          isFeatured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
                        }`}>
                          {card.keyword}
                        </h4>
                        <p className="text-xs text-white/70 font-manrope mt-1">
                          {card.count} items configured
                        </p>
                        <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-white/95 uppercase tracking-wider font-manrope opacity-0 -translate-x-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
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

      {/* ════════════════════════════════════════════════════════════════════
          03 — FEATURED DEALS
      ════════════════════════════════════════════════════════════════════ */}
      <section id="deals" className="bg-ivory border-t border-ocean/5 px-4 py-20 sm:px-6 md:px-12 md:py-28">
        <div className="mx-auto max-w-[1320px] space-y-12">

          {/* Section Header */}
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3 max-w-2xl">
              <span className="section-label">FEATURED DEALS</span>
              <h2 className="font-clash text-3xl font-bold leading-tight text-[#10233D] sm:text-4xl">
                Today&apos;s Best Tech Deals
              </h2>
              <p className="text-sm leading-[1.8] text-[#10233D]/60 font-manrope">
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

          {/* Segmented filter control */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 flex-nowrap no-scrollbar">
            {DEALS_QUICK_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedDealsFilter(filter)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer font-manrope ${
                  selectedDealsFilter === filter
                    ? "bg-ocean text-white shadow-sm"
                    : "bg-white border border-ocean/8 text-ocean hover:bg-ocean/5"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Dynamic Grid Rendering */}
          {selectedDealsFilter === "All Deals" ? (
            <div className="space-y-6">
              {/* Top Row: Large featured card (2/3) + Medium stacked list (1/3) */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Large Featured Card */}
                {(() => {
                  const deal = DEAL_OFFERS[0];
                  return (
                    <Link
                      href={`/deals/${deal.slug}`}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-ocean/8 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-ocean/20 hover:shadow-md lg:col-span-2 sm:p-8"
                    >
                      <div className="grid gap-8 sm:grid-cols-2 items-center">
                        <div className="space-y-6 z-10">
                          <span className="inline-block rounded-full bg-red-50 text-red-600 border border-red-100 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                            {deal.badge}
                          </span>
                          <div className="space-y-2">
                            <h3 className="font-clash text-2xl font-bold text-[#10233D] sm:text-3xl tracking-tight leading-tight">
                              {deal.title}
                            </h3>
                            <p className="text-sm leading-[1.8] text-[#10233D]/60 font-manrope">
                              {deal.description}
                            </p>
                          </div>
                          <DealCountdown />
                        </div>
                        <div className="relative aspect-square w-full rounded-2xl bg-ivory/40 overflow-hidden flex items-center justify-center p-4">
                          <img
                            src={deal.image}
                            alt={deal.title}
                            loading="lazy"
                            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105 select-none"
                          />
                        </div>
                      </div>
                      <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-ocean font-manrope">
                        <span>{deal.ctaText}</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </div>
                    </Link>
                  );
                })()}

                {/* Right Stack: 2 Medium Campaign Cards */}
                <div className="flex flex-col gap-6">
                  {DEAL_OFFERS.slice(1, 3).map((deal) => (
                    <Link
                      key={deal.slug}
                      href={`/deals/${deal.slug}`}
                      className="group relative flex flex-row items-center justify-between rounded-[28px] border border-ocean/8 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-ocean/20 hover:shadow-md flex-1"
                    >
                      <div className="flex-1 space-y-3 pr-3">
                        <span className="inline-block rounded-full bg-ocean/5 border border-ocean/10 px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ocean">
                          {deal.badge}
                        </span>
                        <div className="space-y-1">
                          <h4 className="font-clash text-lg font-bold text-[#10233D] tracking-tight">
                            {deal.title}
                          </h4>
                          <p className="text-xs leading-[1.75] text-[#10233D]/55 font-manrope line-clamp-2">
                            {deal.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-ocean font-manrope">
                          <span>{deal.ctaText}</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </div>
                      </div>
                      <div className="relative aspect-square w-24 rounded-xl bg-ivory/50 overflow-hidden shrink-0 flex items-center justify-center p-2">
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

              {/* Bottom Row: 3 Small Promo Cards */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {DEAL_OFFERS.slice(3, 6).map((deal) => (
                  <Link
                    key={deal.slug}
                    href={`/deals/${deal.slug}`}
                    className="group relative flex flex-col justify-between rounded-[28px] border border-ocean/8 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-ocean/20 hover:shadow-md"
                  >
                    <div className="space-y-4">
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-ivory/40 flex items-center justify-center p-3">
                        <img
                          src={deal.image}
                          alt={deal.title}
                          loading="lazy"
                          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105 select-none"
                        />
                        <span className={`absolute left-3 top-3 rounded-full px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-sm ${
                          deal.badgeType === "red"
                            ? "bg-red-500 text-white"
                            : "bg-ocean text-white"
                        }`}>
                          {deal.badge}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-clash text-lg font-bold text-[#10233D] tracking-tight">
                          {deal.title}
                        </h4>
                        <p className="text-xs leading-[1.75] text-[#10233D]/55 font-manrope">
                          {deal.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-ocean font-manrope">
                      <span>{deal.ctaText}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            /* Fallback Grid when category filters are active */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {DEAL_OFFERS.filter(
                (deal) =>
                  deal.category === selectedDealsFilter.replace(" Deals", "") ||
                  (selectedDealsFilter === "Creators" && deal.category === "Creators") ||
                  (selectedDealsFilter === "Students" && deal.category === "Students")
              ).map((deal) => (
                <Link
                  key={deal.slug}
                  href={`/deals/${deal.slug}`}
                  className="group relative flex flex-col justify-between rounded-[28px] border border-ocean/8 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-ocean/20 hover:shadow-md"
                >
                  <div className="space-y-4">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-ivory/40 flex items-center justify-center p-3">
                      <img
                        src={deal.image}
                        alt={deal.title}
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105 select-none"
                      />
                      <span className={`absolute left-3 top-3 rounded-full px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-sm ${
                        deal.badgeType === "red"
                          ? "bg-red-500 text-white"
                          : "bg-ocean text-white"
                      }`}>
                        {deal.badge}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-clash text-lg font-bold text-[#10233D] tracking-tight">
                        {deal.title}
                      </h4>
                      <p className="text-xs leading-[1.75] text-[#10233D]/55 font-manrope">
                        {deal.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-ocean font-manrope">
                    <span>{deal.ctaText}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          04 — SHOP BY CATEGORY
      ════════════════════════════════════════════════════════════════════ */}
      <section
        id="categories"
        className="bg-white px-4 py-20 sm:px-6 md:px-12 md:py-28 border-t border-ocean/5"
      >
        <div className="mx-auto max-w-[1320px] space-y-10">

          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3 max-w-2xl">
              <span className="section-label">SHOP BY CATEGORY</span>
              <h2 className="font-clash text-3xl font-bold leading-tight text-[#10233D] sm:text-4xl lg:text-[44px]">
                Everything Tech.<br />One Place.
              </h2>
              <p className="text-sm leading-[1.8] text-[#10233D]/60 font-manrope">
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

          {/* Category cards — 2-col on mobile, masonry-like on desktop */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/products/${category.slug}`}
                className={`group relative overflow-hidden rounded-[24px] bg-[#10233D] h-[220px] sm:h-[280px] md:h-[340px] ${
                  category.featured ? "col-span-2 md:col-span-2" : "col-span-1"
                }`}
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent transition-colors duration-300 group-hover:from-black/65" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-5 sm:p-6 z-10">
                  <h3 className="font-clash text-lg font-bold text-white sm:text-xl">{category.name}</h3>
                  <p className="text-xs text-white/70 font-manrope mt-0.5">{category.productCount}+ Products</p>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-white/80 uppercase tracking-wider font-manrope opacity-0 translate-y-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <span>Explore</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          05 — BRANDS
      ════════════════════════════════════════════════════════════════════ */}
      <Brands />

      {/* ════════════════════════════════════════════════════════════════════
          06 — TRENDING PRODUCTS
      ════════════════════════════════════════════════════════════════════ */}
      <section id="products" className="mx-auto max-w-[1320px] space-y-8 px-4 py-20 sm:px-6 md:px-12 md:py-28">

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3 max-w-2xl">
            <span className="section-label">TRENDING NOW</span>
            <h2 className="font-clash text-3xl font-bold leading-tight text-[#10233D] sm:text-4xl">
              Popular Tech Picks
            </h2>
            <p className="text-sm leading-[1.8] text-[#10233D]/60 font-manrope">
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

        {/* Filter tabs + sort */}
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
                      : "text-ocean/45 hover:text-ocean hover:bg-ocean/5"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-ocean/45 font-manrope">Sort by:</span>
            <select className="bg-transparent border-none text-xs font-bold text-[#10233D] focus:ring-0 outline-none cursor-pointer font-manrope">
              <option>Popular</option>
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
            </select>
          </div>
        </div>

        {/* Product grid */}
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
          <div className="space-y-4 rounded-[28px] border border-dashed border-black/6 bg-white/40 py-24 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-ocean/20" />
            <h3 className="font-clash text-lg font-bold text-[#10233D]">No products found</h3>
            <p className="mx-auto max-w-sm text-sm text-ocean/55 font-manrope">
              We couldn&apos;t find matches for your current filters. Try selecting a different category.
            </p>
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          07 — CREATOR ESSENTIALS
      ════════════════════════════════════════════════════════════════════ */}
      <CreatorEssentials />

      {/* ════════════════════════════════════════════════════════════════════
          08 — EVERYDAY TECH
      ════════════════════════════════════════════════════════════════════ */}
      <EverydayTech />

      {/* ════════════════════════════════════════════════════════════════════
          09 — REVIEWS
      ════════════════════════════════════════════════════════════════════ */}
      <Reviews />

      {/* ════════════════════════════════════════════════════════════════════
          10 — FAQ
      ════════════════════════════════════════════════════════════════════ */}
      <FAQSupport />

      {/* ════════════════════════════════════════════════════════════════════
          11 — FINAL CTA
      ════════════════════════════════════════════════════════════════════ */}
      <CTA />

      {/* ════════════════════════════════════════════════════════════════════
          12 — FOOTER
      ════════════════════════════════════════════════════════════════════ */}
      <Footer />

      {/* ── Reservation modal ─────────────────────────────────────────────── */}
      <ReservationModal
        key={selectedProduct?.id ?? "none"}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSuccess={(prod) => addToCart(prod.id)}
      />
    </div>
  );
}
