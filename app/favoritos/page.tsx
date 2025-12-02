"use client";

import { useEffect, useState } from "react";
import { useWishlistStore } from "@/lib/store-wishlist";
import { ProductCard } from "@/components/product-card";
import { AnimatedSection } from "@/components/animated-section";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function FavoritosPage() {
  const { items } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-6">
            <Heart className="h-10 w-10 text-red-500 fill-red-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">
            Mis Favoritos
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {items.length === 0
              ? "Guarda tus relojes favoritos para encontrarlos fácilmente más tarde"
              : `${items.length} ${items.length === 1 ? "reloj guardado" : "relojes guardados"} en tu lista de favoritos`}
          </p>
        </AnimatedSection>

        {items.length === 0 ? (
          <AnimatedSection delay={0.2} className="text-center py-24">
            <div className="max-w-md mx-auto">
              <Heart className="h-24 w-24 mx-auto mb-6 text-muted-foreground/30" />
              <h2 className="text-2xl font-semibold mb-4">Tu lista de favoritos está vacía</h2>
              <p className="text-muted-foreground mb-8">
                Explora nuestra colección y guarda tus relojes favoritos haciendo clic en el corazón.
              </p>
              <Button size="lg" asChild>
                <Link href="/relojes/todos" prefetch>
                  Explorar relojes
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
            {items.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

