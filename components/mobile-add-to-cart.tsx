"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/data/products";
import { useCartStore } from "@/lib/store";

interface MobileAddToCartProps {
  product: Product;
}

export function MobileAddToCart({ product }: MobileAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Mostrar cuando el usuario ha scrolleado más del 60% de la página
      setIsVisible(scrollPosition > windowHeight * 0.4 && scrollPosition < documentHeight - windowHeight - 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background/95 backdrop-blur-xl border-t border-border shadow-[0_-8px_32px_rgba(0,0,0,0.2)]"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{product.name}</p>
                <p className="text-lg font-bold">{formatPrice(product.price)}</p>
              </div>
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Agregar
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

