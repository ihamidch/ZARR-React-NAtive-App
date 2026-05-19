const axios = require('axios');
const https = require('https');

// Force IPv4 on outbound HTTPS calls. Many mobile / shared networks
// (especially phone tethering) advertise IPv6 records they can't actually
// route, causing axios to hang on ETIMEDOUT. Pinning the agent to family:4
// makes Shopify requests reliable on any network.
const ipv4Agent = new https.Agent({ family: 4, keepAlive: true });

// Most Shopify stores expose their public catalog as JSON without any
// authentication via the following REST endpoints (used by every Shopify
// storefront theme):
//
//   GET /products.json?limit=N
//   GET /products/{handle}.json
//   GET /collections.json?limit=N
//   GET /collections/{handle}/products.json?limit=N
//
// We use these here so the app shows REAL store data (zarr.com.pk by
// default) without needing the Storefront API access token.

const DEFAULT_DOMAIN = 'zarr.com.pk';
const PLACEHOLDER_DOMAINS = new Set([
  '',
  'your-shop-name.myshopify.com',
  'your-store.myshopify.com',
  'mock.shop',
]);

const resolveDomain = () => {
  const raw = (process.env.SHOPIFY_STORE_DOMAIN || '').trim();
  if (PLACEHOLDER_DOMAINS.has(raw)) return DEFAULT_DOMAIN;
  return raw;
};

const isShopifyConfigured = () => true; // REST is always available
const isMockMode = () => false;

const client = () =>
  axios.create({
    baseURL: `https://${resolveDomain()}`,
    timeout: 20000,
    headers: {
      Accept: 'application/json',
      'User-Agent':
        'Mozilla/5.0 (ZARR-Mobile-App) AppleWebKit/537.36 Chrome/120 Safari/537.36',
    },
    httpsAgent: ipv4Agent,
  });

// Simple in-memory cache to make the app fast and avoid Shopify rate limits
const cache = {
  store: new Map(),
  ttl: 5 * 60 * 1000, // 5 minutes
  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  },
  set(key, value) {
    this.store.set(key, {
      value,
      expiry: Date.now() + this.ttl,
    });
  },
};

// ---------- helpers ----------

const stripHtml = (s = '') =>
  String(s)
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Shopify's REST endpoints return product `tags` as an array on
// /products.json but as a comma-separated string on /products/{handle}.json.
// Normalise both forms.
const normaliseTags = (tags) => {
  if (Array.isArray(tags)) return tags.map((t) => String(t));
  if (typeof tags === 'string')
    return tags.split(',').map((t) => t.trim()).filter(Boolean);
  return [];
};

const detectCategory = (tags, productType = '') => {
  const list = normaliseTags(tags);
  const lower = [
    ...list.map((t) => t.toLowerCase()),
    String(productType).toLowerCase(),
  ];
  const hasMen = lower.some((t) => /\b(men|mens|man)\b/i.test(t));
  const hasWomen = lower.some((t) => /\b(women|womens|woman|ladies)\b/i.test(t));
  if (hasMen && !hasWomen) return 'men';
  if (hasWomen) return 'women';
  return 'women';
};

// Build a deterministic hex from a color name so the swatch dot is roughly
// the right tone even when the store uses unusual color labels.
const COLOR_PALETTE = {
  white: '#F0EDE6',
  ivory: '#EFE7D7',
  cream: '#E8DCC0',
  beige: '#D7C9AE',
  nude: '#D9C2A9',
  black: '#0E0E0E',
  charcoal: '#2B2B2B',
  grey: '#8A8A8A',
  gray: '#8A8A8A',
  silver: '#BFBFBF',
  red: '#B73A3A',
  maroon: '#6B1B22',
  rust: '#B86341',
  pink: '#E8AFBE',
  hotpink: '#E64A89',
  rose: '#C84B6E',
  fuchsia: '#C8336B',
  peach: '#F2B597',
  orange: '#D67D3C',
  mustard: '#C9933F',
  yellow: '#E8C547',
  gold: '#B68A5C',
  green: '#5C7A3C',
  olive: '#6B6F3A',
  emerald: '#2E7A4E',
  mint: '#A3D9B1',
  teal: '#2F7A78',
  blue: '#2E4A6B',
  navy: '#1B2A49',
  skyblue: '#6FB1D9',
  purple: '#5E3A8E',
  lavender: '#A89BC9',
  brown: '#6E4B2A',
  tan: '#B89372',
  multi: '#999999',
};

