const router = require('express').Router();
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');

// POST /api/menu — admin or owner
router.post('/', authMiddleware, async (req, res) => {
  if (!['admin', 'restaurant_owner'].includes(req.user.role))
    return res.status(403).json({ error: 'Forbidden' });

  const { data, error } = await supabase.from('menu_items').insert(req.body).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/menu/:id
router.put('/:id', authMiddleware, async (req, res) => {
  if (!['admin', 'restaurant_owner'].includes(req.user.role))
    return res.status(403).json({ error: 'Forbidden' });

  const { data, error } = await supabase
    .from('menu_items')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// PATCH /api/menu/:id/availability
router.patch('/:id/availability', authMiddleware, async (req, res) => {
  if (!['admin', 'restaurant_owner'].includes(req.user.role))
    return res.status(403).json({ error: 'Forbidden' });

  const { data, error } = await supabase
    .from('menu_items')
    .update({ is_available: req.body.isAvailable })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE /api/menu/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  if (!['admin', 'restaurant_owner'].includes(req.user.role))
    return res.status(403).json({ error: 'Forbidden' });

  const { error } = await supabase.from('menu_items').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Menu item deleted' });
});

module.exports = router;
