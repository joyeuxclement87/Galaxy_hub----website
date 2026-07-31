"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingCart, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

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

  const { cart, addToCart, removeFromCart } = useApp();
  const slide = slides[current] || slides[0];
  const isInCart = slide ? cart.includes(slide.id) : false;

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (slides.length <= 1 || isPaused) return;
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
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
    <section className="relative bg-ivory overflow-hidden">
      {/* Grid texture — very subtle */}
      <div className="absolute inset-0 hero-grid-texture opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16 pt-16 pb-12 lg:pt-24 lg:pb-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16 min-h-[500px] lg:min-h-[600px]">

          {/* ── Left: Content ── */}
          <div className="lg:col-span-5 flex flex-col justify-center z-10">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id}
                custom={direction}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-7"
              >
                {/* Category / type label — no pill, just text */}
                <div className="flex items-center gap-3">
                  <span className="section-label">{slide.badge || "FEATURED TECH"}</span>
                  {discount > 0 && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
                      — Save {discount}%
                    </span>
                  )}
                </div>

                {/* Title — large and confident */}
                <h1 className="font-display text-[clamp(2.25rem,5.5vw,3.75rem)] font-bold leading-[1.05] tracking-tight text-ocean-deeper">
                  {slide.title}
                </h1>

                {/* Description — stronger contrast */}
                <p className="max-w-[480px] text-base leading-relaxed text-ocean-deeper/65">
                  {slide.description}
                </p>

                {/* Price block */}
                <div className="space-y-1 pt-1">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-ocean/45">
                    Starting from
                  </span>
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-[clamp(2rem,4.5vw,3rem)] font-bold leading-none text-ocean-deeper">
                      {slide.currency} {slide.price.toLocaleString()}
                    </span>
                    {slide.originalPrice && slide.originalPrice > slide.price && (
                      <span className="text-base text-ocean-deeper/30 line-through font-medium">
                        {slide.currency} {slide.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button
                    variant="primary"
                    onClick={() => {
                      if (isInCart) {
                        removeFromCart(slide.id);
                      } else {
                        addToCart(slide.id, {
                          id: slide.id,
                          title: slide.title,
                          price: slide.price,
                          currency: slide.currency,
                          image: slide.image,
                          slug: slide.slug,
                        });
                      }
                    }}
                    className={cn(
                      "rounded-btn h-12 px-8 text-[11px] font-bold uppercase tracking-[0.14em] transition-all duration-300 shadow-btn hover:shadow-btn-hover hover:-translate-y-0.5 active:translate-y-0",
                      isInCart
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-ocean-deeper text-white hover:bg-ocean-dark"
                    )}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {isInCart ? "Added to Cart" : "Add to Cart"}
                  </Button>

                  <Link
                    href={`/product/${slide.slug}`}
                    className="group inline-flex items-center gap-2 rounded-btn h-12 px-8 border border-ocean/20 bg-white/70 text-ocean-deeper text-[11px] font-bold uppercase tracking-[0.14em] transition-all duration-300 hover:border-ocean/35 hover:bg-white hover:shadow-sm hover:-translate-y-0.5"
                  >
                    View Details
                    <ArrowUpRight className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Right: Product Image ── */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            {/* Radial glow behind the image */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[520px] h-[380px] rounded-[100px] bg-[radial-gradient(ellipse,_rgba(11,84,151,0.08)_0%,_transparent_68%)] lg:w-[680px] lg:h-[480px]" />
            </div>

            <div className="relative z-10 w-full max-w-[640px] aspect-[16/11] overflow-hidden rounded-card bg-gradient-to-br from-white to-ivory-dark/40">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id + "-img"}
                  initial={{ scale: 1.04, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.98, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 640px, 90vw"
                    className="object-cover drop-shadow-[0_28px_56px_rgba(0,0,0,0.09)]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Bottom bar: nav controls only ── */}
        <div className="relative mt-12 pt-6 border-t border-ocean/[0.06] flex items-center justify-between">
          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {slides.map((s, index) => (
              <button
                key={s.id}
                onClick={() => goTo(index)}
                className={cn(
                  "relative overflow-hidden rounded-full transition-all duration-300 cursor-pointer h-2",
                  index === current
                    ? "w-8 bg-ocean-deeper/20"
                    : "w-2 bg-ocean-deeper/15 hover:bg-ocean-deeper/30"
                )}
                aria-label={`Go to slide ${index + 1}`}
              >
                {index === current && (
                  <motion.div
                    key={`progress-${current}`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="h-full bg-ocean-deeper rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Prev / Next arrows */}
          <div className="flex items-center gap-2">
            <Button
              variant="icon"
              onClick={goPrev}
              aria-label="Previous slide"
              className="h-10 w-10 rounded-btn border border-ocean/10 bg-white/60 text-ocean/50 hover:bg-white hover:text-ocean hover:border-ocean/20 transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="icon"
              onClick={goNext}
              aria-label="Next slide"
              className="h-10 w-10 rounded-btn border border-ocean/10 bg-white/60 text-ocean/50 hover:bg-white hover:text-ocean hover:border-ocean/20 transition-all duration-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
