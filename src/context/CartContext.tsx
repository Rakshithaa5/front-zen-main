import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, MenuItem, Order, OrderStatus } from '@/data/types';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  orders: Order[];
  addItem: (item: MenuItem, restaurantId: string, restaurantName: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  placeOrder: (paymentMethod: string) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const addItem = (menuItem: MenuItem, restaurantId: string, restaurantName: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map(i => i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { menuItem, quantity: 1, restaurantId, restaurantName }];
    });
    toast.success(`${menuItem.name} added to cart`);
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(i => i.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) { removeItem(itemId); return; }
    setItems(prev => prev.map(i => i.menuItem.id === itemId ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const getTotal = () => items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
  const getItemCount = () => items.reduce((sum, i) => sum + i.quantity, 0);

  const placeOrder = (paymentMethod: string): Order => {
    const order: Order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      items: [...items],
      total: getTotal(),
      status: 'placed',
      paymentMethod,
      transactionId: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      restaurantName: items[0]?.restaurantName || 'Unknown',
    };
    setOrders(prev => [order, ...prev]);
    clearCart();

    // Simulate order progress
    const statuses: OrderStatus[] = ['accepted', 'preparing', 'out_for_delivery', 'delivered'];
    statuses.forEach((status, idx) => {
      setTimeout(() => {
        setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status } : o));
      }, (idx + 1) * 8000);
    });

    return order;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <CartContext.Provider value={{ items, orders, addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount, placeOrder, updateOrderStatus }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
