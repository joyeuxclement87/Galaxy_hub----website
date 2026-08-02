"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ZoomIn } from "lucide-react";

/**
 * Lightweight product gallery: a single main image with a compact thumbnail
 * row when multiple images exist. Clicking a thumbnail swaps the main image.
 */
export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const items = Array.from(new Set(images.filter(Boolean)));
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const current = items[index] ?? items[0];

  if (items.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-card bg-ivory-dark/40">
        <span className="text-sm text-ocean/20">No image available</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {/* Main image - reduced padding for mobile */}
        <div
          className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-card bg-[#f8f9fa] pt-4 pb-3 lg:pt-8 lg:pb-6 cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
        >
          {/* Subtle radial glow */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[70%] w-[70%] rounded-full bg-[radial-gradient(ellipse,rgba(11,84,151,0.05)_0%,transparent_70%)]" />
          </div>

          <Image
            key={current}
            src={current}
            alt={`${name} — image ${index + 1}${items.length > 1 ? ` of ${items.length}` : ""}`}
            fill
            priority={index === 0}
            sizes="(min-width: 1024px) 620px, (min-width: 640px) 50vw, 100vw"
            className="relative z-10 object-contain transition-all duration-300 ease-out group-hover:scale-[1.03]"
          />

          {/* Zoom hint */}
          <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1.5 rounded-full border border-ocean/10 bg-white/80 px-2.5 py-1 text-caption font-semibold text-ocean/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm">
            <ZoomIn className="h-3 w-3" />
            Tap to zoom
          </div>
        </div>

        {/* Thumbnail row */}
        {items.length > 1 && (
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`View image ${i + 1} of ${items.length}`}
                aria-pressed={i === index}
                className={cn(
                  "relative aspect-square cursor-pointer overflow-hidden rounded-btn border bg-[#f8f9fa] p-1.5 transition-all duration-250",
                  i === index
                    ? "border-ocean ring-1 ring-ocean/25 shadow-sm"
                    : "border-ocean/6 hover:border-ocean/20 hover:shadow-sm"
                )}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-12 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close"
            >
              ✕
            </button>

            <img
              src={current}
              alt={name}
              className="max-h-[80vh] w-full object-contain rounded-xl"
            />

            {/* Thumbnail row in lightbox */}
            {items.length > 1 && (
              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex gap-2">
                {items.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setIndex(i)}
                    className={cn(
                      "h-10 w-10 rounded-lg overflow-hidden border-2 transition-all duration-200",
                      i === index ? "border-white" : "border-white/30 opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
