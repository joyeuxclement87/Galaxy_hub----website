"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Aperture,
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
  Monitor,
  Palette,
  RotateCw,
  ShieldCheck,
  ShoppingBag,
  Signal,
  Smartphone,
  SlidersHorizontal,
  Sun,
  Usb,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCTS, Product } from "@/data/mock-data";

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

interface HeroProps {
  onOrderNow: (product: Product) => void;
}

export function Hero({ onOrderNow }: HeroProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const featuredProduct = PRODUCTS.find((p) => p.featured) || PRODUCTS[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SPOTLIGHT_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setActiveSlide(((index % SPOTLIGHT_SLIDES.length) + SPOTLIGHT_SLIDES.length) % SPOTLIGHT_SLIDES.length);
  };

  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const activeSpotlight = SPOTLIGHT_SLIDES[activeSlide];

  return (
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
              <Button
                variant="secondary"
                className="w-full gap-2 bg-transparent"
                onClick={() => onOrderNow(featuredProduct)}
              >
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
                    className={
                      idx === activeSlide
                        ? "h-2 w-7 rounded-full bg-ocean transition-all duration-300"
                        : "h-2 w-2 rounded-full bg-ocean/20 transition-all duration-300"
                    }
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
  );
}
