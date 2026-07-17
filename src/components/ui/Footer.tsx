import Link from "next/link";

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
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "20:00",
    },
  ],
  "sameAs": [
    "https://instagram.com/galaxyhub",
    "https://facebook.com/galaxyhub",
    "https://tiktok.com/@galaxyhub",
    "https://wa.me/250785288910",
    "https://t.me/galaxyhub",
  ],
};

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white transition-all duration-200 hover:bg-white/14 hover:scale-105"
    >
      {children}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#061F3A] text-[#FFFEF9]">
      <div className="mx-auto max-w-[1320px] px-4 pt-14 pb-8 sm:px-6 md:px-12">

        {/* Main grid — 1 col on mobile, 2 cols on sm, 4 cols on xl */}
        <div className="grid grid-cols-2 gap-8 sm:gap-10 xl:grid-cols-[1.6fr_1fr_1fr_1.1fr]">

          {/* Brand column — full width on mobile */}
          <div className="col-span-2 space-y-5 xl:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 text-white">
              <img
                src="/g-hub%20logo.png"
                alt="Galaxy Hub"
                width={40}
                height={40}
                className="h-10 w-auto object-contain"
              />
              <span className="font-clash text-xl font-bold tracking-tight">Galaxy Hub</span>
            </Link>
            <p className="text-sm leading-[1.8] text-white/65 font-manrope max-w-sm">
              Galaxy Hub is a trusted gadget store in Kigali, Rwanda, offering genuine smartphones, laptops, accessories, creator gear, and nationwide delivery.
            </p>
            <Link
              href="/order"
              className="inline-flex items-center gap-2 rounded-full bg-ocean px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-ocean-dark"
            >
              Order Now →
            </Link>
          </div>

          {/* Shop */}
          <nav aria-label="Shop links" className="space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50 font-manrope">Shop</h2>
            <ul className="space-y-2.5 text-sm text-white/70 font-manrope">
              {[
                { label: "All Products",       href: "/products"            },
                { label: "Smartphones",        href: "/products/smartphones"},
                { label: "Laptops",            href: "/products/laptops"    },
                { label: "Brands",             href: "/brands"              },
                { label: "Deals",              href: "/deals"               },
                { label: "Creator Essentials", href: "/products/creator-gear"},
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-white hover:underline underline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Support */}
          <nav aria-label="Support links" className="space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50 font-manrope">Support</h2>
            <ul className="space-y-2.5 text-sm text-white/70 font-manrope">
              {[
                { label: "How to Order",   href: "/order"   },
                { label: "Delivery Info",  href: "/order"   },
                { label: "FAQs",           href: "/#faq"    },
                { label: "Warranty",       href: "/warranty"},
                { label: "Contact Us",     href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors hover:text-white hover:underline underline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <address className="not-italic col-span-2 space-y-4 sm:col-span-1 xl:col-span-1">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50 font-manrope">Contact</h2>
            <div className="space-y-2 text-sm text-white/70 font-manrope">
              <p>TCB Floor 1B, Door 13B</p>
              <p>Kigali, Rwanda</p>
              <a href="tel:+250785288910" className="block text-white/85 hover:text-white hover:underline underline-offset-4 transition-colors">
                +250 785 288 910
              </a>
              <a href="mailto:hello@galaxyhub.rw" className="block text-white/85 hover:text-white hover:underline underline-offset-4 transition-colors">
                hello@galaxyhub.rw
              </a>
              <p>Mon – Sat · 9 AM – 8 PM</p>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap gap-2 pt-1">
              <SocialIcon href="https://instagram.com/galaxyhub" label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
                  <path d="M16.5 7.5h.01" />
                  <circle cx="12" cy="12" r="4.5" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://facebook.com/galaxyhub" label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M18 2h-3.6c-3.2 0-4.4 1.5-4.4 4.2V9H6v4h3v9h4v-9h3.2l.8-4H13V6.2c0-.8.2-1.2 1.2-1.2H18V2Z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://tiktok.com/@galaxyhub" label="TikTok">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M14 2v10a4 4 0 1 1-4-4" />
                  <path d="M18 8.5a4.8 4.8 0 0 1-3.5-1.5" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://wa.me/250785288910" label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M22 12.06c0 5.52-4.48 10-10 10-1.8 0-3.47-.46-4.95-1.28L2 22l1.38-4.14A9.94 9.94 0 0 1 2 12.06c0-5.52 4.48-10 10-10s10 4.48 10 10Z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://t.me/galaxyhub" label="Telegram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M22 2 2 11.5 7.5 14l2.6 8L11 14l11-12Z" />
                  <path d="M7.5 14 18.4 6.8" />
                </svg>
              </SocialIcon>
            </div>
          </address>
        </div>

        {/* SEO text */}
        <p className="mt-10 text-xs leading-[1.8] text-white/40 font-manrope max-w-2xl">
          Galaxy Hub supplies genuine smartphones, laptops, audio devices, creator accessories, and smart technology with delivery across Rwanda — including Kigali, Musanze, Rubavu, Huye, Muhanga, and all other provinces.
        </p>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8 bg-[#04131F]">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-2 px-4 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between md:px-12">
          <span className="font-manrope">© 2026 Galaxy Hub · Kigali, Rwanda</span>
          <span className="font-manrope">Made with care in Rwanda 🇷🇼</span>
          <div className="flex flex-wrap items-center gap-4 font-manrope">
            <Link href="/privacy" className="hover:text-white/70 hover:underline underline-offset-4 transition-colors">Privacy</Link>
            <Link href="/terms"   className="hover:text-white/70 hover:underline underline-offset-4 transition-colors">Terms</Link>
          </div>
        </div>
      </div>

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
    </footer>
  );
}

export default Footer;
