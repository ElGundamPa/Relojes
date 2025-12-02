import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { AnimatedSection } from "@/components/animated-section";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Relojes Importados | Relojes de Lujo",
  description: "Descubre nuestra selección de relojes importados de las mejores marcas suizas. Autenticidad garantizada.",
};

export default function ImportedWatchesPage() {
  // Todos los productos son importados (marcas suizas)
  const importedProducts = products;

  return (
    <div className="min-h-screen">
      <AnimatedSection className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-foreground text-background mb-6">
              <Globe className="h-10 w-10" />
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6">
              Relojes Importados
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Autenticidad garantizada. Todos nuestros relojes son importados directamente de las mejores manufacturas suizas, con certificados de autenticidad y garantía oficial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/relojes/todos">
                  Ver todos los relojes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/marcas">Ver todas las marcas</Link>
              </Button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Relojes Importados Disponibles
            </h2>
            <p className="text-muted-foreground">
              {importedProducts.length} {importedProducts.length === 1 ? "reloj disponible" : "relojes disponibles"}
            </p>
          </div>

          {importedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {importedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-xl text-muted-foreground mb-4">
                No hay productos disponibles en este momento
              </p>
              <Button asChild>
                <Link href="/relojes/todos">Ver todos los relojes</Link>
              </Button>
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* Benefits Section */}
      <AnimatedSection className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Autenticidad Garantizada</h3>
              <p className="text-muted-foreground">
                Todos nuestros relojes vienen con certificados de autenticidad oficiales
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Garantía Oficial</h3>
              <p className="text-muted-foreground">
                Garantía de fábrica en todos los relojes importados
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Envío Seguro</h3>
              <p className="text-muted-foreground">
                Embalaje premium y seguro para proteger tu inversión
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

