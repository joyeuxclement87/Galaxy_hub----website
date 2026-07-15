"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import {
  AlertCircle,
  Aperture,
  ArrowRight,
  ArrowUpRight,
  BatteryFull,
  Bluetooth,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cpu,
  Droplet,
  Feather,
  Hand,
  HardDrive,
  Headphones as HeadphonesIcon,
  Layers,
  MapPin,
  Monitor,
  Palette,
  Phone,
  RotateCw,
  Search,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Signal,
  Smartphone,
  SlidersHorizontal,
  Star,
  Store,
  Sun,
  Usb,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { ProductCard } from "@/components/ui/product-card";
import { ReservationModal } from "@/components/ui/reservation-modal";
import { PRODUCTS, REVIEWS, Product } from "@/data/mock-data";
import { Button } from "@/components/ui/button";

const SPOTLIGHT_SLIDES = [
  {
    id: "smartphones",
    category: "Smartphones",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=900",
    features: [
      { label: "5G Ready", icon: Signal },
      { label: "48MP Camera", icon: Camera },
      { label: "All-Day Battery", icon: BatteryFull },
      { label: "Fast Charging", icon: Zap },
    ],
  },
  {
    id: "phone-cases",
    category: "Phone Cases",
    image:
      "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&q=80&w=900",
    features: [
      { label: "Shockproof", icon: ShieldCheck },
      { label: "Slim Fit", icon: Layers },
      { label: "Wireless Charging OK", icon: Zap },
      { label: "Multiple Colors", icon: Palette },
    ],
  },
  {
    id: "laptops",
    category: "Laptops",
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&q=80&w=900",
    features: [
      { label: "16GB RAM", icon: Cpu },
      { label: "512GB SSD", icon: HardDrive },
      { label: "All-Day Battery", icon: BatteryFull },
      { label: "Retina Display", icon: Monitor },
    ],
  },
  {
    id: "ring-lights",
    category: "Ring Lights",
    image:
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=900",
    features: [
      { label: "3 Light Modes", icon: Sun },
      { label: "Adjustable Stand", icon: SlidersHorizontal },
      { label: "USB Powered", icon: Usb },
      { label: "Phone Clip Included", icon: Smartphone },
    ],
  },
  {
    id: "camera-tripods",
    category: "Camera Tripods",
    image:
      "https://images.unsplash.com/photo-1520170350707-b2da59970118?auto=format&fit=crop&q=80&w=900",
    features: [
      { label: "Extendable Legs", icon: SlidersHorizontal },
      { label: "360° Rotation", icon: RotateCw },
      { label: "Lightweight", icon: Feather },
      { label: "Universal Mount", icon: Aperture },
    ],
  },
  {
    id: "bluetooth-speakers",
    category: "Bluetooth Speakers",
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=900",
    features: [
      { label: "Deep Bass", icon: Volume2 },
      { label: "12H Playtime", icon: Clock },
      { label: "Water Resistant", icon: Droplet },
      { label: "Bluetooth 5.3", icon: Bluetooth },
    ],
  },
  {
    id: "earbuds",
    category: "Earbuds",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=900",
    features: [
      { label: "Noise Cancelling", icon: VolumeX },
      { label: "Touch Controls", icon: Hand },
      { label: "30H Battery", icon: BatteryFull },
      { label: "IPX5 Rated", icon: Droplet },
    ],
  },
  {
    id: "headphones",
    category: "Headphones",
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=900",
    features: [
      { label: "Over-Ear Comfort", icon: HeadphonesIcon },
      { label: "40H Battery", icon: BatteryFull },
      { label: "Active ANC", icon: VolumeX },
      { label: "Foldable Design", icon: Layers },
    ],
  },
] as const;

const BUBBLE_POSITIONS = [
  "left-[2%] top-[10%] lg:left-[-4%] lg:top-[12%]",
  "right-[2%] top-[10%] lg:right-[-4%] lg:top-[12%]",
  "left-[2%] bottom-[10%] lg:left-[-4%] lg:bottom-[12%]",
  "right-[2%] bottom-[10%] lg:right-[-4%] lg:bottom-[12%]",
] as const;

