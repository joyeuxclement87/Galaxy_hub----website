"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Search as SearchIcon } from "lucide-react";
import { cn }                      from "@/lib/utils";
import { Navbar }             from "@/components/navbar/Navbar";
import { ProductCard }        from "@/components/products/ProductCard";
import { ReservationModal }   from "@/components/ui/reservation-modal";
import {
  Product,
  Product as MockProduct,
  DEAL_OFFERS,
} from "@/data/mock-data";
import { useApp }             from "@/context/AppContext";
import { useSearch }          from "@/hooks/useSearch";
import { getSessionId, notifyCartChanged } from "@/hooks/use-cart";
import { addCartItemBySlug }  from "@/actions/cart";
import { HeroSection, HeroSlideData } from "@/components/hero/Hero";
import { FeaturedCategories } from "@/app/(landing)/sections/FeaturedCategories";
import { NewArrivals }         from "@/app/(landing)/sections/NewArrivals";
import { Brands }             from "@/app/(landing)/sections/Brands";
import { WhyChooseUs }        from "@/app/(landing)/sections/WhyChooseUs";
import { Reviews }            from "@/app/(landing)/sections/Reviews";
import { FAQSupport }         from "@/app/(landing)/sections/FAQSupport";
import CTA                    from "@/app/(landing)/sections/CTA";

import Footer                 from "@/components/ui/Footer";
import type { HomepageData }  from "@/data/homepage";

function formatDayTime(iso: string | null | undefined) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-GB", {
    timeZone: "Africa/Kigali",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Live countdown driven by the promotion's real start/end datetimes
 * (from the promotions table). Counts down to the end date; if the deal
 * hasn't started yet it counts down to the start date instead, and once
 * the window is over it shows an "Offer ended" state.
 */
