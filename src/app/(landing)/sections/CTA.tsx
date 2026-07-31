"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const TRUST_ITEMS = [
  "Genuine Products",
  "Nationwide Delivery",
  "Warranty Support",
  "Friendly Customer Service",
];

export function CTA() {
  return (
    <section aria-labelledby="cta-heading" className="px-4 py-10 sm:px-6 md:px-12 md:py-16">
      <div className="mx-auto max-w-[1280px]">
        <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-ocean via-ocean-dark to-[#062d54] px-8 py-12 md:px-16 md:py-20">
          <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_0.45fr] lg:items-center">
            <div className="text-white">
              <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-white/60 font-manrope">
                READY TO UPGRADE?
              </span>
              <h2
                id="cta-heading"
                className="mt-4 font-clash text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight text-white"
              >
                Your Next Device<br />Starts Here.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-[1.8] text-white/75 font-manrope">
                Browse genuine smartphones, laptops, accessories, creator gear, and everyday technology with delivery available across Rwanda.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/order"
                  className="group inline-flex items-center gap-2 rounded-btn bg-white px-7 h-11 py-0 text-[11px] font-bold uppercase tracking-[0.12em] text-ocean shadow-btn transition-all duration-300 hover:bg-white/90 hover:shadow-btn-hover hover:-translate-y-0.5"
                >
                  Order Now
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 rounded-btn border border-white/15 px-7 h-11 py-0 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5"
                >
                  Browse Products
                </Link>
              </div>

              <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
                {TRUST_ITEMS.map((item, index) => (
                  <li key={item} className="flex items-center gap-x-5">
                    {index > 0 && <span className="text-white/30">—</span>}
                    <span className="text-sm font-medium text-white/85">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative h-[220px] w-full max-w-[360px] md:h-[280px]">
                <Image
                  src="/cta-composition.svg"
                  alt="Galaxy Hub tech devices"
                  fill
                  sizes="(min-width: 1024px) 360px, 90vw"
                  className="object-contain"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
