"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const yResult = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: yResult }} 
          className="absolute inset-0 z-0"
        >
          <Image
            src="/images/products/pakistani_bridal_1_1775023821125.png"
            alt="New Bridal Collection"
            fill
            className="object-cover object-top brightness-[0.85]"
            priority
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/40 to-transparent z-10" />

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/80 font-semibold tracking-[0.2em] uppercase text-xs mb-4"
          >
            The New Standard
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 drop-shadow-lg"
          >
            Elegance in Every Thread
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <Link
              href="/shop"
              className="inline-flex items-center space-x-2 bg-white text-brand-charcoal px-8 py-4 rounded-none hover:bg-brand-gold hover:text-white transition-colors duration-300 font-medium tracking-widest text-sm uppercase group"
            >
              <span>Discover Collection</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Edit */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-xl">
            <h2 className="font-serif text-4xl md:text-5xl text-brand-charcoal mb-4">
              The Seasonal <span className="text-brand-gold italic">Edit</span>
            </h2>
            <p className="text-brand-charcoal/70 leading-relaxed text-sm md:text-base">
              Curated essentials displaying the finest craftsmanship. Discover our latest arrivals blending tradition with modern sensibilities.
            </p>
          </div>
          <Link href="/shop" className="hidden md:inline-flex items-center text-sm font-semibold uppercase tracking-widest text-brand-charcoal hover:text-brand-gold transition-colors pb-1 border-b border-brand-charcoal mt-6 md:mt-0">
            View All Pieces
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          <ProductCard
            id="1"
            brand="Hiba Pret"
            name="Sage Green Embroidered Kurta Set"
            price={18500}
            image="/images/products/pakistani_casual_1_1775023839040.png"
          />
          <ProductCard
            id="2"
            brand="Hiba Formal"
            name="Sapphire Blue Mirror Work Shalwar Kameez"
            price={32000}
            originalPrice={38000}
            image="/images/products/pakistani_casual_2_1775023855002.png"
          />
          <ProductCard
            id="3"
            brand="Hiba Velvet"
            name="Emerald Velvet Short Shirt & Gharara"
            price={45000}
            image="/images/products/pakistani_casual_3_1775024029352.png"
          />
        </div>
        
        <div className="mt-12 text-center md:hidden">
          <Link href="/shop" className="inline-flex items-center text-sm font-semibold uppercase tracking-widest text-brand-charcoal hover:text-brand-gold transition-colors pb-1 border-b border-brand-charcoal">
            View All Pieces
          </Link>
        </div>
      </section>
    </div>
  );
}
