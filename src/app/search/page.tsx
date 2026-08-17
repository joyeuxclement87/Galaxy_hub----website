import Link from "next/link";
import { Search as SearchIcon, PackageOpen } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import Footer from "@/components/ui/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { gridStaggerDelay } from "@/lib/motion";
import { searchProducts } from "@/data/public-products";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const q = (await searchParams).q || "";
  return {
    title: q ? `Search "${q}" — Galaxy Hub Rwanda` : "Search — Galaxy Hub Rwanda",
    description: `Search results for "${q}" — Find smartphones, laptops, accessories, and more.`,
  };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const q = (await searchParams).q || "";
  const results = q ? await searchProducts(q) : [];

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />
      <main className="pt-20 pb-24">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 md:px-8">
          <div className="mb-8">
            <h1 className="font-clash text-2xl sm:text-3xl font-bold text-ocean-deeper">Search</h1>
            <p className="mt-2 text-sm text-ocean/50">Find products across our catalog.</p>
          </div>

          <form method="get" action="/search" className="mb-8">
            <div className="relative max-w-xl flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean/35" />
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Search products, brands, categories..."
                  className="w-full rounded-btn border border-ocean/10 bg-white py-3 pr-4 pl-11 text-sm text-ocean-deeper placeholder:text-ocean/35 focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/10 shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="rounded-btn bg-ocean-deeper w-full h-12 px-6 text-base font-bold text-white shadow-btn transition-all duration-250 hover:bg-ocean-dark active:scale-[0.98] shrink-0 sm:w-auto"
              >
                Search
              </button>
            </div>
          </form>

          {q && (
            <p className="mb-5 text-sm text-ocean/60 font-medium">
              Showing {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;<span className="font-bold text-ocean-deeper">{q}</span>&rdquo;
            </p>
          )}

          {!q ? (
            <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto rounded-card border border-ocean/8 bg-white/60 p-6 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ocean/5 mb-4">
                <SearchIcon className="h-6 w-6 text-ocean/20" />
              </div>
              <h2 className="font-clash text-xl font-bold text-ocean-deeper">Search our tech catalog</h2>
              <p className="mt-2 text-xs sm:text-sm text-ocean/60 leading-relaxed">
                Enter any brand, device model, or accessory category above to search our Kigali inventory.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto rounded-card border border-ocean/10 bg-white py-12 px-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ocean/5 mb-4">
                <PackageOpen className="h-7 w-7 text-ocean/20" />
              </div>
              <h2 className="font-clash text-xl font-bold text-ocean-deeper mb-2">No matching products found</h2>
              <p className="text-sm text-ocean/50 mb-6 max-w-sm">
                We couldn&apos;t find any tech items matching &ldquo;<span className="font-semibold text-ocean-deeper">{q}</span>&rdquo;.
              </p>
              <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
                <Link href="/products" className="flex h-12 flex-1 items-center justify-center rounded-btn bg-ocean-deeper px-5 text-base font-bold text-white shadow-btn transition-all duration-250 hover:bg-ocean-dark active:scale-[0.98]">
                  Browse All Products
                </Link>
                <Link href="/" className="flex h-12 flex-1 items-center justify-center rounded-btn border border-ocean/15 bg-white px-5 text-base font-bold text-ocean-deeper transition-all duration-250 hover:border-ocean/30 active:scale-[0.98]">
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {results.map((p, index) => (
                <ProductCard key={p.id} delay={gridStaggerDelay(index)} product={{
                  id: p.id, slug: p.slug, title: p.name,
                  tagline: p.short_description || "", description: "",
                  price: p.price, originalPrice: p.old_price || undefined, currency: "RWF",
                  category: p.category_name || "", brand: p.brand_name || "",
                  image: p.main_image_url || "", featured: false,
                  specifications: {},
                  availability: p.stock_status === "available" ? "In Stock" : "Out of Stock",
                  badge: undefined, rating: p.rating ?? 4.8, reviewCount: p.review_count ?? 32,
                }} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
