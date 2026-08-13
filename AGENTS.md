<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Galaxy Hub Website

Single-page Next.js 16 e-commerce showcase for a Rwanda tech retailer. No backend, no database — all data is static mock data in `src/data/`.

## Stack

- **Next.js 16.2.10** + **React 19.2.4** (App Router, `"use client"` directives for interactivity)
- **Tailwind CSS 4** — CSS-based config via `@import "tailwindcss"` + `@theme` block in `globals.css`. No `tailwind.config.*` file.
- **TypeScript 5** (strict, bundler module resolution)
- **ESLint 9** flat config (`eslint.config.mjs`)

## Commands

```
npm run dev      # dev server
npm run build    # production build
npm run start    # start production server
npm run lint     # eslint (no test or typecheck commands exist)
```

## Architecture

- **Entrypoint**: `src/app/layout.tsx` — root layout wraps everything in `AppProvider`
- **Main page**: `src/app/page.tsx` — single scrollable landing page with all sections (hero, deals, categories, brands, products, reviews, etc.)
- **Routes**: `/`, `/products/[category]`, `/product/[slug]`, `/brands/[slug]`, `/order`, `/search`, `/deals/[slug]`
- **Components**: `src/components/ui/*` (generic), `src/app/(landing)/sections/*` (page section components)
- **State**: `AppContext` (`src/context/AppContext.tsx`) — cart/wishlist with localStorage persistence (keys: `gh-cart`, `gh-wishlist`)
- **Data layer**: `src/data/mock-data.ts` (products, categories, deals, reviews) + `src/data/brands.ts` (brand catalog). All static — no API calls.
- **Utility**: `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge)

## Key Quirks

- `@/*` path alias maps to `./src/*`
- Unsplash images config in `next.config.ts` under `remotePatterns`
- **Utility scripts** at root that mutate source files: `update_mock.js`, `update_page.js`, `update_trending.js`
- Custom theme colors in `globals.css` via `@theme`: `ivory` (#faf9f6), `ocean` (#0b5497), `ocean-dark`, `ocean-light`, `accent`
- Font stack: **Manrope** (`next/font/google`, body via `--font-sans`) + **Plus Jakarta Sans** (`next/font/google`, display/headings via `--font-display`/`--font-clash`). Both loaded in `src/app/layout.tsx`; font vars live in the `globals.css` `@theme` block.
- No tests, no CI/CD, no test framework
