"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import Fuse from "fuse.js";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
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
import { PRODUCTS, REVIEWS, Product } from "@/data/mock-data";
import { Button } from "@/components/ui/button";

const TRUST_CHIPS = [
  "✓ Genuine Products",
  "✓ Warranty Available",
  "✓ Kigali Delivery",
  "✓ Flexible Pickup",
];

const HERO_SHOWCASE = [
  {
    name: "iPhone 17 Pro",
    type: "phone",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=900",
    className:
      "left-[4%] top-[14%] w-[34%] rotate-[-11deg] lg:left-[8%] lg:top-[17%] lg:w-[32%]",
    animation: { y: [0, -6, 0], rotate: [-11, -9, -11] },
    duration: 6.8,
  },
  {
    name: "Samsung S26 Ultra",
    type: "phone",
    image:
      "https://images.unsplash.com/photo-1708649290066-5f617003b930?auto=format&fit=crop&q=80&w=900",
    className:
      "right-[8%] top-[11%] w-[31%] rotate-[10deg] lg:right-[11%] lg:top-[14%] lg:w-[29%]",
    animation: { y: [0, -5, 0], rotate: [10, 8, 10] },
    duration: 7.2,
  },
  {
    name: "MacBook Air",
    type: "laptop",
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&q=80&w=1200",
    className:
      "left-1/2 top-[38%] w-[62%] -translate-x-1/2 rotate-[-3deg] lg:top-[40%] lg:w-[58%]",
    animation: { y: [0, -4, 0], rotate: [-3, -1, -3] },
    duration: 8,
  },
  {
    name: "Smartwatch",
    type: "watch",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=700",
    className:
      "left-[16%] bottom-[13%] w-[18%] rotate-[-8deg] lg:left-[18%] lg:bottom-[16%] lg:w-[17%]",
    animation: { y: [0, -5, 0], rotate: [-8, -5, -8] },
    duration: 6.4,
  },
  {
    name: "Earbuds",
    type: "audio",
    image:
      "https://images.unsplash.com/photo-1606741965429-3f3e4a3d1f03?auto=format&fit=crop&q=80&w=700",
    className:
      "right-[15%] bottom-[12%] w-[19%] rotate-[8deg] lg:right-[16%] lg:bottom-[15%] lg:w-[17%]",
    animation: { y: [0, -5, 0], rotate: [8, 5, 8] },
    duration: 6.9,
  },
];

const FLOATING_CARDS = [
  {
    title: "Available",
    body: "iPhone 17 Pro",
    meta: "256GB • In Stock",
    className: "left-[2%] top-[6%] lg:left-[0%] lg:top-[10%]",
  },
  {
    title: "Reserve Today",
    body: "Samsung S26 Ultra",
    meta: "Titanium Black",
    className: "right-[2%] top-[36%] lg:right-[0%] lg:top-[38%]",
  },
  {
    title: "Studio Setup",
    body: "MacBook Air",
    meta: "M3 • Midnight",
    className: "left-[8%] bottom-[0%] lg:left-[8%] lg:bottom-[3%]",
  },
] as const;

const FEATURED_BRANDS = [
  {
    name: "Apple",
    tagline: "Titanium build. Effortless performance.",
    category: "Smartphones & Laptops",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1000",
    featured: true,
  },
  {
    name: "Samsung",
    tagline: "Galaxy AI, reimagined.",
    category: "Smartphones",
    image:
      "https://images.unsplash.com/photo-1708649290066-5f617003b930?auto=format&fit=crop&q=80&w=700",
    featured: false,
  },
  {
    name: "Sony",
    tagline: "Studio-grade sound, anywhere.",
    category: "Audio",
    image:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=700",
    featured: false,
  },
  {
    name: "Google",
    tagline: "Pure Android, powerful AI.",
    category: "Smartphones",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=700",
    featured: false,
  },
  {
    name: "DJI",
    tagline: "Precision flight, cinematic vision.",
    category: "Drones",
    image:
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=700",
    featured: false,
  },
] as const;

