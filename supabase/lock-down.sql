-- ============================================================================
-- CLASSIE: lock the database down
--
-- Run this in Supabase → SQL Editor ONLY AFTER:
--   1. SUPABASE_SERVICE_ROLE_KEY and ADMIN_PASSWORD are added in Vercel, and
--   2. the site is redeployed, and
--   3. the yellow "Security setup is not finished" banner is gone in Admin.
--
-- After this, visitors (the public key in the website) can only READ the
-- catalogue/content tables and subscribe to the newsletter. Orders, messages,
-- subscribers, coupon uses and analytics can only be read or changed through
-- the website's server (secret key) and the logged-in Admin.
--
-- Safe to run more than once. If anything breaks, run unlock-emergency.sql.
-- ============================================================================

-- 1. Row Level Security on for every table.
do $$
declare t record;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t.tablename);
  end loop;
end $$;

-- 2. Remove every existing policy (the old ones allowed anyone to write).
do $$
declare p record;
begin
  for p in select tablename, policyname from pg_policies where schemaname = 'public' loop
    execute format('drop policy %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

-- 3. Read-only access for the public website.
do $$
declare t text;
begin
  foreach t in array array[
    'products', 'product_color_variants', 'collections', 'collection_products',
    'blog_posts', 'site_categories', 'site_settings', 'features_bar',
    'style_inspo', 'instagram_images', 'hero_slides', 'testimonials',
    'product_bundle_offers'
  ] loop
    if to_regclass('public.' || t) is not null then
      execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)', t);
    end if;
  end loop;
end $$;

-- Only switched-on coupons (Hot Deals page) and approved reviews are public.
do $$
begin
  if to_regclass('public.coupons') is not null then
    create policy "public read active" on public.coupons for select to anon, authenticated using (active = true);
  end if;
  if to_regclass('public.product_reviews') is not null then
    create policy "public read approved" on public.product_reviews for select to anon, authenticated using (active = true);
  end if;
  -- Newsletter form posts straight from the browser: insert only, no reading.
  if to_regclass('public.newsletter_subscribers') is not null then
    create policy "anyone can subscribe" on public.newsletter_subscribers for insert to anon, authenticated with check (true);
  end if;
end $$;

-- Check: list what is allowed now.
select tablename, policyname, cmd from pg_policies where schemaname = 'public' order by tablename;
