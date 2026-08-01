"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Lightweight product gallery: a single main image with a compact thumbnail
 * row when multiple images exist. Clicking a thumbnail swaps the main image.
 */
export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const items = Array.from(new Set(images.filter(Boolean)));
  const [index, setIndex] = useState(0);
  const current = items[index] ?? items[0];

  if (items.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-card bg-ivory-dark/40">
        <span className="text-lg text-ocean/15">No image</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-card bg-ivory-dark/40 p-8 lg:p-12">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[80%] w-[80%] rounded-full bg-[radial-gradient(ellipse,rgba(11,84,151,0.06)_0%,transparent_70%)]" />
        </div>
        <Image
          src={current}
          alt={`${name} — product image ${index + 1} of ${items.length}`}
          fill
          priority={index === 0}
          sizes="(min-width: 1024px) 620px, (min-width: 640px) 50vw, 100vw"
          className="relative z-10 object-contain"
        />
      </div>

      {items.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-4">
          {items.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`View image ${i + 1} of ${items.length}`}
              aria-pressed={i === index}
              className={cn(
                "relative aspect-square cursor-pointer overflow-hidden rounded-btn border bg-ivory-dark/30 p-2 transition-all duration-200",
                i === index
                  ? "border-ocean ring-1 ring-ocean/30"
                  : "border-ocean/5 hover:border-ocean/20"
              )}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="96px"
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
