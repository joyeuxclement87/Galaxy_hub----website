import "server-only";
import { createClient } from "@/lib/supabase-server";
import type { Database } from "@/types/database";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

export interface CategoryListItem extends CategoryRow {
  product_count: number;
}

export interface CategoriesResponse {
  categories: CategoryListItem[];
  total: number;
}

export interface CategoriesQuery {
  search?: string;
  is_active?: boolean;
  page?: number;
  pageSize?: number;
}

export async function getCategories(query: CategoriesQuery = {}): Promise<CategoriesResponse> {
  const supabase = createClient();
  const { search, is_active, page = 1, pageSize = 50 } = query;

  let countQuery = supabase.from("categories").select("*", { count: "exact", head: true });
  let dataQuery = supabase
    .from("categories")
    .select(`*, product_count:products(count)`);

  if (search) {
    countQuery = countQuery.ilike("name", `%${search}%`);
    dataQuery = dataQuery.ilike("name", `%${search}%`);
  }
  if (is_active !== undefined) {
    countQuery = countQuery.eq("is_active", is_active);
    dataQuery = dataQuery.eq("is_active", is_active);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  dataQuery = dataQuery.order("name").range(from, to);

  const [{ count }, { data, error }] = await Promise.all([countQuery, dataQuery]);

  if (error || !data) return { categories: [], total: 0 };

  const categories = data.map((row) => {
    const r = row as unknown as CategoryRow & { product_count: { count: number }[] };
    return {
      ...r,
      product_count: r.product_count?.[0]?.count ?? 0,
    };
  });

  return { categories, total: count ?? 0 };
}

export async function getCategoryById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categories")
    .select(`*, product_count:products(count)`)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const r = data as unknown as CategoryRow & { product_count: { count: number }[] };
  return {
    ...r,
    product_count: r.product_count?.[0]?.count ?? 0,
  } as CategoryListItem;
}

export async function getActiveCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name");

  if (error || !data) return [];
  return data;
}

export async function getCategoryProductCount(categoryId: string): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category_id", categoryId);

  if (error) return 0;
  return count ?? 0;
}
