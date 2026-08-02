"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, MessageSquareText } from "lucide-react";
import { Button } from "./button";
import { submitQuoteRequest } from "@/actions/order-request";

interface QuoteRequestModalProps {
  open: boolean;
  product: {
    id: string;
    slug: string;
    title: string;
    price: number;
    currency: string;
    image?: string;
  } | null;
  variant?: string;
  onClose: () => void;
}

export function QuoteRequestModal({ open, product, variant, onClose }: QuoteRequestModalProps) {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!open || !product) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const result = await submitQuoteRequest({
      product_id: product.id,
      product_slug: product.slug,
      product_name: product.title,
      variant,
      ...formData,
    });
    setSubmitting(false);
    if (result?.error) {
      setErrors({ form: result.error });
      return;
    }
    setSubmitted(true);
  };

  const reset = () => {
    setSubmitted(false);
    setFormData({ name: "", phone: "", email: "", notes: "" });
    setErrors({});
  };

  const inputClass =
    "w-full rounded-input border border-ocean/10 bg-ocean-light/30 px-4 py-2.5 text-sm text-ocean transition-all duration-200 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0B1B2E]/45 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-[32px] border border-white/60 bg-white/95 p-8 shadow-[0_30px_90px_rgba(11,84,151,0.28)] backdrop-blur-xl"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-ocean/50 transition-all duration-200 hover:bg-ocean/5 hover:text-ocean"
            aria-label="Close quote dialog"
          >
            <X className="h-5 w-5" />
          </button>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ocean text-ivory shadow-[0_12px_24px_rgba(11,84,151,0.25)]">
                  <MessageSquareText className="h-5 w-5" />
                </div>
                <div>
                  <span className="mb-1 block text-caption font-semibold uppercase tracking-[0.2em] text-ocean/50">
                    Request a Quote
                  </span>
                  <h3 className="font-clash text-2xl font-bold leading-tight text-[#10233D]">
                    {product.title}
                  </h3>
                  <p className="mt-1 text-xs text-ocean/60">
                    Tell us what you need — we&apos;ll reply with availability and best pricing.
                  </p>
                </div>
              </div>

              {product.image && (
                <div className="flex items-center gap-4 rounded-[20px] border border-ocean/10 bg-white/60 p-4 shadow-[0_10px_30px_rgba(11,84,151,0.06)] backdrop-blur-sm">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-16 w-16 rounded-md object-contain"
                  />
                  <div>
                    <h4 className="font-clash text-sm font-bold text-[#10233D]">{product.title}</h4>
                    <span className="font-space text-sm font-semibold text-accent">
                      {product.currency} {new Intl.NumberFormat("en-US").format(product.price)}
                    </span>
                    {variant && (
                      <span className="ml-2 rounded-full border border-ocean/10 bg-ivory px-2 py-0.5 text-caption font-semibold text-ocean/70">
                        {variant}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-caption font-medium uppercase tracking-[0.05em] text-ocean/70">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                    placeholder="Enter your name"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-caption font-medium uppercase tracking-[0.05em] text-ocean/70">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={inputClass}
                      placeholder="e.g. +250 785 288 910"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-caption font-medium uppercase tracking-[0.05em] text-ocean/70">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputClass}
                      placeholder="name@domain.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-caption font-medium uppercase tracking-[0.05em] text-ocean/70">
                    Notes (optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className={`${inputClass} resize-none`}
                    placeholder="Quantity, preferred variant, questions..."
                  />
                </div>
              </div>

              {errors.form && (
                <p className="text-xs font-semibold text-red-500">{errors.form}</p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="ghost" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={submitting} className="gap-2">
                  {submitting ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : (
                    <MessageSquareText className="h-4 w-4" />
                  )}
                  {submitting ? "Sending..." : "Request Quote"}
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
                <h3 className="font-clash text-2xl font-bold text-[#10233D]">Request Received</h3>
                <p className="mx-auto max-w-sm text-sm text-ocean/70">
                  Thank you, <strong className="text-ocean">{formData.name}</strong>. Our team will
                  get back to you shortly about the{" "}
                  <strong className="text-ocean">{product.title}</strong>.
                </p>
              </div>

              <div className="space-y-2 rounded-[20px] border border-ocean/10 bg-white/60 p-4 text-left text-xs text-ocean/70 shadow-[0_10px_30px_rgba(11,84,151,0.06)] backdrop-blur-sm">
                <p><strong>Support Phone:</strong> +250 785 288 910</p>
                <p><strong>Email:</strong> hello@galaxyhub.rw</p>
              </div>

              <Button variant="secondary" onClick={() => { reset(); onClose(); }} className="w-full">
                Done
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
