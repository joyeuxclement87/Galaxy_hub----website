"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    q: "Do I need to pay online to place an order?",
    a: "No. Galaxy Hub does not process online payments. You submit an order request, our team confirms availability and pricing by phone, and you pay in person — either in-store or on delivery.",
  },
  {
    q: "Can I inspect the device before paying?",
    a: "Yes. Whether you choose store pickup or nationwide delivery, you're welcome to inspect the device, verify the IMEI/serial number, and test it before completing payment.",
  },
  {
    q: "How long does delivery take outside Kigali?",
    a: "Delivery within Kigali City is typically same-day or next-day. Other provinces usually take 2–4 business days depending on the district.",
  },
  {
    q: "What happens after I submit my order request?",
    a: "You'll receive an on-screen confirmation with an order reference. Our shop team will contact you via phone or WhatsApp within a few hours to confirm stock, pricing, and your preferred pickup or delivery time.",
  },
  {
    q: "Can I change my order after submitting it?",
    a: "Yes, since no payment is taken upfront. Just reply to our confirmation call or message and our team will update your order details.",
  },
  {
    q: "Do products come with a warranty?",
    a: "Yes. All products sold by Galaxy Hub come with manufacturer warranties. We help facilitate any warranty claims on your behalf and provide after-sales support.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export function FAQSupport() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-ivory px-4 py-20 sm:px-6 md:px-12 md:py-28 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 soft-radial-glow opacity-60 pointer-events-none" />

      <div className="relative mx-auto max-w-3xl">
        <div className="mb-12 max-w-2xl space-y-3">
          <span className="section-label">GOOD TO KNOW</span>
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight text-ocean-deeper tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm leading-[1.8] text-ocean-deeper/70">
            Clear answers about ordering, delivery, payments, and support before you place your next request.
          </p>
        </div>

        <div className="space-y-2">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={item.q}
                className={cn(
                  "transition-all duration-300 rounded-2xl border px-3 sm:px-5",
                  isOpen
                    ? "bg-white shadow-sm border-ocean/15"
                    : "bg-white/40 border-ocean/8 hover:bg-white/70 hover:border-ocean/12"
                )}
              >
                <button
                  type="button"
                  id={`faq-btn-${index}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left min-h-[64px] sm:py-6 cursor-pointer group"
                >
                  <span className="flex items-center gap-4 min-w-0">
                    <span
                      className={cn(
                        "font-display text-sm font-bold leading-none shrink-0 transition-colors duration-300",
                        isOpen ? "text-ocean" : "text-ocean/35 group-hover:text-ocean/60"
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-display text-sm font-bold sm:text-base leading-snug transition-colors duration-200",
                        isOpen ? "text-ocean" : "text-ocean-deeper group-hover:text-ocean"
                      )}
                    >
                      {item.q}
                    </span>
                  </span>
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                      isOpen ? "bg-ocean text-white shadow-xs" : "bg-ocean/5 text-ocean/50 group-hover:bg-ocean/10 group-hover:text-ocean"
                    )}
                  >
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="font-clash text-lg leading-none select-none"
                    >
                      +
                    </motion.span>
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${index}`}
                      role="region"
                      aria-labelledby={`faq-btn-${index}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-5 sm:pb-6 pl-8 sm:pl-9 border-t border-ocean/[0.06] pt-4">
                        <p className="text-sm leading-[1.85] text-ocean-deeper/80 font-medium">
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-5 rounded-2xl border border-ocean/10 bg-white/80 backdrop-blur-sm p-6 sm:flex-row sm:items-center sm:justify-between shadow-sm">
          <div className="flex items-center gap-3 text-sm text-ocean-deeper/80">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-btn bg-ocean/10 text-ocean">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-ocean-deeper/45 uppercase tracking-wider">Still have questions?</p>
              <a href="tel:+250785288910" className="text-sm font-bold text-ocean hover:text-ocean-dark transition-colors">
                +250 785 288 910
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/order"
              className="inline-flex items-center justify-center rounded-btn bg-ocean-deeper px-7 h-11 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-btn transition-all duration-300 hover:bg-ocean-dark hover:shadow-btn-hover hover:-translate-y-0.5"
            >
              Order Now
            </Link>
            <a
              href="tel:+250785288910"
              className="inline-flex items-center justify-center gap-2 rounded-btn border border-ocean/15 bg-white px-7 h-11 text-xs font-bold uppercase tracking-[0.12em] text-ocean-deeper transition-all duration-300 hover:border-ocean/30 hover:bg-ivory hover:shadow-sm hover:-translate-y-0.5"
            >
              <Phone className="h-4 w-4 text-ocean" />
              Call Us
            </a>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
}
