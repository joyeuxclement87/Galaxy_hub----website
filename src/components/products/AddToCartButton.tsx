"use client";

import { useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addCartItem } from "@/actions/cart";
import { getSessionId, notifyCartChanged } from "@/hooks/use-cart";

export function AddToCartButton({
  productId,
  variant = "primary",
  className,
  storage,
}: {
  productId: string;
  variant?: "primary" | "secondary";
  className?: string;
  storage?: string;
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
    <Button variant={variant} onClick={handleClick} disabled={pending} className={cn("justify-center gap-2", className)}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
      {pending ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
