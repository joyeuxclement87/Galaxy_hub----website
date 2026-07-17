"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";
import { CREATOR_CATEGORIES, CREATOR_BUNDLE } from "@/data/mock-data";

export function CreatorEssentials() {
  return (
    <section
      id="creator-essentials"
      aria-labelledby="creator-heading"
      className="bg-[#0B1F3A] px-4 py-20 sm:px-6 md:px-12 md:py-28"
    >
      <div className="mx-auto max-w-[1320px]">

        {/* Section header */}
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl space-y-3">
            <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-ocean-light/70 font-manrope">
              CREATOR ESSENTIALS
            </span>
            <h2
              id="creator-heading"
              className="font-clash text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[44px] lg:leading-[1.06]"
            >
              For Creators Who Refuse&nbsp;to&nbsp;Compromise.
            </h2>
            <p className="text-sm leading-[1.8] text-white/65 font-manrope">
              Ring lights, tripods, microphones, phone holders, and power banks — everything you need to create beautiful content, available in Kigali.
            </p>
          </div>
          <Link
            href="/products/creator-gear"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/90 transition-all duration-200 hover:bg-white/10 hover:border-white/30"
          >
            Shop All Creator Gear
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          {CREATOR_CATEGORIES.map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/products/${cat.slug}`}
              className={`group relative overflow-hidden rounded-[24px] bg-white/5 border border-white/8 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 ${
                idx === 0 ? "col-span-2 md:col-span-1 lg:col-span-2 row-span-1" : ""
              }`}
            >
              {/* Image */}
              <div className={`relative w-full overflow-hidden ${idx === 0 ? "aspect-[16/9] lg:aspect-[4/3]" : "aspect-square"}`}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/80 via-transparent to-transparent" />
              </div>

              {/* Label */}
              <div className="p-4">
                <h3 className="font-clash text-sm font-bold text-white sm:text-base">{cat.name}</h3>
                <p className="mt-0.5 text-[11px] text-white/50 font-manrope">{cat.count} items</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Creator bundle CTA */}
        <div className="mt-8 flex flex-col items-start gap-5 rounded-[24px] border border-white/10 bg-white/5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ocean/30 text-ocean-light">
              <Camera className="h-6 w-6" />
            </div>
            <div>
              <p className="font-clash text-base font-bold text-white">{CREATOR_BUNDLE.name}</p>
              <p className="text-sm text-white/60 font-manrope">{CREATOR_BUNDLE.description}</p>
            </div>
          </div>
          <Link
            href="/products/creator-gear"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ocean px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(11,84,151,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(11,84,151,0.45)]"
          >
            <ShoppingBagIcon />
            From RWF {new Intl.NumberFormat("en-US").format(CREATOR_BUNDLE.startingPrice)}
          </Link>
        </div>

      </div>
    </section>
  );
}

// Inline small icon to avoid extra import
function ShoppingBagIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}
