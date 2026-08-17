-- Tighten trade_ins RLS: anonymous requests may only INSERT. The previous
-- SELECT (using true) exposed customer PII (name, phone, email, photos) to
-- anyone with the anon key, and UPDATE (using true, with check true) let
-- anyone alter statuses and values. Admins operate through the service-role
-- client, which bypasses RLS, so no permissive policies are needed.
drop policy if exists "Anyone can submit trade-ins" on public.trade_ins;
drop policy if exists "Admins can view trade-ins" on public.trade_ins;
drop policy if exists "Admins can update trade-ins" on public.trade_ins;

create policy "Anyone can submit trade-ins"
on public.trade_ins
for insert
with check (true);