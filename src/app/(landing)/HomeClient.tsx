"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, ArrowRight, Search as SearchIcon } from "lucide-react";
import { cn }                      from "@/lib/utils";
import { Navbar }             from "@/components/navbar/Navbar";
import { ProductCard }        from "@/components/products/ProductCard";
import { ReservationModal }   from "@/components/ui/reservation-modal";
import { Product }            from "@/data/mock-data";
import { useApp }             from "@/context/AppContext";
import { useSearch }          from "@/hooks/useSearch";
import { getSessionId, notifyCartChanged } from "@/hooks/use-cart";
import { addCartItemBySlug }  from "@/actions/cart";
import { getProductStatus }   from "@/lib/product-status";
import { MOTION, gridStaggerDelay } from "@/lib/motion";
import { Reveal }            from "@/components/ui/Reveal";
import { HeroSection, HeroSlideData } from "@/components/hero/Hero";
import { FeaturedCategories } from "@/app/(landing)/sections/FeaturedCategories";
import { NewArrivals }         from "@/app/(landing)/sections/NewArrivals";
import { Promotions }          from "@/app/(landing)/sections/Promotions";
import { Brands }             from "@/app/(landing)/sections/Brands";
import { WhyChooseUs }        from "@/app/(landing)/sections/WhyChooseUs";
import { Reviews }            from "@/app/(landing)/sections/Reviews";
import { FAQSupport }         from "@/app/(landing)/sections/FAQSupport";
import { TradeIn }            from "@/app/(landing)/sections/TradeIn";
import CTA                    from "@/app/(landing)/sections/CTA";

import Footer                 from "@/components/ui/Footer";
import type { HomepageData }  from "@/data/homepage";

interface HomeClientProps {
  data: HomepageData;
}

