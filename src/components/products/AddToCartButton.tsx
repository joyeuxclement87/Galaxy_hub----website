"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { addCartItem } from "@/actions/cart";
import { getSessionId, notifyCartChanged } from "@/hooks/use-cart";

export function AddToCartButton({
  productId,
  variant = "primary",
  className,
  storage,
  showText = true,
  redirectOnAdd = false,
}: {
  productId: string;
  variant?: "primary" | "secondary";
  className?: string;
  storage?: string;
  showText?: boolean;
  /** When true, navigate to /cart after adding. Defaults to false (just adds). */
  redirectOnAdd?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    startTransition(async () => {
      const sid = getSessionId();
      await addCartItem(sid, productId, storage);
      notifyCartChanged();
      if (redirectOnAdd) {
        router.push("/cart");
      } else {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }
    });
  };

  const Icon = pending ? Loader2 : added ? Check : ShoppingCart;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={showText ? undefined : "Add to cart"}
      className={cn(
        "group inline-flex items-center justify-center font-sans font-semibold transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
         variant === "primary" &&
          "bg-ocean-deeper text-white rounded-btn h-11 min-h-[44px] px-6 text-sm font-bold shadow-btn hover:bg-ocean-dark hover:shadow-btn-hover active:scale-[0.98]",
        variant === "secondary" &&
          "rounded-btn h-11 min-h-[44px] px-6 text-sm font-bold border border-ocean/20 bg-white text-ocean-deeper hover:border-ocean/30 hover:bg-ocean/[0.03] active:scale-[0.98]",
        added && "!border-emerald-500 !text-emerald-600 !bg-emerald-50",
        className
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          pending && "animate-spin",
          showText && "mr-2"
        )}
      />
      {showText && (pending ? "Adding…" : added ? "Added!" : "Add to Cart")}
    </button>
  );
}