function DealCountdown({
  startDate,
  endDate,
  large = false,
}: {
  startDate?: string | null;
  endDate?: string | null;
  large?: boolean;
}) {
  const [timeLeft, setTimeLeft] = React.useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });
  const [mode, setMode] = React.useState<"countdown" | "ended">("countdown");
  const [label, setLabel] = React.useState("ENDS IN");

  React.useEffect(() => {
    const endMs = endDate ? new Date(endDate).getTime() : null;
    const startMs = startDate ? new Date(startDate).getTime() : null;
    const fallbackMs = (() => {
      const d = new Date();
      d.setDate(d.getDate() + 4);
      d.setHours(d.getHours() + 12);
      return +d;
    })();
    const targetMs = endMs ?? fallbackMs;

    const updateTimer = () => {
      const now = Date.now();
      if (startMs !== null && now < startMs) {
        setLabel("STARTS IN");
        const ms = startMs - now;
        setTimeLeft({
          days: String(Math.floor(ms / 86400000)).padStart(2, "0"),
          hours: String(Math.floor((ms / 3600000) % 24)).padStart(2, "0"),
          minutes: String(Math.floor((ms / 60000) % 60)).padStart(2, "0"),
          seconds: String(Math.floor((ms / 1000) % 60)).padStart(2, "0"),
        });
        return;
      }
      setLabel("ENDS IN");
      const ms = targetMs - now;
      if (ms <= 0) {
        setMode("ended");
        return;
      }
      setMode("countdown");
      setTimeLeft({
        days: String(Math.floor(ms / 86400000)).padStart(2, "0"),
        hours: String(Math.floor((ms / 3600000) % 24)).padStart(2, "0"),
        minutes: String(Math.floor((ms / 60000) % 60)).padStart(2, "0"),
        seconds: String(Math.floor((ms / 1000) % 60)).padStart(2, "0"),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [startDate, endDate]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hrs",  value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  if (mode === "ended") {
    return (
      <div className="rounded-card border border-red-500/15 bg-red-500/[0.04] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-red-500/70">OFFER ENDED</span>
          {endDate && (
            <span className="text-caption font-bold text-red-500/60">Ended {formatDayTime(endDate)}</span>
          )}
        </div>
        {(startDate || endDate) && (
          <p className="mt-1.5 text-caption font-semibold text-ocean/40">
            {startDate && <span>Starts {formatDayTime(startDate)}</span>}
            {startDate && endDate && <span className="mx-1.5 text-ocean/20">→</span>}
            {endDate && <span>Ends {formatDayTime(endDate)}</span>}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-card border border-ocean/[0.08] bg-ivory/70 px-3 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-ocean-deeper/40">{label}</span>
        {endDate && (
          <span className="text-xs font-bold text-ocean/60">
            Ends <span className="font-clash text-xs text-ocean-deeper">{formatDayTime(endDate)}</span>
          </span>
        )}
      </div>
      <div className={cn("mt-2 flex items-stretch gap-1", large && "sm:gap-1.5")}>
        {units.map((unit, i) => (
          <React.Fragment key={unit.label}>
            {i > 0 && (
              <span className={cn("font-clash font-bold leading-none text-ocean-deeper/25 pt-1", large ? "text-sm sm:text-base" : "text-xs")}>
                :
              </span>
            )}
            <div className="flex flex-1 flex-col items-center rounded-btn border border-ocean/[0.08] bg-white px-1 py-1.5 shadow-sm sm:px-1.5">
              <span className={cn("font-clash font-bold leading-none text-ocean-deeper", large ? "text-lg sm:text-xl" : "text-sm")}>
                {unit.value}
              </span>
              <span className={cn("mt-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-ocean/35", large && "sm:text-[10px]")}>
                {unit.label}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
      {(startDate || endDate) && (
        <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-ocean/[0.06] pt-2">
          {startDate ? (
            <span className="min-w-0 truncate text-caption font-semibold text-ocean/45">
              <span className="mr-1 text-caption font-bold uppercase tracking-wider text-ocean/30">Starts</span>
              {formatDayTime(startDate)}
            </span>
          ) : (
            <span />
          )}
          <span className="shrink-0 text-ocean/20">→</span>
          {endDate ? (
            <span className="min-w-0 truncate text-caption font-bold text-ocean-deeper/80">
              <span className="mr-1 text-caption font-bold uppercase tracking-wider text-ocean/40">Ends</span>
              {formatDayTime(endDate)}
            </span>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  );
}

interface HomeClientProps {
  data: HomepageData;
}

export default function HomeClient({ data }: HomeClientProps) {
  const [selectedProduct,       setSelectedProduct]       = useState<Product | null>(null);

  const {
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    selectedBrand, setSelectedBrand,
    showDealsOnly, setShowDealsOnly,
    wishlist, registerProducts,
  } = useApp();

  const products = data.allProducts;

  useEffect(() => {
    if (products && products.length > 0) {
      registerProducts(products.map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        currency: p.currency || "RWF",
        image: p.image,
      })));
    }
  }, [products, registerProducts]);

  const displayedProducts = useSearch(products, searchQuery, {
    category: selectedCategory,
    brand: selectedBrand,
    dealsOnly: showDealsOnly,
  });

  const hasActiveSearch = searchQuery.trim().length > 0;

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

  const scrollToProducts = () => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });

  const heroSlidesRaw: HeroSlideData[] = data.heroSlides.length > 0
    ? data.heroSlides
    : products.slice(0, 5).map((p) => ({
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

  const displayDeals = data.promotions.length > 0 ? data.promotions : DEAL_OFFERS;
  const DEAL_PRODUCT_HREF = "/product/iphone-17-pro";

  const newArrivals = data.newArrivals.length > 0 ? data.newArrivals : products.slice(0, 8);

  return (
    <div className="flex-1 pt-24">
      <Navbar />

      <HeroSection slides={heroSlides} />

      <FeaturedCategories categories={data.categories} />

      <NewArrivals products={newArrivals} onReserve={setSelectedProduct} />

      {/* ── FEATURED DEALS — matches the current card design language ── */}
      <section id="deals" className="bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-[1320px]">
          <div className="max-w-2xl">
            <span className="section-label">FEATURED DEALS</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-ocean-deeper mt-3">
              Today&apos;s Best Tech Deals
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ocean-deeper/60 max-w-xl">
              Grab genuine smartphones, laptops and accessories at unbeatable prices across Rwanda.
            </p>
          </div>

          {displayDeals.length > 0 ? (
            <div
              className={cn(
                "mt-8 grid grid-cols-1 gap-4",
                displayDeals.length === 1
                  ? "sm:grid-cols-1"
                  : displayDeals.length === 2
                    ? "sm:grid-cols-2"
                    : "sm:grid-cols-2 lg:grid-cols-3"
              )}
            >
              {displayDeals.map((deal) => (
                <div
                  key={deal.slug}
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-card border border-ocean/[0.06] bg-white shadow-sm transition-all duration-250 hover:border-ocean/15 hover:shadow-md",
                    displayDeals.length === 1 && "lg:flex-row"
                  )}
                >
                  <div
                    className={cn(
                      "relative overflow-hidden bg-ivory-dark/30 flex items-center justify-center",
                      displayDeals.length === 1
                        ? "aspect-[16/9] w-full lg:aspect-auto lg:w-[45%] lg:min-h-[280px] p-6"
                        : "aspect-[16/10] w-full p-4"
                    )}
                  >
                    <img
                      src={deal.image}
                      alt={deal.title}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.04] select-none"
                    />
                    <span
                      className={`absolute left-3 top-3 rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wider shadow-sm ${
                        deal.badgeType === "red" ? "bg-red-500 text-white" : "bg-ocean text-white"
                      }`}
                    >
                      {deal.badge}
                    </span>
                  </div>
                  <div className={cn("flex flex-1 flex-col", displayDeals.length === 1 ? "p-5 sm:p-6 lg:justify-center" : "p-4")}>
                    <h3 className={cn("font-clash font-bold text-ocean-deeper tracking-tight", displayDeals.length === 1 ? "text-lg sm:text-xl" : "text-sm sm:text-base")}>
                      {deal.title}
                    </h3>
                    {deal.description && (
                      <p className={cn("mt-1 text-xs leading-relaxed text-ocean/55 line-clamp-2", displayDeals.length === 1 && "text-sm line-clamp-3 mt-2")}>
                        {deal.description}
                      </p>
                    )}
                    <div className={cn(displayDeals.length === 1 ? "mt-4" : "mt-3")}>
                      <DealCountdown startDate={deal.startsAt} endDate={deal.endsAt} large={displayDeals.length === 1} />
                    </div>
                    <div className={cn(displayDeals.length === 1 ? "mt-4" : "mt-3")}>
                      <Link
                        href={DEAL_PRODUCT_HREF}
                        className="inline-flex h-11 items-center justify-center gap-1.5 rounded-btn bg-ocean-deeper px-5 text-sm font-bold text-white shadow-btn transition-all duration-250 hover:bg-ocean-dark hover:shadow-btn-hover"
                      >
                        {deal.ctaText}
                        <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center justify-center rounded-card border border-dashed border-ocean/[0.08] bg-white/50 py-14 text-center">
              <AlertCircle className="mx-auto h-10 w-10 text-ocean/30" />
              <p className="mt-3 text-sm text-ocean/45">No active deals at this time. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <Brands brands={data.brands} />

      {/* ── SEARCH RESULTS ── */}
      {hasActiveSearch && (
        <section className="bg-white px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-[1320px]">
            <div className="max-w-2xl">
              <span className="section-label">SEARCH RESULTS</span>
              <h2 className="font-clash text-2xl sm:text-3xl font-bold leading-tight text-ocean-deeper mt-3">
                "{searchQuery}"
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ocean-deeper/60 max-w-xl">
                {displayedProducts.length === 0
                  ? "No products matched your search. Try a different term."
                  : `${displayedProducts.length} product${displayedProducts.length !== 1 ? "s" : ""} found`}
              </p>
            </div>

            {displayedProducts.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onReserve={setSelectedProduct} />
                ))}
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-center justify-center rounded-card border border-dashed border-ocean/[0.08] bg-white/50 py-16 text-center">
                <SearchIcon className="mb-4 h-10 w-10 text-ocean/30" />
                <h3 className="font-clash text-lg font-bold text-ocean-deeper">No products found</h3>
                <p className="mt-2 text-sm text-ocean/50">Try searching by brand, model, or category name.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── TRENDING PRODUCTS (hidden when search active) ── */}
      {!hasActiveSearch && (
        <section id="products" className="bg-white px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-[1320px] space-y-6">
            <div className="max-w-2xl">
              <span className="section-label">TRENDING NOW</span>
              <h2 className="font-clash text-2xl sm:text-3xl font-bold leading-tight text-ocean-deeper mt-3">
                Popular Tech Picks
              </h2>
            </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-ocean/5 pb-4">
            <div className="flex items-center gap-1.5 overflow-x-auto flex-nowrap no-scrollbar">
              {["All", "Smartphones", "Laptops", "Audio", "Accessories", "Creator Gear", "Deals"].map((tab) => {
                const isActive =
                  tab === "All"   ? selectedCategory === "All" && !showDealsOnly :
                  tab === "Deals" ? showDealsOnly :
                                    selectedCategory === tab && !showDealsOnly;
                return (
                  <button key={tab}
                    onClick={() => {
                      if (tab === "All")   { setSelectedCategory("All"); setShowDealsOnly(false); }
                      else if (tab === "Deals") { setShowDealsOnly(true); }
                      else                 { setSelectedCategory(tab);  setShowDealsOnly(false); }
                    }}
                    className={`whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isActive ? "bg-ocean text-white shadow-sm" : "text-ocean/40 hover:text-ocean hover:bg-ocean/4"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-ocean/40">Sort by:</span>
              <select className="bg-transparent border-none text-xs font-bold text-ocean-deeper focus:ring-0 outline-none cursor-pointer">
                <option>Popular</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
              </select>
            </div>
          </div>

          {displayedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onReserve={setSelectedProduct} />
                ))}
              </div>
              <div className="flex justify-center">
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 rounded-btn border border-ocean/15 bg-white px-7 h-11 text-sm font-bold text-ocean transition-all duration-300 hover:border-ocean/30 hover:text-ocean-dark"
                >
                  View All Products <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-ocean/10 bg-white/80 py-16 text-center">
              <AlertCircle className="mx-auto h-10 w-10 text-ocean/30" />
              <h3 className="font-clash text-lg font-bold text-ocean-deeper mt-4">No products found</h3>
              <p className="mt-2 text-sm text-ocean/50">We couldn&apos;t find matches for your current filters.</p>
            </div>
          )}
          </div>
        </section>
      )}

      <WhyChooseUs />
      <Reviews reviews={data.reviews} />
      <FAQSupport />
      <CTA />
      <Footer />

      <ReservationModal
        key={selectedProduct?.id ?? "none"}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSuccess={(prod) => {
          addCartItemBySlug(getSessionId(), prod.slug);
          notifyCartChanged();
        }}
      />
    </div>
  );
}
