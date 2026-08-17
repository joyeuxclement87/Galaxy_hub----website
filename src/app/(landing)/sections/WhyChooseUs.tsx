import React from "react";
import { Reveal } from "@/components/ui/Reveal";
import { MOTION } from "@/lib/motion";

const REASONS = [
  {
    title: "Genuine Products",
    description: "Every device is sourced through authorized brand channels and backed by full manufacturer warranty.",
  },
  {
    title: "Nationwide Delivery",
    description: "Fast, tracked delivery to Kigali and every province, with your order inspected before it ships.",
  },
  {
    title: "Pay With Confidence",
    description: "No online payment required. Inspect your device in person before paying, in-store or on delivery.",
  },
  {
    title: "Real Human Support",
    description: "Reach our team directly by phone or WhatsApp for real answers, before and after your order.",
  },
] as const;

export function WhyChooseUs() {
  return (
    <section className="relative rise-soft bg-ivory-dark/60 px-4 pt-14 pb-16 sm:px-6 sm:pt-16 sm:pb-20">
      <div className="mx-auto max-w-[1320px]">
        <div className="max-w-2xl space-y-3">
          <Reveal y={8}>
            <span className="section-label">WHY CHOOSE GALAXY HUB</span>
          </Reveal>
          <Reveal y={14} delay={MOTION.stagger}>
            <h2 className="font-clash text-2xl sm:text-3xl font-bold leading-tight text-ocean-deeper">
              Built On Trust, Not Just Transactions.
            </h2>
          </Reveal>
          <Reveal y={12} delay={MOTION.stagger * 2}>
            <p className="text-sm leading-[1.8] text-ocean-deeper/60">
              We&apos;re a Kigali-based shop that customers keep coming back to — here&apos;s what sets Galaxy Hub apart.
            </p>
          </Reveal>
        </div>

        <Reveal y={18} delay={MOTION.stagger * 3}>
          <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-ocean/10">
            {REASONS.map((reason, index) => (
              <div key={reason.title} className="flex flex-col lg:px-8 lg:first:pl-0 lg:last:pr-0">
                <div className="flex items-center gap-4">
                  <span className="font-clash text-3xl font-bold leading-none text-ocean sm:text-4xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-ocean/15" />
                </div>
                <h3 className="mt-4 font-clash text-base font-bold text-ocean-deeper">{reason.title}</h3>
                <p className="mt-1.5 text-sm leading-[1.7] text-ocean-deeper/60">{reason.description}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
