"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, X, AlertCircle, Heart } from "lucide-react";
import { useCart } from "@/features/cart/cart-context";
import { useWishlist } from "@/features/products/wishlist-context";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "@/types/product";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

  const handleDecreaseQuantity = (item: CartItem) => {
    if (item.quantity === 1) {
      setItemToRemove(item);
    } else {
      updateQuantity(item.id, item.quantity - 1, {
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        selectedDesign: item.selectedDesign,
      });
    }
  };

  const handleIncreaseQuantity = (item: CartItem) => {
    updateQuantity(item.id, item.quantity + 1, {
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
      selectedDesign: item.selectedDesign,
    });
  };

  const confirmRemoval = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove.id, {
        selectedSize: itemToRemove.selectedSize,
        selectedColor: itemToRemove.selectedColor,
        selectedDesign: itemToRemove.selectedDesign,
      });
      setItemToRemove(null);
    }
  };

  const handleMoveToWishlist = () => {
    if (itemToRemove) {
      // Add to wishlist if not already there
      if (!isInWishlist(itemToRemove.id, {
        selectedSize: itemToRemove.selectedSize,
        selectedColor: itemToRemove.selectedColor,
        selectedDesign: itemToRemove.selectedDesign,
      })) {
        toggleWishlist(itemToRemove, {
          selectedSize: itemToRemove.selectedSize,
          selectedColor: itemToRemove.selectedColor,
          selectedDesign: itemToRemove.selectedDesign,
        });
      }
      // Remove from cart
      confirmRemoval();
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-brand-charcoal/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-brand-charcoal/40" />
          </div>
          <h1 className="text-3xl font-serif mb-4 uppercase tracking-tight">Your Bag is Empty</h1>
          <p className="text-brand-charcoal/60 mb-8 max-w-md mx-auto text-sm">
            Discover our latest collections and find your next statement piece.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-brand-charcoal text-brand-cream px-10 py-4 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-brand-gold transition-colors"
          >
            Explore Collections
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
        <h1 className="text-4xl md:text-6xl font-serif text-brand-charcoal mb-12 uppercase">
          Shopping Bag
          <span className="text-sm font-sans tracking-widest text-brand-charcoal/40 ml-4 font-normal">
            ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Cart Items List */}
          <div className="lg:col-span-8">
            <div className="border-t border-brand-charcoal/10">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.selectedSize}-${item.selectedColor?.id}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex py-10 border-b border-brand-charcoal/10 gap-6 sm:gap-10"
                  >
                    <div className="relative w-28 h-36 sm:w-40 sm:h-52 flex-shrink-0 bg-brand-charcoal/5 overflow-hidden group">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-[10px] tracking-[0.2em] font-bold uppercase text-brand-charcoal/40 mb-1">
                              {item.brand}
                            </h3>
                            <h2 className="text-sm sm:text-lg font-serif text-brand-charcoal uppercase tracking-tight">
                              {item.name}
                            </h2>
                          </div>
                          <p className="text-sm sm:text-base font-bold text-brand-charcoal whitespace-nowrap">
                            Rs. {formatPrice(item.price)}
                          </p>
                        </div>
                        
                        {/* Constraints Display & Selection */}
                        <div className="flex flex-wrap gap-x-8 gap-y-4 mt-6">
                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-widest text-brand-charcoal/40 font-bold mb-2">Size</span>
                            {item.selectedSize ? (
                              <span className="text-xs font-bold text-brand-charcoal uppercase">{item.selectedSize}</span>
                            ) : (
                              <div className="flex gap-2">
                                {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                                  <button
                                    key={s}
                                    onClick={() => updateQuantity(item.id, item.quantity, { ...item, selectedSize: s })}
                                    className="w-8 h-8 border border-brand-charcoal/20 text-[10px] flex items-center justify-center hover:border-brand-charcoal transition-colors"
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-widest text-brand-charcoal/40 font-bold mb-2">Color</span>
                            {item.selectedColor ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full border border-brand-charcoal/10" style={{ backgroundColor: item.selectedColor.hex }} />
                                <span className="text-xs font-bold text-brand-charcoal uppercase">{item.selectedColor.name}</span>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                {[
                                  { id: "sage", hex: "#8A9A5B", name: "Sage Green" },
                                  { id: "gold", hex: "#C5A165", name: "Gold Accent" }
                                ].map((c) => (
                                  <button
                                    key={c.id}
                                    onClick={() => updateQuantity(item.id, item.quantity, { ...item, selectedColor: c })}
                                    className="w-6 h-6 rounded-full border border-brand-charcoal/10"
                                    style={{ backgroundColor: c.hex }}
                                    title={c.name}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-8">
                        <Link 
                          href={`/shop/${item.id}?${new URLSearchParams({
                            ...(item.selectedSize && { size: item.selectedSize }),
                            ...(item.selectedColor && { color: item.selectedColor.id }),
                            ...(item.selectedDesign && { design: item.selectedDesign }),
                          }).toString()}`}
                          className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/60 hover:text-brand-gold transition-colors underline underline-offset-4"
                        >
                          View Details
                        </Link>
                        <div className="flex items-center border border-brand-charcoal/20 bg-white/50">
                          <button
                            onClick={() => handleDecreaseQuantity(item)}
                            className="p-3 hover:bg-brand-charcoal hover:text-white transition-all"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-12 text-center text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => handleIncreaseQuantity(item)}
                            className="p-3 hover:bg-brand-charcoal hover:text-white transition-all"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => setItemToRemove(item)}
                          className="text-brand-charcoal/30 hover:text-red-600 transition-colors p-2 group"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5 transition-transform group-hover:scale-110" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white p-10 border border-brand-charcoal/5 sticky top-32 shadow-sm">
              <h2 className="text-xl font-serif mb-10 uppercase tracking-widest border-b border-brand-charcoal/10 pb-4">Summary</h2>
              
              <div className="space-y-5 mb-10">
                <div className="flex justify-between text-[11px] uppercase tracking-[0.15em] font-medium">
                  <span className="text-brand-charcoal/50">Subtotal</span>
                  <span className="text-brand-charcoal font-bold">Rs. {formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-[11px] uppercase tracking-[0.15em] font-medium">
                  <span className="text-brand-charcoal/50">Shipping</span>
                  <span className="text-brand-charcoal/40 italic">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-[11px] uppercase tracking-[0.15em] font-medium pt-5 border-t border-brand-charcoal/5">
                  <span className="text-brand-charcoal font-bold">Estimated Total</span>
                  <span className="text-brand-charcoal font-bold text-lg">Rs. {formatPrice(totalPrice)}</span>
                </div>
              </div>

              <button className="w-full bg-brand-charcoal text-brand-cream py-5 text-[10px] tracking-[0.3em] uppercase font-bold flex items-center justify-center group hover:bg-brand-gold transition-all shadow-lg">
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="mt-8">
                <p className="text-[9px] text-brand-charcoal/40 uppercase tracking-[0.1em] text-center leading-relaxed">
                  Complimentary worldwide shipping on orders above Rs. 100,000.<br />
                  Safe & Secure Checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Removal Confirmation Modal */}
      <AnimatePresence>
        {itemToRemove && (
          <div className="fixed inset-0 z-[200000] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setItemToRemove(null)}
              className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-brand-cream w-full max-w-md p-10 shadow-2xl border border-brand-charcoal/10"
            >
              <button 
                onClick={() => setItemToRemove(null)}
                className="absolute top-6 right-6 text-brand-charcoal/40 hover:text-brand-charcoal transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                
                <h2 className="text-2xl font-serif text-brand-charcoal mb-4 uppercase tracking-tight">Remove Item?</h2>
                <p className="text-brand-charcoal/60 mb-8 text-sm leading-relaxed">
                  Are you sure you want to remove <span className="text-brand-charcoal font-bold">"{itemToRemove.name}"</span> from your bag? This action cannot be undone.
                </p>
                
                <div className="flex flex-col w-full space-y-3">
                  <button
                    onClick={handleMoveToWishlist}
                    className="w-full bg-brand-gold text-brand-cream py-4 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-brand-gold/90 transition-colors shadow-md flex items-center justify-center"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Move to Wishlist
                  </button>
                  <button
                    onClick={confirmRemoval}
                    className="w-full bg-brand-charcoal text-brand-cream py-4 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-red-600 transition-colors"
                  >
                    Remove from Bag
                  </button>
                  <button
                    onClick={() => setItemToRemove(null)}
                    className="w-full bg-transparent text-brand-charcoal py-4 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-brand-charcoal/5 transition-colors"
                  >
                    Keep in Bag
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
