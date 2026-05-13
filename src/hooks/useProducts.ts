import { useCallback, useEffect, useState } from 'react';
import { productApi } from '../services/api';
import {
  allProducts as mockAll,
  getCollectionById as mockGetCollection,
  getProductById as mockGetProduct,
  getProductsByCollection as mockGetCollectionProducts,
  popularMen as mockPopMen,
  popularWomen as mockPopWomen,
  saleMen as mockSaleMen,
  saleWomen as mockSaleWomen,
} from '../data';
import type { Collection, Product } from '../types';

type Status = 'idle' | 'loading' | 'ready' | 'error';

type Result<T> = {
  data: T;
  status: Status;
  error: string | null;
  source: 'live' | 'mock';
  refresh: () => Promise<void>;
};

const normaliseProduct = (raw: any): Product => ({
  id: String(raw.id ?? raw.handle ?? Math.random()),
  title: raw.title ?? '',
  price: Number(raw.price ?? 0),
  originalPrice: raw.originalPrice ? Number(raw.originalPrice) : undefined,
  discountPercent: raw.discountPercent
    ? Number(raw.discountPercent)
    : undefined,
  image: raw.image ?? raw.gallery?.[0] ?? '',
  gallery: Array.isArray(raw.gallery) && raw.gallery.length ? raw.gallery : undefined,
  category: raw.category === 'men' ? 'men' : 'women',
  description: raw.description ?? undefined,
  sizes: Array.isArray(raw.sizes) ? raw.sizes : undefined,
  colors: Array.isArray(raw.colors) ? raw.colors : undefined,
  collectionId: raw.collectionId ?? raw.handle ?? undefined,
  inStock: raw.inStock,
  taxIncluded: raw.taxIncluded ?? true,
  fabric: raw.fabric,
  work: raw.work,
  color: raw.color,
  specs: Array.isArray(raw.specs) ? raw.specs : undefined,
  brand: raw.brand,
  type: raw.type,
});

const normaliseCollection = (raw: any): Collection => ({
  id: String(raw.id ?? raw.handle ?? Math.random()),
  title: raw.title ?? '',
  image: raw.image ?? '',
  description: raw.description,
  brand: raw.brand,
  bannerImage: raw.bannerImage,
});

export type HomeFeed = {
  popularWomen: Product[];
  popularMen: Product[];
  saleWomen: Product[];
  saleMen: Product[];
};

const MOCK_FEED: HomeFeed = {
  popularWomen: mockPopWomen,
  popularMen: mockPopMen,
  saleWomen: mockSaleWomen,
  saleMen: mockSaleMen,
};

export const useHomeFeed = (): Result<HomeFeed> => {
  const [data, setData] = useState<HomeFeed>(MOCK_FEED);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'live' | 'mock'>('mock');

  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const raw: any[] = await productApi.getProducts();
      if (!Array.isArray(raw) || raw.length === 0) {
        setData(MOCK_FEED);
        setSource('mock');
        setStatus('ready');
        return;
      }
      const products = raw.map(normaliseProduct);
      let women = products.filter((p) => p.category === 'women');
      let men = products.filter((p) => p.category === 'men');
      // If one category is empty, reuse the other so every rail stays live.
      if (!women.length && men.length) women = men;
      if (!men.length && women.length) men = women;
      const onSale = (list: Product[]) =>
        list.filter((p) => !!p.discountPercent);
      // If the live store has no discounts, surface a curated "new in" slice
      // instead so the sale rails are still populated with REAL products.
      const saleWomen = onSale(women).length ? onSale(women) : women.slice(0, 6);
      const saleMen = onSale(men).length ? onSale(men) : men.slice(0, 6);
      setData({
        popularWomen: women,
        popularMen: men,
        saleWomen,
        saleMen,
      });
      setSource('live');
      setStatus('ready');
    } catch (err: any) {
      setData(MOCK_FEED);
      setSource('mock');
      setError(err?.message ?? 'Failed to fetch — showing offline data');
      setStatus('ready');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, status, error, source, refresh: load };
};

