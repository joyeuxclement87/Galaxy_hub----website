import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Truck, ShieldCheck, RefreshCw, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import Footer from "@/components/ui/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductActions } from "@/components/products/ProductActions";
import { OrderCTA } from "@/components/products/OrderCTA";
import { KeySpecifications, SpecificationsAccordion, ProductHighlightsList } from "@/components/products/ProductSpecifications";
import { getKeySpecs } from "@/lib/product-specs";
import { getPublicProductBySlug } from "@/data/public-products";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const SITE_URL = "https://galaxyhub.rw";

interface ProductPageParams {
  params: Promise<{ slug: string }>;
}

function displayTitle(product: { name: string; brand_name: string | null }): string {
  const brand = product.brand_name?.trim();
  if (brand && !product.name.toLowerCase().startsWith(brand.toLowerCase())) {
    return `${brand} ${product.name} | Galaxy Hub`;
  }
  return `${product.name} | Galaxy Hub`;
}

export async function generateMetadata({ params }: ProductPageParams): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublicProductBySlug(slug);
  if (!result) return { title: "Product Not Found" };
  const { product } = result;

  const description = product.short_description || product.description || "";
  const image = product.main_image_url
    ? [{ url: product.main_image_url, alt: product.name }]
    : [];

  return {
    title: { absolute: displayTitle(product) },
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: displayTitle(product),
      description,
      url: `${SITE_URL}/product/${product.slug}`,
      type: "website",
      images: image,
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle(product),
      description,
      images: image,
    },
  };
}

const formatPrice = (v: number) => new Intl.NumberFormat("en-US").format(v);

const stockLabel: Record<string, { label: string; chip: string; dot: string }> = {
  available:    { label: "In Stock",     chip: "bg-emerald-50 text-emerald-700 border border-emerald-100", dot: "bg-emerald-500" },
  coming_soon:  { label: "Coming Soon",  chip: "bg-amber-50 text-amber-700 border border-amber-100",       dot: "bg-amber-400" },
  out_of_stock: { label: "Out of Stock", chip: "bg-red-50 text-red-600 border border-red-100",             dot: "bg-red-400" },
};

