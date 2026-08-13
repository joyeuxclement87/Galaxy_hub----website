"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingCart, X, Trash2, ArrowRight, Loader2, PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { useSupabaseCart } from "@/hooks/use-cart";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/data/mock-data";

interface NavbarProps {
  onSearchFocus?: () => void;
}

interface SearchResultItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  old_price: number | null;
  rating: number | null;
  review_count: number | null;
  main_image_url: string | null;
  stock_status: string;
  short_description: string | null;
  category_name: string | null;
  brand_name: string | null;
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
        className="block h-8 w-auto select-none object-contain sm:h-9"
      />
    </Link>
  );
}

function buildSearchCardProduct(result: SearchResultItem): Product {
  const availability: Product["availability"] = result.stock_status === "available"
    ? "In Stock"
    : result.stock_status === "limited"
      ? "Limited Stock"
      : "Out of Stock";

  return {
    id: result.id,
    slug: result.slug,
    title: result.name,
    tagline: result.short_description || "",
    description: "",
    price: result.price,
    originalPrice: result.old_price || undefined,
    currency: "RWF",
    category: result.category_name || "",
    brand: result.brand_name || "",
    image: result.main_image_url || "",
    featured: false,
    specifications: {},
    availability,
    badge: undefined,
    rating: result.rating ?? 4.8,
    reviewCount: result.review_count ?? 32,
  };
}

