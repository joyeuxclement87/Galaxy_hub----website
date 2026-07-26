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
    <section className="bg-white px-6 py-24 md:px-12 lg:py-32">
      <div className="mx-auto max-w-[1320px]">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-accent">CATEGORIES</p>
        <div className="mt-4 md:flex md:items-end md:justify-between">
          <h2 className="font-display text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-ocean-deeper max-w-xl">
            Explore Our Collections
          </h2>
          <Link href="/products" className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-ocean hover:text-accent transition-colors mt-2 md:mt-0">
            All Categories <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
          {display.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative block overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:shadow-md"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-ivory-dark/30">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-all duration-500 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-4">
                <h3 className="font-clash text-sm font-bold text-ocean-deeper sm:text-base">{cat.name}</h3>
                <p className="mt-0.5 text-[11px] text-ocean/45 leading-snug line-clamp-1">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
