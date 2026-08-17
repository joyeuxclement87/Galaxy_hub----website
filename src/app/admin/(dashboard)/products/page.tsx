import { Suspense } from "react";
import { getProducts, getCategories, getBrands } from "@/data/products";
import { ProductsClient, ProductTable } from "./ProductsClient";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const search = typeof params.search === "string" ? params.search : "";
  const category_id = typeof params.category_id === "string" ? params.category_id : "";
  const brand_id = typeof params.brand_id === "string" ? params.brand_id : "";
  const stock_status = typeof params.stock_status === "string" ? params.stock_status : "";
  const is_featured = typeof params.is_featured === "string" ? params.is_featured : "";
  const is_active = typeof params.is_active === "string" ? params.is_active : "";
  const sortParam = typeof params.sort === "string" && ["newest", "name", "price_asc", "price_desc", "stock"].includes(params.sort)
    ? (params.sort as "newest" | "name" | "price_asc" | "price_desc" | "stock")
    : "newest";
  const page = typeof params.page === "string" ? parseInt(params.page, 10) || 1 : 1;

  const pageSize = 20;

  const [result, categories, brands] = await Promise.all([
    getProducts({
      search,
      category_id,
      brand_id,
      stock_status,
      is_featured: is_featured ? is_featured === "true" : undefined,
      is_active: is_active ? is_active === "true" : undefined,
      sort: sortParam,
      page,
      pageSize,
    }),
    getCategories(),
    getBrands(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-clash text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Products</h1>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
          Manage your product catalog.
        </p>
      </div>

      <ProductsClient categories={categories} brands={brands} />

      <Suspense fallback={<ProductsTableSkeleton />}>
        <ProductTable
          products={result.products}
          total={result.total}
          page={page}
          pageSize={pageSize}
        />
      </Suspense>
    </div>
  );
}

function ProductsTableSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:bg-[#0f2438]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {Array.from({ length: 10 }).map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, row) => (
              <tr key={row} className="border-b border-gray-100">
                {Array.from({ length: 10 }).map((_, col) => (
                  <td key={col} className="px-4 py-3">
                    <div
                      className={`h-4 animate-pulse rounded bg-gray-200 ${
                        col === 0 ? "w-40" : col === 1 || col === 2 ? "w-16" : "w-12"
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
