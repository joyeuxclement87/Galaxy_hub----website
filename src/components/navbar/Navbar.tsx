"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingCart, X, Trash2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { useSupabaseCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onSearchFocus?: () => void;
}

const NAV_LINKS = [
  { label: "Home", id: "home" },
  { label: "Products", id: "products" },
  { label: "Categories", id: "categories" },
  { label: "Brands", id: "brands" },
  { label: "Promotions", id: "deals" },
  { label: "Contact Us", id: "contact" },
];

function Wordmark() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5 transition-opacity duration-200 hover:opacity-80">
      <img
        src="/g-hub%20logo.png"
        alt="Galaxy Hub"
        className="block h-9 w-auto select-none object-contain sm:h-10"
      />
    </Link>
  );
}

/* ─── Full-screen search overlay ─── */
function SearchOverlay({
  open,
  onClose,
  searchInputRef,
  searchQuery,
  onSubmit,
  onSuggestion,
  suggestedSearches,
}: {
  open: boolean;
  onClose: () => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  searchQuery: string;
  onSubmit: (e: React.FormEvent) => void;
  onSuggestion: (q: string) => void;
  suggestedSearches: string[];
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[200] flex flex-col bg-ivory/95 backdrop-blur-2xl"
        >
          {/* Top bar */}
          <div className="flex items-center gap-4 px-5 py-4 border-b border-ocean/[0.06] sm:px-8">
            <Search className="h-5 w-5 shrink-0 text-ocean/50" />
            <form onSubmit={onSubmit} className="flex-1">
              <input
                ref={searchInputRef}
                type="text"
                defaultValue={searchQuery}
                placeholder="Search phones, laptops, accessories…"
                className="w-full border-none bg-transparent text-base font-medium text-ocean-deeper placeholder:text-ocean/30 focus:outline-none"
                autoComplete="off"
              />
            </form>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn border border-ocean/10 text-ocean/50 transition-all hover:border-ocean/20 hover:bg-ocean/[0.04] hover:text-ocean cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Suggestions */}
          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
            <p className="mb-3 text-caption font-bold uppercase tracking-[0.18em] text-ocean/35">
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedSearches.map((chip) => (
                <button
                  key={chip}
                  onClick={() => onSuggestion(chip)}
                  className="flex items-center gap-1.5 rounded-btn border border-ocean/10 bg-white px-4 py-2 text-sm font-semibold text-ocean-deeper/70 transition-all duration-200 hover:border-ocean/25 hover:text-ocean hover:bg-ocean/[0.03] cursor-pointer"
                >
                  {chip}
                  <ArrowRight className="h-3 w-3 opacity-40" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Desktop cart dropdown ─── */
function CartDropdown({
  open,
  onClose,
  cart,
}: {
  open: boolean;
  onClose: () => void;
  cart: ReturnType<typeof useSupabaseCart>;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick, true);
    return () => document.removeEventListener("mousedown", handleClick, true);
  }, [open, onClose]);

  const cartItems = cart.items;
  const total = cart.subtotal;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute right-0 top-full z-50 mt-3 w-[360px] overflow-hidden rounded-card border border-ocean/[0.06] bg-ivory/95 backdrop-blur-xl shadow-premium-lg hidden sm:block"
        >
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-card bg-ocean/[0.04]">
                <ShoppingCart className="h-7 w-7 text-ocean/20" />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-ocean-deeper">Your cart is empty</p>
                <p className="mt-1.5 text-xs text-ocean/45 leading-relaxed">Browse our products and add items you love.</p>
              </div>
              <Link
                href="/products"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-btn bg-ocean-deeper px-7 h-10 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-btn transition-all duration-300 hover:bg-ocean-dark hover:shadow-btn-hover hover:-translate-y-0.5"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-ocean/[0.06] px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-bold text-ocean-deeper">Cart</span>
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-btn bg-ocean/[0.08] px-1.5 text-caption font-bold text-ocean">
                    {cart.count}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => { cart.clear(); onClose(); }}
                  className="rounded-btn px-2.5 py-1 text-caption font-semibold text-red-400 transition-all duration-200 hover:text-red-500 hover:bg-red-50 cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              {/* Items */}
              <div className="max-h-[300px] space-y-1 overflow-y-auto px-3 py-3 no-scrollbar">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12, scale: 0.9 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="group/item flex items-center gap-3 rounded-btn px-2.5 py-2.5 transition-colors duration-200 hover:bg-ocean/[0.03]"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-btn bg-ivory-dark/50 border border-ocean/[0.04] flex items-center justify-center p-1">
                        <img
                          src={item.product!.main_image_url || ""}
                          alt={item.product!.name}
                          className="h-full w-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-body-sm font-semibold text-ocean-deeper">
                          {item.product!.name}
                          {item.variant && (
                            <span className="ml-1.5 inline-flex items-center rounded-full bg-ocean/[0.08] px-1.5 py-0.5 text-xs font-bold text-ocean align-middle">
                              {item.variant}
                            </span>
                          )}
                        </p>
                        <p className="text-xs font-medium text-ocean/45">
                          {item.quantity} × RWF {Number(item.product!.price).toLocaleString()}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => cart.remove(item.id)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-btn text-ocean/25 opacity-0 transition-all duration-200 hover:bg-red-50 hover:text-red-400 group-hover/item:opacity-100 cursor-pointer"
                        aria-label={`Remove ${item.product!.name} from cart`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Footer with total + CTAs */}
              <div className="border-t border-ocean/[0.06] px-5 py-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ocean/50">Subtotal</span>
                  <span className="font-display text-base font-bold text-ocean-deeper">
                    RWF {total.toLocaleString()}
                  </span>
                </div>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 rounded-btn border border-ocean/15 bg-white/60 w-full h-10 text-xs font-bold uppercase tracking-[0.12em] text-ocean-deeper transition-all duration-300 hover:border-ocean/30 hover:bg-white"
                >
                  View Full Cart
                </Link>
                <Link
                  href="/order"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 rounded-btn bg-ocean-deeper w-full h-11 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-btn transition-all duration-300 hover:bg-ocean-dark hover:shadow-btn-hover hover:-translate-y-0.5"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Order Now
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Mobile cart bottom sheet ─── */
function MobileCartSheet({
  open,
  onClose,
  cart,
}: {
  open: boolean;
  onClose: () => void;
  cart: ReturnType<typeof useSupabaseCart>;
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-ocean-deeper/30 backdrop-blur-sm sm:hidden"
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
            className="fixed bottom-0 inset-x-0 z-[81] rounded-t-[20px] bg-ivory/98 backdrop-blur-xl border-t border-ocean/[0.06] shadow-premium-lg sm:hidden"
            style={{ maxHeight: "70dvh" }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-ocean/15" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-ocean/[0.06]">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold text-ocean-deeper">Cart</span>
                {cart.count > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-btn bg-ocean/[0.08] px-1.5 text-caption font-bold text-ocean">
                    {cart.count}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close cart"
                className="flex h-8 w-8 items-center justify-center rounded-btn border border-ocean/10 text-ocean/40 hover:text-ocean transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto" style={{ maxHeight: "calc(70dvh - 120px)" }}>
              {cart.items.length === 0 ? (
                <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-card bg-ocean/[0.04]">
                    <ShoppingCart className="h-7 w-7 text-ocean/20" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold text-ocean-deeper">Your cart is empty</p>
                    <p className="mt-1.5 text-xs text-ocean/45 leading-relaxed">Browse products and add items you love.</p>
                  </div>
                  <Link
                    href="/products"
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-btn bg-ocean-deeper px-7 h-10 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-btn"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-1 px-3 py-3">
                  <AnimatePresence mode="popLayout">
                    {cart.items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-3 rounded-btn px-2.5 py-3"
                      >
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-btn bg-ivory-dark/50 border border-ocean/[0.04] flex items-center justify-center p-1.5">
                          <img
                            src={item.product!.main_image_url || ""}
                            alt={item.product!.name}
                            className="h-full w-full object-contain mix-blend-multiply"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-ocean-deeper">
                            {item.product!.name}
                          </p>
                          {item.variant && (
                            <p className="text-xs text-ocean/45 mt-0.5">{item.variant}</p>
                          )}
                          <p className="text-xs font-bold text-ocean mt-1">
                            {item.quantity} × RWF {Number(item.product!.price).toLocaleString()}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => cart.remove(item.id)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn text-ocean/25 transition-all hover:bg-red-50 hover:text-red-400 cursor-pointer"
                          aria-label={`Remove ${item.product!.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.items.length > 0 && (
              <div className="border-t border-ocean/[0.06] px-5 py-4 space-y-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-ocean/50">Subtotal</span>
                  <span className="font-display text-base font-bold text-ocean-deeper">
                    RWF {cart.subtotal.toLocaleString()}
                  </span>
                </div>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 rounded-btn border border-ocean/15 bg-white/60 w-full h-11 text-xs font-bold uppercase tracking-[0.12em] text-ocean-deeper transition-all duration-300 hover:border-ocean/30 hover:bg-white"
                >
                  View Full Cart
                </Link>
                <Link
                  href="/order"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 rounded-btn bg-ocean-deeper w-full h-12 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-btn"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Order Now
                </Link>
                {cart.count > 0 && (
                  <button
                    type="button"
                    onClick={() => { cart.clear(); onClose(); }}
                    className="w-full text-center text-xs font-semibold text-red-400 py-1 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    Clear cart
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Main Navbar ─── */
export function Navbar({ onSearchFocus }: NavbarProps) {
  const { searchQuery, setSearchQuery, setSelectedCategory, setSelectedBrand, setShowDealsOnly } = useApp();
  const cart = useSupabaseCart();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const { refresh: refreshCart } = cart;

  useEffect(() => { refreshCart(); }, [pathname, refreshCart]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSearchOpen(false); setMobileOpen(false); setCartOpen(false); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    setMobileOpen(false);
    if (id === "home") return;
    if (id === "products") return;
    if (id === "contact") return;
    if (pathname !== "/") return;
    e.preventDefault();
    if (id === "deals") {
      setShowDealsOnly(true);
      setSelectedCategory("All");
      setSelectedBrand("All");
    } else {
      setShowDealsOnly(false);
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const getHref = (id: string) => {
    if (id === "home") return "/";
    if (id === "products") return "/products";
    if (id === "contact") return "/contact";
    if (pathname === "/") return `#${id}`;
    return `/#${id}`;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = searchInputRef.current?.value?.trim();
    if (!val) return;
    setSearchQuery(val);
    setSearchOpen(false);
    if (pathname === "/") {
      const el = document.getElementById("products");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/search?q=${encodeURIComponent(val)}`);
    }
  };

  const handleSuggestedSearch = (query: string) => {
    setSearchQuery(query);
    setSearchOpen(false);
    if (pathname === "/") {
      const el = document.getElementById("products");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const suggestedSearches = ["iPhone 16", "Galaxy S25", "AirPods Pro", "MacBook Air", "Sony XM5", "DJI Mini"];

  const isActive = (linkId: string) => {
    if (linkId === "home") return pathname === "/";
    if (linkId === "products") return pathname === "/products";
    if (linkId === "categories") return pathname.startsWith("/products/") && pathname.length > "/products".length && !pathname.startsWith("/products?");
    if (linkId === "brands") return pathname.startsWith("/brands");
    if (linkId === "deals") return pathname.startsWith("/deals");
    if (linkId === "contact") return pathname === "/contact";
    return false;
  };

  return (
    <>
      {/* Full-screen search overlay */}
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        searchInputRef={searchInputRef}
        searchQuery={searchQuery}
        onSubmit={handleSearchSubmit}
        onSuggestion={handleSuggestedSearch}
        suggestedSearches={suggestedSearches}
      />

      {/* ── Floating navbar ── */}
      <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-5 sm:pt-4 pointer-events-none">
        <header
          className={cn(
            "w-full pointer-events-auto transition-all duration-300 rounded-2xl",
            "max-w-[1400px]",
            scrolled
              ? "bg-ivory/90 backdrop-blur-2xl border border-ocean/[0.10] shadow-[0_8px_32px_rgba(11,84,151,0.10)]"
              : "bg-ivory/70 backdrop-blur-xl border border-ocean/[0.05] shadow-[0_4px_20px_rgba(11,84,151,0.06)]"
          )}
        >
          <div className="flex h-[68px] items-center justify-between gap-4 px-4 sm:px-6">
            <Wordmark />

            {/* Desktop nav */}
            <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.id}
                  href={getHref(link.id)}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={cn(
                    "relative px-3.5 py-2 text-body-sm font-display font-bold tracking-tight transition-all duration-200 rounded-xl",
                    isActive(link.id)
                      ? "text-ocean bg-ocean/[0.08]"
                      : "text-ocean-deeper/65 hover:text-ocean hover:bg-ocean/[0.05]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Search */}
              <button
                type="button"
                onClick={() => { setSearchOpen(true); onSearchFocus?.(); setCartOpen(false); }}
                aria-label="Search"
                className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-transparent text-ocean-deeper/60 transition-all hover:border-ocean/[0.08] hover:bg-white/60 hover:text-ocean cursor-pointer"
              >
                <Search className="h-[16px] w-[16px]" />
              </button>

              {/* Cart — desktop dropdown + mobile sheet trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setCartOpen(v => !v); setSearchOpen(false); }}
                  aria-label={cart.count > 0 ? `Cart (${cart.count} items)` : "Cart is empty"}
                  className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-transparent text-ocean-deeper/60 transition-all hover:border-ocean/[0.08] hover:bg-white/60 hover:text-ocean cursor-pointer"
                >
                  <ShoppingCart className="h-[16px] w-[16px]" />
                  <AnimatePresence mode="popLayout">
                    {cart.count > 0 && (
                      <motion.span
                        key={cart.count}
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 600, damping: 14 }}
                        className="absolute -right-0.5 -top-0.5 inline-flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-ocean px-1 text-xs font-bold text-white shadow-sm"
                      >
                        {cart.count}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                {/* Desktop-only dropdown */}
                <CartDropdown open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} />
              </div>

              {/* Order Now — hidden on small screens */}
              <Link
                href="/order"
                className="ml-1 hidden items-center gap-2 rounded-xl bg-ocean-deeper px-5 h-10 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-btn transition-all duration-300 hover:bg-ocean-dark hover:shadow-btn-hover hover:-translate-y-0.5 active:translate-y-0 sm:inline-flex"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Order Now
              </Link>

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => { setMobileOpen(true); setCartOpen(false); }}
                aria-label="Open menu"
                className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-transparent text-ocean-deeper/60 transition-all hover:border-ocean/[0.08] hover:bg-white/60 hover:text-ocean cursor-pointer lg:hidden"
              >
                <Menu className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile cart bottom sheet */}
      <MobileCartSheet open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} />

      {/* Mobile menu panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-ocean-deeper/15 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-x-3 top-3 z-[61] overflow-hidden rounded-2xl border border-ocean/[0.06] bg-ivory/95 backdrop-blur-xl shadow-premium-lg lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-ocean/[0.06] px-5 py-4">
                <Wordmark />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-ocean/10 text-ocean/40 hover:text-ocean transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="flex flex-col gap-0.5 px-3 py-3" aria-label="Mobile navigation">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.id}
                    href={getHref(link.id)}
                    onClick={(e) => handleNavClick(e, link.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-4 py-3.5 text-body font-display font-bold text-ocean-deeper/75 transition-all duration-200 hover:bg-ocean/[0.04] hover:text-ocean",
                      isActive(link.id) && "text-ocean bg-ocean/[0.08]"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile cart preview */}
              {cart.count > 0 && (
                <div className="border-t border-ocean/[0.06] px-5 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart className="h-3.5 w-3.5 text-ocean/40" />
                    <span className="text-xs font-semibold text-ocean/50">{cart.count} item{cart.count !== 1 ? "s" : ""} in cart</span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {cart.items.slice(0, 4).map((item) => (
                      <div key={item.id} className="h-10 w-10 shrink-0 overflow-hidden rounded-btn bg-ivory-dark/50 border border-ocean/[0.04] flex items-center justify-center p-1">
                        <img src={item.product!.main_image_url || ""} alt={item.product!.name} className="h-full w-full object-contain mix-blend-multiply" />
                      </div>
                    ))}
                    {cart.items.length > 4 && (
                      <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-btn bg-ocean/[0.04] text-caption font-bold text-ocean/40">
                        +{cart.items.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2.5 border-t border-ocean/[0.06] px-4 py-4">
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); setCartOpen(true); }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-ocean/15 bg-white/60 h-11 px-4 text-xs font-bold uppercase tracking-[0.12em] text-ocean-deeper hover:border-ocean/30 hover:bg-white transition-all cursor-pointer"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Cart {cart.count > 0 && `(${cart.count})`}
                </button>
                <Link
                  href="/order"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 flex-1 rounded-xl bg-ocean-deeper h-11 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-btn transition-all duration-300 hover:bg-ocean-dark"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Order Now
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
