"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { btnBase, btnVariants } from "@/components/ui/button";

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
        <div className="relative isolate overflow-hidden rounded-[24px] border border-ocean/[0.08] cta-editorial-bg px-6 py-14 sm:px-12 md:px-16 md:py-20 lg:py-24 shadow-card-premium">
          <div className="relative z-10 max-w-3xl">
            {/* Eyebrow label */}
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-ivory/60">
              Ready to Upgrade?
            </span>

            {/* Large Display Headline */}
            <h2
              id="cta-heading"
              className="mt-5 font-display font-bold leading-[1.04] tracking-[-0.03em] text-ivory text-3xl sm:text-4xl md:text-[3.25rem] lg:text-[3.75rem]"
            >
              Your Next Device<br className="hidden sm:block" /> Starts Here.
            </h2>

            {/* Short Supporting Copy */}
            <p className="mt-4 max-w-xl text-sm sm:text-base leading-[1.7] text-ivory/70">
              Browse genuine smartphones, laptops, accessories, creator gear, and everyday technology with delivery available across Rwanda.
            </p>

            {/* Primary CTA + Secondary CTA */}
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

            {/* Trust Items */}
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
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
