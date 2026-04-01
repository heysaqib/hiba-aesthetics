"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, WishlistItem } from '@/types/product';

interface WishlistContextType {
  items: WishlistItem[];
  toggleWishlist: (product: Product, constraints?: Partial<WishlistItem>) => void;
  isInWishlist: (productId: string, constraints?: Partial<WishlistItem>) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('hiba_wishlist');
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Failed to parse wishlist', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hiba_wishlist', JSON.stringify(items));
  }, [items]);

  const toggleWishlist = useCallback((product: Product, constraints?: Partial<WishlistItem>) => {
    setItems((prevItems) => {
      const isAlreadyInWishlist = prevItems.some((item) => 
        item.id === product.id &&
        item.selectedSize === constraints?.selectedSize &&
        item.selectedColor?.id === constraints?.selectedColor?.id &&
        item.selectedDesign === constraints?.selectedDesign
      );

      if (isAlreadyInWishlist) {
        return prevItems.filter((item) => !(
          item.id === product.id &&
          item.selectedSize === constraints?.selectedSize &&
          item.selectedColor?.id === constraints?.selectedColor?.id &&
          item.selectedDesign === constraints?.selectedDesign
        ));
      }

      return [...prevItems, { 
        ...product,
        selectedSize: constraints?.selectedSize,
        selectedColor: constraints?.selectedColor,
        selectedDesign: constraints?.selectedDesign
      }];
    });
  }, []);

  const isInWishlist = useCallback((productId: string, constraints?: Partial<WishlistItem>) => {
    return items.some((item) => 
      item.id === productId &&
      item.selectedSize === constraints?.selectedSize &&
      item.selectedColor?.id === constraints?.selectedColor?.id &&
      item.selectedDesign === constraints?.selectedDesign
    );
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
