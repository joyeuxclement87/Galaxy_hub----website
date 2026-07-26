import "server-only";
import { createClient } from "@/lib/supabase-server";
import type { Database } from "@/types/database";

type HeroRow = Database["public"]["Tables"]["hero_sections"]["Row"];

export interface HeroWithProduct extends HeroRow {
  product: { id: string; name: string; slug: string; price: number; main_image_url: string | null } | null;
}

export async function getHero() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("hero_sections")
    .select(`*, product:product_id(id, name, slug, price, main_image_url)`)
    .maybeSingle();

  if (error || !data) return null;
  return data as unknown as HeroWithProduct;
}

export async function getActiveProducts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, price, main_image_url")
    .eq("is_active", true)
    .order("name");

  if (error || !data) return [];
  return data;
}