const FOOTER_COLUMNS = {
  products: ["Smartphones", "Accessories", "Laptops", "Smartwatches", "Audio"],
  support: ["Reservation Process", "Warranty", "Delivery", "FAQs", "Contact"],
  visit: ["Kigali, Rwanda", "Mon - Sat • 9:00 - 20:00", "Google Maps", "WhatsApp", "Telegram"],
};

export default function ShowroomHome() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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
  const featuredProduct = PRODUCTS.find((p) => p.featured) || PRODUCTS[0];
  const samsungProduct = PRODUCTS.find((p) => p.brand === "Samsung") || PRODUCTS[1] || PRODUCTS[0];

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

  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex-1 pt-20 lg:pt-28">
      <Navbar onSearchFocus={focusSearchInput} />

      <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#FFFEF9_0%,#F5F9FD_100%)] px-6 py-10 md:px-12 lg:min-h-[900px] lg:h-screen lg:py-0">
        <div className="hero-grid-texture absolute inset-0 opacity-[0.22]" />
        <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_74%_34%,rgba(11,84,151,0.16),transparent_30%),radial-gradient(circle_at_18%_18%,rgba(95,165,222,0.14),transparent_28%)]" />
        <div className="absolute left-[8%] top-[18%] h-40 w-40 rounded-full bg-ocean/10 blur-3xl lg:h-64 lg:w-64" />
        <div className="absolute right-[12%] top-[10%] h-36 w-36 rounded-full bg-sky-200/50 blur-3xl lg:h-56 lg:w-56" />
        <div className="absolute bottom-[15%] right-[22%] h-28 w-28 rounded-full bg-ocean/8 blur-3xl lg:h-44 lg:w-44" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1320px] flex-col justify-center">
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6 lg:pr-8">
              <div className="max-w-[540px] space-y-7 pt-8 lg:pt-0">
                <span className="inline-flex items-center rounded-badge border border-ocean/20 bg-[#FFFEF9]/88 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-ocean shadow-[0_12px_32px_rgba(11,84,151,0.08)] backdrop-blur-sm">
                  NEW ARRIVALS • 2026 COLLECTION
                </span>

                <div className="space-y-5">
                  <h1 className="font-clash text-[52px] font-bold leading-[0.95] tracking-[-0.04em] text-[#10233D] sm:text-[64px] lg:text-[72px]">
                    Your Next Device
                    <br />
                    Starts Here.
                  </h1>
                  <p className="max-w-[540px] text-base leading-8 text-[#10233D]/74 sm:text-lg">
                    Genuine smartphones, accessories, laptops and smart devices from trusted brands.
                    Reserve online in seconds and collect in-store or request delivery anywhere in Kigali.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 sm:max-w-[460px]">
                  <Button variant="primary" className="w-full gap-2" onClick={() => setSelectedProduct(featuredProduct)}>
                    <ShoppingBag className="h-4 w-4" />
                    Order Now
                  </Button>
                  <Button variant="secondary" className="w-full gap-2 bg-transparent" onClick={() => {
                    const el = document.getElementById("showroom-details");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}>
                    <Phone className="h-4 w-4" />
                    Contact Us
                  </Button>
                </div>

                <div className="hidden flex-wrap gap-3 lg:flex">
                  {TRUST_CHIPS.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-ocean/10 bg-white/60 px-4 py-2 text-sm font-medium text-[#10233D]/82 shadow-[0_10px_30px_rgba(11,84,151,0.06)] backdrop-blur-sm"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative mx-auto aspect-[1.02/1] w-full max-w-[640px] animate-fade-rise">
                <div className="animate-pulse-glow absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.98)_0%,rgba(203,227,248,0.78)_34%,rgba(11,84,151,0.10)_68%,transparent_100%)] blur-2xl" />
                <div className="absolute inset-[8%] rounded-[40px] border border-white/60 bg-white/18 shadow-[0_24px_80px_rgba(11,84,151,0.10)] backdrop-blur-[6px]" />

                {HERO_SHOWCASE.map((device, index) => (
                  <motion.div
                    key={device.name}
                    animate={device.animation}
                    transition={{ duration: device.duration, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    className={`absolute ${device.className}`}
                    style={{ zIndex: device.type === "laptop" ? 1 : 2 + index }}
                  >
                    <div className="overflow-hidden rounded-[26px] border border-white/60 bg-white/85 p-2 shadow-[0_24px_70px_rgba(16,35,61,0.18)] backdrop-blur-sm">
                      <img
                        src={device.image}
                        alt={device.name}
                        className={`h-full w-full object-cover ${device.type === "laptop" ? "aspect-[1.32/1]" : "aspect-[0.75/1]"}`}
                      />
                    </div>
                  </motion.div>
                ))}

                {FLOATING_CARDS.map((card, index) => (
                  <motion.div
                    key={card.body}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 * index, duration: 0.65, ease: "easeOut" }}
                    className={`absolute ${card.className} rounded-[22px] border border-white/60 bg-white/55 px-4 py-3 shadow-[0_18px_40px_rgba(16,35,61,0.12)] backdrop-blur-md`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ocean/72">
                      {card.title}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#10233D] sm:text-[15px]">{card.body}</p>
                    <p className="mt-1 text-xs text-[#10233D]/62">{card.meta}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 lg:hidden">
            {TRUST_CHIPS.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-ocean/10 bg-white/60 px-4 py-2 text-sm font-medium text-[#10233D]/82 shadow-[0_10px_30px_rgba(11,84,151,0.06)] backdrop-blur-sm"
              >
                {chip}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={scrollToProducts}
            className="mx-auto mt-12 hidden flex-col items-center gap-3 text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-ocean/58 lg:flex"
          >
            <span>Scroll to Explore</span>
            <span className="relative h-14 w-px overflow-hidden rounded-full bg-ocean/12">
              <span className="animate-scroll-line absolute inset-x-0 top-0 h-5 rounded-full bg-ocean/55" />
            </span>
          </button>
        </div>
      </section>

      <section id="brands" className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFEF9_0%,#F7FAFD_100%)] py-24">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-ocean/6 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-[1320px] px-6 md:px-12">
          <div className="max-w-2xl space-y-4">
            <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
              TRUSTED TECHNOLOGY PARTNERS
            </span>
            <h2 className="font-clash text-3xl font-bold leading-tight text-[#10233D] sm:text-4xl">
              Featured Brands
            </h2>
            <p className="text-sm leading-relaxed text-ocean/70 sm:text-base">
              A curated selection of the world&apos;s most trusted technology names, genuine and in stock at our Kigali, Rwanda showroom.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
            {FEATURED_BRANDS.map((brand) => (
              <motion.div
                key={brand.name}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={
                  brand.featured
                    ? "group relative col-span-1 row-span-1 overflow-hidden rounded-[28px] border border-white/60 bg-white/55 shadow-[0_16px_40px_rgba(11,84,151,0.07)] backdrop-blur-md transition-all duration-300 hover:border-ocean/25 hover:shadow-[0_24px_60px_rgba(11,84,151,0.14)] sm:col-span-2 lg:col-span-2 lg:row-span-2"
                    : "group relative col-span-1 row-span-1 overflow-hidden rounded-[28px] border border-white/60 bg-white/55 shadow-[0_16px_40px_rgba(11,84,151,0.07)] backdrop-blur-md transition-all duration-300 hover:border-ocean/25 hover:shadow-[0_24px_60px_rgba(11,84,151,0.14)]"
                }
              >
                <div
                  className={
                    brand.featured
                      ? "relative h-full min-h-[280px] w-full overflow-hidden"
                      : "relative h-full min-h-[220px] w-full overflow-hidden"
                  }
                >
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,35,61,0)_35%,rgba(8,20,35,0.82)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="mb-2 inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm">
                      {brand.category}
                    </span>
                    <h3
                      className={
                        brand.featured
                          ? "font-clash text-2xl font-bold text-white sm:text-3xl"
                          : "font-clash text-xl font-bold text-white"
                      }
                    >
                      {brand.name}
                    </h3>
                    <p className="mt-1 text-sm text-white/75">{brand.tagline}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-[1320px] space-y-12 px-6 py-24 md:px-12">
        <div className="max-w-2xl space-y-4">
          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            THE SHOWROOM COLLECTION
          </span>
          <h2 className="font-sora text-3xl font-extrabold leading-tight text-ocean sm:text-4xl">
            Featured Products
          </h2>
          <p className="text-sm leading-relaxed text-ocean/70 sm:text-base">
            Discover this week’s most popular smartphones and accessories, carefully selected for performance, reliability, and value.
          </p>
        </div>

        <div className="glass-panel rounded-card p-6 shadow-premium space-y-6">
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
            <div className="relative md:col-span-6">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean/40" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by model, brand, spec..."
                className="w-full rounded-input border border-ocean/10 bg-white/70 py-3 pr-4 pl-11 text-sm transition-all duration-300 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full cursor-pointer rounded-input border border-ocean/10 bg-white/70 px-4 py-3 text-sm transition-all duration-300 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
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
                className="w-full cursor-pointer rounded-input border border-ocean/10 bg-white/70 px-4 py-3 text-sm transition-all duration-300 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
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
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ocean/5 pt-2 text-xs text-ocean/60">
              <p>Showing {displayedProducts.length} premium results</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedBrand("All");
                }}
                className="font-semibold text-accent hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onReserve={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4 rounded-card border border-dashed border-black/5 bg-white/30 py-20 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-ocean/40" />
            <h3 className="font-sora text-lg font-bold text-ocean">No showroom items matched</h3>
            <p className="mx-auto max-w-md text-sm text-ocean/60">
              We couldn’t find matches for your search. Try resetting filters or search terms.
            </p>
          </div>
        )}
      </section>

      <section id="reviews" className="bg-ocean px-6 py-24 text-ivory md:px-12">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
              THE EXPERIENCE BOUTIQUE
            </span>
            <h2 className="font-sora text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Customer Trust & Certified Authenticity
            </h2>
            <p className="text-sm leading-relaxed text-ivory/80 sm:text-base">
              We believe purchasing luxury technology should be built on absolute confidence. Our showroom process allows you to examine product build, quality, and configurations prior to purchase.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="shrink-0 rounded-full bg-white/10 p-2 text-accent">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-sora font-semibold text-white">Verified Showroom Stock</h4>
                  <p className="mt-0.5 text-xs text-ivory/70">
                    Every device is thoroughly audited and certified before display.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7">
            {REVIEWS.map((review) => (
              <div
                key={review.id}
                className="space-y-4 rounded-card border border-white/10 bg-white/5 p-6 shadow-sm"
              >
                <div className="flex items-center gap-1 text-accent">
                  {Array.from({ length: review.rating }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-ivory/80 italic">
                  “{review.content}”
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={review.avatar}
                    alt={review.author}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <h5 className="font-sora text-sm font-semibold text-white">{review.author}</h5>
                    <span className="text-[10px] uppercase tracking-[0.05em] text-ivory/55">
                      {review.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="showroom-details" className="mx-auto max-w-[1320px] px-6 py-24 md:px-12">
        <div className="glass-panel grid grid-cols-1 items-center gap-8 rounded-card p-8 shadow-premium md:p-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
              VISIT OUR KIGALI BOUTIQUE
            </span>
            <h2 className="font-sora text-3xl font-extrabold text-ocean">
              Digital Showroom Meets Premium Retail
            </h2>
            <p className="text-sm leading-relaxed text-ocean/70">
              Experience hands-on testing in a serene, distraction-free gallery. Located in the heart of Kigali City, our experts are here to walk you through device features.
            </p>

            <div className="grid grid-cols-1 gap-6 pt-4 text-sm text-ocean/80 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-bold">Boutique Address</p>
                  <p className="text-xs text-ocean/60">KN 2 Ave, Kigali City Centre</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-bold">Showroom Hours</p>
                  <p className="text-xs text-ocean/60">Mon - Sat: 9:00 AM - 8:00 PM</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-bold">Concierge Support</p>
                  <p className="text-xs text-ocean/60">+250 788 123 456</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Store className="h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-bold">Boutique pickup</p>
                  <p className="text-xs text-ocean/60">Inspect device before payment</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-img border border-black/5 bg-radial from-ocean/5 to-transparent sm:h-80 lg:col-span-5">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 blur-[2px]"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800')",
              }}
            />
            <div className="relative mx-auto max-w-xs rounded-card border border-black/5 bg-white/80 p-6 text-center shadow-premium backdrop-blur-md">
              <Store className="mx-auto mb-2 h-8 w-8 animate-bounce text-accent" />
              <h4 className="font-sora text-sm font-bold text-ocean">Kigali Flagroom Store</h4>
              <p className="mt-1 text-xs text-ocean/60">
                Convenient parking, premium experience gallery
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative mt-8 bg-ocean px-6 pb-8 pt-0 text-[#FFFEF9] md:px-12">
        <div className="mx-auto max-w-[1320px]">
          <div className="relative -translate-y-8 overflow-hidden rounded-[32px] border border-[#7CB6E8]/30 bg-[linear-gradient(135deg,#0F6BC0_0%,#0B5497_48%,#083E70_100%)] p-8 shadow-[0_-18px_60px_rgba(5,23,43,0.28)] md:-translate-y-12 md:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:p-12">
            <div className="max-w-2xl space-y-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70">
                PREMIUM RESERVATION EXPERIENCE
              </span>
              <h2 className="font-clash text-3xl font-bold leading-[0.98] tracking-[-0.03em] text-white sm:text-4xl lg:text-[48px]">
                Upgrade Your Tech Today.
              </h2>
              <p className="max-w-[640px] text-sm leading-7 text-white/78 sm:text-base">
                Explore smartphones, accessories, and smart devices available in Kigali, Rwanda.
              </p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:mt-0 lg:min-w-[420px]">
              <Button variant="primary" className="w-full gap-2 bg-[#FFFEF9] text-ocean hover:bg-white" onClick={() => setSelectedProduct(samsungProduct)}>
                <ShoppingBag className="h-4 w-4" />
                Order Now
              </Button>
              <Button variant="secondary" className="w-full gap-2 border-white/65 text-white hover:border-white hover:bg-white hover:text-ocean" onClick={() => {
                const el = document.getElementById("showroom-details");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}>
                <ArrowRight className="h-4 w-4" />
                Contact Us
              </Button>
            </div>
          </div>

          <div className="grid gap-14 py-12 md:py-16 lg:grid-cols-4 lg:gap-10 lg:py-20">
            <div className="space-y-5">
              <div>
                <h3 className="font-clash text-2xl font-semibold text-white">Galaxy Hub</h3>
                <p className="mt-4 max-w-sm text-sm leading-7 text-white/72">
                  Premium devices, trusted brands, and effortless reservations designed for Kigali’s modern tech shoppers.
                </p>
              </div>
              <div className="space-y-2 text-sm text-white/72">
                <a className="block transition-colors hover:text-white" href="https://instagram.com">
                  Instagram
                </a>
                <a className="block transition-colors hover:text-white" href="https://facebook.com">
                  Facebook
                </a>
                <a className="block transition-colors hover:text-white" href="tel:+250788123456">
                  +250 788 123 456
                </a>
                <a className="block transition-colors hover:text-white" href="mailto:hello@galaxyhub.rw">
                  hello@galaxyhub.rw
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-clash text-lg font-semibold text-white">Products</h4>
              <ul className="mt-5 space-y-3 text-sm text-white/72">
                {FOOTER_COLUMNS.products.map((item) => (
                  <li key={item}>
                    <a className="transition-colors hover:text-white" href="#products">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-clash text-lg font-semibold text-white">Customer Support</h4>
              <ul className="mt-5 space-y-3 text-sm text-white/72">
                {FOOTER_COLUMNS.support.map((item) => (
                  <li key={item}>
                    <a className="transition-colors hover:text-white" href="#showroom-details">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-clash text-lg font-semibold text-white">Visit Us</h4>
              <ul className="mt-5 space-y-3 text-sm text-white/72">
                {FOOTER_COLUMNS.visit.map((item) => (
                  <li key={item}>
                    <a className="inline-flex items-center gap-2 transition-colors hover:text-white" href="#showroom-details">
                      <span>{item}</span>
                      {item === "Google Maps" && <ArrowUpRight className="h-3.5 w-3.5" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/12 py-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
            <p>© 2026 Galaxy Hub. Designed with care in Kigali.</p>
            <div className="flex flex-wrap gap-5">
              <a href="#" className="transition-colors hover:text-white">
                Privacy
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Terms
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>

      <ReservationModal
        key={selectedProduct?.id ?? "none"}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
