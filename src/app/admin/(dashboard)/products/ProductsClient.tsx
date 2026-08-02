"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Plus, Package, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { deleteProduct, deleteProducts } from "@/actions/products";
import { useBulkSelection } from "@/hooks/use-bulk-selection";
import { BulkDeleteBar } from "@/components/admin/BulkDeleteBar";

interface FilterOption {
  id: string;
  name: string;
}

interface ProductsClientProps {
  categories: FilterOption[];
  brands: FilterOption[];
}

export function ProductsClient({ categories, brands }: ProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = useMemo(() => ({
    search: searchParams.get("search") || "",
    category_id: searchParams.get("category_id") || "",
    brand_id: searchParams.get("brand_id") || "",
    stock_status: searchParams.get("stock_status") || "",
    is_featured: searchParams.get("is_featured") || "",
    is_active: searchParams.get("is_active") || "",
    page: parseInt(searchParams.get("page") || "1", 10),
  }), [searchParams]);

  const setFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "page") params.set("page", "1");
    router.push(`/admin/products?${params.toString()}`);
  }, [router, searchParams]);

  const clearFilters = useCallback(() => {
    router.push("/admin/products");
  }, [router]);

  const hasFilters = current.search || current.category_id || current.brand_id || current.stock_status || current.is_featured || current.is_active;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search products..."
            defaultValue={current.search}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setFilter("search", (e.target as HTMLInputElement).value);
              }
            }}
            className="w-full rounded-xl border border-white/8 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/25 focus:border-ocean/40 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
          />
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-ocean px-4 py-2.5 text-sm font-medium text-white hover:bg-ocean-dark transition-colors shadow-md shadow-ocean/20"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={current.category_id}
          onChange={(e) => setFilter("category_id", e.target.value)}
          className="rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-sm text-white/80 focus:border-ocean/40 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={current.brand_id}
          onChange={(e) => setFilter("brand_id", e.target.value)}
          className="rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-sm text-white/80 focus:border-ocean/40 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <select
          value={current.stock_status}
          onChange={(e) => setFilter("stock_status", e.target.value)}
          className="rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-sm text-white/80 focus:border-ocean/40 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
        >
          <option value="">All Stock</option>
          <option value="in_stock">In Stock</option>
          <option value="limited">Limited</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="coming_soon">Coming Soon</option>
        </select>

        <select
          value={current.is_featured}
          onChange={(e) => setFilter("is_featured", e.target.value)}
          className="rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-sm text-white/80 focus:border-ocean/40 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
        >
          <option value="">All Products</option>
          <option value="true">Featured</option>
          <option value="false">Not Featured</option>
        </select>

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

