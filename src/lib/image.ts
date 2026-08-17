/**
 * Neutral low-quality placeholder used as `blurDataURL` for remote images
 * (product shots, promos, category art). A single tiny data URI keeps the
 * HTML payload negligible while giving every image a soft, on-brand preview.
 */
export const BLUR_PLACEHOLDER =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" fill="#e8edf2"/></svg>`,
  );