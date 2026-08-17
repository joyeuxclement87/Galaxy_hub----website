"use client";

import React, { useEffect, useState } from "react";
import { ImageIcon, X } from "lucide-react";
import { Section, EmptyState } from "../components";

/* ─── PHOTO GALLERY ─────────────────────────────────────────────────────────
   Responsive grid with a simple lightbox. Thumbnails load lazily; the
   lightbox opens the same URL in a fullscreen overlay. */

export function PhotosGallery({ photos }: { photos: string[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  if (photos.length === 0) {
    return (
      <Section title="Photos" icon={<ImageIcon className="h-3.5 w-3.5" />}>
        <EmptyState icon={<ImageIcon className="h-8 w-8" />} message="No photos submitted." />
      </Section>
    );
  }

  return (
    <Section
      title={`Photos (${photos.length})`}
      icon={<ImageIcon className="h-3.5 w-3.5" />}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((url, index) => (
          <button
            key={url}
            type="button"
            onClick={() => setLightbox(index)}
            className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-xl border border-white/8 bg-[#0a1628]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Device photo ${index + 1}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <span className="absolute bottom-2 right-2 rounded-md bg-ocean-deeper/70 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur">
              {index + 1}
            </span>
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 cursor-pointer rounded-full border border-white/15 bg-white/5 p-2 text-white/70 hover:text-white"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[lightbox]}
            alt={`Device photo ${lightbox + 1}`}
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
          />
          <p className="absolute bottom-4 text-xs font-semibold text-white/50">
            {lightbox + 1} / {photos.length}
          </p>
        </div>
      )}
    </Section>
  );
}