"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { PRODUCTS, Product } from "@/data/mock-data";

export interface CartProductMeta {
  id: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  slug?: string;
}

interface AppContextType {
  cart: string[];
  wishlist: string[];
  searchQuery: string;
  selectedCategory: string;
  selectedBrand: string;
  showDealsOnly: boolean;
  productsMap: Record<string, CartProductMeta>;
  addToCart: (id: string, productData?: CartProductMeta) => void;
  removeFromCart: (id: string) => void;
  toggleWishlist: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedBrand: (brand: string) => void;
  setShowDealsOnly: (show: boolean) => void;
  registerProducts: (products: CartProductMeta[]) => void;
  clearCart: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function getInitialProductsMap(): Record<string, CartProductMeta> {
  const map: Record<string, CartProductMeta> = {};
  for (const p of PRODUCTS) {
    map[p.id] = {
      id: p.id,
      title: p.title,
      price: p.price,
      currency: p.currency || "RWF",
      image: p.image,
      slug: p.slug,
    };
  }
  if (typeof window !== "undefined") {
    try {
      const savedMeta = localStorage.getItem("gh-cart-meta");
      if (savedMeta) {
        const parsed = JSON.parse(savedMeta) as Record<string, CartProductMeta>;
        Object.assign(map, parsed);
      }
    } catch (e) {
      console.error("Failed to load cart meta from localStorage:", e);
    }
  }
  return map;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [showDealsOnly, setShowDealsOnly] = useState(false);
  const [productsMap, setProductsMap] = useState<Record<string, CartProductMeta>>(() => getInitialProductsMap());

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedCart = localStorage.getItem("gh-cart");
        const savedWishlist = localStorage.getItem("gh-wishlist");
        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to load cart/wishlist from localStorage:", e);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const registerProducts = useCallback((productsList: CartProductMeta[]) => {
    setProductsMap((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const p of productsList) {
        if (!p || !p.id) continue;
        if (!next[p.id] || next[p.id].title !== p.title || next[p.id].price !== p.price) {
          next[p.id] = p;
          changed = true;
        }
      }
      if (changed) {
        try {
          localStorage.setItem("gh-cart-meta", JSON.stringify(next));
        } catch (e) {
          console.error("Failed to save cart meta:", e);
        }
        return next;
      }
      return prev;
    });
  }, []);

  const addToCart = (id: string, productData?: CartProductMeta) => {
    if (productData) {
      setProductsMap((prev) => {
        const updated = { ...prev, [id]: productData };
        try {
          localStorage.setItem("gh-cart-meta", JSON.stringify(updated));
        } catch (e) {
          console.error("Failed to save cart meta:", e);
        }
        return updated;
      });
    }

    setCart((prev) => {
      if (prev.includes(id)) return prev; // Deduplicate: do not add duplicate IDs
      const updated = [...prev, id];
      localStorage.setItem("gh-cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const updated = prev.filter((itemId) => itemId !== id);
      localStorage.setItem("gh-cart", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      let updated;
      if (prev.includes(id)) {
        updated = prev.filter((item) => item !== id);
      } else {
        updated = [...prev, id];
      }
      localStorage.setItem("gh-wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("gh-cart");
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        wishlist,
        searchQuery,
        selectedCategory,
        selectedBrand,
        showDealsOnly,
        productsMap,
        addToCart,
        removeFromCart,
        toggleWishlist,
        setSearchQuery,
        setSelectedCategory,
        setSelectedBrand,
        setShowDealsOnly,
        registerProducts,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
