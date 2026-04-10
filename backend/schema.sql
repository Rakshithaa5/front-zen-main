-- Run this in your Supabase SQL editor
-- Copy and paste this entire file into the SQL editor and click "Run"

-- Drop existing tables if they exist (be careful in production!)
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

-- Restaurants table
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

-- Insert sample restaurants
INSERT INTO restaurants (id, name, cuisine, rating, price_range, image, delivery_time, is_veg, address, description) VALUES
('1', 'Spice Garden', '{"Indian", "Spicy"}', 4.5, 2, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600', '25-35 min', false, '123 Main St', 'Authentic Indian cuisine with a modern twist'),
('2', 'Pizza Paradise', '{"Italian", "Pizza"}', 4.2, 2, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600', '20-30 min', false, '456 Oak Ave', 'Wood-fired pizzas and Italian classics'),
('3', 'Green Bowl', '{"Healthy", "Salads", "Light Meals"}', 4.7, 2, 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600', '15-25 min', true, '789 Elm Rd', 'Fresh, healthy bowls and smoothies'),
('4', 'Dragon Wok', '{"Chinese", "Spicy"}', 4.0, 1, 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600', '30-40 min', false, '321 Pine Blvd', 'Fiery Chinese flavors and dim sum'),
('5', 'Burger Barn', '{"Burgers", "Comfort Food"}', 4.3, 1, 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600', '15-25 min', false, '654 Maple St', 'Juicy handcrafted burgers'),
('6', 'Biryani House', '{"Indian", "Biryani"}', 4.6, 2, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600', '35-45 min', false, '987 Cedar Ln', 'Aromatic biryanis made with love'),
('7', 'Sweet Tooth', '{"Desserts", "Ice Cream", "Chocolate"}', 4.8, 2, 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600', '20-30 min', true, '159 Walnut Dr', 'Irresistible desserts and frozen treats'),
('8', 'Soup & Soul', '{"Soups", "Healthy", "Comfort Food"}', 4.4, 1, 'https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=600', '20-30 min', true, '753 Birch Ave', 'Warming soups and wholesome meals'),
('9', 'Taco Tierra', '{"Mexican", "Street Food"}', 4.5, 1, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600', '18-28 min', false, '88 Sunset Blvd', 'Bold tacos, burritos, and fiery salsas'),
('10', 'Sushi Harbor', '{"Japanese", "Sushi"}', 4.9, 3, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600', '25-35 min', false, '14 Harbor Point', 'Fresh rolls, nigiri, and premium sashimi'),
('11', 'Curry Leaf', '{"South Indian", "Vegetarian"}', 4.6, 1, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600', '20-30 min', true, '22 Temple Road', 'Crisp dosas, idlis, and coconut chutneys'),
('12', 'Pho Lotus', '{"Vietnamese", "Noodles"}', 4.4, 2, 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600', '22-32 min', false, '101 Lantern St', 'Fragrant pho, rice bowls, and herb-packed broths'),
('13', 'Mediterraneo', '{"Mediterranean", "Grill"}', 4.7, 2, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600', '25-35 min', true, '77 Olive Ave', 'Grilled plates, mezze, and bright Mediterranean flavors'),
('14', 'Kebab Court', '{"Turkish", "Grill"}', 4.5, 2, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600', '30-40 min', false, '9 Bazaar Lane', 'Charcoal kebabs, wraps, and spiced rice'),
('15', 'Pasta Fresca', '{"Italian", "Pasta"}', 4.6, 2, 'https://images.unsplash.com/photo-1498579150354-2a0bd0d9b1d5?w=600', '20-30 min', true, '44 Via Roma', 'Hand-tossed pasta with rich sauces and herbs'),
('16', 'Nori House', '{"Asian Fusion", "Bowls"}', 4.3, 2, 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600', '25-35 min', false, '310 Pearl Street', 'Rice bowls, poke, and modern Asian comfort food'),
('17', 'Grain & Greens', '{"Salads", "Wellness"}', 4.8, 2, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600', '15-25 min', true, '8 Spruce Court', 'Protein bowls, salads, and clean eating meals'),
('18', 'Waffle Nest', '{"Breakfast", "Desserts"}', 4.7, 1, 'https://images.unsplash.com/photo-1562376552-0d160a2f3b2b?w=600', '15-20 min', true, '50 Morning Dr', 'Fresh waffles, pancakes, and brunch favorites'),
('19', 'Smokehouse 19', '{"BBQ", "American"}', 4.4, 3, 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600', '35-45 min', false, '19 Hickory Rd', 'Slow-smoked meats with bold house-made sauces'),
('20', 'Coconut Coast', '{"Thai", "Curry"}', 4.5, 2, 'https://images.unsplash.com/photo-1559314809-0e4b5a0f1f89?w=600', '25-35 min', false, '6 Beachfront Way', 'Thai curries, noodle dishes, and fragrant basil'),
('21', 'Veggie Vault', '{"Vegan", "Plant Based"}', 4.6, 2, 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600', '18-28 min', true, '72 Willow Way', 'Plant-based burgers, bowls, and dairy-free treats'),
('22', 'Dumpling Den', '{"Chinese", "Dumplings"}', 4.7, 1, 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600', '20-30 min', false, '15 Jade Market', 'Hand-folded dumplings, noodles, and chili oil specials'),
('23', 'Ramen Realm', '{"Japanese", "Ramen"}', 4.8, 2, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600', '30-40 min', false, '12 Sakura Blvd', 'Deep broth ramen, soft eggs, and rich toppings'),
('24', 'Bistro Bloom', '{"French", "Bistro"}', 4.5, 3, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600', '30-40 min', true, '18 Rue Clair', 'Elegant bistro classics with a modern finish'),
('25', 'Roll House', '{"Wraps", "Quick Bites"}', 4.2, 1, 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600', '12-22 min', false, '303 Rapid Ave', 'Fast wraps, rolls, and handheld comfort food'),
('26', 'Cielo Cafe', '{"Cafe", "Pastries"}', 4.4, 2, 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600', '10-20 min', true, '9 Cloud Nine', 'Coffee, pastries, and all-day brunch plates'),
('27', 'Heritage Thali', '{"Indian", "Thali"}', 4.7, 2, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600', '25-35 min', true, '64 Palace Circle', 'Regional thalis with rotating seasonal specialties'),
('28', 'Seoul Street', '{"Korean", "Street Food"}', 4.6, 2, 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=600', '20-30 min', false, '88 Neon Road', 'Korean fried chicken, rice bowls, and spicy noodles'),
('29', 'Falafel Farm', '{"Middle Eastern", "Vegetarian"}', 4.5, 1, 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=600', '18-28 min', true, '41 Oasis Street', 'Falafel, hummus, shawarma wraps, and fresh pita'),
('30', 'Crisp Corner', '{"Fast Food", "Snacks"}', 4.3, 1, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600', '15-25 min', false, '5 Market Square', 'Crowd-pleasing snacks, combos, and shareable bites');

-- Insert sample menu items
INSERT INTO menu_items (id, restaurant_id, name, description, price, category, image, is_veg, is_available) VALUES
('m1', '1', 'Butter Chicken', 'Creamy tomato-based curry with tender chicken', 14.99, 'Indian', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', false, true),
('m2', '1', 'Paneer Tikka', 'Grilled cottage cheese with spices', 12.99, 'Indian', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', true, true),
('m3', '1', 'Garlic Naan', 'Freshly baked bread with garlic', 3.99, 'Breads', 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', true, true),
('m4', '1', 'Chicken Biryani', 'Fragrant rice with spiced chicken', 16.99, 'Biryani', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', false, true),
('m5', '2', 'Margherita Pizza', 'Classic tomato, mozzarella & basil', 12.99, 'Pizza', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', true, true),
('m6', '2', 'Pepperoni Pizza', 'Loaded with pepperoni & cheese', 14.99, 'Pizza', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', false, true),
('m7', '2', 'Garlic Bread', 'Cheesy garlic bread', 5.99, 'Sides', 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400', true, true),
('m8', '3', 'Quinoa Power Bowl', 'Quinoa, avocado, chickpeas & greens', 13.99, 'Salads', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', true, true),
('m9', '3', 'Smoothie Bowl', 'Açaí, banana, granola & berries', 10.99, 'Light Meals', 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', true, true),
('m10', '3', 'Fresh Juice', 'Seasonal fruit cold-pressed juice', 6.99, 'Juices', 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400', true, true),
('m11', '4', 'Kung Pao Chicken', 'Spicy stir-fried chicken with peanuts', 13.99, 'Chinese', 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400', false, true),
('m12', '4', 'Fried Rice', 'Wok-tossed rice with vegetables', 9.99, 'Chinese', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', true, true),
('m13', '5', 'Classic Smash Burger', 'Double patty, cheese, special sauce', 11.99, 'Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', false, true),
('m14', '5', 'Loaded Fries', 'Crispy fries with cheese & bacon', 7.99, 'Sides', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', false, true),
('m15', '6', 'Hyderabadi Biryani', 'Dum-cooked layered biryani', 15.99, 'Biryani', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', false, true),
('m16', '6', 'Combo Meal', 'Biryani + raita + dessert', 19.99, 'Combos', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', false, true),
('m17', '7', 'Chocolate Lava Cake', 'Warm cake with molten chocolate', 8.99, 'Desserts', 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400', true, true),
('m18', '7', 'Ice Cream Sundae', 'Triple scoop with toppings', 7.99, 'Ice Cream', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', true, true),
('m19', '8', 'Tomato Basil Soup', 'Classic creamy tomato soup', 7.99, 'Soups', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', true, true),
('m20', '8', 'Chicken Noodle Soup', 'Hearty chicken soup with noodles', 9.99, 'Soups', 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400', false, true);

-- Create admin user (password: admin123)
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@foodzen.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Enable Row Level Security (optional)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies (uncomment if using RLS)
-- CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
-- CREATE POLICY "Users can read own orders" ON orders FOR SELECT USING (auth.uid()::text = user_id::text);

-- Verify data
SELECT 'Restaurants' as table_name, count(*) as count FROM restaurants
UNION ALL
SELECT 'Menu Items' as table_name, count(*) as count FROM menu_items
UNION ALL
SELECT 'Users' as table_name, count(*) as count FROM users;
