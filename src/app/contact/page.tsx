"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
  Store,
  User,
} from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import Footer from "@/components/ui/Footer";
import { Button } from "@/components/ui/button";
import { submitContactMessage } from "@/actions/contact";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter a valid email address";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const result = await submitContactMessage(formData);
    setSubmitting(false);
    if (result?.error) {
      setErrors({ form: result.error });
      return;
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startNewMessage = () => {
    setSubmitted(false);
    setFormData(initialForm);
    setErrors({});
  };

  /* Input class — uses .input-refined from globals.css */
  const inputClass = (hasError?: boolean) =>
    `input-refined${hasError ? " input-error" : ""}`;

  const fieldLabel =
    "mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-ocean/50";

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-ocean-deeper font-sans">
      <Navbar />

      <main className="flex-1 pt-[96px] pb-0">

        {/* ── Editorial Header ── */}
        <section className="mx-auto max-w-[1320px] w-full px-5 pt-10 pb-12 sm:px-8 md:pt-16 md:pb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-ocean/50 transition-colors duration-150 hover:text-ocean mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Shop
          </Link>

          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-ocean/[0.12] bg-ocean/[0.06] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-ocean">
              Contact Us
            </span>
            <h1
              className="mt-6 font-display font-bold leading-[1.04] tracking-[-0.02em] text-ocean-deeper"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 3.75rem)" }}
            >
              Get in Touch
            </h1>
            <p className="mt-5 text-[1rem] leading-[1.7] text-ocean-deeper/55 max-w-lg">
              Have questions about device availability, warranties, or custom configurations? Reach our Kigali shop directly.
            </p>
          </div>
        </section>

        {/* ── Two-Column Grid ── */}
        <section className="mx-auto max-w-[1320px] w-full px-5 pb-16 sm:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">

            {/* ── LEFT: Contact Info ── */}
            <div className="lg:col-span-5 space-y-5">

              {/* Store Info Card */}
              <div className="rounded-[22px] border border-ocean/[0.07] bg-white p-7 shadow-card-premium space-y-5">
                <h2 className="font-display text-[15px] font-bold text-ocean-deeper flex items-center gap-2">
                  <Store className="h-4 w-4 text-accent shrink-0" />
                  Store Location
                </h2>

                <div className="space-y-4 text-[14px]">
                  <div className="flex items-start gap-3">
                    <div className="mt-[3px] flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ocean/[0.07]">
                      <MapPin className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <div>
                      <span className="font-semibold block text-ocean-deeper text-[13px]">Shop Address</span>
                      <span className="text-ocean/55 mt-0.5 block leading-snug">KN 70 St, Kigali, Rwanda</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-[3px] flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ocean/[0.07]">
                      <Clock className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <div>
                      <span className="font-semibold block text-ocean-deeper text-[13px]">Store Hours</span>
                      <span className="text-ocean/55 mt-0.5 block">Monday – Saturday: 9:00 AM – 8:00 PM</span>
                      <span className="text-ocean/35 text-[12px] mt-0.5 block">Sunday: Closed</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-[3px] flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ocean/[0.07]">
                      <Phone className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <div>
                      <span className="font-semibold block text-ocean-deeper text-[13px]">Phone Line</span>
                      <a href="tel:+250785288910" className="text-ocean hover:text-accent font-semibold mt-0.5 block transition-colors duration-150">
                        +250 785 288 910
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-[3px] flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ocean/[0.07]">
                      <Mail className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <div>
                      <span className="font-semibold block text-ocean-deeper text-[13px]">Email Address</span>
                      <a href="mailto:hello@galaxyhub.rw" className="text-ocean hover:text-accent font-semibold mt-0.5 block transition-colors duration-150">
                        hello@galaxyhub.rw
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Card */}
              <div className="rounded-[22px] border border-emerald-100/80 bg-emerald-50/60 p-7 shadow-card-premium">
                <h3 className="font-display text-[14px] font-bold text-emerald-900 flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-emerald-600 shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.108-.014.32-.13.517-.295.198-.164.326-.332.396-.531.07-.198.07-.37-.005-.52-.074-.148-.272-.222-.57-.37zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                  Need Instant Answers?
                </h3>
                <p className="mt-2.5 text-[13px] text-emerald-800/80 leading-[1.65]">
                  Connect with our shop sales representatives directly on WhatsApp. We answer questions about real-time stock, pricing, and custom imports.
                </p>
                <a
                  href="https://wa.me/250785288910"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[13px] bg-emerald-600 h-[46px] text-[14px] font-bold text-white transition-all duration-[200ms] hover:bg-emerald-700 hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(16,185,129,0.20)] active:translate-y-0"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.108-.014.32-.13.517-.295.198-.164.326-.332.396-.531.07-.198.07-.37-.005-.52-.074-.148-.272-.222-.57-.37zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-[200ms] group-hover:translate-x-[3px]" />
                </a>
              </div>
            </div>

            {/* ── RIGHT: Contact Form ── */}
            <div className="lg:col-span-7 lg:order-2">
              <div className="rounded-[24px] border border-ocean/[0.07] bg-white p-8 shadow-card-premium md:p-10">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="flex min-h-[480px] flex-col items-center justify-center py-10 text-center"
                    >
                      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <CheckCircle2 className="h-7 w-7" />
                      </div>
                      <h2 className="font-display text-[22px] font-bold text-ocean-deeper">
                        Message Sent!
                      </h2>
                      <p className="mt-3 text-[14px] text-ocean/60 leading-[1.7] max-w-md mx-auto">
                        Thanks, <strong className="text-ocean-deeper">{formData.name}</strong>. We have received your query and will reply shortly. For instant replies, call or chat on WhatsApp.
                      </p>
                      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <a
                          href="https://wa.me/250785288910"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full sm:w-auto"
                        >
                          <Button variant="primary" className="w-full sm:w-auto gap-2 justify-center">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.108-.014.32-.13.517-.295.198-.164.326-.332.396-.531.07-.198.07-.37-.005-.52-.074-.148-.272-.222-.57-.37zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                            </svg>
                            WhatsApp Chat
                          </Button>
                        </a>
                        <a href="tel:+250785288910" className="block w-full sm:w-auto">
                          <Button variant="secondary" className="w-full sm:w-auto gap-2 justify-center">
                            <Phone className="h-4 w-4" />
                            Call Now
                          </Button>
                        </a>
                      </div>
                      <div className="mt-8">
                        <button
                          type="button"
                          onClick={startNewMessage}
                          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-ocean/50 hover:text-ocean transition-colors duration-150 cursor-pointer"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                          Send another message
                        </button>
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
                      noValidate
                    >
                      <h2 className="font-display text-[17px] font-bold text-ocean-deeper pb-4 mb-6 border-b border-ocean/[0.07]">
                        Send Us a Message
                      </h2>

                      {/* Row 1: Name + Phone */}
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                          <label htmlFor="contact-name" className={fieldLabel}>
                            <User className="mr-1 inline h-3.5 w-3.5 align-[-2px]" />
                            Full Name *
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Full name"
                            className={inputClass(!!errors.name)}
                          />
                          {errors.name && (
                            <p className="mt-1.5 text-[12px] font-medium text-red-500">{errors.name}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="contact-phone" className={fieldLabel}>
                            <Phone className="mr-1 inline h-3.5 w-3.5 align-[-2px]" />
                            Phone Number *
                          </label>
                          <input
                            id="contact-phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Phone number"
                            className={inputClass(!!errors.phone)}
                          />
                          {errors.phone && (
                            <p className="mt-1.5 text-[12px] font-medium text-red-500">{errors.phone}</p>
                          )}
                        </div>
                      </div>

                      {/* Row 2: Email */}
                      <div className="mt-5">
                        <label htmlFor="contact-email" className={fieldLabel}>
                          <Mail className="mr-1 inline h-3.5 w-3.5 align-[-2px]" />
                          Email Address *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@example.com"
                          className={inputClass(!!errors.email)}
                        />
                        {errors.email && (
                          <p className="mt-1.5 text-[12px] font-medium text-red-500">{errors.email}</p>
                        )}
                      </div>

                      {/* Row 3: Subject */}
                      <div className="mt-5">
                        <label htmlFor="contact-subject" className={fieldLabel}>
                          Subject *
                        </label>
                        <input
                          id="contact-subject"
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="e.g. Inquiry about iPhone 16 Pro"
                          className={inputClass(!!errors.subject)}
                        />
                        {errors.subject && (
                          <p className="mt-1.5 text-[12px] font-medium text-red-500">{errors.subject}</p>
                        )}
                      </div>

                      {/* Row 4: Message */}
                      <div className="mt-5">
                        <label htmlFor="contact-message" className={fieldLabel}>
                          Message *
                        </label>
                        <textarea
                          id="contact-message"
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell us what you are looking for..."
                          className={`input-refined resize-none leading-relaxed h-auto py-3${errors.message ? " input-error" : ""}`}
                        />
                        {errors.message && (
                          <p className="mt-1.5 text-[12px] font-medium text-red-500">{errors.message}</p>
                        )}
                      </div>

                      {/* Submit */}
                      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={submitting}
                          className="gap-2 justify-center sm:w-auto sm:px-10"
                        >
                          {submitting ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              Send Message
                            </>
                          )}
                        </Button>
                        {errors.form && (
                          <p className="text-[12px] font-semibold text-red-500">{errors.form}</p>
                        )}
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* ── Map Section ── */}
        <section className="mx-auto max-w-[1320px] w-full px-5 pb-20 sm:px-8">
          <h2 className="font-display text-[16px] font-bold text-ocean-deeper mb-5 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent shrink-0" />
            Find Us on the Map
          </h2>
          <div className="w-full h-[380px] rounded-[22px] overflow-hidden border border-ocean/[0.08] shadow-card-premium relative bg-[#e5e3df]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.514482025791!2d30.055845015324507!3d-1.944062098582845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca420d4fbb1c7%3A0xb35a0f2e0f4f9f7a!2sKN%2070%20St%2C%20Kigali!5e0!3m2!1sen!2srw!4v1689945000000!5m2!1sen!2srw"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Galaxy Hub Shop location map - KN 70 St Kigali"
              className="w-full h-full"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
