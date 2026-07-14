"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Menu, X, ArrowRight, ChevronDown,
  Smartphone, Zap, Watch, Gamepad2, ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PRODUCTS } from "@/data/mock-data";

interface NavbarProps {
  onSearchFocus?: () => void;
}

// ─── Mega Menu Categories ─────────────────────────────────────────────────────
const MEGA_CATEGORIES = [
  {
    label: "Phones",
    icon: Smartphone,
    items: [
      { name: "Apple",        sub: "iPhone 15 series & beyond.",    id: "iphone-15-pro" },
      { name: "Samsung",      sub: "Galaxy flagship lineup.",        id: "s24-ultra"     },
      { name: "Google Pixel", sub: "Pure Android, powerful AI.",     id: "pixel-8-pro"   },
      { name: "Nothing",      sub: "Transparent design, clean OS.",  id: "nothing"       },
      { name: "OnePlus",      sub: "Speed, never settle.",           id: "oneplus"       },
    ],
  },
  {
    label: "Accessories",
    icon: Zap,
    items: [
      { name: "Chargers",          sub: "Fast & wireless charging.",  id: "chargers"          },
      { name: "Cases",             sub: "Protection meets style.",    id: "cases"             },
      { name: "Power Banks",       sub: "Always stay powered up.",    id: "power-banks"       },
      { name: "Screen Protectors", sub: "Tempered glass & film.",     id: "screen-protectors" },
    ],
  },
  {
    label: "Wearables",
    icon: Watch,
    items: [
      { name: "Smart Watches", sub: "Track health, stay connected.", id: "smart-watches" },
      { name: "Earbuds",       sub: "True wireless, pro sound.",     id: "earbuds"       },
      { name: "Speakers",      sub: "Room-filling portable audio.",  id: "speakers"      },
    ],
  },
  {
    label: "Gaming",
    icon: Gamepad2,
    items: [
      { name: "Controllers",        sub: "Precision gaming controls.", id: "controllers"        },
      { name: "Gaming Phones",      sub: "High-refresh, low latency.", id: "gaming-phones"      },
      { name: "Gaming Accessories", sub: "Cooling, grips & more.",     id: "gaming-accessories" },
    ],
  },
];

const featuredProduct = PRODUCTS.find((p) => p.featured) || PRODUCTS[0];

const NAV_LINKS = [
  { label: "Brands",  href: "#brands"           },
  { label: "Deals",   href: "#reviews"          },
  { label: "About",   href: "#showroom-details" },
  { label: "Contact", href: "#showroom-details" },
];

// ─── Social link data with inline SVGs for WhatsApp & Telegram ───────────────
const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/250788123456",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    label: "Telegram",
    href: "https://t.me/galaxyhub",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
];

