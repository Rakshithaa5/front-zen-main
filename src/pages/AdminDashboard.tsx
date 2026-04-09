import { useState } from 'react';
import { Trash2, Plus, TrendingUp, ShoppingBag, Store, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { useCart } from '@/context/CartContext';
import { Restaurant } from '@/data/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const AdminDashboard = () => {
  const { restaurants, deleteRestaurant, addRestaurant } = useApp();
  const { orders } = useCart();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCuisine, setNewCuisine] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  const handleAddRestaurant = () => {
    if (!newName.trim() || !newCuisine.trim()) return;
    const restaurant: Restaurant = {
      id: `r-${Date.now()}`,
      name: newName.trim(),
      cuisine: newCuisine.split(',').map(c => c.trim()),
      rating: 4.0,
      priceRange: 2,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
      deliveryTime: '25-35 min',
      isVeg: false,
      address: newAddress.trim() || 'New Location',
      description: `Welcome to ${newName.trim()}`,
    };
    addRestaurant(restaurant);
    setNewName('');
    setNewCuisine('');
    setNewAddress('');
    setShowAdd(false);
  };

  return (
    <div className="container py-8">
      <h1 className="mb-2 font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
      <p className="mb-8 text-muted-foreground">Manage restaurants, view orders & analytics</p>

      {/* Analytics Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Restaurants</p>
              <p className="text-2xl font-bold text-foreground">{restaurants.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <ShoppingBag className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold text-foreground">{orders.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5">
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
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Order</p>
              <p className="text-2xl font-bold text-foreground">${orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : '0.00'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurants Management */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">Restaurants</h2>
          <Dialog open={showAdd} onOpenChange={setShowAdd}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" /> Add Restaurant
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Restaurant</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input placeholder="Restaurant Name" value={newName} onChange={e => setNewName(e.target.value)} />
                <Input placeholder="Cuisines (comma-separated)" value={newCuisine} onChange={e => setNewCuisine(e.target.value)} />
                <Input placeholder="Address" value={newAddress} onChange={e => setNewAddress(e.target.value)} />
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAddRestaurant}>
                  Add Restaurant
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-3">
          {restaurants.map(r => (
            <div key={r.id} className="flex items-center gap-4 rounded-xl border bg-card p-4">
              <img src={r.image} alt={r.name} className="h-14 w-14 rounded-lg object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{r.name}</h3>
                <p className="text-xs text-muted-foreground">{r.cuisine.join(' • ')} • {r.address}</p>
              </div>
              <Badge className="bg-success/10 text-success">{r.rating} ★</Badge>
              <Button size="icon" variant="ghost" onClick={() => deleteRestaurant(r.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="font-display text-xl font-bold text-foreground">All Orders</h2>
          <div className="flex gap-2">
            {['all', 'placed', 'accepted', 'preparing', 'out_for_delivery', 'delivered'].map(s => (
              <Badge key={s} variant={filterStatus === s ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setFilterStatus(s)}>
                {s === 'all' ? 'All' : s.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>
        </div>
        {filteredOrders.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map(order => (
              <div key={order.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-foreground">{order.id}</span>
                    <span className="ml-2 text-sm text-muted-foreground">{order.restaurantName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge>{order.status.replace(/_/g, ' ')}</Badge>
                    <span className="font-semibold text-foreground">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
