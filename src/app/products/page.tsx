import Link from "next/link";
import { ChevronRight, Search, X } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import ProductsGrid from "@/components/ui/products-grid";
import { SortSelect } from "@/components/ui/SortSelect";
import { ProductFilters, MobileFilters } from "@/components/ui/product-filters";
import { getPublicProducts } from "@/data/public-products";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

function buildHref(params: Record<string, string | number | undefined>) {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v) !== "") u.set(k, String(v));
  });
  const s = u.toString();
  return s ? `/products?${s}` : "/products";
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const q = (await searchParams).q || "";
  return {
    title: q ? `Search "${q}" — Galaxy Hub Rwanda` : "Products — Galaxy Hub Rwanda",
    description: "Browse genuine smartphones, laptops, accessories, and audio products available in Kigali with delivery across Rwanda.",
  };
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const sp = await searchParams;
  const params: Record<string, string> = {};
  for (const [k, v] of Object.entries(sp || {})) {
    if (v !== undefined && v !== null) params[k] = v;
  }
  const q = params.q || "";
  const category_slug = params.category || "";
  const brand_slug = params.brand || "";
  const sort = params.sort || "newest";
  const stock_status = params.stock || "";
  const featured = params.featured || "";
  const page = parseInt(params.page || "1", 10) || 1;

  const result = await getPublicProducts({
    search: q, category_slug, brand_slug, sort,
    stock_status: stock_status || undefined,
    is_featured: featured === "true" ? true : undefined,
    page, pageSize: 16,
  });

  const totalPages = Math.max(1, Math.ceil(result.total / 16));
  const start = (page - 1) * 16;
  const pageSize = 16;

  const activeCount =
    (q ? 1 : 0) +
    (category_slug ? 1 : 0) +
    (brand_slug ? 1 : 0) +
    (stock_status ? 1 : 0) +
    (featured ? 1 : 0);

  const filterGroups = [
    {
      id: "categories",
      title: "Categories",
      options: [
        {
          label: "All Categories",
          href: buildHref({ ...params, category: "", page: 1 }),
          active: !category_slug,
          count: result.categories.reduce((acc, c) => acc + (result.categoryCounts[c.id] || 0), 0),
        },
        ...result.categories.map((c) => ({
          label: c.name,
          href: buildHref({ ...params, category: c.slug, page: 1 }),
          active: category_slug === c.slug,
          count: result.categoryCounts[c.id] || 0,
        })),
      ],
    },
    {
      id: "brands",
      title: "Brands",
      options: [
        {
          label: "All Brands",
          href: buildHref({ ...params, brand: "", page: 1 }),
          active: !brand_slug,
          count: result.brands.reduce((acc, b) => acc + (result.brandCounts[b.id] || 0), 0),
        },
        ...result.brands.map((b) => ({
          label: b.name,
          href: buildHref({ ...params, brand: b.slug, page: 1 }),
          active: brand_slug === b.slug,
          count: result.brandCounts[b.id] || 0,
        })),
      ],
    },
    {
      id: "availability",
      title: "Availability",
      options: [
        { label: "All", href: buildHref({ ...params, stock: "", page: 1 }), active: !stock_status },
        { label: "In Stock", href: buildHref({ ...params, stock: "available", page: 1 }), active: stock_status === "available" },
        { label: "Coming Soon", href: buildHref({ ...params, stock: "coming_soon", page: 1 }), active: stock_status === "coming_soon" },
      ],
    },
    {
      id: "featured",
      title: "Featured",
      options: [
        { label: "All Products", href: buildHref({ ...params, featured: "", page: 1 }), active: !featured },
        { label: "Featured Only", href: buildHref({ ...params, featured: "true", page: 1 }), active: featured === "true" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />
      <main className="pt-24 pb-24">
        <div className="mx-auto max-w-[1320px] px-6 md:px-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-medium text-ocean/50 font-manrope">
            <Link href="/" className="hover:text-ocean transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-ocean-deeper">{q ? "Search Results" : "Products"}</span>
          </nav>

          {/* Header */}
          <section className="mt-8 mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="section-label">{q ? `SEARCHING: "${q}"` : "PRODUCTS"}</span>
              <h1 className="font-display text-[clamp(1.9rem,4vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.02em] text-ocean-deeper mt-4">
                {q ? `Results for "${q}"` : "Find Your Next Device"}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-ocean-deeper/60 font-manrope max-w-xl">
                Browse genuine smartphones, laptops, accessories, creator gear, audio products, and more—available in Kigali with delivery across Rwanda.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-ocean/10 bg-white px-4 py-2 text-xs font-bold text-ocean-deeper">
                {result.total.toLocaleString()} Products
              </span>
              {activeCount > 0 && (
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 rounded-full border border-ocean/10 bg-white px-4 py-2 text-xs font-bold text-ocean hover:border-ocean/30 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear all
                </Link>
              )}
            </div>
          </section>

          {/* Sticky toolbar: search + sort + mobile filters */}
          <nav className="sticky top-20 z-40 bg-ivory/80 py-3 backdrop-blur-xl border-b border-ocean/[0.06]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <form method="get" action="/products" className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean/25" />
                  <input
                    name="q"
                    defaultValue={q}
                    placeholder="Search products, brands, categories..."
                    className="w-full rounded-btn border border-ocean/[0.08] bg-white pl-11 pr-10 py-3 text-sm text-ocean-deeper placeholder:text-ocean/25 focus:border-ocean/30 focus:outline-none focus:ring-2 focus:ring-ocean/[0.06] font-manrope"
                  />
                  {q && (
                    <Link
                      href={buildHref({ ...params, q: "", page: 1 })}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-ocean/[0.06] text-ocean/50 hover:bg-ocean/[0.1] hover:text-ocean transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </form>
              <div className="flex items-center gap-3">
                <div className="flex-1 lg:flex-none">
                  <SortSelect currentSort={sort} params={params} />
                </div>
                <div className="lg:hidden">
                  <MobileFilters groups={filterGroups} activeCount={activeCount} />
                </div>
              </div>
            </div>
          </nav>

          <div className="mt-8">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Desktop sidebar */}
              <aside className="hidden lg:block lg:w-[280px] shrink-0">
                <div className="rounded-card border border-ocean/[0.06] bg-white p-6 shadow-sm">
                  <ProductFilters groups={filterGroups} activeCount={activeCount} />
                </div>
              </aside>

              <div className="flex-1 min-w-0">
                {/* Results header */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="text-sm text-ocean/60 font-manrope">
                    Showing{" "}
                    <span className="font-bold text-ocean-deeper">{result.total > 0 ? start + 1 : 0}</span>
                    {" — "}
                    <span className="font-bold text-ocean-deeper">{Math.min(start + pageSize, result.total)}</span>
                    {" of "}
                    <span className="font-bold text-ocean-deeper">{result.total}</span>
                  </div>
                  <div className="hidden sm:block text-sm text-ocean/50 font-manrope">
                    Page {page} of {totalPages}
                  </div>
                </div>

                {/* Active search chip */}
                {q && (
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-ocean px-3.5 py-1.5 text-[11px] font-bold text-white shadow-btn">
                      &ldquo;{q}&rdquo;
                      <Link href={buildHref({ ...params, q: "", page: 1 })} aria-label="Remove search" className="text-white/70 hover:text-white transition-colors">
                        <X className="h-3 w-3" />
                      </Link>
                    </span>
                  </div>
                )}

                {result.products.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-ocean/[0.12] bg-white/60 py-24 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-card bg-ocean/[0.04]">
                      <Search className="h-7 w-7 text-ocean/20" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-ocean-deeper mt-5">No products found</h3>
                    <p className="mt-2 text-sm text-ocean/50 font-manrope">Try adjusting your search or filters.</p>
                    <Link
                      href="/products"
                      className="mt-6 inline-flex items-center justify-center rounded-btn bg-ocean-deeper px-6 h-10 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-btn transition-all duration-300 hover:bg-ocean-dark hover:shadow-btn-hover"
                    >
                      Clear all filters
                    </Link>
                  </div>
                ) : (
                  <ProductsGrid
                    products={result.products.map((p) => ({
                      id: p.id, slug: p.slug, title: p.name,
                      tagline: p.short_description || "", description: p.description || "",
                      price: p.price, originalPrice: p.old_price || undefined, currency: "RWF",
                      category: p.category_name || "", brand: p.brand_name || "",
                      image: p.main_image_url || "", featured: p.is_featured,
                      specifications: {},
                      availability: p.stock_status === "available" ? "In Stock" : p.stock_status === "coming_soon" ? "Limited Stock" : "Out of Stock",
                      badge: p.is_new ? "NEW" : p.discount_percentage ? "SALE" : undefined,
                      rating: p.rating ?? 4.8, reviewCount: p.review_count ?? 32,
                    }))}
                  />
                )}

                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <Link href={buildHref({ ...params, page: Math.max(1, page - 1) })}
                      className={cn("rounded-btn border px-4 py-2.5 text-sm font-medium transition-all duration-200",
                        page === 1 ? "pointer-events-none opacity-40" : "border-ocean/[0.08] bg-white text-ocean hover:border-ocean/30")}>
                      Previous
                    </Link>
                    {Array.from({ length: Math.min(totalPages, 8) }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Link key={i} href={buildHref({ ...params, page: pageNum })}
                          className={cn("rounded-btn px-4 py-2.5 text-sm font-bold transition-all duration-200",
                            pageNum === page
                              ? "bg-ocean text-white shadow-btn"
                              : "border border-ocean/[0.08] bg-white text-ocean-deeper/70 hover:border-ocean/30 hover:text-ocean")}>
                          {pageNum}
                        </Link>
                      );
                    })}
                    {totalPages > 8 && <span className="text-ocean/25">...</span>}
                    <Link href={buildHref({ ...params, page: Math.min(totalPages, page + 1) })}
                      className={cn("rounded-btn border px-4 py-2.5 text-sm font-medium transition-all duration-200",
                        page === totalPages ? "pointer-events-none opacity-40" : "border-ocean/[0.08] bg-white text-ocean hover:border-ocean/30")}>
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
