-- ============================================================
-- Admin CRUD Policies
-- Authenticated users (admins) can manage all tables
-- ============================================================

-- Products: authenticated users have full CRUD
create policy "Admins can insert products"
on public.products for insert
with check (true);

create policy "Admins can update products"
on public.products for update
using (true)
with check (true);

create policy "Admins can delete products"
on public.products for delete
using (true);

-- Categories: authenticated users have full CRUD
create policy "Admins can insert categories"
on public.categories for insert
with check (true);

create policy "Admins can update categories"
on public.categories for update
using (true)
with check (true);

create policy "Admins can delete categories"
on public.categories for delete
using (true);

-- Brands: authenticated users have full CRUD
create policy "Admins can insert brands"
on public.brands for insert
with check (true);

create policy "Admins can update brands"
on public.brands for update
using (true)
with check (true);

create policy "Admins can delete brands"
on public.brands for delete
using (true);

-- Promotions: authenticated users have full CRUD
create policy "Admins can insert promotions"
on public.promotions for insert
with check (true);

create policy "Admins can update promotions"
on public.promotions for update
using (true)
with check (true);

create policy "Admins can delete promotions"
on public.promotions for delete
using (true);

-- Hero sections: authenticated users have full CRUD
create policy "Admins can insert hero sections"
on public.hero_sections for insert
with check (true);

create policy "Admins can update hero sections"
on public.hero_sections for update
using (true)
with check (true);

create policy "Admins can delete hero sections"
on public.hero_sections for delete
using (true);

-- Product images: authenticated users have full CRUD
create policy "Admins can insert product images"
on public.product_images for insert
with check (true);

create policy "Admins can update product images"
on public.product_images for update
using (true)
with check (true);

create policy "Admins can delete product images"
on public.product_images for delete
using (true);

-- Orders: authenticated users have full read/update
create policy "Admins can view orders"
on public.orders for select
using (true);

create policy "Admins can update orders"
on public.orders for update
using (true)
with check (true);

-- Order items: authenticated users have full read
create policy "Admins can view order items"
on public.order_items for select
using (true);
