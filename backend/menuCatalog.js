const RESTAURANT_MENU_CATALOG = {
  'Spice Garden': [
    'Dal Makhani', 'Butter Chicken', 'Paneer Tikka Masala', 'Shahi Paneer', 'Chicken Korma', 'Mutton Rogan Josh',
    'Aloo Gobi', 'Baingan Bharta', 'Rajma Chawal', 'Kadai Chicken', 'Palak Paneer', 'Chana Masala',
    'Jeera Rice', 'Garlic Naan', 'Stuffed Paratha', 'Mango Lassi', 'Gulab Jamun', 'Raita',
  ],
  'Sushi Harbor': [
    'Salmon Nigiri', 'Tuna Sashimi', 'California Roll', 'Dragon Roll', 'Spicy Tuna Maki', 'Avocado Roll',
    'Ebi Tempura Roll', 'Rainbow Roll', 'Cucumber Maki', 'Salmon Roe Gunkan', 'Edamame', 'Miso Soup',
    'Gyoza', 'Chicken Ramen', 'Agedashi Tofu', 'Takoyaki', 'Green Tea Ice Cream', 'Matcha Latte',
  ],
  'Curry Leaf': [
    'Masala Dosa', 'Rava Idli', 'Medu Vada', 'Uttapam', 'Appam with Stew', 'Pongal',
    'Sambar Rice', 'Rasam', 'Chettinad Chicken Curry', 'Prawn Masala', 'Coconut Chutney', 'Tomato Chutney',
    'Filter Coffee', 'Lemon Rice', 'Tamarind Rice', 'Payasam', 'Banana Bonda', 'Ven Pongal',
  ],
  'Pho Lotus': [
    'Beef Pho', 'Chicken Pho', 'Vegetable Pho', 'Banh Mi Chicken', 'Banh Mi Tofu', 'Fresh Spring Rolls',
    'Fried Spring Rolls', 'Bun Bo Hue', 'Com Tam', 'Lemongrass Chicken', 'Vietnamese Omelette', 'Wonton Soup',
    'Papaya Salad', 'Pandan Iced Tea', 'Ca Phe Sua Da', 'Mango Sticky Rice', 'Che Ba Mau', 'Goi Cuon Tom',
  ],
  Mediterraneo: [
    'Classic Hummus', 'Smoky Baba Ganoush', 'Falafel Plate', 'Chicken Gyros', 'Lamb Gyros', 'Greek Salad',
    'Tabbouleh', 'Fattoush', 'Stuffed Grape Leaves', 'Spanakopita', 'Pita Bread', 'Tzatziki Dip',
    'Shish Tawook', 'Lamb Kofta', 'Lentil Soup', 'Baklava', 'Halloumi Grill', 'Pomegranate Lemonade',
  ],
  'Kebab Court': [
    'Seekh Kebab', 'Shami Kebab', 'Boti Kebab', 'Chicken Tikka', 'Reshmi Kebab', 'Malai Tikka',
    'Mutton Barra', 'Tangdi Kabab', 'Galouti Kebab', 'Peshwari Tikka', 'Achari Chicken Tikka', 'Lamb Shish',
    'Chicken Adana', 'Mutton Seekh', 'Kakori Kebab', 'Gilafi Seekh', 'Hariyali Tikka', 'Patthar Kebab',
  ],
  'Nori House': [
    'Chicken Katsu Curry', 'Beef Udon', 'Tempura Prawn', 'Zaru Soba', 'Miso Ramen', 'Gyoza',
    'Onigiri Salmon', 'Onigiri Tuna', 'Chicken Karaage', 'Teriyaki Chicken Rice', 'Vegetable Tempura', 'Tofu Dengaku',
    'Edamame', 'Japanese Potato Salad', 'Matcha Cheesecake', 'Dorayaki', 'Ramune Soda', 'Hojicha Latte',
  ],
  'Grain & Greens': [
    'Quinoa Buddha Bowl', 'Falafel Grain Bowl', 'Roasted Veggie Bowl', 'Pesto Pasta Salad', 'Mediterranean Couscous', 'Avocado Toast',
    'Lentil Power Bowl', 'Beetroot Hummus Wrap', 'Sweet Potato Bowl', 'Chickpea Spinach Salad', 'Brown Rice & Edamame Bowl', 'Turmeric Cauliflower Bowl',
    'Kale Caesar Salad', 'Mango Avocado Salad', 'Detox Green Juice', 'Almond Butter Smoothie', 'Overnight Oats', 'Chia Pudding',
  ],
  'Smokehouse 19': [
    'Smoked Baby Back Ribs', 'Beef Brisket', 'Pulled Pork Sandwich', 'Smoked Chicken Wings', 'BBQ Pork Belly', 'Smoked Sausage Platter',
    'St. Louis Ribs', 'Burnt Ends', 'Smoked Turkey Leg', 'Pulled Beef Sliders', 'Smoked Lamb Chops', 'BBQ Chicken Half',
    'Jalapeño Cheddar Sausage', 'Corn on the Cob', 'Coleslaw', 'Baked Beans', 'Mac & Cheese', 'Smoked Cornbread',
  ],
  'Pizza Paradise': [
    'Margherita Pizza', 'Pepperoni Pizza', 'BBQ Chicken Pizza', 'Four Cheese Pizza', 'Veggie Supreme Pizza', 'Truffle Mushroom Pizza',
    'Spaghetti Bolognese', 'Penne Arrabbiata', 'Fettuccine Alfredo', 'Lasagne', 'Garlic Bread', 'Bruschetta',
    'Calzone Chicken', 'Caprese Salad', 'Tiramisu', 'Panna Cotta', 'Nutella Pizza', 'Iced Lemon Tea',
  ],
  'Coconut Coast': [
    'Karimeen Pollichathu', 'Kerala Prawn Curry', 'Fish Moilee', 'Crab Masala', 'Squid Fry', 'Mussels in Coconut Milk',
    'Kerala Fish Fry', 'Prawn Biryani', 'Tuna Curry', 'Lobster Thermidor', 'Appam with Fish Curry', 'Puttu & Kadala',
    'Kerala Beef Fry', 'Meen Vevichathu', 'Coconut Prawn Fry', 'Banana Fritters', 'Sol Kadi', 'Tender Coconut Water',
  ],
  'Veggie Vault': [
    'Paneer Butter Masala', 'Dal Tadka', 'Aloo Matar', 'Kadai Paneer', 'Baingan Bharta', 'Palak Corn',
    'Chole Bhature', 'Pindi Chana', 'Matar Mushroom', 'Rajma', 'Jeera Aloo', 'Mixed Veg Sabzi',
    'Missi Roti', 'Laccha Paratha', 'Steamed Rice', 'Kheer', 'Gulab Jamun', 'Buttermilk',
  ],
  'Dumpling Den': [
    'Steamed Veg Momos', 'Chicken Momos', 'Pork Dim Sum', 'Prawn Har Gow', 'Siu Mai', 'Pan-Fried Gyoza',
    'Xiao Long Bao', 'Wontons in Chilli Oil', 'Crystal Dumplings', 'Cheung Fun', 'Taro Dumpling', 'Turnip Cake',
    'Lotus Leaf Rice', 'Egg Tart', 'Sesame Ball', 'Char Siu Bao', 'Lo Mai Gai', 'Jasmine Tea',
  ],
  'Ramen Realm': [
    'Tonkotsu Ramen', 'Shoyu Ramen', 'Miso Ramen', 'Spicy Miso Ramen', 'Shio Ramen', 'Veggie Shio Ramen',
    'Black Garlic Ramen', 'Tan Tan Men', 'Mazemen Dry Ramen', 'Tsukemen Dipping Ramen', 'Chashu Pork Add-on', 'Soft Boiled Egg Add-on',
    'Extra Noodles', 'Bamboo Shoots', 'Nori Add-on', 'Corn & Butter Add-on', 'Mushroom Topping', 'Spicy Bean Paste Add-on',
  ],
  'Bistro Bloom': [
    'Croque Monsieur', 'Croque Madame', 'Classic Quiche Lorraine', 'Spinach & Feta Quiche', 'Chicken Crepe', 'Nutella Banana Crepe',
    'Salade Niçoise', 'French Onion Soup', 'Soupe au Pistou', 'Crème Brûlée', 'Chocolate Mousse', 'Croissant',
    'Pain au Chocolat', 'Madeleines', 'Café au Lait', 'Earl Grey Tea', 'Lemon Tart', 'Baguette with Brie',
  ],
  'Roll House': [
    'Paneer Tikka Roll', 'Chicken Tikka Roll', 'Egg Roll', 'Mutton Seekh Roll', 'Achari Paneer Roll', 'Malai Chicken Roll',
    'Double Egg Roll', 'Veg Manchurian Roll', 'Chicken Reshmi Roll', 'Lamb Boti Roll', 'Mushroom Paneer Roll', 'Cheese Chicken Roll',
    'Tandoori Aloo Roll', 'Prawn Roll', 'Mixed Veg Roll', 'Schezwan Chicken Roll', 'Corn & Cheese Roll', 'Masala Chai',
  ],
  'Cielo Cafe': [
    'Classic Eggs Benedict', 'Avocado Toast with Poached Egg', 'Full English Breakfast', 'Pancake Stack with Maple Syrup', 'French Toast', 'Granola Yogurt Bowl',
    'Smashed Avo & Feta Toast', 'Shakshuka', 'Omelette du Jour', 'Breakfast Burrito', 'Belgian Waffles', 'Acai Bowl',
    'Club Sandwich', 'Croque Monsieur', 'Banana Bread', 'Flat White', 'Cold Brew Coffee', 'Fresh Orange Juice',
  ],
  'Heritage Thali': [
    'Rajasthani Thali', 'Gujarati Thali', 'Punjabi Thali', 'South Indian Thali', 'Bengali Thali', 'Maharashtrian Thali',
    'Assamese Thali', 'Odia Thali', 'Sindhi Thali', 'Kerala Sadya Thali', 'Chhattisgarhi Thali', 'Mini Thali',
    'Dal Baati Churma', 'Kadhi Chawal', 'Khichdi with Ghee', 'Papad & Pickle Platter', 'Sweet Mishri Paan', 'Chaas',
  ],
  'Seoul Street': [
    'Bibimbap', 'Kimchi Fried Rice', 'Tteokbokki', 'Japchae', 'Korean Fried Chicken', 'Dakgalbi',
    'Sundubu Jjigae', 'Doenjang Jjigae', 'Bulgogi Bowl', 'Gimbap Roll', 'Haemul Pajeon', 'Kimchi Pancake',
    'Hotteok', 'Bingsu', 'Korean Corn Dog', 'Army Stew (Budae Jjigae)', 'Sikhye', 'Banana Milk',
  ],
  'Falafel Farm': [
    'Classic Falafel Wrap', 'Falafel Plate', 'Chicken Shawarma', 'Veg Shawarma', 'Hummus with Pita', 'Baba Ganoush Plate',
    'Mezze Platter', 'Fattoush Salad', 'Lentil Soup', 'Stuffed Pita', 'Manakeesh Zaatar', 'Labneh Bowl',
    'Kibbeh', 'Shakshuka', 'Knafeh', 'Baklava', 'Jallab Juice', 'Fresh Mint Lemonade',
  ],
  'Green Bowl': [
    'Acai Smoothie Bowl', 'Mango Chia Bowl', 'Green Detox Bowl', 'Peanut Butter Banana Bowl', 'Tropical Fruit Bowl', 'Buddha Bowl',
    'Rainbow Salad Bowl', 'Roasted Chickpea Wrap', 'Lentil & Spinach Bowl', 'Sweet Potato & Kale Bowl', 'Raw Pad Thai', 'Zucchini Noodles Pesto',
    'Avocado Cucumber Salad', 'Beetroot Hummus Toast', 'Cold-Pressed Green Juice', 'Turmeric Golden Latte', 'Berry Smoothie', 'Overnight Oats',
  ],
  'Crisp Corner': [
    'Samosa (2 pcs)', 'Pav Bhaji', 'Vada Pav', 'Pani Puri', 'Sev Puri', 'Bhel Puri',
    'Dahi Puri', 'Aloo Tikki Chaat', 'Raj Kachori', 'Corn Chaat', 'Bread Pakora', 'Onion Pakora',
    'Mirchi Bajji', 'Kachori', 'Dabeli', 'Masala Maggi', 'Cutting Chai', 'Sugarcane Juice',
  ],
  'Dragon Wok': [
    'Veg Hakka Noodles', 'Chicken Hakka Noodles', 'Veg Fried Rice', 'Chicken Fried Rice', 'Veg Manchurian Dry', 'Chicken Manchurian Gravy',
    'Chilli Paneer', 'Chilli Chicken', 'Gobi 65', 'Crispy Baby Corn', 'Prawn Fried Rice', 'Schezwan Noodles',
    'Kung Pao Chicken', 'Sweet & Sour Pork', 'Spring Rolls', 'Dim Sum Basket', 'Hot & Sour Soup', 'Manchow Soup',
  ],
  'Burger Barn': [
    'Classic Beef Burger', 'Smash Burger', 'BBQ Bacon Burger', 'Mushroom Swiss Burger', 'Crispy Chicken Burger', 'Spicy Chicken Burger',
    'Veggie Bean Burger', 'Double Smash Burger', 'Truffle Fries', 'Classic Fries', 'Onion Rings', 'Coleslaw',
    'Mac & Cheese Bites', 'Chicken Tenders', 'Chocolate Milkshake', 'Vanilla Milkshake', 'Strawberry Milkshake', 'Root Beer Float',
  ],
  'Biryani House': [
    'Chicken Dum Biryani', 'Mutton Dum Biryani', 'Veg Biryani', 'Egg Biryani', 'Prawn Biryani', 'Paneer Biryani',
    'Hyderabadi Chicken Biryani', 'Lucknowi Awadhi Biryani', 'Kolkata Chicken Biryani', 'Keema Biryani', 'Mushroom Biryani', 'Chettinad Chicken Biryani',
    'Soya Biryani', 'Raita', 'Mirchi Ka Salan', 'Shorba', 'Brinjal Salan', 'Boiled Egg Add-on',
  ],
  'Sweet Tooth': [
    'Chocolate Lava Cake', 'Red Velvet Cake', 'New York Cheesecake', 'Tiramisu', 'Waffles with Ice Cream', 'Brownie Sundae',
    'Crème Brûlée', 'Mango Mousse', 'Strawberry Panna Cotta', 'Churros with Chocolate Sauce', 'Gulab Jamun Ice Cream', 'Rasmalai',
    'Gajar Ka Halwa', 'Kheer', 'Kulfi Falooda', 'Macarons', 'Nutella Crepe', 'Banana Foster',
  ],
  'Soup & Soul': [
    'Classic Tomato Soup', 'Cream of Mushroom Soup', 'French Onion Soup', 'Minestrone', 'Lentil Soup', 'Sweet Corn Soup',
    'Hot & Sour Soup', 'Tom Yum Soup', 'Wonton Soup', 'Pumpkin Bisque', 'Broccoli Cheddar Soup', 'Spinach & Garlic Soup',
    'Roasted Red Pepper Soup', 'Mulligatawny', 'Chicken Noodle Soup', 'Miso Soup', 'Borscht', 'Gazpacho',
  ],
  'Taco Tierra': [
    'Chicken Tacos', 'Beef Tacos', 'Fish Tacos', 'Mushroom Tacos', 'Chicken Burrito', 'Bean & Cheese Burrito',
    'Beef Quesadilla', 'Chicken Quesadilla', 'Nachos with Salsa', 'Loaded Nachos', 'Guacamole & Chips', 'Elote (Mexican Street Corn)',
    'Chicken Enchiladas', 'Beef Fajitas', 'Veggie Fajitas', 'Churros', 'Horchata', 'Agua Fresca',
  ],
};

