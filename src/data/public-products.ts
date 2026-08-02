import "server-only";
import { createClient } from "@/lib/supabase-server";
import type { Database } from "@/types/database";
import { toProductSpecifications, toProductHighlights, toStorageOptions } from "@/types/specifications";
import type { ProductSpecifications, ProductHighlights } from "@/types/specifications";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

type ProductWithRelations = ProductRow & {
  category?: { id?: string; name?: string; slug?: string } | null;
  brand?: { id?: string; name?: string; slug?: string; logo_url?: string | null } | null;
};

type SearchProductRow = Pick<
  ProductRow,
  "id" | "slug" | "name" | "price" | "old_price" | "main_image_url" | "stock_status" | "short_description" | "rating" | "review_count"
> & {
  category?: { name?: string } | null;
  brand?: { name?: string } | null;
};

export interface PublicProduct {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  description: string | null;
  price: number;
  old_price: number | null;
  discount_percentage: number | null;
  rating: number | null;
  review_count: number | null;
  main_image_url: string | null;
  stock_status: string;
  is_featured: boolean;
  is_new: boolean;
  category_name: string | null;
  category_slug: string | null;
  category_id: string | null;
  brand_name: string | null;
  brand_slug: string | null;
  brand_logo_url: string | null;
  brand_id: string | null;
  created_at: string;
  specifications: ProductSpecifications;
  highlights: ProductHighlights;
  storage_options: string[];
}

export interface ProductsListResponse {
  products: PublicProduct[];
  total: number;
  categories: { id: string; name: string; slug: string }[];
  brands: { id: string; name: string; slug: string }[];
  categoryCounts: Record<string, number>;
  brandCounts: Record<string, number>;
}

export async function getPublicProducts(params: {
  search?: string;
  category_slug?: string;
  brand_slug?: string;
  sort?: string;
  stock_status?: string;
  is_featured?: boolean;
  is_new?: boolean;
  page?: number;
  pageSize?: number;
}): Promise<ProductsListResponse> {
  const supabase = createClient();
  const { search, category_slug, brand_slug, sort, stock_status, is_featured, is_new, page = 1, pageSize = 16 } = params;

  let query = supabase
    .from("products")
    .select(`*, category:category_id(id, name, slug), brand:brand_id(id, name, slug, logo_url)`)
    .eq("is_active", true);

  let countQuery = supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  if (search) {
    const term = `%${search}%`;
    query = query.or(`name.ilike.${term},short_description.ilike.${term}`);
    countQuery = countQuery.or(`name.ilike.${term},short_description.ilike.${term}`);
  }

  if (category_slug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category_slug)
      .eq("is_active", true)
      .maybeSingle();
    if (cat) {
      query = query.eq("category_id", cat.id);
      countQuery = countQuery.eq("category_id", cat.id);
    }
  }

  if (brand_slug) {
    const { data: br } = await supabase
      .from("brands")
      .select("id")
      .eq("slug", brand_slug)
      .eq("is_active", true)
      .maybeSingle();
    if (br) {
      query = query.eq("brand_id", br.id);
      countQuery = countQuery.eq("brand_id", br.id);
    }
  }

  if (stock_status) {
    query = query.eq("stock_status", stock_status);
    countQuery = countQuery.eq("stock_status", stock_status);
  }

  if (is_featured !== undefined) {
    query = query.eq("is_featured", is_featured);
    countQuery = countQuery.eq("is_featured", is_featured);
  }

  if (is_new !== undefined) {
    query = query.eq("is_new", is_new);
    countQuery = countQuery.eq("is_new", is_new);
  }

  // New products (NEW pill) always rank first, then the chosen sort
  query = query.order("is_new", { ascending: false });
  switch (sort) {
    case "price_asc": query = query.order("price", { ascending: true }); break;
    case "price_desc": query = query.order("price", { ascending: false }); break;
    case "newest": query = query.order("created_at", { ascending: false }); break;
    case "name": query = query.order("name", { ascending: true }); break;
    default: query = query.order("created_at", { ascending: false }); break;
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const [countResult, dataResult, categoriesResult, brandsResult, allRowsResult] = await Promise.allSettled([
    countQuery,
    query,
    supabase.from("categories").select("id, name, slug").eq("is_active", true).order("name"),
    supabase.from("brands").select("id, name, slug").eq("is_active", true).order("name"),
    supabase.from("products").select("category_id, brand_id").eq("is_active", true),
  ]);

  const total = countResult.status === "fulfilled" ? (countResult.value.count ?? 0) : 0;
  const data = dataResult.status === "fulfilled" ? dataResult.value.data : null;
  const categories = categoriesResult.status === "fulfilled" ? (categoriesResult.value.data || []) : [];
  const brands = brandsResult.status === "fulfilled" ? (brandsResult.value.data || []) : [];

  const allRows = allRowsResult.status === "fulfilled" ? (allRowsResult.value.data || []) : [];
  const categoryCounts: Record<string, number> = {};
  const brandCounts: Record<string, number> = {};
  allRows.forEach((r) => {
    if (r.category_id) categoryCounts[r.category_id] = (categoryCounts[r.category_id] || 0) + 1;
    if (r.brand_id) brandCounts[r.brand_id] = (brandCounts[r.brand_id] || 0) + 1;
  });

  const products: PublicProduct[] = (data || []).map((row: ProductWithRelations) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    short_description: row.short_description,
    description: row.description,
    price: Number(row.price),
    old_price: row.old_price ? Number(row.old_price) : null,
    discount_percentage: row.discount_percentage,
    rating: row.rating ? Number(row.rating) : null,
    review_count: row.review_count,
    main_image_url: row.main_image_url,
    stock_status: row.stock_status,
    is_featured: row.is_featured,
    is_new: row.is_new,
    category_name: row.category?.name || null,
    category_slug: row.category?.slug || null,
    category_id: row.category_id,
    brand_name: row.brand?.name || null,
    brand_slug: row.brand?.slug || null,
    brand_logo_url: row.brand?.logo_url || null,
    brand_id: row.brand_id,
    created_at: row.created_at,
    specifications: toProductSpecifications(row.specifications),
    highlights: toProductHighlights(row.highlights),
    storage_options: toStorageOptions(row.storage_options),
  }));

  return { products, total, categories, brands, categoryCounts, brandCounts };
}

