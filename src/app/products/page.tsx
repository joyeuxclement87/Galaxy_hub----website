import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import ProductsGrid from "@/components/ui/products-grid";
import { PRODUCTS, CATEGORIES, Product } from "@/data/mock-data";
import SortSelect from "@/components/ui/sort-select";

export const dynamic = "force-static";

export async function generateMetadata() {
  return {
    title: "Products — Galaxy Hub",
    description:
      "Browse genuine smartphones, laptops, accessories, creator gear, and audio products available in Kigali with delivery across Rwanda.",
  };
}

function buildHref(params: Record<string, string | number | undefined>) {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v) !== "") u.set(k, String(v));
  });
  const s = u.toString();
  return s ? `/products?${s}` : "/products";
}

export default function ProductsPage({ searchParams }: { searchParams?: { [key: string]: string } }) {
  const params = searchParams || {};
  const q = params.q || "";
  const category = params.category || "";
  const brand = params.brand || "";
  const sort = params.sort || "featured";
  const page = parseInt(params.page || "1", 10) || 1;
  const pageSize = 16;

  // Filter products (server-side, SEO-friendly)
  let filtered: Product[] = PRODUCTS.slice();
  if (category) filtered = filtered.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()) || p.category.toLowerCase() === category.toLowerCase());
  if (brand) filtered = filtered.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
  if (q) filtered = filtered.filter((p) => (p.title + " " + p.description + " " + (p.specsSummary || "")).toLowerCase().includes(q.toLowerCase()));

  // Sorting (simple)
  if (sort === "price_asc") filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
  else if (sort === "price_desc") filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
  else if (sort === "newest") filtered.sort((a, b) => (b.featured === a.featured ? 0 : b.featured ? 1 : -1));

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const pageProducts = filtered.slice(start, start + pageSize);

  // Unique brand list for filters
  const brands = Array.from(new Set(PRODUCTS.map((p) => p.brand))).slice(0, 12);

  return (
    <div className="min-h-screen bg-[#F8F9FA] selection:bg-ocean/20 selection:text-ocean">
      <Navbar />

      <main className="pt-24 md:pt-32 pb-24">
        <div className="mx-auto max-w-[1320px] px-6 md:px-12">
          <section className="grid grid-cols-1 lg:grid-cols-8 gap-8 items-center mb-8">
            <div className="lg:col-span-6">
              <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-accent">PRODUCTS</span>
              <h1 className="font-clash text-3xl md:text-4xl font-bold text-[#10233D] mt-3">Find Your Next Device</h1>
              <p className="mt-3 max-w-2xl text-sm text-[#10233D]/70">Browse genuine smartphones, laptops, accessories, creator gear, audio products, and more—available in Kigali with delivery across Rwanda.</p>
            </div>
            <div className="lg:col-span-2 text-right">
              <div className="text-sm text-ocean/60">{total.toLocaleString()}+ Products</div>
            </div>
          </section>

          {/* Sticky Toolbar */}
          <nav className="sticky top-20 z-40 bg-white/0 py-3 backdrop-blur-sm">
            <div className="mx-auto max-w-[1320px] px-6 md:px-12">
              <div className="flex items-center gap-3 justify-between bg-white/0">
                <form method="get" action="/products" className="flex-1 pr-4">
                  <input name="q" defaultValue={q} placeholder="Search Products..." className="w-full rounded-xl border border-black/8 px-4 py-3 text-sm bg-white" />
                </form>

                <div className="flex items-center gap-3">
                  <SortSelect params={params} currentSort={sort} />
                  <div className="hidden sm:flex items-center gap-2 text-sm">
                    <Link href={buildHref({ ...params, view: "grid" })} className="px-3 py-2 rounded-md bg-white/90 border border-black/6">Grid</Link>
                    <Link href={buildHref({ ...params, view: "list" })} className="px-3 py-2 rounded-md border border-black/6">List</Link>
                  </div>
                  <label htmlFor="filter-drawer" className="ml-2 inline-flex items-center gap-2 rounded-xl border border-black/8 px-3 py-2 text-sm bg-white cursor-pointer lg:hidden">Filter</label>
                </div>
              </div>
            </div>
          </nav>

          <div className="mx-auto max-w-[1320px] px-6 md:px-12 mt-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <aside className="hidden lg:block lg:w-[300px] shrink-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-[#10233D]">Categories</h3>
                    <ul className="mt-3 space-y-2 text-sm text-[#10233D]/70">
                      <li><Link href={buildHref({ ...params, category: "" })} className="block hover:underline">All</Link></li>
                      {CATEGORIES.map((c) => (
                        <li key={c.id}><Link href={buildHref({ ...params, category: c.slug })} className="block hover:underline">{c.name}</Link></li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-[#10233D]">Brands</h3>
                    <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-[#10233D]/70">
                      {brands.map((b) => (
                        <li key={b}><Link href={buildHref({ ...params, brand: b })} className="block hover:underline">{b}</Link></li>
                      ))}
                    </ul>
                    <div className="mt-3 text-xs">
                      <Link href={buildHref({})} className="text-ocean/70 hover:underline">Reset filters</Link>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Mobile Filter Drawer (CSS only) */}
              <div className="lg:hidden">
                <input id="filter-drawer" type="checkbox" className="peer hidden" />
                <div className="peer-checked:translate-x-0 translate-x-full fixed inset-y-0 right-0 z-50 w-80 transform bg-white p-6 transition-transform duration-300 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Filters</h3>
                    <label htmlFor="filter-drawer" className="text-sm cursor-pointer">Close</label>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold">Categories</h4>
                      <ul className="mt-2 space-y-2 text-sm">
                        <li><Link href={buildHref({ ...params, category: "" })} className="block">All</Link></li>
                        {CATEGORIES.map((c) => (
                          <li key={c.id}><Link href={buildHref({ ...params, category: c.slug })} className="block">{c.name}</Link></li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Brands</h4>
                      <ul className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        {brands.map((b) => (
                          <li key={b}><Link href={buildHref({ ...params, brand: b })} className="block">{b}</Link></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <div className="flex-1">
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-[#10233D]/70">Showing <span className="font-semibold text-[#10233D]">{start + 1}</span> - <span className="font-semibold text-[#10233D]">{Math.min(start + pageSize, total)}</span> of <span className="font-semibold text-[#10233D]">{total}</span></div>
                    <div className="text-sm text-[#10233D]/60">Page {page} of {totalPages}</div>
                  </div>
                </div>

                <ProductsGrid products={pageProducts} />

                {/* Collection banners placeholder */}
                <div className="mt-8 space-y-6">
                  <div className="rounded-[18px] overflow-hidden bg-white p-6 border border-ocean/8">
                    <h3 className="font-semibold">Creator Essentials</h3>
                    <p className="text-sm text-[#10233D]/60">Selected equipment for content creators.</p>
                  </div>
                </div>

                {/* Pagination */}
                <div className="mt-8 flex items-center justify-center gap-3">
                  <Link href={buildHref({ ...params, page: Math.max(1, page - 1) })} className={`px-3 py-2 rounded-md border ${page === 1 ? "opacity-40 pointer-events-none" : ""}`}>Previous</Link>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Link key={i} href={buildHref({ ...params, page: i + 1 })} className={`px-3 py-2 rounded-md ${i + 1 === page ? "bg-ocean text-white" : "border"}`}>
                      {i + 1}
                    </Link>
                  ))}
                  <Link href={buildHref({ ...params, page: Math.min(totalPages, page + 1) })} className={`px-3 py-2 rounded-md border ${page === totalPages ? "opacity-40 pointer-events-none" : ""}`}>Next</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
