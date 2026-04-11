const AVAILABLE_COUPONS = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 0,
  },
  {
    code: 'SAVE50',
    discountType: 'flat',
    discountValue: 50,
    minOrderAmount: 499,
  },
  {
    code: 'PUREVEG15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 0,
  },
];

const normalizeCouponCode = (code = '') => String(code).trim().toUpperCase();

const getCouponByCode = (code = '') => {
  const normalized = normalizeCouponCode(code);
  return AVAILABLE_COUPONS.find((coupon) => coupon.code === normalized) || null;
};

const calculateCouponDiscount = (coupon, subtotal) => {
  if (!coupon) return 0;
  if (subtotal < (coupon.minOrderAmount || 0)) return 0;

  if (coupon.discountType === 'flat') {
    return Math.min(coupon.discountValue, subtotal);
  }

  return Math.min(subtotal, subtotal * (coupon.discountValue / 100));
};

module.exports = {
  AVAILABLE_COUPONS,
  getCouponByCode,
  calculateCouponDiscount,
  normalizeCouponCode,
};