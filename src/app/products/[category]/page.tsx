import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Filter, Star, Info, Phone, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { CATEGORIES, PRODUCTS } from "@/data/mock-data";
import { CategoryProductGrid } from "@/components/ui/category-product-grid";

// Next.js config for generating static params
export function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: { params: { category: string } }) {
  const category = CATEGORIES.find((c) => c.slug === params.category);
  if (!category) return { title: "Category Not Found" };

  return {
    title: category.seoTitle,
    description: category.seoDescription,
  };
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = CATEGORIES.find((c) => c.slug === params.category);

  if (!category) {
    notFound();
  }

  // Get products matching this category (or just show all for demo purposes if no exact match exists yet)
  // In a real app we would filter by category id.
  const categoryProducts = PRODUCTS.slice(0, 8); 

  // In a real app, this would come from a CMS or product database
  const filters = [
    { name: "Brand", options: ["Apple", "Samsung", "Google"] },
    { name: "Price Range", options: ["Under 100k", "100k - 500k", "Over 500k"] },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] selection:bg-ocean/20 selection:text-ocean">
      <Navbar />
      
      <main className="pt-24 md:pt-32 pb-24">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-[1320px] px-6 md:px-12 mb-8">
          <div className="flex items-center gap-2 text-xs font-medium text-ocean/50 font-manrope">
            <Link href="/" className="hover:text-ocean transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-ocean transition-colors">Products</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#10233D]">{category.name}</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mx-auto max-w-[1320px] px-6 md:px-12 mb-12 md:mb-16">
          <div className="relative overflow-hidden rounded-[32px] bg-[#10233D] p-8 md:p-16 flex items-center min-h-[300px]">
            <div className="absolute inset-0 z-0">
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover opacity-60 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#10233D] via-[#10233D]/80 to-transparent" />
            </div>
            
            <div className="relative z-10 max-w-2xl space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-white backdrop-blur-md">
                {category.productCount}+ Products
              </span>
              <h1 className="font-clash text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                {category.name}
              </h1>
              <p className="text-sm md:text-base leading-relaxed text-white/80 font-manrope max-w-xl">
                {category.description}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content: Layout with Sidebar and Grid */}
        <div className="mx-auto max-w-[1320px] px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* Filters Sidebar */}
            <aside className="w-full lg:w-[280px] shrink-0 space-y-8">
              <div className="flex items-center gap-2 border-b border-ocean/10 pb-4">
                <Filter className="h-4 w-4 text-ocean" />
                <h2 className="font-clash text-lg font-bold text-[#10233D]">Smart Filters</h2>
              </div>
              
              <div className="space-y-6">
                {filters.map((filter: any) => (
                  <div key={filter.name} className="space-y-3">
                    <h3 className="text-sm font-bold text-[#10233D] font-manrope">{filter.name}</h3>
                    <div className="space-y-2">
                      {filter.options.map((option: string) => (
                        <label key={option} className="flex items-center gap-3 cursor-pointer group">
                          <div className="flex h-4 w-4 items-center justify-center rounded border border-ocean/20 bg-white transition-colors group-hover:border-ocean">
                            {/* Checkbox logic would go here */}
                          </div>
                          <span className="text-sm text-ocean/70 font-manrope transition-colors group-hover:text-ocean">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="rounded-2xl bg-ocean-light/20 p-6 border border-ocean/10">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-ocean shrink-0" />
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

            {/* Product Grid */}
            <div className="flex-1 space-y-8">
              <div className="flex items-center justify-between">
                <p className="text-sm text-ocean/60 font-manrope">Showing <span className="font-bold text-[#10233D]">{categoryProducts.length}</span> results</p>
                <select className="text-sm font-medium bg-transparent border-none text-[#10233D] focus:ring-0 cursor-pointer outline-none">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                </select>
              </div>

              <CategoryProductGrid products={categoryProducts} />
            </div>
          </div>
        </div>

        {/* Related Categories */}
        <div className="mx-auto max-w-[1320px] px-6 md:px-12 mt-24">
          <div className="space-y-8">
            <h2 className="font-clash text-2xl font-bold text-[#10233D]">Explore More</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CATEGORIES.filter(c => c.slug !== category.slug).slice(0, 4).map(related => (
                <Link 
                  key={related.id} 
                  href={`/products/${related.slug}`}
                  className="group rounded-2xl bg-white p-4 flex items-center gap-4 border border-ocean/5 shadow-sm hover:border-ocean/20 transition-colors"
                >
                  <img src={related.image} className="h-12 w-12 rounded-xl object-cover bg-ivory" alt={related.name} />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#10233D]">{related.name}</h4>
                    <p className="text-[10px] text-ocean/50 font-manrope uppercase tracking-wider">Explore</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
