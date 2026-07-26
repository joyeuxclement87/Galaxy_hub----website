-- ============================================================
-- GALAXY HUB - COMPLETE DATABASE SCHEMA
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- 1. CATEGORIES
-- ============================================================

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ============================================================
-- 2. BRANDS
-- ============================================================

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  logo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ============================================================
-- 3. PRODUCTS
-- ============================================================

create table public.products (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  slug text unique not null,

  short_description text,
  description text,

  price numeric(12,2) not null default 0,
  old_price numeric(12,2),

  discount_percentage integer
    check (
      discount_percentage is null
      or discount_percentage between 0 and 100
    ),

  category_id uuid references public.categories(id)
    on delete set null,

  brand_id uuid references public.brands(id)
    on delete set null,

  main_image_url text,

  is_featured boolean not null default false,
  is_new boolean not null default false,
  is_active boolean not null default true,

  stock_status text not null default 'available'
    check (
      stock_status in (
        'available',
        'out_of_stock',
        'coming_soon'
      )
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ============================================================
-- 4. PRODUCT IMAGES
-- ============================================================

create table public.product_images (
  id uuid primary key default gen_random_uuid(),

  product_id uuid not null
    references public.products(id)
    on delete cascade,

  image_url text not null,

  sort_order integer not null default 0,

  created_at timestamptz not null default now()
);


-- ============================================================
-- 5. PROMOTIONS
-- ============================================================

create table public.promotions (
  id uuid primary key default gen_random_uuid(),

  title text not null,

  description text,

  image_url text,

  button_text text default 'Shop Now',

  button_link text,

  discount_percentage integer
    check (
      discount_percentage is null
      or discount_percentage between 0 and 100
    ),

  starts_at timestamptz,

  ends_at timestamptz,

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ============================================================
-- 6. HERO SECTION
-- ============================================================

create table public.hero_sections (
  id uuid primary key default gen_random_uuid(),

  product_id uuid references public.products(id)
    on delete set null,

  badge text,

  title text,

  subtitle text,

  primary_button_text text default 'Add to Cart',

  secondary_button_text text default 'View Product',

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ============================================================
-- 7. CARTS
-- ============================================================

create table public.carts (
  id uuid primary key default gen_random_uuid(),

  session_id text unique not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ============================================================
-- 8. CART ITEMS
-- ============================================================

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),

  cart_id uuid not null
    references public.carts(id)
    on delete cascade,

  product_id uuid not null
    references public.products(id)
    on delete cascade,

  quantity integer not null default 1
    check (quantity > 0),

  created_at timestamptz not null default now(),

  unique(cart_id, product_id)
);


-- ============================================================
-- 9. ORDERS
-- ============================================================

create table public.orders (
  id uuid primary key default gen_random_uuid(),

  order_number text unique not null,

  customer_name text not null,

  phone text not null,

  email text,

  address text,

  notes text,

  status text not null default 'pending'
    check (
      status in (
        'pending',
        'confirmed',
        'processing',
        'completed',
        'cancelled'
      )
    ),

  total_amount numeric(12,2) not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ============================================================
-- 10. ORDER ITEMS
-- ============================================================

create table public.order_items (
  id uuid primary key default gen_random_uuid(),

  order_id uuid not null
    references public.orders(id)
    on delete cascade,

  product_id uuid
    references public.products(id)
    on delete set null,

  product_name text not null,

  price numeric(12,2) not null,

  quantity integer not null
    check (quantity > 0),

  created_at timestamptz not null default now()
);


-- ============================================================
-- 11. INDEXES
-- ============================================================

create index products_category_id_idx
on public.products(category_id);

create index products_brand_id_idx
on public.products(brand_id);

create index products_featured_idx
on public.products(is_featured);

create index products_is_new_idx
on public.products(is_new);

create index products_active_idx
on public.products(is_active);

create index products_stock_status_idx
on public.products(stock_status);

create index product_images_product_id_idx
on public.product_images(product_id);

create index cart_items_cart_id_idx
on public.cart_items(cart_id);

create index order_items_order_id_idx
on public.order_items(order_id);

create index orders_status_idx
on public.orders(status);

create index orders_created_at_idx
on public.orders(created_at desc);


-- ============================================================
-- 12. ROW LEVEL SECURITY
-- ============================================================

alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.promotions enable row level security;
alter table public.hero_sections enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;


-- ============================================================
-- 13. PUBLIC READ POLICIES
-- ============================================================

create policy "Public can view active categories"
on public.categories
for select
using (is_active = true);


create policy "Public can view active brands"
on public.brands
for select
using (is_active = true);


create policy "Public can view active products"
on public.products
for select
using (is_active = true);


create policy "Public can view product images"
on public.product_images
for select
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
    and products.is_active = true
  )
);


create policy "Public can view active promotions"
on public.promotions
for select
using (is_active = true);


create policy "Public can view active hero sections"
on public.hero_sections
for select
using (is_active = true);


-- ============================================================
-- 14. PUBLIC ORDER CREATION
-- ============================================================

create policy "Anyone can create an order"
on public.orders
for insert
with check (true);


create policy "Anyone can create order items"
on public.order_items
for insert
with check (true);


-- ============================================================
-- 15. PUBLIC CART ACCESS
-- ============================================================

create policy "Anyone can create carts"
on public.carts
for insert
with check (true);


create policy "Anyone can view carts"
on public.carts
for select
using (true);


create policy "Anyone can update carts"
on public.carts
for update
using (true)
with check (true);


create policy "Anyone can create cart items"
on public.cart_items
for insert
with check (true);


create policy "Anyone can view cart items"
on public.cart_items
for select
using (true);


create policy "Anyone can update cart items"
on public.cart_items
for update
using (true)
with check (true);


create policy "Anyone can delete cart items"
on public.cart_items
for delete
using (true);


-- ============================================================
-- 16. UPDATED_AT FUNCTION
-- ============================================================

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ============================================================
-- 17. UPDATED_AT TRIGGERS
-- ============================================================

create trigger update_categories_updated_at
before update on public.categories
for each row
execute function public.update_updated_at_column();


create trigger update_brands_updated_at
before update on public.brands
for each row
execute function public.update_updated_at_column();


create trigger update_products_updated_at
before update on public.products
for each row
execute function public.update_updated_at_column();


create trigger update_promotions_updated_at
before update on public.promotions
for each row
execute function public.update_updated_at_column();


create trigger update_hero_sections_updated_at
before update on public.hero_sections
for each row
execute function public.update_updated_at_column();


create trigger update_carts_updated_at
before update on public.carts
for each row
execute function public.update_updated_at_column();


create trigger update_orders_updated_at
before update on public.orders
for each row
execute function public.update_updated_at_column();


-- ============================================================
-- 18. ORDER NUMBER GENERATOR
-- ============================================================

create or replace function public.generate_order_number()
returns trigger
language plpgsql
as $$
begin
  new.order_number :=
    'GH-' ||
    to_char(now(), 'YYYYMMDD') ||
    '-' ||
    upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  return new;
end;
$$;


create trigger generate_order_number_trigger
before insert on public.orders
for each row
when (new.order_number is null or new.order_number = '')
execute function public.generate_order_number();
