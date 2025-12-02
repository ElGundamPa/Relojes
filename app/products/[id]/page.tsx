import { redirect } from "next/navigation";
import { getProductById, getRelatedProducts } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { AnimatedSection } from "@/components/animated-section";

import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = getProductById(params.id);
  
  if (!product) {
    return {
      title: "Producto no encontrado",
    };
  }

  return {
    title: `${product.name} | Relojes de Lujo`,
    description: product.description || `Descubre ${product.name}. Reloj de lujo de la marca ${product.brand}.`,
    openGraph: {
      title: `${product.name} | Relojes de Lujo`,
      description: product.description || `Descubre ${product.name}.`,
      type: "website",
      images: product.image ? [product.image] : [],
    },
  };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);

  if (!product) {
    redirect("/not-found");
  }

  const relatedProducts = getRelatedProducts(product.id, 4);

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Galería */}
        <div className="mb-16">
          <ProductGallery images={product.images || [product.image]} productName={product.name} />
        </div>

        {/* Productos Relacionados */}
        {relatedProducts.length > 0 && (
          <AnimatedSection>
            <h2 className="text-3xl font-display font-bold mb-8">
              Productos Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  index={index}
                />
              ))}
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
