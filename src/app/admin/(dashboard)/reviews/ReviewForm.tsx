"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, X, ImageIcon } from "lucide-react";
import { uploadReviewAvatar } from "@/actions/reviews";
import type { ReviewFormData } from "@/actions/reviews";
import type { AdminReview } from "@/data/admin-reviews";

const reviewSchema = z.object({
  author: z.string().min(1, "Author name is required"),
  role: z.string(),
  location: z.string(),
  avatar_url: z.string(),
  rating: z.number().min(1).max(5),
  content: z.string().min(1, "Review content is required"),
  purchased_product: z.string(),
  category: z.string(),
  is_verified: z.boolean(),
  featured: z.boolean(),
  is_active: z.boolean(),
  sort_order: z.string(),
});

interface ReviewFormProps {
  review?: AdminReview;
  onSubmit: (data: ReviewFormData) => Promise<{ error?: string } | undefined>;
}

export function ReviewForm({ review, onSubmit }: ReviewFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [avatarUrl, setAvatarUrl] = useState(review?.avatar_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      author: review?.author ?? "",
      role: review?.role ?? "",
      location: review?.location ?? "",
      avatar_url: review?.avatar_url ?? "",
      rating: review?.rating ?? 5,
      content: review?.content ?? "",
      purchased_product: review?.purchased_product ?? "",
      category: review?.category ?? "",
      is_verified: review?.is_verified ?? true,
      featured: review?.featured ?? false,
      is_active: review?.is_active ?? true,
      sort_order: review?.sort_order?.toString() ?? "0",
    },
  });

  const rating = watch("rating");

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadReviewAvatar(fd);
    if (result.error) { setUploadError(result.error); setUploading(false); return; }
    if (result.url) { setAvatarUrl(result.url); setValue("avatar_url", result.url); }
    setUploading(false);
  }, [setValue]);

  const onFormSubmit = useCallback(async (data: z.infer<typeof reviewSchema>) => {
    setSubmitError(null);
    startTransition(async () => {
      const result = await onSubmit({ ...data, rating: Number(data.rating), sort_order: Number(data.sort_order) });
      if (result?.error) setSubmitError(result.error);
    });
  }, [onSubmit]);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {submitError && <div className="rounded-xl border border-red-500/20 bg-red-50 dark:bg-red-500/15 px-4 py-3 text-sm text-red-600 dark:text-red-300">{submitError}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Author *</label>
            <input {...register("author")} placeholder="e.g. Diane Uwase" className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
            {errors.author && <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.author.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Location</label>
              <input {...register("location")} placeholder="e.g. Kigali" className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Role</label>
              <input {...register("role")} placeholder="e.g. Software Engineer" className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue("rating", value)}
                  className={`cursor-pointer rounded-lg p-1 transition-colors ${value <= rating ? "text-amber-400" : "text-slate-300 dark:text-slate-600 hover:text-slate-400"}`}
                  aria-label={`${value} star${value > 1 ? "s" : ""}`}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M12 2l2.9 6.26L21.5 9.27l-5 4.87 1.18 6.88L12 17.77l-5.68 3.25L7.5 14.14l-5-4.87 6.6-1.01L12 2z" /></svg>
                </button>
              ))}
              <span className="ml-2 text-sm font-bold text-slate-500 dark:text-slate-400">{rating}/5</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Review Content *</label>
            <textarea {...register("content")} rows={5} placeholder="&ldquo;The iPhone I ordered arrived next day and was exactly as described...&rdquo;" className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
            {errors.content && <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.content.message}</p>}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Avatar</label>
            <div className="flex items-start gap-4">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-dashed border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438]">
                {avatarUrl ? (
                  <>
                    <img src={avatarUrl} alt="Avatar preview" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => { setAvatarUrl(""); setValue("avatar_url", ""); }} className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-slate-600 dark:text-slate-400 hover:bg-black/80"><X className="h-3.5 w-3.5" /></button>
                  </>
                ) : <ImageIcon className="h-6 w-6 text-slate-300 dark:text-slate-600" />}
              </div>
              <div className="flex-1">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1c3a5c] transition-colors">
                  <Upload className="h-4 w-4" />{uploading ? "Uploading..." : "Upload Photo"}
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUpload} disabled={uploading} className="hidden" />
                </label>
                {uploadError && <p className="mt-1 text-xs text-red-600 dark:text-red-300">{uploadError}</p>}
                <p className="mt-1 text-xs text-slate-300 dark:text-slate-600">Square photo. Max 2MB. JPG, PNG, WebP.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Purchased Product</label>
              <input {...register("purchased_product")} placeholder="e.g. iPhone 16 Pro" className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Category</label>
              <input {...register("category")} placeholder="e.g. Phones" className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Sort Order</label>
            <input {...register("sort_order")} type="number" placeholder="0" className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
            <p className="mt-1 text-xs text-slate-300 dark:text-slate-600">Lower numbers appear first (featured always first).</p>
          </div>
          <div className="space-y-3 rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Display</p>
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
              <input type="checkbox" {...register("is_active")} className="h-4 w-4 rounded border-slate-300 bg-slate-50 dark:bg-[#0f2438] text-ocean dark:text-[#8ec5f2] focus:ring-ocean/30" /> Show on homepage
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
              <input type="checkbox" {...register("featured")} className="h-4 w-4 rounded border-slate-300 bg-slate-50 dark:bg-[#0f2438] text-ocean dark:text-[#8ec5f2] focus:ring-ocean/30" /> Featured review
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
              <input type="checkbox" {...register("is_verified")} className="h-4 w-4 rounded border-slate-300 bg-slate-50 dark:bg-[#0f2438] text-ocean dark:text-[#8ec5f2] focus:ring-ocean/30" /> Verified purchase badge
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-slate-100 dark:border-[#1a3352] pt-6">
        <button type="submit" disabled={pending} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-ocean px-6 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 transition-colors hover:bg-ocean-dark disabled:opacity-50 shadow-md shadow-ocean/20">
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}{review ? "Update Review" : "Create Review"}
        </button>
        <button type="button" onClick={() => router.push("/admin/reviews")} className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-6 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-[#1c3a5c]">Cancel</button>
      </div>
    </form>
  );
}
