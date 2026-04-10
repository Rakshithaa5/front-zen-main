const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../supabase');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role = 'customer' } = req.body;
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
    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('id')
      .eq('owner_id', user.id)
      .single();
    restaurantId = restaurant?.id || null;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, restaurantId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  const { password_hash, ...safeUser } = user;
  res.json({ user: { ...safeUser, restaurantId }, token });
});

module.exports = router;
