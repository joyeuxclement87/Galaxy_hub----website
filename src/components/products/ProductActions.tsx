"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StorageSelector } from "@/components/products/StorageSelector";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { cn } from "@/lib/utils";
import { btnBase, btnVariants } from "@/components/ui/button";

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
    <div className="space-y-4">
      <StorageSelector options={storageOptions} value={storage} onChange={setStorage} />

      <div className="flex flex-col gap-3 sm:flex-row w-full">
        <Link
          href={`/order?product=${productSlug}${storage ? `&storage=${encodeURIComponent(storage)}` : ""}`}
          className={cn(btnBase, btnVariants.primary, "flex-1 gap-2 px-6")}
        >
          Order Now
          <ArrowRight className="h-4 w-4" />
        </Link>
        <AddToCartButton 
          productId={productId} 
          variant="secondary" 
          className="flex-1 px-6" 
          storage={storage || undefined}
          redirectOnAdd={false}
        />
      </div>
    </div>
  );
}