// NOTE: In production this data (image, description, product count, href) should be
// fetched from Sanity CMS so counts and imagery stay in sync with the live catalog.
const CATEGORIES = [
  {
    name: "Smartphones",
    description: "Flagship phones from Apple, Samsung and Google.",
    count: 24,
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=900",
  },
  {
    name: "Phone Cases",
    description: "Protection and style for every model.",
    count: 38,
    image:
      "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&q=80&w=900",
  },
  {
    name: "Laptops",
    description: "Power and portability for work and play.",
    count: 16,
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&q=80&w=900",
  },
  {
    name: "Earbuds",
    description: "True wireless sound, all-day comfort.",
    count: 21,
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=900",
  },
  {
    name: "Headphones",
    description: "Immersive audio for focus and travel.",
    count: 14,
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=900",
  },
  {
    name: "Bluetooth Speakers",
    description: "Room-filling sound, anywhere you go.",
    count: 12,
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=900",
  },
  {
    name: "Ring Lights",
    description: "Studio-quality lighting for content creators.",
    count: 9,
    image:
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=900",
  },
  {
    name: "Camera Tripods",
    description: "Stable, portable support for every shot.",
    count: 11,
    image:
      "https://images.unsplash.com/photo-1520170350707-b2da59970118?auto=format&fit=crop&q=80&w=900",
  },
] as const;

