import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Banknote, CheckCircle2, Building2, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const paymentMethods = [
  { 
    id: 'upi', 
    label: 'UPI', 
    icon: Smartphone,
    description: 'Pay via Google Pay, PhonePe, Paytm',
    fields: ['upiId']
  },
  { 
    id: 'card', 
    label: 'Credit/Debit Card', 
    icon: CreditCard,
    description: 'Visa, Mastercard, Amex accepted',
    fields: ['cardNumber', 'cardName', 'expiry', 'cvv']
  },
  { 
    id: 'netbanking', 
    label: 'Net Banking', 
    icon: Building2,
    description: 'All major banks supported',
    fields: ['bank']
  },
  { 
    id: 'wallet', 
    label: 'Wallet', 
    icon: Wallet,
    description: 'Paytm, PhonePe, Amazon Pay',
    fields: ['walletType']
  },
  { 
    id: 'cod', 
    label: 'Cash on Delivery', 
    icon: Banknote,
    description: 'Pay when you receive',
    fields: []
  },
];

const Checkout = () => {
  const [payment, setPayment] = useState('upi');
  const [address, setAddress] = useState('123 Example Street, City');
  const [phone, setPhone] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    bank: '',
    walletType: ''
  });
  
  const { getTotal, placeOrder, items } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const subtotal = getTotal();
  const deliveryFee = 2.99;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const selectedMethod = paymentMethods.find(m => m.id === payment);

  const handlePlace = async () => {
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    if (payment !== 'cod') {
      const requiredFields = selectedMethod?.fields || [];
      const missingFields = requiredFields.filter(field => !paymentDetails[field as keyof typeof paymentDetails]);
      if (missingFields.length > 0) {
        toast.error('Please fill in all payment details');
        return;
      }
    }

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
    <div className="container max-w-4xl py-8">
      <h1 className="mb-8 font-display text-3xl font-bold text-foreground">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Details */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Delivery Details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address" className="text-sm font-medium">Delivery Address</Label>
                <Input 
                  id="address"
                  placeholder="Enter your complete address" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <Input 
                  id="phone"
                  type="tel"
                  placeholder="Enter 10-digit mobile number" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Payment Method</h2>
            <div className="space-y-3">
              {paymentMethods.map(m => (
                <button
                  key={m.id}
                  onClick={() => setPayment(m.id)}
                  className={`flex w-full items-start gap-4 rounded-lg border p-4 text-left transition-all ${
                    payment === m.id 
                      ? 'border-primary bg-primary/5 shadow-sm' 
                      : 'border-border hover:border-primary/40 hover:bg-accent/5'
                  }`}
                >
                  <div className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                    payment === m.id ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <m.icon className={`h-5 w-5 ${payment === m.id ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">{m.label}</span>
                      {payment === m.id && <CheckCircle2 className="h-5 w-5 text-primary" />}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{m.description}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Payment Details Form */}
            {payment === 'upi' && (
              <div className="mt-4 space-y-3 rounded-lg bg-accent/5 p-4">
                <Label htmlFor="upiId" className="text-sm font-medium">UPI ID</Label>
                <Input 
                  id="upiId"
                  placeholder="yourname@upi" 
                  value={paymentDetails.upiId}
                  onChange={(e) => setPaymentDetails({...paymentDetails, upiId: e.target.value})}
                />
              </div>
            )}

            {payment === 'card' && (
              <div className="mt-4 space-y-3 rounded-lg bg-accent/5 p-4">
                <div>
                  <Label htmlFor="cardNumber" className="text-sm font-medium">Card Number</Label>
                  <Input 
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456" 
                    value={paymentDetails.cardNumber}
                    onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                    maxLength={19}
                  />
                </div>
                <div>
                  <Label htmlFor="cardName" className="text-sm font-medium">Cardholder Name</Label>
                  <Input 
                    id="cardName"
                    placeholder="Name on card" 
                    value={paymentDetails.cardName}
                    onChange={(e) => setPaymentDetails({...paymentDetails, cardName: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="expiry" className="text-sm font-medium">Expiry</Label>
                    <Input 
                      id="expiry"
                      placeholder="MM/YY" 
                      value={paymentDetails.expiry}
                      onChange={(e) => setPaymentDetails({...paymentDetails, expiry: e.target.value})}
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-sm font-medium">CVV</Label>
                    <Input 
                      id="cvv"
                      type="password"
                      placeholder="123" 
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {payment === 'netbanking' && (
              <div className="mt-4 space-y-3 rounded-lg bg-accent/5 p-4">
                <Label htmlFor="bank" className="text-sm font-medium">Select Bank</Label>
                <select 
                  id="bank"
                  value={paymentDetails.bank}
                  onChange={(e) => setPaymentDetails({...paymentDetails, bank: e.target.value})}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                >
                  <option value="">Choose your bank</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="sbi">State Bank of India</option>
                  <option value="axis">Axis Bank</option>
                  <option value="kotak">Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {payment === 'wallet' && (
              <div className="mt-4 space-y-3 rounded-lg bg-accent/5 p-4">
                <Label htmlFor="walletType" className="text-sm font-medium">Select Wallet</Label>
                <select 
                  id="walletType"
                  value={paymentDetails.walletType}
                  onChange={(e) => setPaymentDetails({...paymentDetails, walletType: e.target.value})}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                >
                  <option value="">Choose wallet</option>
                  <option value="paytm">Paytm</option>
                  <option value="phonepe">PhonePe</option>
                  <option value="amazonpay">Amazon Pay</option>
                  <option value="mobikwik">Mobikwik</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Order Summary</h2>
            
            <div className="space-y-3 border-b pb-4">
              {items.map(item => (
                <div key={item.menuItem.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.menuItem.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-foreground">
                    ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-b py-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="text-foreground">₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (5%)</span>
                <span className="text-foreground">₹{tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between pt-4 text-lg font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-primary">₹{total.toFixed(2)}</span>
            </div>

            <Button
              className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
              onClick={handlePlace}
              disabled={processing}
            >
              {processing ? 'Processing Payment...' : `Place Order • ₹${total.toFixed(2)}`}
            </Button>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              By placing order, you agree to our terms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
