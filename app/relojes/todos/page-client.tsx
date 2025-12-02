"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { ProductFilters, FilterState } from "@/components/product-filters";
import { AnimatedSection } from "@/components/animated-section";
import { searchService } from "@/lib/services/searchService";
import { Product } from "@/data/products";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Code splitting: ProductCard solo se carga cuando se necesita
const ProductCard = dynamic(() => import("@/components/product-card").then(mod => ({ default: mod.ProductCard })), {
  ssr: true,
  loading: () => <div className="aspect-square bg-muted rounded-2xl animate-pulse" />
});

// Esta página necesita ser client-side por los filtros interactivos
// Pero los datos iniciales vienen del servidor
export default function AllProductsPage({ initialProducts }: { initialProducts: Product[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    genders: [],
    sizes: [],
    colors: [],
    materials: [],
    movements: [],
    priceRange: [0, 200000],
  });

  // Usar useMemo para calcular productos filtrados (evita re-renders innecesarios)
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Búsqueda inteligente si hay query
    if (searchQuery.trim()) {
      result = searchService.intelligentSearch(searchQuery, initialProducts);
    }

    // Aplicar filtros
    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand));
    }

    if (filters.genders.length > 0) {
      result = result.filter(
        (p) =>
          filters.genders.some((g) =>
            p.subcategory.toLowerCase().includes(g.toLowerCase())
          ) ||
          filters.genders.some((g) =>
            p.name.toLowerCase().includes(g.toLowerCase())
          )
      );
    }

    if (filters.sizes.length > 0) {
      result = result.filter((p) =>
        filters.sizes.some((size) => p.name.includes(size) || p.subcategory.includes(size))
      );
    }

    if (filters.colors.length > 0) {
      result = result.filter((p) =>
        filters.colors.some(
          (color) =>
            p.name.toLowerCase().includes(color.toLowerCase()) ||
            p.description.toLowerCase().includes(color.toLowerCase())
        )
      );
    }

    if (filters.materials.length > 0) {
      result = result.filter((p) =>
        filters.materials.some(
          (material) =>
            p.specifications.caja.toLowerCase().includes(material.toLowerCase()) ||
            p.specifications.correa.toLowerCase().includes(material.toLowerCase())
        )
      );
    }

    if (filters.movements.length > 0) {
      result = result.filter((p) =>
        filters.movements.some((movement) =>
          p.specifications.movimiento.toLowerCase().includes(movement.toLowerCase())
        )
      );
    }

    // Filtro de precio
    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    return result;
  }, [filters, searchQuery, initialProducts]);

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">
            Todos los Relojes
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "reloj disponible"
              : "relojes disponibles"}{" "}
            en nuestra colección
          </p>
          
          {/* Búsqueda Inteligente */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar: 'rolex azul 36mm', 'patek rojo dama', 'malla caucho'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtros */}
          <div className="lg:col-span-1">
            <ProductFilters onFilterChange={setFilters} />
          </div>

          {/* Productos */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No se encontraron productos con los filtros seleccionados.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

