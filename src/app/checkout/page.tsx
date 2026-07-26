"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, User, Phone, Mail, MapPin, MessageSquare, Loader2, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getOrCreateCart } from "@/actions/cart";
import { submitOrder } from "@/actions/checkout";

function getSessionId() {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem("gh-session");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("gh-session", sid);
  }
  return sid;
}

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    old_price: number | null;
    main_image_url: string | null;
  } | null;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ customer_name: "", phone: "", email: "", address: "", notes: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const loadCart = useCallback(async () => {
    const sid = getSessionId();
    const result = await getOrCreateCart(sid);
    if (result) setItems(result.items as CartItem[]);
    setLoading(false);
  }, []);

  useEffect(() => { loadCart(); }, [loadCart]);

  const validItems = items.filter((i) => i.product);
  const subtotal = validItems.reduce((sum, i) => sum + Number(i.product!.price) * i.quantity, 0);
  const formatPrice = (v: number) => new Intl.NumberFormat("en-US").format(v);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.customer_name.trim()) errs.customer_name = "Name is required";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setError("");

    const result = await submitOrder({
      ...form,
      session_id: getSessionId(),
    });

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.order) {
      localStorage.removeItem("gh-session");
      router.push(`/order/success?id=${result.order.id}&order_number=${result.order.order_number}&total=${result.order.total_amount}`);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 pt-20 lg:pt-28 min-h-screen bg-[#F8F9FA]">
        <Navbar />
        <main className="mx-auto max-w-[1320px] px-6 py-12 md:px-12">
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-ocean" />
          </div>
        </main>
      </div>
    );
  }

  if (validItems.length === 0 && !loading) {
    return (
      <div className="flex-1 pt-20 lg:pt-28 min-h-screen bg-[#F8F9FA]">
        <Navbar />
        <main className="mx-auto max-w-[1320px] px-6 py-12 md:px-12">
          <EmptyState
            title="Your cart is empty"
            description="Add some products before checking out."
            action={
              <Link href="/products">
                <Button variant="primary" className="gap-2"><ShoppingBag className="h-4 w-4" /> Browse Products</Button>
              </Link>
            }
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 pt-20 lg:pt-28 min-h-screen bg-[#F8F9FA]">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-6 py-12 md:px-12">
        <Link href="/cart" className="mb-6 inline-flex items-center gap-2 text-sm text-ocean/60 hover:text-ocean transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Cart
        </Link>

        <h1 className="font-clash text-3xl font-bold text-[#10233D] mb-8">Checkout</h1>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                <h2 className="font-clash text-lg font-bold text-[#10233D] mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-ocean/70">
                      <User className="h-3.5 w-3.5" /> Full Name *
                    </label>
                    <input type="text" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-black/8 bg-white px-4 py-2.5 text-sm text-[#10233D] placeholder:text-ocean/30 focus:border-ocean/40 focus:outline-none focus:ring-2 focus:ring-ocean/10" />
                    {fieldErrors.customer_name && <p className="mt-1 text-xs text-red-500">{fieldErrors.customer_name}</p>}
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-ocean/70">
                        <Phone className="h-3.5 w-3.5" /> Phone *
                      </label>
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+250 7XX XXX XXX"
                        className="w-full rounded-xl border border-black/8 bg-white px-4 py-2.5 text-sm text-[#10233D] placeholder:text-ocean/30 focus:border-ocean/40 focus:outline-none focus:ring-2 focus:ring-ocean/10" />
                      {fieldErrors.phone && <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>}
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-ocean/70">
                        <Mail className="h-3.5 w-3.5" /> Email (optional)
                      </label>
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="name@domain.com"
                        className="w-full rounded-xl border border-black/8 bg-white px-4 py-2.5 text-sm text-[#10233D] placeholder:text-ocean/30 focus:border-ocean/40 focus:outline-none focus:ring-2 focus:ring-ocean/10" />
                      {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-ocean/70">
                      <MapPin className="h-3.5 w-3.5" /> Delivery Address (optional)
                    </label>
                    <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Street, district, landmark..."
                      className="w-full rounded-xl border border-black/8 bg-white px-4 py-2.5 text-sm text-[#10233D] placeholder:text-ocean/30 focus:border-ocean/40 focus:outline-none focus:ring-2 focus:ring-ocean/10" />
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-ocean/70">
                      <MessageSquare className="h-3.5 w-3.5" /> Notes (optional)
                    </label>
                    <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      rows={3} placeholder="Color preference, storage size, or any special requests..."
                      className="w-full resize-none rounded-xl border border-black/8 bg-white px-4 py-2.5 text-sm text-[#10233D] placeholder:text-ocean/30 focus:border-ocean/40 focus:outline-none focus:ring-2 focus:ring-ocean/10" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm lg:sticky lg:top-24">
                <h3 className="font-clash text-lg font-bold text-[#10233D] mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {validItems.map((item) => {
                    const p = item.product!;
                    return (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F7F8FA]">
                          {p.main_image_url ? <img src={p.main_image_url} alt={p.name} className="h-full w-full object-contain p-1" /> : <div className="flex h-full items-center justify-center text-ocean/20"><ShoppingBag className="h-5 w-5" /></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium text-[#10233D]">{p.name}</p>
                          <p className="text-xs text-ocean/50">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold text-[#10233D]">RWF {formatPrice(Number(p.price) * item.quantity)}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 space-y-2 border-t border-black/5 pt-4 text-sm">
                  <div className="flex items-center justify-between text-ocean/70">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#10233D]">RWF {formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-ocean/70">
                    <span>Delivery</span>
                    <span className="text-ocean/50">To be confirmed</span>
                  </div>
                  <div className="border-t border-black/5 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#10233D]">Estimated Total</span>
                      <span className="font-clash text-xl font-bold text-ocean">RWF {formatPrice(subtotal)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-xs text-ocean/70">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>No payment now. Pay on pickup or delivery.</span>
                </div>
                <Button variant="primary" type="submit" disabled={submitting} className="mt-4 w-full gap-2">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />}
                  {submitting ? "Submitting..." : "Submit Order Request"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