/* ─── Full-screen search overlay ─── */
function SearchOverlay({
  open,
  onClose,
  searchInputRef,
  searchInputValue,
  onSearchInputChange,
  onSubmit,
  onSuggestion,
  suggestedSearches,
  searchResults,
  isSearching,
  hasSearched,
}: {
  open: boolean;
  onClose: () => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  searchInputValue: string;
  onSearchInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSuggestion: (q: string) => void;
  suggestedSearches: string[];
  searchResults: SearchResultItem[];
  isSearching: boolean;
  hasSearched: boolean;
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
                value={searchInputValue}
                onChange={(e) => onSearchInputChange(e.target.value)}
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

          {/* Suggestions / results */}
          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
            {searchInputValue.trim() ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-caption font-bold uppercase tracking-[0.18em] text-ocean/35">
                    Search Results
                  </p>
                  <div className="text-sm font-semibold text-ocean/55">
                    {isSearching ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Searching…
                      </span>
                    ) : (
                      <span>{searchResults.length} result{searchResults.length === 1 ? "" : "s"}</span>
                    )}
                  </div>
                </div>

                {isSearching ? (
                  <div className="rounded-card border border-ocean/[0.08] bg-white/70 p-6 text-center text-sm font-medium text-ocean/60 shadow-sm">
                    Looking up matching products…
                  </div>
                ) : hasSearched && searchResults.length === 0 ? (
                  <div className="rounded-card border border-ocean/[0.08] bg-white/70 p-8 text-center shadow-sm">
                    <PackageOpen className="mx-auto mb-3 h-10 w-10 text-ocean/35" />
                    <p className="font-display text-base font-bold text-ocean-deeper">No matching products found</p>
                    <p className="mt-2 text-sm text-ocean/55">Try another keyword or browse the popular searches below.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {searchResults.map((result) => (
                      <ProductCard
                        key={result.id}
                        product={buildSearchCardProduct(result)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
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
            )}
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
                className="inline-flex items-center justify-center rounded-btn bg-ocean-deeper px-6 h-11 text-sm font-bold text-white shadow-btn transition-all duration-250 hover:bg-ocean-dark hover:shadow-btn-hover"
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
                        <p className="truncate text-sm font-semibold text-ocean-deeper">
                          {item.product!.name}
                          {item.variant && (
                            <span className="ml-1.5 inline-flex items-center rounded-full bg-ocean/[0.08] px-1.5 py-0.5 text-caption font-bold text-ocean align-middle">
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
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-btn text-ocean/25 opacity-0 transition-all duration-200 hover:bg-red-50 hover:text-red-400 group-hover/item:opacity-100 cursor-pointer"
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
                  className="flex items-center justify-center gap-2 rounded-btn border border-ocean/15 bg-white/60 w-full h-11 text-sm font-bold text-ocean-deeper transition-all duration-250 hover:border-ocean/30 hover:bg-white"
                >
                  View Full Cart
                </Link>
                <Link
                  href="/order"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 rounded-btn bg-ocean-deeper w-full h-11 text-sm font-bold text-white shadow-btn transition-all duration-250 hover:bg-ocean-dark hover:shadow-btn-hover"
                >
                  <ShoppingCart className="h-4 w-4" />
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
            className="fixed bottom-0 inset-x-0 z-[81] flex flex-col rounded-t-[20px] bg-ivory/98 backdrop-blur-xl border-t border-ocean/[0.06] shadow-premium-lg sm:hidden overflow-hidden"
            style={{ maxHeight: "70dvh" }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="h-1 w-10 rounded-full bg-ocean/15" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-ocean/[0.06] shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold text-ocean-deeper">Cart</span>
                {cart.count > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-btn bg-ocean/[0.08] px-1.5 text-caption font-bold text-ocean">
                    {cart.count}
                  </span>
                )}
              </div>
           {/* Close button */}
           <button
             type="button"
             onClick={onClose}
             aria-label="Close search"
             className="flex h-10 w-10 items-center justify-center rounded-btn border border-ocean/10 text-ocean/50 hover:text-ocean transition-all hover:bg-ocean/[0.04] cursor-pointer"
           >
             <X className="h-5 w-5" />
           </button>
            </div>

            {/* Content */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              {cart.items.length === 0 ? (
                <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-card bg-ocean/[0.04]">
                    <ShoppingCart className="h-6 w-6 text-ocean/20" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold text-ocean-deeper">Your cart is empty</p>
                    <p className="mt-1.5 text-xs text-ocean/45 leading-relaxed">Browse products and add items you love.</p>
                  </div>
                  <Link
                    href="/products"
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-btn bg-ocean-deeper px-6 h-11 text-sm font-bold text-white shadow-btn transition-all duration-250 hover:bg-ocean-dark hover:shadow-btn-hover"
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
                        className="flex items-center gap-3 rounded-btn px-2 py-3"
                      >
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-btn bg-ivory-dark/50 border border-ocean/[0.04] flex items-center justify-center p-1.5">
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
                          <p className="text-caption font-bold text-ocean mt-1">
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
              <div className="border-t border-ocean/[0.06] px-5 py-4 space-y-2.5 shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-ocean/50">Subtotal</span>
                  <span className="font-display text-base font-bold text-ocean-deeper">
                    RWF {cart.subtotal.toLocaleString()}
                  </span>
                </div>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 rounded-btn border border-ocean/15 bg-white/60 w-full h-11 text-sm font-bold text-ocean-deeper transition-all duration-250 hover:border-ocean/30 hover:bg-white"
                >
                  View Full Cart
                </Link>
                <Link
                  href="/order"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 rounded-btn bg-ocean-deeper w-full h-11 text-sm font-bold text-white shadow-btn transition-all duration-250 hover:bg-ocean-dark hover:shadow-btn-hover"
                >
                  <ShoppingCart className="h-4 w-4" />
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
  const [searchInputValue, setSearchInputValue] = useState(searchQuery);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchRequestRef = useRef(0);
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
    if (!searchOpen) {
      return;
    }

    const trimmed = searchInputValue.trim();
    if (!trimmed) {
      const clearTimeoutId = window.setTimeout(() => {
        setSearchResults([]);
        setHasSearched(false);
        setIsSearching(false);
      }, 0);

      return () => window.clearTimeout(clearTimeoutId);
    }

    const requestId = ++searchRequestRef.current;

    const timeout = window.setTimeout(async () => {
      setHasSearched(true);
      setIsSearching(true);

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        if (requestId === searchRequestRef.current) {
          setSearchResults(data.results || []);
        }
      } catch {
        if (requestId === searchRequestRef.current) {
          setSearchResults([]);
        }
      } finally {
        if (requestId === searchRequestRef.current) {
          setIsSearching(false);
        }
      }
    }, 220);

    return () => window.clearTimeout(timeout);
  }, [searchInputValue, searchOpen]);

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchInputValue("");
    setSearchQuery("");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (searchOpen) handleSearchClose();
        setMobileOpen(false);
        setCartOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

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
    const val = searchInputValue.trim();
    if (!val) return;
    setSearchQuery(val);
    setSearchInputValue(val);
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
    setSearchInputValue(query);
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
        onClose={handleSearchClose}
        searchInputRef={searchInputRef}
        searchInputValue={searchInputValue}
        onSearchInputChange={setSearchInputValue}
        onSubmit={handleSearchSubmit}
        onSuggestion={handleSuggestedSearch}
        suggestedSearches={suggestedSearches}
        searchResults={searchResults}
        isSearching={isSearching}
        hasSearched={hasSearched}
      />

      {/* ── Floating navbar ── */}
      <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-5 sm:pt-4 pointer-events-none">
        <header
          className={cn(
            "w-full pointer-events-auto transition-all duration-[250ms] rounded-2xl max-w-[1400px]",
            scrolled ? "nav-scrolled-surface" : "nav-top-surface"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between gap-4 px-4 sm:px-6 transition-all duration-[250ms]",
              scrolled ? "h-[58px]" : "h-[68px]"
            )}
          >
            <Wordmark />

            {/* Desktop nav */}
            <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.id}
                  href={getHref(link.id)}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={cn(
                    "relative px-3.5 py-1.5 text-[13.5px] font-display font-bold tracking-tight transition-all duration-[160ms] rounded-full",
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
            <div className="flex items-center gap-0.5 sm:gap-1.5">
              {/* Search */}
              <button
                type="button"
                onClick={() => { setSearchInputValue(searchQuery); setSearchOpen(true); onSearchFocus?.(); setCartOpen(false); }}
                aria-label="Search"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-ocean-deeper/55 transition-all duration-[160ms] hover:border-ocean/[0.10] hover:bg-ocean/[0.06] hover:text-ocean cursor-pointer"
              >
                <Search className="h-[17px] w-[17px]" />
              </button>

              {/* Cart */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setCartOpen(v => !v); setSearchOpen(false); }}
                  aria-label={cart.count > 0 ? `Cart (${cart.count} items)` : "Cart is empty"}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-ocean-deeper/55 transition-all duration-[160ms] hover:border-ocean/[0.10] hover:bg-ocean/[0.06] hover:text-ocean cursor-pointer"
                >
                  <ShoppingCart className="h-[17px] w-[17px]" />
                  <AnimatePresence mode="popLayout">
                    {cart.count > 0 && (
                      <motion.span
                        key={cart.count}
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 600, damping: 14 }}
                        className="absolute -right-0.5 -top-0.5 inline-flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-ocean px-1 text-[10px] font-bold text-white shadow-sm"
                      >
                        {cart.count}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                <CartDropdown open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} />
              </div>

              {/* Order Now — hidden on mobile */}
              <Link
                href="/order"
                className="ml-1.5 hidden h-[38px] items-center gap-1.5 rounded-[13px] bg-gradient-to-b from-ocean to-ocean-dark px-5 text-[13.5px] font-bold text-white shadow-btn transition-all duration-[200ms] hover:-translate-y-[1px] hover:brightness-[1.06] hover:shadow-[0_10px_24px_rgba(11,84,151,0.22)] sm:inline-flex"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Order Now
              </Link>

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => { setMobileOpen(true); setCartOpen(false); }}
                aria-label="Open menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-ocean-deeper/55 transition-all duration-[160ms] hover:border-ocean/[0.10] hover:bg-ocean/[0.06] hover:text-ocean cursor-pointer lg:hidden"
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
          className="fixed inset-x-2 top-2 z-[61] overflow-hidden rounded-2xl border border-ocean/[0.06] bg-ivory/95 backdrop-blur-xl shadow-premium-lg lg:hidden"
        >
           <div className="flex items-center justify-between px-3 py-2 border-b border-ocean/[0.06]">
             <Wordmark />
             <button
               type="button"
               onClick={() => setMobileOpen(false)}
               aria-label="Close menu"
               className="flex h-9 w-9 items-center justify-center rounded-btn border border-ocean/10 text-ocean/40 hover:text-ocean transition-colors cursor-pointer"
             >
               <X className="h-4 w-4" />
             </button>
           </div>
          <nav className="flex flex-col gap-0.5 px-2 py-2" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.id}
                href={getHref(link.id)}
                onClick={(e) => handleNavClick(e, link.id)}
                className={cn(
                  "flex items-center gap-2 rounded-btn px-4 py-3 text-sm font-display font-bold text-ocean-deeper/75 transition-all duration-250 hover:bg-ocean/[0.04] hover:text-ocean",
                  isActive(link.id) && "text-ocean bg-ocean/[0.08]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile cart + order buttons */}
          <div className="flex items-center gap-2.5 border-t border-ocean/[0.06] px-3 py-3">
            <button
              type="button"
              onClick={() => { setMobileOpen(false); setCartOpen(true); }}
              className="flex items-center justify-center gap-1.5 rounded-btn border border-ocean/15 bg-white/60 h-11 px-4 text-sm font-bold text-ocean-deeper hover:border-ocean/30 hover:bg-white transition-all cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart {cart.count > 0 && `(${cart.count})`}
            </button>
            <Link
              href="/order"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 flex-1 rounded-btn bg-ocean-deeper h-11 text-sm font-bold text-white shadow-btn transition-all duration-250 hover:bg-ocean-dark"
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
