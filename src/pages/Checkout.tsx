import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Banknote, CheckCircle2, Building2, Wallet, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { AVAILABLE_COUPONS } from '@/data/coupons';

const paymentMethods = [
  { id: 'upi',        label: 'UPI',                icon: Smartphone, description: 'Google Pay, PhonePe, Paytm' },
  { id: 'card',       label: 'Credit / Debit Card', icon: CreditCard, description: 'Visa, Mastercard, Amex' },
  { id: 'netbanking', label: 'Net Banking',          icon: Building2,  description: 'All major banks supported' },
  { id: 'wallet',     label: 'Wallet',               icon: Wallet,     description: 'Paytm, PhonePe, Amazon Pay' },
  { id: 'cod',        label: 'Cash on Delivery',     icon: Banknote,   description: 'Pay when you receive' },
];

// ── helpers ──────────────────────────────────────────────────────────────────

const formatCardNumber = (v: string) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

const formatExpiry = (v: string) => {
  const digits = v.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
};

const getCardType = (num: string): string => {
  const n = num.replace(/\s/g, '');
  if (/^4/.test(n)) return 'Visa';
  if (/^5[1-5]/.test(n)) return 'Mastercard';
  if (/^3[47]/.test(n)) return 'Amex';
  if (/^6/.test(n)) return 'RuPay';
  return '';
};

// ── validators ───────────────────────────────────────────────────────────────

const validateUpi = (id: string) => /^[\w.-]{2,256}@[a-zA-Z]{2,64}$/.test(id.trim());

