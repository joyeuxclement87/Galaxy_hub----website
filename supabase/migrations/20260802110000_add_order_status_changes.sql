-- ============================================================
-- ORDER STATUS CHANGE HISTORY
-- Records every admin status transition on an order. Staff get a
-- Telegram notification per change; this table is the base for
-- later customer-facing notifications (email/WhatsApp/SMS).
-- ============================================================

create table public.order_status_changes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  previous_status text,
  new_status text not null,
  changed_by text,
  created_at timestamptz not null default now()
);

alter table public.order_status_changes enable row level security;

create policy "Admins can insert order status changes"
on public.order_status_changes
for insert
with check (true);

create policy "Admins can view order status changes"
on public.order_status_changes
for select
using (true);
