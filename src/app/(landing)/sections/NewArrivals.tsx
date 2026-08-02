import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/data/mock-data";
import { ProductCard } from "@/components/products/ProductCard";
import { cn } from "@/lib/utils";
import { btnBase, btnVariants } from "@/components/ui/button";

interface NewArrivalsProps {
  products: Product[];
  onReserve?: (product: Product) => void;
}

/**
 * Fresh stock, straight from the shop floor. Uses products flagged
 * `is_new` in the catalog; falls back to the newest products when nothing
 * is flagged yet.
 */
export function NewArrivals({ products, onReserve }: NewArrivalsProps) {
  const featured = products.slice(0, 8);
  if (featured.length === 0) return null;

  return (
    <section id="new-arrivals" className="bg-ivory px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-[1320px] space-y-6">
        <div className="max-w-2xl">
          <span className="section-label">NEW ARRIVALS</span>
          <h2 className="font-clash text-2xl sm:text-3xl font-bold leading-tight text-ocean-deeper mt-3">
            Fresh Out Of The Box
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ocean-deeper/60 max-w-xl">
            The latest stock to land at our Kigali shop — inspect it in person before you pay.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} onReserve={onReserve} />
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/products"
            className={cn(btnBase, btnVariants.secondary, "gap-2 px-6")}
          >
            View All Products <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
