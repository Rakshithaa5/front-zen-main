import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Banknote, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const paymentMethods = [
  { id: 'upi', label: 'UPI', icon: Smartphone },
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
];

const Checkout = () => {
  const [payment, setPayment] = useState('upi');
  const [address, setAddress] = useState('123 Example Street, City');
  const [processing, setProcessing] = useState(false);
  const { getTotal, placeOrder, items } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const total = getTotal() + 2.99;

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlace = async () => {
    setProcessing(true);
    try {
      const order = await placeOrder(payment, address);
      if (order) {
        navigate(`/order/${order.id}`);
      }
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container max-w-lg py-8">
      <h1 className="mb-6 font-display text-3xl font-bold text-foreground">Checkout</h1>

      {/* Delivery Address */}
      <div className="mb-6 rounded-xl border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Delivery Address</h2>
        <Input 
          placeholder="Full address" 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      {/* Payment */}
      <div className="mb-6 rounded-xl border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Payment Method</h2>
        <div className="space-y-2">
          {paymentMethods.map(m => (
            <button
              key={m.id}
              onClick={() => setPayment(m.id)}
              className={`flex w-full items-center gap-3 rounded-lg border p-3 transition-all ${
                payment === m.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
              }`}
            >
              <m.icon className={`h-5 w-5 ${payment === m.id ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="font-medium text-foreground">{m.label}</span>
              {payment === m.id && <CheckCircle2 className="ml-auto h-5 w-5 text-primary" />}
            </button>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="mb-6 rounded-xl border bg-card p-5">
        <div className="flex justify-between text-lg font-bold">
          <span className="text-foreground">Total</span>
          <span className="text-primary">${total.toFixed(2)}</span>
        </div>
      </div>

      <Button
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        size="lg"
        onClick={handlePlace}
        disabled={processing}
      >
        {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </Button>
    </div>
  );
};

export default Checkout;
