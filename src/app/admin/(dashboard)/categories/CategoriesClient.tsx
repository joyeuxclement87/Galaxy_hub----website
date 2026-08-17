"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Plus, Tags, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { deleteCategory, deleteCategories } from "@/actions/categories";
import { useBulkSelection } from "@/hooks/use-bulk-selection";
import { BulkDeleteBar } from "@/components/admin/BulkDeleteBar";

export function CategoriesFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = useMemo(() => ({
    search: searchParams.get("search") || "",
    is_active: searchParams.get("is_active") || "",
    page: parseInt(searchParams.get("page") || "1", 10),
  }), [searchParams]);

  const setFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== "page") params.set("page", "1");
    router.push(`/admin/categories?${params.toString()}`);
  }, [router, searchParams]);

  const clearFilters = useCallback(() => router.push("/admin/categories"), [router]);

  const hasFilters = current.search || current.is_active;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search categories..."
            defaultValue={current.search}
            onKeyDown={(e) => {
              if (e.key === "Enter") setFilter("search", (e.target as HTMLInputElement).value);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] py-2.5 pl-9 pr-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
          />
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 rounded-xl bg-ocean px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 hover:bg-ocean-dark transition-colors shadow-md shadow-ocean/20"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={current.is_active}
          onChange={(e) => setFilter("is_active", e.target.value)}
          className="rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:border-ocean/40 focus:bg-slate-100 dark:bg-[#162f4a] focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1c3a5c] transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}

export function CategoriesTable({
  categories,
  total,
  page,
  pageSize,
}: {
  categories: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    is_active: boolean;
    product_count: number;
    created_at: string;
  }[];
  total: number;
  page: number;
  pageSize: number;
}) {
  const router = useRouter();
  const totalPages = Math.ceil(total / pageSize);
  const { selected, toggle, toggleAll, clear, allSelected, count } = useBulkSelection(
    useMemo(() => categories.map((c) => c.id), [categories]),
  );

  const goToPage = (p: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(p));
    router.push(`/admin/categories?${params.toString()}`);
  };

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] px-6 py-16 text-center">
        <Tags className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
        <p className="font-clash text-base font-semibold text-slate-500 dark:text-slate-400">No categories found</p>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <BulkDeleteBar
        count={count}
        label={count === 1 ? "category" : "categories"}
        onDelete={async () => {
          const result = await deleteCategories([...selected]);
          if (!result?.error) router.refresh();
          return result;
        }}
        onClear={clear}
      />
      <div className="rounded-2xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-500">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-[#1a3352] text-left">
              <th className="px-5 py-3.5 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  disabled={categories.length === 0}
                  aria-label="Select all categories on this page"
                  className="h-4 w-4 cursor-pointer rounded accent-ocean"
                />
              </th>
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Category</th>
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Slug</th>
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Description</th>
              <th className="px-5 py-3.5 text-center text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Products</th>
              <th className="px-5 py-3.5 text-center text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Active</th>
              <th className="px-5 py-3.5 text-right text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Created</th>
              <th className="px-5 py-3.5 text-right text-caption font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1a3352]">
            {categories.map((cat) => (
              <tr key={cat.id} className="group transition-colors hover:bg-slate-50 dark:hover:bg-[#132c46]">
                <td className="px-5 py-3.5">
                  <input
                    type="checkbox"
                    checked={selected.has(cat.id)}
                    onChange={() => toggle(cat.id)}
                    aria-label={`Select ${cat.name}`}
                    className="h-4 w-4 cursor-pointer rounded accent-ocean"
                  />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-[#162f4a] border border-slate-200 dark:border-[#1e3a5f] transition-transform group-hover:scale-105">
                      {cat.image_url ? (
                        <Image src={cat.image_url} alt={cat.name} fill className="object-cover" sizes="36px" unoptimized />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300 dark:text-slate-600">
                          <Tags className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">{cat.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-400 dark:text-slate-500 font-mono text-xs">{cat.slug}</td>
                <td className="px-5 py-3.5 text-sm text-slate-400 dark:text-slate-500 max-w-xs truncate">{cat.description || "—"}</td>
                <td className="px-5 py-3.5 text-center text-sm font-semibold text-slate-600 dark:text-slate-400">{cat.product_count}</td>
                <td className="px-5 py-3.5 text-center">
                  {cat.is_active ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-red-400">✗</span>}
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap text-right">
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {new Date(cat.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/categories/${cat.id}/edit`}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-ocean dark:text-[#8ec5f2] hover:bg-ocean/15 transition-colors"
                    >
                      Edit
                    </Link>
                    <form
                      action={async () => {
                        if (!window.confirm("Delete this category? This action cannot be undone.")) return;
                        const result = await deleteCategory(cat.id);
                        if (result?.error) {
                          alert(result.error);
                        }
                      }}
                    >
                      <button
                        type="submit"
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/15 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-[#1a3352] px-5 py-3">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="inline-flex cursor-pointer items-center justify-center rounded-lg p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1c3a5c] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`inline-flex cursor-pointer items-center justify-center rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                  p === page ? "bg-ocean text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1c3a5c]"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              className="inline-flex cursor-pointer items-center justify-center rounded-lg p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1c3a5c] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
