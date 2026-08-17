"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { HeroFormData } from "@/actions/hero";
import type { HeroWithProduct } from "@/data/admin-hero";

const heroSchema = z.object({
  product_id: z.string(),
  badge: z.string(),
  title: z.string(),
  subtitle: z.string(),
  primary_button_text: z.string(),
  secondary_button_text: z.string(),
  is_active: z.boolean(),
});

interface HeroClientProps {
  hero: HeroWithProduct | null;
  products: { id: string; name: string; slug: string; price: number; main_image_url: string | null }[];
  onSubmit: (data: HeroFormData) => Promise<{ error?: string } | undefined>;
}

export function HeroClient({ hero, products, onSubmit }: HeroClientProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      product_id: hero?.product_id ?? "",
      badge: hero?.badge ?? "",
      title: hero?.title ?? "",
      subtitle: hero?.subtitle ?? "",
      primary_button_text: hero?.primary_button_text ?? "",
      secondary_button_text: hero?.secondary_button_text ?? "",
      is_active: hero?.is_active ?? true,
    },
  });

  const selectedProductId = watch("product_id");
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const onFormSubmit = async (data: HeroFormData) => {
    setSubmitError(null);
    startTransition(async () => {
      const result = await onSubmit(data);
      if (result?.error) setSubmitError(result.error);
      else router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {submitError && <div className="rounded-xl border border-red-500/20 bg-red-50 dark:bg-red-500/15 px-4 py-3 text-sm text-red-600 dark:text-red-300">{submitError}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Featured Product</label>
            <select {...register("product_id")} className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all">
              <option value="">No featured product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {selectedProduct?.main_image_url && (
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438]">
                <img src={selectedProduct.main_image_url} alt={selectedProduct.name} className="h-48 w-full object-cover" />
                <p className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500">{selectedProduct.name} — {selectedProduct.price.toLocaleString()} RWF</p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Badge</label>
            <input {...register("badge")} placeholder="e.g. New Arrival" className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Title</label>
            <input {...register("title")} placeholder="e.g. The Future is in Your Hands" className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
            {errors.title && <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Subtitle</label>
            <input {...register("subtitle")} placeholder="e.g. Discover the latest in tech" className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Primary Button Text</label>
            <input {...register("primary_button_text")} placeholder="e.g. Shop Now" className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Secondary Button Text</label>
            <input {...register("secondary_button_text")} placeholder="e.g. Learn More" className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
          </div>
          <div className="space-y-3 rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Status</p>
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
              <input type="checkbox" {...register("is_active")} className="h-4 w-4 rounded border-slate-300 bg-slate-50 dark:bg-[#0f2438] text-ocean dark:text-[#8ec5f2] focus:ring-ocean/30" /> Hero section active
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-slate-100 dark:border-[#1a3352] pt-6">
        <button type="submit" disabled={pending} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-ocean px-6 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 transition-colors hover:bg-ocean-dark disabled:opacity-50 shadow-md shadow-ocean/20">
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}Save Hero Section
        </button>
      </div>
    </form>
  );
}
