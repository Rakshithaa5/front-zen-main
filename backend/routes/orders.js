const router = require('express').Router();
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');

const VALID_STATUSES = ['placed', 'accepted', 'preparing', 'out_for_delivery', 'delivered'];

// POST /api/orders — place a new order
router.post('/', authMiddleware, async (req, res) => {
  const { items, paymentMethod, deliveryAddress, restaurantId, restaurantName } = req.body;

  if (!items?.length || !paymentMethod || !restaurantId)
    return res.status(400).json({ error: 'items, paymentMethod and restaurantId are required' });

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const transactionId = `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
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
    })
    .select()
    .single();

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
  if (!['admin', 'restaurant_owner'].includes(req.user.role))
    return res.status(403).json({ error: 'Forbidden' });

  const { data: existingOrder, error: fetchError } = await supabase
    .from('orders')
    .select('id, restaurant_id')
    .eq('id', req.params.id)
    .single();

  if (fetchError || !existingOrder) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (req.user.role === 'restaurant_owner') {
    if (!req.user.restaurantId || existingOrder.restaurant_id !== req.user.restaurantId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  }

  const { status } = req.body;
  if (!VALID_STATUSES.includes(status))
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });

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
