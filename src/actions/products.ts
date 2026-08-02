"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ProductSpecifications, ProductHighlights } from "@/types/specifications";
import type { Json } from "@/types/database";

export interface ProductFormData {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  category_id: string;
  brand_id: string;
  price: number;
  old_price?: number | null;
  discount_percentage?: number | null;
  rating?: number | null;
  review_count?: number | null;
  stock_status: string;
  is_featured: boolean;
  is_new: boolean;
  is_active: boolean;
  show_in_hero?: boolean;
  main_image_url: string;
  /** Technical specifications — entered manually or imported via MobileAPI.dev and normalized. */
  specifications?: ProductSpecifications;
  /** Marketing highlights — always admin-authored, independent of any import. */
  highlights?: ProductHighlights;
  /** Selectable storage sizes offered for this listing, e.g. ["256GB", "512GB"]. */
  storage_options?: string[];
}

export async function createProduct(data: ProductFormData) {
  const supabase = createAdminClient();

  const { data: insertedProduct, error } = await supabase.from("products").insert({
    name: data.name,
    slug: data.slug,
    short_description: data.short_description || null,
    description: data.description || null,
    category_id: data.category_id || null,
    brand_id: data.brand_id || null,
    price: data.price,
    old_price: data.old_price || null,
    discount_percentage: data.discount_percentage || null,
    rating: data.rating || null,
    review_count: data.review_count || null,
    stock_status: data.stock_status,
    is_featured: data.is_featured,
    is_new: data.is_new,
    is_active: data.is_active,
    main_image_url: data.main_image_url || null,
    specifications: (data.specifications ?? []) as unknown as Json,
    highlights: (data.highlights ?? []) as unknown as Json,
    storage_options: (data.storage_options ?? []) as unknown as Json,
  }).select("id").single();

  if (error) {
    return { error: error.message };
  }

  if (data.show_in_hero && insertedProduct?.id) {
    await supabase.from("hero_sections").insert({
      product_id: insertedProduct.id,
      title: data.name,
      subtitle: data.short_description || data.description || null,
      badge: data.is_new ? "NEW ARRIVAL" : "FEATURED TECH",
      is_active: true,
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/admin/hero");
  redirect("/admin/products");
}

export async function updateProduct(id: string, data: ProductFormData) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("products")
    .update({
      name: data.name,
      slug: data.slug,
      short_description: data.short_description || null,
      description: data.description || null,
      category_id: data.category_id || null,
      brand_id: data.brand_id || null,
      price: data.price,
      old_price: data.old_price || null,
      discount_percentage: data.discount_percentage || null,
      rating: data.rating || null,
      review_count: data.review_count || null,
      stock_status: data.stock_status,
      is_featured: data.is_featured,
      is_new: data.is_new,
      is_active: data.is_active,
      main_image_url: data.main_image_url || null,
      specifications: (data.specifications ?? []) as unknown as Json,
      highlights: (data.highlights ?? []) as unknown as Json,
      storage_options: (data.storage_options ?? []) as unknown as Json,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  if (data.show_in_hero) {
    const { data: existingHero } = await supabase
      .from("hero_sections")
      .select("id")
      .eq("product_id", id)
      .maybeSingle();

    if (existingHero) {
      await supabase.from("hero_sections").update({
        title: data.name,
        subtitle: data.short_description || data.description || null,
        badge: data.is_new ? "NEW ARRIVAL" : "FEATURED TECH",
        is_active: true,
      }).eq("id", existingHero.id);
    } else {
      await supabase.from("hero_sections").insert({
        product_id: id,
        title: data.name,
        subtitle: data.short_description || data.description || null,
        badge: data.is_new ? "NEW ARRIVAL" : "FEATURED TECH",
        is_active: true,
      });
    }
  } else {
    await supabase.from("hero_sections").delete().eq("product_id", id);
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/admin/hero");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProducts(ids: string[]) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("products").delete().in("id", ids);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function uploadImage(formData: FormData) {
  const supabase = createAdminClient();
  const file = formData.get("file") as File;

  if (!file) {
    return { error: "No file provided" };
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  const allowed = ["jpg", "jpeg", "png", "webp", "gif"];

  if (!ext || !allowed.includes(ext)) {
    return { error: "Unsupported file type. Allowed: jpg, jpeg, png, webp, gif" };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: "File too large. Max 5MB" };
  }

  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `products/${fileName}`;

  const { data: bucket } = await supabase.storage.getBucket("product-images");

  if (!bucket) {
    const { error: createError } = await supabase.storage.createBucket("product-images", {
      public: true,
    });
    if (createError) return { error: createError.message };
  }

  const { data: existing } = await supabase.storage.from("product-images").list("products", {
    limit: 1,
  });

  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return { error: error.message };
  }

  const { data: urlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return { url: urlData.publicUrl };
}
