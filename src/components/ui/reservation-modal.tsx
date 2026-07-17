"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Shield, ShoppingBag, ArrowRight } from "lucide-react";
import { Product } from "@/data/mock-data";
import { Button } from "./button";
import confetti from "canvas-confetti";

interface ReservationModalProps {
  product: Product | null;
  onClose: () => void;
  onSuccess?: (product: Product) => void;
}

export function ReservationModal({ product, onClose, onSuccess }: ReservationModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [formData, setFormData] = useState(() => ({
    name: "",
    phone: "",
    email: "",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // default tomorrow
    notes: "",
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reservationId, setReservationId] = useState("");

  if (!product) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }
    if (!formData.date) newErrors.date = "Pick up date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setStep("success");
      setReservationId(`GH-${Math.floor(100000 + Math.random() * 900000)}`);
      onSuccess?.(product);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#0b5497", "#e6f0fa", "#0f70c9"],
      });
    }
  };

  const formattedPrice = new Intl.NumberFormat("en-US").format(product.price);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Ocean overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0B1B2E]/45 backdrop-blur-md"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-[32px] border border-white/60 bg-white/95 p-8 shadow-[0_30px_90px_rgba(11,84,151,0.28)] backdrop-blur-xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-ocean/50 transition-all duration-200 hover:bg-ocean/5 hover:text-ocean"
            aria-label="Close reservation dialog"
          >
            <X className="h-5 w-5" />
          </button>

          {step === "form" ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ocean text-ivory shadow-[0_12px_24px_rgba(11,84,151,0.25)]">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-ocean/50">
                    Product Showroom Order
                  </span>
                  <h3 className="font-clash text-2xl font-bold leading-tight text-[#10233D]">
                    Order Now: {product.title}
                  </h3>
                  <p className="mt-1 text-xs text-ocean/60">
                    No instant payment required. Confirm your order to inspect and collect in-store.
                  </p>
                </div>
              </div>

              {/* Product Preview Panel */}
              <div className="flex items-center gap-4 rounded-[20px] border border-ocean/10 bg-white/60 p-4 shadow-[0_10px_30px_rgba(11,84,151,0.06)] backdrop-blur-sm">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-16 w-16 rounded-md object-contain"
                />
                <div>
                  <h4 className="font-clash text-sm font-bold text-[#10233D]">{product.title}</h4>
                  <span className="font-space text-sm font-semibold text-accent">
                    {product.currency} {formattedPrice}
                  </span>
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.05em] text-ocean/70">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-input border border-ocean/10 bg-ocean-light/30 px-4 py-2.5 text-sm text-ocean transition-all duration-200 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
                    placeholder="Enter your name"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.05em] text-ocean/70">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-input border border-ocean/10 bg-ocean-light/30 px-4 py-2.5 text-sm text-ocean transition-all duration-200 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
                      placeholder="e.g. +250 785 288 910"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.05em] text-ocean/70">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-input border border-ocean/10 bg-ocean-light/30 px-4 py-2.5 text-sm text-ocean transition-all duration-200 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
                      placeholder="name@domain.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.05em] text-ocean/70">
                    Preferred Showroom Visit Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-input border border-ocean/10 bg-ocean-light/30 px-4 py-2.5 text-sm text-ocean transition-all duration-200 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
                  />
                  {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
                </div>
              </div>

              {/* Security trust chip */}
              <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-xs text-ocean/70">
                <Shield className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Immediate confirmation. Collect and verify quality before final payment.</span>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="ghost" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="gap-2 px-8">
                  <ShoppingBag className="h-4 w-4" />
                  Order Now
                </Button>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 py-4 text-center"
            >
              <div className="mx-auto -mt-2 mb-2 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle className="h-10 w-10" />
              </div>

              <div className="space-y-2">
                <h3 className="font-clash text-2xl font-bold text-[#10233D]">Order Confirmed</h3>
                <p className="mx-auto max-w-sm text-sm text-ocean/70">
                  Thank you, <strong className="text-ocean">{formData.name}</strong>. Your order for the{" "}
                  <strong className="text-ocean">{product.title}</strong> has been secured.
                </p>
              </div>

              <div className="space-y-2 rounded-[20px] border border-ocean/10 bg-white/60 p-4 text-left text-xs text-ocean/70 shadow-[0_10px_30px_rgba(11,84,151,0.06)] backdrop-blur-sm">
                <p><strong>Order ID:</strong> {reservationId}</p>
                <p><strong>Showroom Visit:</strong> {formData.date}</p>
                <p><strong>Support Phone:</strong> +250 785 288 910</p>
              </div>

              <p className="text-xs text-ocean/50">
                A confirmation summary has been sent to <span className="underline">{formData.email}</span>.
              </p>

              <div className="overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#0F6BC0_0%,#0B5497_48%,#083E70_100%)] p-5 shadow-[0_18px_50px_rgba(11,84,151,0.28)]">
                <p className="mb-3 text-sm text-white/85">
                  Continue browsing while your device is prepared in-store.
                </p>
                <Button
                  variant="primary"
                  onClick={onClose}
                  className="w-full gap-2 bg-[#FFFEF9] text-ocean hover:bg-white"
                >
                  Return to Showroom
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
