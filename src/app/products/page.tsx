import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import ProductsGrid from "@/components/ui/products-grid";
import { SortSelect } from "@/components/ui/SortSelect";
import { getPublicProducts } from "@/data/public-products";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: { searchParams?: { [key: string]: string } }) {
  const params = searchParams || {};
  const q = params.q || "";
  return {
    title: q ? `Search "${q}" — Galaxy Hub Rwanda` : "Products — Galaxy Hub Rwanda",
    description: "Browse genuine smartphones, laptops, accessories, and audio products available in Kigali with delivery across Rwanda.",
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

export default async function ProductsPage({ searchParams }: { searchParams?: { [key: string]: string } }) {
  const params = searchParams || {};
  const q = params.q || "";
  const category_slug = params.category || "";
  const brand_slug = params.brand || "";
  const sort = params.sort || "newest";
  const stock_status = params.stock || "";
  const featured = params.featured || "";
  const page = parseInt(params.page || "1", 10) || 1;

  const result = await getPublicProducts({
    search: q,
    category_slug,
    brand_slug,
    sort,
    stock_status: stock_status || undefined,
    is_featured: featured === "true" ? true : undefined,
    page,
    pageSize: 16,
  });

  const totalPages = Math.max(1, Math.ceil(result.total / 16));
  const start = (page - 1) * 16;

  return (
    <div className="min-h-screen bg-[#F8F9FA] selection:bg-ocean/20 selection:text-ocean">
      <Navbar />

      <main className="pt-24 md:pt-32 pb-24">
        <div className="mx-auto max-w-[1320px] px-6 md:px-12">
          <section className="grid grid-cols-1 lg:grid-cols-8 gap-8 items-center mb-8">
            <div className="lg:col-span-6">
              <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
                {q ? `SEARCHING: "${q}"` : "PRODUCTS"}
              </span>
              <h1 className="font-clash text-3xl md:text-4xl font-bold text-[#10233D] mt-3">
                {q ? `Results for "${q}"` : "Find Your Next Device"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-[#10233D]/70">
                Browse genuine smartphones, laptops, accessories, creator gear, audio products, and more—available in Kigali with delivery across Rwanda.
              </p>
            </div>
            <div className="lg:col-span-2 text-right">
              <div className="text-sm text-ocean/60">{result.total.toLocaleString()}+ Products</div>
            </div>
          </section>

          <nav className="sticky top-20 z-40 bg-white/0 py-3 backdrop-blur-sm">
            <div className="mx-auto max-w-[1320px] px-6 md:px-12">
              <div className="flex items-center gap-3 justify-between bg-white/0">
                <form method="get" action="/products" className="flex-1 pr-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean/30" />
                    <input name="q" defaultValue={q} placeholder="Search Products..." className="w-full rounded-xl border border-black/8 pl-10 pr-4 py-3 text-sm bg-white" />
                  </div>
                </form>
                <div className="flex items-center gap-3">
                  <SortSelect currentSort={sort} params={params} />
                </div>
              </div>
            </div>
          </nav>

          <div className="mx-auto max-w-[1320px] px-6 md:px-12 mt-6">
            <div className="flex flex-col lg:flex-row gap-8">
              <aside className="hidden lg:block lg:w-[280px] shrink-0">
                <div className="space-y-6">
                  {q && (
                    <div>
                      <h3 className="text-sm font-semibold text-[#10233D]">Search</h3>
                      <p className="mt-1 text-xs text-ocean/60">Showing results for &ldquo;{q}&rdquo;</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold text-[#10233D]">Categories</h3>
                    <ul className="mt-3 space-y-2 text-sm text-ocean/70">
                      <li><Link href={buildHref({ ...params, category: "", page: 1 })} className={`block hover:text-ocean transition-colors ${category_slug === "" || !category_slug ? "font-semibold text-ocean" : ""}`}>All Categories</Link></li>
                      {result.categories.map((c) => (
                        <li key={c.id}><Link href={buildHref({ ...params, category: c.slug, page: 1 })} className={`block hover:text-ocean transition-colors ${category_slug === c.slug ? "font-semibold text-ocean" : ""}`}>{c.name}</Link></li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-[#10233D]">Brands</h3>
                    <ul className="mt-3 space-y-2 text-sm text-ocean/70">
                      <li><Link href={buildHref({ ...params, brand: "", page: 1 })} className={`block hover:text-ocean transition-colors ${brand_slug === "" || !brand_slug ? "font-semibold text-ocean" : ""}`}>All Brands</Link></li>
                      {result.brands.map((b) => (
                        <li key={b.id}><Link href={buildHref({ ...params, brand: b.slug, page: 1 })} className={`block hover:text-ocean transition-colors ${brand_slug === b.slug ? "font-semibold text-ocean" : ""}`}>{b.name}</Link></li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-[#10233D]">Availability</h3>
                    <ul className="mt-3 space-y-2 text-sm text-ocean/70">
                      <li><Link href={buildHref({ ...params, stock: "", page: 1 })} className={`block hover:text-ocean transition-colors ${!stock_status ? "font-semibold text-ocean" : ""}`}>All</Link></li>
                      <li><Link href={buildHref({ ...params, stock: "available", page: 1 })} className={`block hover:text-ocean transition-colors ${stock_status === "available" ? "font-semibold text-ocean" : ""}`}>In Stock</Link></li>
                      <li><Link href={buildHref({ ...params, stock: "coming_soon", page: 1 })} className={`block hover:text-ocean transition-colors ${stock_status === "coming_soon" ? "font-semibold text-ocean" : ""}`}>Coming Soon</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-[#10233D]">Featured</h3>
                    <ul className="mt-3 space-y-2 text-sm text-ocean/70">
                      <li><Link href={buildHref({ ...params, featured: "", page: 1 })} className={`block hover:text-ocean transition-colors ${!featured ? "font-semibold text-ocean" : ""}`}>All Products</Link></li>
                      <li><Link href={buildHref({ ...params, featured: "true", page: 1 })} className={`block hover:text-ocean transition-colors ${featured === "true" ? "font-semibold text-ocean" : ""}`}>Featured Only</Link></li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <Link href="/products" className="text-xs font-semibold text-ocean hover:text-ocean-dark transition-colors">Reset all filters</Link>
                  </div>
                </div>
              </aside>

              <div className="flex-1">
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-ocean/70">
                      Showing <span className="font-semibold text-[#10233D]">{result.total > 0 ? start + 1 : 0}</span>
                      {" — "}
                      <span className="font-semibold text-[#10233D]">{Math.min(start + 16, result.total)}</span>
                      {" of "}
                      <span className="font-semibold text-[#10233D]">{result.total}</span>
                    </div>
                    <div className="text-sm text-ocean/60">Page {page} of {totalPages}</div>
                  </div>
                </div>

                {result.products.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <SlidersHorizontal className="mb-4 h-12 w-12 text-ocean/20" />
                    <h3 className="font-clash text-lg font-bold text-[#10233D]">No products found</h3>
                    <p className="mt-2 text-sm text-ocean/60">Try adjusting your search or filters.</p>
                    <Link href="/products" className="mt-6 text-sm font-semibold text-ocean hover:text-ocean-dark transition-colors">Clear all filters</Link>
                  </div>
                ) : (
                  <ProductsGrid
                    products={result.products.map((p) => ({
                      id: p.id,
                      slug: p.slug,
                      title: p.name,
                      tagline: p.short_description || "",
                      description: p.description || "",
                      price: p.price,
                      originalPrice: p.old_price || undefined,
                      currency: "RWF",
                      category: p.category_name || "",
                      brand: p.brand_name || "",
                      image: p.main_image_url || "",
                      featured: p.is_featured,
                      specifications: {},
                      availability: p.stock_status === "available" ? "In Stock" : p.stock_status === "coming_soon" ? "Limited Stock" : "Out of Stock",
                      badge: p.is_new ? "NEW" : p.discount_percentage ? "SALE" : undefined,
                      rating: 4.8,
                      reviewCount: 32,
                    }))}
                  />
                )}

                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-3">
                    <Link href={buildHref({ ...params, page: Math.max(1, page - 1) })}
                      className={`px-4 py-2 rounded-xl border border-black/8 text-sm transition-colors ${page === 1 ? "opacity-40 pointer-events-none" : "hover:bg-white"}`}>
                      Previous
                    </Link>
                    {Array.from({ length: Math.min(totalPages, 8) }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Link key={i} href={buildHref({ ...params, page: pageNum })}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${pageNum === page ? "bg-ocean text-white" : "border border-black/8 hover:bg-white"}`}>
                          {pageNum}
                        </Link>
                      );
                    })}
                    {totalPages > 8 && <span className="text-ocean/30">...</span>}
                    <Link href={buildHref({ ...params, page: Math.min(totalPages, page + 1) })}
                      className={`px-4 py-2 rounded-xl border border-black/8 text-sm transition-colors ${page === totalPages ? "opacity-40 pointer-events-none" : "hover:bg-white"}`}>
                      Next
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
