"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Store,
  Trash2,
  Truck,
  User,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Navbar } from "@/components/navbar/Navbar";
import Footer from "@/components/ui/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSupabaseCart, getSessionId } from "@/hooks/use-cart";
import { submitOrder } from "@/actions/checkout";
import { toStorageOptions } from "@/types/specifications";
import { getOrderRequestProduct, type OrderRequestProduct } from "@/actions/order-request";
import { StorageSelector } from "@/components/products/StorageSelector";

type FulfillmentMethod = "pickup" | "delivery";

interface ProvinceOption {
  name: string;
  fee: number;
  eta: string;
}

interface OrderItem {
  key: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  storages: string[];
  selectedVariant?: string | null;
  lineId?: string;
}

const PROVINCES: ProvinceOption[] = [
  { name: "Kigali City", fee: 3000, eta: "Same day / next day" },
  { name: "Southern Province", fee: 6000, eta: "2 - 3 business days" },
  { name: "Northern Province", fee: 6000, eta: "2 - 3 business days" },
  { name: "Eastern Province", fee: 6000, eta: "2 - 3 business days" },
  { name: "Western Province", fee: 7000, eta: "3 - 4 business days" },
];

export default function OrderNowPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-ivory">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-ocean border-t-transparent" />
        </div>
      }
    >
      <OrderContent />
    </Suspense>
  );
}

