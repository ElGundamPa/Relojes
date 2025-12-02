import dynamicImport from "next/dynamic";
import { getAllProducts } from "@/lib/data-cache";
import { AnimatedSection } from "@/components/animated-section";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Code splitting: ProductCard solo se carga cuando se necesita
const ProductCard = dynamicImport(() => import("@/components/product-card").then(mod => ({ default: mod.ProductCard })), {
  ssr: true,
  loading: () => <div className="aspect-square bg-muted rounded-2xl animate-pulse" />
});

// Forzar generación estática
export const dynamic = "force-static";
export const revalidate = false;

export const metadata = {
  title: "Colección Rolex | Relojes de Lujo",
  description: "Descubre nuestra exclusiva colección de relojes Rolex. Precisión suiza, diseño icónico y calidad excepcional.",
};

export default async function RolexCollectionPage() {
  const products = await getAllProducts();
  const rolexProducts = products.filter(
    (p) => p.brand.toLowerCase() === "rolex"
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <AnimatedSection className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6">
              Colección Rolex
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Descubre la excelencia en relojería suiza. Cada Rolex representa más de un siglo de innovación, precisión y artesanía excepcional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/relojes/todos?brand=Rolex" prefetch>
                  Ver todos los Rolex
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/marcas/rolex" prefetch>
                  Explorar marca
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Products Grid */}
      <AnimatedSection className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Relojes Rolex Disponibles
            </h2>
            <p className="text-muted-foreground">
              {rolexProducts.length} {rolexProducts.length === 1 ? "reloj disponible" : "relojes disponibles"}
            </p>
          </div>

          {rolexProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rolexProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-xl text-muted-foreground mb-4">
                No hay productos disponibles en este momento
              </p>
              <Button asChild>
                <Link href="/relojes/todos" prefetch>Ver todos los relojes</Link>
              </Button>
            </div>
          )}
        </div>
      </AnimatedSection>
    </div>
  );
}

