import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, MenuItem, Order, OrderStatus } from '@/data/types';
import { useAuth } from '@/context/AuthContext';
import apiService from '@/services/api';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  orders: Order[];
  loading: boolean;
  addItem: (item: MenuItem, restaurantId: string, restaurantName: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  placeOrder: (paymentMethod: string, deliveryAddress?: string) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  fetchOrders: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchOrders = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const data = await apiService.getOrders();
      // Transform backend data to frontend format
      const transformedOrders = data.map((order: any) => ({
        id: order.id,
        items: order.items,
        total: order.total,
        status: order.status,
        paymentMethod: order.payment_method,
        transactionId: order.transaction_id,
        createdAt: order.created_at,
        restaurantName: order.restaurant_name,
      }));
      setOrders(transformedOrders);
    } catch (error: any) {
      toast.error('Failed to load orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

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

  const placeOrder = async (paymentMethod: string, deliveryAddress = '123 Example Street, City'): Promise<Order | null> => {
    if (!isAuthenticated) {
      toast.error('Please login to place an order');
      return null;
    }

    if (items.length === 0) {
      toast.error('Cart is empty');
      return null;
    }

    try {
      setLoading(true);
      const orderData = {
        items: items.map(item => ({
          id: item.menuItem.id,
          name: item.menuItem.name,
          price: item.menuItem.price,
          quantity: item.quantity,
        })),
        paymentMethod,
        deliveryAddress,
        restaurantId: items[0].restaurantId,
        restaurantName: items[0].restaurantName,
      };

      const backendOrder = await apiService.placeOrder(orderData);
      
      // Transform backend response to frontend format
      const order: Order = {
        id: backendOrder.id,
        items: [...items],
        total: backendOrder.total,
        status: backendOrder.status,
        paymentMethod: backendOrder.payment_method,
        transactionId: backendOrder.transaction_id,
        createdAt: backendOrder.created_at,
        restaurantName: backendOrder.restaurant_name,
      };

      setOrders(prev => [order, ...prev]);
      clearCart();
      toast.success('Order placed successfully!');
      return order;
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      orders, 
      loading,
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart, 
      getTotal, 
      getItemCount, 
      placeOrder, 
      updateOrderStatus,
      fetchOrders
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
