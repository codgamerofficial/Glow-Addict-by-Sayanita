-- Supabase schema for Glow Addict admin
-- Run this in Supabase SQL editor to create required tables

create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  parent_id uuid references categories(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  brand_id uuid references brands(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  sku text,
  barcode text,
  short_description text,
  description text,
  mrp numeric,
  price numeric,
  tax_percent numeric default 0,
  discount_percent numeric default 0,
  stock integer default 0,
  is_featured boolean default false,
  is_trending boolean default false,
  is_best_seller boolean default false,
  is_archived boolean default false,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  url text not null,
  is_primary boolean default false,
  position int default 0,
  created_at timestamptz default now()
);

create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text not null default 'staff', -- super|staff
  created_at timestamptz default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  name text,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  total_amount numeric,
  status text default 'pending',
  placed_at timestamptz default now(),
  metadata jsonb default '{}'::jsonb
);

-- Indexes
create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_brand on products(brand_id);
create index if not exists idx_products_category on products(category_id);

-- RLS / Policies (placeholders - adjust per Supabase project)
-- enable row level security where appropriate and create policies for service role
