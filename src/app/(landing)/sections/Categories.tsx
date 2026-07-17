"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// NOTE: In production this data (image, description, product count, href) should be
// fetched from Sanity CMS so counts and imagery stay in sync with the live catalog.
const CATEGORIES = [
  {
    name: "Smartphones",
    description: "Flagship phones from Apple, Samsung and Google.",
    count: 24,
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=900",
  },
  {
    name: "Phone Cases",
    description: "Protection and style for every model.",
    count: 38,
    image:
      "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&q=80&w=900",
  },
  {
    name: "Laptops",
    description: "Power and portability for work and play.",
    count: 16,
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&q=80&w=900",
  },
  {
    name: "Earbuds",
    description: "True wireless sound, all-day comfort.",
    count: 21,
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=900",
  },
  {
    name: "Headphones",
    description: "Immersive audio for focus and travel.",
    count: 14,
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=900",
  },
  {
    name: "Bluetooth Speakers",
    description: "Room-filling sound, anywhere you go.",
    count: 12,
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=900",
  },
  {
    name: "Ring Lights",
    description: "Studio-quality lighting for content creators.",
    count: 9,
    image:
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=900",
  },
  {
    name: "Camera Tripods",
    description: "Stable, portable support for every shot.",
    count: 11,
    image:
      "https://images.unsplash.com/photo-1520170350707-b2da59970118?auto=format&fit=crop&q=80&w=900",
  },
] as const;

export function Categories() {
  return (
    <section id="categories" className="relative overflow-hidden bg-[#FFFEF9] px-6 py-24 md:px-12">
      <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(11,84,151,0.10)_0%,transparent_70%)]" />

      <div className="relative mx-auto max-w-[1320px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
              SHOP BY CATEGORY
            </span>
            <h2 className="font-clash text-3xl font-bold leading-tight text-[#10233D] sm:text-4xl lg:text-[44px]">
              Everything You Need, All in One Place
            </h2>
            <p className="text-sm leading-relaxed text-ocean/70 sm:text-base">
              Browse Galaxy Hub&apos;s full range of genuine technology products, from everyday
              essentials to premium devices, all available with delivery across Rwanda.
            </p>
          </div>

          <Link
            href="/products"
            className="group inline-flex shrink-0 items-center gap-1.5 self-start text-sm font-semibold text-ocean transition-colors duration-200 hover:text-accent sm:self-auto"
          >
            View All Categories
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.name}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="group block overflow-hidden rounded-[24px] border border-black/8 bg-white shadow-[0_10px_28px_rgba(16,35,61,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(16,35,61,0.14)]"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 300px, 45vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </div>

              <div className="p-4 sm:p-5">
                <h3 className="font-clash text-base font-bold text-[#10233D] transition-colors duration-300 group-hover:text-ocean sm:text-lg">
                  {category.name}
                </h3>
                <p className="mt-1 line-clamp-1 text-xs text-ocean/60 sm:text-sm">
                  {category.description}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-ocean/50">
                  <span>{category.count} products</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-accent">
                    Explore
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
