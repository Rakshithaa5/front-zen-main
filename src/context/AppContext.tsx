import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Restaurant, MenuItem } from '@/data/types';
import apiService from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface BackendRestaurant {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  price_range: 1 | 2 | 3;
  image: string;
  delivery_time: string;
  is_veg: boolean;
  address: string;
  description: string;
}

interface BackendMenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  is_veg: boolean;
  is_available: boolean;
}

interface AppContextType {
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  loading: boolean;
  addRestaurant: (restaurant: Restaurant) => void;
  deleteRestaurant: (id: string) => void;
  updateRestaurant: (restaurant: Restaurant) => void;
  addMenuItem: (item: MenuItem) => Promise<void>;
  updateMenuItem: (item: MenuItem) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  toggleMenuItemAvailability: (id: string) => Promise<void>;
  fetchRestaurants: () => Promise<void>;
  fetchMenuItems: (restaurantId: string, replace?: boolean) => Promise<MenuItem[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  const mapMenuItem = (item: BackendMenuItem): MenuItem => ({
    id: item.id,
    restaurantId: item.restaurant_id,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    image: item.image,
    isVeg: item.is_veg,
    isAvailable: item.is_available,
  });

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getRestaurants();
      // Transform backend data to frontend format
      const transformedData = data.map((r: BackendRestaurant) => ({
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
      if (user?.role === 'restaurant_owner') {
        setRestaurants(user.restaurantId
          ? transformedData.filter((restaurant) => restaurant.id === user.restaurantId)
          : []);
      } else {
        setRestaurants(transformedData);
      }
    } catch (error: unknown) {
      toast.error('Failed to load restaurants');
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.restaurantId, user?.role]);

  const fetchMenuItems = useCallback(async (restaurantId: string, replace = false) => {
    try {
      const data = await apiService.getMenu(restaurantId);
      // Transform backend data to frontend format
      const transformedData = data.map((item: BackendMenuItem) => mapMenuItem(item));
      setMenuItems(prev => {
        if (replace) {
          return transformedData;
        }
        const filtered = prev.filter(m => m.restaurantId !== restaurantId);
        return [...filtered, ...transformedData];
      });
      return transformedData;
    } catch (error: unknown) {
      toast.error('Failed to load menu items');
      console.error('Error fetching menu items:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    void fetchRestaurants();
  }, [authLoading, fetchRestaurants]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (user?.role === 'restaurant_owner' && user.restaurantId) {
      void fetchMenuItems(user.restaurantId, true);
      return;
    }

    if (user?.role === 'restaurant_owner') {
      setMenuItems([]);
      return;
    }

    if (user?.role !== 'restaurant_owner') {
      setMenuItems([]);
    }
  }, [authLoading, fetchMenuItems, user?.restaurantId, user?.role]);

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

  const addMenuItem = async (item: MenuItem) => {
    try {
      const created = await apiService.createMenuItem({
        id: item.id,
        restaurant_id: item.restaurantId,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        is_veg: item.isVeg,
        is_available: item.isAvailable,
      }) as BackendMenuItem;

      const transformed = mapMenuItem(created);
      setMenuItems(prev => [...prev.filter(m => m.id !== transformed.id), transformed]);
      toast.success(`${transformed.name} added to menu`);
    } catch (error) {
      toast.error('Failed to add menu item');
      console.error('Error adding menu item:', error);
    }
  };

  const updateMenuItem = async (item: MenuItem) => {
    try {
      const updated = await apiService.updateMenuItem(item.id, {
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        is_veg: item.isVeg,
        is_available: item.isAvailable,
      }) as BackendMenuItem;

      const transformed = mapMenuItem(updated);
      setMenuItems(prev => prev.map(m => m.id === transformed.id ? transformed : m));
      toast.success(`${transformed.name} updated`);
    } catch (error) {
      toast.error('Failed to update menu item');
      console.error('Error updating menu item:', error);
    }
  };

  const deleteMenuItem = async (id: string) => {
    const item = menuItems.find(m => m.id === id);
    try {
      await apiService.deleteMenuItem(id);
      setMenuItems(prev => prev.filter(m => m.id !== id));
      toast.success(`${item?.name || 'Item'} removed`);
    } catch (error) {
      toast.error('Failed to delete menu item');
      console.error('Error deleting menu item:', error);
    }
  };

  const toggleMenuItemAvailability = async (id: string) => {
    const current = menuItems.find(m => m.id === id);
    if (!current) return;

    try {
      const updated = await apiService.updateMenuAvailability(id, !current.isAvailable) as BackendMenuItem;
      const transformed = mapMenuItem(updated);
      setMenuItems(prev => prev.map(m => m.id === transformed.id ? transformed : m));
    } catch (error) {
      toast.error('Failed to update availability');
      console.error('Error toggling availability:', error);
    }
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