export async function getPublicProductBySlug(slug: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`*, category:category_id(id, name, slug), brand:brand_id(id, name, slug, logo_url)`)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) return null;

  const { data: images } = await supabase
    .from("product_images")
    .select("id, image_url, sort_order")
    .eq("product_id", data.id)
    .order("sort_order");

  const { data: related } = await supabase
    .from("products")
    .select(`id, slug, name, price, old_price, main_image_url, stock_status, discount_percentage, rating, review_count, short_description, category:category_id(name, slug), brand:brand_id(name)`)
    .eq("is_active", true)
    .or(`category_id.eq.${data.category_id},brand_id.eq.${data.brand_id}`)
    .neq("id", data.id)
    .limit(4);

  const productWithRelations = data as ProductWithRelations;

  const product = {
    id: data.id,
    slug: data.slug,
    name: data.name,
    short_description: data.short_description,
    description: data.description,
    price: Number(data.price),
    old_price: data.old_price ? Number(data.old_price) : null,
    discount_percentage: data.discount_percentage,
    rating: data.rating ? Number(data.rating) : null,
    review_count: data.review_count,
    main_image_url: data.main_image_url,
    stock_status: data.stock_status,
    is_featured: data.is_featured,
    is_new: data.is_new,
    category_name: productWithRelations.category?.name || null,
    category_slug: productWithRelations.category?.slug || null,
    category_id: data.category_id,
    brand_name: productWithRelations.brand?.name || null,
    brand_slug: productWithRelations.brand?.slug || null,
    brand_logo_url: productWithRelations.brand?.logo_url || null,
    brand_id: data.brand_id,
    created_at: data.created_at,
    images: images || [],
    specifications: toProductSpecifications(data.specifications),
    highlights: toProductHighlights(data.highlights),
    storage_options: toStorageOptions(data.storage_options),
  };

  const relatedProducts = (related || [])
    .filter((r) => r.id !== data.id)
    .slice(0, 4)
    .map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      price: Number(r.price),
      old_price: r.old_price ? Number(r.old_price) : null,
      discount_percentage: r.discount_percentage,
      rating: r.rating ? Number(r.rating) : null,
      review_count: r.review_count,
      main_image_url: r.main_image_url,
      stock_status: r.stock_status,
      short_description: r.short_description,
      category_name: r.category?.name || null,
      brand_name: r.brand?.name || null,
    }));

  return { product, relatedProducts };
}

export async function getPublicProductsByCategorySlug(slug: string) {
  const supabase = createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!category) return null;

  const { data: products } = await supabase
    .from("products")
    .select(`*, category:category_id(id, name, slug), brand:brand_id(id, name, slug, logo_url)`)
    .eq("category_id", category.id)
    .eq("is_active", true)
    .order("is_new", { ascending: false })
    .order("created_at", { ascending: false });

  return {
    category,
    products: (products || []).map((row: ProductWithRelations) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      short_description: row.short_description,
      price: Number(row.price),
      old_price: row.old_price ? Number(row.old_price) : null,
      discount_percentage: row.discount_percentage,
      rating: row.rating ? Number(row.rating) : null,
      review_count: row.review_count,
      main_image_url: row.main_image_url,
      stock_status: row.stock_status,
      is_featured: row.is_featured,
      is_new: row.is_new,
      category_name: row.category?.name || null,
      brand_name: row.brand?.name || null,
      brand_slug: row.brand?.slug || null,
      created_at: row.created_at,
    })),
  };
}

