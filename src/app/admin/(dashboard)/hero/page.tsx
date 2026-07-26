import { getHero, getActiveProducts } from "@/data/admin-hero";
import { upsertHero } from "@/actions/hero";
import { HeroClient } from "./HeroClient";

export default async function HeroPage() {
  const [hero, products] = await Promise.all([getHero(), getActiveProducts()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-clash text-2xl font-bold text-white tracking-tight">Hero Section</h1>
        <p className="mt-1 text-sm text-white/40">Customize the landing page hero banner</p>
      </div>
      <div className="rounded-2xl border border-white/8 bg-white/5 p-6 shadow-sm">
        <HeroClient hero={hero} products={products} onSubmit={upsertHero} />
      </div>
    </div>
  );
}
