"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  ShieldCheck,
  Truck,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
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

const slideContentVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 15 : -15,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    y: direction < 0 ? 15 : -15,
    opacity: 0,
  }),
};

const imageVariants = {
  enter: () => ({
    scale: 0.96,
    opacity: 0,
  }),
  center: {
    scale: 1,
    opacity: 1,
  },
  exit: () => ({
    scale: 0.98,
    opacity: 0,
  }),
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
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [startTimer, stopTimer]);

  const goTo = useCallback(
    (index: number) => {
      if (index === current) return;
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
      stopTimer();
      startTimer();
    },
    [current, startTimer, stopTimer]
  );

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
    stopTimer();
    startTimer();
  }, [slides.length, startTimer, stopTimer]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    stopTimer();
    startTimer();
  }, [slides.length, startTimer, stopTimer]);

  if (!slide) return null;

  const discount = slide.originalPrice && slide.originalPrice > slide.price
    ? Math.round((1 - slide.price / slide.originalPrice) * 100)
    : 0;

  return (
    <section
      className="relative bg-[#faf9f6] text-[#0b5497] border-b border-slate-200/70 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 py-8 lg:py-14">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12 min-h-[480px] lg:min-h-[520px]">
          
          {/* ── Left Column: Slide Typography & Info ── */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5 lg:pr-4">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id + "-info"}
                custom={direction}
                variants={slideContentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-5"
              >
                {/* Category & Discount Tag */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#0b5497]">
                    {slide.badge || "FEATURED TECH"}
                  </span>

                  {discount > 0 && (
                    <span className="rounded bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white uppercase tracking-wider">
                      Save {discount}%
                    </span>
                  )}
                </div>

                {/* Main Heading */}
                <h1 className="font-clash text-3xl font-extrabold leading-[1.12] tracking-tight text-[#083e70] sm:text-4xl lg:text-5xl xl:text-[52px]">
                  {slide.title}
                </h1>

                {/* Subtitle / Description */}
                <p className="max-w-xl text-sm leading-relaxed text-[#0b5497]/80 sm:text-base">
                  {slide.description}
                </p>

                {/* Pricing Block */}
                <div className="flex items-baseline gap-3 pt-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0b5497]/60">
                      {slide.currency}
                    </span>
                    <span className="font-clash text-3xl font-extrabold text-[#083e70] sm:text-4xl">
                      {slide.price.toLocaleString()}
                    </span>
                  </div>

                  {slide.originalPrice && slide.originalPrice > slide.price && (
                    <span className="text-sm text-[#0b5497]/40 line-through font-medium">
                      {slide.currency}&nbsp;{slide.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* CTA Action Buttons */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <button
                    onClick={() => onAddToCart(slide.id)}
                    className="inline-flex items-center gap-2.5 rounded-xl bg-[#0b5497] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#083e70] cursor-pointer"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>

                  <Link
                    href={`/product/${slide.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-[#0b5497] transition-colors hover:bg-slate-50 hover:border-slate-400"
                  >
                    <span>Explore Product</span>
                    <ArrowUpRight className="h-4 w-4 text-[#0f70c9]" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Right Column: Full Width Image Showcase ── */}
          <div className="lg:col-span-5 relative flex items-center justify-center w-full h-full">
            <div className="w-full h-full rounded-2xl border border-slate-200/90 bg-[#f8f9fa] flex items-center justify-center relative shadow-sm min-h-[360px] sm:min-h-[440px] lg:min-h-[500px] overflow-hidden">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id + "-image"}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="relative z-10 w-full h-full min-h-[360px] sm:min-h-[440px] lg:min-h-[500px] flex items-center justify-center"
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover object-center w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                </motion.div>
              </AnimatePresence>

            </div>
          </div>
        </div>

        {/* ── Slide Controls & Minimal Trust Bar ── */}
        <div className="mt-8 pt-6 border-t border-slate-200/70 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          
          {/* Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <button
                onClick={goPrev}
                aria-label="Previous slide"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-[#0b5497] transition-colors hover:bg-slate-100 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={goNext}
                aria-label="Next slide"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-[#0b5497] transition-colors hover:bg-slate-100 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Pagination Indicators */}
            <div className="flex items-center gap-1.5">
              {slides.map((s, index) => (
                <button
                  key={s.id}
                  onClick={() => goTo(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-200 cursor-pointer",
                    index === current
                      ? "w-6 bg-[#0b5497]"
                      : "w-2 bg-slate-300 hover:bg-slate-400"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Clean Trust Features */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-[#0b5497]/90 font-manrope">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#0b5497]" />
              100% Authentic Products
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#0b5497]" />
              Official Warranty Included
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-[#0b5497]" />
              Kigali Express Delivery
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
