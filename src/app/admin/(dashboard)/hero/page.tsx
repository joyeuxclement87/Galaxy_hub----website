import { getHero, getActiveProducts } from "@/data/admin-hero";
import { upsertHero } from "@/actions/hero";
import { HeroClient } from "./HeroClient";

export default async function HeroPage() {
  const [hero, products] = await Promise.all([getHero(), getActiveProducts()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-clash text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Hero Section</h1>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Customize the landing page hero banner</p>
      </div>
      <div className="rounded-2xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] p-6 shadow-sm">
        <HeroClient hero={hero} products={products} onSubmit={upsertHero} />
      </div>
    </div>
  );
}