const colourHex = (name) => {
  const key = String(name || '')
    .toLowerCase()
    .replace(/\s+/g, '');
  return COLOR_PALETTE[key] || '#9A9A9A';
};

const uniqueSizes = (variants = []) => {
  const set = new Set();
  for (const v of variants) {
    const candidate = v.option1 || v.option2 || v.title;
    if (!candidate) continue;
    if (/^[a-z0-9 \/-]{1,10}$/i.test(String(candidate))) {
      set.add(String(candidate).split(' /')[0]);
    }
  }
  return [...set];
};

const uniqueColors = (variants = []) => {
  const seen = new Map();
  for (const v of variants) {
    const name = v.option2;
    if (!name) continue;
    const key = String(name).toLowerCase();
    if (seen.has(key)) continue;
    seen.set(key, { name, hex: colourHex(name) });
  }
  return [...seen.values()];
};

// Real Pakistani fashion brands carried on ZARR (and similar marketplaces).
// Keys are normalised lowercase, values are the canonical display name.
const KNOWN_BRANDS = {
  'junaid jamshed': 'Junaid Jamshed',
  'junaid-jamshed': 'Junaid Jamshed',
  jj: 'Junaid Jamshed',
  'sana safinaz': 'Sana Safinaz',
  'sana-safinaz': 'Sana Safinaz',
  'sana-safinas': 'Sana Safinaz',
  bandana: 'Bandana',
  bandanapk: 'Bandana',
  amoi: 'Amoi',
  azure: 'Azure',
  anchor: 'Anchor',
  mushq: 'Mushq',
  ego: 'Ego',
  sapphire: 'Sapphire',
  beechtree: 'Beechtree',
  'gul ahmed': 'Gul Ahmed',
  khaadi: 'Khaadi',
  'lime light': 'Lime Light',
  limelight: 'Lime Light',
  'maria b': 'Maria B',
  'maria-b': 'Maria B',
  kayseria: 'Kayseria',
  'naya dour': 'Naya Dour',
  'naya-dour': 'Naya Dour',
  koel: 'Koel',
  insignia: 'Insignia',
  'insignia-pk': 'Insignia',
  manto: 'Manto',
  'manto-online': 'Manto',
  lakhanay: 'Lakhanay',
  astoria: 'Astoria',
  'beyond east': 'Beyond East',
  beyondeast: 'Beyond East',
  dynasty: 'Dynasty',
  ismail: 'Ismail',
  'cross stitch': 'Cross Stitch',
  'cross-stitch': 'Cross Stitch',
  'taana baana': 'Taana Baana',
  'taana-baana': 'Taana Baana',
  almirah: 'Almirah',
  generation: 'Generation',
  alkaram: 'Al Karam',
  'al karam': 'Al Karam',
  'al-karam': 'Al Karam',
  warda: 'Warda',
  zellbury: 'Zellbury',
  origins: 'Origins',
  bonanza: 'Bonanza',
  'bonanza satrangi': 'Bonanza Satrangi',
  outfitters: 'Outfitters',
  edenrobe: 'Edenrobe',
  rang: 'Rang',
  'hussain rehar': 'Hussain Rehar',
  'gulaal pk': 'Gulaal',
  gulaal: 'Gulaal',
  shehrnaz: 'Shehrnaz',
  motifz: 'Motifz',
  zara: 'Zara',
  charizma: 'Charizma',
  saadia: 'Saadia Asad',
  'saadia asad': 'Saadia Asad',
  zaha: 'Zaha',
  agha: 'Agha Noor',
  'agha noor': 'Agha Noor',
};

// Words that look like brands but are actually categories or generic terms.
// We never treat any of these as a brand.
const NOT_BRANDS = new Set([
  'accessories',
  'shoes',
  'footwear',
  'beauty',
  'makeup',
  'skincare',
  'eastern',
  'western',
  'unstitched',
  'stitched',
  'ready to wear',
  'ready-to-wear',
  'rtw',
  'unstitched / rtw',
  'loungewear',
  'modestwear',
  'lawn',
  'kids',
  'women',
  'men',
  'unisex',
  'grooming',
  'kurta',
  'kameez',
  'shalwar',
  'shirt',
  'shirts',
  'pants',
  'fragrances',
  'fragrance',
  'dresses',
  'dupattas',
  'shawls',
  'sale',
  'new arrivals',
  'featured',
  'dresses & jumpsuits',
  'dresses and jumpsuits',
  'hoodies & sweatshirts',
  'shoes & footwear',
  'tops',
  'bottoms',
  'jewellery',
  'jewelry',
  'bags',
]);

