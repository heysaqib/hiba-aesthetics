"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Heart, Share2, Facebook, Twitter, Instagram } from "lucide-react";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";

export default function ProductDetailPage() {
  const images = [
    "/images/products/pakistani_casual_1_1775023839040.png",
    "/images/products/pakistani_casual_2_1775023855002.png",
    "/images/products/pakistani_casual_3_1775024029352.png",
    "/images/products/pakistani_bridal_1_1775023821125.png"
  ];

  return (
    <div className="bg-brand-cream min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left - Image Gallery (Sticky on desktop) */}
          <div className="w-full lg:w-[55%]">
            <ProductImageGallery images={images} />
          </div>

          {/* Right - Product Details */}
          <div className="w-full lg:w-[45%] lg:pt-8">
            <h1 className="text-3xl md:text-4xl font-serif text-brand-charcoal mb-4">
              SAGE GREEN EMBROIDERED KURTA SET
            </h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-xl text-brand-charcoal/60 line-through">Rs. 22,000</span>
              <span className="text-xl font-semibold text-red-600">Rs. 18,500</span>
            </div>

            <p className="text-sm text-brand-charcoal/70 leading-relaxed mb-10">
              A contemporary take on traditional elegance. This exquisite sage green kurta set features subtle silver threadwork, making it an ideal choice for daytime events and festive gatherings. Crafted from premium breathable fabric for unparalleled comfort.
            </p>

            {/* Color Selector */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold tracking-widest uppercase text-brand-charcoal mb-4">Color</h3>
              <div className="flex space-x-3">
                <button className="w-8 h-8 rounded-full border border-brand-charcoal bg-[#8A9A5B] flex items-center justify-center relative">
                  <span className="absolute inset-0 border-2 border-brand-cream rounded-full pointer-events-none" />
                </button>
                <button className="w-8 h-8 rounded-full border-brand-charcoal/20 bg-[#C5A165] flex items-center justify-center hover:border-brand-charcoal transition-colors border" />
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-sm font-semibold tracking-widest uppercase text-brand-charcoal">Size</h3>
                <Link href="#" className="text-xs text-brand-charcoal underline hover:text-brand-gold transition-colors">What's my size?</Link>
              </div>
              <div className="flex space-x-2">
                {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                  <button key={s} className={`w-12 h-10 border text-sm font-medium transition-colors ${
                    s === 'S' 
                    ? 'bg-brand-charcoal text-brand-cream border-brand-charcoal' 
                    : 'bg-transparent text-brand-charcoal border-brand-charcoal/30 hover:border-brand-charcoal'
                  }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Actions */}
            <div className="flex space-x-4 mb-16">
              <button className="flex-1 bg-brand-charcoal text-white tracking-widest uppercase text-sm font-semibold py-4 hover:bg-brand-gold transition-colors">
                Add to Cart
              </button>
              <button className="w-14 border border-brand-charcoal/30 flex items-center justify-center text-brand-charcoal hover:border-brand-charcoal transition-colors">
                <Heart className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Accordions */}
            <div className="border-t border-brand-charcoal/10">
              <details className="group border-b border-brand-charcoal/10" open>
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none py-5 tracking-widest uppercase text-xs text-brand-charcoal">
                  <span>Characteristics</span>
                  <span className="transition-transform group-open:rotate-180">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </summary>
                <div className="text-brand-charcoal/70 text-sm mb-5 pr-4">
                  <div className="flex justify-between mb-2">
                    <span>Brand</span><span className="font-medium text-brand-charcoal text-right">Hiba Pret</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Collection</span><span className="font-medium text-brand-charcoal text-right">Spring 2026</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Item no.</span><span className="font-medium text-brand-charcoal text-right">HP-10492</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Material</span><span className="font-medium text-brand-charcoal text-right">Cotton Silk Blend</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Care</span><span className="font-medium text-brand-charcoal text-right">Dry Clean Only</span>
                  </div>
                </div>
              </details>
              {['Payment & Delivery', 'Returns', 'Size Table'].map((title) => (
                <details key={title} className="group border-b border-brand-charcoal/10">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none py-5 tracking-widest uppercase text-xs text-brand-charcoal">
                    <span>{title}</span>
                    <span className="transition-transform group-open:rotate-180">
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </summary>
                  <div className="text-brand-charcoal/70 text-sm mb-5 pr-4 pb-2">
                    Information regarding {title.toLowerCase()} will be displayed here securely and transparently.
                  </div>
                </details>
              ))}
            </div>

            {/* Share */}
            <div className="mt-12">
              <h3 className="text-xs font-medium tracking-widest uppercase text-brand-charcoal mb-4">Share</h3>
              <div className="flex space-x-4 text-brand-charcoal/50">
                <Facebook className="w-4 h-4 hover:text-brand-charcoal cursor-pointer transition-colors" />
                <Twitter className="w-4 h-4 hover:text-brand-charcoal cursor-pointer transition-colors" />
                <Instagram className="w-4 h-4 hover:text-brand-charcoal cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Promo Toast */}
            <div className="mt-8 bg-[#FAF6F2] border border-brand-gold/20 p-4 flex items-start space-x-4">
              <div className="bg-red-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold shrink-0 mt-0.5">%</div>
              <div>
                <h4 className="font-semibold text-brand-charcoal text-sm">WELCOME REWARD</h4>
                <p className="text-xs text-brand-charcoal/70 mt-1">New members enjoy 10% off on their first ethnic wear purchase.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
