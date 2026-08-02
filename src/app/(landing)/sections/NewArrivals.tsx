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
  const featured = products.slice(0, 8);
  if (featured.length === 0) return null;

  return (
    <section id="new-arrivals" className="bg-ivory px-4 py-20 sm:px-6 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1320px] space-y-8">
        <div className="max-w-2xl">
          <span className="section-label">NEW ARRIVALS</span>
          <h2 className="font-clash text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight text-ocean-deeper mt-3">
            Fresh Out Of The Box
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ocean-deeper/60 font-manrope max-w-xl">
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
            className="group inline-flex items-center gap-2 rounded-btn border border-ocean/15 bg-white px-7 h-11 text-sm font-bold text-ocean transition-all duration-300 hover:border-ocean/30 hover:text-ocean-dark"
          >
            View All Products <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
