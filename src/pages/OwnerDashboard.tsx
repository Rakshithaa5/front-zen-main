import { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, ChefHat, CheckCircle2, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useApp } from '@/context/AppContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { MenuItem } from '@/data/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const statusActions: Record<string, { next: string; label: string }> = {
  placed: { next: 'accepted', label: 'Accept Order' },
  accepted: { next: 'preparing', label: 'Start Preparing' },
  preparing: { next: 'out_for_delivery', label: 'Send for Delivery' },
  out_for_delivery: { next: 'delivered', label: 'Mark Delivered' },
};

const OwnerDashboard = () => {
  const { restaurants, menuItems, addMenuItem, deleteMenuItem, toggleMenuItemAvailability } = useApp();
  const { orders, updateOrderStatus } = useCart();
  const { user } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: '', isVeg: false });

  // Use the restaurant linked to the logged-in owner
  const restaurant = restaurants.find(r => r.id === user?.restaurantId);
  const items = menuItems.filter(m => m.restaurantId === restaurant?.id);
  const restaurantOrders = orders.filter(o => o.restaurantId === restaurant?.id || o.restaurantName === restaurant?.name);

  // Analytics
  const totalRevenue = restaurantOrders.reduce((sum, o) => sum + o.total, 0);
  const completedOrders = restaurantOrders.filter(o => o.status === 'delivered').length;
  const pendingOrders = restaurantOrders.filter(o => o.status !== 'delivered').length;

  const handleAddItem = () => {
    if (!newItem.name.trim() || !newItem.price || !restaurant) return;
    const item: MenuItem = {
      id: `mi-${Date.now()}`,
      restaurantId: restaurant.id,
      name: newItem.name.trim(),
      description: newItem.description.trim(),
      price: parseFloat(newItem.price),
      category: newItem.category.trim() || 'General',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      isVeg: newItem.isVeg,
      isAvailable: true,
    };
    addMenuItem(item);
    setNewItem({ name: '', description: '', price: '', category: '', isVeg: false });
    setShowAdd(false);
  };

  if (!restaurant) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <ChefHat className="mx-auto h-16 w-16 text-muted-foreground/40 mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">No Restaurant Assigned</h2>
          <p className="text-muted-foreground">Please contact admin to assign a restaurant to your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <ChefHat className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">{restaurant.name}</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
          </div>
        </div>
        <p className="text-muted-foreground">Manage your menu and orders</p>
      </div>

      {/* Analytics Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <ShoppingBag className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold text-foreground">{restaurantOrders.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <DollarSign className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold text-foreground">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Orders</p>
              <p className="text-2xl font-bold text-foreground">{pendingOrders}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Menu Management */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-foreground">Menu Items ({items.length})</h2>
            <Dialog open={showAdd} onOpenChange={setShowAdd}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-4 w-4" /> Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Menu Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input placeholder="Item Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                  <Input placeholder="Description" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} />
                  <Input placeholder="Price" type="number" step="0.01" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} />
                  <Input placeholder="Category" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} />
                  <label className="flex items-center gap-2 text-sm">
                    <Switch checked={newItem.isVeg} onCheckedChange={v => setNewItem({ ...newItem, isVeg: v })} />
                    Vegetarian
                  </label>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAddItem}>Add Item</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {items.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No menu items. Add your first item!</p>
            ) : (
              items.map(item => (
                <div key={item.id} className={`flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm ${!item.isAvailable ? 'opacity-60' : ''}`}>
                  <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.category} • ${item.price.toFixed(2)}</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => toggleMenuItemAvailability(item.id)} title={item.isAvailable ? 'Mark unavailable' : 'Mark available'}>
                    {item.isAvailable ? <Eye className="h-4 w-4 text-success" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteMenuItem(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Incoming Orders */}
        <div>
          <h2 className="mb-4 font-display text-xl font-bold text-foreground">Orders ({restaurantOrders.length})</h2>
          <div className="space-y-3">
            {restaurantOrders.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No orders for this restaurant yet</p>
            ) : (
              restaurantOrders.map(order => {
                const action = statusActions[order.status];
                return (
                  <div key={order.id} className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">{order.id}</span>
                      <Badge>{order.status.replace(/_/g, ' ')}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      {order.items.map(i => `${i.menuItem.name} ×${i.quantity}`).join(', ')}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">${order.total.toFixed(2)}</span>
                      {action && (
                        <Button size="sm" onClick={() => updateOrderStatus(order.id, action.next as any)} className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90">
                          <CheckCircle2 className="h-3.5 w-3.5" /> {action.label}
                        </Button>
                      )}
                      {order.status === 'delivered' && (
                        <Badge className="bg-success/10 text-success">Completed</Badge>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