// ─── Wordmark ─────────────────────────────────────────────────────────────────
function Wordmark({ size = "lg" }: { size?: "sm" | "lg" }) {
  return (
    <Link href="/" className="group shrink-0">
      <Image
        src="/g-hub logo.png"
        alt="Galaxy Hub logo"
        width={220}
        height={72}
        priority
        className={cn(
          "h-auto w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]",
          size === "sm" ? "max-h-8 max-w-[120px]" : "max-h-10 max-w-[150px]"
        )}
      />
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function Navbar({ onSearchFocus }: NavbarProps) {
  const [scrolled,    setScrolled]   = useState(false);
  const [megaOpen,    setMegaOpen]   = useState(false);
  const [drawerOpen,  setDrawerOpen] = useState(false);
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const openMega  = () => { if (megaTimer.current) clearTimeout(megaTimer.current); setMegaOpen(true); };
  const closeMega = () => { megaTimer.current = setTimeout(() => setMegaOpen(false), 120); };

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE FLOATING PILL  (visible < lg, hidden on lg+)
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 lg:hidden flex justify-center pointer-events-none transition-all duration-500",
          scrolled ? "pt-3" : "pt-5"
        )}
      >
        <div
          className={cn(
            "pointer-events-auto w-full mx-4 flex items-center justify-between px-5 transition-all duration-500 border border-white/40 rounded-[999px]",
            scrolled
              ? "h-[56px] bg-white/80 backdrop-blur-2xl shadow-[0_16px_48px_rgba(11,84,151,0.14)]"
              : "h-[64px] bg-white/55 backdrop-blur-[16px] shadow-[0_20px_60px_rgba(11,84,151,0.07)]"
          )}
        >
          {/* Logo */}
          <Wordmark size="sm" />

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={onSearchFocus}
              aria-label="Search"
              className="p-2.5 rounded-full text-[#0B5497] hover:bg-[#0B5497]/6 transition-all duration-200 cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="p-2.5 rounded-full text-[#0B5497] hover:bg-[#0B5497]/6 transition-all duration-200 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          DESKTOP FLOATING PILL HEADER  (hidden < lg, visible on lg+)
      ══════════════════════════════════════════════════════════════════════ */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 hidden lg:flex justify-center pointer-events-none transition-all duration-500",
          scrolled ? "pt-3" : "pt-6"
        )}
      >
        <div
          className={cn(
            "pointer-events-auto w-full mx-8 max-w-[1320px] flex items-center justify-between px-8 transition-all duration-500 border border-white/40 rounded-[999px]",
            scrolled
              ? "h-[60px] bg-white/80 backdrop-blur-2xl shadow-[0_16px_48px_rgba(11,84,151,0.14)]"
              : "h-[72px] bg-white/55 backdrop-blur-[16px] shadow-[0_20px_60px_rgba(11,84,151,0.07)]"
          )}
        >
          {/* Wordmark */}
          <Wordmark />

          {/* Centered nav */}
          <nav className="flex items-center gap-6 h-full absolute left-1/2 -translate-x-1/2">
            {/* Products with mega menu */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
            >
              <button
                className={cn(
                  "flex items-center gap-1 text-sm font-semibold transition-colors duration-200 cursor-pointer",
                  megaOpen ? "text-[#0f70c9]" : "text-[#0B5497] hover:text-[#0f70c9]"
                )}
                aria-haspopup="true"
                aria-expanded={megaOpen}
              >
                Products
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", megaOpen && "rotate-180")} />
              </button>

              {/* ── Mega Menu ──────────────────────────────────────────────── */}
              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    onMouseEnter={openMega}
                    onMouseLeave={closeMega}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0,  scale: 1     }}
                    exit={{   opacity: 0, y: 10, scale: 0.98   }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-1/2 -translate-x-[38%] mt-4 w-[1040px] bg-white/96 backdrop-blur-2xl border border-black/6 rounded-[24px] shadow-[0_30px_80px_rgba(11,84,151,0.18)] overflow-hidden"
                    style={{ transformOrigin: "top center" }}
                  >
                    <div className="grid grid-cols-12 gap-0">
                      {/* Left: 4 category columns */}
                      <div className="col-span-8 p-8 grid grid-cols-4 gap-6 border-r border-black/5">
                        {MEGA_CATEGORIES.map((cat) => {
                          const Icon = cat.icon;
                          return (
                            <div key={cat.label} className="space-y-5">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-[#e6f0fa] text-[#0B5497]">
                                  <Icon className="w-3.5 h-3.5" />
                                </span>
                                <span className="font-cabinet text-[10px] font-bold uppercase tracking-[0.12em] text-[#0B5497]/50">
                                  {cat.label}
                                </span>
                              </div>
                              <ul className="space-y-4">
                                {cat.items.map((item) => (
                                  <li key={item.id}>
                                    <Link
                                      href="#products"
                                      onClick={() => setMegaOpen(false)}
                                      className="group/item block"
                                    >
                                      <p className="text-sm font-semibold text-[#0B5497] group-hover/item:text-[#0f70c9] transition-colors leading-none">
                                        {item.name}
                                      </p>
                                      <p className="text-[11px] text-[#0B5497]/50 mt-1 group-hover/item:text-[#0f70c9]/60 transition-colors">
                                        {item.sub}
                                      </p>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>

                      {/* Right: Featured card */}
                      <div className="col-span-4 p-6 bg-[#e6f0fa]/40 flex flex-col justify-between gap-6">
                        <div className="space-y-3">
                          <span className="inline-block bg-[#0B5497]/10 text-[#0B5497] text-[9px] font-bold tracking-[0.15em] uppercase rounded-full px-3 py-1">
                            Featured This Week
                          </span>
                          <div className="w-full h-36 flex items-center justify-center">
                            <img
                              src={featuredProduct.image}
                              alt={featuredProduct.title}
                              className="h-32 object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.14)]"
                            />
                          </div>
                          <div>
                            <h4 className="font-cabinet text-sm font-bold text-[#0B5497] leading-snug">
                              {featuredProduct.title}
                            </h4>
                            <p className="text-[11px] text-[#0B5497]/60 mt-0.5 line-clamp-2">
                              {featuredProduct.tagline}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-cabinet text-xs font-bold text-[#0f70c9]">
                            {featuredProduct.currency}{" "}
                            {new Intl.NumberFormat("en-US").format(featuredProduct.price)}
                          </span>
                          <Link
                            href="#products"
                            onClick={() => setMegaOpen(false)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#0B5497] hover:text-[#0f70c9] transition-colors group/cta"
                          >
                            Explore
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Bottom strip */}
                    <div className="border-t border-black/5 px-8 py-3 flex items-center justify-between bg-white/60">
                      <span className="text-[11px] text-[#0B5497]/50">
                        Authorized reseller · All stock verified & genuine
                      </span>
                      <Link
                        href="#products"
                        onClick={() => setMegaOpen(false)}
                        className="text-[11px] font-bold text-[#0B5497] hover:text-[#0f70c9] transition-colors flex items-center gap-1"
                      >
                        View all products <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other nav links */}
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-[#0B5497] hover:text-[#0f70c9] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onSearchFocus}
              aria-label="Search"
              className="p-2.5 rounded-full text-[#0B5497] hover:bg-[#0B5497]/6 transition-all duration-200 cursor-pointer"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Boutique status */}
            <div className="hidden xl:flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-semibold rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Kigali · Open Now
            </div>

            {/* Order Now */}
            <Link
              href="/order"
              className="inline-flex items-center gap-2 justify-center font-semibold text-sm text-[#FFFEF9] bg-[#0B5497] rounded-full px-6 py-2.5 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(11,84,151,0.28)] active:translate-y-0 active:shadow-none transition-all duration-300 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              Order Now
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE DRAWER — full-screen panel, slides from right
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Blurred overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[60] bg-[#0B5497]/20 backdrop-blur-[6px]"
            />

            {/* Drawer panel */}
            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-[340px] bg-[#FFFEF9] flex flex-col shadow-[0_0_80px_rgba(11,84,151,0.22)]"
            >
              {/* ── Header ─────────────────────────────────────────────────── */}
              <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-[#0B5497]/8">
                <Wordmark size="sm" />
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-full hover:bg-[#0B5497]/6 text-[#0B5497] transition-all duration-200"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ── Nav Links ──────────────────────────────────────────────── */}
              <nav className="flex-1 px-7 pt-8 pb-6 flex flex-col overflow-y-auto">
                {/* Separator label */}
                <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#0B5497]/35 mb-6">
                  Navigation
                </p>

                {/* Big staggered nav links */}
                <div className="flex flex-col gap-1">
                  {[
                    { label: "Products", href: "#products" },
                    { label: "Brands",   href: "#brands"           },
                    { label: "Deals",    href: "#reviews"          },
                    { label: "About",    href: "#showroom-details" },
                    { label: "Contact",  href: "#showroom-details" },
                  ].map(({ label, href }, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i + 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={href}
                        onClick={() => setDrawerOpen(false)}
                        className="group flex items-center justify-between py-3.5 border-b border-[#0B5497]/6 last:border-0"
                      >
                        <span className="font-cabinet text-[26px] font-extrabold text-[#0B5497] group-hover:text-[#0f70c9] transition-colors duration-200 leading-none">
                          {label}
                        </span>
                        <ArrowRight className="w-4 h-4 text-[#0B5497]/25 group-hover:text-[#0f70c9] group-hover:translate-x-1 transition-all duration-200" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* ── Spacer ─────────────────────────────────────────────── */}
                <div className="flex-1" />

                {/* ── Reserve CTA ────────────────────────────────────────── */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32, duration: 0.3 }}
                  className="mt-8 mb-6"
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#0B5497]/35 mb-4">
                    Ready to Order?
                  </p>
                  <Link
                    href="/order"
                    onClick={() => setDrawerOpen(false)}
                    className="w-full inline-flex items-center justify-center gap-2.5 bg-[#0B5497] text-[#FFFEF9] font-semibold text-sm rounded-full py-4 hover:shadow-[0_10px_28px_rgba(11,84,151,0.30)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Order Now
                  </Link>
                </motion.div>

                {/* ── Social Links ────────────────────────────────────────── */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.42, duration: 0.3 }}
                  className="border-t border-[#0B5497]/8 pt-6"
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#0B5497]/35 mb-4">
                    Follow Us
                  </p>
                  <div className="flex items-center gap-3">
                    {SOCIAL_LINKS.map(({ label, href, icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex items-center justify-center w-10 h-10 rounded-full border border-[#0B5497]/12 text-[#0B5497]/60 hover:bg-[#0B5497] hover:text-[#FFFEF9] hover:border-[#0B5497] transition-all duration-200"
                      >
                        {icon}
                      </a>
                    ))}
                  </div>
                </motion.div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
