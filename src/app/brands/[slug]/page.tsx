import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BadgeCheck, PackageCheck, Sparkles } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import Footer from "@/components/ui/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { gridStaggerDelay } from "@/lib/motion";
import { getPublicBrandBySlug } from "@/data/public-products";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublicBrandBySlug(slug);
  if (!result) return { title: "Brand Not Found" };
  return {
    title: `${result.brand.name} | Galaxy Hub Rwanda`,
    description: result.brand.description || `Shop ${result.brand.name} products at Galaxy Hub Rwanda.`,
  };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getPublicBrandBySlug(slug);
  if (!result) notFound();

  const { brand, products, allBrands } = result;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffdf9_0%,#f5f9fe_100%)] text-[#10233D]">
      <Navbar />
      <main className="pt-24">
        <section className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-16 md:px-12 lg:flex-row lg:items-end lg:justify-between lg:py-24">
          <div className="max-w-2xl space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#0b5497]/10 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#0b5497]">
              <BadgeCheck className="h-3.5 w-3.5" /> Trusted Brand
            </span>
            <div className="space-y-3">
              <h1 className="font-clash text-3xl font-semibold leading-tight sm:text-4xl">{brand.name}</h1>
              {brand.description && <p className="text-lg text-[#10233D]/70">{brand.description}</p>}
            </div>
            {brand.description && <p className="text-sm leading-7 text-[#10233D]/65">{brand.description}</p>}
          </div>

          <div className="rounded-[28px] border border-[#0b5497]/10 bg-white/90 p-6 shadow-[0_16px_60px_rgba(11,84,151,0.08)] md:min-w-[320px]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0b5497]/70">Available now</span>
              <Sparkles className="h-4 w-4 text-[#0b5497]" />
            </div>
            <div className="mt-4 space-y-3">
              {products.slice(0, 6).map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`}
                  className="flex items-center justify-between rounded-2xl border border-[#0b5497]/8 bg-[#f8fbff] px-4 py-3 text-sm text-[#10233D]/75 hover:bg-[#f0f6ff] transition-colors">
                  <span>{p.name}</span>
                  <PackageCheck className="h-4 w-4 text-[#0b5497]" />
                </Link>
              ))}
              {products.length === 0 && <p className="text-sm text-ocean/50 py-4 text-center">No products yet</p>}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20 md:px-12">
          <h2 className="font-clash text-2xl font-semibold mb-8">All {brand.name} Products</h2>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-lg font-semibold text-[#10233D]">No products available yet</p>
              <p className="mt-2 text-sm text-ocean/60">Check back for new arrivals from {brand.name}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((p, index) => (
                <ProductCard key={p.id} delay={gridStaggerDelay(index)} product={{
                  id: p.id,
                  slug: p.slug,
                  title: p.name,
                  tagline: p.short_description || "",
                  description: "",
                  price: p.price,
                  originalPrice: p.old_price || undefined,
                  currency: "RWF",
                  category: p.category_name || "",
                  brand: brand.name,
                  image: p.main_image_url || "",
                  featured: p.is_featured,
                  specifications: {},
                  availability: p.stock_status === "available" ? "In Stock" : "Out of Stock",
                  badge: p.is_new ? "NEW" : p.discount_percentage ? "ON DISCOUNT" : undefined,
                  rating: p.rating ?? 4.8,
                  reviewCount: p.review_count ?? 32,
                }} />
              ))}
            </div>
          )}

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {allBrands.filter((b) => b.slug !== brand.slug).slice(0, 4).map((b) => (
              <Link key={b.id} href={`/brands/${b.slug}`}
                className="rounded-2xl border border-[#0b5497]/10 bg-white p-5 hover:border-[#0b5497]/30 transition-all hover:-translate-y-1">
                <h3 className="font-clash text-lg font-semibold text-[#10233D]">{b.name}</h3>
                <span className="mt-2 inline-flex items-center gap-1 text-sm text-[#0b5497]">
                  Explore <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
