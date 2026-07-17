import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Star, ShoppingBag, Shield, CheckCircle, Truck, RefreshCw } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { PRODUCTS } from "@/data/mock-data";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="min-h-screen bg-[#F8F9FA] selection:bg-ocean/20 selection:text-ocean pb-24">
      <Navbar />
      
      <main className="pt-24 md:pt-32">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            
            {/* Left: Gallery */}
            <div className="space-y-6">
              <div className="aspect-[4/5] rounded-[32px] bg-white border border-black/5 flex items-center justify-center p-12 overflow-hidden relative">
                {product.badge && (
                  <span className="absolute left-6 top-6 z-10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm bg-ocean text-white">
                    {product.badge}
                  </span>
                )}
                <img src={gallery[0]} alt={product.title} className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {gallery.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-[20px] bg-white border border-black/5 flex items-center justify-center p-4 cursor-pointer hover:border-ocean/20 transition-colors">
                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Info */}
            <div className="flex flex-col">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <span className="text-sm font-bold text-[#10233D]">{product.rating || "4.9"}</span>
                <span className="text-sm text-ocean/50 font-manrope">({product.reviewCount || 42} reviews)</span>
              </div>
              
              <h1 className="font-clash text-3xl sm:text-4xl lg:text-5xl font-bold text-[#10233D] tracking-tight mb-2">
                {product.title}
              </h1>
              <p className="text-sm sm:text-base text-ocean/60 font-manrope mb-8">
                {product.tagline}
              </p>

              <div className="pb-8 border-b border-black/5 mb-8">
                {product.priceOnRequest ? (
                  <span className="font-space text-2xl font-bold text-ocean">Contact for Price</span>
                ) : (
                  <div className="flex flex-col">
                    <div className="flex items-end gap-3 mb-1">
                      <span className="font-space text-3xl sm:text-4xl font-bold text-[#10233D]">
                        {product.currency} {new Intl.NumberFormat("en-US").format(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="font-space text-lg text-ocean/40 line-through mb-1.5">
                          {new Intl.NumberFormat("en-US").format(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    {product.monthlyInstallment && (
                      <span className="text-xs font-bold text-ocean/50 uppercase tracking-widest font-manrope">
                        Or from RWF {new Intl.NumberFormat("en-US").format(product.monthlyInstallment)} / month
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3 text-sm font-manrope text-ocean/80">
                  <CheckCircle className="h-5 w-5 text-emerald-500" /> 
                  <span className="font-medium text-[#10233D]">{product.availability || "In Stock in Kigali"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-manrope text-ocean/80">
                  <Shield className="h-5 w-5 text-accent" /> 
                  <span>1 Year Genuine Warranty</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-manrope text-ocean/80">
                  <Truck className="h-5 w-5 text-accent" /> 
                  <span>Free delivery across Rwanda</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-manrope text-ocean/80">
                  <RefreshCw className="h-5 w-5 text-accent" /> 
                  <span>14-Day Returns</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <Button className="flex-1 py-4 text-sm font-bold bg-ocean hover:bg-ocean-dark rounded-[16px] shadow-sm">
                  Order Now
                </Button>
                <Button variant="secondary" className="flex-1 py-4 text-sm font-bold rounded-[16px] border-ocean/10 hover:bg-ocean/5 text-[#10233D]">
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
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
                <a href="tel:+250788123456" className="flex items-center justify-center gap-2 bg-white text-ocean py-3 rounded-xl text-sm font-bold hover:bg-ivory transition-colors">
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
