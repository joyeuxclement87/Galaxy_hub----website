import React from "react";
import { BRAND_CATALOG } from "@/data/brands";
import type { BrandCatalogItem } from "@/data/brands";

interface BrandsProps {
  brands?: BrandCatalogItem[];
}

const LOGO_COLORS = [
  "bg-ocean text-white",
  "bg-ocean-deeper text-white",
  "bg-accent text-white",
  "bg-ocean-dark text-white",
];

function isImageLogo(logo: string) {
  return /^https?:\/\//.test(logo) || logo.startsWith("/");
}

function BrandLogoCard({ brand, index }: { brand: BrandCatalogItem; index: number }) {
  const hasImage = isImageLogo(brand.logo);
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-card border border-ocean/8 bg-white px-5 py-4 select-none">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-btn text-sm font-bold ${
          hasImage ? "bg-ivory" : LOGO_COLORS[index % LOGO_COLORS.length]
        }`}
      >
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={brand.logo} alt={brand.name} className="h-full w-full object-contain p-1.5" />
        ) : (
          brand.logo || brand.name.charAt(0)
        )}
      </div>
      <div className="whitespace-nowrap pr-1">
        <p className="text-sm font-bold text-ocean-deeper leading-tight">{brand.name}</p>
        <p className="text-xs text-ocean-deeper/50 leading-tight">{brand.category}</p>
      </div>
    </div>
  );
}

export function Brands({ brands }: BrandsProps) {
  const catalog = brands && brands.length > 0 ? brands : BRAND_CATALOG;

  // Repeat the catalog enough times so the strip always overflows the
  // viewport and the loop reads as continuous, no matter how many brands
  // exist in the database — new brands added later simply extend the strip.
  // Repeats must stay even so the halfway point of the track lines up
  // exactly with a repeat boundary, keeping the loop seamless.
  const rawRepeats = Math.max(2, Math.ceil(12 / Math.max(catalog.length, 1)));
  const repeats = rawRepeats % 2 === 0 ? rawRepeats : rawRepeats + 1;
  const track = Array.from({ length: repeats }, () => catalog).flat();

  return (
    <section id="brands" className="bg-ivory py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <div className="max-w-2xl space-y-3">
          <span className="section-label">BRANDS WE CARRY</span>
          <h2 className="font-clash text-2xl sm:text-3xl font-bold leading-tight text-ocean-deeper">
            Trusted Technology Brands
          </h2>
          <p className="text-sm leading-[1.8] text-ocean-deeper/60">
            A showcase of the genuine technology brands stocked at Galaxy Hub, available in Kigali and delivered across Rwanda.
          </p>
        </div>

        <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div
            className="flex w-max animate-marquee-left gap-3 hover:[animation-play-state:paused]"
            style={{ animationDuration: `${track.length * 2.5}s` }}
          >
            {track.map((brand, index) => (
              <BrandLogoCard key={`${brand.slug}-${index}`} brand={brand} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
