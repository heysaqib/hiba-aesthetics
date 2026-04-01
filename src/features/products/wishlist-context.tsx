"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Product, WishlistItem } from '@/types/product';
import { getSession } from '@/features/auth/auth-actions';
import { syncWishlist, getCartAndWishlist } from '@/features/products/product-actions';

interface WishlistContextType {
  items: WishlistItem[];
  toggleWishlist: (product: Product, constraints?: Partial<WishlistItem>) => void;
  isInWishlist: (productId: string, constraints?: Partial<WishlistItem>) => boolean;
  clearWishlist: () => void;
  isLoaded: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isInitialSyncRef = useRef(false);

  // Helper to compare constraints
  const areConstraintsEqual = (item: WishlistItem, constraints?: Partial<WishlistItem>) => {
    return (
      item.selectedSize === constraints?.selectedSize &&
      item.selectedColor?.id === constraints?.selectedColor?.id &&
      item.selectedDesign === constraints?.selectedDesign
    );
  };

  // Load from local storage and sync with DB on mount
  useEffect(() => {
    const initializeWishlist = async () => {
      // 1. Load from localStorage
      const savedWishlist = localStorage.getItem('hiba_wishlist');
      let localItems: WishlistItem[] = [];
      if (savedWishlist) {
        try {
          localItems = JSON.parse(savedWishlist);
        } catch (e) {
          console.error('Failed to parse wishlist', e);
        }
      }

      // 2. Check for session
      const session = await getSession();
      if (session) {
        setIsAuthenticated(true);
        // 3. Fetch from DB
        const dbData = await getCartAndWishlist();
        if (dbData && dbData.wishlist) {
          const dbItems: WishlistItem[] = dbData.wishlist;
          
          // 4. Merge Logic: Start with DB items, add local items that aren't duplicates
          const mergedItems = [...dbItems];
          
          localItems.forEach(localItem => {
            const exists = mergedItems.some(dbItem => 
              dbItem.id === localItem.id && areConstraintsEqual(dbItem, localItem)
            );
            
            if (!exists) {
              mergedItems.push(localItem);
            }
          });

          setItems(mergedItems);
          // Sync merged wishlist back to DB if local items were added
          if (localItems.length > 0) {
            await syncWishlist(mergedItems);
          }
        } else {
          setItems(localItems);
        }
      } else {
        setItems(localItems);
      }
      
      setIsLoaded(true);
      isInitialSyncRef.current = true;
    };

    initializeWishlist();
  }, []);

  // Sync to localStorage and DB on changes
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem('hiba_wishlist', JSON.stringify(items));
    
    const syncWithDB = async () => {
      if (isAuthenticated) {
        await syncWishlist(items);
      }
    };

    if (isInitialSyncRef.current) {
      syncWithDB();
    }
  }, [items, isLoaded, isAuthenticated]);

  const toggleWishlist = useCallback((product: Product, constraints?: Partial<WishlistItem>) => {
    setItems((prevItems) => {
      const isAlreadyInWishlist = prevItems.some((item) => 
        item.id === product.id && areConstraintsEqual(item, constraints)
      );

      if (isAlreadyInWishlist) {
        return prevItems.filter((item) => !(
          item.id === product.id && areConstraintsEqual(item, constraints)
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
      item.id === productId && areConstraintsEqual(item, constraints)
    );
  }, [items]);

  const clearWishlist = useCallback(() => {
    setItems([]);
    localStorage.removeItem('hiba_wishlist');
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        items,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        isLoaded,
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

