"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Product, CartItem } from '@/types/product';
import { getSession } from '@/features/auth/auth-actions';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isInitialSyncRef = useRef(false);

  // Helper to compare constraints
  const areConstraintsEqual = (c1?: Partial<CartItem>, c2?: Partial<CartItem>) => {
    return (
      c1?.selectedSize === c2?.selectedSize &&
      c1?.selectedColor?.id === c2?.selectedColor?.id &&
      c1?.selectedDesign === c2?.selectedDesign
    );
  };

  // Load from local storage and sync with DB on mount
  useEffect(() => {
    const initializeCart = async () => {
      // 1. Load from localStorage
      const savedCart = localStorage.getItem('hiba_cart');
      let localItems: CartItem[] = [];
      if (savedCart) {
        try {
          localItems = JSON.parse(savedCart);
        } catch (e) {
          console.error('Failed to parse cart', e);
        }
      }

      // 2. Check for session
      const session = await getSession();
      if (session) {
        setIsAuthenticated(true);
        // 3. Fetch from DB
        const dbData = await getCartAndWishlist();
        if (dbData && dbData.cart) {
          const dbItems: CartItem[] = dbData.cart;
          
          // 4. Merge Logic: Start with DB items, add local items that aren't duplicates
          // If duplicate, sum quantities
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
          // Sync merged cart back to DB if local items were added
          if (localItems.length > 0) {
            await syncCart(mergedItems);
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

    initializeCart();
  }, []);

  // Sync to localStorage and DB on changes
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem('hiba_cart', JSON.stringify(items));
    
    const syncWithDB = async () => {
      if (isAuthenticated) {
        await syncCart(items);
      }
    };

    // Skip sync on initial mount/load to avoid redundant calls
    if (isInitialSyncRef.current) {
      syncWithDB();
    }
  }, [items, isLoaded, isAuthenticated]);

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
