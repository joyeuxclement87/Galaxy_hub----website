import "server-only";
import { createClient } from "@/lib/supabase-server";
import type { Database } from "@/types/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export interface ProductListItem extends ProductRow {
  category: { name: string } | null;
  brand: { name: string } | null;
}

export interface ProductsResponse {
  products: ProductListItem[];
  total: number;
}

export interface ProductsQuery {
  search?: string;
  category_id?: string;
  brand_id?: string;
  stock_status?: string;
  is_featured?: boolean;
  is_active?: boolean;
  page?: number;
  pageSize?: number;
}

export async function getProducts(query: ProductsQuery = {}): Promise<ProductsResponse> {
  const supabase = createClient();
  const { search, category_id, brand_id, stock_status, is_featured, is_active, page = 1, pageSize = 20 } = query;

  let countQuery = supabase.from("products").select("*", { count: "exact", head: true });
  let dataQuery = supabase
    .from("products")
    .select(`*, category:category_id(name), brand:brand_id(name)`);

  if (search) {
    countQuery = countQuery.ilike("name", `%${search}%`);
    dataQuery = dataQuery.ilike("name", `%${search}%`);
  }
  if (category_id) {
    countQuery = countQuery.eq("category_id", category_id);
    dataQuery = dataQuery.eq("category_id", category_id);
  }
  if (brand_id) {
    countQuery = countQuery.eq("brand_id", brand_id);
    dataQuery = dataQuery.eq("brand_id", brand_id);
  }
  if (stock_status) {
    countQuery = countQuery.eq("stock_status", stock_status);
    dataQuery = dataQuery.eq("stock_status", stock_status);
  }
  if (is_featured !== undefined) {
    countQuery = countQuery.eq("is_featured", is_featured);
    dataQuery = dataQuery.eq("is_featured", is_featured);
  }
  if (is_active !== undefined) {
    countQuery = countQuery.eq("is_active", is_active);
    dataQuery = dataQuery.eq("is_active", is_active);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  dataQuery = dataQuery.order("created_at", { ascending: false }).range(from, to);

  const [{ count }, { data, error }] = await Promise.all([countQuery, dataQuery]);

  if (error || !data) return { products: [], total: 0 };

  return {
    products: data as unknown as ProductListItem[],
    total: count ?? 0,
  };
}

export async function getProductById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`*, category:category_id(name), brand:brand_id(name, slug, logo_url)`)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const { data: hero } = await supabase
    .from("hero_sections")
    .select("id")
    .eq("product_id", id)
    .eq("is_active", true)
    .maybeSingle();

  return {
    ...data,
    show_in_hero: !!hero,
  } as unknown as ProductListItem & { show_in_hero?: boolean };
}

export async function getCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name");

  if (error || !data) return [];
  return data;
}

export async function getBrands() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("brands")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name");

  if (error || !data) return [];
  return data;
}
