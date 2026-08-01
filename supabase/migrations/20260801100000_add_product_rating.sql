-- ============================================================
-- ADD PRODUCT RATING + REVIEW COUNT
-- ============================================================
-- Lets admins set a product's rating (e.g. 4.8) and review
-- count (e.g. 32) in the product form. The card and related
-- product lists render these values with graceful fallbacks.
-- ============================================================

alter table public.products
  add column if not exists rating numeric(2,1)
    check (rating is null or rating between 0 and 5);

alter table public.products
  add column if not exists review_count integer
    check (review_count is null or review_count >= 0);
