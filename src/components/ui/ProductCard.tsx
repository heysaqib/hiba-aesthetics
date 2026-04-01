"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/features/cart/cart-context";
import { useWishlist } from "@/features/products/wishlist-context";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
}

export function ProductCard({ id, brand, name, price, originalPrice, image }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, brand, name, price, originalPrice, image });
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({ id, brand, name, price, originalPrice, image });
  };

  const isFavorited = isInWishlist(id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col cursor-pointer relative"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-charcoal/5 mb-4">
        <Link href={`/shop/${id}`}>
          <div className="relative w-full h-full">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
        
        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleWishlist}
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
              isFavorited ? "bg-red-500 text-white" : "bg-white/80 text-brand-charcoal hover:bg-white"
            } shadow-sm`}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
          </motion.button>
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 left-4 right-4"
            >
              <button
                onClick={handleAddToCart}
                className="w-full bg-brand-charcoal text-brand-cream py-3 text-[10px] tracking-widest uppercase font-bold flex items-center justify-center space-x-2 hover:bg-brand-charcoal/90 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback Message */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-brand-charcoal text-white text-[10px] px-3 py-1 uppercase tracking-wider z-10"
            >
              Added to Cart
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Link href={`/shop/${id}`} className="flex flex-col space-y-1">
        <h3 className="text-[10px] tracking-widest font-semibold uppercase text-brand-charcoal">{brand}</h3>
        <p className="text-sm text-brand-charcoal/80 uppercase font-medium truncate">{name}</p>
        <div className="flex items-center space-x-2 mt-1">
          {originalPrice && (
            <span className="text-sm text-brand-charcoal/40 line-through">Rs. {formatPrice(originalPrice)}</span>
          )}
          <span className={`text-sm font-semibold ${originalPrice ? 'text-red-600' : 'text-brand-charcoal'}`}>
            Rs. {formatPrice(price)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
