import Link from "next/link";
import { ChevronRight, Search, X, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import Footer from "@/components/ui/Footer";
import { SortSelect } from "@/components/ui/SortSelect";
import { ProductFilters, MobileFilters } from "@/components/ui/product-filters";
import { ProductsGridBrowser } from "@/components/products/ProductsGridBrowser";
import { getPublicProducts } from "@/data/public-products";

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
  const isNew = params.new || "";
  const page = parseInt(params.page || "1", 10) || 1;

  const result = await getPublicProducts({
    search: q, category_slug, brand_slug, sort,
    stock_status: stock_status || undefined,
    is_featured: featured === "true" ? true : undefined,
    is_new: isNew === "true" ? true : undefined,
    page, pageSize: 24,
  });

  const activeCount =
    (q ? 1 : 0) +
    (category_slug ? 1 : 0) +
    (brand_slug ? 1 : 0) +
    (stock_status ? 1 : 0) +
    (featured ? 1 : 0) +
    (isNew ? 1 : 0);

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
    {
      id: "new",
      title: "New Arrivals",
      options: [
        { label: "All Products", href: buildHref({ ...params, new: "", page: 1 }), active: !isNew },
        { label: "New Only", href: buildHref({ ...params, new: "true", page: 1 }), active: isNew === "true" },
      ],
    },
  ];

  // Smart pagination pages used for the sticky header only (client grid computes its own)
  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />
      <main className="pt-20 pb-20">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6">

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs font-medium text-ocean/45">
            <Link href="/" className="hover:text-ocean transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-ocean-deeper">{q ? "Search Results" : "Products"}</span>
          </nav>

          {/* Page Header */}
          <section className="mt-5 mb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="block text-caption font-bold uppercase tracking-[0.2em] text-accent">
                  {q ? `SEARCHING: "${q}"` : "PRODUCTS"}
                </span>
                <h1 className="font-display text-2xl sm:text-3xl font-bold leading-tight tracking-[-0.02em] text-ocean-deeper mt-2">
                  {q ? `Results for "${q}"` : "Find Your Next Device"}
                </h1>
                {!q && (
                  <p className="mt-1.5 text-sm leading-relaxed text-ocean-deeper/55 max-w-xl">
                    Genuine smartphones, laptops, accessories & audio — in Kigali, delivered across Rwanda.
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ocean/10 bg-white px-3 py-1 text-caption font-bold text-ocean-deeper">
                  {result.total.toLocaleString()} {result.total === 1 ? "product" : "products"}
                </span>
                {activeCount > 0 && (
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-1.5 rounded-full border border-ocean/10 bg-white px-3 py-1 text-caption font-bold text-ocean hover:border-ocean/30 transition-colors"
                  >
                    <X className="h-3 w-3" />
                    Clear all
                  </Link>
                )}
              </div>
            </div>
          </section>

          {/* Sticky toolbar: search + sort + mobile filters */}
          <nav className="sticky top-[76px] z-40 bg-ivory/90 py-2.5 pb-2.5 backdrop-blur-xl border-b border-ocean/6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {/* Search — preserves all current filters */}
              <form method="get" action="/products" className="flex-1 relative">
                {/* Hidden inputs to preserve existing filter params */}
                {category_slug && <input type="hidden" name="category" value={category_slug} />}
                {brand_slug && <input type="hidden" name="brand" value={brand_slug} />}
                {stock_status && <input type="hidden" name="stock" value={stock_status} />}
                {featured && <input type="hidden" name="featured" value={featured} />}
                {isNew && <input type="hidden" name="new" value={isNew} />}
                {sort && sort !== "newest" && <input type="hidden" name="sort" value={sort} />}

                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean/25 pointer-events-none" />
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Search products, brands, categories…"
                  className="w-full rounded-btn border border-ocean/8 bg-white pl-11 pr-10 py-2.5 text-sm text-ocean-deeper placeholder:text-ocean/25 focus:border-ocean/30 focus:outline-none focus:ring-2 focus:ring-ocean/6"
                />
                {q && (
                  <Link
                    href={buildHref({ ...params, q: "", page: 1 })}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-ocean/6 text-ocean/50 hover:bg-ocean/10 hover:text-ocean transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Link>
                )}
              </form>

              <div className="flex items-center gap-2.5">
                <div className="flex-1 sm:flex-none">
                  <SortSelect currentSort={sort} params={params} />
                </div>
                <div className="lg:hidden">
                  <MobileFilters groups={filterGroups} activeCount={activeCount} currentQ={q} />
                </div>
              </div>
            </div>

            {/* Mobile active filter chips */}
            {activeCount > 0 && (
              <div className="mt-2.5 flex flex-wrap items-center gap-2 lg:hidden">
                 {category_slug && (
                  <Link href={buildHref({ ...params, category: "", page: 1 })} className="inline-flex items-center gap-1 rounded-full bg-ocean px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] text-white">
                    {result.categories.find(c => c.slug === category_slug)?.name ?? category_slug}
                    <X className="h-2.5 w-2.5" />
                  </Link>
                )}
                {brand_slug && (
                  <Link href={buildHref({ ...params, brand: "", page: 1 })} className="inline-flex items-center gap-1 rounded-full bg-ocean px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] text-white">
                    {result.brands.find(b => b.slug === brand_slug)?.name ?? brand_slug}
                    <X className="h-2.5 w-2.5" />
                  </Link>
                )}
                {stock_status && (
                  <Link href={buildHref({ ...params, stock: "", page: 1 })} className="inline-flex items-center gap-1 rounded-full bg-ocean px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] text-white">
                    {stock_status === "available" ? "In Stock" : "Coming Soon"}
                    <X className="h-2.5 w-2.5" />
                  </Link>
                )}
                {featured && (
                  <Link href={buildHref({ ...params, featured: "", page: 1 })} className="inline-flex items-center gap-1 rounded-full bg-ocean px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] text-white">
                    Featured
                    <X className="h-2.5 w-2.5" />
                  </Link>
                )}
                {isNew && (
                  <Link href={buildHref({ ...params, new: "", page: 1 })} className="inline-flex items-center gap-1 rounded-full bg-ocean px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] text-white">
                    New Arrivals
                    <X className="h-2.5 w-2.5" />
                  </Link>
                )}
              </div>
            )}
          </nav>

          <div className="mt-8">
            <div className="flex flex-col lg:flex-row gap-10">

              {/* Desktop sidebar */}
              <aside className="hidden lg:block lg:w-64 shrink-0">
                <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain rounded-card border border-ocean/6 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <span className="flex items-center gap-2 font-display text-sm font-bold text-ocean-deeper">
                      <SlidersHorizontal className="h-4 w-4 text-ocean/50" />
                      Filters
                    </span>
                    {activeCount > 0 && (
                      <span className="rounded-full bg-ocean px-2 py-0.5 text-xs font-bold text-white">
                        {activeCount}
                      </span>
                    )}
                  </div>
                  <ProductFilters groups={filterGroups} activeCount={activeCount} />
                </div>
              </aside>

              <div className="flex-1 min-w-0">
                {/* Active search chip */}
                {q && (
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-ocean px-3.5 py-1.5 text-xs font-bold text-white shadow-btn">
                      &ldquo;{q}&rdquo;
                      <Link href={buildHref({ ...params, q: "", page: 1 })} aria-label="Remove search" className="text-white/70 hover:text-white transition-colors">
                        <X className="h-3 w-3" />
                      </Link>
                    </span>
                  </div>
                )}

                {/* Responsive grid + pagination (12/18/24 per page by viewport) */}
                <ProductsGridBrowser
                  key={JSON.stringify(params)}
                  initialProducts={result.products}
                  initialTotal={result.total}
                  params={params}
                  page={page}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
