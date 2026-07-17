"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const EVERYDAY_COLLECTIONS = [
  {
    id: "study-setup",
    title: "Study Setup",
    subtitle: "For students",
    description: "Laptops, earbuds, power banks, and accessories for the modern student.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
    href: "/products/laptops",
    accent: "#EAF3FC",
  },
  {
    id: "work-setup",
    title: "Work Setup",
    subtitle: "For professionals",
    description: "MacBooks, keyboards, monitors, and productivity tools for the modern workspace.",
    image: "https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&q=80&w=800",
    href: "/products/laptops",
    accent: "#F0F7EE",
  },
  {
    id: "travel-essentials",
    title: "Travel Essentials",
    subtitle: "For explorers",
    description: "Compact power banks, noise-cancelling earbuds, and portable tech for every trip.",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800",
    href: "/products/accessories",
    accent: "#FFF5E8",
  },
  {
    id: "home-office",
    title: "Home Office",
    subtitle: "For remote workers",
    description: "Microphones, webcams, ring lights, and ergonomic accessories to level up your home office.",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&q=80&w=800",
    href: "/products/creator-gear",
    accent: "#F3F0FC",
  },
] as const;

export function EverydayTech() {
  return (
    <section
      id="everyday-tech"
      aria-labelledby="everyday-heading"
      className="bg-ivory px-4 py-20 sm:px-6 md:px-12 md:py-28"
    >
      <div className="mx-auto max-w-[1320px]">

        {/* Section header */}
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl space-y-3">
            <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-accent font-manrope">
              EVERYDAY TECH
            </span>
            <h2
              id="everyday-heading"
              className="font-clash text-3xl font-bold leading-tight text-[#10233D] sm:text-4xl lg:text-[44px] lg:leading-[1.06]"
            >
              Tech That Fits Your Life.
            </h2>
            <p className="text-sm leading-[1.8] text-[#10233D]/60 font-manrope">
              Curated bundles for students, professionals, travellers, and remote workers — all available in Kigali with delivery across Rwanda.
            </p>
          </div>
          <Link
            href="/products"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-ocean transition-colors duration-200 hover:text-ocean-dark"
          >
            Browse All Products
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Collections grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
          {EVERYDAY_COLLECTIONS.map((col) => (
            <Link
              key={col.id}
              href={col.href}
              className="group relative flex flex-col overflow-hidden rounded-[28px] border border-ocean/8 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-ocean/20 hover:shadow-md"
            >
              {/* Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                  src={col.image}
                  alt={col.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                {/* Subtle color tint overlay */}
                <div
                  className="absolute inset-0 mix-blend-multiply opacity-20 transition-opacity duration-300 group-hover:opacity-10"
                  style={{ background: col.accent }}
                />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.22em] text-ocean/50 font-manrope">
                  {col.subtitle}
                </span>
                <h3 className="font-clash text-xl font-bold text-[#10233D] sm:text-2xl">{col.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-[1.75] text-[#10233D]/60 font-manrope">
                  {col.description}
                </p>
                <div className="mt-5 flex items-center gap-1.5 text-sm font-bold text-ocean transition-colors duration-200 group-hover:text-ocean-dark">
                  <span>Explore Collection</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
