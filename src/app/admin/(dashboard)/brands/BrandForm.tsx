"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, X, ImageIcon } from "lucide-react";
import { uploadBrandLogo } from "@/actions/brands";
import type { BrandFormData } from "@/actions/brands";
import type { BrandListItem } from "@/data/admin-brands";

const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/),
  description: z.string(),
  logo_url: z.string(),
  is_active: z.boolean(),
});

interface BrandFormProps {
  brand?: BrandListItem;
  onSubmit: (data: BrandFormData) => Promise<{ error?: string } | undefined>;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function BrandForm({ brand, onSubmit }: BrandFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [logoUrl, setLogoUrl] = useState(brand?.logo_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: brand?.name ?? "",
      slug: brand?.slug ?? "",
      description: brand?.description ?? "",
      logo_url: brand?.logo_url ?? "",
      is_active: brand?.is_active ?? true,
    },
  });

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("name", val);
    if (!slugManuallyEdited) setValue("slug", slugify(val));
  }, [slugManuallyEdited, setValue]);

  const handleSlugChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    setValue("slug", e.target.value);
  }, [setValue]);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadBrandLogo(fd);
    if (result.error) { setUploadError(result.error); setUploading(false); return; }
    if (result.url) { setLogoUrl(result.url); setValue("logo_url", result.url); }
    setUploading(false);
  }, [setValue]);

  const onFormSubmit = useCallback(async (data: BrandFormData) => {
    setSubmitError(null);
    startTransition(async () => {
      const result = await onSubmit(data);
      if (result?.error) setSubmitError(result.error);
    });
  }, [onSubmit]);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {submitError && <div className="rounded-xl border border-red-500/20 bg-red-50 dark:bg-red-500/15 px-4 py-3 text-sm text-red-600 dark:text-red-300">{submitError}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Brand Name *</label>
            <input {...register("name")} onChange={handleNameChange} className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
            {errors.name && <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Slug *</label>
            <input {...register("slug")} onChange={handleSlugChange} className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
            {errors.slug && <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.slug.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Description</label>
            <textarea {...register("description")} rows={4} className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Brand Logo</label>
            <div className="flex items-start gap-4">
              <div className="relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438]">
                {logoUrl ? (
                  <>
                    <img src={logoUrl} alt="Logo preview" className="h-full w-full object-contain" />
                    <button type="button" onClick={() => { setLogoUrl(""); setValue("logo_url", ""); }} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-slate-600 dark:text-slate-400 hover:bg-black/80"><X className="h-3.5 w-3.5" /></button>
                  </>
                ) : <ImageIcon className="h-8 w-8 text-slate-300 dark:text-slate-600" />}
              </div>
              <div className="flex-1">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1c3a5c] transition-colors">
                  <Upload className="h-4 w-4" />{uploading ? "Uploading..." : "Upload Logo"}
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUpload} disabled={uploading} className="hidden" />
                </label>
                {uploading && <Loader2 className="mt-2 h-4 w-4 animate-spin text-ocean dark:text-[#8ec5f2]" />}
                {uploadError && <p className="mt-1 text-xs text-red-600 dark:text-red-300">{uploadError}</p>}
                <p className="mt-1 text-xs text-slate-300 dark:text-slate-600">Max 5MB. JPG, PNG, WebP.</p>
              </div>
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
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}{brand ? "Update Brand" : "Create Brand"}
        </button>
        <button type="button" onClick={() => router.push("/admin/brands")} className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-6 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-[#1c3a5c]">Cancel</button>
      </div>
    </form>
  );
}
