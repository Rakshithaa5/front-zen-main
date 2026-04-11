export interface Restaurant {
  id: string;
  name: string;
  ownerName?: string;
  cuisine: string[];
  rating: number;
  priceRange: 1 | 2 | 3;
  image: string;
  imageGallery: string[];
  deliveryTime: string;
  isVeg: boolean;
  address: string;
  location: string;
  description: string;
  verificationDoc: string;
  isVerified: boolean;
  verifiedAt?: string | null;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  restaurantName: string;
  restaurantId?: string;
  deliveryAddress?: string;
}

export type OrderStatus = 'placed' | 'accepted' | 'preparing' | 'out_for_delivery' | 'delivered';

export interface Mood {
  emoji: string;
  label: string;
  categories: string[];
  color: string;
}

export const MOODS: Mood[] = [
  { emoji: '😊', label: 'Happy', categories: ['Pizza', 'Burgers', 'Desserts'], color: 'bg-yellow-100 text-yellow-700' },
  { emoji: '😢', label: 'Sad', categories: ['Comfort Food', 'Ice Cream', 'Chocolate'], color: 'bg-blue-100 text-blue-700' },
  { emoji: '😴', label: 'Tired', categories: ['Coffee', 'Light Meals', 'Salads'], color: 'bg-purple-100 text-purple-700' },
  { emoji: '😠', label: 'Angry', categories: ['Spicy', 'Chinese', 'Indian'], color: 'bg-red-100 text-red-700' },
  { emoji: '🤒', label: 'Sick', categories: ['Soups', 'Healthy', 'Juices'], color: 'bg-green-100 text-green-700' },
  { emoji: '🎉', label: 'Celebration', categories: ['Biryani', 'Combos', 'Desserts'], color: 'bg-pink-100 text-pink-700' },
];