export function ProductTable({
  products,
  total,
  page,
  pageSize,
}: {
  products: {
    id: string;
    name: string;
    slug: string;
    main_image_url: string | null;
    price: number;
    stock_status: string;
    is_featured: boolean;
    is_new: boolean;
    is_active: boolean;
    created_at: string;
    category: { name: string } | null;
    brand: { name: string } | null;
  }[];
  total: number;
  page: number;
  pageSize: number;
}) {
  const router = useRouter();
  const totalPages = Math.ceil(total / pageSize);
  const { selected, toggle, toggleAll, clear, allSelected, count } = useBulkSelection(
    useMemo(() => products.map((p) => p.id), [products]),
  );

  const stockLabel: Record<string, { label: string; color: string }> = {
    in_stock: { label: "In Stock", color: "bg-emerald-500/10 text-emerald-300" },
    limited: { label: "Limited", color: "bg-amber-500/10 text-amber-300" },
    out_of_stock: { label: "Out of Stock", color: "bg-red-500/10 text-red-300" },
    coming_soon: { label: "Coming Soon", color: "bg-blue-500/10 text-blue-300" },
  };

  const goToPage = (p: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(p));
    router.push(`/admin/products?${params.toString()}`);
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/8 bg-white/[0.02] px-6 py-16 text-center">
        <Package className="mb-4 h-12 w-12 text-white/20" />
        <p className="font-clash text-base font-semibold text-white/50">
          No products found
        </p>
        <p className="mt-1 text-sm text-white/30">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <BulkDeleteBar
        count={count}
        label={count === 1 ? "product" : "products"}
        onDelete={async () => {
          const result = await deleteProducts([...selected]);
          if (!result?.error) router.refresh();
          return result;
        }}
        onClear={clear}
      />
      <div className="rounded-2xl border border-white/8 bg-white/5 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-white/15">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 text-left">
              <th className="px-5 py-3.5 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  disabled={products.length === 0}
                  aria-label="Select all products on this page"
                  className="h-4 w-4 cursor-pointer rounded accent-ocean"
                />
              </th>
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-white/30">Product</th>
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-white/30">Brand</th>
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-white/30">Category</th>
              <th className="px-5 py-3.5 text-right text-caption font-bold uppercase tracking-[0.12em] text-white/30">Price</th>
              <th className="px-5 py-3.5 text-caption font-bold uppercase tracking-[0.12em] text-white/30">Stock</th>
              <th className="px-5 py-3.5 text-center text-caption font-bold uppercase tracking-[0.12em] text-white/30">Feat.</th>
              <th className="px-5 py-3.5 text-center text-caption font-bold uppercase tracking-[0.12em] text-white/30">New</th>
              <th className="px-5 py-3.5 text-center text-caption font-bold uppercase tracking-[0.12em] text-white/30">Active</th>
              <th className="px-5 py-3.5 text-right text-caption font-bold uppercase tracking-[0.12em] text-white/30">Date</th>
              <th className="px-5 py-3.5 text-right text-caption font-bold uppercase tracking-[0.12em] text-white/30">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((product) => (
              <tr key={product.id} className="group transition-colors hover:bg-white/[0.03]">
                <td className="px-5 py-3.5">
                  <input
                    type="checkbox"
                    checked={selected.has(product.id)}
                    onChange={() => toggle(product.id)}
                    aria-label={`Select ${product.name}`}
                    className="h-4 w-4 cursor-pointer rounded accent-ocean"
                  />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-white/8 border border-white/10 transition-transform group-hover:scale-105">
                      {product.main_image_url ? (
                        <Image
                          src={product.main_image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="36px"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-white/20">
                          <Package className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-white leading-tight">{product.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-white/50">{product.brand?.name ?? "—"}</td>
                <td className="px-5 py-3.5 text-sm text-white/50">{product.category?.name ?? "—"}</td>
                <td className="px-5 py-3.5 text-right">
                  <span className="text-sm font-bold text-white">{Number(product.price).toLocaleString()}</span>
                  <span className="ml-1 text-caption font-medium text-white/30">RWF</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${stockLabel[product.stock_status]?.color || "bg-white/5 text-white/50"}`}>
                    {stockLabel[product.stock_status]?.label || product.stock_status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-center">
                  {product.is_featured ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-white/20">—</span>}
                </td>
                <td className="px-5 py-3.5 text-center">
                  {product.is_new ? <span className="text-blue-400 font-bold">✓</span> : <span className="text-white/20">—</span>}
                </td>
                <td className="px-5 py-3.5 text-center">
                  {product.is_active ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-red-400">✗</span>}
                </td>
                <td className="px-5 py-3.5 text-right whitespace-nowrap">
                  <span className="text-xs text-white/30">
                    {new Date(product.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/product/${product.slug}`}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/40 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-ocean hover:bg-ocean/15 transition-colors"
                    >
                      Edit
                    </Link>
                    <DeleteButton productId={product.id} />
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
                  p === page
                    ? "bg-ocean text-white shadow-sm"
                    : "text-white/50 hover:bg-white/10"
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
    </div>
  );
}

function DeleteButton({ productId }: { productId: string }) {
  return (
    <form
      action={async () => {
        if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
          await deleteProduct(productId);
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
  );
}
