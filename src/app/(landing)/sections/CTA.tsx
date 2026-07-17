"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MessageCircle, Mail, ArrowRight } from "lucide-react";

const TRUST_ITEMS = [
  "Genuine Products",
  "Nationwide Delivery",
  "Warranty Support",
  "Friendly Customer Service",
];

const CONTACT_LINKS = [
  { label: "Call Us",   href: "tel:+250785288910",             icon: <Phone className="h-4 w-4" /> },
  { label: "WhatsApp",  href: "https://wa.me/250785288910",    icon: <MessageCircle className="h-4 w-4" /> },
  { label: "Email",     href: "mailto:hello@galaxyhub.rw",     icon: <Mail className="h-4 w-4" /> },
];

export function CTA() {
  return (
    <section aria-labelledby="cta-heading" className="px-4 py-10 sm:px-6 md:px-12 md:py-16">
      <div className="mx-auto max-w-[1280px]">
        <div className="relative overflow-hidden rounded-[32px] bg-ocean px-8 py-12 md:px-16 md:py-20">

          {/* Subtle dot grid overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_0.45fr] lg:items-center">

            {/* Left: content */}
            <div className="text-white">
              <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-white/60 font-manrope">
                READY TO UPGRADE?
              </span>
              <h2
                id="cta-heading"
                className="mt-4 font-clash text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl"
              >
                Your Next Device<br />Starts Here.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-[1.8] text-white/75 font-manrope">
                Browse genuine smartphones, laptops, accessories, creator gear, and everyday technology with delivery available across Rwanda.
              </p>

              {/* Primary CTAs */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/order"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-ocean shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
                >
                  Order Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:border-white/30"
                >
                  Browse Products
                </Link>
              </div>

              {/* Trust row */}
              <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
                {TRUST_ITEMS.map((item) => (
                  <li key={item} className="inline-flex items-center gap-1.5 text-sm font-medium text-white/85">
                    <span className="text-emerald-300 text-base leading-none">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Contact shortcuts */}
              <div className="mt-6 flex flex-wrap gap-2">
                {CONTACT_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-white/20 border border-white/10"
                  >
                    {link.icon}
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Right: product composition image */}
            <div className="flex items-center justify-center">
              <div className="relative h-[220px] w-full max-w-[360px] md:h-[280px]">
                <Image
                  src="/cta-composition.svg"
                  alt="Galaxy Hub tech devices — smartphones, earbuds, and accessories available in Rwanda"
                  fill
                  sizes="(min-width: 1024px) 360px, 90vw"
                  className="object-contain"
                  priority={false}
                />
                {/* Floating trust pills */}
                <div className="absolute left-2 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-ocean shadow-sm">
                  ✓ Genuine Products
                </div>
                <div className="absolute right-2 bottom-8 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-ocean shadow-sm">
                  🚚 Nationwide Delivery
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
