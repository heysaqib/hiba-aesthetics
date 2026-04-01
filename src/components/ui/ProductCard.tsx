"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
}

export function ProductCard({ id, brand, name, price, originalPrice, image }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col cursor-pointer"
    >
      <Link href={`/shop/${id}`}>
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-charcoal/5 mb-4">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="flex flex-col space-y-1">
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
        </div>
      </Link>
    </motion.div>
  );
}
