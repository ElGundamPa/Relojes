import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { AnimatedSection } from "@/components/animated-section";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Productos | Relojes de Lujo",
  description: "Explora nuestra completa colección de relojes de lujo. Más de cientos de modelos disponibles.",
  openGraph: {
    title: "Productos | Relojes de Lujo",
    description: "Explora nuestra completa colección de relojes de lujo.",
    type: "website",
  },
};

export default function ProductsPage() {
  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">
            Nuestra Colección
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Cada reloj es una obra maestra de precisión y elegancia.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