export default async function ProductPage({ params }: ProductPageParams) {
  const { slug } = await params;
  const result = await getPublicProductBySlug(slug);
  if (!result) notFound();

  const { product, relatedProducts } = result;
  const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : 0;
  const gallery = [product.main_image_url, ...(product.images || []).map((img) => img.image_url)].filter(
    (src): src is string => Boolean(src)
  );
  const stock = stockLabel[product.stock_status] ?? stockLabel.out_of_stock;
  const keySpecs = getKeySpecs(product.specifications, product.category_slug);

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: gallery,
    description: product.short_description || product.description,
    brand: { "@type": "Brand", name: product.brand_name },
    url: `${SITE_URL}/product/${product.slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "RWF",
      price: product.price,
      availability: product.stock_status === "available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/product/${product.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-ivory pb-40 lg:pb-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <Navbar />

       {/* Mobile sticky bottom purchase bar removed — action buttons now show inline */}

       <main className="pt-24">

        {/* 1. Breadcrumb */}
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 md:px-12">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium text-ocean/40 overflow-x-auto no-scrollbar py-1">
            <Link href="/products" className="transition-colors hover:text-ocean shrink-0">Products</Link>
            {product.category_slug && (
              <>
                <ChevronRight className="h-3 w-3 shrink-0 text-ocean/25" aria-hidden="true" />
                <Link href={`/products?category=${product.category_slug}`} className="capitalize transition-colors hover:text-ocean shrink-0">
                  {product.category_name}
                </Link>
              </>
            )}
            {product.brand_slug && (
              <>
                <ChevronRight className="h-3 w-3 shrink-0 text-ocean/25" aria-hidden="true" />
                <Link href={`/products?brand=${product.brand_slug}`} className="transition-colors hover:text-ocean shrink-0">
                  {product.brand_name}
                </Link>
              </>
            )}
            <ChevronRight className="h-3 w-3 shrink-0 text-ocean/25" aria-hidden="true" />
            <span className="text-ocean-deeper font-semibold truncate max-w-[160px] sm:max-w-xs">{product.name}</span>
          </nav>
        </div>

        {/* 2. Product Header: Gallery + Info */}
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 md:px-12 mt-5 lg:mt-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">

            {/* Gallery */}
            <ProductGallery images={gallery} name={product.name} />

            {/* Info panel */}
            <div className="flex flex-col">

              {/* Brand */}
              {product.brand_slug && product.brand_name ? (
                <Link
                  href={`/products?brand=${product.brand_slug}`}
                  className="text-[10px] font-bold uppercase tracking-[0.24em] text-accent transition-colors hover:text-ocean"
                >
                  {product.brand_name}
                </Link>
              ) : product.brand_name && (
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-accent">{product.brand_name}</span>
              )}

              {/* Product name */}
              <h1 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.1] tracking-tight text-ocean-deeper">
                {product.name}
              </h1>

              {/* Short description */}
              {product.short_description && (
                <p className="mt-3 text-sm leading-relaxed text-ocean/55 max-w-lg">
                  {product.short_description}
                </p>
              )}

              {/* Price block */}
              <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-3xl font-bold text-ocean-deeper">
                  RWF {formatPrice(product.price)}
                </span>
                {product.old_price && discount > 0 && (
                  <>
                    <span className="text-base text-ocean/30 line-through">
                      RWF {formatPrice(product.old_price)}
                    </span>
                    <span className="rounded-full border border-red-100 bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-600">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock status */}
              <div className="mt-3">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${stock.chip}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${stock.dot}`} aria-hidden="true" />
                  {stock.label}
                </span>
              </div>

               {/* Storage + action buttons — visible on all screens */}
               <div className="mt-5">
                 <ProductActions
                   productId={product.id}
                   productSlug={product.slug}
                   storageOptions={product.storage_options}
                 />
               </div>

              {/* Trust badges — redesigned grid layout (3 columns, no horizontal scroll) */}
              <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { icon: Truck,       text: "Delivery",    sub: "All Rwanda" },
                  { icon: ShieldCheck, text: "Genuine",     sub: "100% Authentic" },
                  { icon: RefreshCw,   text: "Warranty",    sub: "Manufacturer" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex flex-col items-center text-center p-2.5 sm:p-3 rounded-xl border border-ocean/[0.06] bg-white shadow-[0_2px_8px_rgba(11,84,151,0.02)]"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ocean/[0.06] text-ocean mb-2">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-bold text-ocean-deeper leading-tight block">
                      {item.text}
                    </span>
                    <span className="text-[9px] text-ocean/40 mt-0.5 block truncate max-w-full">
                      {item.sub}
                    </span>
                  </div>
                ))}
              </div>

              {/* Full description */}
              {product.description && product.description !== product.short_description && (
                <div className="mt-6 border-t border-ocean/[0.06] pt-5">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-ocean-deeper/40">About this product</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ocean/55">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Key Specifications */}
        {keySpecs.length > 0 && (
          <section aria-labelledby="key-specs-heading" className="mx-auto max-w-[1320px] px-4 sm:px-6 md:px-12 mt-14 md:mt-16">
            <h2 id="key-specs-heading" className="mb-4 font-display text-xl font-bold text-ocean-deeper">
              Key Specifications
            </h2>
            <KeySpecifications specifications={product.specifications} categorySlug={product.category_slug} />
          </section>
        )}

        {/* 4. Product Highlights */}
        {product.highlights.length > 0 && (
          <section aria-labelledby="highlights-heading" className="mx-auto max-w-[1320px] px-4 sm:px-6 md:px-12 mt-14 md:mt-16">
            <h2 id="highlights-heading" className="mb-4 font-display text-xl font-bold text-ocean-deeper">
              Why you&apos;ll like it
            </h2>
            <ProductHighlightsList highlights={product.highlights} />
          </section>
        )}

        {/* 5. Full Specifications */}
        {product.specifications.length > 0 && (
          <section aria-labelledby="full-specs-heading" className="mx-auto max-w-[1320px] px-4 sm:px-6 md:px-12 mt-14 md:mt-16">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
              <h2 id="full-specs-heading" className="font-display text-xl font-bold text-ocean-deeper">
                Full Specifications
              </h2>
              <span className="text-xs font-medium text-ocean/35">
                Everything you need to know before you order
              </span>
            </div>
            <SpecificationsAccordion specifications={product.specifications} />
          </section>
        )}

        {/* 6. Related Products */}
        {relatedProducts.length > 0 && (
          <section aria-labelledby="related-heading" className="mx-auto max-w-[1320px] px-4 sm:px-6 md:px-12 mt-14 md:mt-16">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
              <h2 id="related-heading" className="font-display text-xl font-bold text-ocean-deeper">
                You may also like
              </h2>
              {product.category_slug && (
                <Link href={`/products?category=${product.category_slug}`} className="text-xs font-bold text-ocean transition-colors hover:text-ocean-dark">
                  View all {product.category_name?.toLowerCase()} →
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={{
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
                    rating: p.rating ?? 4.8,
                    reviewCount: p.review_count ?? 32,
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* 7. Final Order CTA */}
        <div className="mt-16 md:mt-20 mb-12 md:mb-16">
          <OrderCTA productName={product.name} productSlug={product.slug} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
