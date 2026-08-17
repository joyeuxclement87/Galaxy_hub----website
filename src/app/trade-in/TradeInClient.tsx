"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Check, CheckCircle2, Loader2, X, ImagePlus, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";
import { submitTradeIn } from "@/actions/trade-ins";
import { BRAND_CATALOG } from "@/data/brands";
import type { TradeInEligibleProduct } from "@/data/public-products";
import {
  DEVICE_CONDITIONS,
  SCREEN_CONDITIONS,
  BATTERY_CONDITIONS,
  FUNCTIONAL_STATUSES,
  ACCESSORY_OPTIONS,
  STORAGE_OPTIONS,
  MAX_TRADE_IN_PHOTOS,
} from "@/lib/trade-in";

/* ─── Types ──────────────────────────────────────────────────────────────── */

type StepKey = "wanted" | "trade" | "condition" | "contact" | "review";

const STEPS: { key: StepKey; label: string }[] = [
  { key: "wanted", label: "Upgrade" },
  { key: "trade", label: "Trade-In" },
  { key: "condition", label: "Condition" },
  { key: "contact", label: "Contact" },
  { key: "review", label: "Review" },
];

interface FormState {
  wanted_product_id: string;
  wanted_product_storage: string;
  trade_device_brand: string;
  trade_device_model: string;
  trade_device_storage: string;
  device_condition: string;
  screen_condition: string;
  battery_condition: string;
  functional_status: string;
  accessories: string[];
  faults: string;
  customer_notes: string;
  customer_name: string;
  phone: string;
  email: string;
}

/* ─── Photo compression (client-side, keeps uploads small) ───────────────── */

const MAX_IMAGE_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

async function compressImage(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
    );
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

/* ─── Small UI pieces ────────────────────────────────────────────────────── */

function StepLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-2 block text-caption font-bold uppercase tracking-[0.18em] text-ocean/45">
      {children}
    </span>
  );
}

function InputError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-[12px] font-medium text-red-500">{message}</p>;
}

function ChoiceGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <StepLabel>{label}</StepLabel>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "min-h-[44px] cursor-pointer rounded-btn border px-3 py-2.5 text-sm font-semibold transition-all duration-200 text-left",
              value === option.value
                ? "border-ocean bg-ocean text-white shadow-btn"
                : "border-ocean/[0.12] bg-white text-ocean-deeper/70 hover:border-ocean/30 hover:text-ocean"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function DeviceRow({ label, name, sub }: { label: string; name: string; sub?: string }) {
  return (
    <div className="rounded-btn border border-ocean/[0.08] bg-ivory/60 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ocean/40">{label}</p>
      <p className="mt-1 text-sm font-bold text-ocean-deeper">{name}</p>
      {sub && <p className="text-[13px] text-ocean-deeper/55">{sub}</p>}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function TradeInClient({
  products,
  preselectedId,
}: {
  products: TradeInEligibleProduct[];
  preselectedId: string | null;
}) {
  const initialProduct = products.find((p) => p.id === preselectedId) ?? null;

  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(() => ({
    wanted_product_id: initialProduct?.id ?? "",
    wanted_product_storage: initialProduct?.storage_options[0] ?? "",
    trade_device_brand: "",
    trade_device_model: "",
    trade_device_storage: "",
    device_condition: DEVICE_CONDITIONS[0].value,
    screen_condition: SCREEN_CONDITIONS[0].value,
    battery_condition: BATTERY_CONDITIONS[0].value,
    functional_status: FUNCTIONAL_STATUSES[0].value,
    accessories: [],
    faults: "",
    customer_notes: "",
    customer_name: "",
    phone: "",
    email: "",
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [tradeInId, setTradeInId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedWanted = products.find((p) => p.id === form.wanted_product_id) ?? null;

  const set = (field: keyof FormState, value: string | string[]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const pickWanted = (id: string) => {
    const product = products.find((p) => p.id === id) ?? null;
    setForm((prev) => ({
      ...prev,
      wanted_product_id: id,
      wanted_product_storage: product?.storage_options[0] ?? "",
    }));
  };

  const changeWanted = () => {
    setForm((prev) => ({ ...prev, wanted_product_id: "", wanted_product_storage: "" }));
  };

  const validateStep = (key: StepKey): boolean => {
    const next: Record<string, string> = {};
    if (key === "wanted") {
      if (!form.wanted_product_id) next.wanted_product_id = "Please select the device you'd like to upgrade to.";
      else if (!selectedWanted) next.wanted_product_id = "This product is currently unavailable. Please choose another device.";
      else if (
        selectedWanted.storage_options.length > 0 &&
        !selectedWanted.storage_options.includes(form.wanted_product_storage)
      ) {
        next.wanted_product_storage = "Please choose a valid storage option.";
      }
    }
    if (key === "trade") {
      if (!form.trade_device_brand) next.trade_device_brand = "Please select your device brand.";
      if (!form.trade_device_model.trim()) next.trade_device_model = "Please enter your device model.";
    }
    if (key === "contact") {
      if (!form.customer_name.trim()) next.customer_name = "Full name is required.";
      if (!form.phone.trim()) {
        next.phone = "Phone number is required.";
      } else if (!/^[+\d][\d\s()-]{6,24}$/.test(form.phone.trim())) {
        next.phone = "Please enter a valid phone number.";
      }
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        next.email = "Please enter a valid email address.";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    const key = STEPS[stepIndex].key;
    if (!validateStep(key)) return;
    setServerError("");
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setServerError("");
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  /* Photo handling — compress + preview, max 4 */
  const addPhotos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = MAX_TRADE_IN_PHOTOS - photos.length;
    if (remaining <= 0) {
      setServerError(`You can upload up to ${MAX_TRADE_IN_PHOTOS} photos.`);
      return;
    }
    const selected = Array.from(files).slice(0, remaining);

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const tooLarge = selected.some((f) => f.size > 5 * 1024 * 1024);
    const badType = selected.some((f) => !validTypes.includes(f.type));
    if (badType) {
      setServerError("Photos must be JPG, PNG or WebP images.");
      return;
    }
    if (tooLarge) {
      setServerError("Each photo must be 5MB or smaller.");
      return;
    }

    setServerError("");
    const compressed = await Promise.all(selected.map((f) => compressImage(f)));
    const newUrls = compressed.map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...compressed]);
    setPreviews((prev) => [...prev, ...newUrls]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async () => {
    setServerError("");
    setSubmitting(true);

    const payload = new FormData();
    payload.append("customer_name", form.customer_name.trim());
    payload.append("phone", form.phone.trim());
    if (form.email.trim()) payload.append("email", form.email.trim());
    payload.append("wanted_product_id", form.wanted_product_id);
    if (form.wanted_product_storage) payload.append("wanted_product_storage", form.wanted_product_storage);
    payload.append("trade_device_brand", form.trade_device_brand);
    payload.append("trade_device_model", form.trade_device_model.trim());
    if (form.trade_device_storage) payload.append("trade_device_storage", form.trade_device_storage);
    payload.append("device_condition", form.device_condition);
    payload.append("screen_condition", form.screen_condition);
    payload.append("battery_condition", form.battery_condition);
    payload.append("functional_status", form.functional_status);
    form.accessories.forEach((a) => payload.append("accessories", a));
    if (form.faults.trim()) payload.append("faults", form.faults.trim());
    if (form.customer_notes.trim()) payload.append("customer_notes", form.customer_notes.trim());
    photos.forEach((f) => payload.append("photos", f));

    const result = await submitTradeIn(payload);
    setSubmitting(false);

    if (!result.success || !result.trade_in_id) {
      if (result.code === "product_unavailable") {
        // Product went off-sale since the page loaded — reset and ask again.
        changeWanted();
        setStepIndex(0);
      }
      setServerError(result.error || "Something went wrong. Please try again.");
      return;
    }
    setTradeInId(result.trade_in_id);
  };

  const step = STEPS[stepIndex].key;
  const isLastStep = stepIndex === STEPS.length - 1;

  const wantedLabel = selectedWanted
    ? [selectedWanted.brand_name, selectedWanted.name].filter(Boolean).join(" ")
    : "";
  const wantedStorageLabel = form.wanted_product_storage || "—";
  const tradingInLabel = [
    form.trade_device_brand,
    form.trade_device_model,
    form.trade_device_storage,
  ]
    .filter(Boolean)
    .join(" · ");

  /* ── Success screen ── */
  if (tradeInId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        className="mx-auto w-full max-w-xl"
      >
        <div className="rounded-card border border-ocean/[0.08] bg-white px-6 py-12 text-center shadow-card-premium sm:px-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-ocean-deeper">
            Trade-In Request Received
          </h2>

          <div className="mx-auto mt-7 max-w-sm space-y-3 text-left">
            <div className="rounded-btn border border-ocean/[0.08] bg-ivory/60 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ocean/40">
                You&apos;re looking to upgrade to
              </p>
              <p className="mt-1 text-sm font-bold text-ocean-deeper">
                {wantedLabel || "—"}
                {form.wanted_product_storage ? ` · ${form.wanted_product_storage}` : ""}
              </p>
            </div>
            <div className="rounded-btn border border-ocean/[0.08] bg-ivory/60 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ocean/40">
                Trading in
              </p>
              <p className="mt-1 text-sm font-bold text-ocean-deeper">{tradingInLabel || "—"}</p>
            </div>
          </div>

          <div className="mx-auto mt-7 w-fit rounded-btn border border-ocean/10 bg-ocean-light/40 px-6 py-3">
            <p className="text-caption font-bold uppercase tracking-[0.18em] text-ocean/45">
              Trade-In ID
            </p>
            <p className="mt-0.5 font-display text-xl font-bold tracking-tight text-ocean-deeper tabular-nums">
              {tradeInId}
            </p>
          </div>

          <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-ocean-deeper/60">
            We&apos;ll review your device and contact you with the trade-in value and next steps.
          </p>

          <Link
            href="/products"
            className="text-action mx-auto mt-8 min-h-[44px] justify-center"
          >
            Back to Products <ArrowRight className="ta-arrow" />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
      {/* ── Left: editorial intro ── */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="text-sm leading-[1.8] text-ocean-deeper/60">
          Tell us what you&apos;re upgrading to and the device you&apos;re trading in. Our team
          will review it and send you a trade-in value toward your next Galaxy Hub
          purchase — no payment taken upfront.
        </p>

        <ol className="mt-8 space-y-5">
          {[
            { n: "01", t: "Pick your new device", d: "Choose the Galaxy Hub device you want to upgrade to." },
            { n: "02", t: "Tell us what you're trading in", d: "Brand, model, condition and accessories." },
            { n: "03", t: "Receive your offer", d: "We contact you with the trade-in value for your next purchase." },
          ].map((item) => (
            <li key={item.n} className="flex gap-4">
              <span className="font-clash text-lg font-bold leading-none text-ocean/35">
                {item.n}
              </span>
              <div>
                <p className="text-sm font-bold text-ocean-deeper">{item.t}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-ocean-deeper/55">{item.d}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-8 border-t border-ocean/[0.08] pt-5 text-[13px] leading-relaxed text-ocean-deeper/45">
          No value is guaranteed until our team has reviewed your device. Photos help us
          evaluate it faster.
        </p>
      </div>

      {/* ── Right: form card ── */}
      <div className="rounded-card border border-ocean/[0.08] bg-white p-5 shadow-card-premium sm:p-8">
        {/* Progress */}
        <div className="flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex flex-1 flex-col gap-1.5">
              <div
                className={cn(
                  "h-1 rounded-full transition-colors duration-300",
                  i <= stepIndex ? "bg-ocean" : "bg-ocean/[0.10]"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.12em]",
                  i === stepIndex ? "text-ocean" : "text-ocean/35"
                )}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="mt-8"
          >
            {step === "wanted" && (
              <div className="space-y-5">
                <div>
                  <StepLabel>What are you looking to upgrade to?</StepLabel>

                  {!form.wanted_product_id || !selectedWanted ? (
                    <>
                      <select
                        value={form.wanted_product_id}
                        onChange={(e) => pickWanted(e.target.value)}
                        className={cn("input-refined cursor-pointer", errors.wanted_product_id && "input-error")}
                      >
                        <option value="">Select a device…</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {[product.brand_name, product.name].filter(Boolean).join(" ")} — RWF{" "}
                            {product.price.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                          </option>
                        ))}
                      </select>
                      <InputError message={errors.wanted_product_id} />
                      <p className="mt-2 text-[13px] text-ocean-deeper/45">
                        Only currently available devices are listed.
                      </p>
                    </>
                  ) : (
                    <div className="rounded-btn border border-ocean/[0.10] bg-ocean-subtle p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ocean/45">
                        Upgrading to
                      </p>
                      <p className="mt-1 font-display text-lg font-bold text-ocean-deeper">
                        {wantedLabel}
                      </p>

                      {selectedWanted.storage_options.length > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {selectedWanted.storage_options.map((option) => {
                            const active = form.wanted_product_storage === option;
                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() => set("wanted_product_storage", option)}
                                className={cn(
                                  "min-h-[44px] cursor-pointer rounded-btn border px-4 text-sm font-semibold transition-all duration-200",
                                  active
                                    ? "border-ocean bg-ocean text-white shadow-btn"
                                    : "border-ocean/[0.15] bg-white text-ocean-deeper/70 hover:border-ocean/35 hover:text-ocean"
                                )}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={changeWanted}
                        className="mt-4 min-h-[44px] cursor-pointer text-sm font-semibold text-ocean transition-colors hover:text-ocean-dark"
                      >
                        Change device
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === "trade" && (
              <div className="space-y-5">
                <div>
                  <StepLabel>What are you trading in?</StepLabel>
                  <p className="mb-4 text-[13px] leading-relaxed text-ocean-deeper/55">
                    Tell us about your current device — it doesn&apos;t need to be a product
                    sold by Galaxy Hub.
                  </p>

                  <select
                    value={form.trade_device_brand}
                    onChange={(e) => set("trade_device_brand", e.target.value)}
                    className={cn("input-refined cursor-pointer", errors.trade_device_brand && "input-error")}
                  >
                    <option value="">Select brand…</option>
                    {BRAND_CATALOG.map((brand) => (
                      <option key={brand.slug} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                    <option value="Other">Other brand</option>
                  </select>
                  <InputError message={errors.trade_device_brand} />
                </div>

                <div>
                  <StepLabel>Device Model</StepLabel>
                  <input
                    type="text"
                    value={form.trade_device_model}
                    onChange={(e) => set("trade_device_model", e.target.value)}
                    placeholder="e.g. iPhone 13, Galaxy S21"
                    maxLength={120}
                    className={cn("input-refined", errors.trade_device_model && "input-error")}
                  />
                  <InputError message={errors.trade_device_model} />
                </div>

                <div>
                  <StepLabel>Storage (optional)</StepLabel>
                  <select
                    value={form.trade_device_storage}
                    onChange={(e) => set("trade_device_storage", e.target.value)}
                    className="input-refined cursor-pointer"
                  >
                    <option value="">Not sure / other</option>
                    {STORAGE_OPTIONS.filter((o) => o !== "Not sure").map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {step === "condition" && (
              <div className="space-y-6">
                <div>
                  <StepLabel>Tell us about its condition</StepLabel>
                  <p className="mb-4 text-[13px] leading-relaxed text-ocean-deeper/55">
                    Condition of the device you&apos;re trading in.
                  </p>
                </div>
                <ChoiceGroup
                  label="Device condition"
                  options={DEVICE_CONDITIONS}
                  value={form.device_condition}
                  onChange={(v) => set("device_condition", v)}
                />
                <ChoiceGroup
                  label="Screen condition"
                  options={SCREEN_CONDITIONS}
                  value={form.screen_condition}
                  onChange={(v) => set("screen_condition", v)}
                />
                <ChoiceGroup
                  label="Battery condition"
                  options={BATTERY_CONDITIONS}
                  value={form.battery_condition}
                  onChange={(v) => set("battery_condition", v)}
                />
                <ChoiceGroup
                  label="Functional status"
                  options={FUNCTIONAL_STATUSES}
                  value={form.functional_status}
                  onChange={(v) => set("functional_status", v)}
                />

                <div className="space-y-4 border-t border-ocean/[0.06] pt-6">
                  <div>
                    <StepLabel>Accessories (optional)</StepLabel>
                    <div className="flex flex-wrap gap-2">
                      {ACCESSORY_OPTIONS.map((option) => {
                        const active = form.accessories.includes(option);
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() =>
                              set(
                                "accessories",
                                active
                                  ? form.accessories.filter((a) => a !== option)
                                  : [...form.accessories, option]
                              )
                            }
                            className={cn(
                              "inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-btn border px-4 text-sm font-semibold transition-all duration-200",
                              active
                                ? "border-ocean bg-ocean text-white shadow-btn"
                                : "border-ocean/[0.12] bg-white text-ocean-deeper/70 hover:border-ocean/30 hover:text-ocean"
                            )}
                          >
                            {active && <Check className="h-3.5 w-3.5" />}
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <StepLabel>Faults or issues (optional)</StepLabel>
                    <textarea
                      value={form.faults}
                      onChange={(e) => set("faults", e.target.value)}
                      placeholder="e.g. Cracked corner, Wi-Fi drops, charging port loose…"
                      maxLength={2000}
                      rows={3}
                      className="input-refined resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <StepLabel>Photos (optional, recommended)</StepLabel>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {previews.map((url, index) => (
                        <div
                          key={url}
                          className="group relative aspect-square overflow-hidden rounded-btn border border-ocean/[0.08] bg-ivory-dark/40"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt={`Device photo ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            aria-label={`Remove photo ${index + 1}`}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ocean-deeper/80 text-white backdrop-blur transition-colors hover:bg-red-600 cursor-pointer"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}

                      {photos.length < MAX_TRADE_IN_PHOTOS && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-btn border border-dashed border-ocean/25 bg-ocean-subtle text-ocean/60 transition-all duration-200 hover:border-ocean/45 hover:text-ocean"
                        >
                          <ImagePlus className="h-6 w-6" />
                          <span className="text-[13px] font-semibold">Add photo</span>
                        </button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        addPhotos(e.target.files);
                        e.target.value = "";
                      }}
                    />
                    <p className="mt-2 text-[13px] text-ocean-deeper/45">
                      Add 2–4 photos — front, back and screen help our team evaluate your device faster.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === "contact" && (
              <div className="space-y-5">
                <div>
                  <StepLabel>Your contact details</StepLabel>
                  <p className="mb-4 text-[13px] leading-relaxed text-ocean-deeper/55">
                    We&apos;ll use these to contact you with your trade-in value.
                  </p>
                </div>

                <div>
                  <StepLabel>Full Name</StepLabel>
                  <input
                    type="text"
                    value={form.customer_name}
                    onChange={(e) => set("customer_name", e.target.value)}
                    placeholder="Your full name"
                    maxLength={120}
                    className={cn("input-refined", errors.customer_name && "input-error")}
                  />
                  <InputError message={errors.customer_name} />
                </div>

                <div>
                  <StepLabel>Phone Number</StepLabel>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+250 7xx xxx xxx"
                    maxLength={30}
                    className={cn("input-refined", errors.phone && "input-error")}
                  />
                  <InputError message={errors.phone} />
                </div>

                <div>
                  <StepLabel>Email (optional)</StepLabel>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@example.com"
                    maxLength={160}
                    className={cn("input-refined", errors.email && "input-error")}
                  />
                  <InputError message={errors.email} />
                </div>
              </div>
            )}

            {step === "review" && (
              <div className="space-y-5">
                <div>
                  <StepLabel>Review & submit</StepLabel>
                </div>

                <DeviceRow
                  label="Upgrading to"
                  name={wantedLabel || "—"}
                  sub={selectedWanted?.storage_options.length ? wantedStorageLabel : undefined}
                />
                <div className="flex justify-center">
                  <ArrowDown className="h-4 w-4 text-ocean/30" />
                </div>
                <DeviceRow
                  label="Trading in"
                  name={tradingInLabel || "—"}
                  sub={[
                    DEVICE_CONDITIONS.find((c) => c.value === form.device_condition)?.label,
                    SCREEN_CONDITIONS.find((c) => c.value === form.screen_condition)?.label,
                    BATTERY_CONDITIONS.find((c) => c.value === form.battery_condition)?.label,
                    FUNCTIONAL_STATUSES.find((c) => c.value === form.functional_status)?.label,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                />

                <div className="rounded-btn border border-ocean/[0.08] bg-ivory/60 px-4 py-3 text-[13px] leading-relaxed text-ocean-deeper/60">
                  {form.accessories.length > 0 && (
                    <p>
                      <strong className="font-bold text-ocean-deeper">Accessories:</strong>{" "}
                      {form.accessories.join(", ")}
                    </p>
                  )}
                  {form.faults && (
                    <p>
                      <strong className="font-bold text-ocean-deeper">Faults:</strong> {form.faults}
                    </p>
                  )}
                  <p>
                    <strong className="font-bold text-ocean-deeper">Contact:</strong>{" "}
                    {form.customer_name} · {form.phone}
                    {form.email ? ` · ${form.email}` : ""}
                  </p>
                  <p>
                    <strong className="font-bold text-ocean-deeper">Photos:</strong>{" "}
                    {photos.length > 0 ? `${photos.length} added` : "None"}
                  </p>
                </div>

                {form.customer_notes && (
                  <p className="text-[13px] leading-relaxed text-ocean-deeper/55">
                    <strong className="font-bold text-ocean-deeper">Notes:</strong> {form.customer_notes}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Server error */}
        {serverError && (
          <p className="mt-5 rounded-btn border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
            {serverError}
          </p>
        )}

        {/* Step controls */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-ocean/[0.06] pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={stepIndex === 0 || submitting}
            className={cn(
              "inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-[13px] px-5 text-sm font-semibold text-ocean/60 transition-all duration-200 hover:text-ocean",
              stepIndex === 0 && "pointer-events-none opacity-0"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {isLastStep ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-[13px] bg-ocean-deeper px-7 text-[15px] font-semibold text-white shadow-btn transition-all duration-[200ms] hover:bg-ocean-dark hover:-translate-y-[1px] hover:shadow-btn-glow active:scale-[0.98] disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit Request
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-[13px] bg-ocean-deeper px-7 text-[15px] font-semibold text-white shadow-btn transition-all duration-[200ms] hover:bg-ocean-dark hover:-translate-y-[1px] hover:shadow-btn-glow active:scale-[0.98]"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}