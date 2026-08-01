import "server-only";
import { createClient } from "@/lib/supabase-server";
import type { Database } from "@/types/database";

type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];

export type AdminReview = ReviewRow;

export async function getReviews() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as AdminReview[];
}

export async function getReviewById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as AdminReview;
}
