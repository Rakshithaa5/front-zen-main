const router = require('express').Router();
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getRestaurantById, evaluateRestaurantOperationalState } = require('../utils/restaurantAccess');

const uploadDir = path.join(__dirname, '..', 'uploads', 'menu');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const safeExt = path.extname(file.originalname || '').toLowerCase() || '.jpg';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image uploads are allowed'));
    }
    cb(null, true);
  },
});

// POST /api/menu/upload-image — admin or owner
router.post('/upload-image', authMiddleware, async (req, res) => {
  if (!['admin', 'restaurant_owner'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.user.role === 'restaurant_owner') {
    if (!req.user.restaurantId) {
      return res.status(403).json({ error: 'No restaurant assigned to this account' });
    }

    const { restaurant, error: restaurantError } = await getRestaurantById(req.user.restaurantId);
    if (restaurantError || !restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const { isOperational } = evaluateRestaurantOperationalState(restaurant);
    if (!isOperational) {
      return res.status(403).json({ error: 'Restaurant is disabled or unverified. Menu changes are blocked.' });
    }
  }

  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Upload failed' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/menu/${req.file.filename}`;
    return res.status(201).json({ imageUrl });
  });
});

// POST /api/menu — admin or owner
router.post('/', authMiddleware, async (req, res) => {
  if (!['admin', 'restaurant_owner'].includes(req.user.role))
    return res.status(403).json({ error: 'Forbidden' });

  if (req.user.role === 'restaurant_owner') {
    if (!req.user.restaurantId) {
      return res.status(403).json({ error: 'No restaurant assigned to this account' });
    }

    req.body.restaurant_id = req.user.restaurantId;

    const { restaurant, error: restaurantError } = await getRestaurantById(req.user.restaurantId);
    if (restaurantError || !restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const { isOperational } = evaluateRestaurantOperationalState(restaurant);
    if (!isOperational) {
      return res.status(403).json({ error: 'Restaurant is disabled or unverified. Menu changes are blocked.' });
    }
  }

  const { data, error } = await supabase.from('menu_items').insert(req.body).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/menu/:id
router.put('/:id', authMiddleware, async (req, res) => {
  if (!['admin', 'restaurant_owner'].includes(req.user.role))
    return res.status(403).json({ error: 'Forbidden' });

  const { data: existingItem, error: fetchError } = await supabase
    .from('menu_items')
    .select('id, restaurant_id')
    .eq('id', req.params.id)
    .single();

  if (fetchError || !existingItem) {
    return res.status(404).json({ error: 'Menu item not found' });
  }

  if (req.user.role === 'restaurant_owner') {
    if (!req.user.restaurantId || existingItem.restaurant_id !== req.user.restaurantId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { restaurant, error: restaurantError } = await getRestaurantById(existingItem.restaurant_id);
    if (restaurantError || !restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const { isOperational } = evaluateRestaurantOperationalState(restaurant);
    if (!isOperational) {
      return res.status(403).json({ error: 'Restaurant is disabled or unverified. Menu changes are blocked.' });
    }
  }

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

  const { data: existingItem, error: fetchError } = await supabase
    .from('menu_items')
    .select('id, restaurant_id')
    .eq('id', req.params.id)
    .single();

  if (fetchError || !existingItem) {
    return res.status(404).json({ error: 'Menu item not found' });
  }

  if (req.user.role === 'restaurant_owner') {
    if (!req.user.restaurantId || existingItem.restaurant_id !== req.user.restaurantId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { restaurant, error: restaurantError } = await getRestaurantById(existingItem.restaurant_id);
    if (restaurantError || !restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const { isOperational } = evaluateRestaurantOperationalState(restaurant);
    if (!isOperational) {
      return res.status(403).json({ error: 'Restaurant is disabled or unverified. Menu changes are blocked.' });
    }
  }

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

  const { data: existingItem, error: fetchError } = await supabase
    .from('menu_items')
    .select('id, restaurant_id')
    .eq('id', req.params.id)
    .single();

  if (fetchError || !existingItem) {
    return res.status(404).json({ error: 'Menu item not found' });
  }

  if (req.user.role === 'restaurant_owner') {
    if (!req.user.restaurantId || existingItem.restaurant_id !== req.user.restaurantId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { restaurant, error: restaurantError } = await getRestaurantById(existingItem.restaurant_id);
    if (restaurantError || !restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const { isOperational } = evaluateRestaurantOperationalState(restaurant);
    if (!isOperational) {
      return res.status(403).json({ error: 'Restaurant is disabled or unverified. Menu changes are blocked.' });
    }
  }

  const { error } = await supabase.from('menu_items').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Menu item deleted' });
});

module.exports = router;
