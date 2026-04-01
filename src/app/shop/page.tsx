"use client";

import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";

const DUMMY_PRODUCTS = [
  { id: "1", brand: "Hiba Pret", name: "Sage Green Embroidered Kurta Set", price: 18500, image: "/images/products/pakistani_casual_1_1775023839040.png" },
  { id: "2", brand: "Hiba Formal", name: "Sapphire Blue Mirror Work Shalwar Kameez", price: 32000, originalPrice: 38000, image: "/images/products/pakistani_casual_2_1775023855002.png" },
  { id: "3", brand: "Hiba Velvet", name: "Emerald Velvet Short Shirt & Gharara", price: 45000, image: "/images/products/pakistani_casual_3_1775024029352.png" },
  { id: "4", brand: "Hiba Bridal", name: "Maroon & Gold Embroidered Lehenga", price: 155000, image: "/images/products/pakistani_bridal_1_1775023821125.png" },
  { id: "5", brand: "Hiba Pret", name: "Lilac Chiffon Kurta with Trousers", price: 12500, originalPrice: 15000, image: "/images/products/pakistani_casual_1_1775023839040.png" },
  { id: "6", brand: "Hiba Formal", name: "Charcoal Grey Silk Kaftan", price: 22000, image: "/images/products/pakistani_casual_2_1775023855002.png" },
  { id: "7", brand: "Hiba Velvet", name: "Deep Rose Velvet Sharara Suit", price: 41000, image: "/images/products/pakistani_casual_3_1775024029352.png" },
  { id: "8", brand: "Hiba Bridal", name: "Ivory & Silver Reception Maxi", price: 140000, image: "/images/products/pakistani_bridal_1_1775023821125.png" },
];

export default function ShopPage() {
  return (
    <div className="bg-brand-cream min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-xs tracking-widest text-brand-charcoal/60 uppercase mb-8">
          <Link href="/" className="hover:text-brand-charcoal transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 mx-2" />
          <Link href="/shop" className="hover:text-brand-charcoal transition-colors">Collections</Link>
          <ChevronRight className="w-3 h-3 mx-2" />
          <span className="text-brand-charcoal font-medium">All Arrivals</span>
        </nav>

        {/* Title */}
        <div className="flex items-end mb-12">
          <h1 className="text-4xl md:text-6xl font-serif text-brand-charcoal">
            NEW ARRIVALS
          </h1>
          <span className="text-brand-charcoal/60 ml-4 mb-2 md:mb-3 text-sm">{DUMMY_PRODUCTS.length}</span>
        </div>

        {/* Filters Top Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-y border-brand-charcoal/10 mb-12 gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <button className="flex items-center space-x-2 bg-brand-charcoal text-brand-cream px-5 py-2 hover:bg-brand-charcoal/90 transition-colors rounded-none text-xs tracking-widest uppercase font-medium">
              <span>Filters</span>
              <span className="bg-brand-cream text-brand-charcoal w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]">3</span>
            </button>
            <div className="flex items-center space-x-2 border border-brand-charcoal/20 px-4 py-2 text-xs tracking-widest uppercase text-brand-charcoal">
              <span>Kurta Sets</span>
              <span className="opacity-50 ml-2 cursor-pointer hover:opacity-100">×</span>
            </div>
            <div className="flex items-center space-x-2 border border-brand-charcoal/20 px-4 py-2 text-xs tracking-widest uppercase text-brand-charcoal">
              <span>Size M</span>
              <span className="opacity-50 ml-2 cursor-pointer hover:opacity-100">×</span>
            </div>
            <div className="flex items-center space-x-2 border border-brand-charcoal/20 px-4 py-2 text-xs tracking-widest uppercase text-brand-charcoal hidden sm:flex">
              <span>Rs. 10,000 - 50,000</span>
              <span className="opacity-50 ml-2 cursor-pointer hover:opacity-100">×</span>
            </div>
          </div>

          <button className="flex items-center space-x-2 text-xs tracking-widest uppercase font-medium text-brand-charcoal min-w-max hover:text-brand-gold transition-colors">
            <span>Sort By</span>
            <Plus className="w-4 h-4 text-brand-charcoal/60" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
          {DUMMY_PRODUCTS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center border-t border-brand-charcoal/10 mt-24 pt-8">
          <button className="text-xs uppercase tracking-widest font-medium text-brand-charcoal/60 hover:text-brand-charcoal transition-colors">Prev</button>
          
          <div className="flex space-x-4 text-sm">
            <span className="font-bold text-brand-charcoal">1</span>
            <span className="text-brand-charcoal/40 hover:text-brand-charcoal cursor-pointer transition-colors">2</span>
            <span className="text-brand-charcoal/40 hover:text-brand-charcoal cursor-pointer transition-colors">3</span>
            <span className="text-brand-charcoal/40">...</span>
            <span className="text-brand-charcoal/40 hover:text-brand-charcoal cursor-pointer transition-colors">12</span>
          </div>

          <button className="text-xs uppercase tracking-widest font-medium text-brand-charcoal hover:text-brand-gold transition-colors">Next</button>
        </div>

      </div>
    </div>
  );
}
