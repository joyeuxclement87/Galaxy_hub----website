"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Star } from "lucide-react";
import { REVIEWS } from "@/data/mock-data";

const STATS = [
  { value: "4.9/5", label: "Average Rating" },
  { value: "500+",  label: "Happy Customers" },
  { value: "10+",   label: "Brands Stocked" },
];

export function Reviews() {
  return (
    <section id="reviews" className="bg-white px-4 py-20 sm:px-6 md:px-12 md:py-28 text-[#10233D]">
      <div className="mx-auto max-w-[1320px]">

        {/* Section header */}
        <div className="mb-10 max-w-2xl space-y-3">
          <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-accent font-manrope">
            CUSTOMER EXPERIENCE
          </span>
          <h2 className="font-clash text-3xl font-bold leading-tight sm:text-4xl">
            Loved By Tech Users In Rwanda
          </h2>
          <p className="text-sm leading-[1.8] text-[#10233D]/60 font-manrope">
            Real experiences from customers who purchased smartphones, accessories, and technology products from Galaxy Hub.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">

          {/* Stats panel */}
          <div className="flex flex-col gap-4 rounded-[24px] border border-ocean/8 bg-ivory p-6">
            {/* Rating hero */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ocean/50 font-manrope">Customer Trust</p>
              <div className="mt-3 flex items-end gap-3">
                <span className="font-clash text-5xl font-bold text-[#10233D]">4.9</span>
                <div className="mb-1.5 flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="mt-1.5 text-sm text-[#10233D]/55 font-manrope">
                Based on customer reviews across Rwanda
              </p>
            </div>

            {/* Stats — single row on mobile */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-1">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[16px] border border-ocean/8 bg-white p-4 text-center md:text-left"
                >
                  <p className="font-clash text-2xl font-bold text-[#10233D]">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-[#10233D]/55 font-manrope">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Review cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {REVIEWS.slice(0, 4).map((review) => (
              <article
                key={review.id}
                className="flex flex-col rounded-[22px] border border-ocean/8 bg-white p-5 shadow-sm"
              >
                {/* Reviewer */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.avatar}
                      alt={review.author}
                      loading="lazy"
                      className="h-10 w-10 rounded-full object-cover shrink-0"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-[#10233D]">{review.author}</h3>
                      <p className="text-xs text-[#10233D]/50 font-manrope">{review.location ?? review.role}</p>
                    </div>
                  </div>
                  {review.verified && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ocean/8 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-ocean">
                      <BadgeCheck className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Stars */}
                <div className="mt-3 flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="mt-3 flex-1 text-sm leading-[1.75] text-[#10233D]/65 font-manrope">
                  &ldquo;{review.content}&rdquo;
                </p>

                {/* Purchased product */}
                {review.purchasedProduct && (
                  <span className="mt-3 inline-block rounded-full border border-ocean/10 bg-ocean-light/20 px-3 py-1 text-[10px] font-bold text-ocean">
                    {review.purchasedProduct}
                  </span>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-6 flex flex-col gap-3 rounded-[20px] border border-ocean/8 bg-ivory px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#10233D]/65 font-manrope">
            Trusted by customers ordering phones, accessories, and gadgets across Rwanda.
          </p>
          <Link
            href="/order"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-ocean hover:text-ocean-dark transition-colors"
          >
            Order Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
