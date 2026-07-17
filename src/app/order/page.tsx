"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
  User,
} from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRODUCTS, Product } from "@/data/mock-data";
import { useApp } from "@/context/AppContext";

// ─── Delivery data ────────────────────────────────────────────────────────────
type FulfillmentMethod = "pickup" | "delivery";

interface ProvinceOption {
  name: string;
  fee: number;
  eta: string;
}

const PROVINCES: ProvinceOption[] = [
  { name: "Kigali City", fee: 3000, eta: "Same day / next day" },
  { name: "Southern Province", fee: 6000, eta: "2 - 3 business days" },
  { name: "Northern Province", fee: 6000, eta: "2 - 3 business days" },
  { name: "Eastern Province", fee: 6000, eta: "2 - 3 business days" },
  { name: "Western Province", fee: 7000, eta: "3 - 4 business days" },
];

const TRUST_CARDS = [
  {
    icon: ShieldCheck,
    title: "Genuine Products",
    description: "Every device is sourced from authorized distributors and verified before dispatch.",
  },
  {
    icon: BadgeCheck,
    title: "Warranty Included",
    description: "Standard manufacturer warranty coverage on all smartphones, laptops and accessories.",
  },
  {
    icon: Package,
    title: "Pay on Collection",
    description: "No online payment required. Inspect your device in-store or on delivery before paying.",
  },
  {
    icon: Clock,
    title: "Fast Confirmation",
    description: "Our team calls to confirm every order request within a few hours, every business day.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Do I need to pay online to place an order?",
    a: "No. Galaxy Hub does not process online payments. You submit an order request, our team confirms availability and pricing by phone, and you pay in person — either in-store or on delivery.",
  },
  {
    q: "Can I inspect the device before paying?",
    a: "Yes. Whether you choose store pickup or nationwide delivery, you're welcome to inspect the device, verify the IMEI/serial number, and test it before completing payment.",
  },
  {
    q: "How long does delivery take outside Kigali?",
    a: "Delivery within Kigali City is typically same-day or next-day. Other provinces usually take 2-4 business days depending on the district.",
  },
  {
    q: "What happens after I submit my order request?",
    a: "You'll receive an on-screen confirmation with an order reference. Our showroom team will contact you via phone or WhatsApp within a few hours to confirm stock, pricing, and your preferred pickup or delivery time.",
  },
  {
    q: "Can I change my order after submitting it?",
    a: "Yes, since no payment is taken upfront. Just reply to our confirmation call or message and our team will update your order details.",
  },
];

