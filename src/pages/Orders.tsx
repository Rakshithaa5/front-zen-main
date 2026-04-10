import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

const statusColors: Record<string, string> = {
  placed: 'bg-warning/10 text-warning',
  accepted: 'bg-primary/10 text-primary',
  preparing: 'bg-primary/10 text-primary',
  out_for_delivery: 'bg-accent/10 text-accent',
  delivered: 'bg-success/10 text-success',
};

const Orders = () => {
  const { orders } = useCart();

  if (orders.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Package className="h-16 w-16 text-muted-foreground/40" />
        <h2 className="font-display text-2xl font-bold text-foreground">No orders yet</h2>
        <p className="text-muted-foreground">Place your first order!</p>
        <Link to="/restaurants"><Button className="bg-primary text-primary-foreground hover:bg-primary/90">Browse Restaurants</Button></Link>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-6 font-display text-3xl font-bold text-foreground">Your Orders</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <Link key={order.id} to={`/order/${order.id}`} className="block">
            <div className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{order.id}</h3>
                  <p className="text-sm text-muted-foreground">{order.restaurantName} • {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <Badge className={statusColors[order.status]}>{order.status.replace(/_/g, ' ')}</Badge>
                  <p className="mt-1 font-semibold text-foreground">₹{order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Orders;
