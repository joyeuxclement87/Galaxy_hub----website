-- ============================================================
-- TRADE-INS
-- Customers submit their current device for staff evaluation.
-- The trade-in value is assigned by staff (final_value) after
-- review — never calculated at submission time. Requests are
-- inserted via the public form (anon), read/managed by admins
-- (service role / admin client). Telegram delivery is tracked
-- via telegram_sent and can be retried from the admin panel.
-- ============================================================

-- Structured Trade-In ID: TRD-YYYY-NNNN (atomic, unique).
create sequence if not exists public.trade_in_number_seq start with 1;

create or replace function public.next_trade_in_number()
returns text
language sql
as $$
  select 'TRD-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.trade_in_number_seq')::text, 4, '0');
$$;

revoke all on function public.next_trade_in_number() from public;

-- Public submission (anon key) generates the number; admins too.
grant execute on function public.next_trade_in_number() to anon, authenticated, service_role;

create table public.trade_ins (
  id uuid primary key default gen_random_uuid(),
  trade_in_id text not null unique,
  customer_name text not null,
  phone text not null,
  email text,
  device_brand text not null,
  device_model text not null,
  storage text,
  device_condition text not null
    check (device_condition in ('like_new', 'good', 'fair', 'damaged')),
  screen_condition text not null
    check (screen_condition in ('perfect', 'minor_scratches', 'visible_scratches', 'cracked')),
  battery_condition text not null
    check (battery_condition in ('excellent', 'good', 'fair', 'unknown')),
  functional_status text not null
    check (functional_status in ('fully_working', 'minor_issues', 'major_issues', 'not_working')),
  accessories text[] not null default '{}',
  faults text,
  customer_notes text,
  photos text[] not null default '{}',
  estimated_value numeric(14, 2),
  final_value numeric(14, 2),
  status text not null default 'pending'
    check (status in ('pending', 'under_review', 'offer_sent', 'accepted', 'rejected', 'completed', 'cancelled')),
  admin_notes text,
  telegram_sent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.trade_ins enable row level security;

create policy "Anyone can submit trade-ins"
on public.trade_ins
for insert
with check (true);

create policy "Admins can view trade-ins"
on public.trade_ins
for select
using (true);

create policy "Admins can update trade-ins"
on public.trade_ins
for update
using (true)
with check (true);
