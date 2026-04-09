import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Circle, Package, ChefHat, Truck, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { OrderStatus } from '@/data/types';

const steps: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: 'placed', label: 'Order Placed', icon: Package },
  { status: 'accepted', label: 'Accepted', icon: CheckCircle2 },
  { status: 'preparing', label: 'Preparing', icon: ChefHat },
  { status: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: PartyPopper },
];

const OrderTracking = () => {
  const { id } = useParams();
  const { orders } = useCart();
  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Order not found</p>
        <Link to="/"><Button className="bg-primary text-primary-foreground hover:bg-primary/90">Go Home</Button></Link>
      </div>
    );
  }

  const currentIdx = steps.findIndex(s => s.status === order.status);

  return (
    <div className="container max-w-lg py-8">
      <h1 className="mb-2 font-display text-3xl font-bold text-foreground">Order {order.id}</h1>
      <p className="mb-8 text-sm text-muted-foreground">{order.restaurantName} • {new Date(order.createdAt).toLocaleString()}</p>

      {/* Tracker */}
      <div className="mb-8 rounded-xl border bg-card p-6">
        <div className="space-y-6">
          {steps.map((step, idx) => {
            const done = idx <= currentIdx;
            const active = idx === currentIdx;
            return (
              <div key={step.status} className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  done ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                } ${active ? 'ring-4 ring-primary/20' : ''}`}>
                  {done ? <step.icon className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                </div>
                <div>
                  <p className={`font-semibold ${done ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</p>
                  {active && <p className="text-xs text-primary">Current status</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Items */}
      <div className="rounded-xl border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Order Summary</h2>
        {order.items.map(item => (
          <div key={item.menuItem.id} className="flex justify-between py-2 text-sm">
            <span className="text-foreground">{item.menuItem.name} × {item.quantity}</span>
            <span className="text-muted-foreground">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="mt-3 border-t pt-3 flex justify-between font-bold">
          <span className="text-foreground">Total</span>
          <span className="text-primary">${order.total.toFixed(2)}</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Payment: {order.paymentMethod.toUpperCase()} • TXN: {order.transactionId}</p>
      </div>

      <Link to="/" className="mt-6 block">
        <Button variant="outline" className="w-full">Back to Home</Button>
      </Link>
    </div>
  );
};

export default OrderTracking;
