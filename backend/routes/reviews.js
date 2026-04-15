const router = require('express').Router();
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');

// POST /api/reviews — submit a review
router.post('/', authMiddleware, async (req, res) => {
  const { restaurantId, restaurantName, orderId, rating, review } = req.body;

  if (!restaurantId || !rating)
    return res.status(400).json({ error: 'restaurantId and rating are required' });

  // Prevent duplicate review for same order
  if (orderId) {
    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('order_id', orderId)
      .single();
    if (existing) return res.status(409).json({ error: 'Already reviewed this order' });
  }

  // Get user name
  const { data: user } = await supabase
    .from('users')
    .select('name')
    .eq('id', req.user.id)
    .single();

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      restaurant_id: restaurantId,
      restaurant_name: restaurantName,
      order_id: orderId || null,
      user_id: req.user.id,
      user_name: user?.name || 'Customer',
      rating,
      review: review || null,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Update restaurant avg rating
  const { data: allRatings } = await supabase
    .from('reviews')
    .select('rating')
    .eq('restaurant_id', restaurantId);

  if (allRatings?.length) {
    const avg = allRatings.reduce((s, r) => s + r.rating, 0) / allRatings.length;
    await supabase
      .from('restaurants')
      .update({ rating: Math.round(avg * 10) / 10 })
      .eq('id', restaurantId);
  }

  res.status(201).json(data);
});

// GET /api/reviews/:restaurantId — get reviews for a restaurant
router.get('/:restaurantId', async (req, res) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, user_name, rating, review, created_at')
    .eq('restaurant_id', req.params.restaurantId)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
