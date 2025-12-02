"use client";

import { useEffect, useState } from "react";
import { productsServiceClient } from "@/lib/services/productsService.client";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Search, Upload, X, Eye, ImageIcon } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { ImageUploader } from "@/components/admin/image-uploader";
import { GalleryUploader } from "@/components/admin/gallery-uploader";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const allProducts = await productsServiceClient.getAll();
    setProducts(allProducts);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setSelectedProduct({ ...product });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct({
      id: "",
      name: "",
      slug: "",
      brand: "",
      category: "",
      subcategory: "",
      image: "",
      images: [],
      price: 0,
      description: "",
      longDescription: "",
      specifications: {
        marca: "",
        modelo: "",
        movimiento: "",
        caja: "",
        esfera: "",
        correa: "",
        resistencia: "",
      },
    } as Product);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedProduct) return;

    try {
      if (isEditing) {
        await productsServiceClient.update(selectedProduct.id, selectedProduct);
      } else {
        await productsServiceClient.create(selectedProduct);
      }
      loadProducts();
      setIsDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      alert("Error al guardar el producto");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await productsServiceClient.delete(id);
        loadProducts();
      } catch (error) {
        alert("Error al eliminar el producto");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Productos</h1>
          <p className="text-muted-foreground">
            Gestiona todos los productos de tu tienda
          </p>
        </div>
        <Button onClick={handleCreate} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <Card className="border-0 shadow-premium hover:shadow-premium-hover transition-shadow">
              <div className="relative aspect-square overflow-hidden bg-muted rounded-t-lg">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                    <ImageIcon className="h-12 w-12" />
                  </div>
                )}
                {!product.image && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                    Sin imagen
                  </div>
                )}
                {(!product.price || product.price === 0) && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Sin precio
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {product.brand || "Sin marca"} • {product.subcategory || "Sin categoría"}
                    </p>
                  </div>
                  <div className="ml-2">
                    {(!product.brand || !product.subcategory) && (
                      <div className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                        ⚠️
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xl font-bold mb-2">
                  {product.price > 0 ? formatPrice(product.price) : "Sin precio"}
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  ID: {product.id.slice(0, 20)}...
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/reloj/${product.slug}`, "_blank")}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
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

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Producto" : "Nuevo Producto"}
            </DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <ProductForm
              product={selectedProduct}
              onChange={setSelectedProduct}
              onSave={handleSave}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProductForm({
  product,
  onChange,
  onSave,
}: {
  product: Product;
  onChange: (product: Product) => void;
  onSave: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={product.name}
            onChange={(e) =>
              onChange({ ...product, name: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Marca</Label>
          <Input
            id="brand"
            value={product.brand}
            onChange={(e) =>
              onChange({ ...product, brand: e.target.value, category: e.target.value })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subcategory">Categoría/Subcategoría</Label>
          <Input
            id="subcategory"
            value={product.subcategory}
            onChange={(e) =>
              onChange({ ...product, subcategory: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Precio (€)</Label>
          <Input
            id="price"
            type="number"
            value={product.price}
            onChange={(e) =>
              onChange({ ...product, price: parseFloat(e.target.value) || 0 })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <textarea
          id="description"
          value={product.description}
          onChange={(e) =>
            onChange({ ...product, description: e.target.value })
          }
          className="flex w-full rounded-md border border-input bg-background px-4 py-2 text-sm min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="longDescription">Descripción Larga</Label>
        <textarea
          id="longDescription"
          value={product.longDescription}
          onChange={(e) =>
            onChange({ ...product, longDescription: e.target.value })
          }
          className="flex w-full rounded-md border border-input bg-background px-4 py-2 text-sm min-h-[120px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Especificaciones</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="movimiento">Movimiento</Label>
            <Input
              id="movimiento"
              value={product.specifications.movimiento}
              onChange={(e) =>
                onChange({
                  ...product,
                  specifications: {
                    ...product.specifications,
                    movimiento: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="caja">Caja</Label>
            <Input
              id="caja"
              value={product.specifications.caja}
              onChange={(e) =>
                onChange({
                  ...product,
                  specifications: {
                    ...product.specifications,
                    caja: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="esfera">Esfera</Label>
            <Input
              id="esfera"
              value={product.specifications.esfera}
              onChange={(e) =>
                onChange({
                  ...product,
                  specifications: {
                    ...product.specifications,
                    esfera: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="correa">Correa</Label>
            <Input
              id="correa"
              value={product.specifications.correa}
              onChange={(e) =>
                onChange({
                  ...product,
                  specifications: {
                    ...product.specifications,
                    correa: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Imagen Principal</Label>
        <ImageUploader
          currentImage={product.image}
          brand={product.brand}
          productName={product.name}
          onImageUploaded={(path) =>
            onChange({
              ...product,
              image: path,
              images: path ? [path, ...product.images.filter((img) => img !== path)] : product.images,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Galería de Imágenes</Label>
        <GalleryUploader
          currentImages={product.images || []}
          brand={product.brand}
          productName={product.name}
          onImagesUploaded={(paths) =>
            onChange({
              ...product,
              images: paths,
              image: paths[0] || product.image, // Primera imagen como principal si no hay
            })
          }
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

