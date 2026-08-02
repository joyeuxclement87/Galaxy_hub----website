-- ============================================================
-- CONTACT MESSAGES + PRODUCT ENQUIRIES
-- Used by the public contact form and product "Request Quote"
-- flow. Saved via anon server actions, then mirrored to the
-- staff Telegram group. RLS: anyone can insert (public forms),
-- admins (service role / admin client) read and manage.
-- ============================================================

-- ============================================================
-- 1. CONTACT MESSAGES
-- ============================================================

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  subject text,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'read', 'responded', 'archived')),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "Anyone can submit contact messages"
on public.contact_messages
for insert
with check (true);

create policy "Admins can view contact messages"
on public.contact_messages
for select
using (true);

create policy "Admins can update contact messages"
on public.contact_messages
for update
using (true)
with check (true);

-- ============================================================
-- 2. PRODUCT ENQUIRIES (Request Quote)
-- ============================================================

create table public.product_enquiries (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  product_slug text,
  product_name text not null,
  variant text,
  name text not null,
  phone text not null,
  email text,
  notes text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.product_enquiries enable row level security;

create policy "Anyone can submit product enquiries"
on public.product_enquiries
for insert
with check (true);

create policy "Admins can view product enquiries"
on public.product_enquiries
for select
using (true);

create policy "Admins can update product enquiries"
on public.product_enquiries
for update
using (true)
with check (true);
