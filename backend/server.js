require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Food Zen Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/register, /api/auth/login',
      restaurants: '/api/restaurants',
      menu: '/api/restaurants/:id/menu',
      orders: '/api/orders'
    },
    health: '/api/health'
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
