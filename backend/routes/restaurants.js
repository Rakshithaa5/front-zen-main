const router = require('express').Router();
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');

// GET /api/restaurants
router.get('/', async (req, res) => {
  const { cuisine, isVeg, search } = req.query;

  let query = supabase.from('restaurants').select('*');

  if (isVeg === 'true') query = query.eq('is_veg', true);
  if (search) query = query.ilike('name', `%${search}%`);

  const { data, error } = await query.order('rating', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });

  // Filter by cuisine array if provided
  const result = cuisine
    ? data.filter(r => r.cuisine.some(c => c.toLowerCase().includes(cuisine.toLowerCase())))
    : data;

  res.json(result);
});

// GET /api/restaurants/:id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Restaurant not found' });
  res.json(data);
});

// GET /api/restaurants/:id/menu
router.get('/:id/menu', async (req, res) => {
  const { category } = req.query;
  let query = supabase.from('menu_items').select('*').eq('restaurant_id', req.params.id);
  if (category) query = query.eq('category', category);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/restaurants — admin only
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  const { data, error } = await supabase.from('restaurants').insert(req.body).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/restaurants/:id — admin or owner
router.put('/:id', authMiddleware, async (req, res) => {
  if (!['admin', 'restaurant_owner'].includes(req.user.role))
    return res.status(403).json({ error: 'Forbidden' });

  const { data, error } = await supabase
    .from('restaurants')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE /api/restaurants/:id — admin only
router.delete('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  const { error } = await supabase.from('restaurants').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Restaurant deleted' });
});

module.exports = router;
