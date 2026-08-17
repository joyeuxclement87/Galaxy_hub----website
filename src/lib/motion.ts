/* ─── Galaxy Hub Motion System ─────────────────────────────────────────────
   Single source of truth for every animation in the product. All components
   import from here — never invent per-component speeds.

   Principles:
   · animate opacity + transform only (GPU-friendly, no layout shifts)
   · quiet entrances: 500–650ms ease-out, small translateY
   · grouped stagger: max ~300–400ms visible
   · respect prefers-reduced-motion (enforced globally via MotionConfig)
   ──────────────────────────────────────────────────────────────────────── */

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const MOTION = {
  /* timing tokens (mirrored as CSS vars: --motion-fast/-normal/-slow) */
  fast: 0.18,
  normal: 0.3,
  slow: 0.6,
  /* standard reveal duration */
  reveal: 0.55,
  /* standard stagger step */
  stagger: 0.07,
  /* maximum staggered elements in a grid — keeps visible stagger ≤ ~300ms */
  gridStaggerCap: 3,
} as const;

/* Default trigger: once, when ~10% of the element has entered the viewport */
export const REVEAL_VIEWPORT = { once: true, margin: "-32px 0px" } as const;

/* Grouped product-grid stagger: cards 1–4 → 0 / 70 / 140 / 210ms, then flat */
export function gridStaggerDelay(index: number): number {
  return Math.min(index, MOTION.gridStaggerCap) * MOTION.stagger;
}