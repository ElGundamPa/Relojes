"use client";

import { useEffect, useState } from "react";
import { brandsServiceClient } from "@/lib/services/brandsService.client";
import { BrandData, Collection } from "@/data/brands";
import { brandsData } from "@/data/brands";
import { collections } from "@/data/collections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminCollectionsPage() {
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    const serviceBrands = await brandsServiceClient.getAll();
    
    // Si no hay marcas en el servicio, usar las generadas automáticamente
    if (serviceBrands.length === 0 && brandsData.length > 0) {
      setBrands(brandsData as BrandData[]);
    } else {
      setBrands(serviceBrands);
    }
    
    const allBrands = serviceBrands.length > 0 ? serviceBrands : (brandsData as BrandData[]);
    if (allBrands.length > 0 && !selectedBrand) {
      setSelectedBrand(allBrands[0].slug);
    }
  };

  const currentBrand = brands.find((b) => b.slug === selectedBrand);
  
  // Obtener colecciones de la marca actual desde el archivo generado
  const brandCollections = collections.filter(
    (c) => c.brand.toLowerCase() === currentBrand?.name.toLowerCase()
  );

  const handleAddCollection = async () => {
    if (!currentBrand) return;
    const name = prompt("Nombre de la colección:");
    if (name) {
      // Actualizar la marca con la nueva colección
      const newCollection: Collection = {
        id: `${selectedBrand}-${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        brand: currentBrand.name,
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        totalProducts: 0,
        description: "",
        active: true,
      };
      const updatedBrand = {
        ...currentBrand,
        collections: [
          ...(currentBrand.collections || []),
          newCollection,
        ],
      };
      await brandsServiceClient.update(selectedBrand, updatedBrand);
      loadBrands();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Colecciones</h1>
        <p className="text-muted-foreground">
          Gestiona las colecciones por marca
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle>Marcas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {brands.map((brand) => (
                <button
                  key={brand.slug}
                  onClick={() => setSelectedBrand(brand.slug)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedBrand === brand.slug
                      ? "bg-foreground text-background"
                      : "hover:bg-muted"
                  }`}
                >
                  {brand.name}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {currentBrand && (
            <Card className="border-0 shadow-premium">
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Colecciones de {currentBrand.name}</CardTitle>
                <Button onClick={handleAddCollection} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Colección
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mostrar colecciones generadas automáticamente */}
                  {brandCollections.map((collection) => (
                    <div
                      key={collection.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border"
                    >
                      <div>
                        <h3 className="font-semibold">{collection.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {collection.totalProducts} productos
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Mostrar colecciones personalizadas si existen */}
                  {currentBrand.collections?.map((collection) => (
                    <div
                      key={collection.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/50"
                    >
                      <div>
                        <h3 className="font-semibold">{collection.name}</h3>
                        {collection.description && (
                          <p className="text-sm text-muted-foreground">
                            {collection.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {brandCollections.length === 0 &&
                    (!currentBrand.collections ||
                      currentBrand.collections.length === 0) && (
                      <p className="text-center text-muted-foreground py-8">
                        No hay colecciones para esta marca
                      </p>
                    )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

