import "server-only";
import { createClient } from "@/lib/supabase-server";
import type { Database } from "@/types/database";

type BrandRow = Database["public"]["Tables"]["brands"]["Row"];

export interface BrandListItem extends BrandRow {
  product_count: number;
}

export async function getBrands() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("brands")
    .select(`*, product_count:products(count)`)
    .order("name");

  if (error || !data) return [];
  return (data as unknown as (BrandRow & { product_count: { count: number }[] })[]).map((r) => ({
    ...r,
    product_count: r.product_count?.[0]?.count ?? 0,
  })) as BrandListItem[];
}

export async function getBrandById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("brands")
    .select(`*, product_count:products(count)`)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  const r = data as unknown as BrandRow & { product_count: { count: number }[] };
  return { ...r, product_count: r.product_count?.[0]?.count ?? 0 } as BrandListItem;
}

export async function getBrandProductCount(brandId: string) {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("brand_id", brandId);
  if (error) return 0;
  return count ?? 0;
}
