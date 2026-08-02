"use client";

import { useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { addCartItem } from "@/actions/cart";
import { getSessionId, notifyCartChanged } from "@/hooks/use-cart";

export function AddToCartButton({
  productId,
  variant = "primary",
  className,
  storage,
  showText = true,
}: {
  productId: string;
  variant?: "primary" | "secondary";
  className?: string;
  storage?: string;
  showText?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const goToCart = useRef(false);

  const handleClick = () => {
    goToCart.current = true;
    startTransition(async () => {
      const sid = getSessionId();
      await addCartItem(sid, productId, storage);
      notifyCartChanged();
    });
  };

  useEffect(() => {
    if (goToCart.current && !pending) {
      goToCart.current = false;
      router.push("/cart");
    }
  }, [pending, router]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={cn(
        "group inline-flex items-center justify-center font-sans font-semibold transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
        variant === "primary" &&
          "bg-ocean-deeper text-white rounded-btn h-12 px-6 text-sm font-bold uppercase tracking-[0.12em] shadow-btn hover:bg-ocean-dark hover:shadow-btn-hover active:scale-[0.98]",
        variant === "secondary" &&
          "rounded-btn h-12 px-6 text-sm font-bold uppercase tracking-[0.12em] border border-ocean/20 bg-white text-ocean-deeper hover:border-ocean/30 hover:bg-ocean/[0.03] active:scale-[0.98]",
        className
      )}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <ShoppingCart className="h-4 w-4 mr-2" />
      )}
      {showText && (pending ? "Adding..." : "Add to Cart")}
    </button>
  );
}
