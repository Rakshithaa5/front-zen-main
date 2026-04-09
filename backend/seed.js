require('dotenv').config();
const supabase = require('./supabase');

const restaurants = [
  { id: '1', name: 'Spice Garden', cuisine: ['Indian', 'Spicy'], rating: 4.5, price_range: 2, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600', delivery_time: '25-35 min', is_veg: false, address: '123 Main St', description: 'Authentic Indian cuisine with a modern twist' },
  { id: '2', name: 'Pizza Paradise', cuisine: ['Italian', 'Pizza'], rating: 4.2, price_range: 2, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600', delivery_time: '20-30 min', is_veg: false, address: '456 Oak Ave', description: 'Wood-fired pizzas and Italian classics' },
  { id: '3', name: 'Green Bowl', cuisine: ['Healthy', 'Salads', 'Light Meals'], rating: 4.7, price_range: 2, image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600', delivery_time: '15-25 min', is_veg: true, address: '789 Elm Rd', description: 'Fresh, healthy bowls and smoothies' },
  { id: '4', name: 'Dragon Wok', cuisine: ['Chinese', 'Spicy'], rating: 4.0, price_range: 1, image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600', delivery_time: '30-40 min', is_veg: false, address: '321 Pine Blvd', description: 'Fiery Chinese flavors and dim sum' },
  { id: '5', name: 'Burger Barn', cuisine: ['Burgers', 'Comfort Food'], rating: 4.3, price_range: 1, image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600', delivery_time: '15-25 min', is_veg: false, address: '654 Maple St', description: 'Juicy handcrafted burgers' },
  { id: '6', name: 'Biryani House', cuisine: ['Indian', 'Biryani'], rating: 4.6, price_range: 2, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600', delivery_time: '35-45 min', is_veg: false, address: '987 Cedar Ln', description: 'Aromatic biryanis made with love' },
  { id: '7', name: 'Sweet Tooth', cuisine: ['Desserts', 'Ice Cream', 'Chocolate'], rating: 4.8, price_range: 2, image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600', delivery_time: '20-30 min', is_veg: true, address: '159 Walnut Dr', description: 'Irresistible desserts and frozen treats' },
  { id: '8', name: 'Soup & Soul', cuisine: ['Soups', 'Healthy', 'Comfort Food'], rating: 4.4, price_range: 1, image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=600', delivery_time: '20-30 min', is_veg: true, address: '753 Birch Ave', description: 'Warming soups and wholesome meals' },
];

const menuItems = [
  { id: 'm1', restaurant_id: '1', name: 'Butter Chicken', description: 'Creamy tomato-based curry with tender chicken', price: 14.99, category: 'Indian', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', is_veg: false, is_available: true },
  { id: 'm2', restaurant_id: '1', name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', price: 12.99, category: 'Indian', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', is_veg: true, is_available: true },
  { id: 'm3', restaurant_id: '1', name: 'Garlic Naan', description: 'Freshly baked bread with garlic', price: 3.99, category: 'Breads', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', is_veg: true, is_available: true },
  { id: 'm4', restaurant_id: '1', name: 'Chicken Biryani', description: 'Fragrant rice with spiced chicken', price: 16.99, category: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', is_veg: false, is_available: true },
  { id: 'm5', restaurant_id: '2', name: 'Margherita Pizza', description: 'Classic tomato, mozzarella & basil', price: 12.99, category: 'Pizza', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', is_veg: true, is_available: true },
  { id: 'm6', restaurant_id: '2', name: 'Pepperoni Pizza', description: 'Loaded with pepperoni & cheese', price: 14.99, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', is_veg: false, is_available: true },
  { id: 'm7', restaurant_id: '2', name: 'Garlic Bread', description: 'Cheesy garlic bread', price: 5.99, category: 'Sides', image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400', is_veg: true, is_available: true },
  { id: 'm8', restaurant_id: '3', name: 'Quinoa Power Bowl', description: 'Quinoa, avocado, chickpeas & greens', price: 13.99, category: 'Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', is_veg: true, is_available: true },
  { id: 'm9', restaurant_id: '3', name: 'Smoothie Bowl', description: 'Açaí, banana, granola & berries', price: 10.99, category: 'Light Meals', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', is_veg: true, is_available: true },
  { id: 'm10', restaurant_id: '3', name: 'Fresh Juice', description: 'Seasonal fruit cold-pressed juice', price: 6.99, category: 'Juices', image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400', is_veg: true, is_available: true },
  { id: 'm11', restaurant_id: '4', name: 'Kung Pao Chicken', description: 'Spicy stir-fried chicken with peanuts', price: 13.99, category: 'Chinese', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400', is_veg: false, is_available: true },
  { id: 'm12', restaurant_id: '4', name: 'Fried Rice', description: 'Wok-tossed rice with vegetables', price: 9.99, category: 'Chinese', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', is_veg: true, is_available: true },
  { id: 'm13', restaurant_id: '5', name: 'Classic Smash Burger', description: 'Double patty, cheese, special sauce', price: 11.99, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', is_veg: false, is_available: true },
  { id: 'm14', restaurant_id: '5', name: 'Loaded Fries', description: 'Crispy fries with cheese & bacon', price: 7.99, category: 'Sides', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', is_veg: false, is_available: true },
  { id: 'm15', restaurant_id: '6', name: 'Hyderabadi Biryani', description: 'Dum-cooked layered biryani', price: 15.99, category: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', is_veg: false, is_available: true },
  { id: 'm16', restaurant_id: '6', name: 'Combo Meal', description: 'Biryani + raita + dessert', price: 19.99, category: 'Combos', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', is_veg: false, is_available: true },
  { id: 'm17', restaurant_id: '7', name: 'Chocolate Lava Cake', description: 'Warm cake with molten chocolate', price: 8.99, category: 'Desserts', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400', is_veg: true, is_available: true },
  { id: 'm18', restaurant_id: '7', name: 'Ice Cream Sundae', description: 'Triple scoop with toppings', price: 7.99, category: 'Ice Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', is_veg: true, is_available: true },
  { id: 'm19', restaurant_id: '8', name: 'Tomato Basil Soup', description: 'Classic creamy tomato soup', price: 7.99, category: 'Soups', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', is_veg: true, is_available: true },
  { id: 'm20', restaurant_id: '8', name: 'Chicken Noodle Soup', description: 'Hearty chicken soup with noodles', price: 9.99, category: 'Soups', image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400', is_veg: false, is_available: true },
];

async function seed() {
  console.log('Seeding restaurants...');
  const { error: rErr } = await supabase.from('restaurants').upsert(restaurants);
  if (rErr) { console.error('Restaurants error:', rErr.message); process.exit(1); }

  console.log('Seeding menu items...');
  const { error: mErr } = await supabase.from('menu_items').upsert(menuItems);
  if (mErr) { console.error('Menu items error:', mErr.message); process.exit(1); }

  console.log('Seed complete!');
}

seed();
