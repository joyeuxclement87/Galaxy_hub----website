"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, X, ImageIcon, Smartphone, PenLine, ClipboardCopy } from "lucide-react";
import { uploadImage, createProduct, updateProduct } from "@/actions/products";
import type { ProductFormData } from "@/actions/products";
import type { ProductListItem } from "@/data/products";
import { MobileApiImportPanel } from "./MobileApiImportPanel";
import { CopySpecificationsPanel } from "./CopySpecificationsPanel";
import { SpecificationsEditor } from "./SpecificationsEditor";
import { HighlightsEditor } from "./HighlightsEditor";
import { StorageOptionsEditor, DEVICE_STORAGE_OPTIONS, SMARTWATCH_STORAGE_OPTIONS, LAPTOP_RAM_OPTIONS } from "./StorageOptionsEditor";
import {
  toProductSpecifications,
  toProductHighlights,
  toStorageOptions,
  toSpecificationSource,
  type ProductSpecifications,
  type ProductHighlights,
  type SpecificationSource,
} from "@/types/specifications";

type SpecSourceMode = "api" | "manual" | "copy";

const SOURCE_MODE_OPTIONS: { mode: SpecSourceMode; label: string; description: string; icon: typeof Smartphone }[] = [
  { mode: "api", label: "Import from API", description: "Fill automatically from a device search", icon: Smartphone },
  { mode: "manual", label: "Add manually", description: "Type everything by hand", icon: PenLine },
  { mode: "copy", label: "Copy existing", description: "Reuse specs from a product you already have", icon: ClipboardCopy },
];

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase, with only letters, numbers, and hyphens"),
  short_description: z.string(),
  description: z.string(),
  category_id: z.string(),
  brand_id: z.string(),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  old_price: z.coerce.number().min(0).optional(),
  discount_percentage: z.coerce.number().min(0).max(100).optional(),
  rating: z.coerce.number().min(0).max(5, "Rating must be between 0 and 5").optional(),
  review_count: z.coerce.number().min(0).optional(),
  stock_status: z.string().min(1, "Stock status is required"),
  is_featured: z.boolean(),
  is_new: z.boolean(),
  is_active: z.boolean(),
  show_in_hero: z.boolean().optional(),
  main_image_url: z.string(),
});

