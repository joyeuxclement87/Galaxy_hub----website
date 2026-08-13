"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { btnBase, btnVariants } from "@/components/ui/button";

const TRUST_ITEMS = [
  "Genuine Products",
  "Nationwide Delivery",
  "Warranty Support",
  "Friendly Customer Service",
];

export function CTA() {
  return (
    <section aria-labelledby="cta-heading" className="px-4 py-16 sm:px-6 md:px-8 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1280px]">
        <div className="relative isolate overflow-hidden rounded-[28px] cta-editorial-bg px-8 py-16 sm:px-14 md:px-20 md:py-24 lg:py-28">

          {/* Animated radial glow layer — extremely subtle */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[28px] animate-glow-pulse"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 18% 55%, rgba(15,112,201,0.14) 0%, transparent 60%)",
            }}
          />

          {/* Secondary accent glow — top right */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[28px]"
            style={{
              background:
                "radial-gradient(ellipse 35% 30% at 88% 12%, rgba(11,84,151,0.30) 0%, transparent 60%)",
            }}
          />

          {/* Top border accent line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[28px]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(105,177,232,0.35) 30%, rgba(15,112,201,0.25) 60%, transparent 100%)",
            }}
          />

          <div className="relative z-10 grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">

            <div className="max-w-3xl">
            {/* Eyebrow */}
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.26em] text-ocean-light">
              Ready to Upgrade?
            </span>

            {/* Large editorial headline */}
            <h2
              id="cta-heading"
              className="mt-6 font-display font-bold leading-[1.03] tracking-[-0.03em] text-white"
              style={{ fontSize: "clamp(2.75rem, 6.5vw, 5rem)" }}
            >
              Your Next Device<br className="hidden sm:block" /> Starts Here.
            </h2>

            {/* Supporting copy */}
            <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.7] text-white/65">
              Browse genuine smartphones, laptops, accessories, creator gear, and everyday technology with delivery available across Rwanda.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/order"
                className={cn(
                  btnBase,
                  btnVariants.primaryWhite,
                  "gap-2 px-7 w-full sm:w-auto justify-center"
                )}
              >
                Order Now
                <ArrowRight className="h-[18px] w-[18px] transition-transform duration-[200ms] group-hover:translate-x-[3px]" />
              </Link>
              <Link
                href="/products"
                className={cn(
                  btnBase,
                  btnVariants.ghostWhite,
                  "gap-2 px-7 w-full sm:w-auto justify-center"
                )}
              >
                Browse Products
              </Link>
            </div>

            {/* Trust items */}
            <ul className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2">
              {TRUST_ITEMS.map((item, index) => (
                <li key={item} className="flex items-center gap-x-5">
                  {index > 0 && (
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-ocean-light/40" />
                  )}
                  <span className="text-[13px] font-medium text-white/50">{item}</span>
                </li>
              ))}
            </ul>
            </div>

            {/* Creative visual — floating device with info chips */}
            <div aria-hidden="true" className="relative hidden lg:block">
              {/* Oversized watermark wordmark */}
              <span className="pointer-events-none absolute -bottom-12 -right-4 select-none font-display text-[clamp(5rem,8vw,9rem)] font-bold leading-none tracking-[-0.04em] text-white/[0.05]">
                GALAXY
              </span>

              {/* Soft glow behind device */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-80 w-80 rounded-full bg-accent/25 blur-[90px]" />
              </div>

              {/* Device frame */}
              <div className="relative mx-auto w-fit rotate-[2.5deg]">
                <div className="animate-float-y rounded-[28px] border border-white/15 bg-gradient-to-b from-white/[0.14] to-white/[0.02] p-3 shadow-[0_40px_90px_rgba(3,17,36,0.5)] backdrop-blur-sm">
                  <img
                    src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=900"
                    alt=""
                    className="h-[340px] w-[275px] rounded-[20px] object-cover"
                  />
                </div>

                {/* Floating chip — delivery */}
                <div className="animate-float-y absolute -left-20 top-10 rounded-2xl border border-white/15 bg-ocean-deeper/80 px-4 py-3 text-left shadow-lg backdrop-blur-sm [animation-delay:-2.5s]">
                  <span className="block font-display text-sm font-bold text-white">Free Delivery</span>
                  <span className="mt-0.5 block text-[11px] font-medium text-white/50">
                    Everywhere in Rwanda
                  </span>
                </div>

                {/* Floating chip — warranty */}
                <div className="animate-float-y absolute -right-16 bottom-12 rounded-2xl border border-white/15 bg-ocean-deeper/80 px-4 py-3 text-left shadow-lg backdrop-blur-sm [animation-delay:-4.5s]">
                  <span className="block font-display text-sm font-bold text-white">100% Genuine</span>
                  <span className="mt-0.5 block text-[11px] font-medium text-white/50">
                    With manufacturer warranty
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
