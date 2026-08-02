"use client";

import Link from "next/link";
import React from "react";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import Footer from "@/components/ui/Footer";
import { DEAL_OFFERS } from "@/data/mock-data";

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 px-4 md:px-8 pb-16 max-w-[1320px] mx-auto w-full space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ocean/60 transition-colors duration-200 hover:text-ocean"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Shop
          </Link>
        </div>

        {/* Section Header */}
        <div className="space-y-3 max-w-2xl">
          <span className="block text-caption font-bold uppercase tracking-[0.24em] text-accent">
            EXCLUSIVE OFFERS
          </span>
          <h1 className="font-clash text-3xl font-bold leading-tight text-[#10233D] sm:text-4xl">
            Today&apos;s Best Tech Deals
          </h1>
          <p className="text-sm leading-relaxed text-[#10233D]/65">
            Explore premium promotions, bundles, and student offers on genuine gadgets and creator gear across Rwanda.
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {DEAL_OFFERS.map((deal) => (
            <Link
              key={deal.slug}
              href={`/deals/${deal.slug}`}
              className="group relative flex flex-col justify-between rounded-card border border-ocean/8 bg-white p-5 shadow-sm transition-all duration-250 hover:border-ocean/30 hover:shadow-premium"
            >
              <div className="space-y-3">
                {/* Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-card bg-ivory/60">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span
                    className={`absolute left-3 top-3 rounded-full px-3 py-1 text-caption font-bold uppercase tracking-wider shadow-sm ${
                      deal.badgeType === "red"
                        ? "bg-red-500 text-white"
                        : "bg-ocean text-white"
                    }`}
                  >
                    {deal.badge}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5">
                  <h3 className="font-clash text-lg font-bold text-[#10233D] tracking-tight">
                    {deal.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#10233D]/60">
                    {deal.description}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 flex items-center gap-1.5 text-sm font-bold text-ocean">
                <span>{deal.ctaText}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
