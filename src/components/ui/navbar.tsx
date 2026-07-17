"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, ShoppingCart, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

interface NavbarProps {
  onSearchFocus?: () => void;
  wishlistCount?: number;
  cartCount?: number;
}

const NAV_LINKS = [
  { label: "Products", id: "products" },
  { label: "Brands", id: "brands" },
  { label: "Deals", id: "deals" },
];

// ─── Wordmark ───────────────────────────────────────────────────────────────
function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex shrink-0 items-center gap-3 leading-none transition-all duration-300">
      <img
        src="/g-hub%20logo.png"
        alt="Galaxy Hub"
        className={cn(compact ? "h-7.5 w-auto" : "h-9 w-auto", "block select-none")}
      />
    </Link>
  );
}

// ─── Icon button with animated counter badge ───────────────────────────────
function IconLink({
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
    <span className="relative inline-flex h-9.5 w-9.5 items-center justify-center rounded-full text-ocean transition-all duration-300 hover:bg-ocean/6 hover:scale-[1.04] active:scale-[0.96] cursor-pointer">
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

// ─── Main Component ─────────────────────────────────────────────────────────
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
  const finalCartCount = propCartCount !== undefined ? propCartCount : cart.length;

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Body overflow locking when menus open
  useEffect(() => {
    document.body.style.overflow = searchOpen || mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen, mobileOpen]);

  // Focus search input
  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  // Keyboard listener for Escape key to close search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  // Scroll Spy Observer
  useEffect(() => {
    if (pathname !== "/") return;

    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    const productsEl = document.getElementById("products");
    const brandsEl = document.getElementById("brands");

    if (productsEl) observer.observe(productsEl);
    if (brandsEl) observer.observe(brandsEl);

    return () => {
      if (productsEl) observer.unobserve(productsEl);
      if (brandsEl) observer.unobserve(brandsEl);
    };
  }, [pathname]);

  const openSearch = () => {
    setSearchOpen(true);
    onSearchFocus?.();
  };

  const handleNavLinkClick = (e: React.MouseEvent, id: string) => {
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
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleSuggestedSearch = (query: string) => {
    setSearchQuery(query);
    setSearchOpen(false);
    
    if (pathname === "/") {
      const productsEl = document.getElementById("products");
      if (productsEl) {
        productsEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      router.push("/#products");
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      setSelectedCategory(selectedCategory === "Wishlist" ? "All" : "Wishlist");
      setShowDealsOnly(false);
      const el = document.getElementById("products");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push("/#products");
      // Once on landing page, a hash listener will handle toggling context state if required
    }
  };

  return (
    <>
      {/* ── Floating pill navigation ────────────────────────────────────── */}
      <div className="fixed inset-x-0 top-5 z-50 flex justify-center px-4 md:px-6">
        <header
          className={cn(
            "pointer-events-auto flex w-full max-w-[1320px] items-center justify-between rounded-[999px] border border-ocean/10 bg-ivory/75 shadow-[0_12px_32px_rgba(11,84,151,0.06)] backdrop-blur-xl transition-all duration-300",
            scrolled ? "h-[58px] px-5" : "h-[72px] px-6"
          )}
        >
          {/* Left: wordmark */}
          <Wordmark compact={scrolled} />

          {/* Center: nav links */}
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.id === "products"
                  ? pathname?.startsWith("/products") || (activeSection === "products" && !showDealsOnly && selectedCategory !== "Wishlist" && pathname === "/")
                  : link.id === "brands"
                  ? pathname?.startsWith("/brands") || (activeSection === "brands" && pathname === "/")
                  : link.id === "deals"
                  ? pathname === "/deals" || (activeSection === "deals" && pathname === "/")
                  : false;

              const href = (() => {
                if (link.id === "products") return pathname === "/" ? `#products` : "/products";
                if (link.id === "brands") return pathname === "/" ? `#brands` : "/brands";
                if (link.id === "deals") return pathname === "/" ? `#deals` : "/deals";
                return pathname === "/" ? `#${link.id}` : `/#${link.id}`;
              })();

              return (
                <Link
                  key={link.id}
                  href={href}
                  onClick={(e) => handleNavLinkClick(e, link.id)}
                  className={cn(
                    "relative py-1.5 font-sans text-sm font-medium tracking-wide transition-colors duration-300",
                    isActive ? "text-ocean" : "text-ocean/60 hover:text-ocean"
                  )}
                >
                  {link.label}
                  {isActive && (
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
          <div className="flex items-center gap-1 sm:gap-2">
            <IconLink label="Search" icon={<Search className="h-[18px] w-[18px]" />} onClick={openSearch} />
            <IconLink
              label="Wishlist"
              icon={<Heart className="h-[18px] w-[18px]" />}
              count={finalWishlistCount}
              onClick={handleWishlistClick}
            />
            <IconLink
              href="/order"
              label="Cart"
              icon={<ShoppingCart className="h-[18px] w-[18px]" />}
              count={finalCartCount}
            />

            <Link
              href="/order"
              className="ml-1 hidden items-center gap-2 rounded-full bg-ocean px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(11,84,151,0.22)] active:translate-y-0 sm:inline-flex"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Order Now
            </Link>

            <button
              type="button"
              onClick={() => {
                if (cart.length === 0) return;
                if (confirm("Clear all items from your cart? This cannot be undone.")) {
                  clearCart();
                }
              }}
              title="Clear cart"
              className="ml-2 hidden h-9.5 w-9.5 items-center justify-center rounded-full border border-black/6 text-ocean/70 transition-colors duration-200 hover:bg-rose-50 hover:text-rose-600 sm:inline-flex"
            >
              <Trash2 className="h-[18px] w-[18px]" />
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="inline-flex h-9.5 w-9.5 items-center justify-center rounded-full text-ocean transition-colors duration-200 hover:bg-ocean/6 lg:hidden cursor-pointer"
            >
              <Menu className="h-[18px] w-[18px]" />
            </button>
          </div>
        </header>
      </div>

      {/* ── Mobile menu ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-[#0b1b2e]/45 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-x-4 top-24 z-[61] rounded-[28px] border border-ocean/10 bg-ivory/95 p-6 shadow-[0_24px_60px_rgba(11,84,151,0.18)] backdrop-blur-xl lg:hidden"
            >
              <div className="mb-5 flex items-center justify-between">
                <Wordmark />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex h-9.5 w-9.5 items-center justify-center rounded-full text-ocean/60 hover:bg-ocean/6 cursor-pointer"
                >
                  <X className="h-[18px] w-[18px]" />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.id}
                    href={(() => {
                      if (link.id === "products") return pathname === "/" ? `#products` : "/products";
                      if (link.id === "brands") return pathname === "/" ? `#brands` : "/brands";
                      if (link.id === "deals") return pathname === "/" ? `#deals` : "/deals";
                      return pathname === "/" ? `#${link.id}` : `/#${link.id}`;
                    })()}
                    onClick={(e) => {
                      setMobileOpen(false);
                      handleNavLinkClick(e, link.id);
                    }}
                    className="rounded-2xl px-4 py-3 font-sans text-base font-semibold text-ocean/85 transition-colors duration-200 hover:bg-ocean/6"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-5 flex items-center gap-3 border-t border-ocean/8 pt-5">
                <IconLink
                  label="Wishlist"
                  icon={<Heart className="h-[18px] w-[18px]" />}
                  count={finalWishlistCount}
                  onClick={(e) => {
                    setMobileOpen(false);
                    handleWishlistClick(e);
                  }}
                />
                <IconLink
                  href="/order"
                  label="Cart"
                  icon={<ShoppingCart className="h-[18px] w-[18px]" />}
                  count={finalCartCount}
                  onClick={() => setMobileOpen(false)}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (cart.length === 0) return;
                    if (confirm("Clear all items from your cart? This cannot be undone.")) {
                      clearCart();
                      setMobileOpen(false);
                    }
                  }}
                  className="ml-2 inline-flex items-center gap-2 rounded-full border border-black/8 px-3 py-2 text-sm text-rose-600 bg-rose-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear cart
                </button>
                <Link
                  href="/order"
                  onClick={() => setMobileOpen(false)}
                  className="ml-auto inline-flex items-center gap-2 rounded-full bg-ocean px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-ivory"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Order Now
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Full-width search overlay ───────────────────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 z-[70] bg-[#0b1b2e]/45 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: -36 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -36 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-0 top-0 z-[71] border-b border-ocean/10 bg-ivory/90 px-6 py-10 shadow-[0_20px_50px_rgba(11,84,151,0.12)] backdrop-blur-2xl md:px-12"
            >
              <div className="mx-auto max-w-[1320px]">
                <div className="flex items-center gap-4">
                  <Search className="h-6 w-6 shrink-0 text-ocean/55" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (pathname === "/") {
                        const productsEl = document.getElementById("products");
                        if (productsEl) {
                          productsEl.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }
                    }}
                    placeholder="Search phones, laptops, accessories..."
                    className="w-full border-none bg-transparent font-clash-display text-2xl font-semibold text-[#10233D] placeholder:text-ocean/30 focus:outline-none sm:text-3.5xl"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    aria-label="Close search"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ocean/60 transition-colors duration-200 hover:bg-ocean/6 cursor-pointer"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Popular searches suggestions */}
                <div className="mt-8 flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ocean/45 mr-1.5 font-manrope">
                    Popular searches:
                  </span>
                  {["iPhone 15", "Galaxy S24", "Sony XM5", "DJI Mini", "Laptops"].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSuggestedSearch(chip)}
                      className="rounded-full border border-ocean/8 bg-ocean-light/20 px-3.5 py-1.5 text-xs font-semibold text-ocean transition-all duration-300 hover:border-ocean/20 hover:bg-ocean-light/50 cursor-pointer font-manrope"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-ocean/40 font-manrope">
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