interface ProductFormProps {
  product?: ProductListItem & { show_in_hero?: boolean };
  categories: { id: string; name: string; slug: string }[];
  brands: { id: string; name: string; slug: string }[];
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProductForm({ product, categories, brands }: ProductFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState(product?.main_image_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [specifications, setSpecifications] = useState<ProductSpecifications>(() =>
    toProductSpecifications(product?.specifications)
  );
  const [highlights, setHighlights] = useState<ProductHighlights>(() =>
    toProductHighlights(product?.highlights)
  );
  const [storageOptions, setStorageOptions] = useState<string[]>(() =>
    toStorageOptions(product?.storage_options)
  );
  const [specSource, setSpecSource] = useState<SpecificationSource>(() =>
    toSpecificationSource(product?.specification_source)
  );
  const [specSourceMode, setSpecSourceMode] = useState<SpecSourceMode>("manual");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      short_description: product?.short_description ?? "",
      description: product?.description ?? "",
      category_id: product?.category_id ?? "",
      brand_id: product?.brand_id ?? "",
      price: product?.price ?? 0,
      old_price: product?.old_price ?? undefined,
      discount_percentage: product?.discount_percentage ?? undefined,
      rating: product?.rating ?? 4.8,
      review_count: product?.review_count ?? 32,
      stock_status: product?.stock_status ?? "available",
      is_featured: product?.is_featured ?? false,
      is_new: product?.is_new ?? false,
      is_active: product?.is_active ?? true,
      show_in_hero: product?.show_in_hero ?? false,
      main_image_url: product?.main_image_url ?? "",
    },
  });

  const watchedCategoryId = watch("category_id");
  const selectedCategory = categories.find((c) => c.id === watchedCategoryId);
  const catText = `${selectedCategory?.name ?? ""} ${selectedCategory?.slug ?? ""} ${product?.name ?? ""}`.toLowerCase();
  const isSmartwatch = catText.includes("watch");
  const isComputer = catText.includes("laptop") || catText.includes("computer") || catText.includes("macbook");
  const storagePresets = isSmartwatch ? SMARTWATCH_STORAGE_OPTIONS : DEVICE_STORAGE_OPTIONS;

  // New computers: pre-fill the four core key specifications so the admin
  // only has to type values
  useEffect(() => {
    if (!product?.id && isComputer && specifications.length === 0) {
      setSpecifications([
        {
          name: "Key Specifications",
          specs: [
            { label: "Processor", value: "" },
            { label: "RAM", value: "" },
            { label: "Storage", value: "" },
            { label: "Operating System", value: "" },
          ],
        },
      ]);
    }
  }, [product?.id, isComputer, specifications.length]);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setValue("name", val);
      if (!slugManuallyEdited) {
        setValue("slug", slugify(val));
      }
    },
    [slugManuallyEdited, setValue]
  );

  const handleSlugChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSlugManuallyEdited(true);
      setValue("slug", e.target.value);
    },
    [setValue]
  );

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadImage(formData);

    if (result.error) {
      setUploadError(result.error);
      setUploading(false);
      return;
    }

    if (result.url) {
      setImageUrl(result.url);
      setValue("main_image_url", result.url);
    }
    setUploading(false);
  }, [setValue]);

  const onFormSubmit = useCallback(
    async (data: ProductFormData) => {
      setSubmitError(null);

      const cleanedSpecifications = specifications
        .map((group) => ({
          name: group.name.trim(),
          specs: group.specs
            .map((spec) => ({ label: spec.label.trim(), value: spec.value.trim() }))
            .filter((spec) => spec.label && spec.value),
        }))
        .filter((group) => group.name && group.specs.length > 0);

      const cleanedHighlights = highlights.map((h) => h.trim()).filter(Boolean);

      const cleanedStorageOptions = storageOptions.map((s) => s.trim()).filter(Boolean);

      const payload: ProductFormData = {
        ...data,
        specifications: cleanedSpecifications,
        highlights: cleanedHighlights,
        storage_options: cleanedStorageOptions,
        specification_source: specSource,
      };

      startTransition(async () => {
        const result = product?.id
          ? await updateProduct(product.id, payload)
          : await createProduct(payload);
        if (result?.error) {
          setSubmitError(result.error);
        }
      });
    },
    [product, specifications, highlights, storageOptions, specSource]
  );

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {submitError && (
        <div className="rounded-xl border border-red-500/20 bg-red-50 dark:bg-red-500/15 px-4 py-3 text-sm text-red-600 dark:text-red-300">
          {submitError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              Product Name *
            </label>
            <input
              {...register("name")}
              onChange={handleNameChange}
              className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              Slug *
            </label>
            <input
              {...register("slug")}
              onChange={handleSlugChange}
              className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
            />
            {errors.slug && <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              Short Description
            </label>
            <textarea
              {...register("short_description")}
              rows={3}
              className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              Full Description
            </label>
            <textarea
              {...register("description")}
              rows={5}
              className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Category
              </label>
              <select
                {...register("category_id")}
                className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Brand
              </label>
              <select
                {...register("brand_id")}
                className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
              >
                <option value="">Select brand</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              Main Image
            </label>
            <div className="flex items-start gap-4">
              <div className="relative flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438]">
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt="Product preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => { setImageUrl(""); setValue("main_image_url", ""); }}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-slate-600 dark:text-slate-400 hover:bg-black/80"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <ImageIcon className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                )}
              </div>
              <div className="flex-1">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1c3a5c] transition-colors">
                  <Upload className="h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload Image"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                {uploading && <Loader2 className="mt-2 h-4 w-4 animate-spin text-ocean dark:text-[#8ec5f2]" />}
                {uploadError && <p className="mt-1 text-xs text-red-600 dark:text-red-300">{uploadError}</p>}
                <p className="mt-1 text-xs text-slate-300 dark:text-slate-600">Max 5MB. JPG, PNG, WebP, GIF.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price")}
                className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
              />
              {errors.price && <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Old Price
              </label>
              <input
                type="number"
                step="0.01"
                {...register("old_price")}
                className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Discount %
              </label>
              <input
                type="number"
                min="0"
                max="100"
                {...register("discount_percentage")}
                className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Stock Status *
              </label>
              <select
                {...register("stock_status")}
                className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
              >
                <option value="available">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="coming_soon">Coming Soon</option>
              </select>
              {errors.stock_status && <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.stock_status.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Rating (0–5)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="e.g. 4.8"
                {...register("rating")}
                className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
              />
              {errors.rating && <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.rating.message}</p>}
              <p className="mt-1 text-xs text-slate-300 dark:text-slate-600">Shown as stars on product cards.</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Review Count
              </label>
              <input
                type="number"
                min="0"
                {...register("review_count")}
                className="block w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
              />
              {errors.review_count && <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors.review_count.message}</p>}
              <p className="mt-1 text-xs text-slate-300 dark:text-slate-600">Number shown next to the rating.</p>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-4 py-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Flags & Visibility</p>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                <input type="checkbox" {...register("is_featured")} className="h-4 w-4 rounded border-slate-300 bg-slate-50 dark:bg-[#0f2438] text-ocean dark:text-[#8ec5f2] focus:ring-ocean/30" />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                <input type="checkbox" {...register("is_new")} className="h-4 w-4 rounded border-slate-300 bg-slate-50 dark:bg-[#0f2438] text-ocean dark:text-[#8ec5f2] focus:ring-ocean/30" />
                New Product
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                <input type="checkbox" {...register("is_active")} className="h-4 w-4 rounded border-slate-300 bg-slate-50 dark:bg-[#0f2438] text-ocean dark:text-[#8ec5f2] focus:ring-ocean/30" />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-accent dark:text-[#8ec5f2] cursor-pointer">
                <input type="checkbox" {...register("show_in_hero")} className="h-4 w-4 rounded border-slate-300 bg-slate-50 dark:bg-[#0f2438] text-ocean dark:text-[#8ec5f2] focus:ring-ocean/30" />
                Display on Hero Section
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t border-slate-100 dark:border-[#1a3352] pt-8">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Technical Specifications</h2>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Specs can come from a device search, be typed by hand, or be copied from a product you
            already have — whichever you pick, everything lands in the same editor below and saves
            to the same place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {SOURCE_MODE_OPTIONS.map(({ mode, label, description, icon: Icon }) => {
            const active = specSourceMode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setSpecSourceMode(mode)}
                aria-pressed={active}
                className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
                  active
                    ? "border-ocean/40 bg-ocean/10"
                    : "border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] hover:bg-slate-100 dark:hover:bg-[#1c3a5c] cursor-pointer"
                }`}
              >
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${active ? "text-accent dark:text-[#8ec5f2]" : "text-slate-400 dark:text-slate-500"}`} />
                <span>
                  <span className={`block text-sm font-semibold ${active ? "text-accent dark:text-[#8ec5f2]" : "text-slate-600 dark:text-slate-400"}`}>
                    {label}
                  </span>
                  <span className="block text-xs text-slate-400 dark:text-slate-500">{description}</span>
                </span>
              </button>
            );
          })}
        </div>

        {specSourceMode === "api" && (
          <MobileApiImportPanel
            onImport={(imported) => {
              setSpecifications((current) => [...current, ...imported]);
              setSpecSource("mobileapi");
            }}
          />
        )}

        {specSourceMode === "copy" && (
          <CopySpecificationsPanel
            onImport={(copied) => {
              setSpecifications((current) => [...current, ...copied]);
              setSpecSource("copied");
            }}
          />
        )}

        <SpecificationsEditor
          value={specifications}
          onChange={setSpecifications}
          categoryName={selectedCategory?.name ?? null}
          categorySlug={selectedCategory?.slug ?? null}
        />
      </div>

      <div className="space-y-4 border-t border-slate-100 dark:border-[#1a3352] pt-8">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Product Highlights</h2>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            3–5 short marketing bullet points shown on the product page (e.g. &ldquo;200MP Pro Camera&rdquo;). These
            are written by you, not imported.
          </p>
        </div>
        <HighlightsEditor value={highlights} onChange={setHighlights} />
      </div>

      <div className="space-y-4 border-t border-slate-100 dark:border-[#1a3352] pt-8">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Storage Options</h2>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Selectable storage sizes for this listing (e.g. 128GB, 256GB). Shown on the product page and at ordering.
            Presets update automatically based on the selected category — {isSmartwatch ? "smartwatch sizes (8GB – 64GB)" : "device sizes (64GB – 2TB)"}.
          </p>
        </div>
        <StorageOptionsEditor
          value={storageOptions}
          onChange={setStorageOptions}
          presets={storagePresets}
          ramPresets={isComputer ? LAPTOP_RAM_OPTIONS : undefined}
        />
      </div>

      <div className="flex items-center gap-3 border-t border-slate-100 dark:border-[#1a3352] pt-6">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-ocean px-6 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 transition-colors hover:bg-ocean-dark disabled:opacity-50 shadow-md shadow-ocean/20"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {product ? "Update Product" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-6 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-[#1c3a5c]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