function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function hashToInt(value) {
  const text = String(value || '');
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function inferCategory(itemName) {
  const n = String(itemName || '').toLowerCase();
  if (/(ice cream|cake|cheesecake|tiramisu|mousse|brownie|baklava|kheer|rasmalai|gulab|panna cotta|cr[eè]me|falooda|macarons|churros|sundae|waffles|tart|banana foster|payasam|bingsu|hotteok)/.test(n)) return 'Desserts';
  if (/(tea|chai|latte|coffee|juice|soda|water|lassi|milk|lemonade|horchata|fresca|jallab|smoothie|cold brew|chaas)/.test(n)) return 'Drinks';
  if (/(soup|bisque|shorba|gazpacho|borscht|miso soup|tom yum|mulligatawny)/.test(n)) return 'Soups';
  if (/(pizza|calzone)/.test(n)) return 'Pizza';
  if (/(pasta|spaghetti|penne|fettuccine|lasagne|noodles)/.test(n)) return 'Pasta';
  if (/(ramen|udon|soba|pho|tsukemen|mazemen|tan tan men|shoyu|tonkotsu|shio)/.test(n)) return 'Noodles';
  if (/(biryani|rice|chawal|pongal|khichdi)/.test(n)) return 'Rice';
  if (/(naan|paratha|roti|bread|baguette|croissant|pain au chocolat|pita|manakeesh)/.test(n)) return 'Breads';
  if (/(burger|fries|onion rings|sliders|corn dog)/.test(n)) return 'Burgers';
  if (/(taco|burrito|quesadilla|fajitas|enchiladas|nachos|guacamole|elote)/.test(n)) return 'Mexican';
  if (/(kebab|tikka|shawarma|kofta|seekh|adana|barra|galouti|kakori|patthar|tawook)/.test(n)) return 'Grill';
  if (/(momo|dumpling|dim sum|gyoza|bao|har gow|siu mai|wonton|cheung fun)/.test(n)) return 'Dumplings';
  if (/(salad|caesar|tabbouleh|fattoush|couscous|bowl|oats|chia|hummus toast|wrap)/.test(n)) return 'Salads';
  if (/(roll|maki|nigiri|sashimi|gunkan|onigiri|gimbap)/.test(n)) return 'Sushi';
  if (/(thali|churma|salan|kadhi|sabzi|masala|korma|bharta|chana|rajma|dal|paneer|chicken|mutton|prawn|fish|lobster|crab)/.test(n)) return 'Main Course';
  if (/(add-on|topping|extra)/.test(n)) return 'Add-ons';
  return 'Specials';
}

function getCategoryImage(category, itemName, restaurantName, index) {
  const pools = {
    Desserts: [
      'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800',
      'https://images.unsplash.com/photo-1464306076886-da185f6a9d05?w=800',
    ],
    Drinks: [
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800',
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
    ],
    Soups: [
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
      'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=800',
    ],
    Pizza: [
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
    ],
    Pasta: [
      'https://images.unsplash.com/photo-1621996346565-411f39d00ca8?w=800',
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800',
    ],
    Noodles: [
      'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800',
      'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800',
    ],
    Rice: [
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800',
      'https://images.unsplash.com/photo-1596797038530-2c107aa55bb2?w=800',
    ],
    Breads: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
      'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=800',
    ],
    Burgers: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
      'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
    ],
    Mexican: [
      'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800',
      'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=800',
    ],
    Grill: [
      'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800',
      'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
    ],
    Dumplings: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800',
      'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800',
    ],
    Salads: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
      'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800',
    ],
    Sushi: [
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800',
      'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800',
    ],
    'Main Course': [
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=800',
    ],
    'Add-ons': [
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800',
    ],
    Specials: [
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800',
    ],
  };

  const options = pools[category] || pools.Specials;
  const pick = (hashToInt(`${restaurantName}-${itemName}`) + index) % options.length;
  return options[pick];
}

function buildCatalogMenuItemsForRestaurant(restaurant, priceRange = 2) {
  const dishes = RESTAURANT_MENU_CATALOG[restaurant.name] || [];
  return dishes.map((name, index) => {
    const category = inferCategory(name);
    const baseByRange = { 1: 129, 2: 189, 3: 269 };
    const base = baseByRange[priceRange] || 189;
    const price = base + (hashToInt(`${restaurant.id}-${name}`) % 280);
    const isVeg = !/(chicken|mutton|lamb|beef|pork|fish|prawn|crab|lobster|tuna|salmon|sashimi|shrimp|egg)/i.test(name);

    return {
      id: `m${restaurant.id}-${String(index + 1).padStart(2, '0')}`,
      restaurant_id: restaurant.id,
      name,
      description: `${name} from ${restaurant.name}`,
      price,
      category,
      image: getCategoryImage(category, name, restaurant.name, index),
      is_veg: isVeg,
      is_available: true,
    };
  });
}

module.exports = {
  RESTAURANT_MENU_CATALOG,
  buildCatalogMenuItemsForRestaurant,
  inferCategory,
  getCategoryImage,
  toSlug,
};
