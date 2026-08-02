import Link from "next/link";
import { Search as SearchIcon, PackageOpen } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import Footer from "@/components/ui/Footer";
import { ProductCard } from "@/components/products/ProductCard";
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
                className="rounded-btn bg-ocean-deeper h-11 px-6 text-sm font-bold text-white shadow-btn transition-all duration-250 hover:bg-ocean-dark active:scale-[0.98] shrink-0"
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
              <SearchIcon className="mb-3 h-10 w-10 text-ocean/30" />
              <h2 className="font-clash text-xl font-bold text-ocean-deeper">Search our tech catalog</h2>
              <p className="mt-2 text-xs sm:text-sm text-ocean/60 leading-relaxed">
                Enter any brand, device model, or accessory category above to search our Kigali inventory.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center max-w-lg mx-auto rounded-card border border-ocean/10 bg-white/80 p-6 sm:p-10 shadow-sm">
              <PackageOpen className="mb-3 h-10 w-10 text-ocean/40" />
              <h2 className="font-clash text-xl font-bold text-ocean-deeper">No matching products found</h2>
              <p className="mt-2 text-xs sm:text-sm text-ocean/60 leading-relaxed">
                We couldn&apos;t find any tech items matching &ldquo;<span className="font-semibold text-ocean-deeper">{q}</span>&rdquo;. Matches are case-insensitive. Try checking spelling or searching by broader keywords.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2.5">
                <Link href="/products" className="rounded-btn bg-ocean-deeper h-11 px-5 text-xs font-bold text-white hover:bg-ocean-dark transition-colors shadow-sm">
                  Browse All Products
                </Link>
                <Link href="/brands" className="rounded-btn border border-ocean/20 bg-white px-5 h-11 text-xs font-bold text-ocean-deeper hover:bg-ocean/5 transition-colors">
                  Shop By Brand
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {results.map((p) => (
                <ProductCard key={p.id} product={{
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
