if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
require('dns').setDefaultResultOrder?.('ipv4first');

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const productRoutes = require('./src/routes/productRoutes');
const authRoutes = require('./src/routes/authRoutes');
const shopifyService = require('./src/services/shopifyService');

const app = express();
const PORT = process.env.PORT || 5000;

let lastDbError = null;
let cachedDb = null;
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    lastDbError = 'MONGO_URI is missing';
    return;
  }
  
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (cachedDb) return await cachedDb;

  try {
    cachedDb = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    });
    const conn = await cachedDb;
    lastDbError = null;
    return conn;
  } catch (error) {
    cachedDb = null;
    lastDbError = error.message;
    throw error;
  }
};

// Make DB connection fail-safe so Shopify proxy still works
connectDB().catch(err => {
  console.error('[server] MongoDB connection failed, running in Shopify-only mode:', err.message);
});

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ name: 'ZARR Backend API', status: 'running' });
});

app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
  } catch (e) {
    lastDbError = e.message;
  }
  res.json({
    ok: true,
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    readyState: mongoose.connection.readyState,
    dbError: lastDbError,
    shopify: shopifyService.isConfigured() ? 'live' : 'mock',
  });
});

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[server] listening on http://0.0.0.0:${PORT}`);
  });
}

module.exports = app;
