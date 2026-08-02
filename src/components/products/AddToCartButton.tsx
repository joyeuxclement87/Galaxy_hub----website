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
        "group inline-flex items-center justify-center font-sans font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
        variant === "primary" &&
          "bg-ocean-deeper text-white rounded-xl h-12 px-7 text-xs font-bold uppercase tracking-[0.12em] shadow-btn hover:bg-ocean-dark hover:shadow-btn-hover hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
        variant === "secondary" &&
          "rounded-xl h-12 px-7 text-xs font-bold uppercase tracking-[0.12em] border border-ocean/15 bg-white/60 backdrop-blur-sm text-ocean-deeper hover:border-ocean/30 hover:bg-white hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
        className
      )}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
      ) : (
        <ShoppingCart className="h-4 w-4 mr-1.5" />
      )}
      {showText && (pending ? "Adding..." : "Add to Cart")}
    </button>
  );
}
