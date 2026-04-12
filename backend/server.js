require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const allowedOrigins = ['http://localhost:8080', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser clients and configured local frontend origins.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

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

// Health check endpoint - should work even if dependencies are not fully initialized
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/restaurants', require('./routes/restaurants'));
  app.use('/api/menu', require('./routes/menu'));
  app.use('/api/orders', require('./routes/orders'));
} catch (err) {
  console.error('Error loading routes:', err.message);
  // Continue anyway so health check still works
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const BASE_PORT = Number(process.env.PORT) || 5000;
const MAX_PORT_ATTEMPTS = 10;
let server;

function startServer(port, attempt = 0) {
  server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Health check available at http://localhost:${port}/api/health`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && attempt < MAX_PORT_ATTEMPTS) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is in use, retrying on ${nextPort}...`);
      return startServer(nextPort, attempt + 1);
    }

    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
}

startServer(BASE_PORT);

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  if (!server) {
    process.exit(0);
  }

  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
