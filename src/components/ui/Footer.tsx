"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Galaxy Hub",
  "url": "https://galaxyhub.rw",
  "telephone": "+250785288910",
  "email": "hello@galaxyhub.rw",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "KN 70 St",
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
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all duration-200 hover:bg-white/10 hover:text-white hover:border-white/20"
    >
      {children}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#0a1f3a] text-white border-t border-white/[0.06]">
      <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center transition-opacity duration-200 hover:opacity-80">
              <img
                src="/g-hub logo ii.png"
                alt="Galaxy Hub"
                className="h-8 w-auto object-contain select-none"
              />
            </Link>
            <p className="text-sm leading-relaxed text-white/70 max-w-sm">
              Rwanda&apos;s premier tech retailer. Genuine smartphones, laptops, audio gear, creator accessories, with express delivery.
            </p>
            {/* Social icons */}
            <div className="flex gap-2 pt-1">
              <SocialIcon href="https://instagram.com/galaxyhub" label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <rect x="2.5" y="2.5" width="19" height="19" rx="5" /><path d="M16.5 7.5h.01" /><circle cx="12" cy="12" r="4.5" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://facebook.com/galaxyhub" label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M18 2h-3.6c-3.2 0-4.4 1.5-4.4 4.2V9H6v4h3v9h4v-9h3.2l.8-4H13V6.2c0-.8.2-1.2 1.2-1.2H18V2Z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://tiktok.com/@galaxyhub" label="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M12.525.02c1.31-.05 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.09-1.03-2.49-1.43-3.83-4.23-3.43-7.01.47-3.23 3.2-5.75 6.46-5.86.35-.01.69.03 1.03.08.04 1.47.09 2.93.08 4.4-.58-.18-1.22-.2-1.8 0-1.54.5-2.46 2.14-2.08 3.7.37 1.53 1.9 2.58 3.46 2.4 1.16-.13 2.17-.95 2.58-2.04.12-.32.17-.67.16-1.01.03-3.71-.01-7.42.01-11.13Z"/>
                </svg>
              </SocialIcon>
              <SocialIcon href="https://wa.me/250785288910" label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.108-.014.32-.13.517-.295.198-.164.326-.332.396-.531.07-.198.07-.37-.005-.52-.074-.148-.272-.222-.57-.37zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Shop links" className="lg:col-span-3 space-y-3">
            <span className="text-caption font-bold uppercase tracking-[0.18em] text-white/40 block">
              Quick Links
            </span>
            <ul className="space-y-1.5 text-sm text-white/70">
              {[
                { label: "Browse Products",    href: "/products" },
                { label: "Deals & Promotions", href: "/deals" },
                { label: "Order & Delivery",   href: "/order" },
                { label: "Contact Us",         href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors duration-150 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Details */}
          <address className="not-italic lg:col-span-4 space-y-3">
            <span className="text-caption font-bold uppercase tracking-[0.18em] text-white/40 block">
              Store Information
            </span>
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-accent mt-0.5" />
                <span>KN 70 St, Kigali, Rwanda</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0 text-accent" />
                <a href="tel:+250785288910" className="hover:text-white transition-colors">
                  +250 785 288 910
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0 text-accent" />
                <a href="mailto:hello@galaxyhub.rw" className="hover:text-white transition-colors">
                  hello@galaxyhub.rw
                </a>
              </div>
            </div>
          </address>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-5 border-t border-white/[0.06] flex flex-col gap-2 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Galaxy Hub Rwanda. All rights reserved.</span>
          <div className="flex items-center gap-3">
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
