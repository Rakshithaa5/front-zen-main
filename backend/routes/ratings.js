const router = require('express').Router();
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');

// POST /api/ratings — submit rating for an order
router.post('/', authMiddleware, async (req, res) => {
  const { orderId, restaurantId, restaurantRating, itemRatings, review } = req.body;

  if (!orderId || !restaurantId || !restaurantRating)
    return res.status(400).json({ error: 'orderId, restaurantId and restaurantRating are required' });

  // Check order belongs to user and is delivered
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .select('id, status, user_id')
    .eq('id', orderId)
    .single();

  if (orderErr || !order) return res.status(404).json({ error: 'Order not found' });
  if (order.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  if (order.status !== 'delivered') return res.status(400).json({ error: 'Can only rate delivered orders' });

  // Check not already rated
  const { data: existing } = await supabase
    .from('ratings')
    .select('id')
    .eq('order_id', orderId)
    .single();

  if (existing) return res.status(409).json({ error: 'Order already rated' });

  // Insert rating
  const { data: rating, error: ratingErr } = await supabase
    .from('ratings')
    .insert({
      order_id: orderId,
      user_id: req.user.id,
      restaurant_id: restaurantId,
      restaurant_rating: restaurantRating,
      item_ratings: itemRatings || [],
      review: review || null,
    })
    .select()
    .single();

  if (ratingErr) return res.status(500).json({ error: ratingErr.message });

  // Recalculate restaurant avg rating
  const { data: allRatings } = await supabase
    .from('ratings')
    .select('restaurant_rating')
    .eq('restaurant_id', restaurantId);

  if (allRatings?.length) {
    const avg = allRatings.reduce((sum, r) => sum + r.restaurant_rating, 0) / allRatings.length;
    await supabase
      .from('restaurants')
      .update({ rating: Math.round(avg * 10) / 10 })
      .eq('id', restaurantId);
  }

  res.status(201).json(rating);
});

// GET /api/ratings/order/:orderId — check if order is rated
router.get('/order/:orderId', authMiddleware, async (req, res) => {
  const { data } = await supabase
    .from('ratings')
    .select('*')
    .eq('order_id', req.params.orderId)
    .single();

  res.json(data || null);
});

module.exports = router;
