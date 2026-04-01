"use client";

import { useState } from "react";
import { ChevronDown, Heart, Facebook, Twitter, Instagram, Loader2, Check } from "lucide-react";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { formatPrice } from "@/lib/utils";

export default function ProductDetailPage() {
  const [selectedColor, setSelectedColor] = useState("sage");
  const [selectedSize, setSelectedSize] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const images = [
    "/images/products/pakistani_casual_1_1775023839040.png",
    "/images/products/pakistani_casual_2_1775023855002.png",
    "/images/products/pakistani_casual_3_1775024029352.png",
    "/images/products/pakistani_bridal_1_1775023821125.png"
  ];

  const colors = [
    { id: "sage", hex: "#8A9A5B", name: "Sage Green" },
    { id: "gold", hex: "#C5A165", name: "Gold Accent" }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first");
      return;
    }
    
    setIsAddingToCart(true);
    // Simulate API call
    setTimeout(() => {
      setIsAddingToCart(false);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }, 1000);
  };

  return (
    <div className="bg-brand-cream min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left - Image Gallery */}
          <div className="w-full lg:w-[55%]">
            <ProductImageGallery images={images} />
          </div>

          {/* Right - Product Details */}
          <div className="w-full lg:w-[45%] lg:pt-8">
            <h1 className="text-3xl md:text-4xl font-serif text-brand-charcoal mb-4 uppercase tracking-tight">
              Sage Green Embroidered Kurta Set
            </h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-xl text-brand-charcoal/60 line-through">Rs. {formatPrice(22000)}</span>
              <span className="text-xl font-semibold text-red-600">Rs. {formatPrice(18500)}</span>
            </div>

            <p className="text-sm text-brand-charcoal/70 leading-relaxed mb-10">
              A contemporary take on traditional elegance. This exquisite sage green kurta set features subtle silver threadwork, making it an ideal choice for daytime events and festive gatherings.
            </p>

            {/* Color Selector */}
            <div className="mb-8">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-charcoal/40 mb-4">
                Selected Color: <span className="text-brand-charcoal ml-2 font-bold">{colors.find(c => c.id === selectedColor)?.name}</span>
              </h3>
              <div className="flex space-x-3">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`w-8 h-8 rounded-full border transition-all duration-300 relative ${
                      selectedColor === color.id ? "border-brand-charcoal ring-2 ring-brand-gold/20" : "border-brand-charcoal/20"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {selectedColor === color.id && (
                      <span className="absolute inset-0 border-2 border-brand-cream rounded-full pointer-events-none" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-charcoal/40">
                  Select Size: <span className="text-brand-gold ml-2">{selectedSize || "None"}</span>
                </h3>
                <button className="text-[10px] font-bold tracking-widest uppercase text-brand-charcoal/60 underline hover:text-brand-gold transition-colors">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map((s) => (
                  <button 
                    key={s} 
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[50px] h-12 border text-xs font-bold tracking-widest transition-all duration-300 ${
                      selectedSize === s 
                      ? 'bg-brand-charcoal text-white border-brand-charcoal shadow-lg scale-105' 
                      : 'bg-white/50 text-brand-charcoal border-brand-charcoal/10 hover:border-brand-charcoal hover:bg-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Actions */}
            <div className="flex space-x-4 mb-16">
              <button 
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className={`flex-1 flex items-center justify-center space-x-3 tracking-[0.2em] uppercase text-[10px] font-bold py-5 transition-all duration-500 shadow-md ${
                  addedToCart 
                  ? 'bg-green-600 text-white' 
                  : 'bg-brand-charcoal text-white hover:bg-brand-gold disabled:opacity-50'
                }`}
              >
                {isAddingToCart ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : addedToCart ? (
                  <>
                    <span>Added to Sanctuary</span>
                    <Check className="w-4 h-4" />
                  </>
                ) : (
                  <span>Add to Cart</span>
                )}
              </button>
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-16 border flex items-center justify-center transition-all duration-300 shadow-sm ${
                  isWishlisted 
                  ? 'bg-red-50 border-red-100 text-red-500' 
                  : 'bg-white/50 border-brand-charcoal/10 text-brand-charcoal hover:border-brand-charcoal'
                }`}
              >
                <Heart className={`w-5 h-5 stroke-[1.5] ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Accordions */}
            <div className="border-t border-brand-charcoal/10">
              <details className="group border-b border-brand-charcoal/10">
                <summary className="flex justify-between items-center font-bold cursor-pointer list-none py-6 tracking-[0.2em] uppercase text-[10px] text-brand-charcoal">
                  <span>Product Details</span>
                  <span className="transition-transform group-open:rotate-180">
                    <ChevronDown className="w-4 h-4 text-brand-gold" />
                  </span>
                </summary>
                <div className="text-brand-charcoal/70 text-xs mb-6 space-y-3 px-1">
                  <div className="flex justify-between">
                    <span className="uppercase tracking-widest font-medium opacity-60">Collection</span>
                    <span className="font-bold text-brand-charcoal">Spring 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="uppercase tracking-widest font-medium opacity-60">Fabric</span>
                    <span className="font-bold text-brand-charcoal">Cotton Silk Blend</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="uppercase tracking-widest font-medium opacity-60">Care</span>
                    <span className="font-bold text-brand-charcoal text-right">Dry Clean Only</span>
                  </div>
                </div>
              </details>
              {['Delivery & Returns', 'Size Table'].map((title) => (
                <details key={title} className="group border-b border-brand-charcoal/10">
                  <summary className="flex justify-between items-center font-bold cursor-pointer list-none py-6 tracking-[0.2em] uppercase text-[10px] text-brand-charcoal">
                    <span>{title}</span>
                    <span className="transition-transform group-open:rotate-180">
                      <ChevronDown className="w-4 h-4 text-brand-gold" />
                    </span>
                  </summary>
                  <div className="text-brand-charcoal/60 text-xs mb-6 px-1">
                    Detailed information regarding {title.toLowerCase()} is available upon request through our concierge service.
                  </div>
                </details>
              ))}
            </div>

            {/* Share */}
            <div className="mt-12">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-charcoal/40 mb-6">Share This Piece</h3>
              <div className="flex space-x-6 text-brand-charcoal/40">
                <Facebook className="w-4 h-4 hover:text-brand-gold cursor-pointer transition-colors" />
                <Twitter className="w-4 h-4 hover:text-brand-gold cursor-pointer transition-colors" />
                <Instagram className="w-4 h-4 hover:text-brand-gold cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
