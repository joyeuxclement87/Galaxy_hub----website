"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  Search,
  Shield,
  ShoppingBag,
  Star,
  Store,
} from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { ProductCard } from "@/components/ui/product-card";
import { ReservationModal } from "@/components/ui/reservation-modal";
import { PRODUCTS, Product, HERO_CMS_CONTENT, HERO_SPOTLIGHT_SLIDES, TRENDING_KEYWORDS, QUICK_FILTERS, POPULAR_SEARCH_CARDS, DEALS_QUICK_FILTERS, DEAL_OFFERS, CATEGORIES } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { Brands } from "@/app/(landing)/sections/Brands";
import { Reviews } from "@/app/(landing)/sections/Reviews";
import { FAQSupport } from "@/app/(landing)/sections/FAQSupport";
import CTA from "@/app/(landing)/sections/CTA";
import Footer from "@/components/ui/Footer";




// Removed: WHY_GALAXY_HUB editorial constant (moved to CMS)

const FOOTER_COLUMNS = {
  products: ["Smartphones", "Accessories", "Laptops", "Smartwatches", "Audio"],
  support: ["Reservation Process", "Warranty", "Delivery", "FAQs", "Contact"],
  visit: ["TCB Floor: 1B, Door: 13B, Kigali, Rwanda", "Mon - Sat • 9:00 - 20:00", "Google Maps", "WhatsApp", "Telegram"],
};

function DealCountdown() {
  const [timeLeft, setTimeLeft] = React.useState({
    days: "04",
    hours: "12",
    minutes: "18",
    seconds: "00",
  });

  React.useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 4);
    targetDate.setHours(targetDate.getHours() + 12);

    const updateTimer = () => {
      const difference = +targetDate - +new Date();
      if (difference <= 0) return;

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2">
      <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#10233D]/45 font-manrope">
        ENDS IN
      </span>
      <div className="flex gap-3">
        <div className="text-center">
          <span className="block font-clash text-2xl font-bold text-[#10233D]">{timeLeft.days}</span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#10233D]/40 font-manrope">Days</span>
        </div>
        <span className="text-xl font-bold text-[#10233D]/30">:</span>
        <div className="text-center">
          <span className="block font-clash text-2xl font-bold text-[#10233D]">{timeLeft.hours}</span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#10233D]/40 font-manrope">Hours</span>
        </div>
        <span className="text-xl font-bold text-[#10233D]/30">:</span>
        <div className="text-center">
          <span className="block font-clash text-2xl font-bold text-[#10233D]">{timeLeft.minutes}</span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#10233D]/40 font-manrope">Mins</span>
        </div>
        <span className="text-xl font-bold text-[#10233D]/30">:</span>
        <div className="text-center">
          <span className="block font-clash text-2xl font-bold text-[#10233D]">{timeLeft.seconds}</span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#10233D]/40 font-manrope">Secs</span>
        </div>
      </div>
    </div>
  );
}

