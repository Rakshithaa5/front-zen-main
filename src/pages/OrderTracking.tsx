import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CheckCircle2, Package, ChefHat, Truck, PartyPopper, Clock, MapPin, Phone, CircleDot } from 'lucide-react';
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
  const orderId = order?.id;
  const orderStatus = order?.status;
  const orderCreatedAt = order?.createdAt;
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (!orderId || !orderStatus || !orderCreatedAt) return;

    const idx = steps.findIndex(s => s.status === orderStatus);
    setCurrentIdx(idx >= 0 ? idx : 0);

    // Don't auto-progress if already delivered
    if (orderStatus === 'delivered') return;

    // Only auto-progress orders placed within the last hour
    const elapsedMs = Date.now() - new Date(orderCreatedAt).getTime();
    const ONE_HOUR = 60 * 60 * 1000;
    if (elapsedMs > ONE_HOUR) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    steps.forEach((step, i) => {
      if (i <= idx) return;
      const remainingMs = step.delayMs - elapsedMs;
      if (remainingMs <= 0) {
        updateOrderStatus(orderId, step.status);
        setCurrentIdx(i);
      } else {
        const t = setTimeout(() => {
          updateOrderStatus(orderId, step.status);
          setCurrentIdx(i);
        }, remainingMs);
        timers.push(t);
      }
    });

    return () => timers.forEach(clearTimeout);
  }, [orderId, orderStatus, orderCreatedAt, updateOrderStatus]);

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
                    <p className="text-muted-foreground">{order.phoneNumber || '+91 98765 43210'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
              <div className="relative h-[22rem] overflow-hidden bg-gradient-to-br from-[#e7efe0] via-[#dfe9d6] to-[#d4dfcb]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_24%,rgba(255,255,255,0.45),transparent_24%),radial-gradient(circle_at_78%_26%,rgba(255,255,255,0.18),transparent_22%),radial-gradient(circle_at_55%_72%,rgba(255,255,255,0.16),transparent_18%)]" />

                <div className="absolute inset-0 opacity-35">
                  <div className="absolute left-[-6%] top-[30%] h-24 w-[68%] rounded-full border-[18px] border-[#c7bcab]" />
                  <div className="absolute left-[12%] top-[60%] h-4 w-[54%] rotate-[-8deg] rounded-full bg-[#d9cebf]" />
                  <div className="absolute left-[40%] top-[14%] h-[74%] w-4 rotate-[14deg] rounded-full bg-[#bfb8aa]" />
                  <div className="absolute right-[16%] top-[18%] h-[62%] w-4 rotate-[28deg] rounded-full bg-[#d9cebf]" />
                </div>

                <div className="absolute left-10 right-10 top-4 z-20 rounded-xl border border-white/85 bg-white/90 px-3 py-2 shadow-[0_8px_22px_rgba(15,23,42,0.10)] backdrop-blur-sm">
                  <p className="text-center text-sm font-semibold text-slate-700">Delivering To</p>
                  <p className="mt-1 text-center text-xs text-slate-700 sm:text-sm">
                    {order.deliveryAddress || '123 Example Street, City'}
                  </p>
                </div>

                <div className="absolute left-4 top-[42%] z-20 max-w-[11rem] rounded-lg border border-white/85 bg-white/90 px-3 py-2 shadow-md shadow-black/10 backdrop-blur-sm">
                  <p className="text-sm font-semibold text-slate-800">{order.restaurantName}</p>
                  <p className="mt-1 text-xs text-slate-600">Pickup point</p>
                </div>

                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 360" preserveAspectRatio="none">
                  <path d="M208 187 L 656 230" fill="none" stroke="rgba(37,99,235,0.9)" strokeWidth="5" strokeLinecap="round" />
                  <path d="M208 187 L 656 230" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeDasharray="8 8" strokeLinecap="round" />
                </svg>

                <div className="absolute left-[26%] top-[52%] z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                  <div className="h-4 w-4 rounded-full border-2 border-white bg-emerald-600 shadow-md shadow-emerald-600/30" />
                  <span className="mt-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white shadow-sm">
                    Start
                  </span>
                </div>

                <div className="absolute left-[82%] top-[64%] z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                  <div className="h-4 w-4 rounded-full border-2 border-white bg-rose-600 shadow-md shadow-rose-600/30" />
                  <span className="mt-1 rounded-full bg-rose-600 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white shadow-sm">
                    End
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-4 z-20 px-4">
                  <div className="mx-auto flex max-w-[34rem] items-center justify-between rounded-full border border-white/85 bg-white/90 px-3 py-1.5 text-[10px] font-medium text-slate-600 shadow-md shadow-black/10 backdrop-blur-sm">
                    <span>Pickup: {order.restaurantName}</span>
                    <span>Drop-off: {order.deliveryAddress || 'Customer location'}</span>
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
                {order.couponCode && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Coupon</span>
                    <span className="font-semibold text-success">{order.couponCode}</span>
                  </div>
                )}
                {typeof order.discountAmount === 'number' && order.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-semibold text-success">-₹{order.discountAmount.toFixed(2)}</span>
                  </div>
                )}
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
