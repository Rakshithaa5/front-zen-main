-- Run this entire file in Supabase SQL Editor

DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'restaurant_owner', 'admin')),
  created_at timestamptz DEFAULT now()
);

-- Restaurants table (owner_id links to users)
CREATE TABLE restaurants (
  id text PRIMARY KEY,
  name text NOT NULL,
  cuisine text[] NOT NULL DEFAULT '{}',
  rating numeric(2,1) DEFAULT 0,
  price_range int CHECK (price_range IN (1, 2, 3)),
  image text,
  delivery_time text,
  is_veg boolean DEFAULT false,
  address text,
  description text,
  owner_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Menu items table
CREATE TABLE menu_items (
  id text PRIMARY KEY,
  restaurant_id text REFERENCES restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  category text,
  image text,
  is_veg boolean DEFAULT false,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE orders (
  id text PRIMARY KEY DEFAULT 'ORD-' || upper(substring(gen_random_uuid()::text, 1, 8)),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  restaurant_id text REFERENCES restaurants(id) ON DELETE SET NULL,
  restaurant_name text,
  items jsonb NOT NULL DEFAULT '[]',
  total numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'placed'
    CHECK (status IN ('placed', 'accepted', 'preparing', 'out_for_delivery', 'delivered')),
  payment_method text,
  transaction_id text,
  delivery_address text,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- ADMIN (password: Admin@123)
-- ============================================================
INSERT INTO users (id, name, email, password_hash, role) VALUES
('00000000-0000-0000-0000-000000000001', 'Platform Admin', 'admin@moodbyte.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'admin');

-- ============================================================
-- RESTAURANT OWNER ACCOUNTS  (password for all: Owner@123)
-- ============================================================
INSERT INTO users (id, name, email, password_hash, role) VALUES
('10000000-0000-0000-0000-000000000001', 'Arjun Sharma',      'owner.spicegarden@moodbyte.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000002', 'Marco Rossi',       'owner.pizzaparadise@moodbyte.com',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000003', 'Priya Nair',        'owner.greenbowl@moodbyte.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000004', 'Wei Chen',          'owner.dragonwok@moodbyte.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000005', 'Jake Miller',       'owner.burgerbarn@moodbyte.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000006', 'Raza Khan',         'owner.biryanihouse@moodbyte.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000007', 'Meera Patel',       'owner.sweettooth@moodbyte.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000008', 'Linda Brooks',      'owner.soulandsoul@moodbyte.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000009', 'Carlos Mendez',     'owner.tacotierra@moodbyte.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000010', 'Kenji Tanaka',      'owner.sushiharbor@moodbyte.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000011', 'Lakshmi Iyer',      'owner.curryleaf@moodbyte.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000012', 'Linh Nguyen',       'owner.pholotus@moodbyte.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000013', 'Nikos Papadopoulos','owner.mediterraneo@moodbyte.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000014', 'Ahmet Yilmaz',      'owner.kebabcourt@moodbyte.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000015', 'Sofia Conti',       'owner.pastafresca@moodbyte.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000016', 'Hana Kim',          'owner.norihouse@moodbyte.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000017', 'Emma Walsh',        'owner.graingreens@moodbyte.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000018', 'Tom Baker',         'owner.wafflenest@moodbyte.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000019', 'Ray Thompson',      'owner.smokehouse19@moodbyte.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000020', 'Nong Srisuk',       'owner.coconutcoast@moodbyte.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000021', 'Zoe Green',         'owner.veggievault@moodbyte.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000022', 'Fang Liu',          'owner.dumplingden@moodbyte.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000023', 'Yuki Sato',         'owner.ramenrealm@moodbyte.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000024', 'Pierre Dubois',     'owner.bistroBloom@moodbyte.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000025', 'Sam Patel',         'owner.rollhouse@moodbyte.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000026', 'Ana Flores',        'owner.cielocafe@moodbyte.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000027', 'Vikram Rao',        'owner.heritagethali@moodbyte.com',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000028', 'Ji-ho Park',        'owner.seoulstreet@moodbyte.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000029', 'Omar Hassan',       'owner.falafelfarm@moodbyte.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner'),
('10000000-0000-0000-0000-000000000030', 'Nina Cruz',         'owner.crispcorner@moodbyte.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lniS', 'restaurant_owner');

-- ============================================================
-- RESTAURANTS (with owner_id linked)
-- ============================================================
INSERT INTO restaurants (id, name, cuisine, rating, price_range, image, delivery_time, is_veg, address, description, owner_id) VALUES
('1',  'Spice Garden',    '{Indian,Spicy}',                    4.5, 2, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600', '25-35 min', false, '123 Main St',       'Authentic Indian cuisine with a modern twist',          '10000000-0000-0000-0000-000000000001'),
('2',  'Pizza Paradise',  '{Italian,Pizza}',                   4.2, 2, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600', '20-30 min', false, '456 Oak Ave',       'Wood-fired pizzas and Italian classics',                '10000000-0000-0000-0000-000000000002'),
('3',  'Green Bowl',      '{Healthy,Salads,"Light Meals"}',    4.7, 2, 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600', '15-25 min', true,  '789 Elm Rd',        'Fresh, healthy bowls and smoothies',                   '10000000-0000-0000-0000-000000000003'),
('4',  'Dragon Wok',      '{Chinese,Spicy}',                   4.0, 1, 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600', '30-40 min', false, '321 Pine Blvd',     'Fiery Chinese flavors and dim sum',                     '10000000-0000-0000-0000-000000000004'),
('5',  'Burger Barn',     '{Burgers,"Comfort Food"}',          4.3, 1, 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600', '15-25 min', false, '654 Maple St',      'Juicy handcrafted burgers',                             '10000000-0000-0000-0000-000000000005'),
('6',  'Biryani House',   '{Indian,Biryani}',                  4.6, 2, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600', '35-45 min', false, '987 Cedar Ln',      'Aromatic biryanis made with love',                      '10000000-0000-0000-0000-000000000006'),
('7',  'Sweet Tooth',     '{Desserts,"Ice Cream",Chocolate}',  4.8, 2, 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600', '20-30 min', true,  '159 Walnut Dr',     'Irresistible desserts and frozen treats',               '10000000-0000-0000-0000-000000000007'),
('8',  'Soup & Soul',     '{Soups,Healthy,"Comfort Food"}',    4.4, 1, 'https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=600', '20-30 min', true,  '753 Birch Ave',     'Warming soups and wholesome meals',                     '10000000-0000-0000-0000-000000000008'),
('9',  'Taco Tierra',     '{Mexican,"Street Food"}',           4.5, 1, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600', '18-28 min', false, '88 Sunset Blvd',    'Bold tacos, burritos, and fiery salsas',                '10000000-0000-0000-0000-000000000009'),
('10', 'Sushi Harbor',    '{Japanese,Sushi}',                  4.9, 3, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600', '25-35 min', false, '14 Harbor Point',   'Fresh rolls, nigiri, and premium sashimi',              '10000000-0000-0000-0000-000000000010'),
('11', 'Curry Leaf',      '{"South Indian",Vegetarian}',       4.6, 1, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600', '20-30 min', true,  '22 Temple Road',    'Crisp dosas, idlis, and coconut chutneys',              '10000000-0000-0000-0000-000000000011'),
('12', 'Pho Lotus',       '{Vietnamese,Noodles}',              4.4, 2, 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600', '22-32 min', false, '101 Lantern St',    'Fragrant pho, rice bowls, and herb-packed broths',      '10000000-0000-0000-0000-000000000012'),
('13', 'Mediterraneo',    '{Mediterranean,Grill}',             4.7, 2, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600', '25-35 min', true,  '77 Olive Ave',      'Grilled plates, mezze, and bright Mediterranean flavors','10000000-0000-0000-0000-000000000013'),
('14', 'Kebab Court',     '{Turkish,Grill}',                   4.5, 2, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600', '30-40 min', false, '9 Bazaar Lane',     'Charcoal kebabs, wraps, and spiced rice',               '10000000-0000-0000-0000-000000000014'),
('15', 'Pasta Fresca',    '{Italian,Pasta}',                   4.6, 2, 'https://images.unsplash.com/photo-1498579150354-2a0bd0d9b1d5?w=600', '20-30 min', true,  '44 Via Roma',       'Hand-tossed pasta with rich sauces and herbs',          '10000000-0000-0000-0000-000000000015'),
('16', 'Nori House',      '{"Asian Fusion",Bowls}',            4.3, 2, 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600', '25-35 min', false, '310 Pearl Street',  'Rice bowls, poke, and modern Asian comfort food',       '10000000-0000-0000-0000-000000000016'),
('17', 'Grain & Greens',  '{Salads,Wellness}',                 4.8, 2, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600', '15-25 min', true,  '8 Spruce Court',    'Protein bowls, salads, and clean eating meals',         '10000000-0000-0000-0000-000000000017'),
('18', 'Waffle Nest',     '{Breakfast,Desserts}',              4.7, 1, 'https://images.unsplash.com/photo-1562376552-0d160a2f3b2b?w=600', '15-20 min', true,  '50 Morning Dr',     'Fresh waffles, pancakes, and brunch favorites',         '10000000-0000-0000-0000-000000000018'),
('19', 'Smokehouse 19',   '{BBQ,American}',                    4.4, 3, 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600', '35-45 min', false, '19 Hickory Rd',     'Slow-smoked meats with bold house-made sauces',         '10000000-0000-0000-0000-000000000019'),
('20', 'Coconut Coast',   '{Thai,Curry}',                      4.5, 2, 'https://images.unsplash.com/photo-1559314809-0e4b5a0f1f89?w=600', '25-35 min', false, '6 Beachfront Way',  'Thai curries, noodle dishes, and fragrant basil',       '10000000-0000-0000-0000-000000000020'),
('21', 'Veggie Vault',    '{Vegan,"Plant Based"}',             4.6, 2, 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600', '18-28 min', true,  '72 Willow Way',     'Plant-based burgers, bowls, and dairy-free treats',     '10000000-0000-0000-0000-000000000021'),
('22', 'Dumpling Den',    '{Chinese,Dumplings}',               4.7, 1, 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600', '20-30 min', false, '15 Jade Market',    'Hand-folded dumplings, noodles, and chili oil specials','10000000-0000-0000-0000-000000000022'),
('23', 'Ramen Realm',     '{Japanese,Ramen}',                  4.8, 2, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600', '30-40 min', false, '12 Sakura Blvd',    'Deep broth ramen, soft eggs, and rich toppings',        '10000000-0000-0000-0000-000000000023'),
('24', 'Bistro Bloom',    '{French,Bistro}',                   4.5, 3, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600', '30-40 min', true,  '18 Rue Clair',      'Elegant bistro classics with a modern finish',          '10000000-0000-0000-0000-000000000024'),
('25', 'Roll House',      '{Wraps,"Quick Bites"}',             4.2, 1, 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600', '12-22 min', false, '303 Rapid Ave',     'Fast wraps, rolls, and handheld comfort food',          '10000000-0000-0000-0000-000000000025'),
('26', 'Cielo Cafe',      '{Cafe,Pastries}',                   4.4, 2, 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600', '10-20 min', true,  '9 Cloud Nine',      'Coffee, pastries, and all-day brunch plates',           '10000000-0000-0000-0000-000000000026'),
('27', 'Heritage Thali',  '{Indian,Thali}',                    4.7, 2, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600', '25-35 min', true,  '64 Palace Circle',  'Regional thalis with rotating seasonal specialties',    '10000000-0000-0000-0000-000000000027'),
('28', 'Seoul Street',    '{Korean,"Street Food"}',            4.6, 2, 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=600', '20-30 min', false, '88 Neon Road',      'Korean fried chicken, rice bowls, and spicy noodles',   '10000000-0000-0000-0000-000000000028'),
('29', 'Falafel Farm',    '{"Middle Eastern",Vegetarian}',     4.5, 1, 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=600', '18-28 min', true,  '41 Oasis Street',   'Falafel, hummus, shawarma wraps, and fresh pita',       '10000000-0000-0000-0000-000000000029'),
('30', 'Crisp Corner',    '{"Fast Food",Snacks}',              4.3, 1, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600', '15-25 min', false, '5 Market Square',   'Crowd-pleasing snacks, combos, and shareable bites',    '10000000-0000-0000-0000-000000000030');

-- Verify
SELECT 'Users' as tbl, count(*) FROM users
UNION ALL SELECT 'Restaurants', count(*) FROM restaurants;