const WHY_GALAXY_HUB = [
  {
    title: "Genuine Products",
    description:
      "Every device is sourced from authorized distributors and verified before it reaches our shelves.",
    image:
      "https://images.unsplash.com/photo-1586880244406-556ebe35f282?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Delivery Across Rwanda",
    description:
      "From Kigali City to every province, your order is packed with care and delivered on time.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Warranty & Support",
    description:
      "Standard manufacturer warranty and a concierge team ready to help long after you collect your device.",
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Tech for Every Lifestyle",
    description:
      "Phones, laptops, wearables and accessories curated for how you actually live and work.",
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=1200",
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

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SPOTLIGHT_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setActiveSlide(((index % SPOTLIGHT_SLIDES.length) + SPOTLIGHT_SLIDES.length) % SPOTLIGHT_SLIDES.length);
  };

  const activeSpotlight = SPOTLIGHT_SLIDES[activeSlide];

  return (
    <div className="flex-1 pt-20 lg:pt-28">
      <Navbar onSearchFocus={focusSearchInput} />

      <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#FFFEF9_0%,#F5F9FD_100%)] px-6 py-14 md:px-12 lg:min-h-[820px] lg:py-0">
        <div className="hero-grid-texture absolute inset-0 opacity-[0.16]" />
        <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_74%_34%,rgba(11,84,151,0.12),transparent_30%),radial-gradient(circle_at_18%_18%,rgba(95,165,222,0.10),transparent_28%)]" />

        <div className="relative z-10 mx-auto grid max-w-[1320px] items-center gap-14 lg:min-h-[820px] lg:grid-cols-12 lg:gap-10">
          {/* Fixed marketing content — left side never changes between slides */}
          <div className="lg:col-span-6 lg:pr-8">
            <div className="max-w-[540px] space-y-7">
              <span className="inline-flex items-center rounded-badge border border-ocean/20 bg-[#FFFEF9]/88 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-ocean shadow-[0_12px_32px_rgba(11,84,151,0.08)]">
                Kigali • Rwanda
              </span>

              <div className="space-y-5">
                <h1 className="font-clash text-[44px] font-bold leading-[0.98] tracking-[-0.03em] text-[#10233D] sm:text-[56px] lg:text-[64px]">
                  Technology That Fits
                  <br />
                  Your Everyday Life.
                </h1>
                <p className="max-w-[500px] text-base leading-8 text-[#10233D]/74 sm:text-lg">
                  Genuine smartphones, accessories, laptops and smart devices from trusted brands —
                  ready to order and collect in-store or delivered anywhere in Kigali.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 sm:max-w-[420px]">
                <Button variant="primary" className="w-full gap-2" onClick={scrollToProducts}>
                  Explore Products
                </Button>
                <Button variant="secondary" className="w-full gap-2 bg-transparent" onClick={() => setSelectedProduct(featuredProduct)}>
                  <ShoppingBag className="h-4 w-4" />
                  Order Now
                </Button>
              </div>
            </div>
          </div>

          {/* Product Spotlight carousel — fixed frame, only inner content swaps */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto w-full max-w-[600px]">
              <span className="mb-5 block text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-ocean/55">
                Product Spotlight
              </span>

              <div className="relative mx-auto aspect-square w-full">
                <div className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95)_0%,rgba(203,227,248,0.65)_45%,transparent_100%)]" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSpotlight.id}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-[4%]"
                  >
                    <Image
                      src={activeSpotlight.image}
                      alt={activeSpotlight.category}
                      fill
                      priority={activeSlide === 0}
                      loading={activeSlide === 0 ? undefined : "lazy"}
                      sizes="(min-width: 1024px) 560px, 85vw"
                      className="rounded-[28px] object-cover drop-shadow-[0_20px_45px_rgba(16,35,61,0.18)]"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Feature bubbles — fixed anchor points, content swaps per slide */}
                {BUBBLE_POSITIONS.map((position, idx) => (
                  <div key={position} className={`absolute ${position} z-10`}>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`${activeSpotlight.id}-${idx}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.4, delay: 0.08 * idx }}
                        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-ocean/10 bg-white/90 px-3 py-1.5 text-[11px] font-medium text-[#10233D] shadow-[0_10px_24px_rgba(11,84,151,0.10)]"
                      >
                        {(() => {
                          const FeatureIcon = activeSpotlight.features[idx].icon;
                          return <FeatureIcon className="h-3.5 w-3.5 shrink-0 text-accent" />;
                        })()}
                        {activeSpotlight.features[idx].label}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Category label */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={`label-${activeSpotlight.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mt-6 text-center font-clash text-lg font-semibold text-[#10233D]"
                >
                  {activeSpotlight.category}
                </motion.p>
              </AnimatePresence>

              {/* Arrows + pagination dots */}
              <div className="mt-5 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => goToSlide(activeSlide - 1)}
                  aria-label="Previous product"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ocean/15 text-ocean/60 transition-colors duration-200 hover:border-ocean/40 hover:text-ocean"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-2">
                  {SPOTLIGHT_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      aria-label={`Go to ${slide.category} slide`}
                      className={idx === activeSlide ? "h-2 w-7 rounded-full bg-ocean transition-all duration-300" : "h-2 w-2 rounded-full bg-ocean/20 transition-all duration-300"}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => goToSlide(activeSlide + 1)}
                  aria-label="Next product"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ocean/15 text-ocean/60 transition-colors duration-200 hover:border-ocean/40 hover:text-ocean"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="why-galaxy-hub" className="bg-[#FFFEF9] px-6 py-24 md:px-12">
        <div className="mx-auto max-w-[1320px]">
          <div className="max-w-2xl space-y-4">
            <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
              WHY GALAXY HUB
            </span>
            <h2 className="font-clash text-3xl font-bold leading-tight text-[#10233D] sm:text-4xl lg:text-[44px]">
              A Showroom Built on Trust
            </h2>
            <p className="text-sm leading-relaxed text-ocean/70 sm:text-base">
              From genuine hardware to nationwide delivery, every part of the Galaxy Hub experience is
              designed around one thing: giving you total confidence in what you buy.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {WHY_GALAXY_HUB.map((item) => (
              <div
                key={item.title}
                className="group overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-[0_12px_32px_rgba(16,35,61,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(16,35,61,0.12)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 620px, 90vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="space-y-2 p-7">
                  <h3 className="font-clash text-xl font-bold text-[#10233D]">{item.title}</h3>
                  <p className="text-sm leading-6 text-ocean/70">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="categories" className="relative overflow-hidden bg-[#FFFEF9] px-6 py-24 md:px-12">
        <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(11,84,151,0.10)_0%,transparent_70%)]" />

        <div className="relative mx-auto max-w-[1320px]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl space-y-4">
              <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
                SHOP BY CATEGORY
              </span>
              <h2 className="font-clash text-3xl font-bold leading-tight text-[#10233D] sm:text-4xl lg:text-[44px]">
                Everything You Need, All in One Place
              </h2>
              <p className="text-sm leading-relaxed text-ocean/70 sm:text-base">
                Browse Galaxy Hub&apos;s full range of genuine technology products, from everyday
                essentials to premium devices, all available with delivery across Rwanda.
              </p>
            </div>

            <Link
              href="#products"
              className="group inline-flex shrink-0 items-center gap-1.5 self-start text-sm font-semibold text-ocean transition-colors duration-200 hover:text-accent sm:self-auto"
            >
              View All Categories
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.name}
                href="#products"
                className="group block overflow-hidden rounded-[24px] border border-black/8 bg-white shadow-[0_10px_28px_rgba(16,35,61,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(16,35,61,0.14)]"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 300px, 45vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                </div>

                <div className="p-4 sm:p-5">
                  <h3 className="font-clash text-base font-bold text-[#10233D] transition-colors duration-300 group-hover:text-ocean sm:text-lg">
                    {category.name}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-xs text-ocean/60 sm:text-sm">
                    {category.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-ocean/50">
                    <span>{category.count} products</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-accent">
                      Explore
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
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
            FEATURED PRODUCTS
          </span>
          <h2 className="font-clash text-3xl font-bold leading-tight text-[#10233D] sm:text-4xl lg:text-[44px]">
            Discover Our Latest Collection
          </h2>
          <p className="text-sm leading-relaxed text-ocean/70 sm:text-base">
            Explore the newest smartphones, laptops, and smart accessories available in Rwanda — all genuine, all ready to order.
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
