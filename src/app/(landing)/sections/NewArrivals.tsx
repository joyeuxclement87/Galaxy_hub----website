import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/data/mock-data";
import { ProductCard } from "@/components/products/ProductCard";

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
  const featured = products.slice(0, 6);
  if (featured.length === 0) return null;

  return (
    <section id="new-arrivals" className="bg-ocean-light/40 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[1320px]">
        <div className="max-w-2xl space-y-3">
          <span className="section-label">NEW ARRIVALS</span>
          <h2 className="font-clash text-2xl sm:text-3xl font-bold leading-tight text-ocean-deeper">
            Fresh Out Of The Box
          </h2>
          <p className="text-sm leading-relaxed text-ocean-deeper/60 max-w-xl">
            The latest stock to land at our Kigali shop — inspect it in person before you pay.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} onReserve={onReserve} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/products?new=true"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-ocean transition-colors duration-200 hover:text-ocean-dark"
          >
            View All New Arrivals
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
