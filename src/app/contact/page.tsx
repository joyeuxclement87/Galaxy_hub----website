"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  const startNewMessage = () => {
    setSubmitted(false);
    setFormData(initialForm);
    setErrors({});
  };

  const inputClass =
    "w-full rounded-btn border border-ocean/[0.08] bg-ivory/60 px-4 py-2.5 text-base sm:text-sm text-ocean-deeper transition-all focus:border-accent focus:bg-white focus:outline-none placeholder:text-ocean/30";

  const fieldLabel =
    "mb-1.5 block text-caption font-bold uppercase tracking-wider text-ocean/50";

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-ocean-deeper font-sans pt-24">
      <Navbar />

      {/* Header Banner */}
      <section className="relative bg-ivory overflow-hidden border-b border-ocean/[0.06] px-6 py-8 md:px-12">
        <div className="hero-grid-texture absolute inset-0 opacity-40 pointer-events-none" />
        <div className="relative mx-auto max-w-[1320px]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-ocean/60 transition-colors hover:text-ocean mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Shop
          </Link>

          <div>
            <span className="inline-flex items-center rounded-btn bg-ocean/[0.07] px-4 py-1.5 text-caption font-bold uppercase tracking-[0.2em] text-accent mb-2">
              CONTACT US
            </span>
            <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-ocean-deeper">
              Get in Touch
            </h1>
            <p className="mt-1 text-sm text-ocean/60 max-w-xl">
              Have questions about device availability, warranties, or custom configurations? Reach our Kigali shop directly.
            </p>
          </div>
        </div>
      </section>

      {/* Form + Info Grid */}
      <main className="flex-1 mx-auto max-w-[1320px] w-full px-6 py-12 md:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          
          {/* Message Form */}
          <div className="lg:col-span-7">
            <div className="rounded-card border border-ocean/[0.06] bg-white p-6 shadow-sm md:p-8">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="py-10 text-center"
                  >
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h2 className="font-display text-xl font-bold text-ocean-deeper">
                      Message Sent!
                    </h2>
                    <p className="mt-2 text-sm text-ocean/60 leading-relaxed max-w-md mx-auto">
                      Thanks, <strong className="text-ocean-deeper">{formData.name}</strong>. We have received your query and will reply shortly. For instant replies, call or chat on WhatsApp.
                    </p>
                    <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={startNewMessage}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ocean/60 hover:text-ocean transition-colors cursor-pointer"
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
                    <h2 className="font-display text-base font-bold text-ocean-deeper border-b border-ocean/[0.06] pb-3 mb-5">
                      Send Us a Message
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-name" className={fieldLabel}>
                          <User className="mr-1 inline h-3.5 w-3.5 align-[-2px]" /> Full Name *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Full name"
                          className={inputClass}
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                      </div>

                      <div>
                        <label htmlFor="contact-phone" className={fieldLabel}>
                          <Phone className="mr-1 inline h-3.5 w-3.5 align-[-2px]" /> Phone Number *
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Phone number"
                          className={inputClass}
                        />
                        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                      </div>
                    </div>

                    <div className="mt-4">
                      <label htmlFor="contact-email" className={fieldLabel}>
                        <Mail className="mr-1 inline h-3.5 w-3.5 align-[-2px]" /> Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className={inputClass}
                      />
                      {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div className="mt-4">
                      <label htmlFor="contact-subject" className={fieldLabel}>
                        Subject *
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Inquiry about iPhone 16 Pro"
                        className={inputClass}
                      />
                      {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
                    </div>

                    <div className="mt-4">
                      <label htmlFor="contact-message" className={fieldLabel}>
                        Message *
                      </label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us what you are looking for..."
                        className={`${inputClass} resize-none leading-relaxed`}
                      />
                      {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      disabled={submitting}
                      className="mt-6 w-full gap-2 justify-center rounded-btn h-12 text-xs font-bold uppercase tracking-[0.12em] shadow-btn hover:shadow-btn-hover sm:w-auto sm:px-10"
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
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Shop & Info Card */}
            <div className="rounded-card border border-ocean/[0.06] bg-white p-6 shadow-sm space-y-5">
              <h2 className="font-display text-base font-bold text-ocean-deeper border-b border-ocean/[0.06] pb-3 flex items-center gap-2">
                <Store className="h-4 w-4 text-accent" /> Store Location
              </h2>
              
              <div className="space-y-3.5 text-sm">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                  <div>
                    <span className="font-bold block text-ocean-deeper">Shop Address</span>
                    <span className="text-ocean/60 mt-0.5 block">KN 70 St, Kigali, Rwanda</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                  <div>
                    <span className="font-bold block text-ocean-deeper">Store Hours</span>
                    <span className="text-ocean/60 mt-0.5 block">Monday – Saturday: 9:00 AM – 8:00 PM</span>
                    <span className="text-ocean/40 text-xs mt-0.5 block">Sunday: Closed</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                  <div>
                    <span className="font-bold block text-ocean-deeper">Phone Line</span>
                    <a href="tel:+250785288910" className="text-ocean hover:text-accent font-semibold mt-0.5 block">
                      +250 785 288 910
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                  <div>
                    <span className="font-bold block text-ocean-deeper">Email Address</span>
                    <a href="mailto:hello@galaxyhub.rw" className="text-ocean hover:text-accent font-semibold mt-0.5 block">
                      hello@galaxyhub.rw
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Chat CTA Card */}
            <div className="rounded-card border border-emerald-100 bg-emerald-50/50 p-6 shadow-sm">
              <h3 className="font-display text-sm font-bold text-emerald-900 flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-emerald-600">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.108-.014.32-.13.517-.295.198-.164.326-.332.396-.531.07-.198.07-.37-.005-.52-.074-.148-.272-.222-.57-.37zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                Need Instant Answers?
              </h3>
              <p className="mt-2 text-xs text-emerald-800 leading-relaxed">
                Connect with our shop sales representatives directly on WhatsApp. We answer questions about real-time stock, pricing, and custom imports.
              </p>
              <a
                href="https://wa.me/250785288910"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-btn bg-emerald-600 h-11 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-emerald-700 active:scale-[0.98]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.108-.014.32-.13.517-.295.198-.164.326-.332.396-.531.07-.198.07-.37-.005-.52-.074-.148-.272-.222-.57-.37zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>

          </div>
        </div>
      </main>

      {/* Map Section */}
      <section className="mx-auto max-w-[1320px] w-full px-6 pb-16 md:px-12">
        <h2 className="font-display text-lg font-bold text-ocean-deeper mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-accent" /> Find Us on the Map
        </h2>
        <div className="w-full h-[400px] rounded-card overflow-hidden border border-ocean/[0.08] shadow-sm relative bg-[#e5e3df]">
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

      <Footer />
    </div>
  );
}
