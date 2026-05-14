import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Product } from '../types';

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  itemCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'zarr_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from storage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error('Failed to load cart from storage:', error);
      }
    };
    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error('Failed to save cart to storage:', error);
      }
    };
    saveCart();
  }, [cart]);

  const addToCart = (product: Product, quantity: number, size?: string, color?: string) => {
    setCart((prevCart) => {
      // Create a unique ID for this item based on product ID, size, and color
      const cartItemId = `${product.id}-${size || 'default'}-${color || 'default'}`;
      
      const existingItemIndex = prevCart.findIndex((item) => item.id === cartItemId);

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        // New item
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          size,
          color,
          quantity,
        };
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
