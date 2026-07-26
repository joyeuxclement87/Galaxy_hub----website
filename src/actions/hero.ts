"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export interface HeroFormData {
  product_id: string;
  badge: string;
  title: string;
  subtitle: string;
  primary_button_text: string;
  secondary_button_text: string;
  is_active: boolean;
}

export async function upsertHero(data: HeroFormData) {
  const supabase = await createAdminClient();

  const { data: existing } = await supabase.from("hero_sections").select("id").maybeSingle();

  let error;
  if (existing) {
    const result = await supabase.from("hero_sections").update({
      product_id: data.product_id || null,
      badge: data.badge || null,
      title: data.title || null,
      subtitle: data.subtitle || null,
      primary_button_text: data.primary_button_text || null,
      secondary_button_text: data.secondary_button_text || null,
      is_active: data.is_active,
    }).eq("id", existing.id);
    error = result.error;
  } else {
    const result = await supabase.from("hero_sections").insert({
      product_id: data.product_id || null,
      badge: data.badge || null,
      title: data.title || null,
      subtitle: data.subtitle || null,
      primary_button_text: data.primary_button_text || null,
      secondary_button_text: data.secondary_button_text || null,
      is_active: data.is_active,
    });
    error = result.error;
  }

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/hero");
}
