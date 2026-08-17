"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BLUR_PLACEHOLDER } from "@/lib/image";
import { btnBase, btnVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { MOTION } from "@/lib/motion";

const STEPS = [
  {
    title: "Tell us about your device",
    description: "Brand, model, condition and accessories — takes about a minute.",
  },
  {
    title: "Our team reviews it",
    description: "We assess your submission and confirm your device's value.",
  },
  {
    title: "Put it toward your next device",
    description: "Use your trade-in value on anything at Galaxy Hub.",
  },
];

export function TradeIn() {
  return (
    <section
      aria-labelledby="trade-in-heading"
      className="px-4 py-16 sm:px-6 md:px-8 md:py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 overflow-hidden rounded-[24px] border border-ocean/[0.08] bg-white shadow-card-premium lg:grid-cols-2">
          {/* Copy side */}
          <div className="flex flex-col justify-center px-6 py-12 sm:px-10 md:px-14 lg:py-16">
            <Reveal y={8}>
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-accent">
                Trade In
              </span>
            </Reveal>

            <Reveal y={18} delay={MOTION.stagger}>
              <h2
                id="trade-in-heading"
                className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-ocean-deeper sm:text-4xl"
              >
                Your old device has value.
                <br className="hidden sm:block" /> Trade it in.
              </h2>
            </Reveal>

            <Reveal y={12} delay={MOTION.stagger * 2}>
              <p className="mt-4 max-w-md text-sm leading-[1.7] text-ocean-deeper/60 sm:text-base">
                Send us your current phone, laptop or tablet and our team will review it
                and give you a trade-in value toward your next purchase at Galaxy Hub.
              </p>
            </Reveal>

            <Reveal y={10} delay={MOTION.stagger * 3}>
              <ol className="mt-8 space-y-5">
                {STEPS.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="font-clash text-base font-bold leading-none text-ocean/35">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-ocean-deeper">{step.title}</p>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-ocean-deeper/55">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal y={10} delay={MOTION.stagger * 4}>
              <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/trade-in"
                  className={cn(
                    btnBase,
                    btnVariants.primary,
                    "gap-2 px-7 justify-center"
                  )}
                >
                  Trade In Your Device
                  <ArrowRight className="h-[18px] w-[18px]" />
                </Link>
                <Link
                  href="/products"
                  className={cn(
                    btnBase,
                    btnVariants.ghost,
                    "gap-2 px-7 justify-center"
                  )}
                >
                  Browse Products
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Image side */}
          <Reveal y={16} delay={MOTION.stagger * 2} className="relative min-h-[280px] lg:min-h-full">
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1200"
                alt="A hand holding a smartphone"
                fill
                sizes="(max-width: 1024px) 100vw, 640px"
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDER}
                className="object-cover select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-deeper/25 to-transparent lg:bg-gradient-to-r" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default TradeIn;