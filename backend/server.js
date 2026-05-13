require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const productRoutes = require('./src/routes/productRoutes');
const authRoutes = require('./src/routes/authRoutes');
const shopifyService = require('./src/services/shopifyService');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({
    name: 'ZARR Backend API',
    status: 'running',
    shopifyConfigured: shopifyService.isConfigured(),
    docs: {
      products: 'GET /api/products',
      collections: 'GET /api/products/collections',
      collectionProducts: 'GET /api/products/collections/:handle',
      productDetail: 'GET /api/products/:handle',
      authRegister: 'POST /api/auth/register',
      authLogin: 'POST /api/auth/login',
      authMe: 'GET /api/auth/me  (Bearer token)',
      authUpdate: 'PATCH /api/auth/me  (Bearer token)',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    shopifyConfigured: shopifyService.isConfigured(),
    db:
      require('mongoose').connection.readyState === 1
        ? 'connected'
        : 'disconnected',
  });
});

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] listening on http://0.0.0.0:${PORT}`);
  console.log(
    `[server] shopify: ${shopifyService.isConfigured() ? 'configured' : 'NOT configured (set SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env to enable live products)'}`,
  );
});
