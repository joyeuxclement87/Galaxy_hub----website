-- ============================================================
-- ADD REVIEWS TABLE
-- ============================================================
-- Admin-managed customer testimonials shown in the "Customer
-- Experience" section on the homepage. The admin creates/edits/
-- deletes reviews from /admin/reviews; the public site only ever
-- reads rows where is_active = true.
-- ============================================================

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  role text,
  location text,
  avatar_url text,
  rating smallint not null check (rating between 1 and 5),
  content text not null,
  purchased_product text,
  category text,
  is_verified boolean not null default true,
  featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.reviews is
  'Customer testimonials curated by the admin and displayed on the homepage Customer Experience section.';

alter table public.reviews enable row level security;

-- Public: anyone can read active reviews (matches the public product listing)
create policy "Public can read active reviews"
on public.reviews for select
using (is_active = true);

-- Admins (authenticated users) have full CRUD, same pattern as
-- products/categories/brands/promotions
create policy "Admins can insert reviews"
on public.reviews for insert
with check (true);

create policy "Admins can update reviews"
on public.reviews for update
using (true)
with check (true);

create policy "Admins can delete reviews"
on public.reviews for delete
using (true);
