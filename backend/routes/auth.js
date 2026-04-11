const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../supabase');
const ownerRestaurantMap = require('../ownerRestaurantMap');
const authMiddleware = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const role = 'customer';
  if (!name || !email || !password)
    return res.status(400).json({ error: 'name, email and password are required' });

  const passwordHash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert({ name, email, password_hash: passwordHash, role })
    .select('id, name, email, role')
    .single();

  if (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'Email already registered' });
    return res.status(500).json({ error: error.message });
  }

  const token = jwt.sign({ id: data.id, email: data.email, role: data.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ user: data, token });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'email and password are required' });

  const { data: user, error } = await supabase
    .from('users')
    .select('id, name, email, role, password_hash')
    .eq('email', email)
    .single();

  if (error || !user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  // If owner, fetch their restaurant_id
  let restaurantId = null;
  if (user.role === 'restaurant_owner') {
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    if (!restaurantError && restaurant?.id) {
      restaurantId = restaurant.id;
    } else {
      restaurantId = ownerRestaurantMap[user.email] || null;
    }
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, restaurantId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  const { password_hash, ...safeUser } = user;
  res.json({ user: { ...safeUser, restaurantId }, token });
});

// PATCH /api/auth/change-password
router.patch('/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'currentPassword and newPassword are required' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long' });
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('id, password_hash')
    .eq('id', req.user.id)
    .single();

  if (error || !user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  const nextHash = await bcrypt.hash(newPassword, 10);
  const { error: updateError } = await supabase
    .from('users')
    .update({ password_hash: nextHash })
    .eq('id', req.user.id);

  if (updateError) {
    return res.status(500).json({ error: updateError.message });
  }

  return res.json({ message: 'Password changed successfully' });
});

module.exports = router;
