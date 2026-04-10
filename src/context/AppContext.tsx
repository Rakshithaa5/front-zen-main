import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Restaurant, MenuItem } from '@/data/types';
import apiService from '@/services/api';
import { toast } from 'sonner';

interface AppContextType {
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  loading: boolean;
  addRestaurant: (restaurant: Restaurant) => void;
  deleteRestaurant: (id: string) => void;
  updateRestaurant: (restaurant: Restaurant) => void;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  toggleMenuItemAvailability: (id: string) => void;
  fetchRestaurants: () => Promise<void>;
  fetchMenuItems: (restaurantId: string) => Promise<MenuItem[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {
      const data = await apiService.getRestaurants();
      // Transform backend data to frontend format
      const transformedData = data.map((r: any) => ({
        id: r.id,
        name: r.name,
        cuisine: r.cuisine,
        rating: r.rating,
        priceRange: r.price_range,
        image: r.image,
        deliveryTime: r.delivery_time,
        isVeg: r.is_veg,
        address: r.address,
        description: r.description,
      }));
      setRestaurants(transformedData);
    } catch (error: any) {
      toast.error('Failed to load restaurants');
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async (restaurantId: string) => {
    try {
      const data = await apiService.getMenu(restaurantId);
      // Transform backend data to frontend format
      const transformedData = data.map((item: any) => ({
        id: item.id,
        restaurantId: item.restaurant_id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        isVeg: item.is_veg,
        isAvailable: item.is_available,
      }));
      setMenuItems(prev => {
        const filtered = prev.filter(m => m.restaurantId !== restaurantId);
        return [...filtered, ...transformedData];
      });
      return transformedData;
    } catch (error: any) {
      toast.error('Failed to load menu items');
      console.error('Error fetching menu items:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const addRestaurant = (restaurant: Restaurant) => {
    setRestaurants(prev => [...prev, restaurant]);
    toast.success(`${restaurant.name} added successfully`);
  };

  const deleteRestaurant = (id: string) => {
    const r = restaurants.find(r => r.id === id);
    setRestaurants(prev => prev.filter(r => r.id !== id));
    setMenuItems(prev => prev.filter(m => m.restaurantId !== id));
    toast.success(`${r?.name || 'Restaurant'} deleted`);
  };

  const updateRestaurant = (restaurant: Restaurant) => {
    setRestaurants(prev => prev.map(r => r.id === restaurant.id ? restaurant : r));
  };

  const addMenuItem = (item: MenuItem) => {
    setMenuItems(prev => [...prev, item]);
    toast.success(`${item.name} added to menu`);
  };

  const updateMenuItem = (item: MenuItem) => {
    setMenuItems(prev => prev.map(m => m.id === item.id ? item : m));
    toast.success(`${item.name} updated`);
  };

  const deleteMenuItem = (id: string) => {
    const item = menuItems.find(m => m.id === id);
    setMenuItems(prev => prev.filter(m => m.id !== id));
    toast.success(`${item?.name || 'Item'} removed`);
  };

  const toggleMenuItemAvailability = (id: string) => {
    setMenuItems(prev => prev.map(m => m.id === id ? { ...m, isAvailable: !m.isAvailable } : m));
  };

  return (
    <AppContext.Provider value={{ 
      restaurants, 
      menuItems, 
      loading,
      addRestaurant, 
      deleteRestaurant, 
      updateRestaurant, 
      addMenuItem, 
      updateMenuItem, 
      deleteMenuItem, 
      toggleMenuItemAvailability,
      fetchRestaurants,
      fetchMenuItems
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
