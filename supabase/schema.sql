-- 19:38 Jewelry — admin panel schema
-- -----------------------------------------------------------------------
-- Run this once in your Supabase project: open the SQL editor
-- (https://supabase.com/dashboard/project/_/sql/new), paste this whole
-- file, and click "Run". See README.md ("Admin panel & content editing")
-- for the full setup walkthrough, including creating the storage bucket.

-- Products -----------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  piece_number text not null default '',
  price integer not null default 0,
  type text not null default 'ring',
  materials text[] not null default '{}',
  availability text not null default 'in_stock',
  personalization text[] not null default '{}',
  bestseller boolean not null default false,
  images text[] not null default '{}',
  reviews jsonb not null default '[]',
  name_ru text not null default '',
  name_en text not null default '',
  short_description_ru text not null default '',
  short_description_en text not null default '',
  description_ru text not null default '',
  description_en text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

-- Row Level Security: the site only ever talks to Supabase from the
-- server using the service role key (never from the browser), and /admin
-- is gated by its own password-protected cookie — so we leave RLS off
-- for simplicity. If you later add client-side or anon-key access,
-- enable RLS and add policies before doing so.
alter table products disable row level security;
alter table content_blocks disable row level security;

-- Storage bucket for product/content photos ---------------------------
-- The SQL editor can't create storage buckets, so do this step in the
-- dashboard instead: Storage -> New bucket -> name it exactly "media" ->
-- toggle "Public bucket" on -> Create bucket. Admin uploads go there and
-- are served from https://<project-ref>.supabase.co/storage/v1/object/public/media/...
