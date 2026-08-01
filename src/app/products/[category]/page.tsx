import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Phone } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { CategoryProductGrid } from "@/components/ui/category-product-grid";
import { getPublicProductsByCategorySlug } from "@/data/public-products";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const result = await getPublicProductsByCategorySlug(category);
  if (!result) return { title: "Category Not Found" };
  return {
    title: `${result.category.name} | Galaxy Hub Rwanda`,
    description: result.category.description || `Shop ${result.category.name} at Galaxy Hub Rwanda.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const result = await getPublicProductsByCategorySlug(categorySlug);
  if (!result) notFound();

  const { category, products } = result;

  return (
    <div className="min-h-screen bg-[#F8F9FA] selection:bg-ocean/20 selection:text-ocean">
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="mx-auto max-w-[1320px] px-6 md:px-12 mb-8">
          <div className="flex items-center gap-2 text-xs font-medium text-ocean/50">
            <Link href="/" className="hover:text-ocean transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-ocean transition-colors">Products</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#10233D]">{category.name}</span>
          </div>
        </div>

        <div className="mx-auto max-w-[1320px] px-6 md:px-12 mb-12 md:mb-16">
          <div className="relative overflow-hidden rounded-[32px] bg-[#10233D] p-8 md:p-16 flex items-center min-h-[300px]">
            <div className="absolute inset-0 z-0">
              {category.image_url && (
                <img src={category.image_url} alt={category.name} className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-[#10233D] via-[#10233D]/80 to-transparent" />
            </div>
            <div className="relative z-10 max-w-2xl space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-white backdrop-blur-md">
                {products.length}+ Products
              </span>
              <h1 className="font-clash text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">{category.name}</h1>
              {category.description && (
                <p className="text-sm md:text-base leading-relaxed text-white/80 font-manrope max-w-xl">{category.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1320px] px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-10">
            <aside className="w-full lg:w-[280px] shrink-0 space-y-8">
              <div className="rounded-2xl bg-ocean-light/20 p-6 border border-ocean/10">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-ocean shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-[#10233D]">Need Help Choosing?</h4>
                    <p className="text-xs text-ocean/70 font-manrope">Call our tech experts in Kigali for personalized recommendations.</p>
                    <a href="tel:+250785288910" className="inline-flex items-center gap-1.5 text-xs font-bold text-ocean hover:text-ocean-dark transition-colors mt-2">
                      <Phone className="h-3 w-3" />
                      +250 785 288 910
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1 space-y-8">
              <div className="flex items-center justify-between">
                <p className="text-sm text-ocean/60 font-manrope">Showing <span className="font-bold text-[#10233D]">{products.length}</span> results</p>
              </div>

              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <p className="font-clash text-lg font-bold text-[#10233D]">No products in this category yet</p>
                  <p className="mt-2 text-sm text-ocean/60">Check back soon for new arrivals.</p>
                  <Link href="/products" className="mt-6 text-sm font-semibold text-ocean hover:text-ocean-dark transition-colors">Browse all products</Link>
                </div>
              ) : (
                <CategoryProductGrid products={products.map((p) => ({
                  id: p.id,
                  slug: p.slug,
                  title: p.name,
                  tagline: "",
                  description: "",
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
                  rating: p.rating ?? 4.8,
                  reviewCount: p.review_count ?? 32,
                }))} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
