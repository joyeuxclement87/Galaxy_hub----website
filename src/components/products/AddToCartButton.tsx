"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addCartItem } from "@/actions/cart";

function getSessionId() {
  let sid = localStorage.getItem("gh-session");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("gh-session", sid);
  }
  return sid;
}

export function AddToCartButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const sid = getSessionId();
      await addCartItem(sid, productId);
      router.push("/cart");
    });
  };

  return (
    <Button variant="primary" onClick={handleClick} disabled={pending} className="w-full justify-center gap-2 rounded-xl py-3 text-base">
      {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShoppingCart className="h-5 w-5" />}
      {pending ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
