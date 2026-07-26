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
  const featured = EVERYDAY_COLLECTIONS[0];
  const rest = EVERYDAY_COLLECTIONS.slice(1);

  return (
    <section className="bg-[radial-gradient(ellipse_at_bottom_left,rgba(11,84,151,0.03)_0%,transparent_60%)] px-4 py-20 sm:px-6 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1320px]">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent font-manrope">COLLECTIONS</p>
        <div className="md:flex md:items-end md:justify-between mt-3">
          <h2 className="font-clash text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight text-ocean-deeper max-w-xl">
            Tech That Fits Your Life.
          </h2>
          <Link
            href="/products"
            className="hidden md:inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-ocean hover:text-ocean-dark transition-colors mt-2 md:mt-0"
          >
            Browse All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
          <Link
            key={featured.id}
            href={featured.href}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-ocean/8 bg-white shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:border-ocean/15 hover:shadow-md md:col-span-2 md:row-span-2"
          >
            <div className="aspect-[16/9] md:aspect-auto md:flex-1 w-full overflow-hidden">
              <img src={featured.image} alt={featured.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 mix-blend-multiply opacity-20 transition-opacity duration-300 group-hover:opacity-10" style={{ background: featured.accent }} />
            </div>
            <div className="p-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ocean/45 font-manrope">{featured.subtitle}</span>
              <h3 className="font-clash text-xl font-bold text-ocean-deeper mt-1">{featured.title}</h3>
              <p className="mt-2 text-sm leading-[1.75] text-ocean/55 font-manrope">{featured.description}</p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-ocean group-hover:text-ocean-dark transition-colors">
                <span>Explore Collection</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {rest.map((col) => (
            <Link
              key={col.id}
              href={col.href}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-ocean/8 bg-white shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:border-ocean/15 hover:shadow-md"
            >
              <div className="aspect-[16/9] w-full overflow-hidden">
                <img src={col.image} alt={col.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 mix-blend-multiply opacity-20 transition-opacity duration-300 group-hover:opacity-10" style={{ background: col.accent }} />
              </div>
              <div className="flex-1 p-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ocean/45 font-manrope">{col.subtitle}</span>
                <h3 className="font-clash text-lg font-bold text-ocean-deeper mt-1">{col.title}</h3>
                <p className="mt-2 text-sm leading-[1.75] text-ocean/55 font-manrope">{col.description}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-ocean group-hover:text-ocean-dark transition-colors">
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
