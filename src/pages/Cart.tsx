import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

const Cart = () => {
  const { items, updateQuantity, removeItem, getTotal } = useCart();
  const navigate = useNavigate();
  const total = getTotal();
  const deliveryFee = total > 0 ? 2.99 : 0;

  if (items.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
        <h2 className="font-display text-2xl font-bold text-foreground">Your cart is empty</h2>
        <p className="text-muted-foreground">Add some delicious items from our restaurants</p>
        <Link to="/restaurants">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Browse Restaurants</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-6 font-display text-3xl font-bold text-foreground">Your Cart</h1>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.menuItem.id} className="flex items-center gap-4 rounded-xl border bg-card p-4">
            <img src={item.menuItem.image} alt={item.menuItem.name} className="h-16 w-16 rounded-lg object-cover" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{item.menuItem.name}</h3>
              <p className="text-xs text-muted-foreground">{item.restaurantName}</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-muted px-1">
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}>
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
            <span className="w-16 text-right font-semibold text-foreground">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
            <Button size="icon" variant="ghost" onClick={() => removeItem(item.menuItem.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 rounded-xl border bg-card p-6">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium text-foreground">${total.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Delivery Fee</span><span className="font-medium text-foreground">${deliveryFee.toFixed(2)}</span></div>
          <div className="border-t pt-2 mt-2 flex justify-between text-base font-bold">
            <span className="text-foreground">Total</span><span className="text-foreground">${(total + deliveryFee).toFixed(2)}</span>
          </div>
        </div>
        <Button className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg" onClick={() => navigate('/checkout')}>
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};

export default Cart;
