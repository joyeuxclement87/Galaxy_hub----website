"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Galaxy Hub",
  "url": "https://galaxyhub.rw",
  "telephone": "+250785288910",
  "email": "hello@galaxyhub.rw",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "TCB Floor 1B, Door 13B",
    "addressLocality": "Kigali",
    "addressCountry": "RW",
  },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], "opens": "09:00", "closes": "20:00" },
  ],
  "sameAs": [
    "https://instagram.com/galaxyhub", "https://facebook.com/galaxyhub",
    "https://tiktok.com/@galaxyhub", "https://wa.me/250785288910", "https://t.me/galaxyhub",
  ],
};

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-btn border border-white/10 bg-white/5 text-white/70 transition-all duration-300 hover:bg-white/15 hover:text-white hover:border-white/20 hover:-translate-y-0.5"
    >
      {children}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="bg-ocean-deeper text-white overflow-hidden border-t border-ocean/10">
      <div className="mx-auto max-w-[1440px] px-6 pt-16 pb-10 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 transition-opacity duration-200 hover:opacity-80">
              <img
                src="/g-hub%20logo ii.png"
                alt="Galaxy Hub"
                className="h-10 w-auto object-contain select-none"
              />
            </Link>
            <p className="text-sm leading-relaxed text-white/60 font-sans max-w-sm">
              Galaxy Hub is Rwanda&apos;s premier tech retailer, supplying genuine smartphones, laptops, audio gear, creator accessories, and nationwide express delivery.
            </p>

            <div className="pt-1">
              <Link
                href="/order"
                className="inline-flex items-center gap-2 rounded-btn bg-white text-ocean-deeper px-6 h-11 py-0 text-[11px] font-bold uppercase tracking-[0.12em] shadow-btn transition-all duration-300 hover:bg-white/90 hover:shadow-btn-hover hover:-translate-y-0.5"
              >
                Order Now
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Shop links" className="lg:col-span-2 space-y-4">
            <span className="inline-flex items-center rounded-btn bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ocean-light/70">
              Shop
            </span>
            <ul className="space-y-2.5 text-sm text-white/60 font-sans">
              {[
                { label: "All Products",       href: "/#products"            },
                { label: "Smartphones",        href: "/#products"            },
                { label: "Laptops",            href: "/#products"            },
                { label: "Promotions",         href: "/#deals"               },
                { label: "Brands",             href: "/#brands"              },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors duration-200 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Support Links */}
          <nav aria-label="Support links" className="lg:col-span-2 space-y-4">
            <span className="inline-flex items-center rounded-btn bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ocean-light/70">
              Support
            </span>
            <ul className="space-y-2.5 text-sm text-white/60 font-sans">
              {[
                { label: "How to Order",   href: "/order"   },
                { label: "Kigali Pickup",  href: "/order"   },
                { label: "Delivery Info",  href: "/order"   },
                { label: "Warranty",       href: "/#faq"    },
                { label: "Contact Us",     href: "/order"   },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors duration-200 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Details */}
          <address className="not-italic lg:col-span-4 space-y-4">
            <span className="inline-flex items-center rounded-btn bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ocean-light/70">
              Contact & Visit
            </span>
            <div className="space-y-3 text-sm text-white/60 font-sans">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                <span>TCB Floor 1B, Door 13B · KN 2 Ave, Kigali, Rwanda</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <a href="tel:+250785288910" className="hover:text-white transition-colors">
                  +250 785 288 910
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <a href="mailto:hello@galaxyhub.rw" className="hover:text-white transition-colors">
                  hello@galaxyhub.rw
                </a>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <SocialIcon href="https://instagram.com/galaxyhub" label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <rect x="2.5" y="2.5" width="19" height="19" rx="5" /><path d="M16.5 7.5h.01" /><circle cx="12" cy="12" r="4.5" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://facebook.com/galaxyhub" label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M18 2h-3.6c-3.2 0-4.4 1.5-4.4 4.2V9H6v4h3v9h4v-9h3.2l.8-4H13V6.2c0-.8.2-1.2 1.2-1.2H18V2Z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://tiktok.com/@galaxyhub" label="TikTok">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M14 2v10a4 4 0 1 1-4-4" /><path d="M18 8.5a4.8 4.8 0 0 1-3.5-1.5" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://wa.me/250785288910" label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M22 12.06c0 5.52-4.48 10-10 10-1.8 0-3.47-.46-4.95-1.28L2 22l1.38-4.14A9.94 9.94 0 0 1 2 12.06c0-5.52 4.48-10 10-10s10 4.48 10 10Z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://t.me/galaxyhub" label="Telegram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M22 2 2 11.5 7.5 14l2.6 8L11 14l11-12Z" /><path d="M7.5 14 18.4 6.8" />
                </svg>
              </SocialIcon>
            </div>
          </address>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col gap-3 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Galaxy Hub · Kigali, Rwanda</span>
          <div className="flex items-center gap-4">
            <span>Genuine Tech Guaranteed</span>
            <span>·</span>
            <span>Pay on Collection</span>
          </div>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
    </footer>
  );
}

export default Footer;
