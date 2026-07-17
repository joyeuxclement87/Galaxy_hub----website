"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Phone } from "lucide-react";
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
    a: "You'll receive an on-screen confirmation with an order reference. Our showroom team will contact you via phone or WhatsApp within a few hours to confirm stock, pricing, and your preferred pickup or delivery time.",
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
    <section id="faq" className="bg-ivory px-4 py-20 sm:px-6 md:px-12 md:py-28 text-[#10233D]">
      <div className="mx-auto max-w-3xl">

        {/* Section header */}
        <div className="mb-10 space-y-3 text-center">
          <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-accent font-manrope">
            GOOD TO KNOW
          </span>
          <h2 className="font-clash text-3xl font-bold leading-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-sm leading-[1.8] text-[#10233D]/60 font-manrope">
            Clear answers about ordering, delivery, payments, and support before you place your next request.
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={item.q}
                className={cn(
                  "overflow-hidden rounded-[20px] border bg-white shadow-sm transition-colors duration-200",
                  isOpen ? "border-ocean/20" : "border-ocean/8"
                )}
              >
                <button
                  type="button"
                  id={`faq-btn-${index}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left min-h-[56px] sm:px-6"
                >
                  <span className="text-sm font-semibold text-[#10233D] sm:text-base">{item.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-ocean/50 transition-transform duration-300",
                      isOpen && "rotate-180 text-ocean"
                    )}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${index}`}
                      role="region"
                      aria-labelledby={`faq-btn-${index}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <p className="border-t border-ocean/6 px-5 pb-5 pt-4 text-sm leading-[1.8] text-[#10233D]/65 font-manrope sm:px-6">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Contact strip */}
        <div className="mt-8 flex flex-col gap-4 rounded-[20px] border border-ocean/10 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-[#10233D]/75 font-manrope">
            <Phone className="h-4 w-4 text-ocean shrink-0" />
            <span>Still have questions?</span>
            <a href="tel:+250785288910" className="font-semibold text-ocean hover:underline">
              +250 785 288 910
            </a>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/order"
              className="inline-flex items-center justify-center rounded-full bg-ocean px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-ocean-dark"
            >
              Order Now
            </Link>
            <a
              href="tel:+250785288910"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ocean/12 bg-white px-5 py-2.5 text-sm font-semibold text-[#10233D] transition-colors hover:bg-ocean/5"
            >
              <Phone className="h-4 w-4" />
              Call Us
            </a>
          </div>
        </div>

      </div>

      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
}
