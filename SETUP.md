# ZARR — Backend + Mobile App Setup

This repo has two parts:

```
ZarrApp/
├── backend/      Node + Express + MongoDB + Shopify Storefront API
└── src/          React Native (Expo) mobile app
```

The mobile app works with **or without** the backend:

- **With backend running** → live products from Shopify + user accounts + JWT auth
- **Without backend** → mock data only, no auth (Login screen will show "Cannot reach server")

---

## 1. Backend

### a. Install
```bash
cd backend
npm install
```

### b. Configure `backend/.env`
Copy `.env.example` to `.env` and fill in the values that apply to you:

```env
PORT=5000

# Required for auth (register / login). Leave blank to run without auth.
MONGO_URI=mongodb://127.0.0.1:27017/zarr
# or MongoDB Atlas connection string

JWT_SECRET=change-this-in-production
JWT_EXPIRES_IN=30d

# Optional. If blank, /api/products returns [] and the mobile app falls back
# to its bundled mock catalogue automatically.
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=
```

#### Where to get the Shopify Storefront token
1. Open your Shopify admin → **Settings** → **Apps and sales channels** → **Develop apps**.
2. Click **Create app** → name it `ZARR Mobile` (or similar).
3. **Configure Storefront API access** → enable scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_collections`
4. Click **Install app** → copy the **Storefront API access token**.
5. Your store domain is `your-store.myshopify.com` (without `https://`).

### c. Run
```bash
npm run dev     # nodemon
# or
npm start
```

You should see:
```
[db] MongoDB connected: ...
[server] listening on http://0.0.0.0:5000
[server] shopify: configured
```

Health check: open `http://localhost:5000/api/health` — should return
```json
{ "ok": true, "shopifyConfigured": true, "db": "connected" }
```

### d. API endpoints
| Method | Path                                     | Description                  |
|--------|------------------------------------------|------------------------------|
| GET    | `/api/products`                          | All products                 |
| GET    | `/api/products/collections`              | All collections              |
| GET    | `/api/products/collections/:handle`      | Products in a collection     |
| GET    | `/api/products/:handle`                  | Single product               |
| POST   | `/api/auth/register`                     | `{name,email,password,phone}`|
| POST   | `/api/auth/login`                        | `{email,password}` → `{user,token}` |
| GET    | `/api/auth/me`                           | Bearer token → `{user}`      |
| PATCH  | `/api/auth/me`                           | Bearer token → update profile|

---

## 2. Mobile app

### a. Install
```bash
cd ZarrApp        # repo root
npm install
```

### b. Point the app at your backend

The app auto-detects the backend URL in this priority order:

1. **`extra.apiBaseUrl`** in `app.json` (most explicit)
2. The Expo dev server host on your LAN (works on **physical Expo Go devices**) — port `5000`
3. `http://10.0.2.2:5000` (Android emulator) or `http://localhost:5000` (iOS sim / web)

So **on a physical phone in Expo Go**, just make sure your phone and laptop are on the same Wi-Fi and the backend is running on port 5000 — no config needed.

To override, edit `app.json`:
```json
"extra": { "apiBaseUrl": "http://192.168.1.42:5000" }
```

### c. Run
```bash
npx expo start --lan --clear
```
Scan the QR code in Expo Go. The home screen will:
- Try fetching live products from your backend
- Fall back to mock data if the backend is unreachable
- Show a pink banner "Showing offline preview…" so you know which mode you're in

### d. Auth flow
- Tap the **person icon** in the header → `Login` screen
- Tap **Create account** → `Register` screen (calls `POST /api/auth/register`)
- Once signed in, tapping the person icon goes to the **Account** screen
- Token is stored in `AsyncStorage` and replayed automatically on every API call
- Tapping **SIGN OUT** clears the token and returns you to Home

---

## 3. Troubleshooting

| Symptom | Fix |
|---|---|
| `Cannot reach server.` on Login | Backend not running, or wrong host. Check `http://localhost:5000/api/health` in a browser. On phone, override `extra.apiBaseUrl` in `app.json` with your laptop's LAN IP. |
| `Auth unavailable — database is not connected` | Set `MONGO_URI` in `backend/.env`, then restart the backend. |
| Products empty after login but backend "ok" | Shopify token not configured. Either add `SHOPIFY_STORE_DOMAIN` + `SHOPIFY_STOREFRONT_ACCESS_TOKEN` to `backend/.env`, or accept the mock-data fallback. |
| `react-native-gesture-handler` not installed | Run `npm install` again in the repo root. |
| `String cannot be cast to Boolean` on Android | Native lib version mismatch — run `npx expo install --check` and accept fixes, then `npx expo start --clear`. |

---

## 4. Project structure

### Backend
```
backend/
├── server.js                       app entry + route mounting
└── src/
    ├── config/db.js                Mongo connection (graceful)
    ├── middleware/auth.js          JWT verify middleware
    ├── models/User.js              User schema + bcrypt hashing
    ├── controllers/
    │   ├── authController.js       register / login / me / updateMe
    │   └── productController.js    proxy to shopifyService
    ├── routes/
    │   ├── authRoutes.js
    │   └── productRoutes.js
    └── services/shopifyService.js  Storefront API GraphQL client
```

### Frontend
```
src/
├── config/env.ts                 Auto-detect API_BASE_URL
├── services/api.ts               axios client + token interceptor + endpoints
├── context/AuthContext.tsx       Auth provider, persistent token in AsyncStorage
├── hooks/useProducts.ts          useHomeFeed / useCollectionProducts / useProduct / useCollections
├── screens/
│   ├── HomeScreen.tsx            Pull-to-refresh, offline banner, auth-aware header
│   ├── CollectionScreen.tsx      Live data + filter + sort + pull-to-refresh
│   ├── ProductDetailScreen.tsx   Live data + pull-to-refresh + auth-aware person icon
│   ├── LoginScreen.tsx           Email + password
│   ├── RegisterScreen.tsx        Name + email + phone + password
│   └── AccountScreen.tsx         Profile + sign-out + quick links
├── components/                   Shared UI (Header, ProductCard, Footer, …)
├── data/                         Mock catalogue used as offline fallback
├── theme/                        Colours, spacing, typography
└── types/                        Product, Collection, navigation types
```
