const router = require('express').Router();
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const generatePassword = (length = 12) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
};

const toEmailLocalPart = (name = '') => {
  const normalized = String(name).toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 20);
  return normalized || 'owner';
};

const generateUniqueOwnerEmail = async (restaurantName) => {
  const base = toEmailLocalPart(restaurantName);
  let suffix = 0;

  while (suffix < 1000) {
    const candidate = `${base}${suffix === 0 ? '' : suffix}@moodbyte.com`;
    const { data, error } = await supabase.from('users').select('id').eq('email', candidate).limit(1);

    if (error) {
      throw new Error(error.message || 'Failed to generate owner email');
    }

    if (!data || data.length === 0) {
      return candidate;
    }

    suffix += 1;
  }

  throw new Error('Could not allocate owner email');
};

const attachOwnerName = async (restaurants) => {
  if (!restaurants || restaurants.length === 0) return restaurants;

  const ownerIds = [...new Set(restaurants.map((restaurant) => restaurant.owner_id).filter(Boolean))];
  if (ownerIds.length === 0) return restaurants;

  const { data: owners, error } = await supabase
    .from('users')
    .select('id, name')
    .in('id', ownerIds);

  if (error || !owners) return restaurants;

  const ownerMap = new Map(owners.map((owner) => [owner.id, owner.name]));
  return restaurants.map((restaurant) => ({
    ...restaurant,
    owner_name: restaurant.owner_id ? (ownerMap.get(restaurant.owner_id) || '') : '',
  }));
};

const uploadDir = path.join(__dirname, '..', 'uploads', 'restaurants');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const safeExt = path.extname(file.originalname || '').toLowerCase() || '';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const assetType = String(req.query.assetType || 'image').toLowerCase();
    const ext = path.extname(file.originalname || '').toLowerCase();
    const allowedImageExt = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.svg', '.heic'];
    const allowedDocExt = ['.pdf', '.doc', '.docx'];
    const isImage = file.mimetype.startsWith('image/') || allowedImageExt.includes(ext);
    const isDocument =
      ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.mimetype)
      || allowedDocExt.includes(ext);

    if (assetType === 'document' && !isDocument) {
      return cb(new Error('Only PDF/DOC/DOCX documents are allowed for document uploads'));
    }

    if (assetType !== 'document' && !isImage) {
      return cb(new Error('Only image uploads are allowed for image assets'));
    }

    cb(null, true);
  },
});

// POST /api/restaurants/upload-asset — admin only
router.post('/upload-asset', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  upload.single('asset')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Upload failed' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    const assetType = String(req.query.assetType || 'image').toLowerCase();
    const assetUrl = `${req.protocol}://${req.get('host')}/uploads/restaurants/${req.file.filename}`;
    return res.status(201).json({ assetUrl, assetType, fileName: req.file.originalname });
  });
});

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

  const withOwnerName = await attachOwnerName(result);
  res.json(withOwnerName);
});

// GET /api/restaurants/:id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Restaurant not found' });

  const [withOwnerName] = await attachOwnerName([data]);
  res.json(withOwnerName);
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

  const restaurantName = String(req.body.name || '').trim();
  if (!restaurantName) {
    return res.status(400).json({ error: 'Restaurant name is required' });
  }

  try {
    const ownerName = String(req.body.owner_name || `${restaurantName} Owner`).trim();
    const ownerEmail = await generateUniqueOwnerEmail(restaurantName);
    const ownerPassword = generatePassword();
    const passwordHash = await bcrypt.hash(ownerPassword, 10);

    const { data: owner, error: ownerError } = await supabase
      .from('users')
      .insert({
        name: ownerName,
        email: ownerEmail,
        password_hash: passwordHash,
        role: 'restaurant_owner',
      })
      .select('id, name, email')
      .single();

    if (ownerError || !owner) {
      return res.status(500).json({ error: ownerError?.message || 'Failed to create restaurant owner account' });
    }

    const payload = {
      ...req.body,
      owner_id: owner.id,
      is_verified: false,
      verified_at: null,
    };
    delete payload.owner_name;

    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .insert(payload)
      .select()
      .single();

    if (restaurantError || !restaurant) {
      await supabase.from('users').delete().eq('id', owner.id);
      return res.status(500).json({ error: restaurantError?.message || 'Failed to create restaurant' });
    }

    return res.status(201).json({
      restaurant: {
        ...restaurant,
        owner_name: owner.name,
      },
      ownerCredentials: {
        name: owner.name,
        email: owner.email,
        password: ownerPassword,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to create restaurant' });
  }
});

// POST /api/restaurants/:id/reset-owner-password — admin only
router.post('/:id/reset-owner-password', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { data: restaurant, error: restaurantError } = await supabase
    .from('restaurants')
    .select('id, owner_id')
    .eq('id', req.params.id)
    .single();

  if (restaurantError || !restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }

  if (!restaurant.owner_id) {
    return res.status(400).json({ error: 'No owner account linked to this restaurant' });
  }

  const { data: owner, error: ownerError } = await supabase
    .from('users')
    .select('id, name, email, role')
    .eq('id', restaurant.owner_id)
    .single();

  if (ownerError || !owner || owner.role !== 'restaurant_owner') {
    return res.status(404).json({ error: 'Restaurant owner account not found' });
  }

  const password = generatePassword();
  const passwordHash = await bcrypt.hash(password, 10);

  const { error: updateError } = await supabase
    .from('users')
    .update({ password_hash: passwordHash })
    .eq('id', owner.id);

  if (updateError) {
    return res.status(500).json({ error: updateError.message });
  }

  return res.json({
    ownerCredentials: {
      name: owner.name,
      email: owner.email,
      password,
    },
  });
});

// PUT /api/restaurants/:id — admin or owner
router.put('/:id', authMiddleware, async (req, res) => {
  if (!['admin', 'restaurant_owner'].includes(req.user.role))
    return res.status(403).json({ error: 'Forbidden' });

  if (req.user.role === 'restaurant_owner' && req.user.restaurantId !== req.params.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const ownerName = String(req.body.owner_name || '').trim();

  if (req.user.role === 'admin' && ownerName) {
    const { data: existingRestaurant, error: existingError } = await supabase
      .from('restaurants')
      .select('owner_id')
      .eq('id', req.params.id)
      .single();

    if (existingError || !existingRestaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    if (existingRestaurant.owner_id) {
      const { error: ownerUpdateError } = await supabase
        .from('users')
        .update({ name: ownerName })
        .eq('id', existingRestaurant.owner_id);

      if (ownerUpdateError) {
        return res.status(500).json({ error: ownerUpdateError.message });
      }
    }
  }

  const payload = { ...req.body };
  delete payload.owner_name;
  if (req.user.role === 'restaurant_owner') {
    delete payload.is_verified;
    delete payload.verified_at;
    delete payload.owner_id;
  }

  const { data, error } = await supabase
    .from('restaurants')
    .update(payload)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  const [withOwnerName] = await attachOwnerName([data]);
  res.json(withOwnerName);
});

// DELETE /api/restaurants/:id — admin only
router.delete('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  const { error } = await supabase.from('restaurants').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Restaurant deleted' });
});

module.exports = router;
