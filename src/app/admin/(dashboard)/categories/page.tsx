import { getCategories } from "@/data/categories";
import { CategoriesFilters, CategoriesTable } from "./CategoriesClient";

export const dynamic = "force-dynamic";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const search = typeof params.search === "string" ? params.search : "";
  const is_active = typeof params.is_active === "string" ? params.is_active : "";
  const page = typeof params.page === "string" ? parseInt(params.page, 10) || 1 : 1;

  const pageSize = 50;

  const result = await getCategories({
    search,
    is_active: is_active ? is_active === "true" : undefined,
    page,
    pageSize,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-clash text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Categories</h1>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Manage product categories.</p>
      </div>

      <CategoriesFilters />
      <CategoriesTable
        categories={result.categories}
        total={result.total}
        page={page}
        pageSize={pageSize}
      />
    </div>
  );
}
