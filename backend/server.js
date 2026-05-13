require('dotenv').config();

// Force IPv4-first DNS resolution. Many mobile networks (and some
// Wi-Fi setups) advertise IPv6 records but cannot actually route IPv6
// traffic, which causes outbound HTTPS calls (e.g. to Shopify) to time
// out. Node 17+ defaults to "verbatim" ordering which trips this; we
// override it so Shopify requests always resolve to an IPv4 address.
require('dns').setDefaultResultOrder?.('ipv4first');

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
    shopifyDomain: shopifyService.resolveDomain(),
    shopifyMode: shopifyService.isMockMode() ? 'mock.shop (demo)' : 'live',
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
  const domain = shopifyService.resolveDomain();
  if (shopifyService.isMockMode()) {
    console.log(
      `[server] shopify: using mock.shop (demo store, live data, no auth needed)`,
    );
  } else if (shopifyService.isConfigured()) {
    console.log(`[server] shopify: live store ${domain}`);
  } else {
    console.log(
      `[server] shopify: NOT configured (set SHOPIFY_STOREFRONT_ACCESS_TOKEN for ${domain})`,
    );
  }
});
