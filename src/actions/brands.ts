"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface BrandFormData {
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  is_active: boolean;
}

export async function createBrand(data: BrandFormData) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("brands").insert({
    name: data.name,
    slug: data.slug,
    description: data.description || null,
    logo_url: data.logo_url || null,
    is_active: data.is_active,
  });
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/brands");
  redirect("/admin/brands");
}

export async function updateBrand(id: string, data: BrandFormData) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("brands").update({
    name: data.name,
    slug: data.slug,
    description: data.description || null,
    logo_url: data.logo_url || null,
    is_active: data.is_active,
  }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/brands");
  redirect("/admin/brands");
}

export async function deleteBrand(id: string) {
  const supabase = await createAdminClient();
  const { count } = await supabase.from("products")
    .select("*", { count: "exact", head: true })
    .eq("brand_id", id);
  if (count && count > 0) {
    return { error: `This brand has ${count} product${count === 1 ? "" : "s"}. Move or remove products before deleting.` };
  }
  const { error } = await supabase.from("brands").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/brands");
  redirect("/admin/brands");
}

export async function deleteBrands(ids: string[]) {
  const supabase = await createAdminClient();
  const { data: inUse } = await supabase.from("products")
    .select("brand_id")
    .in("brand_id", ids);
  if (inUse && inUse.length > 0) {
    const used = new Set(inUse.map((p) => p.brand_id).filter(Boolean));
    return {
      error: `${used.size} of the selected brands still have products. Move or remove products before deleting.`,
    };
  }
  const { error } = await supabase.from("brands").delete().in("id", ids);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/brands");
  return { success: true };
}

export async function uploadBrandLogo(formData: FormData) {
  const supabase = await createAdminClient();
  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };
  const ext = file.name.split(".").pop()?.toLowerCase();
  const allowed = ["jpg", "jpeg", "png", "webp"];
  if (!ext || !allowed.includes(ext)) return { error: "Unsupported file type. Allowed: jpg, jpeg, png, webp" };
  if (file.size > 5 * 1024 * 1024) return { error: "File too large. Max 5MB" };

  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `brands/${fileName}`;

  const { data: bucket } = await supabase.storage.getBucket("brands");
  if (!bucket) {
    const { error: createError } = await supabase.storage.createBucket("brands", { public: true });
    if (createError) return { error: createError.message };
  }

  const { error } = await supabase.storage.from("brands").upload(filePath, file, { cacheControl: "3600" });
  if (error) return { error: error.message };

  const { data: urlData } = supabase.storage.from("brands").getPublicUrl(filePath);
  return { url: urlData.publicUrl };
}
