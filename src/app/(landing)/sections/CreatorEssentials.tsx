"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";
import { CREATOR_CATEGORIES, CREATOR_BUNDLE } from "@/data/mock-data";
import { cn } from "@/lib/utils";
import { btnBase, btnVariants } from "@/components/ui/button";

export function CreatorEssentials() {
  return (
    <section
      id="creator-essentials"
      aria-labelledby="creator-heading"
      className="bg-[#0B1F3A] px-4 py-16 sm:px-6"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl space-y-3">
            <span className="block text-caption font-bold uppercase tracking-[0.28em] text-ocean-light/60">
              CREATOR ESSENTIALS
            </span>
            <h2
              id="creator-heading"
              className="font-clash text-2xl sm:text-3xl font-bold leading-tight text-white"
            >
              For Creators Who Refuse to Compromise.
            </h2>
            <p className="text-sm leading-[1.8] text-white/70">
              Ring lights, tripods, microphones, phone holders, and power banks — everything you need to create beautiful content, available in Kigali.
            </p>
          </div>
          <Link
            href="/products/creator-gear"
            className={cn(btnBase, btnVariants.ghostWhite, "gap-2 px-6")}
          >
            Shop All Creator Gear
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          {CREATOR_CATEGORIES.map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/products/${cat.slug}`}
              className={`group relative overflow-hidden rounded-card bg-white/5 border border-white/8 transition-all duration-250 hover:bg-white/10 hover:border-white/15 hover:-translate-y-[2px] ${
                idx === 0 ? "col-span-2 md:col-span-1 lg:col-span-2 row-span-1" : ""
              }`}
            >
              <div className={`relative w-full overflow-hidden ${idx === 0 ? "aspect-[16/9] lg:aspect-[4/3]" : "aspect-square"}`}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/80 via-transparent to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="font-clash text-sm font-bold text-white sm:text-base">{cat.name}</h3>
                <p className="mt-0.5 text-xs text-white/60">{cat.count} items</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-start gap-4 rounded-card border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn bg-ocean/30 text-ocean-light">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <p className="font-clash text-sm font-bold text-white">{CREATOR_BUNDLE.name}</p>
              <p className="text-sm text-white/70">{CREATOR_BUNDLE.description}</p>
            </div>
          </div>
          <Link
            href="/products/creator-gear"
            className={cn(btnBase, btnVariants.primaryWhite, "gap-2 px-6")}
          >
            <ShoppingBagIcon />
            From RWF {new Intl.NumberFormat("en-US").format(CREATOR_BUNDLE.startingPrice)}
          </Link>
        </div>
      </div>
    </section>
  );
}

function ShoppingBagIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}