const looksLikeCode = (s) =>
  !!s &&
  s.length <= 16 &&
  /^[a-f0-9]{2,}-[a-f0-9]{2,}/i.test(s); // e.g. "6c6d15-63"

const properCase = (s) =>
  String(s)
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');

const findKnownBrand = (text) => {
  if (!text) return null;
  const lower = String(text).toLowerCase().trim();
  if (KNOWN_BRANDS[lower]) return KNOWN_BRANDS[lower];
  // Prefix match: "sana-safinas-mean3" → starts with "sana-safinas" → Sana Safinaz
  for (const key of Object.keys(KNOWN_BRANDS)) {
    if (lower.startsWith(key + '-') || lower.startsWith(key + ' ')) {
      return KNOWN_BRANDS[key];
    }
  }
  return null;
};

const cleanVendorName = (v) => {
  if (!v) return null;
  const trimmed = String(v).trim();
  const lower = trimmed.toLowerCase();
  if (NOT_BRANDS.has(lower)) return null;
  if (looksLikeCode(lower)) return null;

  const known = findKnownBrand(trimmed);
  if (known) return known;

  // "manto-online", "insignia-pk" → take the first slug part if it's a
  // real word (vowel + reasonable length), else give up.
  if (/^[a-z0-9\-]+$/.test(lower) && lower.includes('-')) {
    const head = lower.split('-')[0];
    if (head.length >= 3 && /[aeiou]/.test(head)) return properCase(head);
    return null;
  }

  // Looks like a normal name (has vowels, reasonable length).
  if (/[aeiou]/i.test(trimmed) && trimmed.length >= 3 && trimmed.length <= 30) {
    return properCase(trimmed);
  }
  return null;
};

const pickBrand = (vendor, productType, tags, title) => {
  const fromVendor = cleanVendorName(vendor);
  if (fromVendor) return fromVendor;

  const tagList = normaliseTags(tags);
  for (const t of tagList) {
    const known = findKnownBrand(t);
    if (known) return known;
  }

  if (title) {
    const firstWord = String(title).split(/[\s\-]/)[0];
    const known = findKnownBrand(firstWord);
    if (known) return known;
  }
  return undefined;
};

// Friendly category label derived from product_type / tags. Used as a
// neutral metadata field — NEVER displayed as a brand.
const pickType = (productType, tags) => {
  if (productType && productType.length < 40) return productType;
  const tagList = normaliseTags(tags);
  const niceType = tagList.find((t) => NOT_BRANDS.has(t.toLowerCase()));
  return niceType ? properCase(niceType) : undefined;
};

const mapProduct = (p) => {
  if (!p) return null;
  const first = p.variants?.[0];
  const price = parseFloat(first?.price || 0);
  const compareAt = parseFloat(first?.compare_at_price || 0);
  const images = (p.images || []).map((i) => i.src).filter(Boolean);
  const brand = pickBrand(p.vendor, p.product_type, p.tags, p.title);
  const type = pickType(p.product_type, p.tags);
  return {
    id: p.handle,
    handle: p.handle,
    title: p.title,
    description: stripHtml(p.body_html),
    price,
    originalPrice: compareAt > price ? compareAt : undefined,
    discountPercent:
      compareAt > price ? Math.round((1 - price / compareAt) * 100) : undefined,
    image: images[0] || '',
    gallery: images,
    category: detectCategory(p.tags, p.product_type),
    tags: normaliseTags(p.tags),
    brand,
    type,
    inStock: (p.variants || []).some((v) => v.available !== false),
    taxIncluded: true,
    sizes: uniqueSizes(p.variants),
    colors: uniqueColors(p.variants),
    color: first?.option2 || undefined,
    fabric: undefined,
    work: type,
    collectionId: p.handle,
    specs: [
      brand && { label: 'Brand', value: brand },
      type && { label: 'Type', value: type },
      first?.sku && { label: 'SKU', value: first.sku },
    ].filter(Boolean),
  };
};

const mapCollection = (c) => ({
  id: c.handle,
  handle: c.handle,
  title: c.title,
  description: stripHtml(c.description),
  image: c.image?.src || '',
  bannerImage: c.image?.src || '',
  productsCount: c.products_count,
});

// ---------- public API ----------

