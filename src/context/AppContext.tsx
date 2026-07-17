"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AppContextType {
  cart: string[];
  wishlist: string[];
  searchQuery: string;
  selectedCategory: string;
  selectedBrand: string;
  showDealsOnly: boolean;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  toggleWishlist: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedBrand: (brand: string) => void;
  setShowDealsOnly: (show: boolean) => void;
  clearCart: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [showDealsOnly, setShowDealsOnly] = useState(false);

  // Load from localStorage on mount (client-side only)
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

  const addToCart = (id: string) => {
    setCart((prev) => {
      const updated = [...prev, id];
      localStorage.setItem("gh-cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const index = prev.indexOf(id);
      if (index > -1) {
        const updated = [...prev];
        updated.splice(index, 1);
        localStorage.setItem("gh-cart", JSON.stringify(updated));
        return updated;
      }
      return prev;
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
        addToCart,
        removeFromCart,
        toggleWishlist,
        setSearchQuery,
        setSelectedCategory,
        setSelectedBrand,
        setShowDealsOnly,
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
