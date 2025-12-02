import { notFound } from "next/navigation";
import dynamicImport from "next/dynamic";
import { getCachedProductBySlug, getCachedRelatedProducts, getCachedSimilarProducts, getAllProducts } from "@/lib/data-cache";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AnimatedSection } from "@/components/animated-section";
import { MobileAddToCart } from "@/components/mobile-add-to-cart";

// Code splitting: Componentes pesados solo se cargan cuando se necesitan
const ProductGallery = dynamicImport(() => import("@/components/product-gallery").then(mod => ({ default: mod.ProductGallery })), {
  ssr: true,
  loading: () => <div className="aspect-square bg-muted rounded-2xl animate-pulse" />
});

const ProductCard = dynamicImport(() => import("@/components/product-card").then(mod => ({ default: mod.ProductCard })), {
  ssr: true,
  loading: () => <div className="aspect-square bg-muted rounded-2xl animate-pulse" />
});

// Forzar generación estática
export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = false;

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

import type { Metadata } from "next";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getCachedProductBySlug(params.slug);

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

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getCachedProductBySlug(params.slug);
  
  if (!product) {
    notFound();
  }
  
  const relatedProducts = await getCachedRelatedProducts(product.id, 3);
  const similarProducts = await getCachedSimilarProducts(product.id, 4);

  return (
    <div className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <Link
          href="/relojes/todos"
          prefetch
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a relojes
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
          {/* Gallery */}
          <AnimatedSection initialX={-20} animateX={0}>
            <ProductGallery images={product.images} productName={product.name} />
          </AnimatedSection>

          {/* Product Info */}
          <AnimatedSection delay={0.2} initialX={20} animateX={0} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link
                  href={`/marcas/${product.brand.toLowerCase().replace(/\s+/g, "-")}`}
                  prefetch
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {product.brand}
                </Link>
                <span className="text-muted-foreground">/</span>
                <span className="text-sm text-muted-foreground">
                  {product.subcategory}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-bold mb-6">{formatPrice(product.price)}</p>
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-semibold mb-3">Descripción</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.longDescription}
              </p>
            </div>

            <AddToCartButton product={product} />

            <Separator />

            {/* Specifications */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Especificaciones</h2>
              <Card className="border-0 shadow-apple">
                <CardContent className="p-6">
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Marca</dt>
                      <dd className="font-medium">{product.specifications.marca}</dd>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Modelo</dt>
                      <dd className="font-medium">{product.specifications.modelo}</dd>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Movimiento</dt>
                      <dd className="font-medium">
                        {product.specifications.movimiento}
                      </dd>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Caja</dt>
                      <dd className="font-medium">{product.specifications.caja}</dd>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Esfera</dt>
                      <dd className="font-medium">{product.specifications.esfera}</dd>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Correa</dt>
                      <dd className="font-medium">{product.specifications.correa}</dd>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Resistencia al agua</dt>
                      <dd className="font-medium">
                        {product.specifications.resistencia}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>
        </div>

        {/* Recomendaciones Inteligentes */}
        {(relatedProducts.length > 0 || similarProducts.length > 0) && (
          <div className="space-y-12">
            {/* Productos relacionados */}
            {relatedProducts.length > 0 && (
              <AnimatedSection delay={0.3}>
                <h2 className="text-3xl font-display font-bold mb-8">
                  También te puede gustar
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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

            {/* Relojes similares */}
            {similarProducts.length > 0 && (
              <AnimatedSection delay={0.4}>
                <h2 className="text-3xl font-display font-bold mb-8">
                  Relojes similares
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {similarProducts.map((similarProduct, index) => (
                    <ProductCard
                      key={similarProduct.id}
                      product={similarProduct}
                      index={index}
                    />
                  ))}
                </div>
              </AnimatedSection>
            )}
          </div>
        )}
      </div>
      
      {/* Botón flotante móvil */}
      <MobileAddToCart product={product} />
    </div>
  );
}

