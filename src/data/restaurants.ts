import { Restaurant, MenuItem } from './types';

export const restaurants: Restaurant[] = [
  {
    id: '1', name: 'Spice Garden', cuisine: ['Indian', 'Spicy'], rating: 4.5, priceRange: 2,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600', deliveryTime: '25-35 min',
    isVeg: false, address: '123 Main St', description: 'Authentic Indian cuisine with a modern twist'
  },
  {
    id: '2', name: 'Pizza Paradise', cuisine: ['Italian', 'Pizza'], rating: 4.2, priceRange: 2,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600', deliveryTime: '20-30 min',
    isVeg: false, address: '456 Oak Ave', description: 'Wood-fired pizzas and Italian classics'
  },
  {
    id: '3', name: 'Green Bowl', cuisine: ['Healthy', 'Salads', 'Light Meals'], rating: 4.7, priceRange: 2,
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600', deliveryTime: '15-25 min',
    isVeg: true, address: '789 Elm Rd', description: 'Fresh, healthy bowls and smoothies'
  },
  {
    id: '4', name: 'Dragon Wok', cuisine: ['Chinese', 'Spicy'], rating: 4.0, priceRange: 1,
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600', deliveryTime: '30-40 min',
    isVeg: false, address: '321 Pine Blvd', description: 'Fiery Chinese flavors and dim sum'
  },
  {
    id: '5', name: 'Burger Barn', cuisine: ['Burgers', 'Comfort Food'], rating: 4.3, priceRange: 1,
    image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600', deliveryTime: '15-25 min',
    isVeg: false, address: '654 Maple St', description: 'Juicy handcrafted burgers'
  },
  {
    id: '6', name: 'Biryani House', cuisine: ['Indian', 'Biryani'], rating: 4.6, priceRange: 2,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600', deliveryTime: '35-45 min',
    isVeg: false, address: '987 Cedar Ln', description: 'Aromatic biryanis made with love'
  },
  {
    id: '7', name: 'Sweet Tooth', cuisine: ['Desserts', 'Ice Cream', 'Chocolate'], rating: 4.8, priceRange: 2,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600', deliveryTime: '20-30 min',
    isVeg: true, address: '159 Walnut Dr', description: 'Irresistible desserts and frozen treats'
  },
  {
    id: '8', name: 'Soup & Soul', cuisine: ['Soups', 'Healthy', 'Comfort Food'], rating: 4.4, priceRange: 1,
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=600', deliveryTime: '20-30 min',
    isVeg: true, address: '753 Birch Ave', description: 'Warming soups and wholesome meals'
  },
  {
    id: '9', name: 'Taco Tierra', cuisine: ['Mexican', 'Street Food'], rating: 4.5, priceRange: 1,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600', deliveryTime: '18-28 min',
    isVeg: false, address: '88 Sunset Blvd', description: 'Bold tacos, burritos, and fiery salsas'
  },
  {
    id: '10', name: 'Sushi Harbor', cuisine: ['Japanese', 'Sushi'], rating: 4.9, priceRange: 3,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600', deliveryTime: '25-35 min',
    isVeg: false, address: '14 Harbor Point', description: 'Fresh rolls, nigiri, and premium sashimi'
  },
  {
    id: '11', name: 'Curry Leaf', cuisine: ['South Indian', 'Vegetarian'], rating: 4.6, priceRange: 1,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600', deliveryTime: '20-30 min',
    isVeg: true, address: '22 Temple Road', description: 'Crisp dosas, idlis, and coconut chutneys'
  },
  {
    id: '12', name: 'Pho Lotus', cuisine: ['Vietnamese', 'Noodles'], rating: 4.4, priceRange: 2,
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600', deliveryTime: '22-32 min',
    isVeg: false, address: '101 Lantern St', description: 'Fragrant pho, rice bowls, and herb-packed broths'
  },
  {
    id: '13', name: 'Mediterraneo', cuisine: ['Mediterranean', 'Grill'], rating: 4.7, priceRange: 2,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600', deliveryTime: '25-35 min',
    isVeg: true, address: '77 Olive Ave', description: 'Grilled plates, mezze, and bright Mediterranean flavors'
  },
  {
    id: '14', name: 'Kebab Court', cuisine: ['Turkish', 'Grill'], rating: 4.5, priceRange: 2,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600', deliveryTime: '30-40 min',
    isVeg: false, address: '9 Bazaar Lane', description: 'Charcoal kebabs, wraps, and spiced rice'
  },
  {
    id: '15', name: 'Pasta Fresca', cuisine: ['Italian', 'Pasta'], rating: 4.6, priceRange: 2,
    image: 'https://images.unsplash.com/photo-1498579150354-2a0bd0d9b1d5?w=600', deliveryTime: '20-30 min',
    isVeg: true, address: '44 Via Roma', description: 'Hand-tossed pasta with rich sauces and herbs'
  },
  {
    id: '16', name: 'Nori House', cuisine: ['Asian Fusion', 'Bowls'], rating: 4.3, priceRange: 2,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600', deliveryTime: '25-35 min',
    isVeg: false, address: '310 Pearl Street', description: 'Rice bowls, poke, and modern Asian comfort food'
  },
  {
    id: '17', name: 'Grain & Greens', cuisine: ['Salads', 'Wellness'], rating: 4.8, priceRange: 2,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600', deliveryTime: '15-25 min',
    isVeg: true, address: '8 Spruce Court', description: 'Protein bowls, salads, and clean eating meals'
  },
  {
    id: '18', name: 'Waffle Nest', cuisine: ['Breakfast', 'Desserts'], rating: 4.7, priceRange: 1,
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f3b2b?w=600', deliveryTime: '15-20 min',
    isVeg: true, address: '50 Morning Dr', description: 'Fresh waffles, pancakes, and brunch favorites'
  },
  {
    id: '19', name: 'Smokehouse 19', cuisine: ['BBQ', 'American'], rating: 4.4, priceRange: 3,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600', deliveryTime: '35-45 min',
    isVeg: false, address: '19 Hickory Rd', description: 'Slow-smoked meats with bold house-made sauces'
  },
  {
    id: '20', name: 'Coconut Coast', cuisine: ['Thai', 'Curry'], rating: 4.5, priceRange: 2,
    image: 'https://images.unsplash.com/photo-1559314809-0e4b5a0f1f89?w=600', deliveryTime: '25-35 min',
    isVeg: false, address: '6 Beachfront Way', description: 'Thai curries, noodle dishes, and fragrant basil'
  },
  {
    id: '21', name: 'Veggie Vault', cuisine: ['Vegan', 'Plant Based'], rating: 4.6, priceRange: 2,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600', deliveryTime: '18-28 min',
    isVeg: true, address: '72 Willow Way', description: 'Plant-based burgers, bowls, and dairy-free treats'
  },
  {
    id: '22', name: 'Dumpling Den', cuisine: ['Chinese', 'Dumplings'], rating: 4.7, priceRange: 1,
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600', deliveryTime: '20-30 min',
    isVeg: false, address: '15 Jade Market', description: 'Hand-folded dumplings, noodles, and chili oil specials'
  },
  {
    id: '23', name: 'Ramen Realm', cuisine: ['Japanese', 'Ramen'], rating: 4.8, priceRange: 2,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600', deliveryTime: '30-40 min',
    isVeg: false, address: '12 Sakura Blvd', description: 'Deep broth ramen, soft eggs, and rich toppings'
  },
  {
    id: '24', name: 'Bistro Bloom', cuisine: ['French', 'Bistro'], rating: 4.5, priceRange: 3,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600', deliveryTime: '30-40 min',
    isVeg: true, address: '18 Rue Clair', description: 'Elegant bistro classics with a modern finish'
  },
  {
    id: '25', name: 'Roll House', cuisine: ['Wraps', 'Quick Bites'], rating: 4.2, priceRange: 1,
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600', deliveryTime: '12-22 min',
    isVeg: false, address: '303 Rapid Ave', description: 'Fast wraps, rolls, and handheld comfort food'
  },
  {
    id: '26', name: 'Cielo Cafe', cuisine: ['Cafe', 'Pastries'], rating: 4.4, priceRange: 2,
    image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600', deliveryTime: '10-20 min',
    isVeg: true, address: '9 Cloud Nine', description: 'Coffee, pastries, and all-day brunch plates'
  },
  {
    id: '27', name: 'Heritage Thali', cuisine: ['Indian', 'Thali'], rating: 4.7, priceRange: 2,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600', deliveryTime: '25-35 min',
    isVeg: true, address: '64 Palace Circle', description: 'Regional thalis with rotating seasonal specialties'
  },
  {
    id: '28', name: 'Seoul Street', cuisine: ['Korean', 'Street Food'], rating: 4.6, priceRange: 2,
    image: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=600', deliveryTime: '20-30 min',
    isVeg: false, address: '88 Neon Road', description: 'Korean fried chicken, rice bowls, and spicy noodles'
  },
  {
    id: '29', name: 'Falafel Farm', cuisine: ['Middle Eastern', 'Vegetarian'], rating: 4.5, priceRange: 1,
    image: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=600', deliveryTime: '18-28 min',
    isVeg: true, address: '41 Oasis Street', description: 'Falafel, hummus, shawarma wraps, and fresh pita'
  },
  {
    id: '30', name: 'Crisp Corner', cuisine: ['Fast Food', 'Snacks'], rating: 4.3, priceRange: 1,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600', deliveryTime: '15-25 min',
    isVeg: false, address: '5 Market Square', description: 'Crowd-pleasing snacks, combos, and shareable bites'
  },
];

