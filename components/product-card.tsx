"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice, cn } from "@/lib/utils";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/store-wishlist";
import { ShoppingBag, Heart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-2xl bg-card border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-250 ease-out hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:scale-[1.04] hover:-translate-y-1 group/card">
        <Link href={`/reloj/${product.slug}`} prefetch className="block">
          <div className="aspect-square relative overflow-hidden bg-muted">
            <motion.div
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full h-full"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-250 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
              />
            </motion.div>
            
            {/* Wishlist Button */}
            <button
              onClick={handleToggleWishlist}
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-background/90 hover:bg-background transition-all duration-300 opacity-0 group-hover/card:opacity-100 shadow-lg"
              aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground hover:text-red-500 hover:scale-115"
                )}
              />
            </button>
          </div>
          <div className="p-6 relative z-20">
            <div className="mb-2">
              <p className="text-xs font-medium text-muted-foreground/80 mb-1 uppercase tracking-wider">
                {product.brand}
              </p>
              <h3 className="font-semibold text-lg mb-2 transition-colors duration-300">
                {product.name}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {product.description}
            </p>
          </div>
        </Link>
        <div className="px-6 pb-6 relative z-20">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold">
                {formatPrice(product.price)}
              </span>
            </div>
            <div className="opacity-0 group-hover/card:opacity-100 transition-all duration-300">
              <Button
                size="sm"
                onClick={handleAddToCart}
                className="shadow-[0_4px_16px_rgba(59,130,246,0.4)] hover:shadow-[0_6px_24px_rgba(59,130,246,0.6)] hover:scale-105 active:scale-95 transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                type="button"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Agregar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
