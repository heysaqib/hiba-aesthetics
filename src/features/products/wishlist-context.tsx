"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/product';

interface WishlistContextType {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('hiba_wishlist');
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Failed to parse wishlist from localStorage', e);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('hiba_wishlist', JSON.stringify(items));
  }, [items]);

  const toggleWishlist = useCallback((product: Product) => {
    setItems((prevItems) => {
      const isAlreadyInWishlist = prevItems.some((item) => item.id === product.id);
      if (isAlreadyInWishlist) {
        return prevItems.filter((item) => item.id !== product.id);
      }
      return [...prevItems, product];
    });
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return items.some((item) => item.id === productId);
  }, [items]);

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        items,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
