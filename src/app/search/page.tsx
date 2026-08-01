import Link from "next/link";
import { Search as SearchIcon, PackageOpen } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
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
      <main className="pt-24 pb-24">
        <div className="mx-auto max-w-[1320px] px-6 md:px-12">
          <div className="mb-8">
            <h1 className="font-clash text-3xl font-bold text-ocean-deeper">Search</h1>
            <p className="mt-2 text-sm text-ocean/50">Find products across our catalog.</p>
          </div>

          <form method="get" action="/search" className="mb-10">
            <div className="relative max-w-xl">
              <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ocean/25" />
              <input
                name="q"
                defaultValue={q}
                placeholder="Search products, brands, categories..."
                className="w-full rounded-2xl border border-ocean/8 bg-white py-4 pl-12 pr-4 text-sm text-ocean-deeper placeholder:text-ocean/25 focus:border-ocean/30 focus:outline-none focus:ring-2 focus:ring-ocean/8"
              />
            </div>
          </form>

          {q && (
            <p className="mb-6 text-sm text-ocean/50">
              {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{q}&rdquo;
            </p>
          )}

          {!q ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <SearchIcon className="mb-4 h-16 w-16 text-ocean/8" />
              <h2 className="font-clash text-xl font-bold text-ocean-deeper">Search our catalog</h2>
              <p className="mt-2 text-sm text-ocean/50">Enter a product name, brand, or category above.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <PackageOpen className="mb-4 h-16 w-16 text-ocean/8" />
              <h2 className="font-clash text-xl font-bold text-ocean-deeper">No results found</h2>
              <p className="mt-2 text-sm text-ocean/50">Try a different search term or browse our categories.</p>
              <div className="mt-6 flex gap-3">
                <Link href="/products" className="text-sm font-semibold text-ocean hover:text-ocean-dark transition-colors">Browse Products</Link>
                <Link href="/brands" className="text-sm font-semibold text-ocean hover:text-ocean-dark transition-colors">Shop by Brand</Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
    </div>
  );
}
