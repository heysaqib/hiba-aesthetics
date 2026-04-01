"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { useWishlist } from "@/features/products/wishlist-context";
import { ProductCard } from "@/components/ui/ProductCard";
import { useCart } from "@/features/cart/cart-context";

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddAllToCart = () => {
    items.forEach(product => addToCart(product));
    // Optionally clear wishlist after adding all to cart
    // clearWishlist();
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
          <h1 className="text-3xl font-serif mb-4">Your wishlist is empty</h1>
          <p className="text-brand-charcoal/60 mb-8 max-w-md mx-auto">
            Save items you love to your wishlist and they'll appear here.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-brand-charcoal text-brand-cream px-8 py-4 text-xs tracking-widest uppercase font-bold hover:bg-brand-charcoal/90 transition-colors"
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
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-serif text-brand-charcoal uppercase leading-none">
              My Wishlist
            </h1>
            <p className="text-brand-charcoal/60 mt-4 text-sm tracking-widest uppercase">
              {items.length} {items.length === 1 ? 'Item' : 'Items'} Saved
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={clearWishlist}
              className="text-[10px] tracking-widest uppercase font-bold text-brand-charcoal/40 hover:text-brand-charcoal transition-colors px-4 py-2"
            >
              Clear All
            </button>
            <button
              onClick={handleAddAllToCart}
              className="bg-brand-charcoal text-brand-cream px-6 py-3 text-[10px] tracking-widest uppercase font-bold flex items-center hover:bg-brand-charcoal/90 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add All to Cart
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
          <AnimatePresence>
            {items.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Suggested Collections */}
        <div className="mt-32 pt-16 border-t border-brand-charcoal/10">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl font-serif uppercase">Complete the Look</h2>
            <Link href="/shop" className="text-xs tracking-widest uppercase font-bold flex items-center hover:text-brand-gold transition-colors">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
          {/* Reusing some logic here or just a placeholder for now */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 opacity-50 grayscale hover:grayscale-0 transition-all">
             <div className="aspect-[3/4] bg-brand-charcoal/5"></div>
             <div className="aspect-[3/4] bg-brand-charcoal/5"></div>
             <div className="aspect-[3/4] bg-brand-charcoal/5"></div>
             <div className="aspect-[3/4] bg-brand-charcoal/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
