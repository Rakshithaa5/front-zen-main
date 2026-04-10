const router = require('express').Router();
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

  if (req.user.role === 'restaurant_owner' && req.user.restaurantId !== req.params.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const payload = { ...req.body };
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
