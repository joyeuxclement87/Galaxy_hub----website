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

const CTA_BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=1600";

export function CTA() {
  return (
    <section aria-labelledby="cta-heading" className="px-4 py-6 sm:px-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-[1280px]">
        <div className="relative isolate min-h-[380px] overflow-hidden rounded-card sm:min-h-[420px] md:min-h-[460px]">
          {/* Background image */}
          <Image
            src={CTA_BACKGROUND_IMAGE}
            alt="Galaxy Hub tech devices"
            fill
            sizes="1280px"
            className="object-cover object-right"
            priority={false}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-ocean via-ocean/95 to-transparent md:via-ocean-dark/90 md:to-ocean-dark/10" />

          <div className="relative z-10 flex min-h-[380px] items-center px-6 py-8 md:min-h-[460px] md:px-12 md:py-12">
            <div className="max-w-lg text-white">
              <span className="block text-caption font-bold uppercase tracking-[0.28em] text-white/60">
                READY TO UPGRADE?
              </span>
              <h2
                id="cta-heading"
                className="mt-3 font-clash text-2xl sm:text-3xl md:text-[clamp(2rem,4vw,3rem)] font-bold leading-tight text-white"
              >
                Your Next Device<br />Starts Here.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-[1.7] text-white/75">
                Browse genuine smartphones, laptops, accessories, creator gear, and everyday technology with delivery available across Rwanda.
              </p>

  <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/order"
                  className="group inline-flex items-center gap-2 rounded-btn bg-white px-6 h-11 py-0 text-sm font-bold uppercase tracking-[0.12em] text-ocean shadow-btn transition-all duration-250 hover:bg-white/90 hover:shadow-btn-hover"
                >
                  Order Now
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 rounded-btn border border-white/15 px-6 h-11 py-0 text-sm font-bold uppercase tracking-[0.12em] text-white transition-all duration-250 hover:bg-white/10"
                >
                  Browse Products
                </Link>
              </div>

              <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                {TRUST_ITEMS.map((item, index) => (
                  <li key={item} className="flex items-center gap-x-4">
                    {index > 0 && <span className="text-white/30">—</span>}
                    <span className="text-sm font-medium text-white/85">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
