import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ShoppingCart, Truck, Shield, RefreshCw, Star } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { ProductCard } from "@/components/products/ProductCard";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { getPublicProductBySlug } from "@/data/public-products";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const result = await getPublicProductBySlug(params.slug);
  if (!result) return { title: "Product Not Found" };
  const { product } = result;

  return {
    title: `Buy ${product.name} in Rwanda | Galaxy Hub`,
    description: product.short_description || product.description || "",
    openGraph: {
      title: `${product.name} | Galaxy Hub Rwanda`,
      description: product.short_description || "",
      images: product.main_image_url ? [{ url: product.main_image_url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Galaxy Hub Rwanda`,
      description: product.short_description || "",
    },
  };
}

const formatPrice = (v: number) => new Intl.NumberFormat("en-US").format(v);

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const result = await getPublicProductBySlug(params.slug);
  if (!result) notFound();

  const { product, relatedProducts } = result;
  const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : 0;
  const gallery = [product.main_image_url, ...(product.images || []).map((i: any) => i.image_url)].filter(Boolean);

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: gallery,
    description: product.short_description || product.description,
    brand: { "@type": "Brand", name: product.brand_name },
    offers: {
      "@type": "Offer",
      priceCurrency: "RWF",
      price: product.price,
      availability: product.stock_status === "available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] selection:bg-ocean/20 selection:text-ocean pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <Navbar />

      <main className="pt-24 md:pt-32">
        <div className="mx-auto max-w-[1320px] px-6 md:px-12 mb-8">
          <div className="flex items-center gap-2 text-xs font-medium text-ocean/50">
            <Link href="/" className="hover:text-ocean transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-ocean transition-colors">Products</Link>
            <ChevronRight className="h-3 w-3" />
            {product.category_slug && (
              <>
                <Link href={`/products/${product.category_slug}`} className="hover:text-ocean transition-colors capitalize">{product.category_name}</Link>
                <ChevronRight className="h-3 w-3" />
              </>
            )}
            <span className="text-[#10233D] truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>

        <div className="mx-auto max-w-[1320px] px-6 md:px-12 mb-20">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <div className="aspect-square w-full overflow-hidden rounded-3xl bg-[#F7F8FA] flex items-center justify-center p-8 lg:p-12">
                {gallery[0] ? (
                  <img src={gallery[0]} alt={product.name} className="h-full w-full object-contain" />
                ) : (
                  <div className="text-ocean/20 text-lg">No image</div>
                )}
              </div>
              {gallery.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {gallery.slice(1, 5).map((img, i) => (
                    <div key={i} className="aspect-square overflow-hidden rounded-xl bg-[#F7F8FA] flex items-center justify-center p-3 border border-black/5">
                      <img src={img} alt={`${product.name} ${i + 2}`} className="h-full w-full object-contain" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              {product.brand_name && (
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-ocean/50">{product.brand_name}</span>
              )}
              <h1 className="font-clash text-3xl font-bold text-[#10233D] mt-2 lg:text-4xl">{product.name}</h1>

              <div className="flex items-center gap-1.5 mt-3">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className={`h-3.5 w-3.5 ${i <= 4 ? "fill-current" : "fill-current opacity-30"}`} />)}
                </div>
                <span className="text-xs text-ocean/50">4.8 (32 reviews)</span>
              </div>

              {product.short_description && (
                <p className="mt-4 text-sm leading-relaxed text-ocean/70">{product.short_description}</p>
              )}

              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-clash text-3xl font-bold text-[#10233D]">RWF {formatPrice(product.price)}</span>
                {product.old_price && (
                  <>
                    <span className="text-lg text-ocean/40 line-through">RWF {formatPrice(product.old_price)}</span>
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-500">-{discount}%</span>
                  </>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  product.stock_status === "available" ? "bg-emerald-50 text-emerald-700" :
                  product.stock_status === "coming_soon" ? "bg-amber-50 text-amber-700" :
                  "bg-red-50 text-red-700"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    product.stock_status === "available" ? "bg-emerald-500" :
                    product.stock_status === "coming_soon" ? "bg-amber-500" :
                    "bg-red-500"
                  }`} />
                  {product.stock_status === "available" ? "In Stock" :
                   product.stock_status === "coming_soon" ? "Coming Soon" :
                   "Out of Stock"}
                </span>
              </div>

              {product.description && (
                <div className="mt-8">
                  <h2 className="font-clash text-lg font-bold text-[#10233D] mb-3">Description</h2>
                  <p className="text-sm leading-relaxed text-ocean/70">{product.description}</p>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3">
                <AddToCartButton productId={product.id} />
                <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-xl border border-ocean/20 bg-transparent px-8 py-3.5 text-base font-medium text-ocean transition-all duration-300 hover:bg-ocean hover:text-ivory">
                  <ShoppingCart className="h-4 w-4" /> Continue Shopping
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { icon: Truck, text: "Delivery across Rwanda" },
                  { icon: Shield, text: "Genuine products guaranteed" },
                  { icon: RefreshCw, text: "Warranty included" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 rounded-xl bg-white/80 border border-black/5 px-4 py-3">
                    <item.icon className="h-4 w-4 shrink-0 text-ocean" />
                    <span className="text-xs text-ocean/70">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mx-auto max-w-[1320px] px-6 md:px-12">
            <h2 className="font-clash text-2xl font-bold text-[#10233D] mb-8">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p: any) => (
                <ProductCard key={p.id} product={{
                  id: p.id,
                  slug: p.slug,
                  title: p.name,
                  tagline: p.short_description || "",
                  description: "",
                  price: p.price,
                  originalPrice: p.old_price || undefined,
                  currency: "RWF",
                  category: p.category_name || "",
                  brand: p.brand_name || "",
                  image: p.main_image_url || "",
                  featured: false,
                  specifications: {},
                  availability: p.stock_status === "available" ? "In Stock" : "Out of Stock",
                  badge: p.discount_percentage ? "SALE" : undefined,
                  rating: 4.8,
                  reviewCount: 32,
                }} onReserve={() => {}} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


