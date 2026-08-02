"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getSessionId, notifyCartChanged, useSupabaseCart } from "@/hooks/use-cart";
import { addCartItemBySlug } from "@/actions/cart";

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
}

const contentVariants = {
  enter: (d: number) => ({ y: d > 0 ? 20 : -20, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (d: number) => ({ y: d < 0 ? 20 : -20, opacity: 0 }),
};

export function HeroSection({ slides }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [addingSlugs, setAddingSlugs] = useState<Record<string, boolean>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { items: cartItems, refresh: refreshCart, loading: cartLoading, remove: removeFromCart } = useSupabaseCart();

  const slide = slides[current] || slides[0];
  
  const getCartItemId = (slug: string) => {
    const item = cartItems.find(item => item.product?.slug === slug);
    return item?.id;
  };

  const isInCart = !cartLoading && !!slide && !!getCartItemId(slide.slug);
  const isAdding = slide ? !!addingSlugs[slide.slug] : false;

  const handleAddToCart = async () => {
    if (!slide || isAdding) return;
    
    const cartItemId = getCartItemId(slide.slug);
    
    if (cartItemId) {
      // Remove from cart
      await removeFromCart(cartItemId);
      await refreshCart();
      notifyCartChanged();
      return;
    }
    
    setAddingSlugs((prev) => ({ ...prev, [slide.slug]: true }));
    await addCartItemBySlug(getSessionId(), slide.slug);
    setAddingSlugs((prev) => ({ ...prev, [slide.slug]: false }));
    await refreshCart();
    notifyCartChanged();
  };

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

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 pt-8 pb-8 lg:pt-16 lg:pb-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12 min-h-[430px] lg:min-h-[560px]">

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
                {/* Category label */}
                 <div className="flex items-center gap-3">
                   <span className="text-caption font-bold uppercase tracking-[0.16em] text-accent">
                     {slide.badge || "FEATURED TECH"}
                   </span>
                   {discount > 0 && (
                     <span className="text-caption font-bold uppercase tracking-wider text-red-500">
                       — Save {discount}%
                     </span>
                   )}
                 </div>

                 {/* Title */}
                 <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] tracking-tight text-ocean-deeper">
                   {slide.title}
                 </h1>

                 {/* Description */}
                 <p className="max-w-[480px] text-sm leading-relaxed text-ocean-deeper/65 sm:text-base">
                   {slide.description}
                 </p>

                 {/* Price block */}
                 <div className="space-y-1 pt-1">
                   <span className="block text-caption font-bold uppercase tracking-[0.18em] text-ocean/45">
                     Starting from
                   </span>
                   <div className="flex items-baseline gap-4">
                     <span className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-none text-ocean-deeper">
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
                     onClick={handleAddToCart}
                     disabled={isAdding}
                     className={cn(
                       "rounded-btn h-12 px-6 py-0 text-sm font-bold uppercase tracking-[0.12em] transition-all duration-250 shadow-btn hover:bg-ocean-dark hover:shadow-btn-hover active:scale-[0.98]",
                       isInCart
                         ? "bg-red-600 text-white hover:bg-red-700"
                         : "bg-ocean-deeper text-white hover:bg-ocean-dark",
                       isAdding && "opacity-80"
                     )}
                   >
                     {isAdding ? (
                       <>Adding...</>
                     ) : isInCart ? (
                       "Remove from Cart"
                     ) : (
                       <>Add to Cart</>
                     )}
                   </Button>

                   <Link
                     href={`/product/${slide.slug}`}
                     className="group inline-flex items-center gap-2 rounded-btn h-12 px-6 border border-ocean/20 bg-white/70 text-ocean-deeper text-sm font-bold uppercase tracking-[0.12em] transition-all duration-250 hover:border-ocean/35 hover:bg-white hover:shadow-sm"
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
              <div className="w-[480px] h-[350px] rounded-[100px] bg-[radial-gradient(ellipse,_rgba(11,84,151,0.06)_0%,_transparent_68%)] lg:w-[620px] lg:h-[440px]" />
            </div>

            <div className="relative z-10 w-full max-w-[580px] aspect-[16/11] overflow-hidden rounded-card bg-gradient-to-br from-white to-ivory-dark/40">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id + "-img"}
                  initial={{ scale: 1.04, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.98, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 580px, 90vw"
                    className="object-cover drop-shadow-[0_28px_56px_rgba(0,0,0,0.08)]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Bottom bar: nav controls only ── */}
        <div className="relative mt-6 pt-4 border-t border-ocean/[0.06] flex items-center justify-between">
          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {slides.map((s, index) => (
              <button
                key={s.id}
                onClick={() => goTo(index)}
                className={cn(
                  "relative overflow-hidden rounded-full transition-all duration-250 cursor-pointer h-2",
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
