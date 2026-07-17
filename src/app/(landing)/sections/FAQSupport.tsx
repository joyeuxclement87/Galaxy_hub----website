"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Phone, Sparkles } from "lucide-react";
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
    a: "Delivery within Kigali City is typically same-day or next-day. Other provinces usually take 2-4 business days depending on the district.",
  },
  {
    q: "What happens after I submit my order request?",
    a: "You'll receive an on-screen confirmation with an order reference. Our showroom team will contact you via phone or WhatsApp within a few hours to confirm stock, pricing, and your preferred pickup or delivery time.",
  },
  {
    q: "Can I change my order after submitting it?",
    a: "Yes, since no payment is taken upfront. Just reply to our confirmation call or message and our team will update your order details.",
  },
];

export function FAQSupport() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[#f7f9fc] px-6 py-20 text-[#10233D] md:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 space-y-4 text-center">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-[#0b5497]">
            GOOD TO KNOW
          </span>
          <h2 className="font-clash text-3xl font-semibold leading-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-sm leading-7 text-[#10233D]/70 sm:text-base">
            Clear answers about ordering, delivery, payments, and support before you place your next request.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-[20px] border border-[#0b5497]/10 bg-white/80 shadow-[0_6px_20px_rgba(11,84,151,0.05)] backdrop-blur-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-sm font-semibold text-[#10233D] sm:text-base">{item.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-[#0b5497]/60 transition-transform duration-300",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-[#10233D]/70">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 rounded-[24px] border border-[#0b5497]/10 bg-[#f8fbff] p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 shrink-0 text-[#0b5497]" />
            <p className="text-sm text-[#10233D]/75">Still have questions? Our concierge team is ready to help.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/order"
              className="inline-flex items-center justify-center rounded-full bg-[#0b5497] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0b5497]/90"
            >
              Order Now
            </Link>
            <a
              href="tel:+250788123456"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0b5497]/10 bg-white px-4 py-3 text-sm font-semibold text-[#10233D]"
            >
              <Phone className="h-4 w-4" />
              +250 788 123 456
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
