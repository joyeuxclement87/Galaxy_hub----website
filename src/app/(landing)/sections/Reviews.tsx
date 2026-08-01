"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { REVIEWS } from "@/data/mock-data";
import type { Review } from "@/data/mock-data";

const STATS = [
  { value: "4.9/5", label: "Average Rating" },
  { value: "500+",  label: "Happy Customers" },
  { value: "10+",   label: "Brands Stocked" },
];

export function Reviews({ reviews = [] }: { reviews?: Review[] }) {
  const visibleReviews = reviews.length > 0 ? reviews : REVIEWS;
  return (
    <section id="reviews" className="bg-white px-4 py-20 sm:px-6 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1320px]">
        <div className="max-w-2xl space-y-3">
          <span className="section-label">CUSTOMER EXPERIENCE</span>
          <h2 className="font-clash text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight text-ocean-deeper">
            Loved By Tech Users In Rwanda
          </h2>
          <p className="text-sm leading-[1.8] text-ocean-deeper/60 font-manrope">
            Real experiences from customers who purchased smartphones, accessories, and technology products from Galaxy Hub.
          </p>
        </div>

        <div className="mt-12 grid gap-x-12 gap-y-12 md:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col">
            <div className="flex items-end gap-4">
              <span className="font-clash text-6xl font-bold leading-none text-ocean-deeper sm:text-7xl">4.9</span>
              <div className="pb-2">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-1.5 text-xs text-ocean-deeper/55 font-manrope">
                  Based on customer reviews across Rwanda
                </p>
              </div>
            </div>

            <div className="mt-10 flex-1">
              {STATS.map((stat, index) => (
                <div key={stat.label} className="flex items-baseline justify-between gap-4 border-t border-ocean/10 py-4 first:border-t">
                  <span className="text-sm text-ocean-deeper/55 font-manrope">{stat.label}</span>
                  <span className="font-clash text-2xl font-bold text-ocean-deeper">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            {visibleReviews.slice(0, 4).map((review) => (
              <article key={review.id} className="flex flex-col border-t border-ocean/10 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {review.avatar ? (
                      <img
                        src={review.avatar}
                        alt={review.author}
                        loading="lazy"
                        className="h-9 w-9 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ocean/10 font-clash text-sm font-bold text-ocean">
                        {review.author.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <div>
                      <h3 className="text-sm font-bold text-ocean-deeper">{review.author}</h3>
                      <p className="text-xs text-ocean-deeper/55 font-manrope">{review.location ?? review.role}</p>
                    </div>
                  </div>
                  {review.verified && (
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ocean">
                      <span className="h-1.5 w-1.5 rounded-full bg-ocean" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>

                <p className="mt-3 flex-1 text-sm leading-[1.75] text-ocean-deeper/60 font-manrope">
                  &ldquo;{review.content}&rdquo;
                </p>

                {review.purchasedProduct && (
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-ocean/60 font-manrope">
                    Purchased: {review.purchasedProduct}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-ocean/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ocean-deeper/60 font-manrope">
            Trusted by customers ordering phones, accessories, and gadgets across Rwanda.
          </p>
          <Link
            href="/order"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ocean hover:text-ocean-dark transition-colors"
          >
            Order Now <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
