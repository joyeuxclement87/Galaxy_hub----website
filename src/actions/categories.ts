"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
}

export async function createCategory(data: CategoryFormData) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("categories").insert({
    name: data.name,
    slug: data.slug,
    description: data.description || null,
    image_url: data.image_url || null,
    is_active: data.is_active,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, data: CategoryFormData) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("categories")
    .update({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      image_url: data.image_url || null,
      is_active: data.is_active,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  const supabase = createAdminClient();

  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);

  if (count && count > 0) {
    return { error: `This category contains ${count} product${count === 1 ? "" : "s"}. Move or remove products before deleting.` };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategories(ids: string[]) {
  const supabase = createAdminClient();

  const { data: inUse } = await supabase
    .from("products")
    .select("category_id")
    .in("category_id", ids);

  if (inUse && inUse.length > 0) {
    const used = new Set(inUse.map((p) => p.category_id).filter(Boolean));
    return {
      error: `${used.size} of the selected categories still contain products. Move or remove products before deleting.`,
    };
  }

  const { error } = await supabase.from("categories").delete().in("id", ids);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function uploadCategoryImage(formData: FormData) {
  const supabase = createAdminClient();
  const file = formData.get("file") as File;

  if (!file) {
    return { error: "No file provided" };
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  const allowed = ["jpg", "jpeg", "png", "webp"];

  if (!ext || !allowed.includes(ext)) {
    return { error: "Unsupported file type. Allowed: jpg, jpeg, png, webp" };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: "File too large. Max 5MB" };
  }

  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `categories/${fileName}`;

  const { data: bucket } = await supabase.storage.getBucket("category-images");
  if (!bucket) {
    const { error: createError } = await supabase.storage.createBucket("category-images", {
      public: true,
    });
    if (createError) return { error: createError.message };
  }

  const { error } = await supabase.storage
    .from("category-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return { error: error.message };
  }

  const { data: urlData } = supabase.storage
    .from("category-images")
    .getPublicUrl(filePath);

  return { url: urlData.publicUrl };
}
