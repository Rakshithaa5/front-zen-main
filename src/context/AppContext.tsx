import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Restaurant, MenuItem } from '@/data/types';
import { restaurants as initialRestaurants, menuItems as initialMenuItems } from '@/data/restaurants';
import { toast } from 'sonner';

interface AppContextType {
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  addRestaurant: (restaurant: Restaurant) => void;
  deleteRestaurant: (id: string) => void;
  updateRestaurant: (restaurant: Restaurant) => void;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  toggleMenuItemAvailability: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

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
    <AppContext.Provider value={{ restaurants, menuItems, addRestaurant, deleteRestaurant, updateRestaurant, addMenuItem, updateMenuItem, deleteMenuItem, toggleMenuItemAvailability }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
