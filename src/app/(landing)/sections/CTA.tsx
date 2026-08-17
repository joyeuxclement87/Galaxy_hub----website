"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BLUR_PLACEHOLDER } from "@/lib/image";
import { btnBase, btnVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { MOTION } from "@/lib/motion";

const TRUST_ITEMS = [
  "Genuine Products",
  "Nationwide Delivery",
  "Warranty Support",
  "Friendly Customer Service",
];

export function CTA() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative px-4 py-16 sm:px-6 md:px-8 md:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="relative isolate overflow-hidden rounded-[24px] border border-ocean/[0.08] px-6 py-14 sm:px-12 md:px-16 md:py-20 lg:py-24 shadow-card-premium">
          {/* Background Image */}
          <div className="absolute inset-0 -z-20">
            <Image
              src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=1200"
              alt="Premium Tech Devices"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
              className="object-cover object-right select-none"
            />
          </div>

          {/* Left-to-right gradient overlay */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ocean-deeper via-ocean-deeper/90 to-ocean-deeper/20 md:via-ocean-deeper/80 md:to-transparent" />
          
          {/* Extra ambient glow on the left */}
          <div className="absolute inset-y-0 left-0 w-1/2 -z-10 bg-gradient-to-r from-accent/10 to-transparent" />

          <div className="relative z-10 max-w-3xl">
            {/* Eyebrow label */}
            <Reveal y={8}>
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-ivory/60">
                Ready to Upgrade?
              </span>
            </Reveal>

            {/* Large Display Headline */}
            <Reveal y={18} delay={MOTION.stagger}>
              <h2
                id="cta-heading"
                className="mt-5 font-display font-bold leading-[1.04] tracking-[-0.03em] text-ivory text-3xl sm:text-4xl md:text-[3.25rem] lg:text-[3.75rem]"
              >
                Your Next Device<br className="hidden sm:block" /> Starts Here.
              </h2>
            </Reveal>

            {/* Short Supporting Copy */}
            <Reveal y={12} delay={MOTION.stagger * 2}>
              <p className="mt-4 max-w-xl text-sm sm:text-base leading-[1.7] text-ivory/70">
                Browse genuine smartphones, laptops, accessories, creator gear, and everyday technology with delivery available across Rwanda.
              </p>
            </Reveal>

            {/* Primary CTA + Secondary CTA */}
            <Reveal y={10} delay={MOTION.stagger * 3}>
              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Link
                  href="/order"
                  className={cn(
                    btnBase,
                    btnVariants.primaryWhite,
                    "gap-2 px-7 w-full sm:w-auto justify-center"
                  )}
                >
                  Order Now
                  <ArrowRight className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-[4px]" />
                </Link>
                <Link
                  href="/products"
                  className={cn(
                    btnBase,
                    btnVariants.ghostWhite,
                    "gap-2 px-7 w-full sm:w-auto justify-center"
                  )}
                >
                  Browse Products
                </Link>
              </div>
            </Reveal>

            {/* Trust Items */}
            <Reveal y={10} delay={MOTION.stagger * 4}>
              <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
                {TRUST_ITEMS.map((item, index) => (
                  <li key={item} className="flex items-center gap-x-5">
                    {index > 0 && (
                      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/25" />
                    )}
                    <span className="text-[13px] font-medium text-ivory/55">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
