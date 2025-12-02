import { brands } from "@/data/products";
import { BrandCarousel } from "@/components/brand-carousel";
import { AnimatedSection } from "@/components/animated-section";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marcas | Relojes de Lujo",
  description: "Explora nuestras marcas exclusivas de relojes de lujo. Rolex, Omega, Patek Philippe, Audemars Piguet y más.",
  openGraph: {
    title: "Marcas | Relojes de Lujo",
    description: "Explora nuestras marcas exclusivas de relojes de lujo.",
    type: "website",
  },
};

export default function BrandsPage() {
  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">
            Nuestras Marcas
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Descubre las marcas más prestigiosas en relojería de lujo.
          </p>
        </AnimatedSection>

        <BrandCarousel brands={brands} />
      </div>
    </div>
  );
}

