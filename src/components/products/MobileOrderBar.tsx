"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { StorageSelector } from "@/components/products/StorageSelector";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { cn } from "@/lib/utils";

/**
 * Floating bottom purchase bar shown only on mobile/tablet (hidden lg:).
 * Compact sticky bar: price → storage chip → cart icon btn → Order CTA.
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
    <div className="fixed bottom-3 inset-x-0 z-50 lg:hidden mx-3">
      <div className="rounded-2xl border border-ocean/10 bg-white/96 backdrop-blur-xl shadow-[0_8px_32px_rgba(11,84,151,0.12)] overflow-hidden">
        {/* Storage selector — slides in above the bar */}
        {expanded && storageOptions.length > 0 && (
          <div className="border-b border-ocean/[0.06] px-4 py-3 bg-ivory/70">
            <StorageSelector
              options={storageOptions}
              value={storage}
              onChange={(s) => { setStorage(s); setExpanded(false); }}
              compact
            />
          </div>
        )}

        {/* Main bar */}
        <div className="px-3 py-2.5 flex items-center gap-2">
          {/* Price + storage chip */}
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ocean/40 block leading-none mb-0.5">
              Price
            </span>
            <span className="font-display text-base font-bold text-ocean-deeper leading-none">
              {currency} {formattedPrice}
            </span>
            {storageOptions.length > 0 && (
              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                className={cn(
                  "mt-1 flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold transition-all duration-200",
                  expanded
                    ? "border-ocean bg-ocean text-white"
                    : "border-ocean/15 bg-ocean/5 text-ocean-deeper hover:border-ocean/30"
                )}
              >
                <ShoppingCart className="h-3 w-3" />
                {storage || storageOptions[0]}
              </button>
            )}
          </div>

          {/* CTAs — consistent button design */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Add to cart — icon only, uses design system secondary style */}
            <AddToCartButton
              productId={productId}
              variant="secondary"
              storage={storage || undefined}
              showText={false}
              redirectOnAdd={false}
              className="h-10 w-10 min-w-[40px] rounded-btn border-ocean/20 bg-white text-ocean-deeper shadow-sm hover:border-ocean/35 hover:bg-ocean/[0.04]"
            />

            {/* Order CTA — primary style, consistent with Button "primary" */}
             <Link
               href={`/order?product=${productSlug}${storage ? `&storage=${encodeURIComponent(storage)}` : ""}`}
               className={cn(
                 "inline-flex h-11 min-h-[44px] items-center justify-center gap-1.5 rounded-btn px-4 text-sm font-bold text-white shadow-btn transition-all duration-250 active:scale-[0.97]",
                 isAvailable
                   ? "bg-ocean-deeper hover:bg-ocean-dark hover:shadow-btn-hover"
                   : "bg-ocean/40 pointer-events-none"
               )}
             >
              Order
              {isAvailable && <ArrowRight className="h-3.5 w-3.5" />}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
