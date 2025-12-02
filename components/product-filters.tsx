"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { filterConfig } from "@/data/filtersConfig";
import { brands } from "@/data/products";
import { X, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  brands: string[];
  genders: string[];
  sizes: string[];
  colors: string[];
  materials: string[];
  movements: string[];
  priceRange: [number, number];
}

export function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    genders: [],
    sizes: [],
    colors: [],
    materials: [],
    movements: [],
    priceRange: [filterConfig.priceRange.min, filterConfig.priceRange.max],
  });

  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (
    category: keyof FilterState,
    value: string | [number, number]
  ) => {
    const newFilters = { ...filters };

    if (category === "priceRange" && Array.isArray(value)) {
      newFilters.priceRange = value;
    } else if (typeof value === "string") {
      const currentArray = newFilters[category] as string[];
      if (currentArray.includes(value)) {
        (newFilters[category] as string[]) = currentArray.filter(
          (v) => v !== value
        );
      } else {
        (newFilters[category] as string[]) = [...currentArray, value];
      }
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      brands: [],
      genders: [],
      sizes: [],
      colors: [],
      materials: [],
      movements: [],
      priceRange: [filterConfig.priceRange.min, filterConfig.priceRange.max],
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const activeFiltersCount =
    filters.brands.length +
    filters.genders.length +
    filters.sizes.length +
    filters.colors.length +
    filters.materials.length +
    filters.movements.length +
    (filters.priceRange[0] !== filterConfig.priceRange.min ||
    filters.priceRange[1] !== filterConfig.priceRange.max
      ? 1
      : 0);

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </Button>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {(isOpen || (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="lg:sticky lg:top-24"
          >
            <Card className="border-0 shadow-premium">
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Filtros</CardTitle>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-sm"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Limpiar
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Marcas */}
                <div>
                  <Label className="mb-3 block font-semibold">Marcas</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.map((brand) => (
                      <label
                        key={brand.slug}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-muted p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={filters.brands.includes(brand.name)}
                          onChange={() => updateFilter("brands", brand.name)}
                          className="rounded"
                        />
                        <span className="text-sm">{brand.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Género */}
                <div>
                  <Label className="mb-3 block font-semibold">Género</Label>
                  <div className="space-y-2">
                    {filterConfig.genders.map((gender) => (
                      <label
                        key={gender}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-muted p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={filters.genders.includes(gender)}
                          onChange={() => updateFilter("genders", gender)}
                          className="rounded"
                        />
                        <span className="text-sm">{gender}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Tamaño */}
                <div>
                  <Label className="mb-3 block font-semibold">Tamaño</Label>
                  <div className="space-y-2">
                    {filterConfig.sizes.map((size) => (
                      <label
                        key={size}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-muted p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={filters.sizes.includes(size)}
                          onChange={() => updateFilter("sizes", size)}
                          className="rounded"
                        />
                        <span className="text-sm">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Color */}
                <div>
                  <Label className="mb-3 block font-semibold">Color</Label>
                  <div className="space-y-2">
                    {filterConfig.colors.map((color) => (
                      <label
                        key={color}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-muted p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={filters.colors.includes(color)}
                          onChange={() => updateFilter("colors", color)}
                          className="rounded"
                        />
                        <span className="text-sm">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Material */}
                <div>
                  <Label className="mb-3 block font-semibold">Material</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {filterConfig.materials.map((material) => (
                      <label
                        key={material}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-muted p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={filters.materials.includes(material)}
                          onChange={() => updateFilter("materials", material)}
                          className="rounded"
                        />
                        <span className="text-sm">{material}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Movimiento */}
                <div>
                  <Label className="mb-3 block font-semibold">Movimiento</Label>
                  <div className="space-y-2">
                    {filterConfig.movements.map((movement) => (
                      <label
                        key={movement}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-muted p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={filters.movements.includes(movement)}
                          onChange={() => updateFilter("movements", movement)}
                          className="rounded"
                        />
                        <span className="text-sm">{movement}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Precio */}
                <div>
                  <Label className="mb-3 block font-semibold">
                    Precio: €{filters.priceRange[0].toLocaleString()} - €
                    {filters.priceRange[1].toLocaleString()}
                  </Label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={filterConfig.priceRange.min}
                      max={filterConfig.priceRange.max}
                      value={filters.priceRange[0]}
                      onChange={(e) =>
                        updateFilter("priceRange", [
                          parseInt(e.target.value),
                          filters.priceRange[1],
                        ])
                      }
                      className="w-full"
                    />
                    <input
                      type="range"
                      min={filterConfig.priceRange.min}
                      max={filterConfig.priceRange.max}
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        updateFilter("priceRange", [
                          filters.priceRange[0],
                          parseInt(e.target.value),
                        ])
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

