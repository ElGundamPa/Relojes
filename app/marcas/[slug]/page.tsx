import { notFound } from "next/navigation";
import dynamicImport from "next/dynamic";
import { getAllBrands, getCachedProductsByBrand } from "@/lib/data-cache";
import { AnimatedSection } from "@/components/animated-section";

// Code splitting: Componentes pesados
const BrandCarousel = dynamicImport(() => import("@/components/brand-carousel").then(mod => ({ default: mod.BrandCarousel })), {
  ssr: true,
  loading: () => <div className="h-[360px] animate-pulse bg-muted rounded-2xl" />
});

const ProductCard = dynamicImport(() => import("@/components/product-card").then(mod => ({ default: mod.ProductCard })), {
  ssr: true,
  loading: () => <div className="aspect-square bg-muted rounded-2xl animate-pulse" />
});

// Forzar generación estática
export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = false;

interface BrandPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const brands = await getAllBrands();
  return brands.map((brand) => ({
    slug: brand.slug,
  }));
}

import type { Metadata } from "next";

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const brands = await getAllBrands();
  const brand = brands.find((b) => b.slug === params.slug);
  
  if (!brand) {
    return {
      title: "Marca no encontrada",
    };
  }

  return {
    title: `${brand.name} | Relojes de Lujo`,
    description: `Explora nuestra colección de relojes ${brand.name}. ${brand.count} ${brand.count === 1 ? "reloj disponible" : "relojes disponibles"}.`,
    openGraph: {
      title: `${brand.name} | Relojes de Lujo`,
      description: `Explora nuestra colección de relojes ${brand.name}.`,
      type: "website",
    },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const brands = await getAllBrands();
  const brand = brands.find((b) => b.slug === params.slug);
  
  if (!brand) {
    notFound();
  }

  const products = await getCachedProductsByBrand(brand.name);
  const otherBrands = brands.filter((b) => b.slug !== params.slug);

  return (
    <div className="min-h-screen">
      {/* Hero Section Premium */}
      <AnimatedSection className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              {brand.name}
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4">
              Precisión y elegancia en cada pieza. Descubre la excelencia de {brand.name} en nuestra colección exclusiva.
            </p>
            <p className="text-lg text-muted-foreground/80">
              {products.length} {products.length === 1 ? "reloj disponible" : "relojes disponibles"} en nuestra colección
            </p>
          </div>
        </div>
      </AnimatedSection>

      <div className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10 mb-24">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No hay productos disponibles para esta marca.
            </p>
          </div>
        )}

        {otherBrands.length > 0 && (
          <AnimatedSection delay={0.3}>
            <h2 className="text-3xl font-display font-bold mb-8 text-center">
              Otras marcas
            </h2>
            <BrandCarousel brands={otherBrands} />
          </AnimatedSection>
        )}
        </div>
      </div>
    </div>
  );
}

