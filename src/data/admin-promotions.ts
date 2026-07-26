import "server-only";
import { createClient } from "@/lib/supabase-server";
import type { Database } from "@/types/database";

type PromotionRow = Database["public"]["Tables"]["promotions"]["Row"];

export type PromotionListItem = PromotionRow;

export async function getPromotions() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as PromotionListItem[];
}

export async function getPromotionById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as PromotionListItem;
}
