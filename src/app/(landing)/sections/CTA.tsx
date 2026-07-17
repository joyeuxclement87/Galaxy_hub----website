"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, MessageCircle, Mail, ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section aria-labelledby="cta-heading" className="px-6 py-10 md:px-12 md:py-20">
      <div className="mx-auto max-w-[1280px]">
        <div
          className="relative overflow-hidden rounded-[36px] bg-[#0B5497] p-10 md:p-20"
          style={{
            backgroundImage: "radial-gradient(closest-side, rgba(255,255,255,0.04), transparent 40%)",
          }}
        >
          <div className="grid gap-8 items-center lg:grid-cols-[0.6fr_0.4fr]">
            {/* Left: content */}
            <div className="text-white">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75">
                READY TO UPGRADE?
              </span>
              <h2 id="cta-heading" className="mt-4 font-clash text-3xl font-bold leading-tight sm:text-4xl">
                Your Next Device
                <br />
                Starts Here.
              </h2>
              <p className="mt-4 max-w-lg text-sm text-white/85">
                Browse genuine smartphones, laptops, accessories, creator gear, and everyday technology with delivery
                available across Rwanda.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/order" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0B5497] shadow-sm transition-colors duration-200 hover:opacity-95">
                  Order Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/products" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/95 transition-colors duration-200 hover:bg-white/6">
                  Browse Products
                </Link>
              </div>

              {/* Trust row */}
              <ul className="mt-6 flex flex-wrap gap-4 text-[13px] font-medium text-white/90">
                <li className="inline-flex items-center gap-2"><span className="text-[14px]">✓</span> Genuine Products</li>
                <li className="inline-flex items-center gap-2"><span className="text-[14px]">✓</span> Nationwide Delivery</li>
                <li className="inline-flex items-center gap-2"><span className="text-[14px]">✓</span> Warranty Support</li>
                <li className="inline-flex items-center gap-2"><span className="text-[14px]">✓</span> Friendly Customer Service</li>
              </ul>

              {/* Contact shortcuts */}
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="tel:+250785288910" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/95">
                  <Phone className="h-4 w-4" /> Call Us
                </a>
                <a href="https://wa.me/250785288910" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/95">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
                <a href="https://t.me/galaxyhub" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/95">
                  <ArrowRight className="h-4 w-4" /> Telegram
                </a>
                <a href="mailto:hello@galaxyhub.rw" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/95">
                  <Mail className="h-4 w-4" /> Email
                </a>
              </div>
            </div>

            {/* Right: product composition */}
            <div className="relative flex items-center justify-center">
              <motion.div whileHover={{ scale: 1.02 }} className="relative h-[260px] w-full max-w-[380px]">
                <Image
                  src="/cta-composition.svg"
                  alt="Device composition"
                  fill
                  sizes="(min-width: 1024px) 380px, 90vw"
                  className="object-contain"
                  priority={false}
                />

                {/* floating pills */}
                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#0B5497] shadow-sm">
                  ✓ Genuine Products
                </div>
                <div className="absolute right-3 bottom-6 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#0B5497] shadow-sm">
                  🚚 Delivery Across Rwanda
                </div>
              </motion.div>
            </div>
          </div>

          {/* subtle decorative grid */}
          <div className="pointer-events-none absolute inset-0 opacity-5 mix-blend-overlay bg-[repeating-radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.02),rgba(255,255,255,0.02)_1px,transparent 1px,transparent 40px)]" />
        </div>
      </div>
    </section>
  );
}

export default CTA;