export default function OrderNowPage() {
  const { clearCart } = useApp();
  const featuredProduct = PRODUCTS.find((p) => p.featured) || PRODUCTS[0];

  const [selectedProductId, setSelectedProductId] = useState(featuredProduct.id);
  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>("pickup");
  const [province, setProvince] = useState(PROVINCES[0].name);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    district: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");

  const selectedProduct: Product =
    PRODUCTS.find((p) => p.id === selectedProductId) || featuredProduct;

  const selectedProvince =
    PROVINCES.find((p) => p.name === province) || PROVINCES[0];

  const deliveryFee = fulfillment === "delivery" ? selectedProvince.fee : 0;
  const total = selectedProduct.price + deliveryFee;

  const formatPrice = (value: number) => new Intl.NumberFormat("en-US").format(value);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }
    if (fulfillment === "delivery") {
      if (!formData.district.trim()) newErrors.district = "District is required";
      if (!formData.address.trim()) newErrors.address = "Delivery address is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setOrderId(`GH-${Math.floor(100000 + Math.random() * 900000)}`);
    setSubmitted(true);
    clearCart();
    confetti({
      particleCount: 90,
      spread: 65,
      origin: { y: 0.65 },
      colors: ["#0b5497", "#e6f0fa", "#0f70c9"],
    });
  };

  const startNewOrder = () => {
    setSubmitted(false);
    setFormData({ name: "", phone: "", email: "", district: "", address: "", notes: "" });
    setErrors({});
  };

  return (
    <div className="flex-1 pt-20 lg:pt-28">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFEF9_0%,#F5F9FD_100%)] px-6 py-16 md:px-12">
        <div className="hero-grid-texture absolute inset-0 opacity-[0.18]" />
        <div className="absolute -left-16 top-6 h-56 w-56 rounded-full bg-ocean/8 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-[1320px]">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ocean/60 transition-colors hover:text-ocean"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Showroom
          </Link>

          <span className="inline-flex items-center rounded-badge border border-ocean/20 bg-[#FFFEF9]/88 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-ocean shadow-sm">
            ORDER REQUEST • NO ONLINE PAYMENT
          </span>

          <h1 className="mt-5 max-w-2xl font-clash text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-[#10233D] sm:text-5xl lg:text-[56px]">
            Order Your Next Device.
            <br />
            Pay When You Collect.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#10233D]/72 sm:text-lg">
            Select a device, share your details, and choose store pickup in Kigali or delivery
            anywhere in Rwanda. Our team confirms everything by phone before any payment is made.
          </p>
        </div>
      </section>

      {/* ── Order form / success ────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1320px] px-6 py-16 md:px-12">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="mx-auto max-w-2xl overflow-hidden rounded-[32px] border border-white/60 bg-white/90 p-8 text-center shadow-[0_30px_90px_rgba(11,84,151,0.14)] backdrop-blur-xl sm:p-12"
            >
              <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="font-clash text-2xl font-bold text-[#10233D] sm:text-3xl">
                Order Request Received
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-ocean/70 sm:text-base">
                Thank you, <strong className="text-ocean">{formData.name}</strong>. We&apos;ve received your
                request for the <strong className="text-ocean">{selectedProduct.title}</strong>. Our team
                will call or WhatsApp you shortly to confirm availability and finalize{" "}
                {fulfillment === "pickup" ? "your pickup time" : "your delivery details"}.
              </p>

              <div className="mt-6 space-y-2 rounded-[20px] border border-ocean/10 bg-ocean-light/30 p-5 text-left text-sm text-ocean/75">
                <div className="flex items-center justify-between">
                  <span className="text-ocean/55">Order Reference</span>
                  <span className="font-space font-semibold text-ocean">{orderId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ocean/55">Device</span>
                  <span className="font-medium text-ocean">{selectedProduct.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ocean/55">Fulfillment</span>
                  <span className="font-medium text-ocean">
                    {fulfillment === "pickup" ? "Kigali Store Pickup" : `Delivery • ${province}`}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-ocean/10 pt-2">
                  <span className="text-ocean/55">Estimated Total</span>
                  <span className="font-space font-bold text-ocean">
                    {selectedProduct.currency} {formatPrice(total)}
                  </span>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Button
                  variant="secondary"
                  className="w-full gap-2"
                  onClick={startNewOrder}
                >
                  Place Another Order
                </Button>
                <a
                  href="https://wa.me/250788123456"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary" className="w-full gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Message Us on WhatsApp
                  </Button>
                </a>
              </div>

              <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ocean/60 transition-colors hover:text-ocean"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Showroom
              </Link>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10"
            >
              {/* ── Left column: selector + form ─────────────────────────── */}
              <div className="space-y-10 lg:col-span-8">
                {/* Product selector */}
                <div>
                  <div className="mb-5 flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ocean text-xs font-bold text-ivory">
                      1
                    </span>
                    <h2 className="font-clash text-xl font-bold text-[#10233D]">Select Your Device</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {PRODUCTS.map((product) => {
                      const isActive = product.id === selectedProductId;
                      return (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => setSelectedProductId(product.id)}
                          className={cn(
                            "group relative flex items-center gap-4 rounded-[22px] border p-4 text-left transition-all duration-300",
                            isActive
                              ? "border-ocean bg-white shadow-[0_16px_40px_rgba(11,84,151,0.14)]"
                              : "border-ocean/10 bg-white/50 hover:border-ocean/30 hover:bg-white/80"
                          )}
                        >
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-ocean-light/40">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="h-full w-full object-contain p-1.5"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[#10233D]">{product.title}</p>
                            <p className="mt-0.5 text-xs text-ocean/55">{product.brand} • {product.category}</p>
                            <p className="mt-1 font-space text-sm font-bold text-ocean">
                              {product.currency} {formatPrice(product.price)}
                            </p>
                          </div>
                          <div
                            className={cn(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                              isActive
                                ? "border-ocean bg-ocean text-ivory"
                                : "border-ocean/20 text-transparent"
                            )}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Customer info */}
                <div>
                  <div className="mb-5 flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ocean text-xs font-bold text-ivory">
                      2
                    </span>
                    <h2 className="font-clash text-xl font-bold text-[#10233D]">Your Information</h2>
                  </div>

                  <div className="space-y-4 rounded-[24px] border border-ocean/10 bg-white/60 p-6 shadow-[0_10px_30px_rgba(11,84,151,0.06)] backdrop-blur-sm">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-ocean/70">
                        <User className="h-3.5 w-3.5" /> Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full rounded-input border border-ocean/10 bg-ocean-light/30 px-4 py-2.5 text-sm text-ocean transition-all duration-200 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                      {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-ocean/70">
                          <Phone className="h-3.5 w-3.5" /> Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. +250 788 000 000"
                          className="w-full rounded-input border border-ocean/10 bg-ocean-light/30 px-4 py-2.5 text-sm text-ocean transition-all duration-200 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                      </div>
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-ocean/70">
                          <Mail className="h-3.5 w-3.5" /> Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@domain.com"
                          className="w-full rounded-input border border-ocean/10 bg-ocean-light/30 px-4 py-2.5 text-sm text-ocean transition-all duration-200 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-ocean/70">
                        Order Notes (optional)
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                        placeholder="Color preference, storage size, or any other request..."
                        className="w-full resize-none rounded-input border border-ocean/10 bg-ocean-light/30 px-4 py-2.5 text-sm text-ocean transition-all duration-200 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery options */}
                <div>
                  <div className="mb-5 flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ocean text-xs font-bold text-ivory">
                      3
                    </span>
                    <h2 className="font-clash text-xl font-bold text-[#10233D]">Pickup or Delivery</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setFulfillment("pickup")}
                      className={cn(
                        "rounded-[22px] border p-5 text-left transition-all duration-300",
                        fulfillment === "pickup"
                          ? "border-ocean bg-white shadow-[0_16px_40px_rgba(11,84,151,0.14)]"
                          : "border-ocean/10 bg-white/50 hover:border-ocean/30"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ocean-light/60 text-ocean">
                          <Store className="h-5 w-5" />
                        </div>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                          FREE
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-[#10233D]">Kigali Store Pickup</p>
                      <p className="mt-1 text-xs text-ocean/60">
                        Collect and inspect your device at our KN 2 Ave showroom.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFulfillment("delivery")}
                      className={cn(
                        "rounded-[22px] border p-5 text-left transition-all duration-300",
                        fulfillment === "delivery"
                          ? "border-ocean bg-white shadow-[0_16px_40px_rgba(11,84,151,0.14)]"
                          : "border-ocean/10 bg-white/50 hover:border-ocean/30"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ocean-light/60 text-ocean">
                          <Truck className="h-5 w-5" />
                        </div>
                        <span className="rounded-full bg-ocean-light/60 px-2.5 py-1 text-[10px] font-semibold text-ocean">
                          FROM {selectedProvince.fee > 0 ? "RWF 3,000" : "FREE"}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-[#10233D]">Nationwide Delivery</p>
                      <p className="mt-1 text-xs text-ocean/60">
                        Delivered anywhere in Rwanda, from Kigali to every province.
                      </p>
                    </button>
                  </div>

                  <AnimatePresence>
                    {fulfillment === "delivery" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-4 rounded-[22px] border border-ocean/10 bg-white/60 p-6 shadow-[0_10px_30px_rgba(11,84,151,0.06)] backdrop-blur-sm">
                          <div>
                            <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-ocean/70">
                              <MapPin className="h-3.5 w-3.5" /> Province
                            </label>
                            <select
                              value={province}
                              onChange={(e) => setProvince(e.target.value)}
                              className="w-full cursor-pointer rounded-input border border-ocean/10 bg-ocean-light/30 px-4 py-2.5 text-sm text-ocean transition-all duration-200 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                            >
                              {PROVINCES.map((p) => (
                                <option key={p.name} value={p.name}>
                                  {p.name} — RWF {formatPrice(p.fee)} • {p.eta}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-ocean/70">
                                District / Sector
                              </label>
                              <input
                                type="text"
                                value={formData.district}
                                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                placeholder="e.g. Gasabo, Nyarugenge..."
                                className="w-full rounded-input border border-ocean/10 bg-ocean-light/30 px-4 py-2.5 text-sm text-ocean transition-all duration-200 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                              />
                              {errors.district && <p className="mt-1 text-xs text-red-500">{errors.district}</p>}
                            </div>
                            <div>
                              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-ocean/70">
                                Delivery Address
                              </label>
                              <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Street, landmark, house number..."
                                className="w-full rounded-input border border-ocean/10 bg-ocean-light/30 px-4 py-2.5 text-sm text-ocean transition-all duration-200 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                              />
                              {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* ── Right column: sticky order summary ───────────────────── */}
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-28">
                  <div className="overflow-hidden rounded-[28px] border border-white/60 bg-white/80 shadow-[0_24px_70px_rgba(11,84,151,0.12)] backdrop-blur-xl">
                    <div className="border-b border-ocean/10 bg-ocean-light/30 px-6 py-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ocean/60">
                        Order Summary
                      </p>
                    </div>

                    <div className="space-y-4 p-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-ocean-light/40">
                          <img
                            src={selectedProduct.image}
                            alt={selectedProduct.title}
                            className="h-full w-full object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#10233D]">{selectedProduct.title}</p>
                          <p className="text-xs text-ocean/55">{selectedProduct.category}</p>
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-ocean/10 pt-4 text-sm">
                        <div className="flex items-center justify-between text-ocean/70">
                          <span>Device Price</span>
                          <span className="font-medium text-ocean">
                            {selectedProduct.currency} {formatPrice(selectedProduct.price)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-ocean/70">
                          <span>{fulfillment === "pickup" ? "Store Pickup" : `Delivery • ${province}`}</span>
                          <span className="font-medium text-ocean">
                            {deliveryFee === 0 ? "Free" : `RWF ${formatPrice(deliveryFee)}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-ocean/10 pt-4">
                        <span className="text-sm font-semibold text-[#10233D]">Estimated Total</span>
                        <span className="font-space text-lg font-bold text-ocean">
                          {selectedProduct.currency} {formatPrice(total)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-xs text-ocean/70">
                        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>No payment now. Pay on pickup or delivery.</span>
                      </div>

                      <Button variant="primary" type="submit" className="w-full gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        Submit Order Request
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </section>

      {/* ── Delivery coverage ────────────────────────────────────────────── */}
      <section className="border-y border-black/5 bg-white/30 px-6 py-20 md:px-12">
        <div className="mx-auto max-w-[1320px]">
          <div className="max-w-2xl space-y-4">
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              NATIONWIDE COVERAGE
            </span>
            <h2 className="font-clash text-3xl font-bold leading-tight text-[#10233D] sm:text-4xl">
              We Deliver Across Rwanda
            </h2>
            <p className="text-sm leading-relaxed text-ocean/70 sm:text-base">
              From same-day pickup in Kigali to nationwide delivery, wherever you are in Rwanda,
              your device can reach you.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {PROVINCES.map((p) => (
              <div
                key={p.name}
                className="rounded-[22px] border border-ocean/10 bg-white/60 p-5 shadow-[0_10px_30px_rgba(11,84,151,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(11,84,151,0.12)]"
              >
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-ocean-light/60 text-ocean">
                  <MapPin className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-[#10233D]">{p.name}</p>
                <p className="mt-1 text-xs text-ocean/60">{p.eta}</p>
                <p className="mt-2 font-space text-sm font-bold text-ocean">RWF {formatPrice(p.fee)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust cards ──────────────────────────────────────────────────── */}
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-[1320px]">
          <div className="max-w-2xl space-y-4">
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              WHY ORDER WITH US
            </span>
            <h2 className="font-clash text-3xl font-bold leading-tight text-[#10233D] sm:text-4xl">
              A Trustworthy Way to Order
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="rounded-[24px] border border-ocean/10 bg-white/60 p-6 shadow-[0_10px_30px_rgba(11,84,151,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-ocean/25 hover:shadow-[0_20px_50px_rgba(11,84,151,0.12)]"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-ocean text-ivory shadow-[0_10px_24px_rgba(11,84,151,0.22)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-clash text-base font-bold text-[#10233D]">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ocean/65">{card.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 space-y-4 text-center">
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              GOOD TO KNOW
            </span>
            <h2 className="font-clash text-3xl font-bold leading-tight text-[#10233D] sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-[20px] border border-ocean/10 bg-white/60 shadow-[0_6px_20px_rgba(11,84,151,0.05)] backdrop-blur-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-sm font-semibold text-[#10233D] sm:text-base">{item.q}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-ocean/60 transition-transform duration-300",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-sm leading-relaxed text-ocean/70">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3 rounded-[24px] border border-ocean/10 bg-ocean-light/30 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 shrink-0 text-accent" />
              <p className="text-sm text-ocean/75">
                Still have questions? Our concierge team is ready to help.
              </p>
            </div>
            <a href="tel:+250788123456">
              <Button variant="secondary" className="gap-2 whitespace-nowrap">
                <Phone className="h-4 w-4" />
                +250 788 123 456
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
