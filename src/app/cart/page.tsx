"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/features/cart/cart-context";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

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
          <h1 className="text-3xl font-serif mb-4">Your bag is empty</h1>
          <p className="text-brand-charcoal/60 mb-8 max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet. Explore our collections and find something you love.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-brand-charcoal text-brand-cream px-8 py-4 text-xs tracking-widest uppercase font-bold hover:bg-brand-charcoal/90 transition-colors"
          >
            Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
        <h1 className="text-4xl md:text-6xl font-serif text-brand-charcoal mb-12 uppercase">
          Your Shopping Bag
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
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="flex py-8 border-b border-brand-charcoal/10 gap-6"
                  >
                    <div className="relative w-24 h-32 sm:w-32 sm:h-44 flex-shrink-0 bg-brand-charcoal/5">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3 className="text-[10px] tracking-widest font-semibold uppercase text-brand-charcoal/60 mb-1">
                              {item.brand}
                            </h3>
                            <h2 className="text-sm sm:text-lg font-medium text-brand-charcoal uppercase leading-tight">
                              {item.name}
                            </h2>
                          </div>
                          <p className="text-sm sm:text-base font-semibold text-brand-charcoal whitespace-nowrap">
                            Rs. {formatPrice(item.price)}
                          </p>
                        </div>
                        
                        <div className="text-xs text-brand-charcoal/40 mt-1 uppercase tracking-wider">
                          Product ID: #{item.id.padStart(4, '0')}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border border-brand-charcoal/20">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-brand-charcoal/5 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-10 text-center text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-brand-charcoal/5 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-brand-charcoal/40 hover:text-red-500 transition-colors p-2"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
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
            <div className="bg-white p-8 border border-brand-charcoal/5 sticky top-32">
              <h2 className="text-xl font-serif mb-8 uppercase tracking-wider">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-charcoal/60">Subtotal</span>
                  <span className="font-medium text-brand-charcoal">Rs. {formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-charcoal/60">Estimated Shipping</span>
                  <span className="font-medium text-brand-charcoal">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-charcoal/60">Tax</span>
                  <span className="font-medium text-brand-charcoal">Rs. 0</span>
                </div>
                <div className="pt-4 border-t border-brand-charcoal/10 flex justify-between">
                  <span className="font-bold text-brand-charcoal uppercase tracking-widest text-sm">Total</span>
                  <span className="font-bold text-brand-charcoal text-lg">Rs. {formatPrice(totalPrice)}</span>
                </div>
              </div>

              <button className="w-full bg-brand-charcoal text-brand-cream py-4 text-xs tracking-[0.2em] uppercase font-bold flex items-center justify-center group hover:bg-brand-charcoal/90 transition-all">
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="mt-8 pt-8 border-t border-brand-charcoal/10">
                <p className="text-[10px] text-brand-charcoal/40 uppercase tracking-widest text-center leading-relaxed">
                  Shipping and taxes calculated at checkout.<br />
                  Complimentary returns within 14 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
