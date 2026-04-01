"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem } from '@/types/product';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, constraints?: Partial<CartItem>) => void;
  removeFromCart: (itemId: string, constraints?: Partial<CartItem>) => void;
  updateQuantity: (itemId: string, quantity: number, constraints?: Partial<CartItem>) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('hiba_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hiba_cart', JSON.stringify(items));
  }, [items]);

  const generateItemKey = (id: string, constraints?: Partial<CartItem>) => {
    return `${id}-${constraints?.selectedSize || 'no-size'}-${constraints?.selectedColor?.id || 'no-color'}-${constraints?.selectedDesign || 'no-design'}`;
  };

  const addToCart = useCallback((product: Product, constraints?: Partial<CartItem>) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(item => 
        item.id === product.id && 
        item.selectedSize === constraints?.selectedSize &&
        item.selectedColor?.id === constraints?.selectedColor?.id &&
        item.selectedDesign === constraints?.selectedDesign
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
    setItems((prevItems) => prevItems.filter((item) => {
      const isSameProduct = item.id === productId;
      const isSameConstraints = 
        item.selectedSize === constraints?.selectedSize &&
        item.selectedColor?.id === constraints?.selectedColor?.id &&
        item.selectedDesign === constraints?.selectedDesign;
      
      return !(isSameProduct && isSameConstraints);
    }));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, constraints?: Partial<CartItem>) => {
    if (quantity < 0) return;
    
    setItems((prevItems) =>
      prevItems.map((item) => {
        const isSameProduct = item.id === productId;
        const isSameConstraints = 
          item.selectedSize === constraints?.selectedSize &&
          item.selectedColor?.id === constraints?.selectedColor?.id &&
          item.selectedDesign === constraints?.selectedDesign;

        if (isSameProduct && isSameConstraints) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
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
        clearCart,
        totalItems,
        totalPrice,
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
