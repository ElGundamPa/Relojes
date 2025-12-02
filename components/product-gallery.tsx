"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductZoom } from "@/components/product-zoom";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const mainImageRef = useRef<HTMLImageElement>(null);
  const fullscreenImageRef = useRef<HTMLImageElement>(null);

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const currentImage = images[selectedIndex];

  return (
    <>
      <div className="flex gap-4">
        {/* Thumbnails Verticales (estilo Cartier) */}
        {images.length > 1 && (
          <div className="hidden lg:flex flex-col gap-3 overflow-y-auto max-h-[600px] pr-2">
            {images.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => setSelectedIndex(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "relative w-20 h-20 overflow-hidden rounded-lg border-2 transition-all duration-300 flex-shrink-0",
                  selectedIndex === index
                    ? "border-foreground shadow-premium ring-2 ring-blue-500/50"
                    : "border-transparent hover:border-border/50"
                )}
              >
                <Image
                  src={image}
                  alt={`${productName} - Miniatura ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                  loading="lazy"
                />
              </motion.button>
            ))}
          </div>
        )}

        {/* Main Image with Zoom */}
        <div className="flex-1 relative aspect-square overflow-visible rounded-2xl bg-muted shadow-[0_8px_32px_rgba(0,0,0,0.12)] group">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative zoom-wrapper w-full h-full rounded-2xl"
            >
              <img
                ref={mainImageRef}
                id="main-image"
                src={currentImage}
                alt={`${productName} - Imagen ${selectedIndex + 1}`}
                className="w-full h-full object-cover rounded-2xl cursor-zoom-in"
                onClick={openFullscreen}
                draggable={false}
                onLoad={(e) => {
                  // Las dimensiones naturales se obtienen automáticamente en ProductZoom
                }}
              />
              
              <ProductZoom
                imgRef={mainImageRef}
                src={currentImage}
                zoom={3}
                lensSize={180}
                fullscreen={false}
              />

              {/* Icono de zoom para indicar que se puede hacer click */}
              <div 
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ pointerEvents: "none", zIndex: 5 }}
              >
                <div className="bg-black/60 backdrop-blur-md rounded-full p-4 shadow-lg">
                  <ZoomIn className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-md hover:bg-background rounded-full border border-border/50 shadow-premium z-10"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-md hover:bg-background rounded-full border border-border/50 shadow-premium z-10"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full z-10">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails Horizontales (móvil) */}
        {images.length > 1 && (
          <div className="lg:hidden grid grid-cols-4 gap-3 mt-4">
            {images.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => setSelectedIndex(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-xl border-2 transition-all duration-300",
                  selectedIndex === index
                    ? "border-foreground shadow-premium ring-2 ring-blue-500/50"
                    : "border-transparent hover:border-border/50"
                )}
              >
                <Image
                  src={image}
                  alt={`${productName} - Miniatura ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 12.5vw"
                  loading="lazy"
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFullscreen(false)}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              >
                <X className="h-6 w-6" />
              </Button>

              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative zoom-wrapper w-full h-full flex items-center justify-center">
                  <img
                    ref={fullscreenImageRef}
                    id="fullscreen-image"
                    src={currentImage}
                    alt={`${productName} - Imagen ${selectedIndex + 1}`}
                    className="w-full h-full object-contain"
                    draggable={false}
                    onLoad={(e) => {
                      // Las dimensiones naturales se obtienen automáticamente en ProductZoom
                    }}
                  />
                  
                  <ProductZoom
                    imgRef={fullscreenImageRef}
                    src={currentImage}
                    zoom={3}
                    lensSize={200}
                    fullscreen={true}
                  />
                </div>
              </motion.div>

              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full z-10">
                  {selectedIndex + 1} / {images.length}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
