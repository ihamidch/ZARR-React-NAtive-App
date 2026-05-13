import axios, { AxiosError, AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/env';

export const TOKEN_KEY = 'zarr:auth_token';

const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore — token is optional
  }
  return config;
});

export type ApiError = {
  status: number;
  message: string;
};

export const extractError = (err: unknown): ApiError => {
  const e = err as AxiosError<{ message?: string }>;
  if (e?.response) {
    return {
      status: e.response.status,
      message: e.response.data?.message || e.message || 'Request failed',
    };
  }
  if (e?.request) {
    return {
      status: 0,
      message:
        'Cannot reach server. Check your connection or the API_BASE_URL in src/config/env.ts.',
    };
  }
  return {
    status: -1,
    message: (e as Error)?.message || 'Unexpected error',
  };
};

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
};

export const productApi = {
  getProducts: async () => (await api.get('/products')).data,
  getCollections: async () => (await api.get('/products/collections')).data,
  getCollectionProducts: async (handle: string) =>
    (await api.get(`/products/collections/${handle}`)).data,
  getProductDetail: async (handle: string) =>
    (await api.get(`/products/${handle}`)).data,
};

export const authApi = {
  register: async (input: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) =>
    (await api.post<{ user: ApiUser; token: string }>('/auth/register', input))
      .data,
  login: async (input: { email: string; password: string }) =>
    (await api.post<{ user: ApiUser; token: string }>('/auth/login', input))
      .data,
  me: async () => (await api.get<{ user: ApiUser }>('/auth/me')).data,
  updateMe: async (input: { name?: string; phone?: string }) =>
    (await api.patch<{ user: ApiUser }>('/auth/me', input)).data,
};

export const healthApi = {
  check: async () =>
    (
      await axios.get(`${API_BASE_URL}/api/health`, { timeout: 5000 })
    ).data as { ok: boolean; shopifyConfigured: boolean; db: string },
};

export default api;
