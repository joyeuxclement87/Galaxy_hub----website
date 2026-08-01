-- ============================================================
-- ADD PRODUCT SPECIFICATIONS & HIGHLIGHTS
-- ============================================================
-- Adds two flexible JSONB columns to the existing public.products
-- table so the admin can attach structured technical specifications
-- (optionally imported from MobileAPI.dev and normalized before
-- saving) and marketing highlights, without a rigid per-category
-- column schema. This is additive only — no existing columns,
-- tables, or data are modified or removed.
--
-- specifications shape (products.specifications):
--   [
--     { "name": "Display", "specs": [{ "label": "Screen Size", "value": "6.9\"" }, ...] },
--     { "name": "Performance", "specs": [{ "label": "Processor", "value": "Snapdragon 8 Elite" }, ...] }
--   ]
--
-- highlights shape (products.highlights):
--   ["200MP Pro Camera", "120Hz AMOLED Display", "Snapdragon 8 Elite"]
-- ============================================================

alter table public.products
  add column if not exists specifications jsonb not null default '[]'::jsonb;

alter table public.products
  add column if not exists highlights jsonb not null default '[]'::jsonb;

comment on column public.products.specifications is
  'Ordered list of specification groups: [{ "name": "Display", "specs": [{ "label": "Screen Size", "value": "6.9\"" }] }]. Entered manually by the admin or imported from MobileAPI.dev and normalized before saving. Never sourced automatically for price.';

comment on column public.products.highlights is
  'Admin-curated marketing highlight strings shown on the product page (e.g. ["200MP Pro Camera", "5000mAh Battery"]). Always manually controlled by Galaxy Hub, independent of any imported specifications.';
