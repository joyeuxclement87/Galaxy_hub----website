-- ============================================================
-- TRADE-INS — TWO-DEVICE MODEL (rest)
-- Continues 20260817120000 (wanted_product_id FK). Adds the
-- wanted-product snapshot fields and the "trading in" device
-- fields, then drops the old single-device columns. The table
-- has no production rows, so drop is safe and avoids fragile
-- multi-column renames.
-- ============================================================

alter table public.trade_ins
  add column wanted_product_name text not null default '',
  add column wanted_product_storage text;

alter table public.trade_ins
  add column trade_device_brand text not null default '';

alter table public.trade_ins
  add column trade_device_model text not null default '';

alter table public.trade_ins
  add column trade_device_storage text;

alter table public.trade_ins drop column device_brand;
alter table public.trade_ins drop column device_model;
alter table public.trade_ins drop column storage;

comment on column public.trade_ins.wanted_product_id is
  'Reference to the existing Galaxy Hub product the customer wants to buy via trade-in.';
comment on column public.trade_ins.wanted_product_name is
  'Snapshot of the wanted product name for display/Telegram — the products row is the source of truth.';
comment on column public.trade_ins.wanted_product_storage is
  'Selected storage variant of the wanted product, e.g. 256GB.';

-- Existing RLS policies reference the table only via (true) checks,
-- so no policy changes are required.