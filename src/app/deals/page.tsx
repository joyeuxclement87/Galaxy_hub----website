"use client";

import Link from "next/link";
import React from "react";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { DEAL_OFFERS } from "@/data/mock-data";

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Navbar onSearchFocus={() => {}} />

      <main className="flex-1 pt-32 px-6 md:px-12 pb-24 max-w-[1320px] mx-auto w-full space-y-12">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ocean/60 transition-colors duration-200 hover:text-ocean"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Showroom
          </Link>
        </div>

        {/* Section Header */}
        <div className="space-y-4 max-w-2xl">
          <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-accent font-manrope">
            EXCLUSIVE OFFERS
          </span>
          <h1 className="font-clash text-4xl font-bold leading-tight text-[#10233D] sm:text-5xl">
            Today's Best Tech Deals
          </h1>
          <p className="text-base leading-relaxed text-[#10233D]/65 font-manrope">
            Explore premium promotions, bundles, and student offers on genuine gadgets and creator gear across Rwanda.
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DEAL_OFFERS.map((deal) => (
            <Link
              key={deal.slug}
              href={`/deals/${deal.slug}`}
              className="group relative flex flex-col justify-between rounded-[28px] border border-ocean/8 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-ocean/30 hover:shadow-md"
            >
              <div className="space-y-4">
                {/* Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-ivory/60">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span
                    className={`absolute left-4 top-4 rounded-full px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                      deal.badgeType === "red"
                        ? "bg-red-500 text-white"
                        : "bg-ocean text-white"
                    }`}
                  >
                    {deal.badge}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <h3 className="font-clash text-xl font-bold text-[#10233D] tracking-tight">
                    {deal.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#10233D]/60 font-manrope">
                    {deal.description}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-ocean font-manrope">
                <span>{deal.ctaText}</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
