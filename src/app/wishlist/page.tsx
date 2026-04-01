"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, ArrowRight, Trash2, Plus, Check } from "lucide-react";
import { useWishlist } from "@/features/products/wishlist-context";
import { useCart } from "@/features/cart/cart-context";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const { items, clearWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [isAllAdded, setIsAllAdded] = useState(false);

  const getItemKey = (item: any) => 
    `${item.id}-${item.selectedSize}-${item.selectedColor?.id}`;

  const handleAddAllToCart = () => {
    items.forEach(item => {
      addToCart(item, {
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        selectedDesign: item.selectedDesign,
      });
    });
    setIsAllAdded(true);
    setTimeout(() => setIsAllAdded(false), 2000);
  };

  const handleAddToCart = (item: any) => {
    const key = getItemKey(item);
    addToCart(item, {
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
      selectedDesign: item.selectedDesign,
    });
    
    setAddedItems(prev => new Set(prev).add(key));
    setTimeout(() => {
      setAddedItems(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 2000);
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
            <Heart className="w-10 h-10 text-brand-charcoal/40" />
          </div>
          <h1 className="text-3xl font-serif mb-4 uppercase tracking-tight">Your Wishlist is Empty</h1>
          <p className="text-brand-charcoal/60 mb-8 max-w-md mx-auto text-sm">
            Save items you love to your wishlist and they'll appear here for you to review later.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-brand-charcoal text-brand-cream px-10 py-4 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-brand-gold transition-colors"
          >
            Start Exploring
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-brand-charcoal/10 pb-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-serif text-brand-charcoal uppercase leading-none">
              My Wishlist
            </h1>
            <p className="text-brand-charcoal/60 mt-4 text-xs tracking-[0.2em] uppercase font-bold">
              {items.length} {items.length === 1 ? 'Item' : 'Items'} Saved
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={clearWishlist}
              className="text-[10px] tracking-[0.2em] uppercase font-bold text-brand-charcoal/40 hover:text-red-500 transition-colors px-4 py-2"
            >
              Clear All
            </button>
            <button
              onClick={handleAddAllToCart}
              disabled={isAllAdded}
              className={`min-w-[180px] px-8 py-4 text-[10px] tracking-[0.2em] uppercase font-bold flex items-center justify-center transition-all shadow-lg ${
                isAllAdded ? "bg-green-600 text-white" : "bg-brand-charcoal text-brand-cream hover:bg-brand-gold"
              }`}
            >
              <AnimatePresence mode="wait">
                {isAllAdded ? (
                  <motion.div
                    key="all-added"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center"
                  >
                    <Check className="w-4 h-4 mr-3" />
                    All in Bag
                  </motion.div>
                ) : (
                  <motion.div
                    key="add-all"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center"
                  >
                    <ShoppingBag className="w-4 h-4 mr-3" />
                    Add All to Bag
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <AnimatePresence>
            {items.map((item) => {
              const itemKey = getItemKey(item);
              const isAdded = addedItems.has(itemKey);

              return (
                <motion.div
                  key={itemKey}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white border border-brand-charcoal/5 flex flex-col group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <button
                      onClick={() => toggleWishlist(item, {
                        selectedSize: item.selectedSize,
                        selectedColor: item.selectedColor,
                        selectedDesign: item.selectedDesign,
                      })}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-white transition-colors shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-4">
                      <h3 className="text-[9px] tracking-[0.2em] font-bold uppercase text-brand-charcoal/40 mb-1">{item.brand}</h3>
                      <h2 className="text-base font-serif text-brand-charcoal uppercase tracking-tight">{item.name}</h2>
                      <p className="text-sm font-bold text-brand-charcoal mt-2">Rs. {formatPrice(item.price)}</p>
                    </div>

                    {/* Saved Constraints */}
                    <div className="flex flex-wrap gap-4 mb-6 pt-4 border-t border-brand-charcoal/5">
                      {item.selectedSize && (
                        <div className="flex flex-col">
                          <span className="text-[8px] uppercase tracking-widest text-brand-charcoal/40 font-bold mb-1">Size</span>
                          <span className="text-[10px] font-bold text-brand-charcoal uppercase">{item.selectedSize}</span>
                        </div>
                      )}
                      {item.selectedColor && (
                        <div className="flex flex-col">
                          <span className="text-[8px] uppercase tracking-widest text-brand-charcoal/40 font-bold mb-1">Color</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-2.5 h-2.5 rounded-full border border-brand-charcoal/10" style={{ backgroundColor: item.selectedColor.hex }} />
                            <span className="text-[10px] font-bold text-brand-charcoal uppercase">{item.selectedColor.name}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={isAdded}
                      className={`mt-auto w-full py-4 text-[9px] tracking-[0.2em] uppercase font-bold flex items-center justify-center transition-all ${
                        isAdded ? "bg-green-600 text-white" : "bg-brand-charcoal text-brand-cream hover:bg-brand-gold"
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        {isAdded ? (
                          <motion.div
                            key="added"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center"
                          >
                            <Check className="w-3 h-3 mr-2" />
                            Added to Bag
                          </motion.div>
                        ) : (
                          <motion.div
                            key="not-added"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center"
                          >
                            <Plus className="w-3 h-3 mr-2" />
                            Move to Bag
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Explore More */}
        <div className="mt-32 pt-16 border-t border-brand-charcoal/10 text-center">
          <h2 className="text-2xl font-serif uppercase mb-8 tracking-tight">Continue Your Search</h2>
          <Link 
            href="/shop" 
            className="inline-flex items-center text-[10px] tracking-[0.2em] uppercase font-bold text-brand-charcoal hover:text-brand-gold transition-colors"
          >
            Back to Collections <ArrowRight className="w-4 h-4 ml-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
