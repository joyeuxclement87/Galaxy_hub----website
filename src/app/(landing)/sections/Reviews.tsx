"use client";

import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import type { Review } from "@/data/mock-data";

export function Reviews({ reviews = [] }: { reviews?: Review[] }) {
  const reviewsList = reviews.slice(0, 4);

  if (reviewsList.length === 0) return null;

  return (
    <section id="reviews" className="bg-white px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-[1320px]">
        {/* Header — heading left, rating right */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl space-y-3">
            <span className="section-label">CUSTOMER EXPERIENCE</span>
            <h2 className="font-clash text-3xl sm:text-4xl font-bold leading-tight text-ocean-deeper">
              Loved By Tech Users<br className="hidden sm:block" /> In Rwanda
            </h2>
          </div>

          <div className="flex items-center gap-3 border-l-2 border-ocean/15 pl-5">
            <span className="font-display text-4xl font-bold leading-none text-ocean-deeper">4.9</span>
            <div>
              <div className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-1 text-xs text-ocean-deeper/55">Trusted across Rwanda</p>
            </div>
          </div>
        </div>

        {/* Reviews — one strong editorial voice each */}
        <div className="mt-12 grid gap-x-12 gap-y-14 md:grid-cols-2">
          {reviewsList.map((review, index) => (
            <motion.figure
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-48px" }}
              transition={{ duration: 0.35, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col"
            >
              <span aria-hidden="true" className="font-display text-6xl leading-none text-ocean/10 select-none">
                &ldquo;
              </span>
              <blockquote className="mt-1 font-display text-xl sm:text-2xl font-semibold leading-[1.4] tracking-[-0.01em] text-ocean-deeper">
                {review.content}
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3 border-t border-ocean/10 pt-5">
                {review.avatar ? (
                  <img
                    src={review.avatar}
                    alt={review.author}
                    loading="lazy"
                    className="h-10 w-10 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ocean/10 font-clash text-sm font-bold text-ocean">
                    {review.author.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ocean-deeper">{review.author}</p>
                  <p className="text-xs text-ocean-deeper/55">{review.location ?? review.role}</p>
                </div>
                <div className="ml-auto flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
