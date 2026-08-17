import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
    // Serve AVIF where supported, fall back to WebP, then the original format.
    formats: ["image/avif", "image/webp"],
    // Single quality tier — keeps product imagery sharp without runaway sizes.
    qualities: [75],
    // Optimized images are cached by the browser/optimizer for 7 days so
    // repeated product images (grid -> detail -> cart) are served from cache.
    minimumCacheTTL: 604800,
  },
};

export default nextConfig;