"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface ReviewFormData {
  author: string;
  role: string;
  location: string;
  avatar_url: string;
  rating: number;
  content: string;
  purchased_product: string;
  category: string;
  is_verified: boolean;
  featured: boolean;
  is_active: boolean;
  sort_order: number;
}

export async function createReview(data: ReviewFormData) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("reviews").insert({
    author: data.author,
    role: data.role || null,
    location: data.location || null,
    avatar_url: data.avatar_url || null,
    rating: data.rating,
    content: data.content,
    purchased_product: data.purchased_product || null,
    category: data.category || null,
    is_verified: data.is_verified,
    featured: data.featured,
    is_active: data.is_active,
    sort_order: data.sort_order,
  });
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/reviews");
  redirect("/admin/reviews");
}

export async function updateReview(id: string, data: ReviewFormData) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("reviews").update({
    author: data.author,
    role: data.role || null,
    location: data.location || null,
    avatar_url: data.avatar_url || null,
    rating: data.rating,
    content: data.content,
    purchased_product: data.purchased_product || null,
    category: data.category || null,
    is_verified: data.is_verified,
    featured: data.featured,
    is_active: data.is_active,
    sort_order: data.sort_order,
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/reviews");
  redirect("/admin/reviews");
}

export async function deleteReview(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/reviews");
  redirect("/admin/reviews");
}

export async function toggleReviewActive(id: string, isActive: boolean) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("reviews").update({
    is_active: isActive,
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/reviews");
}

export async function toggleReviewFeatured(id: string, featured: boolean) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("reviews").update({
    featured,
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/reviews");
}

export async function uploadReviewAvatar(formData: FormData) {
  const supabase = await createAdminClient();
  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };
  const ext = file.name.split(".").pop()?.toLowerCase();
  const allowed = ["jpg", "jpeg", "png", "webp"];
  if (!ext || !allowed.includes(ext)) return { error: "Unsupported file type. Allowed: jpg, jpeg, png, webp" };
  if (file.size > 2 * 1024 * 1024) return { error: "File too large. Max 2MB" };

  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `review-avatars/${fileName}`;

  const { data: bucket } = await supabase.storage.getBucket("review-avatars");
  if (!bucket) {
    const { error: createError } = await supabase.storage.createBucket("review-avatars", { public: true });
    if (createError) return { error: createError.message };
  }

  const { error } = await supabase.storage.from("review-avatars").upload(filePath, file, { cacheControl: "3600" });
  if (error) return { error: error.message };

  const { data: urlData } = supabase.storage.from("review-avatars").getPublicUrl(filePath);
  return { url: urlData.publicUrl };
}
