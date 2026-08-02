"use server";

import { getPublicProducts, PublicProduct } from "@/data/public-products";

export interface ProductsPageParams {
  search?: string;
  category_slug?: string;
  brand_slug?: string;
  sort?: string;
  stock_status?: string;
  is_featured?: boolean;
  is_new?: boolean;
}

/**
 * Device-aware page fetch used by the responsive products grid.
 * Only the requested page of products (12/18/24) is ever sent to the
 * browser — never the full catalog. pageSize is clamped server-side.
 */
export async function fetchProductsPage(params: ProductsPageParams, page: number, pageSize: number) {
  const size = [12, 18, 24].includes(pageSize) ? pageSize : 24;
  const result = await getPublicProducts({
    search: params.search,
    category_slug: params.category_slug,
    brand_slug: params.brand_slug,
    sort: params.sort,
    stock_status: params.stock_status,
    is_featured: params.is_featured,
    is_new: params.is_new,
    page: Math.max(1, page),
    pageSize: size,
  });

  return { products: result.products as PublicProduct[], total: result.total, pageSize: size };
}
