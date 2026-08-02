-- ============================================================
-- SEQUENTIAL ORDER NUMBERS (GH-YYYY-000001)
-- GH = Galaxy Hub, YYYY = order year, 000001 = sequential number.
-- next_order_number() returns the next number atomically, so two
-- concurrent checkouts can never receive the same number.
-- ============================================================

create sequence if not exists public.order_number_seq start with 1;

create or replace function public.next_order_number()
returns text
language sql
as $$
  select 'GH-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.order_number_seq')::text, 6, '0');
$$;

revoke all on function public.next_order_number() from public;

-- Public checkout (anon key) generates the number; admins/service role too.
grant execute on function public.next_order_number() to anon, authenticated, service_role;
