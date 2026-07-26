"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Plus, Tags, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { deleteCategory } from "@/actions/categories";

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
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search categories..."
            defaultValue={current.search}
            onKeyDown={(e) => {
              if (e.key === "Enter") setFilter("search", (e.target as HTMLInputElement).value);
            }}
            className="w-full rounded-xl border border-white/8 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/25 focus:border-ocean/40 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
          />
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 rounded-xl bg-ocean px-4 py-2.5 text-sm font-medium text-white hover:bg-ocean-dark transition-colors shadow-md shadow-ocean/20"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={current.is_active}
          onChange={(e) => setFilter("is_active", e.target.value)}
          className="rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-sm text-white/80 focus:border-ocean/40 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-sm text-white/50 hover:bg-white/10 transition-colors cursor-pointer"
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

  const goToPage = (p: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(p));
    router.push(`/admin/categories?${params.toString()}`);
  };

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/8 bg-white/[0.02] px-6 py-16 text-center">
        <Tags className="mb-4 h-12 w-12 text-white/20" />
        <p className="font-clash text-base font-semibold text-white/50">No categories found</p>
        <p className="mt-1 text-sm text-white/30">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-white/15">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 text-left">
              <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">Category</th>
              <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">Slug</th>
              <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">Description</th>
              <th className="px-5 py-3.5 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">Products</th>
              <th className="px-5 py-3.5 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">Active</th>
              <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">Created</th>
              <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {categories.map((cat) => (
              <tr key={cat.id} className="group transition-colors hover:bg-white/[0.03]">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-white/8 border border-white/10 transition-transform group-hover:scale-105">
                      {cat.image_url ? (
                        <Image src={cat.image_url} alt={cat.name} fill className="object-cover" sizes="36px" unoptimized />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-white/20">
                          <Tags className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-white leading-tight">{cat.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-white/30 font-mono text-xs">{cat.slug}</td>
                <td className="px-5 py-3.5 text-sm text-white/30 max-w-xs truncate">{cat.description || "—"}</td>
                <td className="px-5 py-3.5 text-center text-sm font-semibold text-white/70">{cat.product_count}</td>
                <td className="px-5 py-3.5 text-center">
                  {cat.is_active ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-red-400">✗</span>}
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap text-right">
                  <span className="text-xs text-white/30">
                    {new Date(cat.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/categories/${cat.id}/edit`}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-ocean hover:bg-ocean/15 transition-colors"
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
        <div className="flex items-center justify-between border-t border-white/5 px-5 py-3">
          <p className="text-xs text-white/30">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="inline-flex cursor-pointer items-center justify-center rounded-lg p-2 text-white/30 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`inline-flex cursor-pointer items-center justify-center rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                  p === page ? "bg-ocean text-white shadow-sm" : "text-white/50 hover:bg-white/10"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              className="inline-flex cursor-pointer items-center justify-center rounded-lg p-2 text-white/30 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
