import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Star, ShoppingBag, Shield, CheckCircle, Truck, RefreshCw } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { PRODUCTS } from "@/data/mock-data";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import ProductDetails from "@/components/ui/product-details";
import { Metadata } from "next";

// Define generateStaticParams
export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `Buy ${product.title} in Rwanda | Galaxy Hub`,
    description: product.description,
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = PRODUCTS.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  // Get related products (same category, excluding this one)
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  // Use the same image for gallery mockup
  const gallery = [product.image, product.image, product.image];

  // JSON-LD structured data
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: gallery,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand },
    sku: product.id,
    offers: {
      "@type": "Offer",
      url: `https://example.com/product/${product.slug}`,
      priceCurrency: product.currency || "RWF",
      price: product.price || 0,
      availability: product.availability === "In Stock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] selection:bg-ocean/20 selection:text-ocean pb-24">
      <Navbar />
      
      <main className="pt-24 md:pt-32">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
        {/* Breadcrumb */}
        <div className="mx-auto max-w-[1320px] px-6 md:px-12 mb-8">
          <div className="flex items-center gap-2 text-xs font-medium text-ocean/50 font-manrope">
            <Link href="/" className="hover:text-ocean transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-ocean transition-colors">Products</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/products/${product.category.toLowerCase()}`} className="hover:text-ocean transition-colors capitalize">{product.category}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#10233D]">{product.title}</span>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mx-auto max-w-[1320px] px-6 md:px-12 mb-20">
          <ProductDetails product={product} />
        </div>

        {/* Specifications & Description */}
        <div className="mx-auto max-w-[1320px] px-6 md:px-12 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <h2 className="font-clash text-2xl font-bold text-[#10233D] mb-6">Product Overview</h2>
              <p className="text-ocean/70 leading-relaxed font-manrope mb-12">
                {product.description}
              </p>
              
              <h2 className="font-clash text-2xl font-bold text-[#10233D] mb-6">Technical Specifications</h2>
              <div className="rounded-[24px] bg-white border border-black/5 overflow-hidden">
                {Object.entries(product.specifications).map(([key, val], idx) => (
                  <div key={key} className={`flex flex-col sm:flex-row sm:items-center py-4 px-6 ${idx !== 0 ? 'border-t border-black/5' : ''}`}>
                    <span className="sm:w-1/3 font-bold text-sm text-[#10233D] mb-1 sm:mb-0">{key}</span>
                    <span className="sm:w-2/3 text-sm text-ocean/70 font-manrope">{val}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-4">
              <div className="rounded-[24px] bg-ocean p-8 text-white sticky top-24">
                <h3 className="font-clash text-xl font-bold mb-4">Need Expert Advice?</h3>
                <p className="text-sm text-white/70 font-manrope mb-6">
                  Our tech specialists are available to answer any questions about this product.
                </p>
                <a href="tel:+250785288910" className="flex items-center justify-center gap-2 bg-white text-ocean py-3 rounded-xl text-sm font-bold hover:bg-ivory transition-colors">
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mx-auto max-w-[1320px] px-6 md:px-12">
            <h2 className="font-clash text-2xl font-bold text-[#10233D] mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} onReserve={() => {}} />
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
