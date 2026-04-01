"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { createPortal } from "react-dom";

interface ProductImageGalleryProps {
  images: string[];
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [magnifierStyle, setMagnifierStyle] = useState({ display: "none", top: 0, left: 0, backgroundPosition: "0% 0%" });
  
  const modalImageRef = useRef<HTMLDivElement>(null);
  const activeImage = images[activeImageIndex];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const handleMagnifier = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!modalImageRef.current) return;

    const { left, top, width, height } = modalImageRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const px = (x / width) * 100;
    const py = (y / height) * 100;

    setMagnifierStyle({
      display: "block",
      top: y - 75,
      left: x - 75,
      backgroundPosition: `${px}% ${py}%`,
    });
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const modalContent = (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-brand-cream/98 backdrop-blur-3xl"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Close Button - Moved slightly up to top-10 */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(false);
            }}
            className="absolute top-10 right-6 md:right-12 p-4 text-brand-charcoal hover:text-brand-gold transition-all z-[100002] bg-white/90 backdrop-blur-md rounded-full shadow-2xl border border-brand-charcoal/10 active:scale-90 pointer-events-auto"
            aria-label="Close viewer"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Main Carousel Area */}
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-24 pointer-events-none">
            {/* Navigation Arrows */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 md:left-12 p-4 md:p-6 text-brand-charcoal hover:text-brand-gold transition-all z-[100002] bg-white/90 backdrop-blur-md rounded-full border border-brand-charcoal/10 shadow-xl active:scale-95 pointer-events-auto"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 md:right-12 p-4 md:p-6 text-brand-charcoal hover:text-brand-gold transition-all z-[100002] bg-white/90 backdrop-blur-md rounded-full border border-brand-charcoal/10 shadow-xl active:scale-95 pointer-events-auto"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Zoomable Image Container */}
            <motion.div 
              key={activeImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative h-full aspect-[3/4] max-h-[75vh] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] bg-brand-charcoal/5 cursor-crosshair group pointer-events-auto overflow-hidden"
              ref={modalImageRef}
              onClick={(e) => e.stopPropagation()}
              onMouseMove={handleMagnifier}
              onMouseLeave={() => setMagnifierStyle({ ...magnifierStyle, display: "none" })}
            >
              <Image
                src={activeImage}
                alt="Zoomed View"
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1200px"
                quality={100}
              />

              {/* Magnifier Glass Effect */}
              <div 
                className="absolute pointer-events-none border-4 border-white shadow-[0_0_20px_rgba(0,0,0,0.4)] rounded-full overflow-hidden"
                style={{
                  display: magnifierStyle.display,
                  top: magnifierStyle.top,
                  left: magnifierStyle.left,
                  width: "200px",
                  height: "200px",
                  zIndex: 100005,
                  backgroundImage: `url(${activeImage})`,
                  backgroundSize: "500% 500%",
                  backgroundPosition: magnifierStyle.backgroundPosition,
                  backgroundRepeat: "no-repeat"
                }}
              />
            </motion.div>
          </div>

          {/* Bottom Carousel Thumbnails */}
          <div className="absolute bottom-8 md:bottom-12 flex space-x-4 p-4 z-[100002] pointer-events-auto" onClick={(e) => e.stopPropagation()}>
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(idx);
                }}
                className={`relative w-14 h-18 md:w-20 md:h-24 bg-brand-charcoal/5 overflow-hidden transition-all duration-300 border-2 shadow-md ${
                  activeImageIndex === idx 
                    ? "border-brand-gold scale-110 shadow-xl" 
                    : "border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <Image src={img} alt="Thumbnail" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="sticky top-32 space-y-6">
      {/* Static Main Image */}
      <div 
        className="relative aspect-[3/4] w-full bg-brand-charcoal/5 overflow-hidden cursor-zoom-in group"
        onClick={() => setIsModalOpen(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <Image
              src={activeImage}
              alt="Product Main View"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-brand-charcoal/0 group-hover:bg-brand-charcoal/5 transition-colors duration-300 flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-md p-3 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 shadow-xl border border-brand-charcoal/5">
            <ZoomIn className="w-5 h-5 text-brand-charcoal" />
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImageIndex(idx)}
            className={`relative aspect-square w-full bg-brand-charcoal/5 overflow-hidden transition-all duration-300 ${
              activeImageIndex === idx 
                ? "ring-1 ring-brand-gold ring-offset-2 ring-offset-brand-cream" 
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <Image 
              src={img} 
              alt={`Thumbnail ${idx + 1}`} 
              fill 
              className="object-cover" 
              sizes="(max-width: 1024px) 25vw, 15vw"
            />
          </button>
        ))}
      </div>

      {/* Portal the Modal to body to fix all z-index/overlay issues */}
      {mounted && typeof document !== 'undefined' && createPortal(modalContent, document.body)}
    </div>
  );
}
