import axios from 'axios';
import { Platform } from 'react-native';

// For Android emulator, use 10.0.2.2
// For iOS simulator, use localhost
// For physical devices, use your computer's local IP address
const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = {
  getProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getCollections: async () => {
    try {
      const response = await api.get('/products/collections');
      return response.data;
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  },

  getCollectionProducts: async (handle: string) => {
    try {
      const response = await api.get(`/products/collections/${handle}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for collection ${handle}:`, error);
      throw error;
    }
  },

  getProductDetail: async (handle: string) => {
    try {
      const response = await api.get(`/products/${handle}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${handle}:`, error);
      throw error;
    }
  },
};

export default api;
