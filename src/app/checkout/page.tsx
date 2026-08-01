import { redirect } from "next/navigation";

// Checkout lives on the Order Now page — it has the same order-request flow
// (contact info, fulfillment choice, storage selection) and submits the real
// order. Keeping one page avoids two competing checkout experiences.
export default function CheckoutPage() {
  redirect("/order");
}
