import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/data/mock-data";

const FALLBACK_CATEGORIES: { name: string; description: string; image: string; href: string; productCount: number }[] = [
  { name: "Smartphones", description: "Latest flagship phones and everyday devices", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800", href: "/products?category=smartphones", productCount: 124 },
  { name: "Laptops", description: "Powerful machines for work and creativity", image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&q=80&w=800", href: "/products?category=laptops", productCount: 86 },
  { name: "Smart Watches", description: "Stay connected wherever you go", image: "https://images.unsplash.com/photo-1546868871-af0de0ae72aa?auto=format&fit=crop&q=80&w=800", href: "/products?category=smart-watches", productCount: 52 },
  { name: "Audio", description: "Premium sound everywhere", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800", href: "/products?category=audio", productCount: 78 },
  { name: "Gaming", description: "Upgrade your gaming experience", image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=800", href: "/products?category=gaming", productCount: 34 },
  { name: "Accessories", description: "Essential tech for your devices", image: "https://images.unsplash.com/photo-1609592424085-f5b2257d7620?auto=format&fit=crop&q=80&w=800", href: "/products?category=accessories", productCount: 342 },
];

const CATEGORY_PRIORITY = ["smartphone", "phone", "laptop", "computer", "audio", "accessor", "gaming", "watch", "wearable"];

function categoryRank(name: string): number {
  const lower = name.toLowerCase();
  const index = CATEGORY_PRIORITY.findIndex((keyword) => lower.includes(keyword));
  return index === -1 ? CATEGORY_PRIORITY.length : index;
}

function sortByPriority<T extends { name: string }>(items: T[]): T[] {
  return items
    .map((item, index) => ({ item, index, rank: categoryRank(item.name) }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map(({ item }) => item);
}

export function FeaturedCategories({ categories }: { categories?: Category[] }) {
  const source = categories && categories.length > 0
    ? categories.map((c) => ({
        name: c.name,
        description: c.description,
        image: c.image,
        href: `/products?category=${c.slug}`,
        productCount: c.productCount,
      }))
    : FALLBACK_CATEGORIES;

  const display = sortByPriority(source);

  return (
    <section id="categories" className="rise-curve bg-white px-4 pt-10 pb-16 md:px-8 md:pt-16 md:pb-24">
      <div className="mx-auto max-w-[1320px]">
        <span className="section-label">CATEGORIES</span>
        <h2 className="mt-3 font-display text-xl sm:text-2xl md:text-[clamp(1.75rem,3.25vw,2.25rem)] font-bold leading-tight tracking-[-0.02em] text-ocean-deeper max-w-xl">
          Explore Our Collections
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:auto-rows-[140px] lg:auto-rows-[165px]">
          {display.map((cat, index) => {
            const isFeatured = index === 0;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className={cn(
                  "group relative overflow-hidden rounded-[24px] bg-ocean-deeper transition-all duration-[220ms] hover:shadow-[0_14px_32px_rgba(10,31,58,0.16)]",
                  isFeatured
                    ? "col-span-2 aspect-[16/10] sm:aspect-[16/9] md:aspect-auto md:col-span-2 md:row-span-2"
                    : "aspect-square md:aspect-auto"
                )}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 40vw, 50vw"
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-[220ms] group-hover:from-black/90" />

                <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 md:p-5">
                  <h3
                    className={cn(
                      "font-clash font-bold text-white leading-tight",
                      isFeatured ? "text-base sm:text-lg" : "text-sm sm:text-[15px]"
                    )}
                  >
                    {cat.name}
                  </h3>
                  {cat.productCount > 0 && (
                    <p className="mt-0.5 text-xs font-semibold text-white/65">
                      {cat.productCount}+ Products
                    </p>
                  )}
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white opacity-0 -translate-y-1 transition-all duration-[220ms] group-hover:opacity-100 group-hover:translate-y-0">
                    Shop Now <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/products"
            className="text-action"
          >
            All Categories <ArrowRight className="ta-arrow" />
          </Link>
        </div>
      </div>
    </section>
  );
}