export const menuItems: MenuItem[] = [
  // Spice Garden
  { id: 'm1', restaurantId: '1', name: 'Butter Chicken', description: 'Creamy tomato-based curry with tender chicken', price: 14.99, category: 'Indian', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', isVeg: false, isAvailable: true },
  { id: 'm2', restaurantId: '1', name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', price: 12.99, category: 'Indian', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', isVeg: true, isAvailable: true },
  { id: 'm3', restaurantId: '1', name: 'Garlic Naan', description: 'Freshly baked bread with garlic', price: 3.99, category: 'Breads', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', isVeg: true, isAvailable: true },
  { id: 'm4', restaurantId: '1', name: 'Chicken Biryani', description: 'Fragrant rice with spiced chicken', price: 16.99, category: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', isVeg: false, isAvailable: true },
  // Pizza Paradise
  { id: 'm5', restaurantId: '2', name: 'Margherita Pizza', description: 'Classic tomato, mozzarella & basil', price: 12.99, category: 'Pizza', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', isVeg: true, isAvailable: true },
  { id: 'm6', restaurantId: '2', name: 'Pepperoni Pizza', description: 'Loaded with pepperoni & cheese', price: 14.99, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', isVeg: false, isAvailable: true },
  { id: 'm7', restaurantId: '2', name: 'Garlic Bread', description: 'Cheesy garlic bread', price: 5.99, category: 'Sides', image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400', isVeg: true, isAvailable: true },
  // Green Bowl
  { id: 'm8', restaurantId: '3', name: 'Quinoa Power Bowl', description: 'Quinoa, avocado, chickpeas & greens', price: 13.99, category: 'Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', isVeg: true, isAvailable: true },
  { id: 'm9', restaurantId: '3', name: 'Smoothie Bowl', description: 'Açaí, banana, granola & berries', price: 10.99, category: 'Light Meals', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', isVeg: true, isAvailable: true },
  { id: 'm10', restaurantId: '3', name: 'Fresh Juice', description: 'Seasonal fruit cold-pressed juice', price: 6.99, category: 'Juices', image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400', isVeg: true, isAvailable: true },
  // Dragon Wok
  { id: 'm11', restaurantId: '4', name: 'Kung Pao Chicken', description: 'Spicy stir-fried chicken with peanuts', price: 13.99, category: 'Chinese', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400', isVeg: false, isAvailable: true },
  { id: 'm12', restaurantId: '4', name: 'Fried Rice', description: 'Wok-tossed rice with vegetables', price: 9.99, category: 'Chinese', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', isVeg: true, isAvailable: true },
  // Burger Barn
  { id: 'm13', restaurantId: '5', name: 'Classic Smash Burger', description: 'Double patty, cheese, special sauce', price: 11.99, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', isVeg: false, isAvailable: true },
  { id: 'm14', restaurantId: '5', name: 'Loaded Fries', description: 'Crispy fries with cheese & bacon', price: 7.99, category: 'Sides', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', isVeg: false, isAvailable: true },
  // Biryani House
  { id: 'm15', restaurantId: '6', name: 'Hyderabadi Biryani', description: 'Dum-cooked layered biryani', price: 15.99, category: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', isVeg: false, isAvailable: true },
  { id: 'm16', restaurantId: '6', name: 'Combo Meal', description: 'Biryani + raita + dessert', price: 19.99, category: 'Combos', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', isVeg: false, isAvailable: true },
  // Sweet Tooth
  { id: 'm17', restaurantId: '7', name: 'Chocolate Lava Cake', description: 'Warm cake with molten chocolate', price: 8.99, category: 'Desserts', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400', isVeg: true, isAvailable: true },
  { id: 'm18', restaurantId: '7', name: 'Ice Cream Sundae', description: 'Triple scoop with toppings', price: 7.99, category: 'Ice Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', isVeg: true, isAvailable: true },
  // Soup & Soul
  { id: 'm19', restaurantId: '8', name: 'Tomato Basil Soup', description: 'Classic creamy tomato soup', price: 7.99, category: 'Soups', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', isVeg: true, isAvailable: true },
  { id: 'm20', restaurantId: '8', name: 'Chicken Noodle Soup', description: 'Hearty chicken soup with noodles', price: 9.99, category: 'Soups', image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400', isVeg: false, isAvailable: true },
];
