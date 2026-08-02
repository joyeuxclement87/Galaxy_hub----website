"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingCart, ChevronUp } from "lucide-react";
import { StorageSelector } from "@/components/products/StorageSelector";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { cn } from "@/lib/utils";

/**
 * Sticky bottom purchase bar shown only on mobile/tablet (hidden lg:).
 * Shows the product name, price, storage selector (if applicable), and primary CTAs.
 * Enhanced layout: product name visible, storage always shown inline, clear action buttons.
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
    <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden safe-bottom">
      {/* Expanded storage selector */}
      {expanded && (
        <div className="bg-ivory/98 backdrop-blur-xl border-t border-ocean/8 px-4 py-4 shadow-premium">
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
      <div className="bg-white border-t border-ocean/10 px-4 py-3 shadow-[0_-8px_24px_rgba(11,84,151,0.08)]">
        <div className="flex items-center gap-3">
          {/* Product name + price */}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-ocean-deeper/50 truncate">
              {productName}
            </p>
            <span className="font-display text-xl font-bold text-ocean-deeper leading-none">
              {currency} {formattedPrice}
            </span>
            {storageOptions.length > 0 && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-ocean/50 hover:text-ocean transition-colors"
              >
                <span className="rounded-full border border-ocean/15 bg-ocean/5 px-2.5 py-0.5 text-[9px] font-bold text-ocean-deeper">
                  {storage || storageOptions[0]}
                </span>
                <span className="text-ocean/35">▾</span>
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
  );
}
