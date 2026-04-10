require('dotenv').config();
const supabase = require('./supabase');
const { buildCatalogMenuItemsForRestaurant } = require('./menuCatalog');

const ADMIN_PASSWORD_HASH = '$2a$10$iCvk4PKnNR/.a4aLFr0fV.C/Vn0oSQc8uM.sUD3YJgV.NHamL6ray';
const OWNER_PASSWORD_HASH = '$2a$10$qTytfi2nvS.fj8C4Uxlb2.PdEZXDsOEL.cWZFbzR.uuzLM36DBPQy';

const restaurants = [
  { id: '1', name: 'Spice Garden', cuisine: ['Indian', 'Spicy'], rating: 4.5, price_range: 2, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600', delivery_time: '25-35 min', is_veg: false, address: '123 Main St', description: 'Authentic Indian cuisine with a modern twist' },
  { id: '2', name: 'Pizza Paradise', cuisine: ['Italian', 'Pizza'], rating: 4.2, price_range: 2, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600', delivery_time: '20-30 min', is_veg: false, address: '456 Oak Ave', description: 'Wood-fired pizzas and Italian classics' },
  { id: '3', name: 'Green Bowl', cuisine: ['Healthy', 'Salads', 'Light Meals'], rating: 4.7, price_range: 2, image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600', delivery_time: '15-25 min', is_veg: true, address: '789 Elm Rd', description: 'Fresh, healthy bowls and smoothies' },
  { id: '4', name: 'Dragon Wok', cuisine: ['Chinese', 'Spicy'], rating: 4.0, price_range: 1, image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600', delivery_time: '30-40 min', is_veg: false, address: '321 Pine Blvd', description: 'Fiery Chinese flavors and dim sum' },
  { id: '5', name: 'Burger Barn', cuisine: ['Burgers', 'Comfort Food'], rating: 4.3, price_range: 1, image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600', delivery_time: '15-25 min', is_veg: false, address: '654 Maple St', description: 'Juicy handcrafted burgers' },
  { id: '6', name: 'Biryani House', cuisine: ['Indian', 'Biryani'], rating: 4.6, price_range: 2, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600', delivery_time: '35-45 min', is_veg: false, address: '987 Cedar Ln', description: 'Aromatic biryanis made with love' },
  { id: '7', name: 'Sweet Tooth', cuisine: ['Desserts', 'Ice Cream', 'Chocolate'], rating: 4.8, price_range: 2, image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600', delivery_time: '20-30 min', is_veg: true, address: '159 Walnut Dr', description: 'Irresistible desserts and frozen treats' },
  { id: '8', name: 'Soup & Soul', cuisine: ['Soups', 'Healthy', 'Comfort Food'], rating: 4.4, price_range: 1, image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=600', delivery_time: '20-30 min', is_veg: true, address: '753 Birch Ave', description: 'Warming soups and wholesome meals' },
  { id: '9', name: 'Taco Tierra', cuisine: ['Mexican', 'Street Food'], rating: 4.5, price_range: 1, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600', delivery_time: '18-28 min', is_veg: false, address: '88 Sunset Blvd', description: 'Bold tacos, burritos, and fiery salsas' },
  { id: '10', name: 'Sushi Harbor', cuisine: ['Japanese', 'Sushi'], rating: 4.9, price_range: 3, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600', delivery_time: '25-35 min', is_veg: false, address: '14 Harbor Point', description: 'Fresh rolls, nigiri, and premium sashimi' },
  { id: '11', name: 'Curry Leaf', cuisine: ['South Indian', 'Vegetarian'], rating: 4.6, price_range: 1, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600', delivery_time: '20-30 min', is_veg: true, address: '22 Temple Road', description: 'Crisp dosas, idlis, and coconut chutneys' },
  { id: '12', name: 'Pho Lotus', cuisine: ['Vietnamese', 'Noodles'], rating: 4.4, price_range: 2, image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600', delivery_time: '22-32 min', is_veg: false, address: '101 Lantern St', description: 'Fragrant pho, rice bowls, and herb-packed broths' },
  { id: '13', name: 'Mediterraneo', cuisine: ['Mediterranean', 'Grill'], rating: 4.7, price_range: 2, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600', delivery_time: '25-35 min', is_veg: true, address: '77 Olive Ave', description: 'Grilled plates, mezze, and bright Mediterranean flavors' },
  { id: '14', name: 'Kebab Court', cuisine: ['Turkish', 'Grill'], rating: 4.5, price_range: 2, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600', delivery_time: '30-40 min', is_veg: false, address: '9 Bazaar Lane', description: 'Charcoal kebabs, wraps, and spiced rice' },
  { id: '15', name: 'Pasta Fresca', cuisine: ['Italian', 'Pasta'], rating: 4.6, price_range: 2, image: 'https://images.unsplash.com/photo-1498579150354-2a0bd0d9b1d5?w=600', delivery_time: '20-30 min', is_veg: true, address: '44 Via Roma', description: 'Hand-tossed pasta with rich sauces and herbs' },
  { id: '16', name: 'Nori House', cuisine: ['Asian Fusion', 'Bowls'], rating: 4.3, price_range: 2, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600', delivery_time: '25-35 min', is_veg: false, address: '310 Pearl Street', description: 'Rice bowls, poke, and modern Asian comfort food' },
  { id: '17', name: 'Grain & Greens', cuisine: ['Salads', 'Wellness'], rating: 4.8, price_range: 2, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600', delivery_time: '15-25 min', is_veg: true, address: '8 Spruce Court', description: 'Protein bowls, salads, and clean eating meals' },
  { id: '18', name: 'Waffle Nest', cuisine: ['Breakfast', 'Desserts'], rating: 4.7, price_range: 1, image: 'https://images.unsplash.com/photo-1513442542250-854d436a73f2?w=600', delivery_time: '15-20 min', is_veg: true, address: '50 Morning Dr', description: 'Fresh waffles, pancakes, and brunch favorites' },
  { id: '19', name: 'Smokehouse 19', cuisine: ['BBQ', 'American'], rating: 4.4, price_range: 3, image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600', delivery_time: '35-45 min', is_veg: false, address: '19 Hickory Rd', description: 'Slow-smoked meats with bold house-made sauces' },
  { id: '20', name: 'Coconut Coast', cuisine: ['Thai', 'Curry'], rating: 4.5, price_range: 2, image: 'https://images.unsplash.com/photo-1559314809-0e4b5a0f1f89?w=600', delivery_time: '25-35 min', is_veg: false, address: '6 Beachfront Way', description: 'Thai curries, noodle dishes, and fragrant basil' },
  { id: '21', name: 'Veggie Vault', cuisine: ['Vegan', 'Plant Based'], rating: 4.6, price_range: 2, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600', delivery_time: '18-28 min', is_veg: true, address: '72 Willow Way', description: 'Plant-based burgers, bowls, and dairy-free treats' },
  { id: '22', name: 'Dumpling Den', cuisine: ['Chinese', 'Dumplings'], rating: 4.7, price_range: 1, image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600', delivery_time: '20-30 min', is_veg: false, address: '15 Jade Market', description: 'Hand-folded dumplings, noodles, and chili oil specials' },
  { id: '23', name: 'Ramen Realm', cuisine: ['Japanese', 'Ramen'], rating: 4.8, price_range: 2, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600', delivery_time: '30-40 min', is_veg: false, address: '12 Sakura Blvd', description: 'Deep broth ramen, soft eggs, and rich toppings' },
  { id: '24', name: 'Bistro Bloom', cuisine: ['French', 'Bistro'], rating: 4.5, price_range: 3, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600', delivery_time: '30-40 min', is_veg: true, address: '18 Rue Clair', description: 'Elegant bistro classics with a modern finish' },
  { id: '25', name: 'Roll House', cuisine: ['Wraps', 'Quick Bites'], rating: 4.2, price_range: 1, image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600', delivery_time: '12-22 min', is_veg: false, address: '303 Rapid Ave', description: 'Fast wraps, rolls, and handheld comfort food' },
  { id: '26', name: 'Cielo Cafe', cuisine: ['Cafe', 'Pastries'], rating: 4.4, price_range: 2, image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600', delivery_time: '10-20 min', is_veg: true, address: '9 Cloud Nine', description: 'Coffee, pastries, and all-day brunch plates' },
  { id: '27', name: 'Heritage Thali', cuisine: ['Indian', 'Thali'], rating: 4.7, price_range: 2, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600', delivery_time: '25-35 min', is_veg: true, address: '64 Palace Circle', description: 'Regional thalis with rotating seasonal specialties' },
  { id: '28', name: 'Seoul Street', cuisine: ['Korean', 'Street Food'], rating: 4.6, price_range: 2, image: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=600', delivery_time: '20-30 min', is_veg: false, address: '88 Neon Road', description: 'Korean fried chicken, rice bowls, and spicy noodles' },
  { id: '29', name: 'Falafel Farm', cuisine: ['Middle Eastern', 'Vegetarian'], rating: 4.5, price_range: 1, image: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=600', delivery_time: '18-28 min', is_veg: true, address: '41 Oasis Street', description: 'Falafel, hummus, shawarma wraps, and fresh pita' },
  { id: '30', name: 'Crisp Corner', cuisine: ['Fast Food', 'Snacks'], rating: 4.3, price_range: 1, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600', delivery_time: '15-25 min', is_veg: false, address: '5 Market Square', description: 'Crowd-pleasing snacks, combos, and shareable bites' },
];

const ownerAccounts = [
  { id: '10000000-0000-0000-0000-000000000001', name: 'Arjun Sharma', email: 'spicegarden@moodbyte.com', restaurantId: '1' },
  { id: '10000000-0000-0000-0000-000000000002', name: 'Marco Rossi', email: 'pizzaparadise@moodbyte.com', restaurantId: '2' },
  { id: '10000000-0000-0000-0000-000000000003', name: 'Priya Nair', email: 'greenbowl@moodbyte.com', restaurantId: '3' },
  { id: '10000000-0000-0000-0000-000000000004', name: 'Wei Chen', email: 'dragonwok@moodbyte.com', restaurantId: '4' },
  { id: '10000000-0000-0000-0000-000000000005', name: 'Jake Miller', email: 'burgerbarn@moodbyte.com', restaurantId: '5' },
  { id: '10000000-0000-0000-0000-000000000006', name: 'Raza Khan', email: 'biryanihouse@moodbyte.com', restaurantId: '6' },
  { id: '10000000-0000-0000-0000-000000000007', name: 'Meera Patel', email: 'sweettooth@moodbyte.com', restaurantId: '7' },
  { id: '10000000-0000-0000-0000-000000000008', name: 'Linda Brooks', email: 'soulandsoul@moodbyte.com', restaurantId: '8' },
  { id: '10000000-0000-0000-0000-000000000009', name: 'Carlos Mendez', email: 'tacotierra@moodbyte.com', restaurantId: '9' },
  { id: '10000000-0000-0000-0000-000000000010', name: 'Kenji Tanaka', email: 'sushiharbor@moodbyte.com', restaurantId: '10' },
  { id: '10000000-0000-0000-0000-000000000011', name: 'Lakshmi Iyer', email: 'curryleaf@moodbyte.com', restaurantId: '11' },
  { id: '10000000-0000-0000-0000-000000000012', name: 'Linh Nguyen', email: 'pholotus@moodbyte.com', restaurantId: '12' },
  { id: '10000000-0000-0000-0000-000000000013', name: 'Nikos Papadopoulos', email: 'mediterraneo@moodbyte.com', restaurantId: '13' },
  { id: '10000000-0000-0000-0000-000000000014', name: 'Ahmet Yilmaz', email: 'kebabcourt@moodbyte.com', restaurantId: '14' },
  { id: '10000000-0000-0000-0000-000000000015', name: 'Sofia Conti', email: 'pastafresca@moodbyte.com', restaurantId: '15' },
  { id: '10000000-0000-0000-0000-000000000016', name: 'Hana Kim', email: 'norihouse@moodbyte.com', restaurantId: '16' },
  { id: '10000000-0000-0000-0000-000000000017', name: 'Emma Walsh', email: 'graingreens@moodbyte.com', restaurantId: '17' },
  { id: '10000000-0000-0000-0000-000000000018', name: 'Tom Baker', email: 'wafflenest@moodbyte.com', restaurantId: '18' },
  { id: '10000000-0000-0000-0000-000000000019', name: 'Ray Thompson', email: 'smokehouse19@moodbyte.com', restaurantId: '19' },
  { id: '10000000-0000-0000-0000-000000000020', name: 'Nong Srisuk', email: 'coconutcoast@moodbyte.com', restaurantId: '20' },
  { id: '10000000-0000-0000-0000-000000000021', name: 'Zoe Green', email: 'veggievault@moodbyte.com', restaurantId: '21' },
  { id: '10000000-0000-0000-0000-000000000022', name: 'Fang Liu', email: 'dumplingden@moodbyte.com', restaurantId: '22' },
  { id: '10000000-0000-0000-0000-000000000023', name: 'Yuki Sato', email: 'ramenrealm@moodbyte.com', restaurantId: '23' },
  { id: '10000000-0000-0000-0000-000000000024', name: 'Pierre Dubois', email: 'bistrobloom@moodbyte.com', restaurantId: '24' },
  { id: '10000000-0000-0000-0000-000000000025', name: 'Sam Patel', email: 'rollhouse@moodbyte.com', restaurantId: '25' },
  { id: '10000000-0000-0000-0000-000000000026', name: 'Ana Flores', email: 'cielocafe@moodbyte.com', restaurantId: '26' },
  { id: '10000000-0000-0000-0000-000000000027', name: 'Vikram Rao', email: 'heritagethali@moodbyte.com', restaurantId: '27' },
  { id: '10000000-0000-0000-0000-000000000028', name: 'Ji-ho Park', email: 'seoulstreet@moodbyte.com', restaurantId: '28' },
  { id: '10000000-0000-0000-0000-000000000029', name: 'Omar Hassan', email: 'falafelfarm@moodbyte.com', restaurantId: '29' },
  { id: '10000000-0000-0000-0000-000000000030', name: 'Nina Cruz', email: 'crispcorner@moodbyte.com', restaurantId: '30' },
];

const users = [
  { id: '00000000-0000-0000-0000-000000000001', name: 'Platform Admin', email: 'admin@moodbyte.com', password_hash: ADMIN_PASSWORD_HASH, role: 'admin' },
  ...ownerAccounts.map(owner => ({
    id: owner.id,
    name: owner.name,
    email: owner.email,
    password_hash: OWNER_PASSWORD_HASH,
    role: 'restaurant_owner',
  })),
];
const restaurantsWithOwners = restaurants.map(restaurant => {
  const owner = ownerAccounts.find(account => account.restaurantId === restaurant.id);
  return {
    ...restaurant,
    owner_id: owner?.id || null,
    verification_doc: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    is_verified: true,
    verified_at: new Date().toISOString(),
  };
});

const menuBlueprints = [
  { category: 'Beverages', name: 'Sparkling Water', description: 'Chilled sparkling water with a clean finish', price: 2.99, image: 'https://images.unsplash.com/photo-1527761939622-911909463d49?w=400', isVeg: true },
  { category: 'Beverages', name: 'Fresh Lime Soda', description: 'Refreshing lime soda with a bright citrus kick', price: 3.49, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400', isVeg: true },
  { category: 'Beverages', name: 'Mango Smoothie', description: 'Creamy tropical smoothie blended fresh', price: 4.99, image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400', isVeg: true },
  { category: 'Beverages', name: 'Cold Brew Coffee', description: 'Smooth cold brew served over ice', price: 4.49, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', isVeg: true },
  { category: 'Beverages', name: 'Masala Chai', description: 'Spiced tea simmered the classic way', price: 2.49, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400', isVeg: true },
  { category: 'Soups', name: 'Tomato Basil Soup', description: 'Velvety tomato soup with basil oil', price: 5.99, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', isVeg: true },
  { category: 'Salads', name: 'Garden Salad', description: 'Fresh greens with crunchy vegetables', price: 6.99, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', isVeg: true },
  { category: 'Sides', name: 'Garlic Bread', description: 'Toasted garlic bread with herb butter', price: 4.99, image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400', isVeg: true },
  { category: 'Starters', name: 'Veg Spring Rolls', description: 'Crispy rolls with a savory filling', price: 5.49, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400', isVeg: true },
  { category: 'Pizza', name: 'Classic Margherita Pizza', description: 'Tomato, mozzarella, and basil on a crisp base', price: 12.99, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', isVeg: true },
  { category: 'Pizza', name: 'Pepperoni Pizza', description: 'Loaded with pepperoni and melted cheese', price: 14.99, image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=400', isVeg: false },
  { category: 'Pasta', name: 'Creamy Alfredo Pasta', description: 'Rich cream sauce with parmesan and herbs', price: 11.99, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400', isVeg: true },
  { category: 'Pasta', name: 'Spicy Arrabbiata Pasta', description: 'Tomato-chili sauce with a sharp bite', price: 11.49, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400', isVeg: true },
  { category: 'Pasta', name: 'Pesto Penne Pasta', description: 'Herby basil pesto with roasted vegetables', price: 12.49, image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400', isVeg: true },
  { category: 'Burgers', name: 'Crispy Veg Burger', description: 'Golden patty with fresh lettuce and sauce', price: 8.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', isVeg: true },
  { category: 'Burgers', name: 'Chicken Burger', description: 'Juicy grilled chicken with signature mayo', price: 9.99, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400', isVeg: false },
  { category: 'Wraps', name: 'Paneer Wrap', description: 'Spiced paneer with veggies rolled in flatbread', price: 8.49, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400', isVeg: true },
  { category: 'Wraps', name: 'Chicken Wrap', description: 'Tender chicken wrapped with crisp salad', price: 9.49, image: 'https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=400', isVeg: false },
  { category: 'Mexican', name: 'Street Tacos', description: 'Soft tacos with bold spices and salsa', price: 8.99, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', isVeg: false },
  { category: 'Bowls', name: 'Burrito Bowl', description: 'Rice, beans, salsa, and fresh toppings', price: 10.49, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400', isVeg: true },
  { category: 'Rice', name: 'Fried Rice', description: 'Wok-tossed rice with vegetables and aromatics', price: 8.99, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', isVeg: true },
  { category: 'Noodles', name: 'Hakka Noodles', description: 'Saucy noodles tossed with crunchy vegetables', price: 9.49, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400', isVeg: true },
  { category: 'Curry', name: 'Butter Curry Bowl', description: 'Creamy curry served with rice or bread', price: 12.99, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', isVeg: false },
  { category: 'Biryani', name: 'Hyderabadi Biryani', description: 'Aromatic layered biryani with spices', price: 13.99, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', isVeg: false },
  { category: 'Grill', name: 'Grilled Skewers', description: 'Chargrilled skewers with smoky seasoning', price: 10.99, image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400', isVeg: false },
  { category: 'Combos', name: 'Signature Combo Meal', description: 'Main, side, and drink bundled together', price: 14.99, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', isVeg: false },
  { category: 'Breakfast', name: 'Waffle Stack', description: 'Golden waffles with syrup and berries', price: 7.99, image: 'https://images.unsplash.com/photo-1513442542250-854d436a73f2?w=400', isVeg: true },
  { category: 'Desserts', name: 'Chocolate Brownie', description: 'Warm brownie with a fudgy center', price: 6.99, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', isVeg: true },
  { category: 'Desserts', name: 'Cheesecake Slice', description: 'Smooth cheesecake with a buttery base', price: 6.49, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', isVeg: true },
  { category: 'Desserts', name: 'Ice Cream Sundae', description: 'Scoops topped with sauce and nuts', price: 5.99, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', isVeg: true },
];

const restaurantThemeLabels = {
  indian: 'Indian',
  italian: 'Italian',
  healthy: 'Healthy',
  chinese: 'Chinese',
  burgers: 'American',
  biryani: 'Indian',
  desserts: 'Desserts',
  soups: 'Comfort',
  mexican: 'Mexican',
  japanese: 'Japanese',
  southindian: 'South Indian',
  vietnamese: 'Vietnamese',
  mediterranean: 'Mediterranean',
  turkish: 'Turkish',
  pasta: 'Italian',
  asianfusion: 'Asian Fusion',
  breakfast: 'Breakfast',
  bbq: 'BBQ',
  thai: 'Thai',
  vegan: 'Vegan',
  dumplings: 'Chinese',
  ramen: 'Japanese',
  french: 'French',
  wraps: 'Cafe',
  cafe: 'Cafe',
  heritage: 'Indian',
  korean: 'Korean',
  falafel: 'Middle Eastern',
  fastfood: 'Fast Food',
};

function getThemeKey(restaurant) {
  const text = `${restaurant.name} ${restaurant.cuisine.join(' ')}`.toLowerCase().replace(/[^a-z]/g, '');
  if (text.includes('southindian')) return 'southindian';
  if (text.includes('middleeastern')) return 'falafel';
  if (text.includes('asianfusion')) return 'asianfusion';
  if (text.includes('fastfood')) return 'fastfood';
  if (text.includes('restaurant')) return 'cafe';
  if (text.includes('pizza') || text.includes('italian')) return 'italian';
  if (text.includes('indian') && !text.includes('southindian')) return 'indian';
  if (text.includes('healthy') || text.includes('salad') || text.includes('vegan')) return 'healthy';
  if (text.includes('chinese')) return 'chinese';
  if (text.includes('burger')) return 'burgers';
  if (text.includes('biryani')) return 'biryani';
  if (text.includes('dessert')) return 'desserts';
  if (text.includes('soup')) return 'soups';
  if (text.includes('mexican')) return 'mexican';
  if (text.includes('japanese')) return 'japanese';
  if (text.includes('vietnamese')) return 'vietnamese';
  if (text.includes('mediterranean')) return 'mediterranean';
  if (text.includes('turkish')) return 'turkish';
  if (text.includes('pasta')) return 'pasta';
  if (text.includes('breakfast')) return 'breakfast';
  if (text.includes('bbq')) return 'bbq';
  if (text.includes('thai')) return 'thai';
  if (text.includes('korean')) return 'korean';
  if (text.includes('cafe') || text.includes('pastry')) return 'cafe';
  if (text.includes('wrap')) return 'wraps';
  if (text.includes('dumpling')) return 'dumplings';
  if (text.includes('ramen')) return 'ramen';
  if (text.includes('french') || text.includes('bistro')) return 'french';
  if (text.includes('falafel') || text.includes('middleeastern')) return 'falafel';
  return 'cafe';
}

function getMenuItemImage(restaurant, item, index) {
  const categoryImages = {
    Beverages: [
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800',
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800',
    ],
    Soups: ['https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800'],
    Salads: ['https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800'],
    Sides: ['https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=800'],
    Starters: ['https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800'],
    Pizza: [
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
      'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800',
    ],
    Pasta: [
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800',
    ],
    Burgers: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
      'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
    ],
    Wraps: ['https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=800'],
    Mexican: ['https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800'],
    Bowls: ['https://images.unsplash.com/photo-1547592180-85f173990554?w=800'],
    Rice: ['https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800'],
    Noodles: ['https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800'],
    Curry: ['https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800'],
    Biryani: ['https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800'],
    Grill: ['https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800'],
    Combos: ['https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800'],
    Breakfast: ['https://images.unsplash.com/photo-1513442542250-854d436a73f2?w=800'],
    Desserts: [
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800',
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800',
    ],
  };

  const fallback = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800';
  const options = categoryImages[item.category] || [item.image || fallback];
  const pick = (Number(restaurant.id) + index) % options.length;
  return options[pick] || fallback;
}

function buildMenuItemsForRestaurant(restaurant) {
  const priceBoost = restaurant.price_range === 3 ? 2 : restaurant.price_range === 2 ? 1 : 0;

  return menuBlueprints.map((item, index) => ({
    id: `m${restaurant.id}-${String(index + 1).padStart(2, '0')}`,
    restaurant_id: restaurant.id,
    name: item.name,
    description: `${item.description} served fresh at ${restaurant.name}`,
    price: Number(((item.price + priceBoost) * 100).toFixed(2)),
    category: item.category,
    image: getMenuItemImage(restaurant, item, index),
    is_veg: item.isVeg,
    is_available: true,
  }));
}

const menuItems = restaurants.flatMap((restaurant) => {
  const fromCatalog = buildCatalogMenuItemsForRestaurant(restaurant, restaurant.price_range);
  if (fromCatalog.length > 0) {
    return fromCatalog;
  }
  return buildMenuItemsForRestaurant(restaurant);
});

async function seed() {
  console.log('Seeding users...');
  const { error: uErr } = await supabase.from('users').upsert(users);
  if (uErr) { console.error('Users error:', uErr.message); process.exit(1); }

  console.log('Seeding restaurants...');
  let { error: rErr } = await supabase.from('restaurants').upsert(restaurantsWithOwners);
  if (rErr?.message?.includes("'owner_id' column")) {
    console.warn('owner_id column missing on restaurants table, using compatibility mode');
    ({ error: rErr } = await supabase.from('restaurants').upsert(restaurants));
  }
  if (rErr) { console.error('Restaurants error:', rErr.message); process.exit(1); }

  console.log('Seeding menu items...');
  const { error: clearErr } = await supabase.from('menu_items').delete().neq('id', '__seed_placeholder__');
  if (clearErr) { console.error('Menu reset error:', clearErr.message); process.exit(1); }
  const { error: mErr } = await supabase.from('menu_items').upsert(menuItems);
  if (mErr) { console.error('Menu items error:', mErr.message); process.exit(1); }

  console.log('Seed complete!');
}

seed();
