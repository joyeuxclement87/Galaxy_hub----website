import Link from "next/link";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Galaxy Hub",
  "url": "https://galaxyhub.rw",
  "telephone": "+250785288910",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Kigali",
    "addressCountry": "RW"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "08:00",
      "closes": "19:00"
    }
  ],
  "sameAs": [
    "https://instagram.com/galaxyhub",
    "https://facebook.com/galaxyhub",
    "https://tiktok.com/@galaxyhub",
    "https://wa.me/250785288910",
    "https://t.me/galaxyhub"
  ]
};

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-transform duration-200 hover:scale-105 hover:bg-white/10" aria-label={label}>
      {children}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#061F3A] text-[#FFFEF9]">
      <div className="mx-auto max-w-[1320px] px-6 pt-16 pb-8">
        <div className="grid gap-12 xl:grid-cols-[1.5fr_1fr_1fr_1.1fr]">
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 text-white">
              <img src="/g-hub%20logo.png" alt="Galaxy Hub" width={42} height={42} className="h-10 w-10 object-contain" />
              <span className="text-xl font-semibold tracking-tight">Galaxy Hub</span>
            </Link>
            <p className="max-w-xl text-sm leading-7 text-white/75">
              Galaxy Hub is a trusted gadget store in Kigali, Rwanda, offering genuine smartphones, laptops,
              accessories, creator gear, and nationwide delivery.
            </p>
            <div>
              <Link
                href="/order"
                className="inline-flex items-center rounded-full bg-[#0F67A0] px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
              >
                Order Now →
              </Link>
            </div>
          </div>

          <nav aria-label="Shop links" className="space-y-4">
            <h2 className="text-sm font-semibold text-white/90">Shop</h2>
            <ul className="space-y-3 text-sm text-white/75">
              <li>
                <Link href="/products" className="transition hover:underline hover:underline-offset-4">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/brands" className="transition hover:underline hover:underline-offset-4">
                  Brands
                </Link>
              </li>
              <li>
                <Link href="/deals" className="transition hover:underline hover:underline-offset-4">
                  Deals
                </Link>
              </li>
              <li>
                <Link href="/products/new" className="transition hover:underline hover:underline-offset-4">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products/creator-gear" className="transition hover:underline hover:underline-offset-4">
                  Creator Essentials
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Support links" className="space-y-4">
            <h2 className="text-sm font-semibold text-white/90">Support</h2>
            <ul className="space-y-3 text-sm text-white/75">
              <li>
                <Link href="/order" className="transition hover:underline hover:underline-offset-4">
                  Delivery Information
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition hover:underline hover:underline-offset-4">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="transition hover:underline hover:underline-offset-4">
                  Warranty
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:underline hover:underline-offset-4">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <address className="not-italic space-y-4 text-sm text-white/75">
            <h2 className="text-sm font-semibold text-white/90">Contact</h2>
            <div className="space-y-2">
              <p>Kigali, Rwanda</p>
              <a href="tel:+250785288910" className="block transition hover:underline hover:underline-offset-4 text-white/85">
                +250 785 288 910
              </a>
              <a href="mailto:hello@galaxyhub.rw" className="block transition hover:underline hover:underline-offset-4 text-white/85">
                hello@galaxyhub.rw
              </a>
              <p className="text-white/70">Mon – Sat</p>
              <p className="text-white/70">8:00 AM – 7:00 PM</p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <SocialIcon href="https://instagram.com/galaxyhub" label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
                  <path d="M16.5 7.5h.01" />
                  <path d="M7.5 16.5a4.5 4.5 0 1 0 9 0 4.5 4.5 0 0 0-9 0Z" />
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
                  <path d="M18.5 5.5c0 2.6-1.8 4.2-4.4 4.2" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://wa.me/250785288910" label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M22 12.06c0 5.52-4.48 10-10 10-1.8 0-3.47-.46-4.95-1.28L2 22l1.38-4.14A9.94 9.94 0 0 1 2 12.06c0-5.52 4.48-10 10-10s10 4.48 10 10Z" />
                  <path d="m17 14-1.5-.5c-.2 0-.8-.1-1.5-.7-.7-.7-1-1.5-1-1.7 0-.2 0-.4.2-.5L14 10c.1-.1.2-.2.2-.4 0-.2-.1-.4-.2-.5l-1-1c-.2-.2-.4-.2-.6-.2-.2 0-.4 0-.6.1-.2.1-1 .5-1 .5-.4.2-.7.5-.9.7-.1.2-.2.4-.2.6-.1.1-.1.3-.1.4.1.4 1 1.9 2.6 3.5 1.8 1.7 3.2 2.1 3.6 2.2.4.1.8.1 1.1.1.4 0 .7 0 .9-.1.1 0 .7-.3.9-.5.2-.2.4-.5.4-.8 0-.2 0-.5-.1-.6Z" />
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

        <p className="mt-8 max-w-2xl text-sm leading-6 text-white/70">
          Galaxy Hub supplies genuine smartphones, laptops, audio devices, creator accessories, and smart technology with delivery across Rwanda.
        </p>
      </div>

      <div className="border-t border-white/10 bg-[#051824]">
        <div className="mx-auto flex flex-col gap-3 px-6 py-6 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Galaxy Hub</span>
          <span>Made in Rwanda 🇷🇼</span>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="transition hover:underline hover:underline-offset-4">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:underline hover:underline-offset-4">
              Terms
            </Link>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
    </footer>
  );
}

export default Footer;
