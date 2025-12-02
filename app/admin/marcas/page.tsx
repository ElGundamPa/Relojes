"use client";

import { useEffect, useState } from "react";
import { brandsServiceClient } from "@/lib/services/brandsService.client";
import { BrandData } from "@/data/brands";
import { brandsData } from "@/data/brands";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { LogoUploader } from "@/components/admin/logo-uploader";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<BrandData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    // Primero intentar cargar desde el servicio (datos editados)
    const serviceBrands = await brandsServiceClient.getAll();
    
    // Si no hay marcas en el servicio, usar las generadas automáticamente
    if (serviceBrands.length === 0 && brandsData.length > 0) {
      setBrands(brandsData as BrandData[]);
    } else {
      setBrands(serviceBrands);
    }
  };

  const handleCreate = () => {
    setSelectedBrand({
      name: "",
      slug: "",
      image: "",
      count: 0,
      description: "",
      logo: "",
      active: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (brand: BrandData) => {
    setSelectedBrand({ ...brand });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedBrand) return;

    try {
      if (selectedBrand.slug) {
        await brandsServiceClient.update(selectedBrand.slug, selectedBrand);
      } else {
        await brandsServiceClient.create(selectedBrand);
      }
      loadBrands();
      setIsDialogOpen(false);
    } catch (error) {
      alert("Error al guardar la marca");
    }
  };

  const handleDelete = async (slug: string) => {
    if (confirm("¿Estás seguro de eliminar esta marca?")) {
      try {
        await brandsServiceClient.delete(slug);
        loadBrands();
      } catch (error: any) {
        alert(error.message || "Error al eliminar la marca");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Marcas</h1>
          <p className="text-muted-foreground">
            Gestiona las marcas de tu tienda
          </p>
        </div>
        <Button onClick={handleCreate} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Nueva Marca
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand, index) => (
          <motion.div
            key={brand.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <Card className="border-0 shadow-premium hover:shadow-premium-hover transition-shadow">
              <div className="relative aspect-square overflow-hidden bg-muted rounded-t-lg">
                {brand.image && (
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-1">{brand.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {brand.count} productos
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(brand)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(brand.slug)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedBrand?.slug ? "Editar Marca" : "Nueva Marca"}
            </DialogTitle>
          </DialogHeader>
          {selectedBrand && (
            <BrandForm
              brand={selectedBrand}
              onChange={setSelectedBrand}
              onSave={handleSave}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BrandForm({
  brand,
  onChange,
  onSave,
}: {
  brand: BrandData;
  onChange: (brand: BrandData) => void;
  onSave: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la Marca</Label>
        <Input
          id="name"
          value={brand.name}
          onChange={(e) => onChange({ ...brand, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <textarea
          id="description"
          value={brand.description || ""}
          onChange={(e) => onChange({ ...brand, description: e.target.value })}
          className="flex w-full rounded-md border border-input bg-background px-4 py-2 text-sm min-h-[100px]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="logo">Logo de la Marca</Label>
        <LogoUploader
          currentLogo={brand.logo}
          brandSlug={brand.slug || brand.name.toLowerCase().replace(/\s+/g, "-")}
          onLogoUploaded={(path) => onChange({ ...brand, logo: path, image: path })}
        />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={() => {}}>
          Cancelar
        </Button>
        <Button onClick={onSave}>Guardar</Button>
      </div>
    </div>
  );
}

