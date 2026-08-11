-- ============================================================
-- ADD SPECIFICATION SOURCE METADATA
-- ============================================================
-- Adds an admin-only metadata column recording how a product's
-- specifications were obtained:
--   manual     — typed in by the admin
--   mobileapi  — imported from MobileAPI.dev and reviewed/edited
--   other_api  — imported from another future provider
--   copied     — copied from an existing Galaxy Hub product
--
-- This is purely informational for the admin dashboard. It is never
-- rendered on public pages, and the customer-facing display always
-- reads from products.specifications regardless of the source.
--
-- Additive only — no existing columns, tables, or data are modified
-- or removed.
-- ============================================================

alter table public.products
  add column if not exists specification_source text not null default 'manual';

comment on column public.products.specification_source is
  'Admin-only: how specifications were obtained (manual | mobileapi | other_api | copied). Never shown to customers.';