function OrderContent() {
  const searchParams = useSearchParams();
  const cart = useSupabaseCart();
  const [directProduct, setDirectProduct] = useState<OrderRequestProduct | null>(null);
  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>("pickup");
  const [province, setProvince] = useState(PROVINCES[0].name);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    district: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [selectedStorage, setSelectedStorage] = useState<Record<string, string>>({});

  // Load the product preselected via ?product=slug (e.g. "Order Now" on a product page)
  useEffect(() => {
    const slug = searchParams.get("product");
    if (!slug) return;
    let cancelled = false;
    getOrderRequestProduct(slug).then((product) => {
      if (cancelled || !product) return;
      setDirectProduct(product);
      const requested = searchParams.get("storage");
      if (requested && product.storage_options.includes(requested)) {
        setSelectedStorage((prev) => ({ ...prev, [`product:${product.id}`]: requested }));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  // Items from the real shopping cart (same cart as /cart) plus the preselected product
  const cartItems: OrderItem[] = [
    ...cart.items.map((line) => ({
      key: `line:${line.id}`,
      lineId: line.id,
      title: line.product!.name,
      price: Number(line.product!.price),
      currency: "RWF",
      image: line.product!.main_image_url || "",
      storages: toStorageOptions(line.product!.storage_options),
      selectedVariant: line.variant,
    })),
    ...(directProduct
      ? [
          {
            key: `product:${directProduct.id}`,
            title: directProduct.title,
            price: directProduct.price,
            currency: directProduct.currency,
            image: directProduct.image,
            storages: directProduct.storage_options,
            selectedVariant: null as string | null,
          },
        ]
      : []),
  ];

  const storageFor = (item: OrderItem) => {
    if (item.storages.length === 0) return null;
    return selectedStorage[item.key] || item.selectedVariant || item.storages[0];
  };

  const selectedProvince = PROVINCES.find((p) => p.name === province) || PROVINCES[0];
  const deliveryFee = fulfillment === "delivery" ? selectedProvince.fee : 0;
  const itemsSubtotal = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const total = itemsSubtotal + deliveryFee;
  const hasItems = cart.items.length > 0 || directProduct !== null;

  const formatPrice = (value: number) => new Intl.NumberFormat("en-US").format(value);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!hasItems) newErrors.cart = "Please add at least one product to your cart before ordering.";
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (fulfillment === "delivery") {
      if (!formData.district.trim()) newErrors.district = "District is required";
      if (!formData.address.trim()) newErrors.address = "Delivery address is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");

    const result = await submitOrder({
      customer_name: formData.name,
      phone: formData.phone,
      address: fulfillment === "delivery" ? `${formData.district ?? ""}${formData.address ? `, ${formData.address}` : ""}` : undefined,
      notes: formData.notes || undefined,
      session_id: getSessionId(),
    });

    setSubmitting(false);

    if (result.error || !result.order) {
      setSubmitError(result.error || "Something went wrong. Please try again.");
      return;
    }

    setOrderRef(result.order.order_number);
    setOrderTotal(Number(result.order.total_amount));
    setSubmitted(true);
    setDirectProduct(null);
    await cart.refresh();
    window.scrollTo({ top: 0, behavior: "smooth" });
    confetti({
      particleCount: 90,
      spread: 65,
      origin: { y: 0.6 },
      colors: ["#0b5497", "#e6f0fa", "#0f70c9"],
    });
  };

  const startNewOrder = () => {
    setSubmitted(false);
    setFormData({ name: "", phone: "", district: "", address: "", notes: "" });
    setErrors({});
    setSubmitError("");
  };

  if (cart.loading) {
    return (
      <div className="min-h-screen bg-ivory">
        <Navbar />
        <main className="mx-auto flex max-w-[1320px] items-center justify-center px-6 py-24 md:px-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-ocean border-t-transparent" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-ocean-deeper font-sans pt-20">
      <Navbar />

      {/* Header Banner */}
      <section className="relative bg-ivory overflow-hidden border-b border-ocean/[0.06] px-4 py-8 md:px-8">
        <div className="hero-grid-texture absolute inset-0 opacity-40 pointer-events-none" />
        <div className="relative mx-auto max-w-[1320px]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-ocean/60 transition-colors hover:text-ocean mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Shop
          </Link>

          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex items-center rounded-btn bg-ocean/[0.07] px-4 py-1.5 text-caption font-bold uppercase tracking-[0.2em] text-accent mb-2">
                EXPRESS ORDER
              </span>
              <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-ocean-deeper">
                Complete Your Order Request
              </h1>
              <p className="mt-1 text-sm text-ocean/60 max-w-xl">
                No online payment required. Submit your request and our Kigali team will contact you to confirm before pickup or dispatch.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-btn bg-white/80 backdrop-blur-sm border border-ocean/[0.08] px-4 py-2 text-xs font-semibold text-ocean-deeper/70 shrink-0">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Pay on Collection or Delivery
            </div>
          </div>
        </div>
      </section>
      {/* Main Order Content */}
      <main className="flex-1 mx-auto max-w-[1320px] w-full px-4 py-8 md:px-8 sm:py-12">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex min-h-[70vh] w-full items-center justify-center"
            >
              <div className="w-full max-w-xl overflow-hidden rounded-card border border-ocean/[0.08] bg-white p-6 md:p-8 shadow-premium">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-card bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div className="text-center space-y-2">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-ocean-deeper">
                  Order Request Submitted!
                </h2>
                <p className="text-sm text-ocean/60 leading-relaxed">
                  Thank you, <strong className="text-ocean-deeper">{formData.name}</strong>. Our Kigali team will call or WhatsApp you at <strong className="text-ocean-deeper">{formData.phone}</strong> shortly to confirm stock and finalize your order.
                </p>
              </div>

              {/* Order Receipt Details */}
              <div className="mt-5 rounded-card border border-ocean/[0.06] bg-ivory/60 p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-ocean/[0.06]">
                  <span className="font-semibold text-ocean/50">Order Reference</span>
                  <span className="font-display font-bold text-ocean">{orderRef}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-ocean/60 shrink-0">Items ({cartItems.length})</span>
                  <span className="text-right font-semibold text-ocean-deeper">
                    {cartItems.map((item) => {
                      const storage = storageFor(item);
                      return (
                        <span key={item.key} className="block">
                          {item.title}
                          {storage ? ` — ${storage}` : ""}
                        </span>
                      );
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ocean/60">Fulfillment</span>
                  <span className="font-semibold text-ocean-deeper">
                    {fulfillment === "pickup" ? "Kigali Store Pickup" : `Delivery • ${province}`}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-ocean/[0.06] pt-2">
                  <span className="font-semibold text-ocean-deeper">Total Estimated</span>
                  <span className="font-display text-base font-bold text-ocean-deeper">
                    RWF {formatPrice(submitted ? orderTotal : total)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                <Button
                  variant="secondary"
                  onClick={startNewOrder}
                  className="w-full rounded-btn h-11 text-sm font-bold uppercase tracking-wider"
                >
                  Place Another Order
                </Button>
                <a
                  href="https://wa.me/250785288910"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button
                    variant="primary"
                    className="w-full rounded-btn h-11 text-sm font-bold uppercase tracking-wider gap-2 justify-center !bg-[#25D366] hover:!bg-[#1EBE5D] !shadow-[0_10px_24px_rgba(37,211,102,0.35)] hover:!shadow-[0_14px_28px_rgba(37,211,102,0.45)]"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    WhatsApp Us
                  </Button>
                </a>
              </div>

              <div className="mt-5 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-ocean/60 hover:text-ocean transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Return to Shop
                </Link>
              </div>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-6 lg:grid-cols-12"
            >
              {/* Left Column: Essential Info */}
              <div className="lg:col-span-7 space-y-5">

                {/* 1. Items to Order */}
                <div className="rounded-card border border-ocean/[0.06] bg-white p-4 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 border-b border-ocean/[0.06] pb-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-btn bg-ocean text-caption font-bold text-white">
                      1
                    </span>
                    <h2 className="font-display text-base font-bold text-ocean-deeper">
                      Items in Your Order
                      {hasItems && (
                        <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-btn bg-ocean/[0.08] px-1.5 text-caption font-bold text-ocean">
                          {cartItems.length}
                        </span>
                      )}
                    </h2>
                  </div>

                  {/* Empty cart state */}
                  {!hasItems ? (
                    <div className="flex flex-col items-center gap-4 py-8 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-card bg-ocean/[0.04] border border-ocean/[0.06]">
                        <ShoppingBag className="h-6 w-6 text-ocean/20" />
                      </div>
                      <div>
                        <p className="font-display text-sm font-bold text-ocean-deeper">Your cart is empty</p>
                        <p className="mt-1 text-xs text-ocean/50 leading-relaxed max-w-xs">
                          Browse our shop and add products to your cart before placing an order.
                        </p>
                      </div>
                      <Link
                        href="/products"
                         className="inline-flex items-center gap-2 rounded-btn bg-ocean-deeper px-6 h-11 text-sm font-bold text-white shadow-btn transition-all duration-250 hover:bg-ocean-dark"
                      >
                        Browse Products
                      </Link>
                      {errors.cart && (
                        <p className="text-xs font-semibold text-red-500">{errors.cart}</p>
                      )}
                    </div>
                  ) : (
                    /* List of cart items */
                    <div className="space-y-3">
                      {cartItems.map((item) => {
                        const isDirect = directProduct !== null && item.key === `product:${directProduct.id}`;
                        const storage = storageFor(item);
                        return (
                          <div
                            key={item.key}
                            className="rounded-btn border border-ocean/[0.06] bg-ivory/40 p-3"
                          >
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-btn bg-ivory-dark/50 flex items-center justify-center p-1 border border-ocean/[0.04]">
                                <img src={item.image} alt={item.title} className="h-full w-full object-contain mix-blend-multiply" />
                              </div>
                              <div className="min-w-0 flex-1">
                                {isDirect && (
                                  <span className="mb-0.5 inline-flex items-center rounded-full bg-ocean/[0.08] px-2 py-0.5 text-caption font-bold uppercase tracking-wider text-ocean">
                                    Selected for you
                                  </span>
                                )}
                                <p className="truncate font-display text-sm font-bold text-ocean-deeper">
                                  {item.title}
                                </p>
                                <p className="text-caption font-semibold text-ocean/50">
                                  {item.currency || "RWF"} {formatPrice(item.price)}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => (isDirect ? setDirectProduct(null) : item.lineId && cart.remove(item.lineId))}
                                className="p-1.5 text-ocean/30 hover:text-red-500 transition-colors rounded-btn"
                                aria-label={`Remove ${item.title}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            {item.storages.length > 0 && (
                              <div className="mt-3 border-t border-ocean/[0.05] pt-3">
                                <StorageSelector
                                  compact
                                  options={item.storages}
                                  value={storage || item.storages[0]}
                                  onChange={(s) => setSelectedStorage((prev) => ({ ...prev, [item.key]: s }))}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Contact Details */}
                <div className="rounded-card border border-ocean/[0.06] bg-white p-5 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 border-b border-ocean/[0.06] pb-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-btn bg-ocean text-caption font-bold text-white">
                      2
                    </span>
                    <h2 className="font-display text-base font-bold text-ocean-deeper">
                      Contact Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-caption font-bold uppercase tracking-wider text-ocean/50">
                        <User className="h-3.5 w-3.5" /> Full Name *
                      </label>
                   <input
                         type="text"
                         value={formData.name}
                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                         placeholder="Enter your name"
                         className="w-full rounded-btn border border-ocean/[0.08] bg-ivory/60 px-4 py-2.5 text-sm text-ocean-deeper transition-all focus:border-accent focus:bg-white focus:outline-none"
                       />
                      {errors.name && <p className="mt-1 text-xs font-medium text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-caption font-bold uppercase tracking-wider text-ocean/50">
                        <Phone className="h-3.5 w-3.5" /> Phone Number (Call / WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 0785 288 910"
                        className="w-full rounded-btn border border-ocean/[0.08] bg-ivory/60 px-4 py-2.5 text-base sm:text-sm text-ocean-deeper transition-all focus:border-accent focus:bg-white focus:outline-none"
                      />
                      {errors.phone && <p className="mt-1 text-xs font-medium text-red-500">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-caption font-bold uppercase tracking-wider text-ocean/50">
                      Order Notes / Color & Storage Preference (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="e.g. Black Titanium, 256GB..."
                      className="w-full rounded-btn border border-ocean/[0.08] bg-ivory/60 px-4 py-2.5 text-base sm:text-sm text-ocean-deeper transition-all focus:border-accent focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* 3. Fulfillment Choice */}
                <div className="rounded-card border border-ocean/[0.06] bg-white p-5 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 border-b border-ocean/[0.06] pb-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-btn bg-ocean text-caption font-bold text-white">
                      3
                    </span>
                    <h2 className="font-display text-base font-bold text-ocean-deeper">
                      Fulfillment Method
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                     <button
                       type="button"
                       onClick={() => setFulfillment("pickup")}
                       className={cn(
                         "rounded-btn border p-4 text-left transition-all duration-250 cursor-pointer",
                         fulfillment === "pickup"
                           ? "border-ocean bg-ocean/[0.05] shadow-sm"
                           : "border-ocean/[0.08] bg-ivory/40 hover:border-ocean/20"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-btn bg-ocean/10 text-ocean">
                          <Store className="h-4 w-4" />
                        </div>
                        <span className="rounded-btn bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-caption font-bold text-emerald-600">
                          FREE
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-bold text-ocean-deeper">Store Pickup (Kigali)</p>
                      <p className="mt-1 text-xs text-ocean/55">KN 70 St, Kigali</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFulfillment("delivery")}
                      className={cn(
                        "rounded-btn border p-4 text-left transition-all duration-300 cursor-pointer",
                        fulfillment === "delivery"
                          ? "border-ocean bg-ocean/[0.05] shadow-sm"
                          : "border-ocean/[0.08] bg-ivory/40 hover:border-ocean/20"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-btn bg-ocean/10 text-ocean">
                          <Truck className="h-4 w-4" />
                        </div>
                        <span className="rounded-btn bg-ocean/10 px-2.5 py-0.5 text-caption font-bold text-ocean">
                          FROM RWF 3,000
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-bold text-ocean-deeper">Nationwide Delivery</p>
                      <p className="mt-1 text-xs text-ocean/55">Express delivery across Rwanda</p>
                    </button>
                  </div>

                  {/* Delivery Location Details */}
                  <AnimatePresence>
                    {fulfillment === "delivery" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden pt-2"
                      >
                        <div className="space-y-3 rounded-btn border border-ocean/[0.08] bg-ivory/60 p-4">
                          <div>
                            <label className="mb-1 flex items-center gap-1.5 text-caption font-bold uppercase tracking-wider text-ocean/50">
                              <MapPin className="h-3.5 w-3.5" /> Province
                            </label>
                            <select
                              value={province}
                              onChange={(e) => setProvince(e.target.value)}
                              className="w-full cursor-pointer rounded-btn border border-ocean/[0.08] bg-white px-3.5 py-2 text-base sm:text-sm transition-all focus:border-accent focus:outline-none"
                            >
                              {PROVINCES.map((p) => (
                                <option key={p.name} value={p.name}>
                                  {p.name} — RWF {formatPrice(p.fee)} ({p.eta})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-caption font-bold uppercase tracking-wider text-ocean/50">
                                District *
                              </label>
                              <input
                                type="text"
                                value={formData.district}
                                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                placeholder="Gasabo, Nyarugenge..."
                                className="w-full rounded-btn border border-ocean/[0.08] bg-white px-3.5 py-2 text-base sm:text-sm text-ocean-deeper transition-all focus:border-accent focus:outline-none"
                              />
                              {errors.district && <p className="mt-1 text-xs font-medium text-red-500">{errors.district}</p>}
                            </div>
                            <div>
                              <label className="mb-1 block text-caption font-bold uppercase tracking-wider text-ocean/50">
                                Delivery Address *
                              </label>
                              <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Street, landmark..."
                                className="w-full rounded-btn border border-ocean/[0.08] bg-white px-3.5 py-2 text-base sm:text-sm text-ocean-deeper transition-all focus:border-accent focus:outline-none"
                              />
                              {errors.address && <p className="mt-1 text-xs font-medium text-red-500">{errors.address}</p>}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Column: Order Summary Card */}
              <div className="lg:col-span-5">
                <div className="sticky top-24 rounded-card border border-ocean/[0.06] bg-white p-5 shadow-premium space-y-4">
                  <h3 className="font-display text-base font-bold text-ocean-deeper border-b border-ocean/[0.06] pb-3">
                    Order Summary
                  </h3>

                  {!hasItems ? (
                    <div className="py-3 text-center space-y-2">
                      <p className="text-sm font-semibold text-ocean/50">No items selected</p>
                      <p className="text-xs text-ocean/40 leading-relaxed">
                        Add products to your cart from the shop first.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Item breakdown */}
                      <div className="space-y-2 text-xs text-ocean/65">
                        <div className="flex justify-between">
                          <span>Items ({cartItems.length})</span>
                          <span className="font-semibold text-ocean-deeper">RWF {formatPrice(itemsSubtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fulfillment</span>
                          <span className="font-semibold text-ocean-deeper">
                            {deliveryFee === 0 ? "Free" : `RWF ${formatPrice(deliveryFee)}`}
                          </span>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="border-t border-ocean/[0.06] pt-3 flex items-center justify-between">
                        <span className="font-display text-base font-bold text-ocean-deeper">Total Estimated</span>
                        <span className="font-display text-lg font-bold text-ocean-deeper">
                          RWF {formatPrice(total)}
                        </span>
                      </div>
                    </>
                  )}

                  {/* Trust notice */}
                  <div className="rounded-btn bg-emerald-50 border border-emerald-100 p-3 flex items-start gap-2 text-xs text-emerald-800">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                    <span>No online payment required. Inspect your device and pay on pickup or delivery.</span>
                  </div>

                  {submitError && (
                    <p className="rounded-btn border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                      {submitError}
                    </p>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!hasItems || submitting}
                    className="w-full rounded-btn h-11 text-sm font-bold gap-2 justify-center shadow-btn hover:shadow-btn-hover disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" />
                        Submit Order Request
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Included */}
      <Footer />
    </div>
  );
}
