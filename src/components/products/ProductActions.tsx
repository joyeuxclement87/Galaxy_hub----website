"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StorageSelector } from "@/components/products/StorageSelector";
import { AddToCartButton } from "@/components/products/AddToCartButton";

/**
 * Interactive purchase block for the product page: storage picker (when the
 * listing has storage options) + "Order Now" (carries the chosen storage to
 * the order page) + "Add to Cart" (stores the chosen storage with the cart
 * line).
 */
export function ProductActions({
  productId,
  productSlug,
  storageOptions,
  defaultStorage,
}: {
  productId: string;
  productSlug: string;
  storageOptions: string[];
  defaultStorage?: string;
}) {
  const [storage, setStorage] = useState(defaultStorage || storageOptions[0] || "");

  return (
    <div className="space-y-5">
      <StorageSelector options={storageOptions} value={storage} onChange={setStorage} />

      <div className="flex flex-col gap-3 sm:flex-row w-full">
        <Link
          href={`/order?product=${productSlug}${storage ? `&storage=${encodeURIComponent(storage)}` : ""}`}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-ocean-deeper px-7 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-btn transition-all duration-300 hover:-translate-y-0.5 hover:bg-ocean-dark hover:shadow-btn-hover active:translate-y-0"
        >
          Order Now
          <ArrowRight className="h-4 w-4" />
        </Link>
        <AddToCartButton 
          productId={productId} 
          variant="secondary" 
          className="flex-1 h-12 rounded-xl text-xs" 
          storage={storage || undefined} 
        />
      </div>
    </div>
  );
}
