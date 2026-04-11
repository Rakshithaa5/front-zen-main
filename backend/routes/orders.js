const router = require('express').Router();
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');
const { getRestaurantById, evaluateRestaurantOperationalState } = require('../utils/restaurantAccess');
const { getCouponByCode, calculateCouponDiscount, normalizeCouponCode } = require('../utils/coupons');

const VALID_STATUSES = ['placed', 'accepted', 'preparing', 'out_for_delivery', 'delivered'];
const STATUS_RANK = new Map(VALID_STATUSES.map((status, index) => [status, index]));

const isMissingSchemaColumnError = (error, columnName) => {
  const message = String(error?.message || '').toLowerCase();
  return message.includes(`could not find the '${columnName}' column`) || message.includes(`column "${columnName}"`) || message.includes(`column ${columnName}`);
};

// POST /api/orders — place a new order
router.post('/', authMiddleware, async (req, res) => {
  const { items, paymentMethod, deliveryAddress, restaurantId, restaurantName, phoneNumber, couponCode } = req.body;

  if (!items?.length || !paymentMethod || !restaurantId)
    return res.status(400).json({ error: 'items, paymentMethod and restaurantId are required' });

  if (phoneNumber && String(phoneNumber).replace(/\D/g, '').length < 10) {
    return res.status(400).json({ error: 'phoneNumber must be a valid 10-digit number' });
  }

  const { restaurant, error: restaurantError } = await getRestaurantById(restaurantId);
  if (restaurantError || !restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }

  const { isOperational } = evaluateRestaurantOperationalState(restaurant);
  if (!isOperational) {
    return res.status(403).json({ error: 'This restaurant is currently unavailable for orders' });
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const normalizedCouponCode = normalizeCouponCode(couponCode);
  const coupon = normalizedCouponCode ? getCouponByCode(normalizedCouponCode) : null;

  if (normalizedCouponCode && !coupon) {
    return res.status(400).json({ error: 'Invalid coupon code' });
  }

  const discountAmount = calculateCouponDiscount(coupon, subtotal);
  const total = Math.max(subtotal - discountAmount, 0);
  const transactionId = `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  const orderPayload = {
    user_id: req.user.id,
    restaurant_id: restaurantId,
    restaurant_name: restaurantName,
    items,
    currency: 'INR',
    total,
    status: 'placed',
    payment_method: paymentMethod,
    transaction_id: transactionId,
    delivery_address: deliveryAddress,
    phone_number: phoneNumber || null,
    coupon_code: coupon ? coupon.code : null,
    discount_amount: discountAmount,
  };

  const legacyOrderPayload = {
    user_id: req.user.id,
    restaurant_id: restaurantId,
    restaurant_name: restaurantName,
    items,
    currency: 'INR',
    total,
    status: 'placed',
    payment_method: paymentMethod,
    transaction_id: transactionId,
    delivery_address: deliveryAddress,
  };

  let insertResponse = await supabase
    .from('orders')
    .insert(orderPayload)
    .select()
    .single();

  if (insertResponse.error && (
    isMissingSchemaColumnError(insertResponse.error, 'coupon_code')
    || isMissingSchemaColumnError(insertResponse.error, 'phone_number')
    || isMissingSchemaColumnError(insertResponse.error, 'discount_amount')
  )) {
    insertResponse = await supabase
      .from('orders')
      .insert(legacyOrderPayload)
      .select()
      .single();
  }

  const { data: order, error } = insertResponse;

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(order);
});

// GET /api/orders — get current user's orders
router.get('/', authMiddleware, async (req, res) => {
  let query = supabase.from('orders').select('*');

  if (req.user.role === 'customer') {
    query = query.eq('user_id', req.user.id);
  } else if (req.user.role === 'restaurant_owner') {
    if (!req.user.restaurantId) {
      return res.status(403).json({ error: 'No restaurant assigned to this account' });
    }

    query = query.eq('restaurant_id', req.user.restaurantId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/orders/:id
router.get('/:id', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Order not found' });

  if (req.user.role === 'admin') {
    return res.json(data);
  }

  if (req.user.role === 'restaurant_owner') {
    if (!req.user.restaurantId || data.restaurant_id !== req.user.restaurantId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    return res.json(data);
  }

  if (data.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  res.json(data);
});

// PATCH /api/orders/:id/status — admin or owner updates status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  const { data: existingOrder, error: fetchError } = await supabase
    .from('orders')
    .select('id, user_id, restaurant_id, status')
    .eq('id', req.params.id)
    .single();

  if (fetchError || !existingOrder) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  const currentRank = STATUS_RANK.get(existingOrder.status);
  const nextRank = STATUS_RANK.get(status);

  if (nextRank == null || currentRank == null) {
    return res.status(400).json({ error: 'Invalid status transition' });
  }

  if (req.user.role === 'customer') {
    if (existingOrder.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (nextRank < currentRank) {
      return res.status(400).json({ error: 'Status can only move forward' });
    }
  } else if (req.user.role === 'restaurant_owner') {
    if (!req.user.restaurantId || existingOrder.restaurant_id !== req.user.restaurantId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { restaurant, error: restaurantError } = await getRestaurantById(existingOrder.restaurant_id);
    if (restaurantError || !restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const { isOperational } = evaluateRestaurantOperationalState(restaurant);
    if (!isOperational) {
      return res.status(403).json({ error: 'Restaurant is disabled or unverified. Order processing is blocked.' });
    }
  } else if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