export const useCollectionProducts = (
  collectionId: string,
  isCategory: boolean,
): Result<{ products: Product[]; collection: Collection | undefined }> => {
  const [products, setProducts] = useState<Product[]>([]);
  const [collection, setCollection] = useState<Collection | undefined>(
    mockGetCollection(collectionId),
  );
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'live' | 'mock'>('mock');

  const mockResolve = useCallback((): Product[] => {
    if (isCategory) {
      if (collectionId === 'kids') return [];
      return mockAll.filter((p) => p.category === collectionId);
    }
    if (collectionId.endsWith('-sale')) {
      return mockAll.filter((p) => !!p.discountPercent);
    }
    return mockGetCollectionProducts(collectionId);
  }, [collectionId, isCategory]);

  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);
    setCollection(mockGetCollection(collectionId));
    try {
      // Sale rails are derived from all products with a discount.
      const isSale = collectionId.endsWith('-sale');

      // 1) Prefer the real Shopify collection endpoint for the given handle
      //    (works for men/women/kids/unisex and any custom collection).
      let raw: any[] = [];
      if (!isSale) {
        try {
          raw = await productApi.getCollectionProducts(collectionId);
        } catch {
          raw = [];
        }
      }

      // 2) If that came back empty, fall back to filtering all products.
      if ((!raw || raw.length === 0) && (isCategory || isSale)) {
        const all: any[] = await productApi.getProducts();
        if (isSale) {
          raw = (all || []).filter((p) => p.discountPercent);
        } else if (collectionId !== 'kids') {
          raw = (all || []).filter(
            (p) => (p.category ?? '').toLowerCase() === collectionId,
          );
        }
      }

      // Live collection metadata for banner + title.
      try {
        const liveCollections: any[] = await productApi.getCollections();
        const matched = (liveCollections || []).find(
          (c) =>
            (c.handle ?? c.id ?? '').toLowerCase() ===
            collectionId.toLowerCase(),
        );
        if (matched) {
          setCollection(normaliseCollection(matched));
        }
      } catch {
        // keep mock collection metadata
      }

      if (!Array.isArray(raw) || raw.length === 0) {
        setProducts(mockResolve());
        setSource('mock');
      } else {
        setProducts(raw.map(normaliseProduct));
        setSource('live');
      }
      setStatus('ready');
    } catch (err: any) {
      setProducts(mockResolve());
      setSource('mock');
      setError(err?.message ?? 'Showing offline data');
      setStatus('ready');
    }
  }, [collectionId, isCategory, mockResolve]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data: { products, collection },
    status,
    error,
    source,
    refresh: load,
  };
};

export const useProduct = (productId: string): Result<Product | undefined> => {
  const [product, setProduct] = useState<Product | undefined>(
    mockGetProduct(productId),
  );
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'live' | 'mock'>('mock');

  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const raw = await productApi.getProductDetail(productId);
      if (!raw) {
        setProduct(mockGetProduct(productId));
        setSource('mock');
      } else {
        setProduct(normaliseProduct(raw));
        setSource('live');
      }
      setStatus('ready');
    } catch (err: any) {
      const fallback = mockGetProduct(productId);
      setProduct(fallback);
      setSource('mock');
      setError(err?.message ?? null);
      setStatus(fallback ? 'ready' : 'error');
    }
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  return { data: product, status, error, source, refresh: load };
};

export type CategoryShortcut = {
  id: string;
  label: string;
  handle: string;
  image: string;
  productsCount?: number;
};

export const useCategoryShortcuts = (): Result<CategoryShortcut[]> => {
  const [data, setData] = useState<CategoryShortcut[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'live' | 'mock'>('mock');

  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const raw: any[] = await productApi.getCategoryShortcuts();
      if (!Array.isArray(raw) || raw.length === 0) {
        setData([]);
        setSource('mock');
      } else {
        setData(raw as CategoryShortcut[]);
        setSource('live');
      }
      setStatus('ready');
    } catch (err: any) {
      setData([]);
      setSource('mock');
      setError(err?.message ?? null);
      setStatus('ready');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, status, error, source, refresh: load };
};

export const useCollections = (): Result<Collection[]> => {
  const [data, setData] = useState<Collection[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'live' | 'mock'>('mock');

  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const raw: any[] = await productApi.getCollections();
      if (!Array.isArray(raw) || raw.length === 0) {
        const { featuredCollections } = await import('../data');
        setData(featuredCollections);
        setSource('mock');
      } else {
        setData(raw.map(normaliseCollection));
        setSource('live');
      }
      setStatus('ready');
    } catch (err: any) {
      const { featuredCollections } = await import('../data');
      setData(featuredCollections);
      setSource('mock');
      setError(err?.message ?? null);
      setStatus('ready');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, status, error, source, refresh: load };
};
