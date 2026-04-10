import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, ChefHat, Truck, PartyPopper, Clock, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { OrderStatus } from '@/data/types';

const steps: { status: OrderStatus; label: string; description: string; icon: React.ElementType }[] = [
  { status: 'placed', label: 'Order Placed', description: 'We have received your order', icon: Package },
  { status: 'accepted', label: 'Confirmed', description: 'Restaurant confirmed your order', icon: CheckCircle2 },
  { status: 'preparing', label: 'Preparing', description: 'Your food is being prepared', icon: ChefHat },
  { status: 'out_for_delivery', label: 'Out for Delivery', description: 'Rider is on the way', icon: Truck },
  { status: 'delivered', label: 'Delivered', description: 'Enjoy your meal!', icon: PartyPopper },
];

const OrderTracking = () => {
  const { id } = useParams();
  const { orders } = useCart();
  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Package className="h-16 w-16 text-muted-foreground/40" />
        <p className="text-lg font-medium text-muted-foreground">Order not found</p>
        <Link to="/"><Button className="bg-primary text-primary-foreground hover:bg-primary/90">Go Home</Button></Link>
      </div>
    );
  }

  const currentIdx = steps.findIndex(s => s.status === order.status);
  const isDelivered = order.status === 'delivered';

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
            {isDelivered ? 'Order Delivered!' : 'Track Your Order'}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {order.restaurantName} • {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Order Tracker */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border bg-card p-8 shadow-lg">
              <h2 className="mb-6 text-lg font-semibold text-foreground">Order Status</h2>
              
              <div className="relative space-y-8">
                {/* Vertical Line */}
                <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-muted" 
                     style={{ height: `${(currentIdx / (steps.length - 1)) * 100}%` }} />
                <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-muted" />

                {steps.map((step, idx) => {
                  const done = idx <= currentIdx;
                  const active = idx === currentIdx;
                  const Icon = step.icon;
                  
                  return (
                    <div key={step.status} className="relative flex items-start gap-4">
                      {/* Icon Circle */}
                      <div className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                        done 
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                          : 'bg-muted text-muted-foreground'
                      } ${active ? 'ring-4 ring-primary/20 scale-110' : ''}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      
                      {/* Content */}
                      <div className={`flex-1 pb-2 transition-all duration-300 ${
                        active ? 'translate-x-1' : ''
                      }`}>
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold transition-colors ${
                            done ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {step.label}
                          </h3>
                          {active && (
                            <Badge className="animate-pulse bg-primary/10 text-primary">
                              In Progress
                            </Badge>
                          )}
                          {done && !active && (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <p className={`mt-1 text-sm transition-colors ${
                          done ? 'text-muted-foreground' : 'text-muted-foreground/60'
                        }`}>
                          {step.description}
                        </p>
                        {active && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-primary">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                            <span>Estimated time: 15-20 mins</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {isDelivered && (
                <div className="mt-6 rounded-lg bg-success/10 p-4 text-center">
                  <PartyPopper className="mx-auto mb-2 h-8 w-8 text-success" />
                  <p className="font-semibold text-success">Thank you for ordering with us!</p>
                  <p className="mt-1 text-sm text-muted-foreground">Hope you enjoyed your meal</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Details Sidebar */}
          <div className="space-y-6">
            {/* Delivery Info */}
            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <h3 className="mb-4 font-semibold text-foreground">Delivery Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Delivery Address</p>
                    <p className="text-muted-foreground">123 Example Street, City</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Contact</p>
                    <p className="text-muted-foreground">+1 234 567 8900</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
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

            {/* Payment Info */}
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
