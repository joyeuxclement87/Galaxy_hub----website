-- ============================================================
-- STORAGE VARIANTS FOR ORDERING
-- ============================================================
-- Lets customers pick a phone's storage size when ordering.
--
--   products.storage_options  -> jsonb array of strings, e.g. ["128GB","256GB","512GB"]
--   cart_items.variant        -> the selected variant (e.g. "256GB") when added to cart
--   order_items.variant       -> frozen copy of the variant at order time
--
-- All additive — no existing columns, tables, or data are modified.
-- ============================================================

alter table public.products
  add column if not exists storage_options jsonb not null default '[]'::jsonb;

alter table public.cart_items
  add column if not exists variant text;

alter table public.order_items
  add column if not exists variant text;

comment on column public.products.storage_options is
  'Selectable storage sizes offered for this product, e.g. ["128GB","256GB","512GB"]. Empty for products without storage variants.';

comment on column public.cart_items.variant is
  'Storage variant selected by the customer when adding the item to the cart (e.g. "256GB"). Null when the product has no variants.';

comment on column public.order_items.variant is
  'Storage variant chosen at order time, frozen for the order record (e.g. "256GB"). Null when the product has no variants.';
