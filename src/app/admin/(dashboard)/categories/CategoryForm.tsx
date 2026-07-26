"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, X, ImageIcon } from "lucide-react";
import { uploadCategoryImage, createCategory, updateCategory } from "@/actions/categories";
import type { CategoryFormData } from "@/actions/categories";
import type { CategoryListItem } from "@/data/categories";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/),
  description: z.string(),
  image_url: z.string(),
  is_active: z.boolean(),
});

interface CategoryFormProps {
  category?: CategoryListItem;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState(category?.image_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
      image_url: category?.image_url ?? "",
      is_active: category?.is_active ?? true,
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
    const result = await uploadCategoryImage(fd);
    if (result.error) { setUploadError(result.error); setUploading(false); return; }
    if (result.url) { setImageUrl(result.url); setValue("image_url", result.url); }
    setUploading(false);
  }, [setValue]);

  const onFormSubmit = useCallback(async (data: CategoryFormData) => {
    setSubmitError(null);
    startTransition(async () => {
      let result;
      if (category) result = await updateCategory(category.id, data);
      else result = await createCategory(data);
      if (result?.error) setSubmitError(result.error);
    });
  }, [category, createCategory, updateCategory]);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {submitError && <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{submitError}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-1.5">Category Name *</label>
            <input {...register("name")} onChange={handleNameChange} className="block w-full rounded-xl border border-white/8 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-ocean/40 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
            {errors.name && <p className="mt-1 text-xs text-red-300">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-1.5">Slug *</label>
            <input {...register("slug")} onChange={handleSlugChange} className="block w-full rounded-xl border border-white/8 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-ocean/40 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
            {errors.slug && <p className="mt-1 text-xs text-red-300">{errors.slug.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-1.5">Description</label>
            <textarea {...register("description")} rows={4} className="block w-full rounded-xl border border-white/8 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-ocean/40 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all" />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-1.5">Category Image</label>
            <div className="flex items-start gap-4">
              <div className="relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/8 bg-white/[0.03]">
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => { setImageUrl(""); setValue("image_url", ""); }} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white/70 hover:bg-black/80"><X className="h-3.5 w-3.5" /></button>
                  </>
                ) : <ImageIcon className="h-8 w-8 text-white/20" />}
              </div>
              <div className="flex-1">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/8 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/50 hover:bg-white/10 transition-colors">
                  <Upload className="h-4 w-4" />{uploading ? "Uploading..." : "Upload Image"}
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUpload} disabled={uploading} className="hidden" />
                </label>
                {uploading && <Loader2 className="mt-2 h-4 w-4 animate-spin text-ocean" />}
                {uploadError && <p className="mt-1 text-xs text-red-300">{uploadError}</p>}
                <p className="mt-1 text-xs text-white/20">Max 5MB. JPG, PNG, WebP.</p>
              </div>
            </div>
          </div>
          <div className="space-y-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-4">
            <p className="text-xs font-bold uppercase tracking-wider text-white/40">Status</p>
            <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
              <input type="checkbox" {...register("is_active")} className="h-4 w-4 rounded border-white/20 bg-white/5 text-ocean focus:ring-ocean/30" /> Active
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-white/5 pt-6">
        <button type="submit" disabled={pending} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-ocean px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ocean-dark disabled:opacity-50 shadow-md shadow-ocean/20">
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}{category ? "Update Category" : "Create Category"}
        </button>
        <button type="button" onClick={() => router.push("/admin/categories")} className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/8 bg-white/5 px-6 py-2.5 text-sm font-medium text-white/50 transition-colors hover:bg-white/10">Cancel</button>
      </div>
    </form>
  );
}
