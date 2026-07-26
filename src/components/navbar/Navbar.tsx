"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { PRODUCTS } from "@/data/mock-data";

interface NavbarProps {
  onSearchFocus?: () => void;
}

const NAV_LINKS = [
  { label: "Home", id: "home" },
  { label: "Products", id: "products" },
  { label: "Categories", id: "categories" },
  { label: "Brands", id: "brands" },
  { label: "Promotions", id: "deals" },
  { label: "About", id: "about" },
];

function Wordmark({ large }: { large?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5 transition-opacity duration-200 hover:opacity-80">
      <img
        src="/g-hub%20logo.png"
        alt="Galaxy Hub"
        className={cn("block w-auto select-none object-contain transition-all duration-300", large ? "h-11" : "h-8")}
      />
    </Link>
  );
}

function CartDropdown({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { cart, clearCart } = useApp();
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

  const cartItems = PRODUCTS.filter((p) => cart.includes(p.id));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.96 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute right-0 top-full z-50 mt-2 w-[320px] overflow-hidden rounded-2xl border border-black/[0.06] bg-[#FFFEF9] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12)]"
        >
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
              <ShoppingCart className="h-10 w-10 text-ocean/15" />
              <div>
                <p className="text-sm font-semibold text-ocean-deeper">Your cart is empty</p>
                <p className="mt-1 text-xs text-ocean/50">Browse our products and add items you love.</p>
              </div>
              <Link
                href="/"
                onClick={onClose}
                className="mt-1 rounded-full bg-ocean px-5 py-2 text-xs font-semibold text-white transition-all duration-200 hover:bg-ocean-dark hover:-translate-y-[1px]"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-3">
                <span className="text-xs font-semibold text-ocean/60">
                  {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
                </span>
                <button
                  type="button"
                  onClick={() => { clearCart(); onClose(); }}
                  className="text-[10px] font-semibold text-red-400 transition-colors hover:text-red-500 cursor-pointer"
                >
                  Clear cart
                </button>
              </div>
              <div className="max-h-[280px] space-y-1 overflow-y-auto px-3 py-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-ocean/4"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-ivory-dark">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ocean-deeper">
                        {item.title}
                      </p>
                      <p className="text-xs font-medium text-ocean/50">
                        FRw {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-black/[0.06] px-5 py-3">
                <Link
                  href="/order"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 rounded-full bg-ocean px-5 py-2.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-ocean-dark hover:-translate-y-[1px]"
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

export function Navbar({ onSearchFocus }: NavbarProps) {
  const { cart, searchQuery, setSearchQuery, setSelectedCategory, setSelectedBrand, setShowDealsOnly } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

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
      const t = setTimeout(() => searchInputRef.current?.focus(), 100);
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
    if (pathname !== "/") return;
    e.preventDefault();
    if (id === "deals") {
      setShowDealsOnly(true);
      setSelectedCategory("All");
      setSelectedBrand("All");
    } else {
      setShowDealsOnly(false);
    }
    const targetId = id === "deals" ? "products" : id;
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const getHref = (id: string) => {
    if (id === "home") return "/";
    if (pathname === "/") return `#${id}`;
    if (id === "about") return "/";
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
    return false;
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#FFFEF9]/90 backdrop-blur-lg border-b border-black/[0.06] shadow-[0_1px_0_rgba(0,0,0,0.02)]"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div
          className={cn(
            "mx-auto flex items-center justify-between gap-6 px-6 sm:px-10 transition-all duration-300",
            scrolled ? "h-14" : "h-24"
          )}
          style={{ maxWidth: "1440px" }}
        >
          <Wordmark large={!scrolled} />

          {searchOpen ? (
            <div className="flex flex-1 items-center gap-2 px-2">
              <Search className="h-4 w-4 shrink-0 text-ocean/40" />
              <form onSubmit={handleSearchSubmit} className="flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  defaultValue={searchQuery}
                  placeholder="Search phones, laptops..."
                  className="w-full border-none bg-transparent text-sm font-medium text-ocean-deeper placeholder:text-ocean/25 focus:outline-none"
                />
              </form>
              <div className="hidden items-center gap-1 sm:flex">
                {suggestedSearches.slice(0, 3).map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSuggestedSearch(chip)}
                    className="rounded-full border border-black/[0.06] px-2.5 py-1 text-[10px] font-semibold text-ocean/50 transition-colors hover:border-ocean/20 hover:text-ocean cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-ocean/50 transition-colors hover:bg-ocean/8 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.id}
                  href={getHref(link.id)}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium tracking-tight transition-colors duration-200 rounded-full",
                    isActive(link.id)
                      ? "text-ocean bg-ocean/6"
                      : "text-ocean/55 hover:text-ocean hover:bg-ocean/4"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => { setSearchOpen(v => !v); onSearchFocus?.(); setCartOpen(false); }}
              aria-label="Search"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ocean/50 transition-colors duration-200 hover:bg-ocean/6 cursor-pointer"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => { setCartOpen(v => !v); setSearchOpen(false); }}
                aria-label={cart.length > 0 ? `Cart (${cart.length} items)` : "Cart is empty"}
                title={cart.length > 0 ? `${cart.length} item${cart.length !== 1 ? "s" : ""} in cart` : "Cart is empty"}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-ocean/50 transition-colors duration-200 hover:bg-ocean/6 cursor-pointer"
              >
                <ShoppingCart className="h-[18px] w-[18px]" />
                <AnimatePresence mode="popLayout">
                  {cart.length > 0 && (
                    <motion.span
                      key={cart.length}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 600, damping: 14 }}
                      className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-ocean px-1 text-[9px] font-bold text-white"
                    >
                      {cart.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <CartDropdown open={cartOpen} onClose={() => setCartOpen(false)} />
            </div>

            <Link
              href="/order"
              className="ml-1 hidden items-center gap-1.5 rounded-full bg-gradient-to-b from-ocean to-ocean-dark px-5 py-2 text-[13px] font-bold text-white transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_8px_20px_rgba(11,84,151,0.25)] active:translate-y-0 sm:inline-flex"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Order Now
            </Link>

            <button
              type="button"
              onClick={() => { setMobileOpen(true); setCartOpen(false); }}
              aria-label="Open menu"
              className="ml-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full text-ocean/50 transition-colors duration-200 hover:bg-ocean/6 lg:hidden cursor-pointer"
            >
              <Menu className="h-[19px] w-[19px]" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-x-3 top-3 z-[61] overflow-hidden rounded-2xl border border-black/[0.06] bg-[#FFFEF9] shadow-xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4">
                <Wordmark />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ocean/50 hover:bg-ocean/6 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-0.5 px-3 py-3" aria-label="Mobile navigation">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.id}
                    href={getHref(link.id)}
                    onClick={(e) => handleNavClick(e, link.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-4 py-3.5 text-base font-medium text-ocean/55 transition-colors duration-150 hover:bg-ocean/5 hover:text-ocean",
                      isActive(link.id) && "text-ocean"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center gap-3 border-t border-black/[0.06] px-5 py-4">
                <Link
                  href="/order"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 flex-1 rounded-full bg-gradient-to-b from-ocean to-ocean-dark px-5 py-3 text-center text-base font-bold text-white transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_8px_20px_rgba(11,84,151,0.25)]"
                >
                  <ShoppingCart className="h-4 w-4" />
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