export default function ShowroomHome() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [popularSearchFilter, setPopularSearchFilter] = useState("All");
  const [selectedDealsFilter, setSelectedDealsFilter] = useState("All Deals");
  const smartSearchRef = useRef<HTMLInputElement>(null);
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    showDealsOnly,
    setShowDealsOnly,
    addToCart,
    wishlist,
  } = useApp();

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Hash listener for anchor redirects
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === "#deals") {
        setShowDealsOnly(true);
        setSelectedCategory("All");
        setSelectedBrand("All");
        const el = document.getElementById("products");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else if (hash === "#products") {
        setShowDealsOnly(false);
        const el = document.getElementById("products");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else if (hash === "#brands") {
        const el = document.getElementById("brands");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [setSelectedCategory, setSelectedBrand, setShowDealsOnly]);

  const fuse = new Fuse(PRODUCTS, {
    keys: ["title", "tagline", "description", "category", "brand", "specifications"],
    threshold: 0.3,
  });

  const categories = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];
  const brandsList = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.brand)))];
  const featuredProduct = PRODUCTS.find((p) => p.featured) || PRODUCTS[0];
  const samsungProduct = PRODUCTS.find((p) => p.brand === "Samsung") || PRODUCTS[1] || PRODUCTS[0];

  let displayedProducts = PRODUCTS;

  if (searchQuery.trim() !== "") {
    displayedProducts = fuse.search(searchQuery).map((result) => result.item);
  }

  if (showDealsOnly) {
    displayedProducts = displayedProducts.filter(
      (p) => p.originalPrice !== undefined || p.availability === "Limited Stock"
    );
  }

  if (selectedCategory === "Wishlist") {
    displayedProducts = displayedProducts.filter((p) => wishlist.includes(p.id));
  } else if (selectedCategory !== "All") {
    displayedProducts = displayedProducts.filter((p) => p.category === selectedCategory);
  }

  if (selectedBrand !== "All") {
    displayedProducts = displayedProducts.filter((p) => p.brand === selectedBrand);
  }

  const focusSearchInput = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const [activeSlide, setActiveSlide] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const heroSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (carouselPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SPOTLIGHT_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselPaused]);

  const goToSlide = (index: number) => {
    setActiveSlide(((index % HERO_SPOTLIGHT_SLIDES.length) + HERO_SPOTLIGHT_SLIDES.length) % HERO_SPOTLIGHT_SLIDES.length);
  };

  const activeSpotlight = HERO_SPOTLIGHT_SLIDES[activeSlide];

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const val = heroSearchRef.current?.value ?? "";
    if (val.trim()) {
      setSearchQuery(val.trim());
      setShowDealsOnly(false);
      setSelectedCategory("All");
      setSelectedBrand("All");
      const el = document.getElementById("products");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePillClick = (keyword: string) => {
    setSearchQuery(keyword);
    setShowDealsOnly(false);
    setSelectedCategory("All");
    setSelectedBrand("All");
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleSmartSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const val = smartSearchRef.current?.value ?? "";
    if (val.trim()) {
      setSearchQuery(val.trim());
      setShowDealsOnly(false);
      setSelectedCategory("All");
      setSelectedBrand("All");
      const el = document.getElementById("products");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex-1 pt-18 lg:pt-22">
      <Navbar onSearchFocus={focusSearchInput} />

      {/* ── Premium Editorial Hero ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ivory px-6 pt-12 pb-12 md:px-12 lg:pt-14 lg:pb-16">
        {/* Single subtle Ocean Blue radial accent behind the right column */}
        <div
          className="pointer-events-none absolute top-1/2 right-0 h-[800px] w-[800px] -translate-y-1/2 translate-x-[15%] opacity-70"
          style={{ background: activeSpotlight.bgAccent }}
        />

        <div className="relative z-10 mx-auto grid max-w-[1320px] items-start gap-12 lg:grid-cols-12 lg:gap-16">

          {/* ── Left Column (45%) ──────────────────────────────────────── */}
          <div className="space-y-8 lg:col-span-5 lg:py-8">
            {/* Location Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ocean/15 bg-ivory px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em] text-ocean shadow-[0_4px_12px_rgba(11,84,151,0.06)]">
              <MapPin className="h-3 w-3 text-accent" />
              {HERO_CMS_CONTENT.badge}
            </span>

            {/* Editorial Headline */}
            <div className="space-y-5">
              <h1 className="font-clash text-[40px] font-bold leading-[1.02] tracking-[-0.03em] text-[#10233D] sm:text-[50px] lg:text-[56px]">
                {HERO_CMS_CONTENT.headline.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </h1>
              <p className="max-w-[480px] text-[15px] leading-[1.8] text-[#10233D]/65 sm:text-base">
                {HERO_CMS_CONTENT.description}
              </p>
            </div>

            {/* Hero Search Bar */}
            <div className="max-w-[480px]">
              <form onSubmit={handleHeroSearch} className="flex items-center gap-0 rounded-[16px] border border-ocean/12 bg-white shadow-[0_4px_16px_rgba(11,84,151,0.06)] transition-shadow duration-300 focus-within:shadow-[0_8px_28px_rgba(11,84,151,0.10)] focus-within:border-ocean/20">
                <Search className="ml-4 h-[18px] w-[18px] shrink-0 text-ocean/40" />
                <input
                  ref={heroSearchRef}
                  type="text"
                  placeholder={HERO_CMS_CONTENT.searchPlaceholder}
                  className="flex-1 border-none bg-transparent px-3 py-3.5 text-sm text-ocean placeholder:text-ocean/35 focus:outline-none"
                />
                <button
                  type="submit"
                  className="mr-1.5 shrink-0 rounded-[12px] bg-ocean px-5 py-2.5 text-xs font-bold text-ivory transition-all duration-200 hover:bg-ocean-dark cursor-pointer"
                >
                  Search
                </button>
              </form>

              {/* Popular Searches */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ocean/40">Popular:</span>
                {HERO_CMS_CONTENT.popularSearches.map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => handlePillClick(keyword)}
                    className="rounded-full border border-ocean/8 bg-ocean-light/30 px-3 py-1 text-[11px] font-medium text-ocean/70 transition-all duration-200 hover:border-ocean/18 hover:bg-ocean-light/60 hover:text-ocean cursor-pointer"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:max-w-[400px]">
              <Button variant="primary" className="gap-2 px-7" onClick={scrollToProducts}>
                {HERO_CMS_CONTENT.primaryBtnText}
              </Button>
              <Button variant="secondary" className="gap-2 bg-transparent" onClick={() => setSelectedProduct(featuredProduct)}>
                <ShoppingBag className="h-4 w-4" />
                {HERO_CMS_CONTENT.secondaryBtnText}
              </Button>
            </div>

            {/* Trust Row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-medium text-ocean/55">
              {HERO_CMS_CONTENT.trustRow.map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <span className="text-emerald-500">✓</span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right Column (55%) — Spotlight Carousel ────────────────── */}
          <div
            className="lg:col-span-7"
            onMouseEnter={() => setCarouselPaused(true)}
            onMouseLeave={() => setCarouselPaused(false)}
          >
            <div className="relative mx-auto w-full max-w-[620px]">
              {/* Product image container */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-[#f5f4f0] sm:aspect-square">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSpotlight.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeSpotlight.image}
                      alt={activeSpotlight.title}
                      fill
                      priority={activeSlide === 0}
                      loading={activeSlide === 0 ? undefined : "lazy"}
                      sizes="(min-width: 1024px) 620px, 90vw"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Category badge over image */}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`cat-${activeSpotlight.id}`}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className="absolute left-5 top-5 z-10 rounded-full border border-white/40 bg-white/80 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-ocean shadow-sm backdrop-blur-md"
                  >
                    {activeSpotlight.category}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Product title + features below image */}
              <div className="mt-5 space-y-4">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={`title-${activeSpotlight.id}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35 }}
                    className="font-clash text-xl font-bold text-[#10233D] sm:text-2xl"
                  >
                    {activeSpotlight.title}
                  </motion.h2>
                </AnimatePresence>

                {/* Feature bubbles */}
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence mode="wait">
                    {activeSpotlight.features.map((feat, idx) => (
                      <motion.span
                        key={`${activeSpotlight.id}-feat-${idx}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.3, delay: 0.06 * idx }}
                        className="rounded-full border border-ocean/10 bg-white px-3.5 py-1.5 text-[11px] font-medium text-ocean/75 shadow-[0_2px_8px_rgba(11,84,151,0.05)]"
                      >
                        {feat}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Carousel Controls */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {HERO_SPOTLIGHT_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      aria-label={`Go to ${slide.title}`}
                      className={idx === activeSlide
                        ? "h-1.5 w-8 rounded-full bg-ocean transition-all duration-300 cursor-pointer"
                        : "h-1.5 w-1.5 rounded-full bg-ocean/20 transition-all duration-300 cursor-pointer hover:bg-ocean/40"
                      }
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToSlide(activeSlide - 1)}
                    aria-label="Previous product"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ocean/12 text-ocean/50 transition-all duration-200 hover:border-ocean/30 hover:text-ocean cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => goToSlide(activeSlide + 1)}
                    aria-label="Next product"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ocean/12 text-ocean/50 transition-all duration-200 hover:border-ocean/30 hover:text-ocean cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Quick Statistics Banner ──────────────────────────────────── */}
      <section className="relative z-20 -mt-4 px-6 md:px-12">
        <div className="mx-auto max-w-[1320px]">
          <div className="rounded-[24px] border border-ocean/8 bg-white p-6 shadow-[0_16px_40px_rgba(11,84,151,0.06)] md:p-8">
            <div className="grid grid-cols-2 gap-y-8 md:grid-cols-4 md:gap-y-0 divide-y md:divide-y-0 md:divide-x divide-ocean/8">
              {HERO_CMS_CONTENT.statistics.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center text-center px-4 first:pt-0 last:pb-0 md:py-2 md:first:border-l-0">
                  <span className="block font-clash text-3xl font-extrabold tracking-tight text-[#10233D] sm:text-4xl">
                    {stat.value}
                  </span>
                  <span className="mt-1.5 block text-[11px] font-bold uppercase tracking-[0.15em] text-ocean/50 font-manrope">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Popular Searches & Quick Access ──────────────────────────── */}
      <section className="bg-white border-t border-ocean/5 px-6 py-20 md:px-12">
        <div className="mx-auto max-w-[1320px] space-y-12">

          {/* 1. Trending Search Strip */}
          <div className="flex flex-col gap-3 border-b border-ocean/6 pb-6 sm:flex-row sm:items-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-ocean/45 whitespace-nowrap shrink-0 font-manrope">
              🔥 Trending
            </span>
            <div 
              className="flex items-center gap-2 overflow-x-auto pb-1 flex-nowrap whitespace-nowrap no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {TRENDING_KEYWORDS.map((keyword) => (
                <Link
                  key={keyword}
                  href={`/search?q=${encodeURIComponent(keyword)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePillClick(keyword);
                  }}
                  className="rounded-full border border-ocean/8 bg-ocean-light/20 px-3.5 py-1 text-xs font-semibold text-ocean transition-all duration-200 hover:border-ocean/20 hover:bg-ocean-light/50 font-manrope"
                >
                  {keyword}
                </Link>
              ))}
            </div>
          </div>

          {/* 2. Main Layout (Left 30% Editorial, Right 70% Cards Grid) */}
          <div className="grid gap-12 lg:grid-cols-10 lg:gap-16">
            
            {/* Left Column (30%) */}
            <div className="lg:col-span-3 space-y-6">
              <div className="space-y-4">
                <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-accent font-manrope">
                  POPULAR SEARCHES
                </span>
                <h2 className="font-clash text-3xl font-bold leading-tight text-[#10233D] sm:text-4xl">
                  Find What You're Looking For
                </h2>
                <p className="text-sm leading-relaxed text-[#10233D]/65 font-manrope">
                  Browse the gadgets and accessories our customers search for the most.
                </p>
              </div>
              <button
                onClick={scrollToProducts}
                className="inline-flex items-center gap-2 text-sm font-bold text-ocean transition-colors duration-200 hover:text-ocean-dark group cursor-pointer font-manrope"
              >
                Browse All Products 
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Right Column (70%) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Quick Filters */}
              <div 
                className="flex items-center gap-2 overflow-x-auto pb-2 flex-nowrap whitespace-nowrap no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {QUICK_FILTERS.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setPopularSearchFilter(filter)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer font-manrope ${
                      popularSearchFilter === filter
                        ? "bg-ocean text-white shadow-sm"
                        : "bg-ocean-light/10 text-ocean hover:bg-ocean-light/20"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Grid / Horizontal list on mobile */}
              <div 
                className="flex gap-4 overflow-x-auto pb-4 flex-nowrap no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {POPULAR_SEARCH_CARDS.filter(
                  (card) => popularSearchFilter === "All" || card.category === popularSearchFilter
                ).map((card) => (
                  <Link
                    key={card.keyword}
                    href={`/search?q=${encodeURIComponent(card.keyword)}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePillClick(card.keyword);
                    }}
                    className="group relative block w-[240px] shrink-0 rounded-[22px] border border-ocean/8 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-ocean/30 hover:shadow-md md:w-auto md:shrink"
                  >
                    <div className="relative aspect-square w-full mb-4 overflow-hidden rounded-xl bg-ivory/60 flex items-center justify-center">
                      <img
                        src={card.image}
                        alt={card.keyword}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] select-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-clash text-base font-bold text-[#10233D] tracking-tight">
                        {card.keyword}
                      </h4>
                      <p className="text-xs text-ocean/50 font-manrope">
                        {card.count} products
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-xs font-bold text-ocean font-manrope">
                      <span>Explore</span>
                      <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Smart Search CTA removed per request */}
        </div>
      </section>

      {/* ── Featured Deals & Offers ──────────────────────────────────── */}
      <section className="bg-ivory border-t border-ocean/5 px-6 py-20 md:px-12">
        <div className="mx-auto max-w-[1320px] space-y-10">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-accent font-manrope">
                FEATURED DEALS
              </span>
              <h2 className="font-clash text-3xl font-bold leading-tight text-[#10233D] sm:text-4xl">
                Today's Best Tech Deals
              </h2>
              <p className="text-sm leading-relaxed text-[#10233D]/65 font-manrope">
                Discover exclusive offers on genuine gadgets, accessories, and creator gear available across Rwanda.
              </p>
            </div>
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 text-sm font-bold text-ocean transition-colors duration-200 hover:text-ocean-dark group font-manrope"
            >
              View All Deals
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Smart Filters */}
          <div 
            className="flex items-center gap-2 overflow-x-auto pb-2 flex-nowrap whitespace-nowrap no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {DEALS_QUICK_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedDealsFilter(filter)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer font-manrope ${
                  selectedDealsFilter === filter
                    ? "bg-ocean text-white shadow-sm"
                    : "bg-white border border-ocean/8 text-ocean hover:bg-ocean-light/10"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Dynamic Grid Rendering */}
          {selectedDealsFilter === "All Deals" ? (
            /* Premium Editorial Campaign Grid for "All Deals" */
            <div className="space-y-6">
              {/* Top Row: Left (Large), Right (2 Medium Stacked) */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Large Card: iPhone Collection (2/3 width) */}
                {(() => {
                  const deal = DEAL_OFFERS[0];
                  return (
                    <Link
                      href={`/deals/${deal.slug}`}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-ocean/8 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-ocean/30 hover:shadow-md lg:col-span-2"
                    >
                      <div className="grid gap-8 sm:grid-cols-2 h-full items-center">
                        <div className="space-y-6 z-10">
                          <span className="inline-block rounded-full bg-red-50 text-red-500 border border-red-100 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                            {deal.badge}
                          </span>
                          <div className="space-y-2">
                            <h3 className="font-clash text-2xl font-bold text-[#10233D] sm:text-3xl tracking-tight">
                              {deal.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-[#10233D]/65 font-manrope">
                              {deal.description}
                            </p>
                          </div>
                          <DealCountdown />
                        </div>
                        <div className="relative aspect-square w-full rounded-2xl bg-ivory/60 overflow-hidden flex items-center justify-center">
                          <img
                            src={deal.image}
                            alt={deal.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 select-none"
                          />
                        </div>
                      </div>
                      <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-ocean font-manrope">
                        <span>{deal.ctaText}</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </div>
                    </Link>
                  );
                })()}

                {/* Right Column: 2 Medium Stacked */}
                <div className="flex flex-col gap-6">
                  {DEAL_OFFERS.slice(1, 3).map((deal) => (
                    <Link
                      key={deal.slug}
                      href={`/deals/${deal.slug}`}
                      className="group relative flex flex-row items-center justify-between rounded-[28px] border border-ocean/8 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-ocean/30 hover:shadow-md h-[calc(50%-12px)]"
                    >
                      <div className="flex-1 space-y-4 pr-4">
                        <span className="inline-block rounded-full bg-ocean-light/15 border border-ocean/8 px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ocean">
                          {deal.badge}
                        </span>
                        <div className="space-y-1">
                          <h4 className="font-clash text-lg font-bold text-[#10233D] tracking-tight">
                            {deal.title}
                          </h4>
                          <p className="text-xs leading-relaxed text-[#10233D]/60 font-manrope line-clamp-2">
                            {deal.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-ocean font-manrope">
                          <span>{deal.ctaText}</span>
                          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </div>
                      </div>
                      <div className="relative aspect-square w-28 rounded-xl bg-ivory/60 overflow-hidden shrink-0 flex items-center justify-center">
                        <img
                          src={deal.image}
                          alt={deal.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 select-none"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Bottom Row: 3 Small Cards */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {DEAL_OFFERS.slice(3, 6).map((deal) => (
                  <Link
                    key={deal.slug}
                    href={`/deals/${deal.slug}`}
                    className="group relative flex flex-col justify-between rounded-[28px] border border-ocean/8 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-ocean/30 hover:shadow-md"
                  >
                    <div className="space-y-4">
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-ivory/60">
                        <img
                          src={deal.image}
                          alt={deal.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 select-none"
                        />
                        <span
                          className={`absolute left-4 top-4 rounded-full px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-sm ${
                            deal.badgeType === "red"
                              ? "bg-red-500 text-white"
                              : "bg-ocean text-white"
                          }`}
                        >
                          {deal.badge}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-clash text-lg font-bold text-[#10233D] tracking-tight">
                          {deal.title}
                        </h4>
                        <p className="text-xs leading-relaxed text-[#10233D]/60 font-manrope">
                          {deal.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-ocean font-manrope">
                      <span>{deal.ctaText}</span>
                      <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            /* Fallback Grid when category filters are active */
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {DEAL_OFFERS.filter(
                (deal) => selectedDealsFilter === "All Deals" || deal.category === selectedDealsFilter.replace(" Deals", "") || (selectedDealsFilter === "Creators" && deal.category === "Creators") || (selectedDealsFilter === "Students" && deal.category === "Students")
              ).map((deal) => (
                <Link
                  key={deal.slug}
                  href={`/deals/${deal.slug}`}
                  className="group relative flex flex-col justify-between rounded-[28px] border border-ocean/8 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-ocean/30 hover:shadow-md"
                >
                  <div className="space-y-4">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-ivory/60">
                      <img
                        src={deal.image}
                        alt={deal.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 select-none"
                      />
                      <span
                        className={`absolute left-4 top-4 rounded-full px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-sm ${
                          deal.badgeType === "red"
                            ? "bg-red-500 text-white"
                            : "bg-ocean text-white"
                        }`}
                      >
                        {deal.badge}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-clash text-lg font-bold text-[#10233D] tracking-tight">
                        {deal.title}
                      </h4>
                      <p className="text-xs leading-relaxed text-[#10233D]/60 font-manrope">
                        {deal.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-ocean font-manrope">
                    <span>{deal.ctaText}</span>
                    <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* WHY_GALAXY_HUB section removed */}

            {/* ── Shop by Category ─────────────────────────────────────────── */}
      <section id="categories" className="bg-[#FFFEF9] px-6 py-24 md:px-12 border-t border-ocean/5 relative z-20">
        <div className="mx-auto max-w-[1320px] space-y-12">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-accent font-manrope">
                SHOP BY CATEGORY
              </span>
              <h2 className="font-clash text-3xl font-bold leading-tight text-[#10233D] sm:text-4xl lg:text-[44px]">
                Everything Tech.<br />One Place.
              </h2>
              <p className="text-sm leading-relaxed text-[#10233D]/65 font-manrope">
                Explore smartphones, accessories, creator equipment, and smart devices available in Kigali and delivered across Rwanda.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-bold text-ocean transition-colors duration-200 hover:text-ocean-dark group font-manrope shrink-0"
            >
              View All Products
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Categories Horizontal Scroll Mobile / Grid Desktop */}
          <div 
            className="flex gap-4 overflow-x-auto pb-6 flex-nowrap no-scrollbar md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/products/${category.slug}`}
                className={`group relative overflow-hidden rounded-[32px] bg-[#10233D] shrink-0 w-[280px] h-[360px] md:w-auto ${
                  category.featured ? "md:col-span-2" : "md:col-span-1"
                }`}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-colors duration-300 group-hover:bg-black/30" />
                </div>
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-8 z-10 flex flex-col justify-end h-full transition-transform duration-300 group-hover:-translate-y-2">
                  <div className="space-y-1">
                    <h3 className="font-clash text-2xl font-bold text-white tracking-tight">
                      {category.name}
                    </h3>
                    <p className="text-xs text-white/80 font-manrope">
                      {category.productCount}+ Products
                    </p>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-white uppercase tracking-wider font-manrope opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <span>Explore</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Brands />

            {/* ── Trending Products ─────────────────────────────────────────── */}
      <section id="products" className="mx-auto max-w-[1320px] space-y-10 px-6 py-24 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-accent font-manrope">
              TRENDING NOW
            </span>
            <h2 className="font-clash text-3xl font-bold leading-tight text-[#10233D] sm:text-4xl">
              Popular Tech Picks
            </h2>
            <p className="text-sm leading-relaxed text-[#10233D]/65 font-manrope">
              Discover the devices and accessories customers are choosing most from Galaxy Hub.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-ocean transition-colors duration-200 hover:text-ocean-dark group font-manrope shrink-0"
          >
            View All Products
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Navigation & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ocean/5 pb-4">
          <div 
            className="flex items-center gap-2 overflow-x-auto flex-nowrap whitespace-nowrap no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {["All", "Smartphones", "Laptops", "Audio", "Accessories", "Creator Gear", "Deals"].map((tab) => {
              const isActive = tab === "All" ? (selectedCategory === "All" && !showDealsOnly) : 
                               tab === "Deals" ? showDealsOnly : 
                               (selectedCategory === tab && !showDealsOnly);
                               
              return (
                <button
                  key={tab}
                  onClick={() => {
                    if (tab === "All") {
                      setSelectedCategory("All");
                      setShowDealsOnly(false);
                    } else if (tab === "Deals") {
                      setShowDealsOnly(true);
                    } else {
                      setSelectedCategory(tab);
                      setShowDealsOnly(false);
                    }
                  }}
                  className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all duration-300 font-manrope cursor-pointer ${
                    isActive
                      ? "bg-ocean text-white shadow-md shadow-ocean/20"
                      : "bg-transparent text-ocean/50 hover:text-ocean hover:bg-ocean/5"
                  }`}
                >
                  {tab}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-ocean/50 font-medium font-manrope">Sort by:</span>
            <select className="bg-transparent border-none text-xs font-bold text-[#10233D] focus:ring-0 outline-none cursor-pointer p-0 pr-4 font-manrope">
              <option>Popular</option>
              <option>Newest</option>
              <option>Price Low to High</option>
              <option>Price High to Low</option>
              <option>Rating</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onReserve={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4 rounded-[32px] border border-dashed border-black/5 bg-white/30 py-24 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-ocean/20" />
            <h3 className="font-clash text-lg font-bold text-[#10233D]">
              No products found
            </h3>
            <p className="mx-auto max-w-md text-sm text-ocean/60 font-manrope">
              We couldn't find matches for your current filters. Try selecting a different category.
            </p>
          </div>
        )}
      </section>

      {/* Creator Essentials removed */}

      <Reviews />

      <FAQSupport />

      {/* Showroom details removed */}

      {/* CTA: final conversion section before the footer */}
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
