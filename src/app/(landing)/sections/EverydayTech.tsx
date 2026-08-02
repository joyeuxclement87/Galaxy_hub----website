"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { btnBase, btnVariants } from "@/components/ui/button";

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
  const featured = EVERYDAY_COLLECTIONS[0];
  const rest = EVERYDAY_COLLECTIONS.slice(1);

  return (
    <section className="bg-[radial-gradient(ellipse_at_bottom_left,rgba(11,84,151,0.03)_0%,transparent_60%)] px-4 py-14 sm:px-6 md:px-8">
      <div className="mx-auto max-w-[1320px]">
        {/* Section header */}
        <span className="section-label">COLLECTIONS</span>
        <div className="md:flex md:items-end md:justify-between mt-3">
          <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight text-ocean-deeper max-w-xl">
            Tech That Fits Your Life.
          </h2>
          <Link
            href="/products"
            className={cn(btnBase, btnVariants.secondary, "hidden md:inline-flex shrink-0 gap-2 px-6")}
          >
            Browse All <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Bento grid */}
        <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
          {/* Featured (large) card */}
          <Link
            key={featured.id}
            href={featured.href}
            className="group relative flex flex-col overflow-hidden rounded-card border border-ocean/[0.06] bg-white shadow-sm transition-all duration-250 hover:border-ocean/[0.12] hover:shadow-premium md:col-span-2 md:row-span-2"
          >
            <div className="aspect-[16/9] md:aspect-auto md:flex-1 w-full overflow-hidden">
              <img src={featured.image} alt={featured.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 mix-blend-multiply opacity-15 transition-opacity duration-250 group-hover:opacity-5" style={{ background: featured.accent }} />
            </div>
            <div className="p-5 lg:p-6">
              <span className="text-caption font-bold uppercase tracking-[0.22em] text-ocean-deeper/60">{featured.subtitle}</span>
              <h3 className="font-display text-lg sm:text-xl font-bold text-ocean-deeper mt-2">{featured.title}</h3>
              <p className="mt-2 text-sm leading-[1.75] text-ocean-deeper/60 max-w-md">{featured.description}</p>
              <div className={cn(btnBase, btnVariants.primary, "mt-4 gap-2 px-5 group-hover:bg-ocean")}>
                <span>Explore Collection</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>

          {/* Smaller cards */}
          {rest.map((col) => (
            <Link
              key={col.id}
              href={col.href}
              className="group relative flex flex-col overflow-hidden rounded-card border border-ocean/[0.06] bg-white shadow-sm transition-all duration-250 hover:border-ocean/[0.12] hover:shadow-premium"
            >
              <div className="aspect-[16/9] w-full overflow-hidden">
                <img src={col.image} alt={col.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 mix-blend-multiply opacity-15 transition-opacity duration-250 group-hover:opacity-5" style={{ background: col.accent }} />
              </div>
              <div className="flex-1 p-4 lg:p-5">
                <span className="text-caption font-bold uppercase tracking-[0.22em] text-ocean-deeper/60">{col.subtitle}</span>
                <h3 className="font-display text-base sm:text-lg font-bold text-ocean-deeper mt-1.5">{col.title}</h3>
                <p className="mt-1.5 text-sm leading-[1.75] text-ocean-deeper/60">{col.description}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-ocean group-hover:text-ocean-dark transition-colors duration-250">
                  <span>Explore</span>
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
