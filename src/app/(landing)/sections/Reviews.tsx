"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Star } from "lucide-react";
import { REVIEWS } from "@/data/mock-data";

const stats = [
  { value: "4.9/5", label: "Rated" },
  { value: "500+", label: "Customers" },
  { value: "10+", label: "Brands" },
];

export function Reviews() {
  return (
    <section id="reviews" className="bg-[#f7f9fc] px-6 py-20 text-[#10233D] md:px-12">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-8">
        <div className="max-w-2xl space-y-3">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-[#0b5497]">
            CUSTOMER EXPERIENCE
          </span>
          <h2 className="font-clash text-3xl font-semibold leading-tight sm:text-4xl">
            Loved By Tech Users In Rwanda
          </h2>
          <p className="text-sm leading-7 text-[#10233D]/70 sm:text-base">
            Real experiences from customers who purchased smartphones, accessories, and technology products from Galaxy Hub.
          </p>
        </div>

        <div className="grid gap-6 rounded-[32px] border border-[#0b5497]/10 bg-white p-6 shadow-[0_12px_36px_rgba(11,84,151,0.05)] md:grid-cols-[0.95fr_1.05fr] md:p-8">
          <div className="flex flex-col justify-between rounded-[24px] bg-[#f8fbff] p-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0b5497]/70">Customer trust</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="font-clash text-4xl font-semibold text-[#10233D]">4.9</span>
                <div className="flex items-center gap-1 text-[#f4b942]">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-sm leading-7 text-[#10233D]/65">Based on customer reviews from Rwanda.</p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3 md:grid-cols-1">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-[16px] border border-[#0b5497]/10 bg-white p-4">
                  <p className="font-clash text-2xl font-semibold text-[#10233D]">{stat.value}</p>
                  <p className="mt-1 text-sm text-[#10233D]/65">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {REVIEWS.slice(0, 4).map((review) => (
              <article key={review.id} className="rounded-[22px] border border-[#0b5497]/10 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={review.avatar} alt={review.author} loading="lazy" className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <h3 className="font-semibold text-[#10233D]">{review.author}</h3>
                      <p className="text-sm text-[#10233D]/60">{review.location || review.role}</p>
                    </div>
                  </div>
                  {review.verified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#0b5497]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0b5497]">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 flex items-center gap-1 text-[#f4b942]">
                  {Array.from({ length: review.rating }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                <p className="mt-4 text-sm leading-7 text-[#10233D]/70">“{review.content}”</p>

                <p className="mt-4 text-sm font-medium text-[#0b5497]">{review.purchasedProduct}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-[24px] border border-[#0b5497]/10 bg-white px-5 py-4 shadow-[0_8px_24px_rgba(11,84,151,0.04)] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#10233D]/70">Trusted by customers ordering phones, accessories, and gadgets across Rwanda.</p>
          <Link href="/order" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0b5497]">
            Order Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
