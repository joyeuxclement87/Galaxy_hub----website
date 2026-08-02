"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquareText } from "lucide-react";
import { StorageSelector } from "@/components/products/StorageSelector";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { QuoteRequestModal } from "@/components/ui/quote-request-modal";
import { cn } from "@/lib/utils";
import { btnBase, btnVariants } from "@/components/ui/button";

/**
 * Interactive purchase block for the product page: storage picker (when the
 * listing has storage options) + "Order Now" (carries the chosen storage to
 * the order page) + "Add to Cart" (stores the chosen storage with the cart
 * line) + "Request Quote" (staff quote flow with Telegram notification).
 */
export function ProductActions({
  productId,
  productSlug,
  productName,
  productPrice,
  productCurrency,
  productImage,
  storageOptions,
  defaultStorage,
}: {
  productId: string;
  productSlug: string;
  productName: string;
  productPrice: number;
  productCurrency: string;
  productImage?: string;
  storageOptions: string[];
  defaultStorage?: string;
}) {
  const [storage, setStorage] = useState(defaultStorage || storageOptions[0] || "");
  const [quoteOpen, setQuoteOpen] = useState(false);

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

      <button
        type="button"
        onClick={() => setQuoteOpen(true)}
        className="w-full inline-flex items-center justify-center gap-2 rounded-btn border border-ocean/15 bg-ocean/[0.03] px-6 py-3 text-sm font-bold text-ocean transition-all duration-200 hover:border-ocean/30 hover:bg-ocean/[0.07] active:scale-[0.98]"
      >
        <MessageSquareText className="h-4 w-4" />
        Request a Quote
      </button>

      <QuoteRequestModal
        open={quoteOpen}
        product={{
          id: productId,
          slug: productSlug,
          title: productName,
          price: productPrice,
          currency: productCurrency,
          image: productImage,
        }}
        variant={storage || undefined}
        onClose={() => setQuoteOpen(false)}
      />
    </div>
  );
}
