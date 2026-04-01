"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Product, CartItem } from '@/types/product';
import { useAuth } from '@/features/auth/auth-context';
import { syncCart, getCartAndWishlist } from '@/features/products/product-actions';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, constraints?: Partial<CartItem>) => void;
  removeFromCart: (itemId: string, constraints?: Partial<CartItem>) => void;
  updateQuantity: (itemId: string, quantity: number, constraints?: Partial<CartItem>) => void;
  updateConstraints: (itemId: string, oldConstraints: Partial<CartItem>, newConstraints: Partial<CartItem>) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();
  const isInitialSyncRef = useRef(false);
  const prevUserRef = useRef<string | null>(null);

  // Helper to compare constraints
  const areConstraintsEqual = (c1?: Partial<CartItem>, c2?: Partial<CartItem>) => {
    return (
      c1?.selectedSize === c2?.selectedSize &&
      c1?.selectedColor?.id === c2?.selectedColor?.id &&
      c1?.selectedDesign === c2?.selectedDesign
    );
  };

  // Load from local storage and sync with DB on mount or user change
  useEffect(() => {
    const initializeCart = async () => {
      const currentUserId = user?.id || null;
      
      // Avoid re-initializing if user hasn't actually changed
      if (isLoaded && currentUserId === prevUserRef.current) return;
      
      // 1. Load current items from localStorage immediately for responsive UI
      const savedData = localStorage.getItem('hiba_cart');
      let localItems: CartItem[] = [];
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
          console.error('Failed to parse cart', e);
        }
      }

      // Initial local load to show items immediately if not already loaded
      if (!isLoaded) {
        setItems(localItems);
      }

      // 2. If logged in, perform smart sync/merge
      if (user) {
        const dbData = await getCartAndWishlist();
        if (dbData && dbData.cart) {
          const dbItems: CartItem[] = dbData.cart;
          
          // Merge ONLY if we have a guest cart (localUserId is null)
          if (localUserId !== user.id) {
            const mergedItems = [...dbItems];
            
            localItems.forEach(localItem => {
              const existingIndex = mergedItems.findIndex(dbItem => 
                dbItem.id === localItem.id && areConstraintsEqual(dbItem, localItem)
              );
              
              if (existingIndex > -1) {
                mergedItems[existingIndex].quantity += localItem.quantity;
              } else {
                mergedItems.push(localItem);
              }
            });

            setItems(mergedItems);
            await syncCart(mergedItems);
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

    initializeCart();
  }, [user, isLoaded]);

  // Sync to localStorage and DB on changes
  useEffect(() => {
    if (!isLoaded) return;

    // Save with userId to prevent doubling on next refresh
    const storageData = {
      items,
      userId: user?.id || null
    };
    localStorage.setItem('hiba_cart', JSON.stringify(storageData));
    
    const syncWithDB = async () => {
      if (user) {
        await syncCart(items);
      }
    };

    if (isInitialSyncRef.current) {
      syncWithDB();
    }
  }, [items, isLoaded, user]);

  const addToCart = useCallback((product: Product, constraints?: Partial<CartItem>) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(item => 
        item.id === product.id && areConstraintsEqual(item, constraints)
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + (constraints?.quantity || 1)
        };
        return newItems;
      }

      return [...prevItems, { 
        ...product, 
        quantity: constraints?.quantity || 1,
        selectedSize: constraints?.selectedSize,
        selectedColor: constraints?.selectedColor,
        selectedDesign: constraints?.selectedDesign
      }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, constraints?: Partial<CartItem>) => {
    setItems((prevItems) => prevItems.filter((item) => 
      !(item.id === productId && areConstraintsEqual(item, constraints))
    ));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, constraints?: Partial<CartItem>) => {
    if (quantity < 0) return;
    
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId && areConstraintsEqual(item, constraints)) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  }, []);

  const updateConstraints = useCallback((productId: string, oldConstraints: Partial<CartItem>, newConstraints: Partial<CartItem>) => {
    setItems((prevItems) => {
      // Find the item to update
      const itemToUpdateIndex = prevItems.findIndex(item => 
        item.id === productId && areConstraintsEqual(item, oldConstraints)
      );

      if (itemToUpdateIndex === -1) return prevItems;

      const itemToUpdate = prevItems[itemToUpdateIndex];
      const updatedConstraints = {
        selectedSize: newConstraints.selectedSize !== undefined ? newConstraints.selectedSize : itemToUpdate.selectedSize,
        selectedColor: newConstraints.selectedColor !== undefined ? newConstraints.selectedColor : itemToUpdate.selectedColor,
        selectedDesign: newConstraints.selectedDesign !== undefined ? newConstraints.selectedDesign : itemToUpdate.selectedDesign,
      };

      // Check if an item with these NEW constraints already exists
      const existingItemIndex = prevItems.findIndex((item, idx) => 
        idx !== itemToUpdateIndex && 
        item.id === productId && 
        areConstraintsEqual(item, updatedConstraints)
      );

      if (existingItemIndex > -1) {
        // Merge with existing item
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + itemToUpdate.quantity
        };
        // Remove the old item
        return newItems.filter((_, idx) => idx !== itemToUpdateIndex);
      }

      // Just update the current item
      const newItems = [...prevItems];
      newItems[itemToUpdateIndex] = {
        ...itemToUpdate,
        ...updatedConstraints
      };
      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem('hiba_cart');
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateConstraints,
        clearCart,
        totalItems,
        totalPrice,
        isLoaded,
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
