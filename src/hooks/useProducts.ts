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
      const popularWomen = products.filter((p) => p.category === 'women');
      const popularMen = products.filter((p) => p.category === 'men');
      const saleWomen = popularWomen.filter((p) => !!p.discountPercent);
      const saleMen = popularMen.filter((p) => !!p.discountPercent);
      setData({
        popularWomen: popularWomen.length ? popularWomen : mockPopWomen,
        popularMen: popularMen.length ? popularMen : mockPopMen,
        saleWomen: saleWomen.length ? saleWomen : mockSaleWomen,
        saleMen: saleMen.length ? saleMen : mockSaleMen,
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
      let raw: any[] = [];
      if (isCategory) {
        const all: any[] = await productApi.getProducts();
        raw = (all || []).filter((p) =>
          collectionId === 'kids'
            ? false
            : (p.category ?? '').toLowerCase() === collectionId,
        );
      } else if (collectionId.endsWith('-sale')) {
        const all: any[] = await productApi.getProducts();
        raw = (all || []).filter((p) => p.discountPercent);
      } else {
        raw = await productApi.getCollectionProducts(collectionId);
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
