import Link from "next/link";
import { ArrowRight, BadgeCheck, PackageCheck, Sparkles } from "lucide-react";
import { BRAND_CATALOG, getBrandBySlug } from "@/data/brands";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return BRAND_CATALOG.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);

  if (!brand) {
    return {
      title: "Brand Not Found | Galaxy Hub",
    };
  }

  return {
    title: brand.seoTitle,
    description: brand.seoDescription,
  };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffdf9_0%,#f5f9fe_100%)] text-[#10233D]">
      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-16 md:px-12 lg:flex-row lg:items-end lg:justify-between lg:py-24">
        <div className="max-w-2xl space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#0b5497]/10 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0b5497]">
            <BadgeCheck className="h-3.5 w-3.5" />
            Trusted Brand
          </span>
          <div className="space-y-3">
            <h1 className="font-clash text-4xl font-semibold leading-tight sm:text-5xl">{brand.name}</h1>
            <p className="text-lg text-[#10233D]/70">{brand.description}</p>
          </div>
          <p className="text-sm leading-7 text-[#10233D]/65">{brand.tagline}</p>
        </div>

        <div className="rounded-[28px] border border-[#0b5497]/10 bg-white/90 p-6 shadow-[0_16px_60px_rgba(11,84,151,0.08)] md:min-w-[320px]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0b5497]/70">Available now</span>
            <Sparkles className="h-4 w-4 text-[#0b5497]" />
          </div>
          <div className="mt-4 space-y-3">
            {brand.products.map((product) => (
              <div key={product} className="flex items-center justify-between rounded-2xl border border-[#0b5497]/8 bg-[#f8fbff] px-4 py-3 text-sm text-[#10233D]/75">
                <span>{product}</span>
                <PackageCheck className="h-4 w-4 text-[#0b5497]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-20 md:px-12 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[32px] border border-[#0b5497]/10 bg-white p-8 shadow-[0_20px_60px_rgba(11,84,151,0.06)]">
          <h2 className="font-clash text-2xl font-semibold">Popular devices</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#10233D]/70">
            Galaxy Hub helps customers discover the right technology from {brand.name} with genuine devices, warranty support, and fast delivery across Rwanda.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {brand.products.map((product) => (
              <div key={product} className="rounded-[24px] border border-[#0b5497]/10 bg-[#f8fbff] p-5">
                <p className="text-sm font-semibold text-[#0b5497]">{product}</p>
                <p className="mt-2 text-sm leading-7 text-[#10233D]/65">Premium device selection available for reserve, pickup, or nationwide delivery.</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-5 rounded-[32px] border border-[#0b5497]/10 bg-white p-8 shadow-[0_20px_60px_rgba(11,84,151,0.06)]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0b5497]/70">Related categories</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {brand.category.split("•").map((item) => (
                <span key={item} className="rounded-full bg-[#f2f7fc] px-3 py-1 text-sm text-[#10233D]/70">{item.trim()}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0b5497]/70">FAQs</p>
            <div className="mt-4 space-y-3 text-sm text-[#10233D]/70">
              <p><span className="font-semibold text-[#10233D]">Do you stock authentic devices?</span> Yes. Every device is sourced through trusted channels and verified before sale.</p>
              <p><span className="font-semibold text-[#10233D]">Do you deliver outside Kigali?</span> Yes. We offer delivery across Rwanda with secure packaging and support.</p>
            </div>
          </div>
          <Link href="/products" className="inline-flex items-center gap-2 font-semibold text-[#0b5497]">
            Explore more products
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </aside>
      </section>
    </main>
  );
}
