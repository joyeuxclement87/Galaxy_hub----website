"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Shield,
  Star,
  MapPin,
  Clock,
  Phone,
  Store,
  ChevronLeft,
  ChevronRight,
  Info,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { ProductCard } from "@/components/ui/product-card";
import { ReservationModal } from "@/components/ui/reservation-modal";
import { PRODUCTS, HERO_SLIDES, REVIEWS, BRANDS, Product } from "@/data/mock-data";
import { Button } from "@/components/ui/button";

export default function ShowroomHome() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [currentSlide, setCurrentSlide] = useState(0);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Set up Fuse.js for premium local search
  const fuse = new Fuse(PRODUCTS, {
    keys: ["title", "tagline", "description", "category", "brand", "specifications"],
    threshold: 0.3,
  });

  const categories = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];
  const brandsList = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.brand)))];

  // Filtering + Searching logic
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

  const focusSearchInput = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const activeHeroSlide = HERO_SLIDES[currentSlide];
  const activeHeroProduct = PRODUCTS.find((p) => p.id === activeHeroSlide.productId) || PRODUCTS[0];

  return (
    <div className="flex-1 pt-20 lg:pt-28">
      <Navbar
        onSearchFocus={focusSearchInput}
        onReserveClick={() => setSelectedProduct(PRODUCTS.find((p) => p.featured) || PRODUCTS[0])}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center bg-radial from-ocean-light/40 to-transparent py-16 px-6 md:px-12">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(250,249,246,0),#faf9f6)] pointer-events-none z-10" />

        <div className="max-w-[1320px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-6">
            <span className="bg-white/80 backdrop-blur-md border border-black/5 text-[10px] tracking-[0.2em] uppercase font-semibold text-ocean rounded-badge px-4 py-1.5 shadow-sm inline-block">
              {activeHeroSlide.subtitle}
            </span>
            <h1 className="font-sora text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ocean leading-tight">
              {activeHeroSlide.title}
            </h1>
            <p className="text-base sm:text-lg text-ocean/70 leading-relaxed max-w-lg">
              {activeHeroSlide.description}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                variant="primary"
                onClick={() => setSelectedProduct(activeHeroProduct)}
              >
                {activeHeroSlide.primaryAction}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  const el = document.getElementById("products");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {activeHeroSlide.secondaryAction}
              </Button>
            </div>

            {/* Slide Navigation Indicators */}
            <div className="flex items-center gap-3 pt-8">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? "w-8 bg-ocean" : "w-2 bg-ocean/20"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Hero Right Content (Floating Product Image Showcase) */}
          <div className="lg:col-span-6 flex justify-center items-center relative">
            <div className="absolute w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] bg-radial from-ocean/10 to-transparent rounded-full blur-2xl -z-10 animate-pulse" />
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -15 }}
              transition={{ duration: 0.7 }}
              className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center animate-float"
            >
              <img
                src={activeHeroProduct.image}
                alt={activeHeroProduct.title}
                className="object-contain w-full h-full max-h-[90%] drop-shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brands Showcase */}
      <section id="brands" className="py-12 bg-white/30 border-y border-black/5">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 flex flex-wrap items-center justify-between gap-8 opacity-75">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-ocean/50">
            AUTHORIZED FLAGSHIP BOUTIQUE
          </span>
          <div className="flex flex-wrap items-center gap-12">
            {BRANDS.map((brand) => (
              <span
                key={brand.name}
                className="font-sora text-lg sm:text-xl font-extrabold text-ocean/60 tracking-wider hover:text-ocean transition-colors duration-200"
              >
                {brand.logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Showroom Catalog Section */}
      <section id="products" className="py-24 px-6 md:px-12 max-w-[1320px] mx-auto space-y-12">
        {/* Section Header */}
        <div className="space-y-4 max-w-2xl">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent block">
            THE SHOWROOM COLLECTION
          </span>
          <h2 className="font-sora text-3xl sm:text-4xl font-extrabold text-ocean leading-tight">
            Featured Products
          </h2>
          <p className="text-sm sm:text-base text-ocean/70 leading-relaxed">
            Discover this week's most popular smartphones and accessories, carefully selected for performance, reliability, and value.
          </p>
        </div>

        {/* Search & Filter Floating Glass Panel */}
        <div className="glass-panel p-6 rounded-card shadow-premium space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean/40" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by model, brand, spec..."
                className="w-full bg-white/70 border border-ocean/10 rounded-input pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300"
              />
            </div>

            {/* Category Select */}
            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white/70 border border-ocean/10 rounded-input px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 cursor-pointer"
              >
                <option value="All">All Categories</option>
                {categories.filter(c => c !== "All").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Brand Select */}
            <div className="md:col-span-3">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-white/70 border border-ocean/10 rounded-input px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 cursor-pointer"
              >
                <option value="All">All Brands</option>
                {brandsList.filter(b => b !== "All").map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Filters / Status */}
          {(searchQuery || selectedCategory !== "All" || selectedBrand !== "All") && (
            <div className="flex items-center justify-between gap-4 flex-wrap pt-2 border-t border-ocean/5 text-xs text-ocean/60">
              <p>
                Showing {displayedProducts.length} premium results
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedBrand("All");
                }}
                className="text-accent font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onReserve={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/30 rounded-card border border-dashed border-black/5 space-y-4">
            <AlertCircle className="w-12 h-12 text-ocean/40 mx-auto" />
            <h3 className="font-sora text-lg font-bold text-ocean">No showroom items matched</h3>
            <p className="text-sm text-ocean/60 max-w-md mx-auto">
              We couldn't find matches for your search. Try resetting filters or search terms.
            </p>
          </div>
        )}
      </section>

      {/* Trust & Verification Section */}
      <section id="reviews" className="bg-ocean text-ivory py-24 px-6 md:px-12">
        <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Trust Left */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-accent block">
              THE EXPERIENCE BOUTIQUE
            </span>
            <h2 className="font-sora text-3xl sm:text-4xl font-extrabold leading-tight text-white">
              Customer Trust & Certified Authenticity
            </h2>
            <p className="text-sm sm:text-base text-ivory/80 leading-relaxed">
              We believe purchasing luxury technology should be built on absolute confidence. Our showroom process allows you to examine product build, quality, and configurations prior to purchase.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-white/10 rounded-full text-accent shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sora font-semibold text-white">Verified Showroom Stock</h4>
                  <p className="text-xs text-ivory/70 mt-0.5">Every device is thoroughly audited and certified before display.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Right - Reviews List */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {REVIEWS.map((review) => (
              <div
                key={review.id}
                className="bg-white/5 border border-white/10 p-6 rounded-card shadow-sm space-y-4"
              >
                <div className="flex items-center gap-1 text-accent">
                  {Array.from({ length: review.rating }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-ivory/80 leading-relaxed italic">
                  "{review.content}"
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={review.avatar}
                    alt={review.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h5 className="font-sora text-sm font-semibold text-white">{review.author}</h5>
                    <span className="text-[10px] uppercase tracking-[0.05em] text-ivory/55">{review.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showroom Details / Map section */}
      <section id="showroom-details" className="py-24 px-6 md:px-12 max-w-[1320px] mx-auto">
        <div className="glass-panel p-8 md:p-12 rounded-card shadow-premium grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Details Left */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-accent block">
              VISIT OUR KIGALI BOUTIQUE
            </span>
            <h2 className="font-sora text-3xl font-extrabold text-ocean">
              Digital Showroom Meets Premium Retail
            </h2>
            <p className="text-sm text-ocean/70 leading-relaxed">
              Experience hands-on testing in a serene, distraction-free gallery. Located in the heart of Kigali City, our experts are here to walk you through device features.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-sm text-ocean/80">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <p className="font-bold">Boutique Address</p>
                  <p className="text-xs text-ocean/60">KN 2 Ave, Kigali City Centre</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <p className="font-bold">Showroom Hours</p>
                  <p className="text-xs text-ocean/60">Mon - Sat: 9:00 AM - 8:00 PM</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <p className="font-bold">Concierge Support</p>
                  <p className="text-xs text-ocean/60">+250 788 123 456</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Store className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <p className="font-bold">Boutique pickup</p>
                  <p className="text-xs text-ocean/60">Inspect device before payment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Right (Fake Premium Map Gallery Visual) */}
          <div className="lg:col-span-5 relative w-full h-64 sm:h-80 rounded-img overflow-hidden border border-black/5 bg-radial from-ocean/5 to-transparent flex items-center justify-center">
            <div className="absolute inset-0 bg-cover bg-center opacity-30 blur-[2px]" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800')` }} />
            <div className="relative text-center p-6 bg-white/80 backdrop-blur-md rounded-card shadow-premium border border-black/5 max-w-xs mx-auto">
              <Store className="w-8 h-8 text-accent mx-auto mb-2 animate-bounce" />
              <h4 className="font-sora text-sm font-bold text-ocean">Kigali Flagroom Store</h4>
              <p className="text-xs text-ocean/60 mt-1">Convenient parking, premium experience gallery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Modal Popup */}
      <ReservationModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
