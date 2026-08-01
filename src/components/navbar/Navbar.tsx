"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingCart, X, Trash2 } from "lucide-react";
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
  { label: "Contact Us", id: "faq" },
];

function Wordmark() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5 transition-opacity duration-200 hover:opacity-80">
      <img
        src="/g-hub%20logo.png"
        alt="Galaxy Hub"
        className="block h-8 w-auto select-none object-contain sm:h-9"
      />
    </Link>
  );
}

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
          className="absolute right-0 top-full z-50 mt-3 w-[360px] overflow-hidden rounded-card border border-ocean/[0.06] bg-ivory/95 backdrop-blur-xl shadow-premium-lg"
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
                className="inline-flex items-center justify-center rounded-btn bg-ocean-deeper px-7 h-10 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-btn transition-all duration-300 hover:bg-ocean-dark hover:shadow-btn-hover hover:-translate-y-0.5"
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
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-btn bg-ocean/[0.08] px-1.5 text-[10px] font-bold text-ocean">
                    {cart.count}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => { cart.clear(); onClose(); }}
                  className="rounded-btn px-2.5 py-1 text-[10px] font-semibold text-red-400 transition-all duration-200 hover:text-red-500 hover:bg-red-50 cursor-pointer"
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
                        <p className="truncate text-[13px] font-semibold text-ocean-deeper">
                          {item.product!.name}
                          {item.variant && (
                            <span className="ml-1.5 inline-flex items-center rounded-full bg-ocean/[0.08] px-1.5 py-0.5 text-[9px] font-bold text-ocean align-middle">
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
                  className="flex items-center justify-center gap-2 rounded-btn border border-ocean/15 bg-white/60 w-full h-10 text-[11px] font-bold uppercase tracking-[0.12em] text-ocean-deeper transition-all duration-300 hover:border-ocean/30 hover:bg-white"
                >
                  View Full Cart
                </Link>
                <Link
                  href="/order"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 rounded-btn bg-ocean-deeper w-full h-11 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-btn transition-all duration-300 hover:bg-ocean-dark hover:shadow-btn-hover hover:-translate-y-0.5"
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

  useEffect(() => {
    refreshCart();
  }, [pathname, refreshCart]);

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
    if (id === "products") return;
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
    if (id === "products") return "/products";
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
    return false;
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-ivory/85 backdrop-blur-xl border-b border-ocean/[0.08] shadow-sm"
            : "bg-ivory/40 backdrop-blur-md border-b border-ocean/[0.03]"
        )}
      >
        <div
          className="mx-auto flex h-16 items-center justify-between gap-6 px-6 sm:px-10 lg:px-16"
          style={{ maxWidth: "1440px" }}
        >
          <Wordmark />

          {searchOpen ? (
            <div className="flex flex-1 items-center gap-3 rounded-btn border border-ocean/15 bg-white/90 backdrop-blur-md px-4 py-2 mx-2 shadow-sm">
              <Search className="h-4 w-4 shrink-0 text-ocean" />
              <form onSubmit={handleSearchSubmit} className="flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  defaultValue={searchQuery}
                  placeholder="Search phones, laptops..."
                  className="w-full border-none bg-transparent text-sm font-medium text-ocean-deeper placeholder:text-ocean/35 focus:outline-none font-manrope"
                />
              </form>
              <div className="hidden items-center gap-1.5 sm:flex">
                {suggestedSearches.slice(0, 3).map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSuggestedSearch(chip)}
                    className="rounded-btn border border-ocean/10 bg-ivory/80 px-2.5 py-1 text-[10px] font-bold text-ocean-deeper/70 transition-all duration-200 hover:border-ocean/25 hover:text-ocean hover:bg-white cursor-pointer font-manrope"
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <Button
                variant="icon"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="h-8 w-8 rounded-btn"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.id}
                  href={getHref(link.id)}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={cn(
                    "relative px-4 py-2 text-sm font-display font-bold tracking-tight transition-all duration-200 rounded-btn",
                    isActive(link.id)
                      ? "text-ocean bg-ocean/[0.08] font-bold"
                      : "text-ocean-deeper/70 hover:text-ocean hover:bg-ocean/[0.05]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="icon"
              onClick={() => { setSearchOpen(v => !v); onSearchFocus?.(); setCartOpen(false); }}
              aria-label="Search"
              className="h-10 w-10 rounded-btn border border-transparent hover:border-ocean/[0.08] hover:bg-white/60"
            >
              <Search className="h-[18px] w-[18px]" />
            </Button>

            <div className="relative">
              <Button
                variant="icon"
                onClick={() => { setCartOpen(v => !v); setSearchOpen(false); }}
                aria-label={cart.count > 0 ? `Cart (${cart.count} items)` : "Cart is empty"}
                title={cart.count > 0 ? `${cart.count} item${cart.count !== 1 ? "s" : ""} in cart` : "Cart is empty"}
                className="relative h-10 w-10 rounded-btn border border-transparent hover:border-ocean/[0.08] hover:bg-white/60"
              >
                <ShoppingCart className="h-[18px] w-[18px]" />
                <AnimatePresence mode="popLayout">
                  {cart.count > 0 && (
                    <motion.span
                      key={cart.count}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 600, damping: 14 }}
                      className="absolute -right-0.5 -top-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-btn bg-ocean px-1 text-[9px] font-bold text-white shadow-sm"
                    >
                      {cart.count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
              <CartDropdown open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} />
            </div>

            <Link
              href="/order"
              className="ml-1.5 hidden items-center gap-2 rounded-btn bg-ocean-deeper px-7 h-10 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-btn transition-all duration-300 hover:bg-ocean-dark hover:shadow-btn-hover hover:-translate-y-0.5 active:translate-y-0 sm:inline-flex"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Order Now
            </Link>

            <Button
              variant="icon"
              onClick={() => { setMobileOpen(true); setCartOpen(false); }}
              aria-label="Open menu"
              className="lg:hidden h-10 w-10 rounded-btn"
            >
              <Menu className="h-[19px] w-[19px]" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
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
              className="fixed inset-x-3 top-3 z-[61] overflow-hidden rounded-card border border-ocean/[0.06] bg-ivory/95 backdrop-blur-xl shadow-premium-lg lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-ocean/[0.06] px-5 py-4">
                <Wordmark />
                <Button
                  variant="icon"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="h-10 w-10 rounded-btn"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex flex-col gap-1 px-3 py-3" aria-label="Mobile navigation">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.id}
                    href={getHref(link.id)}
                    onClick={(e) => handleNavClick(e, link.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-btn px-4 py-3.5 text-base font-display font-bold text-ocean-deeper/80 transition-all duration-200 hover:bg-ocean/[0.04] hover:text-ocean",
                      isActive(link.id) && "text-ocean bg-ocean/[0.08] font-bold"
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
                      <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-btn bg-ocean/[0.04] text-[10px] font-bold text-ocean/40">
                        +{cart.items.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 border-t border-ocean/[0.06] px-5 py-4">
                <Link
                  href="/order"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 flex-1 rounded-btn bg-ocean-deeper h-11 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-btn transition-all duration-300 hover:bg-ocean-dark hover:shadow-btn-hover hover:-translate-y-0.5"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Order Now
                  {cart.count > 0 && (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-btn bg-white/20 px-1 text-[9px] font-bold">
                      {cart.count}
                    </span>
                  )}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
