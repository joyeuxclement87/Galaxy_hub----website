"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, X, ImageIcon } from "lucide-react";
import { uploadPromotionImage } from "@/actions/promotions";
import type { PromotionFormData } from "@/actions/promotions";
import type { PromotionListItem } from "@/data/admin-promotions";

const promotionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  image_url: z.string(),
  button_text: z.string(),
  button_link: z.string(),
  discount_percentage: z.string(),
  starts_at: z.string(),
  ends_at: z.string(),
  is_active: z.boolean(),
});

interface PromotionFormProps {
  promotion?: PromotionListItem;
  onSubmit: (data: PromotionFormData) => Promise<{ error?: string } | undefined>;
}

export function PromotionForm({ promotion, onSubmit }: PromotionFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState(promotion?.image_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      title: promotion?.title ?? "",
      description: promotion?.description ?? "",
      image_url: promotion?.image_url ?? "",
      button_text: promotion?.button_text ?? "",
      button_link: promotion?.button_link ?? "",
      discount_percentage: promotion?.discount_percentage?.toString() ?? "",
      starts_at: promotion?.starts_at ?? "",
      ends_at: promotion?.ends_at ?? "",
      is_active: promotion?.is_active ?? true,
    },
  });

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadPromotionImage(fd);
    if (result.error) { setUploadError(result.error); setUploading(false); return; }
    if (result.url) { setImageUrl(result.url); setValue("image_url", result.url); }
    setUploading(false);
  }, [setValue]);

  const onFormSubmit = useCallback(async (data: { title: string; description: string; image_url: string; button_text: string; button_link: string; discount_percentage: string; starts_at: string; ends_at: string; is_active: boolean }) => {
    setSubmitError(null);
    startTransition(async () => {
      const discount = data.discount_percentage === "" ? null : Number(data.discount_percentage);
      const result = await onSubmit({ ...data, discount_percentage: discount });
      if (result?.error) setSubmitError(result.error);
    });
  }, [onSubmit]);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {submitError && <div className="rounded-xl border border-red-500/20 bg-red-50 dark:bg-red-500/15 px-4 py-3 text-sm text-red-600 dark:text-red-300">{submitError}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Title *</label>
            <input {...register("title")} className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
            {errors.title && <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Description</label>
            <textarea {...register("description")} rows={3} className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Button Text</label>
              <input {...register("button_text")} placeholder="e.g. Shop Now" className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Button Link</label>
              <input {...register("button_link")} placeholder="e.g. /deals/..." className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Discount %</label>
            <input {...register("discount_percentage")} type="number" min={0} max={100} placeholder="e.g. 25" className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Image</label>
            <div className="flex items-start gap-4">
              <div className="relative flex h-40 w-64 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438]">
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => { setImageUrl(""); setValue("image_url", ""); }} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-slate-600 dark:text-slate-400 hover:bg-black/80"><X className="h-3.5 w-3.5" /></button>
                  </>
                ) : <ImageIcon className="h-8 w-8 text-slate-300 dark:text-slate-600" />}
              </div>
              <div className="flex-1">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1c3a5c] transition-colors">
                  <Upload className="h-4 w-4" />{uploading ? "Uploading..." : "Upload Image"}
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUpload} disabled={uploading} className="hidden" />
                </label>
                {uploadError && <p className="mt-1 text-xs text-red-600 dark:text-red-300">{uploadError}</p>}
                <p className="mt-1 text-xs text-slate-300 dark:text-slate-600">Max 5MB. JPG, PNG, WebP.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Start Date</label>
              <input {...register("starts_at")} type="datetime-local" className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">End Date</label>
              <input {...register("ends_at")} type="datetime-local" className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
            </div>
          </div>
          <div className="space-y-3 rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Status</p>
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
              <input type="checkbox" {...register("is_active")} className="h-4 w-4 rounded border-slate-300 bg-slate-50 dark:bg-[#0f2438] text-ocean dark:text-[#8ec5f2] focus:ring-ocean/30" /> Active
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-slate-100 dark:border-[#1a3352] pt-6">
        <button type="submit" disabled={pending} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-ocean px-6 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 transition-colors hover:bg-ocean-dark disabled:opacity-50 shadow-md shadow-ocean/20">
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}{promotion ? "Update Promotion" : "Create Promotion"}
        </button>
        <button type="button" onClick={() => router.push("/admin/promotions")} className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-6 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-[#1c3a5c]">Cancel</button>
      </div>
    </form>
  );
}