export async function getPublicBrandBySlug(slug: string) {
  const supabase = createClient();

  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!brand) return null;

  const { data: products } = await supabase
    .from("products")
    .select(`*, category:category_id(name, slug)`)
    .eq("brand_id", brand.id)
    .eq("is_active", true)
    .order("is_new", { ascending: false })
    .order("created_at", { ascending: false });

  const { data: allBrands } = await supabase
    .from("brands")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name");

  return {
    brand,
    products: (products || []).map((row: ProductWithRelations) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      short_description: row.short_description,
      price: Number(row.price),
      old_price: row.old_price ? Number(row.old_price) : null,
      discount_percentage: row.discount_percentage,
      rating: row.rating ? Number(row.rating) : null,
      review_count: row.review_count,
      main_image_url: row.main_image_url,
      stock_status: row.stock_status,
      is_featured: row.is_featured,
      is_new: row.is_new,
      category_name: row.category?.name || null,
      created_at: row.created_at,
    })),
    allBrands: allBrands || [],
  };
}

export async function searchProducts(query: string) {
  const supabase = createClient();
  const rawTerm = query.trim();
  if (!rawTerm) return [];

  // Match pattern: case-insensitive containing phrase or exact terms
  const term = `%${rawTerm}%`;

  const { data } = await supabase
    .from("products")
    .select(`id, slug, name, price, old_price, main_image_url, stock_status, rating, review_count, short_description, category:category_id(name), brand:brand_id(name)`)
    .eq("is_active", true)
    .or(`name.ilike.${term},short_description.ilike.${term}`)
    .limit(40);

  const lowerTerm = rawTerm.toLowerCase();

  // Also check if any category or brand matches exact query term
  const { data: catData } = await supabase
    .from("categories")
    .select("id")
    .ilike("name", term)
    .eq("is_active", true);

  const { data: brandData } = await supabase
    .from("brands")
    .select("id")
    .ilike("name", term)
    .eq("is_active", true);

  let additionalByCatOrBrand: SearchProductRow[] = [];
  const catIds = (catData || []).map((c) => c.id);
  const brandIds = (brandData || []).map((b) => b.id);

  if (catIds.length > 0 || brandIds.length > 0) {
    let orConditions: string[] = [];
    if (catIds.length > 0) orConditions.push(`category_id.in.(${catIds.join(",")})`);
    if (brandIds.length > 0) orConditions.push(`brand_id.in.(${brandIds.join(",")})`);

    const { data: extra } = await supabase
      .from("products")
      .select(`id, slug, name, price, old_price, main_image_url, stock_status, rating, review_count, short_description, category:category_id(name), brand:brand_id(name)`)
      .eq("is_active", true)
      .or(orConditions.join(","))
      .limit(40);

    additionalByCatOrBrand = (extra || []) as SearchProductRow[];
  }

  // Combine and deduplicate
  const combinedMap = new Map<string, SearchProductRow>();
  ((data || []) as SearchProductRow[]).forEach((row) => combinedMap.set(row.id, row));
  additionalByCatOrBrand.forEach((row) => combinedMap.set(row.id, row));

  const allResults = Array.from(combinedMap.values());

  // Rank exact/prefix matches higher regardless of capitalization
  allResults.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    const aBrand = (a.brand?.name || "").toLowerCase();
    const bBrand = (b.brand?.name || "").toLowerCase();
    const aCat = (a.category?.name || "").toLowerCase();
    const bCat = (b.category?.name || "").toLowerCase();

    const aExact = aName === lowerTerm || aBrand === lowerTerm || aCat === lowerTerm;
    const bExact = bName === lowerTerm || bBrand === lowerTerm || bCat === lowerTerm;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;

    const aStarts = aName.startsWith(lowerTerm) || aBrand.startsWith(lowerTerm) || aCat.startsWith(lowerTerm);
    const bStarts = bName.startsWith(lowerTerm) || bBrand.startsWith(lowerTerm) || bCat.startsWith(lowerTerm);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    return aName.localeCompare(bName);
  });

  return allResults.slice(0, 24).map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: Number(row.price),
    old_price: row.old_price ? Number(row.old_price) : null,
    rating: row.rating ? Number(row.rating) : null,
    review_count: row.review_count,
    main_image_url: row.main_image_url,
    stock_status: row.stock_status,
    short_description: row.short_description,
    category_name: row.category?.name || null,
    brand_name: row.brand?.name || null,
  }));
}
