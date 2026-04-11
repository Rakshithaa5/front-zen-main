export interface Coupon {
  code: string;
  label: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
}

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    label: 'New user savings',
    description: '10% off on your first order',
    discountType: 'percentage',
    discountValue: 10,
  },
  {
    code: 'SAVE50',
    label: 'Flat discount',
    description: '₹50 off orders above ₹499',
    discountType: 'flat',
    discountValue: 50,
  },
  {
    code: 'PUREVEG15',
    label: 'Pure veg special',
    description: '15% off on pure veg orders',
    discountType: 'percentage',
    discountValue: 15,
  },
];