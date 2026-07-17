"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, MapPin, Menu, Search, ShoppingBag, ShoppingCart, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

interface NavbarProps {
  onSearchFocus?: () => void;
  wishlistCount?: number;
  cartCount?: number;
}

const NAV_LINKS = [
  { label: "Products", id: "products" },
  { label: "Brands",   id: "brands"   },
  { label: "Deals",    id: "deals"    },
];

// ─── Wordmark ────────────────────────────────────────────────────────────────
function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2.5 leading-none transition-opacity duration-200 hover:opacity-80">
      <img
        src="/g-hub%20logo.png"
        alt="Galaxy Hub"
        className={cn(
          "block select-none object-contain transition-all duration-300",
          compact ? "h-7 w-auto" : "h-9 w-auto"
        )}
      />
    </Link>
  );
}

// ─── Icon button with animated counter badge ──────────────────────────────────
function IconBtn({
  label,
  icon,
  count,
  onClick,
  href,
}: {
  label: string;
  icon: React.ReactNode;
  count?: number;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
}) {
  const content = (
    <span className="relative inline-flex h-10 w-10 sm:h-10 sm:w-10 items-center justify-center rounded-full text-ocean transition-all duration-200 hover:bg-ocean/8 active:scale-[0.94] cursor-pointer touch-target">
      {icon}
      <AnimatePresence mode="popLayout">
        {!!count && count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.4, opacity: 0, y: 3 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.4, opacity: 0, y: -3 }}
            transition={{ type: "spring", stiffness: 600, damping: 14 }}
            className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-ivory shadow-[0_2px_6px_rgba(15,112,201,0.35)]"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} aria-label={label} className="cursor-pointer">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={label} className="cursor-pointer">
      {content}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function Navbar({ onSearchFocus, wishlistCount: propWishlistCount, cartCount: propCartCount }: NavbarProps) {
  const {
    wishlist,
    cart,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setSelectedBrand,
    showDealsOnly,
    setShowDealsOnly,
    clearCart,
  } = useApp();

  const finalWishlistCount = propWishlistCount !== undefined ? propWishlistCount : wishlist.length;
  const finalCartCount     = propCartCount     !== undefined ? propCartCount     : cart.length;

  const [scrolled,       setScrolled]       = useState(false);
  const [searchOpen,     setSearchOpen]     = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [activeSection,  setActiveSection]  = useState("");

  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router   = useRouter();

  // ── Scroll detection ──────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Body overflow lock ────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = searchOpen || mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [searchOpen, mobileOpen]);

  // ── Auto-focus search input ───────────────────────────────────────────────
  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  // ── Escape key closes search ──────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSearchOpen(false); setMobileOpen(false); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ── Scroll Spy ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (pathname !== "/") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { root: null, rootMargin: "-25% 0px -55% 0px", threshold: 0.1 }
    );

    const productsEl = document.getElementById("products");
    const brandsEl   = document.getElementById("brands");

    if (productsEl) observer.observe(productsEl);
    if (brandsEl)   observer.observe(brandsEl);

    return () => {
      if (productsEl) observer.unobserve(productsEl);
      if (brandsEl)   observer.unobserve(brandsEl);
    };
  }, [pathname]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const openSearch = () => {
    setSearchOpen(true);
    onSearchFocus?.();
  };

  const handleNavLinkClick = (e: React.MouseEvent, id: string) => {
    setMobileOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      if (id === "deals") {
        setShowDealsOnly(true);
        setSelectedCategory("All");
        setSelectedBrand("All");
      } else if (id === "products") {
        setShowDealsOnly(false);
      }
      const targetEl = document.getElementById(id === "deals" ? "products" : id);
      if (targetEl) targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSuggestedSearch = (query: string) => {
    setSearchQuery(query);
    setSearchOpen(false);
    if (pathname === "/") {
      const productsEl = document.getElementById("products");
      if (productsEl) productsEl.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push("/#products");
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    if (pathname === "/") {
      setSelectedCategory(selectedCategory === "Wishlist" ? "All" : "Wishlist");
      setShowDealsOnly(false);
      const el = document.getElementById("products");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push("/#products");
    }
  };

  // ── Nav link active state logic ───────────────────────────────────────────
  const getLinkHref = (id: string) => {
    if (id === "products") return pathname === "/" ? "#products" : "/products";
    if (id === "brands")   return pathname === "/" ? "#brands"   : "/brands";
    if (id === "deals")    return pathname === "/" ? "#deals"    : "/deals";
    return pathname === "/" ? `#${id}` : `/#${id}`;
  };

  const isLinkActive = (id: string) => {
    if (id === "products") return pathname?.startsWith("/products") || (activeSection === "products" && !showDealsOnly && selectedCategory !== "Wishlist" && pathname === "/");
    if (id === "brands")   return pathname?.startsWith("/brands")  || (activeSection === "brands"   && pathname === "/");
    if (id === "deals")    return pathname === "/deals" || (showDealsOnly && pathname === "/");
    return false;
  };

  return (
    <>
      {/* ── Floating pill navigation ─────────────────────────────────────── */}
      <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-3 sm:px-4 md:px-6">
        <header
          className={cn(
            "pointer-events-auto flex w-full max-w-[1320px] items-center justify-between border border-ocean/10 bg-ivory/80 shadow-[0_12px_32px_rgba(11,84,151,0.07)] backdrop-blur-xl transition-all duration-300",
            scrolled
              ? "h-14 rounded-[999px] px-4 sm:px-5"
              : "h-[68px] rounded-[999px] px-4 sm:px-6"
          )}
        >
          {/* Left: Wordmark + Location */}
          <div className="flex items-center gap-3">
            <Wordmark compact={scrolled} />
            {/* Location pill — desktop only */}
            <span className="hidden items-center gap-1 rounded-full border border-ocean/10 bg-ocean-light/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-ocean/60 lg:inline-flex">
              <MapPin className="h-2.5 w-2.5" />
              Kigali · Rwanda
            </span>
          </div>

          {/* Center: nav links — desktop */}
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.id);
              return (
                <Link
                  key={link.id}
                  href={getLinkHref(link.id)}
                  onClick={(e) => handleNavLinkClick(e, link.id)}
                  className={cn(
                    "relative py-1.5 font-sans text-[13px] font-semibold tracking-wide transition-colors duration-200",
                    active ? "text-ocean" : "text-ocean/55 hover:text-ocean"
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="activeUnderline"
                      className="absolute inset-x-0 -bottom-1 h-[2px] rounded-full bg-ocean"
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: actions */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {/* Search */}
            <IconBtn label="Search" icon={<Search className="h-[18px] w-[18px]" />} onClick={openSearch} />

            {/* Wishlist — hidden on smallest screens */}
            <span className="hidden sm:inline-flex">
              <IconBtn
                label="Wishlist"
                icon={<Heart className="h-[18px] w-[18px]" />}
                count={finalWishlistCount}
                onClick={handleWishlistClick}
              />
            </span>

            {/* Cart */}
            <IconBtn
              href="/order"
              label="Cart"
              icon={<ShoppingCart className="h-[18px] w-[18px]" />}
              count={finalCartCount}
            />

            {/* Order Now CTA — hidden on mobile */}
            <Link
              href="/order"
              className="ml-1 hidden items-center gap-1.5 rounded-full bg-ocean px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-ivory transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(11,84,151,0.22)] active:translate-y-0 sm:inline-flex md:px-5"
            >
              <ShoppingBag className="h-3 w-3" />
              Order Now
            </Link>

            {/* Clear cart — desktop only */}
            <button
              type="button"
              onClick={() => {
                if (cart.length === 0) return;
                if (confirm("Clear all items from your cart? This cannot be undone.")) clearCart();
              }}
              title="Clear cart"
              className="ml-1 hidden h-10 w-10 items-center justify-center rounded-full border border-black/6 text-ocean/60 transition-colors duration-200 hover:bg-rose-50 hover:text-rose-500 lg:inline-flex"
            >
              <Trash2 className="h-[17px] w-[17px]" />
            </button>

            {/* Hamburger — mobile/tablet */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="ml-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-ocean transition-colors duration-200 hover:bg-ocean/8 lg:hidden cursor-pointer"
            >
              <Menu className="h-[19px] w-[19px]" />
            </button>
          </div>
        </header>
      </div>

      {/* ── Mobile menu ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-[#0b1b2e]/50 backdrop-blur-sm lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed inset-x-3 top-[88px] z-[61] overflow-hidden rounded-[28px] border border-ocean/10 bg-ivory/96 shadow-[0_24px_60px_rgba(11,84,151,0.2)] backdrop-blur-2xl lg:hidden"
            >
              {/* Header row */}
              <div className="flex items-center justify-between border-b border-ocean/8 px-5 py-4">
                <div>
                  <Wordmark />
                  <span className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-ocean/45 uppercase tracking-[0.18em]">
                    <MapPin className="h-2.5 w-2.5" /> Kigali · Rwanda
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ocean/60 hover:bg-ocean/8 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col gap-1 px-3 py-3" aria-label="Mobile navigation">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.id}
                    href={getLinkHref(link.id)}
                    onClick={(e) => handleNavLinkClick(e, link.id)}
                    className={cn(
                      "flex items-center rounded-2xl px-4 py-4 font-sans text-base font-semibold transition-colors duration-150 min-h-[52px]",
                      isLinkActive(link.id)
                        ? "bg-ocean/8 text-ocean"
                        : "text-ocean/80 hover:bg-ocean/5 hover:text-ocean"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Divider + actions */}
              <div className="flex flex-wrap items-center gap-2 border-t border-ocean/8 px-5 py-4">
                {/* Wishlist */}
                <IconBtn
                  label="Wishlist"
                  icon={<Heart className="h-[18px] w-[18px]" />}
                  count={finalWishlistCount}
                  onClick={(e) => { setMobileOpen(false); handleWishlistClick(e); }}
                />

                {/* Cart */}
                <IconBtn
                  href="/order"
                  label="Cart"
                  icon={<ShoppingCart className="h-[18px] w-[18px]" />}
                  count={finalCartCount}
                  onClick={() => setMobileOpen(false)}
                />

                {/* Clear cart */}
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Clear all items from your cart?")) {
                        clearCart();
                        setMobileOpen(false);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-rose-50 px-3.5 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear cart
                  </button>
                )}

                {/* Order Now — prominent CTA */}
                <Link
                  href="/order"
                  onClick={() => setMobileOpen(false)}
                  className="ml-auto inline-flex items-center gap-2 rounded-full bg-ocean px-5 py-3 text-sm font-bold uppercase tracking-wider text-ivory shadow-[0_8px_24px_rgba(11,84,151,0.22)] transition-all duration-200 hover:-translate-y-0.5"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Order Now
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Full-width search overlay ─────────────────────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 z-[70] bg-[#0b1b2e]/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: -32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -32 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-0 top-0 z-[71] border-b border-ocean/10 bg-ivory/92 px-4 py-8 shadow-[0_20px_50px_rgba(11,84,151,0.12)] backdrop-blur-2xl md:px-12 md:py-10"
            >
              <div className="mx-auto max-w-[1320px]">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Search className="h-5 w-5 shrink-0 text-ocean/50 sm:h-6 sm:w-6" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (pathname === "/") {
                        const productsEl = document.getElementById("products");
                        if (productsEl) productsEl.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                    placeholder="Search phones, laptops, accessories..."
                    className="w-full border-none bg-transparent font-clash text-xl font-bold text-[#10233D] placeholder:text-ocean/30 focus:outline-none sm:text-2xl lg:text-3xl"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    aria-label="Close search"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ocean/60 transition-colors hover:bg-ocean/8 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Suggestions */}
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ocean/40 mr-1 font-manrope">
                    Popular:
                  </span>
                  {["iPhone 16", "Galaxy S25", "AirPods Pro", "MacBook Air", "Sony XM5", "DJI Mini"].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSuggestedSearch(chip)}
                      className="rounded-full border border-ocean/10 bg-ocean-light/25 px-3.5 py-1.5 text-xs font-semibold text-ocean transition-all duration-200 hover:border-ocean/25 hover:bg-ocean-light/50 cursor-pointer font-manrope"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ocean/35 font-manrope">
                  Press ESC to close
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
