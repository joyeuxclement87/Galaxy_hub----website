"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingCart, ShieldCheck, Truck, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeroSlideData {
  id: string;
  badge: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  image: string;
  slug: string;
}

interface HeroSectionProps {
  slides: HeroSlideData[];
  onAddToCart: (id: string) => void;
}

const contentVariants = {
  enter: (d: number) => ({ y: d > 0 ? 20 : -20, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (d: number) => ({ y: d < 0 ? 20 : -20, opacity: 0 }),
};

export function HeroSection({ slides, onAddToCart }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slide = slides[current] || slides[0];

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (slides.length <= 1 || isPaused) return;
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
  }, [slides.length, isPaused]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  useEffect(() => { startTimer(); return stopTimer; }, [startTimer, stopTimer]);

  const goTo = useCallback((index: number) => {
    if (index === current) return;
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    stopTimer(); startTimer();
  }, [current, startTimer, stopTimer]);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
    stopTimer(); startTimer();
  }, [slides.length, startTimer, stopTimer]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    stopTimer(); startTimer();
  }, [slides.length, startTimer, stopTimer]);

  if (!slide) return null;

  const discount = slide.originalPrice && slide.originalPrice > slide.price
    ? Math.round((1 - slide.price / slide.originalPrice) * 100) : 0;

  return (
    <section
      className="relative bg-ivory overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 py-8 lg:py-16">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8 min-h-[420px] lg:min-h-[560px]">

          {/* Left: Content */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-5 z-10">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id}
                custom={direction}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                    {slide.badge || "FEATURED TECH"}
                  </span>
                  {discount > 0 && (
                    <span className="rounded-full bg-red-50 text-red-600 border border-red-100 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      Save {discount}%
                    </span>
                  )}
                </div>

                <h1 className="font-clash text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-ocean-deeper">
                  {slide.title}
                </h1>

                <p className="max-w-md text-sm leading-relaxed text-ocean/65">
                  {slide.description}
                </p>

                <div className="flex items-baseline gap-3 pt-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ocean/45">
                      {slide.currency}
                    </span>
                    <span className="font-clash text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-ocean-deeper">
                      {slide.price.toLocaleString()}
                    </span>
                  </div>
                  {slide.originalPrice && slide.originalPrice > slide.price && (
                    <span className="text-sm text-ocean/35 line-through font-medium">
                      {slide.currency} {slide.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => onAddToCart(slide.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-ocean to-ocean-dark px-7 py-3.5 text-sm font-semibold text-white shadow-premium transition-all duration-200 hover:-translate-y-[2px] hover:shadow-premium-lg active:translate-y-0 cursor-pointer"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>
                  <Link
                    href={`/product/${slide.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-ocean/15 bg-white px-7 py-3.5 text-sm font-semibold text-ocean transition-all duration-200 hover:border-ocean/30 hover:bg-ocean/4"
                  >
                    Explore Product
                    <ArrowUpRight className="h-4 w-4 text-accent" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Product Image with depth */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[480px] h-[480px] rounded-full bg-[radial-gradient(ellipse, rgba(11,84,151,0.07)_0%, transparent_70%)] lg:w-[600px] lg:h-[600px]" />
            </div>
            <div className="relative z-10 w-full max-w-[520px] lg:-mr-8 aspect-square flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id + "-img"}
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    width={520}
                    height={520}
                    priority
                    className="object-contain w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.06)]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom: Controls + Trust */}
        <div className="relative mt-8 pt-6 border-t border-ocean/[0.06] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <button
                onClick={goPrev}
                aria-label="Previous slide"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-ocean/10 bg-white text-ocean/50 transition-all duration-200 hover:border-ocean/20 hover:text-ocean hover:bg-ocean/4 cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={goNext}
                aria-label="Next slide"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-ocean/10 bg-white text-ocean/50 transition-all duration-200 hover:border-ocean/20 hover:text-ocean hover:bg-ocean/4 cursor-pointer"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              {slides.map((s, index) => (
                <button
                  key={s.id}
                  onClick={() => goTo(index)}
                  className={cn(
                    "rounded-full transition-all duration-200 cursor-pointer",
                    index === current
                      ? "w-5 h-2 bg-ocean"
                      : "w-2 h-2 bg-ocean/15 hover:bg-ocean/30"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-ocean/65">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-ocean" />
              100% Authentic
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-ocean" />
              Kigali Express
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ArrowUpRight className="h-3.5 w-3.5 text-ocean" />
              Warranty Included
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
