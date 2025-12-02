"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { Product } from "@/data/products";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export function AddToCartButton({ product, className = "" }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className={className}>
      <Button
        size="lg"
        onClick={handleAddToCart}
        className="w-full sm:w-auto min-w-[200px] shadow-glow hover:shadow-premium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      >
        {added ? (
          <span className="flex items-center">
            <Check className="mr-2 h-5 w-5" />
            Agregado ✓
          </span>
        ) : (
          <span className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Agregar al carrito
          </span>
        )}
      </Button>
    </div>
  );
}
