import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/data/mock-data";

const FALLBACK_CATEGORIES: { name: string; description: string; image: string; href: string }[] = [
  { name: "Smartphones", description: "Latest flagship phones and everyday devices", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600", href: "/products/smartphones" },
  { name: "Laptops", description: "Powerful machines for work and creativity", image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&q=80&w=600", href: "/products/laptops" },
  { name: "Smart Watches", description: "Stay connected wherever you go", image: "https://images.unsplash.com/photo-1546868871-af0de0ae72aa?auto=format&fit=crop&q=80&w=600", href: "/products/smart-watches" },
  { name: "Audio", description: "Premium sound everywhere", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600", href: "/products/audio" },
  { name: "Gaming", description: "Upgrade your gaming experience", image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=600", href: "/products/gaming" },
  { name: "Accessories", description: "Essential tech for your devices", image: "https://images.unsplash.com/photo-1609592424085-f5b2257d7620?auto=format&fit=crop&q=80&w=600", href: "/products/accessories" },
];

export function FeaturedCategories({ categories }: { categories?: Category[] }) {
  const display = categories && categories.length > 0
    ? categories.map((c) => ({
        name: c.name,
        description: c.description,
        image: c.image,
        href: `/products/${c.slug}`,
      }))
    : FALLBACK_CATEGORIES;
  return (
    <section id="categories" className="bg-[#FFFEF9] px-6 py-24 md:px-12 lg:py-32">
      <div className="mx-auto max-w-[1320px]">
        {/* ── Heading ──────────────────────────────────────────────── */}
        <div className="max-w-2xl">
          <h2 className="font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-[#111827] sm:text-[40px] lg:text-[48px]">
            Explore Our Categories
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-[#6B7280] sm:text-lg">
            Discover smartphones, laptops, accessories, and smart devices built for your lifestyle.
          </p>
        </div>

        {/* ── Grid ─────────────────────────────────────────────────── */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {display.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative block overflow-hidden rounded-[24px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-400 ease-out hover:-translate-y-1 hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.10)]"
            >
              {/* Gradient glow behind image */}
              <div className="absolute right-0 top-0 h-[70%] w-[80%] bg-[radial-gradient(ellipse_at_top_right,rgba(11,84,151,0.08)_0%,transparent_70%)]" />

              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[5/4]">
                <Image
                  src={cat.image}
                  alt={`${cat.name} category — ${cat.description}`}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-all duration-500 ease-out group-hover:scale-[1.04]"
                />
              </div>

              {/* Text area */}
              <div className="flex items-center justify-between px-6 py-5 sm:px-7 sm:py-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#111827] sm:text-xl">
                    {cat.name}
                  </h3>
                  <p className="mt-0.5 text-sm leading-snug text-[#6B7280] sm:text-base">
                    {cat.description}
                  </p>
                </div>
                <span className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#111827]/8 text-[#6B7280] transition-all duration-300 group-hover:border-[#0B5497]/20 group-hover:bg-[#0B5497] group-hover:text-white">
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