const validateCard = (num: string) => {
  const digits = num.replace(/\s/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  // Luhn check
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

const validateExpiry = (exp: string) => {
  const [mm, yy] = exp.split('/');
  if (!mm || !yy || mm.length !== 2 || yy.length !== 2) return false;
  const month = parseInt(mm, 10);
  const year = 2000 + parseInt(yy, 10);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  return new Date(year, month - 1) >= new Date(now.getFullYear(), now.getMonth());
};

const validatePhone = (p: string) => /^[6-9]\d{9}$/.test(p);

// ── component ─────────────────────────────────────────────────────────────────

const Err = ({ msg }: { msg: string }) => (
  <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
    <AlertCircle className="h-3 w-3" /> {msg}
  </p>
);

const Checkout = () => {
  const [payment, setPayment] = useState('upi');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [processing, setProcessing] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    bank: '',
    walletType: '',
  });

  const { getTotal, placeOrder, items } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const subtotal = getTotal();
  const deliveryFee = 49;
  const tax = subtotal * 0.05;
  const activeCoupon = AVAILABLE_COUPONS.find(c => c.code === appliedCoupon) || null;
  const couponDiscount = activeCoupon
    ? activeCoupon.discountType === 'percentage'
      ? subtotal * (activeCoupon.discountValue / 100)
      : activeCoupon.discountValue
    : 0;
  const total = Math.max(subtotal - couponDiscount, 0) + deliveryFee + tax;

  if (!isAuthenticated) { navigate('/login'); return null; }
  if (items.length === 0) { navigate('/cart'); return null; }

  const cardType = getCardType(paymentDetails.cardNumber);

  // ── field errors ────────────────────────────────────────────────────────────
  const errors: Record<string, string> = {};

  if (touched.phone && !validatePhone(phone))
    errors.phone = 'Enter a valid 10-digit Indian mobile number';
  if (touched.address && !address.trim())
    errors.address = 'Delivery address is required';

  if (payment === 'upi' && touched.upiId) {
    if (!paymentDetails.upiId) errors.upiId = 'UPI ID is required';
    else if (!validateUpi(paymentDetails.upiId)) errors.upiId = 'Invalid UPI ID (e.g. name@upi)';
  }
  if (payment === 'card') {
    if (touched.cardNumber) {
      if (!paymentDetails.cardNumber) errors.cardNumber = 'Card number is required';
      else if (!validateCard(paymentDetails.cardNumber)) errors.cardNumber = 'Invalid card number';
    }
    if (touched.cardName && !paymentDetails.cardName.trim())
      errors.cardName = 'Cardholder name is required';
    if (touched.expiry) {
      if (!paymentDetails.expiry) errors.expiry = 'Expiry is required';
      else if (!validateExpiry(paymentDetails.expiry)) errors.expiry = 'Card is expired or invalid';
    }
    if (touched.cvv) {
      if (!paymentDetails.cvv) errors.cvv = 'CVV is required';
      else if (paymentDetails.cvv.length < 3) errors.cvv = 'CVV must be 3–4 digits';
    }
  }
  if (payment === 'netbanking' && touched.bank && !paymentDetails.bank)
    errors.bank = 'Please select a bank';
  if (payment === 'wallet' && touched.walletType && !paymentDetails.walletType)
    errors.walletType = 'Please select a wallet';

  const touch = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));
  const pd = (field: string, value: string) =>
    setPaymentDetails(prev => ({ ...prev, [field]: value }));

  // ── submit ──────────────────────────────────────────────────────────────────
  const handlePlace = async () => {
    // Touch all relevant fields
    const allFields: Record<string, boolean> = { phone: true, address: true };
    if (payment === 'upi') allFields.upiId = true;
    if (payment === 'card') { allFields.cardNumber = true; allFields.cardName = true; allFields.expiry = true; allFields.cvv = true; }
    if (payment === 'netbanking') allFields.bank = true;
    if (payment === 'wallet') allFields.walletType = true;
    setTouched(prev => ({ ...prev, ...allFields }));

    if (!validatePhone(phone)) { toast.error('Enter a valid phone number'); return; }
    if (!address.trim()) { toast.error('Enter a delivery address'); return; }

    if (payment === 'upi' && !validateUpi(paymentDetails.upiId)) { toast.error('Invalid UPI ID'); return; }
    if (payment === 'card') {
      if (!validateCard(paymentDetails.cardNumber)) { toast.error('Invalid card number'); return; }
      if (!paymentDetails.cardName.trim()) { toast.error('Enter cardholder name'); return; }
      if (!validateExpiry(paymentDetails.expiry)) { toast.error('Card is expired or invalid'); return; }
      if (paymentDetails.cvv.length < 3) { toast.error('Invalid CVV'); return; }
    }
    if (payment === 'netbanking' && !paymentDetails.bank) { toast.error('Select a bank'); return; }
    if (payment === 'wallet' && !paymentDetails.walletType) { toast.error('Select a wallet'); return; }

    setProcessing(true);
    try {
      const order = await placeOrder(payment, address);
      if (order) navigate(`/order/${order.id}`);
    } catch {
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

          {/* Delivery */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Delivery Details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Delivery Address</Label>
                <Input
                  id="address"
                  placeholder="House no., Street, Area, City"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  onBlur={() => touch('address')}
                  className={`mt-1.5 ${errors.address ? 'border-destructive' : ''}`}
                />
                {errors.address && <Err msg={errors.address} />}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">+91</span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    onBlur={() => touch('phone')}
                    className={`pl-12 ${errors.phone ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.phone && <Err msg={errors.phone} />}
              </div>

              {/* Coupons */}
              <div>
                <Label>Coupon Code</Label>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {AVAILABLE_COUPONS.map(coupon => {
                    const selected = appliedCoupon === coupon.code;
                    return (
                      <button
                        key={coupon.code}
                        type="button"
                        onClick={() => { setAppliedCoupon(selected ? '' : coupon.code); toast.success(selected ? 'Coupon removed' : `${coupon.code} applied`); }}
                        className={`rounded-xl border p-4 text-left transition-all ${selected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-foreground">{coupon.code}</p>
                            <p className="text-xs text-muted-foreground">{coupon.label}</p>
                          </div>
                          <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                            {coupon.discountType === 'percentage' ? `${coupon.discountValue}% off` : `₹${coupon.discountValue} off`}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">{coupon.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Payment Method</h2>
            <div className="space-y-3">
              {paymentMethods.map(m => (
                <button
                  key={m.id}
                  onClick={() => setPayment(m.id)}
                  className={`flex w-full items-start gap-4 rounded-lg border p-4 text-left transition-all ${
                    payment === m.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/40'
                  }`}
                >
                  <div className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${payment === m.id ? 'bg-primary/10' : 'bg-muted'}`}>
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

            {/* UPI */}
            {payment === 'upi' && (
              <div className="mt-4 rounded-lg bg-accent/5 p-4 space-y-2">
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  placeholder="yourname@okaxis"
                  value={paymentDetails.upiId}
                  onChange={e => pd('upiId', e.target.value)}
                  onBlur={() => touch('upiId')}
                  className={errors.upiId ? 'border-destructive' : ''}
                />
                {errors.upiId
                  ? <Err msg={errors.upiId} />
                  : paymentDetails.upiId && validateUpi(paymentDetails.upiId) && (
                    <p className="flex items-center gap-1 text-xs text-success"><CheckCircle2 className="h-3 w-3" /> Valid UPI ID</p>
                  )
                }
                <p className="text-xs text-muted-foreground">Accepted: @okaxis, @oksbi, @ybl, @paytm, @upi, etc.</p>
              </div>
            )}

            {/* Card */}
            {payment === 'card' && (
              <div className="mt-4 rounded-lg bg-accent/5 p-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    {cardType && <span className="text-xs font-semibold text-primary">{cardType}</span>}
                  </div>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentDetails.cardNumber}
                    onChange={e => pd('cardNumber', formatCardNumber(e.target.value))}
                    onBlur={() => touch('cardNumber')}
                    className={`mt-1.5 font-mono tracking-widest ${errors.cardNumber ? 'border-destructive' : ''}`}
                    maxLength={19}
                  />
                  {errors.cardNumber
                    ? <Err msg={errors.cardNumber} />
                    : paymentDetails.cardNumber.replace(/\s/g, '').length === 16 && validateCard(paymentDetails.cardNumber) && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-success"><CheckCircle2 className="h-3 w-3" /> Valid card</p>
                    )
                  }
                </div>

                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="As printed on card"
                    value={paymentDetails.cardName}
                    onChange={e => pd('cardName', e.target.value.toUpperCase())}
                    onBlur={() => touch('cardName')}
                    className={`mt-1.5 uppercase tracking-wide ${errors.cardName ? 'border-destructive' : ''}`}
                  />
                  {errors.cardName && <Err msg={errors.cardName} />}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={paymentDetails.expiry}
                      onChange={e => pd('expiry', formatExpiry(e.target.value))}
                      onBlur={() => touch('expiry')}
                      className={`mt-1.5 font-mono ${errors.expiry ? 'border-destructive' : ''}`}
                      maxLength={5}
                    />
                    {errors.expiry
                      ? <Err msg={errors.expiry} />
                      : paymentDetails.expiry.length === 5 && validateExpiry(paymentDetails.expiry) && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-success"><CheckCircle2 className="h-3 w-3" /> Valid</p>
                      )
                    }
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="password"
                      placeholder={cardType === 'Amex' ? '4 digits' : '3 digits'}
                      value={paymentDetails.cvv}
                      onChange={e => pd('cvv', e.target.value.replace(/\D/g, '').slice(0, cardType === 'Amex' ? 4 : 3))}
                      onBlur={() => touch('cvv')}
                      className={`mt-1.5 ${errors.cvv ? 'border-destructive' : ''}`}
                      maxLength={cardType === 'Amex' ? 4 : 3}
                    />
                    {errors.cvv && <Err msg={errors.cvv} />}
                  </div>
                </div>
              </div>
            )}

            {/* Net Banking */}
            {payment === 'netbanking' && (
              <div className="mt-4 rounded-lg bg-accent/5 p-4 space-y-2">
                <Label htmlFor="bank">Select Bank</Label>
                <select
                  id="bank"
                  value={paymentDetails.bank}
                  onChange={e => { pd('bank', e.target.value); touch('bank'); }}
                  className={`mt-1.5 w-full rounded-lg border bg-background px-3 py-2 text-sm ${errors.bank ? 'border-destructive' : ''}`}
                >
                  <option value="">Choose your bank</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="sbi">State Bank of India</option>
                  <option value="axis">Axis Bank</option>
                  <option value="kotak">Kotak Mahindra Bank</option>
                  <option value="pnb">Punjab National Bank</option>
                  <option value="bob">Bank of Baroda</option>
                  <option value="idfc">IDFC First Bank</option>
                  <option value="yes">Yes Bank</option>
                  <option value="indusind">IndusInd Bank</option>
                </select>
                {errors.bank && <Err msg={errors.bank} />}
              </div>
            )}

            {/* Wallet */}
            {payment === 'wallet' && (
              <div className="mt-4 rounded-lg bg-accent/5 p-4 space-y-2">
                <Label>Select Wallet</Label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {[
                    { id: 'paytm', label: 'Paytm' },
                    { id: 'phonepe', label: 'PhonePe' },
                    { id: 'amazonpay', label: 'Amazon Pay' },
                    { id: 'mobikwik', label: 'MobiKwik' },
                  ].map(w => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => { pd('walletType', w.id); touch('walletType'); }}
                      className={`rounded-lg border p-3 text-sm font-medium transition-all ${
                        paymentDetails.walletType === w.id
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:border-primary/40 text-foreground'
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
                {errors.walletType && <Err msg={errors.walletType} />}
              </div>
            )}

            {/* COD notice */}
            {payment === 'cod' && (
              <div className="mt-4 rounded-lg bg-warning/10 border border-warning/20 p-4">
                <p className="text-sm font-medium text-warning">Cash on Delivery</p>
                <p className="mt-1 text-xs text-muted-foreground">Please keep exact change ready. Our delivery partner will collect payment on arrival.</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Order Summary</h2>

            <div className="space-y-2 border-b pb-4">
              {items.map(item => (
                <div key={item.menuItem.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.menuItem.name} × {item.quantity}</span>
                  <span className="font-medium text-foreground">₹{(item.menuItem.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-b py-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-success">Coupon ({appliedCoupon})</span>
                  <span className="text-success">-₹{couponDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between pt-4 text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">₹{total.toFixed(2)}</span>
            </div>

            <Button
              className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
              onClick={handlePlace}
              disabled={processing}
            >
              {processing ? 'Processing...' : `Place Order • ₹${total.toFixed(2)}`}
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
