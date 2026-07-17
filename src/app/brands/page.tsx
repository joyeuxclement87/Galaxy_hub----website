import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { BRAND_CATALOG, BRAND_FILTERS } from "@/data/brands";

export const metadata = {
  title: "Shop by Brand | Galaxy Hub",
  description: "Explore trusted technology brands available at Galaxy Hub in Kigali and delivered across Rwanda.",
};

export default function BrandsIndexPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffdf9_0%,#f5f9fe_100%)] text-[#10233D]">
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12 lg:py-24">
        <div className="max-w-3xl space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#0b5497]/10 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0b5497]">
            <Sparkles className="h-3.5 w-3.5" />
            Shop by Brand
          </span>
          <h1 className="font-clash text-4xl font-semibold leading-tight sm:text-5xl">Premium tech brands, made easy to explore.</h1>
          <p className="text-lg leading-8 text-[#10233D]/70">
            From flagship smartphones to premium audio, Galaxy Hub brings the world&apos;s best technology names closer to Rwanda.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {BRAND_FILTERS.map((filter) => (
            <span key={filter} className="rounded-full border border-[#0b5497]/10 bg-white/80 px-4 py-2 text-sm font-semibold text-[#10233D]/70">
              {filter}
            </span>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {BRAND_CATALOG.map((brand) => (
            <Link key={brand.slug} href={`/brands/${brand.slug}`} className="group rounded-[28px] border border-[#0b5497]/10 bg-white p-6 shadow-[0_16px_50px_rgba(11,84,151,0.06)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_22px_65px_rgba(11,84,151,0.1)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#0b5497]/70">{brand.filter}</p>
                  <h2 className="mt-2 font-clash text-2xl font-semibold text-[#10233D]">{brand.name}</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#0b5497]/10 bg-[#f6fbff] text-lg font-semibold text-[#0b5497]">
                  {brand.logo}
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-[#10233D]/70">{brand.description}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0b5497]">
                Explore brand
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
