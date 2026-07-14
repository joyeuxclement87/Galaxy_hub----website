"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Phone, CheckCircle, Shield } from "lucide-react";
import { Product } from "@/data/mock-data";
import { Button } from "./button";
import confetti from "canvas-confetti";

interface ReservationModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ReservationModal({ product, onClose }: ReservationModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setStep("form");
      setFormData({
        name: "",
        phone: "",
        email: "",
        date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // default tomorrow
        notes: "",
      });
      setErrors({});
    }
  }, [product]);

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Glass overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-ocean/20 backdrop-blur-md"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 24 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-lg bg-white/95 rounded-card p-8 shadow-premium border border-black/5 z-10 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-ocean/50 hover:text-ocean hover:bg-ocean/5 rounded-full transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>

          {step === "form" ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-ocean/50 block mb-1">
                  Product Showroom Reservation
                </span>
                <h3 className="font-sora text-2xl font-bold text-ocean leading-tight">
                  Reserve {product.title}
                </h3>
                <p className="text-xs text-ocean/60 mt-1">
                  No instant payment required. Confirm reservation to inspect and collect in-store.
                </p>
              </div>

              {/* Product Preview Panel */}
              <div className="flex items-center gap-4 bg-ocean/5 p-4 rounded-input border border-ocean/5">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-16 h-16 object-contain rounded-md"
                />
                <div>
                  <h4 className="font-sora text-sm font-bold text-ocean">{product.title}</h4>
                  <span className="font-space text-sm font-semibold text-accent">
                    {product.currency} {formattedPrice}
                  </span>
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.05em] font-medium text-ocean/70 mb-1.5 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-ocean-light/30 border border-ocean/10 rounded-input px-4 py-2.5 text-sm text-ocean focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200"
                    placeholder="Enter your name"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.05em] font-medium text-ocean/70 mb-1.5 block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-ocean-light/30 border border-ocean/10 rounded-input px-4 py-2.5 text-sm text-ocean focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200"
                      placeholder="e.g. +250 788 000 000"
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.05em] font-medium text-ocean/70 mb-1.5 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-ocean-light/30 border border-ocean/10 rounded-input px-4 py-2.5 text-sm text-ocean focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200"
                      placeholder="name@domain.com"
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.05em] font-medium text-ocean/70 mb-1.5 block">
                    Preferred Showroom Visit Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-ocean-light/30 border border-ocean/10 rounded-input px-4 py-2.5 text-sm text-ocean focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200"
                  />
                  {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                </div>
              </div>

              {/* Security trust badge */}
              <div className="flex items-center gap-2 text-xs text-ocean/60 bg-emerald-50 border border-emerald-100 p-3 rounded-input">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Immediate confirmation. Collect and verify quality before final payment.</span>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="ghost" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="px-8">
                  Confirm Reservation
                </Button>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-6"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-2">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="font-sora text-2xl font-bold text-ocean">Reservation Complete</h3>
                <p className="text-sm text-ocean/70 max-w-sm mx-auto">
                  Thank you, <strong className="text-ocean">{formData.name}</strong>. Your reservation for the <strong className="text-ocean">{product.title}</strong> has been secured.
                </p>
              </div>

              <div className="bg-ocean/5 p-4 rounded-input text-xs text-left text-ocean/70 space-y-2 border border-ocean/5">
                <p><strong>Reservation ID:</strong> GH-{Math.floor(100000 + Math.random() * 900000)}</p>
                <p><strong>Showroom Visit:</strong> {formData.date}</p>
                <p><strong>Support Phone:</strong> +250 788 123 456</p>
              </div>

              <p className="text-xs text-ocean/50">
                A confirmation summary has been sent to <span className="underline">{formData.email}</span>.
              </p>

              <div className="pt-4">
                <Button variant="primary" onClick={onClose} className="w-full">
                  Return to Showroom
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
