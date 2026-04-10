import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CheckCircle2, Package, ChefHat, Truck, PartyPopper, Clock, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { OrderStatus } from '@/data/types';

const steps: {
  status: OrderStatus;
  label: string;
  description: string;
  eta: string;
  icon: React.ElementType;
  delayMs: number;
}[] = [
  { status: 'placed',           label: 'Order Placed',    description: 'We have received your order',     eta: 'Just now',      icon: Package,      delayMs: 0     },
  { status: 'accepted',         label: 'Confirmed',        description: 'Restaurant confirmed your order', eta: '~2 mins',       icon: CheckCircle2, delayMs: 12000 },
  { status: 'preparing',        label: 'Preparing',        description: 'Your food is being prepared',     eta: '~15 mins',      icon: ChefHat,      delayMs: 25000 },
  { status: 'out_for_delivery', label: 'Out for Delivery', description: 'Rider is on the way',             eta: '~10 mins away', icon: Truck,        delayMs: 40000 },
  { status: 'delivered',        label: 'Delivered',        description: 'Enjoy your meal!',                eta: 'Delivered',     icon: PartyPopper,  delayMs: 55000 },
];

const OrderTracking = () => {
  const { id } = useParams();
  const { orders, updateOrderStatus } = useCart();
  const order = orders.find(o => o.id === id);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (!order) return;

    const idx = steps.findIndex(s => s.status === order.status);
    setCurrentIdx(idx >= 0 ? idx : 0);

    if (order.status === 'delivered') return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    steps.forEach((step, i) => {
      if (i <= idx || step.delayMs === 0) return;
      const t = setTimeout(() => {
        updateOrderStatus(order.id, step.status);
        setCurrentIdx(i);
      }, step.delayMs - steps[idx].delayMs);
      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, [order?.id, order?.status]);

  if (!order) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Package className="h-16 w-16 text-muted-foreground/40" />
        <p className="text-lg font-medium text-muted-foreground">Order not found</p>
        <Link to="/"><Button className="bg-primary text-primary-foreground hover:bg-primary/90">Go Home</Button></Link>
      </div>
    );
  }

  const isDelivered = order.status === 'delivered';
  const progressPct = currentIdx === 0 ? 0 : (currentIdx / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/5 py-8">
      <div className="container max-w-4xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Order ID: {order.id}</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {isDelivered ? '🎉 Order Delivered!' : 'Track Your Order'}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {order.restaurantName} • {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Tracker */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border bg-card p-8 shadow-lg">
              <h2 className="mb-8 text-lg font-semibold text-foreground">Order Status</h2>

              <div className="relative">
                <div className="absolute left-5 top-5 w-0.5 bg-muted" style={{ height: 'calc(100% - 40px)' }} />
                <div
                  className="absolute left-5 top-5 w-0.5 bg-primary transition-all duration-1000 ease-in-out"
                  style={{ height: `${progressPct}%` }}
                />

                <div className="space-y-8">
                  {steps.map((step, idx) => {
                    const done   = idx < currentIdx;
                    const active = idx === currentIdx;
                    const future = idx > currentIdx;
                    const Icon   = step.icon;

                    return (
                      <div key={step.status} className="relative flex items-start gap-5">
                        <div className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500
                          ${done   ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/30' : ''}
                          ${active ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/40 scale-110 ring-4 ring-primary/20' : ''}
                          ${future ? 'border-muted bg-background text-muted-foreground' : ''}
                        `}>
                          {done ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Icon className={`h-5 w-5 ${active ? 'animate-bounce' : ''}`} />
                          )}
                        </div>

                        <div className="flex-1 pt-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className={`font-semibold ${future ? 'text-muted-foreground' : 'text-foreground'}`}>
                              {step.label}
                            </h3>
                            {active && (
                              <Badge className="animate-pulse bg-primary/10 text-primary text-xs">
                                In Progress
                              </Badge>
                            )}
                            {done && (
                              <span className="text-xs text-success font-medium">✓ Done</span>
                            )}
                          </div>

                          <p className={`mt-0.5 text-sm ${future ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                            {step.description}
                          </p>

                          {active && !isDelivered && (
                            <div className="mt-2 flex items-center gap-2">
                              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                              <span className="text-xs font-medium text-primary">
                                Estimated time: {step.eta}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {isDelivered && (
                <div className="mt-8 rounded-xl bg-success/10 p-5 text-center border border-success/20">
                  <PartyPopper className="mx-auto mb-2 h-10 w-10 text-success" />
                  <p className="text-lg font-bold text-success">Thank you for ordering with MoodByte!</p>
                  <p className="mt-1 text-sm text-muted-foreground">Hope you enjoyed your meal 😊</p>
                  <Link to="/restaurants" className="mt-4 inline-block">
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Order Again
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <h3 className="mb-4 font-semibold text-foreground">Delivery Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Delivery Address</p>
                    <p className="text-muted-foreground">{order.deliveryAddress || '123 Example Street, City'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Contact</p>
                    <p className="text-muted-foreground">+91 98765 43210</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <h3 className="mb-4 font-semibold text-foreground">Order Summary</h3>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item.menuItem.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.menuItem.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-foreground">
                      ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-3 mt-3 flex justify-between font-bold">
                  <span className="text-foreground">Total Paid</span>
                  <span className="text-primary">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <h3 className="mb-3 font-semibold text-foreground">Payment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="font-medium text-foreground uppercase">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono text-xs text-foreground">{order.transactionId}</span>
                </div>
                <Badge className="mt-2 w-full justify-center bg-success/10 text-success hover:bg-success/20">
                  Payment Successful
                </Badge>
              </div>
            </div>

            <Link to="/" className="block">
              <Button variant="outline" className="w-full">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