const shopifyService = {
  isConfigured: isShopifyConfigured,
  resolveDomain,
  isMockMode,

  getProducts: async () => {
    const cacheKey = 'all_products';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const { data } = await client().get('/products.json', {
        params: { limit: 250 },
      });
      const results = (data.products || []).map(mapProduct).filter(Boolean);
      cache.set(cacheKey, results);
      return results;
    } catch (error) {
      console.error('[shopify] getProducts:', error.message);
      throw error;
    }
  },

  getProductByHandle: async (handle) => {
    const cacheKey = `product_${handle}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const { data } = await client().get(
        `/products/${encodeURIComponent(handle)}.json`,
      );
      const result = mapProduct(data.product);
      cache.set(cacheKey, result);
      return result;
    } catch (error) {
      if (error.response?.status === 404) return null;
      console.error(`[shopify] getProductByHandle(${handle}):`, error.message);
      return null;
    }
  },

  getCollections: async () => {
    const cacheKey = 'collections_v3_lifestyle'; // Force refresh with new key
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const { data } = await client().get('/collections.json', {
        params: { limit: 40 },
      });
      
      const rawCollections = data.collections || [];
      const collections = rawCollections.map(mapCollection);

      // To ensure a "proper look" with lifestyle photography, we fetch the first 
      // actual product image for every collection in the featured section.
      const enrichedCollections = await Promise.all(
        collections.slice(0, 12).map(async (c) => {
          try {
            // Fetch the first product to get a real lifestyle image (person wearing clothes)
            const { data: pData } = await client().get(
              `/collections/${encodeURIComponent(c.handle)}/products.json`,
              { params: { limit: 1 } }
            );
            
            const firstProduct = pData.products?.[0];
            if (firstProduct && firstProduct.images?.[0]?.src) {
              // We use the product image as the primary "lifestyle" image
              // but keep the original collection image as the banner if needed.
              return {
                ...c,
                image: firstProduct.images[0].src, 
                bannerImage: c.image || firstProduct.images[0].src,
              };
            }
          } catch (e) {
            console.warn(`[shopify] Failed to enrichment for ${c.handle}:`, e.message);
          }
          return c;
        })
      );

      // Only show collections that have an image (either their own or from a product)
      const results = enrichedCollections.filter(c => c.image && c.image !== '');
      
      cache.set(cacheKey, results);
      return results;
    } catch (error) {
      console.error('[shopify] getCollections:', error.message);
      throw error;
    }
  },

  // Curated "Shop By Type" — maps user-friendly category labels to the best
  // matching collection in the store. Falls back gracefully if a given type
  // isn't represented (e.g. shops without an Accessories collection).
  getCategoryShortcuts: async () => {
    const cacheKey = 'category_shortcuts_v12_lifestyle';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const TYPES = [
      {
        id: 'women',
        label: 'Women',
        match: [/^women(-|$)/i, /\bwomen-western\b/i, /-women-/i],
      },
      {
        id: 'men',
        label: 'Men',
        match: [/^men(-|$)/i, /\b-men-\b/i, /-men-western\b/i],
      },
      {
        id: 'accessories',
        label: 'Accessories',
        match: [/\baccessor/i],
      },
      {
        id: 'eastern',
        label: 'Eastern',
        match: [/\beast/i],
      },
      {
        id: 'western',
        label: 'Western',
        match: [/\bwestern\b/i],
      },
      {
        id: 'lawn',
        label: 'Lawn',
        match: [/\blawn\b/i],
      },
      {
        id: 'modestwear',
        label: 'Modestwear',
        match: [/\bmodest/i],
      },
      {
        id: 'loungewear',
        label: 'Loungewear',
        match: [/\bloung/i],
      },
      {
        id: 'kids',
        label: 'Kids',
        match: [/\bkids\b/i, /\bgirls\b/i, /\bboys\b/i],
      },
      {
        id: 'beauty',
        label: 'Beauty',
        match: [/\bbeauty\b/i, /\bmakeup\b/i, /\bskincare\b/i],
      },
      {
        id: 'dresses',
        label: 'Dresses',
        match: [/\bdresses?\b/i, /\bjumpsuits?\b/i],
      },
      {
        id: 'dupattas',
        label: 'Dupattas',
        match: [/\bdupatta/i, /\bshawl/i, /\bveil/i],
      },
      {
        id: 'sale',
        label: 'Sale',
        match: [/-off$/i, /\bsale\b/i, /-sale\b/i],
      },
    ];

    let collections = [];
    try {
      const { data } = await client().get('/collections.json', {
        params: { limit: 250 },
      });
      collections = (data.collections || [])
        .filter((c) => c.image?.src)
        .map((c) => ({
          handle: c.handle,
          title: c.title,
          image: c.image.src,
          productsCount: c.products_count || 0,
        }));
    } catch (error) {
      console.error('[shopify] getCategoryShortcuts:', error.message);
      return [];
    }

    const result = [];
    for (const type of TYPES) {
      const matches = collections.filter((c) =>
        type.match.some(
          (re) => re.test(c.handle) || re.test(c.title),
        ),
      );
      if (!matches.length) continue;
      // Pick the collection with the most products (most representative).
      // Pick the collection with the most products (most representative).
      const sorted = [...matches].sort((a, b) => b.productsCount - a.productsCount);
      const best = sorted[0];

      // Enrich with the first product image to get a clean lifestyle shot (no text overlay)
      let cleanImage = best.image;
      let chosenHandle = best.handle;
      let chosenProductsCount = best.productsCount;

      for (const candidate of sorted) {
        try {
          const { data: pData } = await client().get(
            `/collections/${encodeURIComponent(candidate.handle)}/products.json`,
            { params: { limit: 1 } }
          );
          const firstProduct = pData.products?.[0];
          if (firstProduct && firstProduct.images?.[0]?.src) {
            cleanImage = firstProduct.images[0].src;
            chosenHandle = candidate.handle;
            chosenProductsCount = candidate.productsCount;
            break;
          }
        } catch (e) {
          // Try next candidate
        }
      }

      // If we still have a text-heavy collection banner image, search all products for a lifestyle shot
      if (cleanImage === best.image || cleanImage.includes('/collections/')) {
        try {
          const { data: pData } = await client().get('/products.json', {
            params: { limit: 250 },
          });
          const mapped = (pData.products || []).map(mapProduct).filter(Boolean);
          let matchProduct = mapped.find(p => {
            const cat = String(p.category || '').toLowerCase();
            const typeStr = String(p.type || '').toLowerCase();
            const id = String(type.id).toLowerCase();
            
            const catClean = cat.replace(/[\s\-]/g, '');
            const typeStrClean = typeStr.replace(/[\s\-]/g, '');
            const idClean = id.replace(/[\s\-]/g, '');
            
            const match = catClean === idClean || 
                          typeStrClean.includes(idClean) || 
                          (p.tags && p.tags.some(t => {
                            const cleanTag = String(t).toLowerCase().replace(/[\s\-]/g, '');
                            return cleanTag.includes(idClean) || 
                                   idClean.includes(cleanTag) || 
                                   (idClean === 'loungewear' && cleanTag.includes('loung'));
                          }));
            return match;
          });
          
          const idClean = String(type.id).toLowerCase().replace(/[\s\-]/g, '');
          if (!matchProduct && (idClean === 'loungewear' || idClean === 'modestwear')) {
            // Fallback to a gorgeous women's apparel lifestyle photo
            matchProduct = mapped.find(p => String(p.category || '').toLowerCase() === 'women');
          }
          if (!matchProduct) {
            matchProduct = mapped[0]; // Absolute fallback to first product
          }
          
          if (matchProduct && matchProduct.image) {
            cleanImage = matchProduct.image;
          }
        } catch (err) {
          console.error('[shopify] getCategoryShortcuts fallback error:', err.message);
        }
      }

      result.push({
        id: type.id,
        label: type.label,
        handle: chosenHandle,
        image: cleanImage,
        productsCount: chosenProductsCount,
      });
    }
    cache.set(cacheKey, result);
    return result;
  },

  getProductsByCollection: async (handle) => {
    const cacheKey = `collection_products_${handle}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const { data } = await client().get(
        `/collections/${encodeURIComponent(handle)}/products.json`,
        { params: { limit: 250 } },
      );
      const results = (data.products || []).map(mapProduct).filter(Boolean);
      cache.set(cacheKey, results);
      return results;
    } catch (error) {
      console.error(
        `[shopify] getProductsByCollection(${handle}):`,
        error.message,
      );
      return [];
    }
  },
  getBrands: async () => {
    try {
      const products = await shopifyService.getProducts();
      if (!products || !Array.isArray(products)) return [];
      
      // Extract unique vendors and filter out any empty ones
      const vendors = [...new Set(products.map(p => p.vendor || p.brand).filter(Boolean))];
      
      // Map to a consistent brand object
      return vendors.sort().map(name => ({
        id: name,
        title: name,
        handle: name,
        image: null // We can add logo mapping here if needed
      }));
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  },
};

module.exports = shopifyService;
