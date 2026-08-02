"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingCart, ChevronUp, ChevronDown } from "lucide-react";
import { StorageSelector } from "@/components/products/StorageSelector";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { cn } from "@/lib/utils";

/**
 * Floating bottom purchase bar shown only on mobile/tablet (hidden lg:).
 * Floats slightly above the bottom with rounded corners and elevated shadow.
 * Shows the product name, price, storage selector, and primary CTAs.
 */
export function MobileOrderBar({
  productName,
  productSlug,
  productId,
  price,
  currency,
  stockStatus,
  storageOptions,
}: {
  productName: string;
  productSlug: string;
  productId: string;
  price: number;
  currency: string;
  stockStatus: string;
  storageOptions: string[];
}) {
  const [storage, setStorage] = useState(storageOptions[0] || "");
  const [expanded, setExpanded] = useState(false);
  const isAvailable = stockStatus === "available";
  const formattedPrice = new Intl.NumberFormat("en-US").format(price);

  return (
    <div className="fixed bottom-4 inset-x-0 z-50 lg:hidden safe-bottom mx-3">
      <div className="rounded-2xl border border-ocean/10 bg-white/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(11,84,151,0.12)] overflow-hidden">
        {/* Expanded storage selector */}
        {expanded && storageOptions.length > 0 && (
          <div className="border-b border-ocean/8 px-4 py-3 bg-ivory/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ocean/50">Select Storage</span>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="flex h-6 w-6 items-center justify-center rounded-full text-ocean/30 hover:text-ocean/50"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
            </div>
            <StorageSelector options={storageOptions} value={storage} onChange={setStorage} />
          </div>
        )}

        {/* Main bar */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Product name + price + storage */}
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-ocean-deeper/50 truncate">
                {productName}
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-display text-2xl font-bold text-ocean-deeper leading-none">
                  {currency} {formattedPrice}
                </span>
              </div>
              {storageOptions.length > 0 && !expanded && (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="mt-1 flex items-center gap-1.5 rounded-full border border-ocean/15 bg-ocean/5 px-3 py-1.5 text-[11px] font-bold text-ocean-deeper hover:bg-ocean/10 transition-colors"
                >
                  <span className="text-ocean/40">Storage:</span>
                  <span>{storage || storageOptions[0]}</span>
                  <ChevronDown className="h-3 w-3 text-ocean/40" />
                </button>
              )}
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2 shrink-0">
              {isAvailable && (
                <AddToCartButton
                  productId={productId}
                  variant="secondary"
                  storage={storage || undefined}
                  showText={false}
                  className="h-11 w-11 !px-0 justify-center rounded-xl border-ocean/15 bg-white/70 backdrop-blur-sm"
                />
              )}
              <Link
                href={`/order?product=${productSlug}${storage ? `&storage=${encodeURIComponent(storage)}` : ""}`}
                className={cn(
                  "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-xs font-bold uppercase tracking-[0.1em] text-white shadow-btn transition-all duration-300 active:scale-[0.97]",
                  isAvailable
                    ? "bg-ocean-deeper hover:bg-ocean-dark hover:shadow-btn-hover"
                    : "bg-ocean/40 pointer-events-none"
                )}
              >
                {isAvailable ? "Order Now" : "Unavailable"}
                {isAvailable && <ArrowRight className="h-3.5 w-3.5" />}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