export default function HomeClient({ data }: HomeClientProps) {
  const [selectedProduct,       setSelectedProduct]       = useState<Product | null>(null);
  const [showPreloader,         setShowPreloader]         = useState(false);
  const [preloaderFadeOut,      setPreloaderFadeOut]      = useState(false);

  useEffect(() => {
    const isClientNavigated = typeof window !== "undefined" && (window as any).__gh_loaded;
    
    if (!isClientNavigated) {
      setShowPreloader(true);
      document.body.style.overflow = "hidden";
      
      const fadeTimer = setTimeout(() => {
        setPreloaderFadeOut(true);
      }, 3000);
      
      const removeTimer = setTimeout(() => {
        setShowPreloader(false);
        document.body.style.overflow = "";
        if (typeof window !== "undefined") {
          (window as any).__gh_loaded = true;
        }
      }, 3500);
      
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
        document.body.style.overflow = "";
      };
    }
  }, []);

  const {
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    selectedBrand, setSelectedBrand,
    showDealsOnly, setShowDealsOnly,
    registerProducts,
  } = useApp();

  const products = data.featuredProducts;

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

  const heroSlidesRaw: HeroSlideData[] = data.heroSlides.length > 0
    ? data.heroSlides.map((s) => {
        const prod = s.slug ? products.find((p) => p.slug === s.slug) : undefined;
        return { ...s, status: prod ? getProductStatus(prod) : null };
      })
    : products.slice(0, 5).map((p) => ({
        id: p.id, badge: p.badge || "NEW ARRIVAL", title: p.title,
        description: p.description, price: p.price, originalPrice: p.originalPrice,
        currency: p.currency, image: p.image, slug: p.slug,
        status: getProductStatus(p),
      }));

  const heroSlides: HeroSlideData[] = heroSlidesRaw.length > 0
    ? heroSlidesRaw
    : [{
        id: "fallback-hero", badge: "NEW ARRIVAL",
        title: "Discover the Latest Tech",
        description: "Premium smartphones, laptops, and accessories at the best prices in Rwanda.",
        price: 0, currency: "RWF",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1200", slug: "products",
        status: null,
      }];

  const newArrivals = data.newArrivals.length > 0 ? data.newArrivals : products.slice(0, 6);

  return (
    <div className="flex-1 pt-24">
      {showPreloader && (
        <div
          className={cn(
            "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a1f3a] transition-all duration-500 ease-in-out",
            preloaderFadeOut ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
          )}
        >
          {/* Soft background glow design */}
          <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-[#0b5497]/15 blur-[80px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-[#0f70c9]/10 blur-[100px] animate-pulse [animation-delay:1s]" />

          <div className="relative z-10 flex flex-col items-center text-center px-4">
            {/* Logo display */}
            <div className="mb-6 relative scale-110">
              <Image
                src="/g-hub logo ii.png"
                alt="Galaxy Hub"
                width={184}
                height={40}
                preload
                className="h-10 w-auto object-contain select-none animate-pulse duration-1500"
              />
              <div className="absolute -inset-4 bg-white/5 blur-xl rounded-full -z-10" />
            </div>

            {/* Moving Loading Line */}
            <div className="w-40 h-[3px] bg-white/10 rounded-full overflow-hidden relative">
              <div className="h-full bg-gradient-to-r from-[#0b5497] via-[#0f70c9] to-[#0b5497] w-1/2 rounded-full absolute animate-loading-bar" />
            </div>

            {/* Subtext info */}
            <div className="mt-5 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#0f70c9] animate-pulse">
                Galaxy Hub Rwanda
              </p>
              <p className="text-xs text-white/40 font-medium">
                Genuine Tech Guaranteed
              </p>
            </div>
          </div>
        </div>
      )}
      <Navbar />

      <HeroSection slides={heroSlides} />

      <FeaturedCategories categories={data.categories} />

      <NewArrivals products={newArrivals} onReserve={setSelectedProduct} />

      <Promotions promotions={data.promotions} />

      <Brands brands={data.brands} />

      {/* ── SEARCH RESULTS ── */}
      {hasActiveSearch && (
        <section className="bg-white px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-[1320px]">
            <div className="max-w-2xl">
              <Reveal y={8}>
                <span className="section-label">SEARCH RESULTS</span>
              </Reveal>
              <Reveal y={14} delay={MOTION.stagger}>
                <h2 className="font-clash text-2xl sm:text-3xl font-bold leading-tight text-ocean-deeper mt-3">
                  "{searchQuery}"
                </h2>
              </Reveal>
              <Reveal y={12} delay={MOTION.stagger * 2}>
                <p className="mt-3 text-sm leading-relaxed text-ocean-deeper/60 max-w-xl">
                  {displayedProducts.length === 0
                    ? "No products matched your search. Try a different term."
                    : `${displayedProducts.length} product${displayedProducts.length !== 1 ? "s" : ""} found`}
                </p>
              </Reveal>
            </div>

            {displayedProducts.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                {displayedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} onReserve={setSelectedProduct} delay={gridStaggerDelay(index)} />
                ))}
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-center justify-center rounded-card border border-ocean/8 bg-white py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ocean/5 mb-4">
                  <SearchIcon className="h-7 w-7 text-ocean/20" />
                </div>
                <h3 className="font-clash text-xl font-bold text-ocean-deeper mb-2">No products found</h3>
                <p className="text-sm text-ocean/50 max-w-sm">
                  Try searching with different keywords — check your spelling or use broader terms like "iPhone" or "headphones".
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 rounded-btn bg-ocean-deeper h-11 px-5 text-sm font-bold text-white shadow-btn transition-all duration-250 hover:bg-ocean-dark"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── TRENDING PRODUCTS (hidden when search active) ── */}
      {!hasActiveSearch && (
        <section id="products" className="bg-white px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-[1320px]">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl space-y-3">
                <Reveal y={8}>
                  <span className="section-label">TRENDING NOW</span>
                </Reveal>
                <Reveal y={14} delay={MOTION.stagger}>
                  <h2 className="font-clash text-2xl sm:text-3xl font-bold leading-tight text-ocean-deeper">
                    Popular Tech Picks
                  </h2>
                </Reveal>
              </div>
            </div>

          {products.length > 0 ? (
            <>
              <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} onReserve={setSelectedProduct} delay={gridStaggerDelay(index)} />
                ))}
              </div>
              <Reveal y={10} delay={MOTION.stagger * 3}>
                <div className="mt-10 flex justify-center">
                  <Link
                    href="/products"
                    className="text-action min-h-[44px] px-2"
                  >
                    View All Products <ArrowRight className="ta-arrow" />
                  </Link>
                </div>
              </Reveal>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-ocean/10 bg-white/80 py-16 text-center">
              <AlertCircle className="mx-auto h-10 w-10 text-ocean/30" />
              <h3 className="font-clash text-lg font-bold text-ocean-deeper mt-4">No products found</h3>
              <p className="mt-2 text-sm text-ocean/50">New products are on the way — check back soon.</p>
            </div>
          )}
          </div>
        </section>
      )}

      <TradeIn />

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
