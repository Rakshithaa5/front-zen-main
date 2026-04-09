-- Run this in your Supabase SQL editor

-- Users table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  role text not null default 'customer' check (role in ('customer', 'restaurant_owner', 'admin')),
  created_at timestamptz default now()
);

-- Restaurants table
create table if not exists restaurants (
  id text primary key,
  name text not null,
  cuisine text[] not null default '{}',
  rating numeric(2,1) default 0,
  price_range int check (price_range in (1, 2, 3)),
  image text,
  delivery_time text,
  is_veg boolean default false,
  address text,
  description text,
  created_at timestamptz default now()
);

-- Menu items table
create table if not exists menu_items (
  id text primary key,
  restaurant_id text references restaurants(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null,
  category text,
  image text,
  is_veg boolean default false,
  is_available boolean default true,
  created_at timestamptz default now()
);

-- Orders table
create table if not exists orders (
  id text primary key default 'ORD-' || upper(substring(gen_random_uuid()::text, 1, 8)),
  user_id uuid references users(id) on delete set null,
  restaurant_id text references restaurants(id) on delete set null,
  restaurant_name text,
  items jsonb not null default '[]',
  total numeric(10,2) not null,
  status text not null default 'placed'
    check (status in ('placed', 'accepted', 'preparing', 'out_for_delivery', 'delivered')),
  payment_method text,
  transaction_id text,
  delivery_address text,
  created_at timestamptz default now()
);

-- Row Level Security (optional but recommended)
alter table users enable row level security;
alter table orders enable row level security;

-- Allow users to read their own data
create policy "Users can read own profile" on users for select using (auth.uid()::text = id::text);

-- Allow users to read their own orders
create policy "Users can read own orders" on orders for select using (auth.uid()::text = user_id::text);

-- Seed restaurants (paste your data here or use the seed script)
