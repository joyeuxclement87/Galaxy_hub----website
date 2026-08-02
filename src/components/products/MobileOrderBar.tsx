"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StorageSelector } from "@/components/products/StorageSelector";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { cn } from "@/lib/utils";

/**
 * Floating bottom purchase bar shown only on mobile/tablet (hidden lg:).
 * Compact sticky bar showing price + primary actions only.
 * Height: 72-80px as per mobile redesign spec.
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
    <div className="fixed bottom-3 inset-x-0 z-50 lg:hidden safe-bottom mx-3">
      <div className="rounded-2xl border border-ocean/10 bg-white/95 backdrop-blur-xl shadow-[0_8px_24px_rgba(15,23,42,0.08)] overflow-hidden">
        {/* Storage selector - expanded */}
        {expanded && storageOptions.length > 0 && (
          <div className="border-b border-ocean/[0.06] px-4 py-3 bg-ivory/60">
            <StorageSelector options={storageOptions} value={storage} onChange={setStorage} />
          </div>
        )}

        {/* Main bar - compact height */}
        <div className="px-3 py-2.5 flex items-center gap-2.5">
          {/* Price */}
          <div className="flex-1 min-w-0">
            <span className="text-caption font-bold uppercase tracking-wider text-ocean/40 block">
              Price
            </span>
            <span className="font-display text-lg font-bold text-ocean-deeper leading-none">
              {currency} {formattedPrice}
            </span>
            {storageOptions.length > 0 && !expanded && (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="mt-0.5 flex items-center gap-1 rounded-full border border-ocean/15 bg-ocean/5 px-2.5 py-0.5 text-xs font-bold text-ocean-deeper"
              >
                Storage: {storage || storageOptions[0]}
              </button>
            )}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            <AddToCartButton
              productId={productId}
              variant="secondary"
              storage={storage || undefined}
              showText={false}
              className="h-10 w-10 rounded-btn border-ocean/15 bg-white shadow-sm"
            />
            <Link
              href={`/order?product=${productSlug}${storage ? `&storage=${encodeURIComponent(storage)}` : ""}`}
              className={cn(
                "inline-flex h-10 items-center justify-center gap-1.5 rounded-btn px-4 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-btn transition-all duration-250 active:scale-[0.97]",
                isAvailable
                  ? "bg-ocean-deeper hover:bg-ocean-dark hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
                  : "bg-ocean/40 pointer-events-none"
              )}
            >
              Order
              {isAvailable && <ArrowRight className="h-4 w-4" />}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
