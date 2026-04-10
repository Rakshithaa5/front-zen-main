import { useParams } from 'react-router-dom';
import { Star, Clock, MapPin, Plus, Minus, Leaf, Beef } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState, useMemo, useEffect } from 'react';
import { MenuItem } from '@/data/types';

const RestaurantDetail = () => {
  const { id } = useParams();
  const { restaurants, fetchMenuItems } = useApp();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const restaurant = restaurants.find(r => r.id === id);
  const categories = [...new Set(menuItems.map(m => m.category))];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addItem, items: cartItems, updateQuantity } = useCart();
  const { user } = useAuth();
  const canOrder = user?.role === 'customer';

  const filteredItems = useMemo(() =>
    selectedCategory ? menuItems.filter(i => i.category === selectedCategory) : menuItems
  , [selectedCategory, menuItems]);

  useEffect(() => {
    if (id) {
      fetchMenuItems(id).then(items => {
        setMenuItems(items);
        setLoading(false);
      });
    }
  }, [id, fetchMenuItems]);

  if (!restaurant) return <div className="container py-16 text-center text-muted-foreground">Restaurant not found</div>;
  if (loading) return <div className="container py-16 text-center text-muted-foreground">Loading menu...</div>;

  const getCartQuantity = (itemId: string) => cartItems.find(c => c.menuItem.id === itemId)?.quantity || 0;

  return (
    <div className="min-h-screen">
      <div className="relative h-64 overflow-hidden sm:h-80">
        <img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
        <div className="absolute bottom-6 left-0 right-0 container">
          <h1 className="font-display text-3xl font-bold text-card sm:text-4xl">{restaurant.name}</h1>
          <p className="mt-1 text-card/80">{restaurant.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 rounded-md bg-success px-2 py-1 text-sm font-semibold text-success-foreground">
              <Star className="h-3.5 w-3.5 fill-current" /> {restaurant.rating}
            </span>
            <span className="flex items-center gap-1 text-sm text-card/80"><Clock className="h-3.5 w-3.5" /> {restaurant.deliveryTime}</span>
            <span className="flex items-center gap-1 text-sm text-card/80"><MapPin className="h-3.5 w-3.5" /> {restaurant.address}</span>
            {restaurant.isVeg && <Badge className="gap-1 bg-success text-success-foreground"><Leaf className="h-3 w-3" /> Pure Veg</Badge>}
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge variant={!selectedCategory ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setSelectedCategory(null)}>All</Badge>
          {categories.map(c => (
            <Badge key={c} variant={selectedCategory === c ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setSelectedCategory(c)}>{c}</Badge>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map(item => {
            const qty = getCartQuantity(item.id);
            return (
              <div key={item.id} className="flex gap-4 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
                <img src={item.image} alt={item.name} className="h-24 w-24 flex-shrink-0 rounded-lg object-cover" />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <Badge variant="outline" className={`gap-1 text-xs ${item.isVeg ? 'border-success/40 text-success' : 'border-destructive/40 text-destructive'}`}>
                        {item.isVeg ? <Leaf className="h-3 w-3" /> : <Beef className="h-3 w-3" />}
                        {item.isVeg ? 'Veg' : 'Non-Veg'}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-semibold text-foreground">₹{item.price.toFixed(2)}</span>
                    {!canOrder ? (
                      <Badge variant="outline" className="text-xs">Owner View</Badge>
                    ) : qty === 0 ? (
                      <Button size="sm" onClick={() => addItem(item, restaurant.id, restaurant.name)} className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90">
                        <Plus className="h-3.5 w-3.5" /> Add
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 rounded-lg border bg-muted px-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updateQuantity(item.id, qty - 1)}>
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="w-5 text-center text-sm font-semibold">{qty}</span>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => addItem(item, restaurant.id, restaurant.name)}>
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
