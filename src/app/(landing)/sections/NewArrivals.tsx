import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/data/mock-data";
import { ProductCard } from "@/components/products/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { MOTION, gridStaggerDelay } from "@/lib/motion";

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
    <section id="new-arrivals" className="rise-soft bg-ocean-light/40 px-4 pt-14 pb-20 sm:px-6 sm:pt-16 sm:pb-24">
      <div className="mx-auto max-w-[1320px]">
        <div className="max-w-2xl space-y-3">
          <Reveal y={8}>
            <span className="section-label">NEW ARRIVALS</span>
          </Reveal>
          <Reveal y={14} delay={MOTION.stagger}>
            <h2 className="font-clash text-2xl sm:text-3xl font-bold leading-tight text-ocean-deeper">
              Fresh Out Of The Box
            </h2>
          </Reveal>
          <Reveal y={12} delay={MOTION.stagger * 2}>
            <p className="text-sm leading-relaxed text-ocean-deeper/60 max-w-xl">
              The latest stock to land at our Kigali shop — inspect it in person before you pay.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} onReserve={onReserve} delay={gridStaggerDelay(index)} />
          ))}
        </div>

        <Reveal y={10} delay={MOTION.stagger * 3}>
          <div className="mt-10 flex justify-center">
            <Link
              href="/products?new=true"
              className="text-action"
            >
              View All New Arrivals
              <ArrowRight className="ta-arrow" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
