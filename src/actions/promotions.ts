"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface PromotionFormData {
  title: string;
  description: string;
  image_url: string;
  button_text: string;
  button_link: string;
  discount_percentage: number | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
}

export async function createPromotion(data: PromotionFormData) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("promotions").insert({
    title: data.title,
    description: data.description || null,
    image_url: data.image_url || null,
    button_text: data.button_text || null,
    button_link: data.button_link || null,
    discount_percentage: data.discount_percentage || null,
    starts_at: data.starts_at || null,
    ends_at: data.ends_at || null,
    is_active: data.is_active,
  });
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/promotions");
  redirect("/admin/promotions");
}

export async function updatePromotion(id: string, data: PromotionFormData) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("promotions").update({
    title: data.title,
    description: data.description || null,
    image_url: data.image_url || null,
    button_text: data.button_text || null,
    button_link: data.button_link || null,
    discount_percentage: data.discount_percentage || null,
    starts_at: data.starts_at || null,
    ends_at: data.ends_at || null,
    is_active: data.is_active,
  }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/promotions");
  redirect("/admin/promotions");
}

export async function deletePromotion(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("promotions").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/promotions");
  redirect("/admin/promotions");
}

export async function deletePromotions(ids: string[]) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("promotions").delete().in("id", ids);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/promotions");
  return { success: true };
}

export async function uploadPromotionImage(formData: FormData) {
  const supabase = await createAdminClient();
  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };
  const ext = file.name.split(".").pop()?.toLowerCase();
  const allowed = ["jpg", "jpeg", "png", "webp"];
  if (!ext || !allowed.includes(ext)) return { error: "Unsupported file type. Allowed: jpg, jpeg, png, webp" };
  if (file.size > 5 * 1024 * 1024) return { error: "File too large. Max 5MB" };

  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `promotions/${fileName}`;

  const { data: bucket } = await supabase.storage.getBucket("promotions");
  if (!bucket) {
    const { error: createError } = await supabase.storage.createBucket("promotions", { public: true });
    if (createError) return { error: createError.message };
  }

  const { error } = await supabase.storage.from("promotions").upload(filePath, file, { cacheControl: "3600" });
  if (error) return { error: error.message };

  const { data: urlData } = supabase.storage.from("promotions").getPublicUrl(filePath);
  return { url: urlData.publicUrl };
}
