"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Product, WishlistItem } from '@/types/product';
import { useAuth } from '@/features/auth/auth-context';
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
  const { user } = useAuth();
  const isInitialSyncRef = useRef(false);
  const prevUserRef = useRef<string | null>(null);

  // Helper to compare constraints
  const areConstraintsEqual = (item: WishlistItem, constraints?: Partial<WishlistItem>) => {
    return (
      item.selectedSize === constraints?.selectedSize &&
      item.selectedColor?.id === constraints?.selectedColor?.id &&
      item.selectedDesign === constraints?.selectedDesign
    );
  };

  // Load from local storage and sync with DB on mount or user change
  useEffect(() => {
    const initializeWishlist = async () => {
      const currentUserId = user?.id || null;
      
      // Avoid re-initializing if user hasn't actually changed
      if (isLoaded && currentUserId === prevUserRef.current) return;

      // 1. Load current items from localStorage immediately
      const savedData = localStorage.getItem('hiba_wishlist');
      let localItems: WishlistItem[] = [];
      let localUserId: string | null = null;

      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (Array.isArray(parsed)) {
            localItems = parsed; // Support old format
          } else {
            localItems = parsed.items || [];
            localUserId = parsed.userId || null;
          }
        } catch (e) {
          console.error('Failed to parse wishlist', e);
        }
      }

      // Initial local load to show items immediately if not already loaded
      if (!isLoaded) {
        setItems(localItems);
      }

      // 2. If logged in, perform smart sync/merge
      if (user) {
        const dbData = await getCartAndWishlist();
        if (dbData && dbData.wishlist) {
          const dbItems: WishlistItem[] = dbData.wishlist;
          
          // Merge ONLY if we have a guest wishlist (localUserId is null)
          if (localUserId !== user.id) {
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
            await syncWishlist(mergedItems);
          } else {
            // userId matches, DB is source of truth
            setItems(dbItems);
          }
        }
      }
      
      setIsLoaded(true);
      isInitialSyncRef.current = true;
      prevUserRef.current = currentUserId;
    };

    initializeWishlist();
  }, [user, isLoaded]);

  // Sync to localStorage and DB on changes
  useEffect(() => {
    if (!isLoaded) return;

    // Save with userId to prevent doubling on next refresh
    const storageData = {
      items,
      userId: user?.id || null
    };
    localStorage.setItem('hiba_wishlist', JSON.stringify(storageData));
    
    const syncWithDB = async () => {
      if (user) {
        await syncWishlist(items);
      }
    };

    if (isInitialSyncRef.current) {
      syncWithDB();
    }
  }, [items, isLoaded, user]);

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
