-- 19:38 Jewelry — admin panel schema
-- -----------------------------------------------------------------------
-- Run this once in your Supabase project: open the SQL editor
-- (https://supabase.com/dashboard/project/_/sql/new), paste this whole
-- file, and click "Run". See README.md ("Admin panel & content editing")
-- for the full setup walkthrough, including creating the storage bucket.

-- Albums ---------------------------------------------------------------
-- An admin-managed catalog tag: a jewelry type (Ring, Necklace…) or a
-- marketing collection (Bestseller, New, Sale) — or anything else the
-- admin invents (a seasonal drop, etc). A product can belong to any
-- number of albums at once; see products.albums below and /admin/albums.
create table if not exists albums (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ru text not null default '',
  name_en text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

insert into albums (slug, name_ru, name_en, sort_order) values
  ('ring', 'Кольцо', 'Ring', 0),
  ('necklace', 'Колье', 'Necklace', 1),
  ('earrings', 'Серьги', 'Earrings', 2),
  ('bracelet', 'Браслет', 'Bracelet', 3),
  ('bestseller', 'BESTSELLER', 'BESTSELLER', 4),
  ('new', 'NEW', 'NEW', 5),
  ('sale', 'SALE', 'SALE', 6)
on conflict (slug) do nothing;

-- Products -----------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  piece_number text not null default '',
  price integer not null default 0,
  sale_price integer,
  materials text not null default '',
  size text not null default '',
  availability text not null default 'in_stock',
  personalization text[] not null default '{}',
  bestseller boolean not null default false,
  -- Display badges (ONE OF ONE / LIMITED EDITION / BESTSELLER / NEW / SALE)
  -- — admin multi-select, independent of `albums`. See src/data/badgeTypes.ts.
  badges text[] not null default '{}',
  albums text[] not null default '{}',
  images text[] not null default '{}',
  reviews jsonb not null default '[]',
  name_ru text not null default '',
  name_en text not null default '',
  description_ru text not null default '',
  description_en text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Migrating an existing database that still has the old `type` +
-- `collections` columns (pre-albums)? Run this block once instead of the
-- create-table above (it's a no-op on a fresh project): adds the new
-- `albums` column, backfills it from `type` + `collections`
-- ("signature_piece" renamed to "bestseller"), then drops the old columns.
-- alter table products add column if not exists albums text[] not null default '{}';
-- update products set albums = (
--   select array_agg(distinct x) from unnest(
--     array[type] || array(
--       select case when c = 'signature_piece' then 'bestseller' else c end
--       from unnest(collections) as c
--     )
--   ) as x
-- ) where albums = '{}';
-- alter table products drop column if exists type;
-- alter table products drop column if exists collections;

-- Migrating an existing database that still has the old single-select
-- `edition_type` column (pre-badges)? Run this block once instead of the
-- create-table above (it's a no-op on a fresh project): adds the new
-- `badges` column, backfills it from `edition_type` plus whichever of the
-- reserved bestseller/new/sale albums the product already belonged to
-- (so existing products keep showing the same plashki after the switch —
-- the admin can then pick badges independently of albums going forward),
-- then drops `edition_type`.
-- alter table products add column if not exists badges text[] not null default '{}';
-- update products set badges = (select array_remove(array[case when edition_type = 'one_of_one' then 'one_of_one' end, case when edition_type = 'limited' then 'limited' end, case when 'bestseller' = any(albums) then 'bestseller' end, case when 'new' = any(albums) then 'new' end, case when 'sale' = any(albums) then 'sale' end], null)) where badges = '{}';
-- alter table products drop column if exists edition_type;

-- Editable site text (About, FAQ, Home, Shipping, Returns, Privacy,
-- Contact copy). One row per field per locale; see src/lib/content.ts
-- for the full list of editable keys.
create table if not exists content_blocks (
  key text not null,
  locale text not null,
  value text not null default '',
  updated_at timestamptz not null default now(),
  primary key (key, locale)
);

-- Editable homepage/about-page photos (admin-uploaded, replacing the
-- static /brand/mood-texture.jpg placeholder on a per-section basis).
-- One row per section key — see src/lib/siteImages.ts for the key list.
create table if not exists site_images (
  key text primary key,
  url text not null default '',
  updated_at timestamptz not null default now()
);

-- Keep updated_at current on every edit.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

drop trigger if exists content_blocks_set_updated_at on content_blocks;
create trigger content_blocks_set_updated_at
  before update on content_blocks
  for each row execute function set_updated_at();

drop trigger if exists site_images_set_updated_at on site_images;
create trigger site_images_set_updated_at
  before update on site_images
  for each row execute function set_updated_at();

-- Row Level Security: the site only ever talks to Supabase from the
-- server using the service role key (never from the browser), and /admin
-- is gated by its own password-protected cookie — so we leave RLS off
-- for simplicity. If you later add client-side or anon-key access,
-- enable RLS and add policies before doing so.
alter table products disable row level security;
alter table albums disable row level security;
alter table content_blocks disable row level security;
alter table site_images disable row level security;

-- Storage bucket for product/content photos ---------------------------
-- The SQL editor can't create storage buckets, so do this step in the
-- dashboard instead: Storage -> New bucket -> name it exactly "media" ->
-- toggle "Public bucket" on -> Create bucket. Admin uploads go there and
-- are served from https://<project-ref>.supabase.co/storage/v1/object/public/media/...
