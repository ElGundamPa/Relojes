"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryUploaderProps {
  currentImages?: string[];
  brand: string;
  productName: string;
  onImagesUploaded: (paths: string[]) => void;
}

export function GalleryUploader({
  currentImages = [],
  brand,
  productName,
  onImagesUploaded,
}: GalleryUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>(currentImages || []);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validar tipos
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const invalidFiles = files.filter((f) => !allowedTypes.includes(f.type));
    if (invalidFiles.length > 0) {
      setError("Solo se permiten archivos JPG, PNG o WEBP");
      return;
    }

    // Validar tamaño (max 10MB por archivo)
    const oversizedFiles = files.filter((f) => f.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError("Algunos archivos son demasiado grandes. Máximo 10MB por archivo");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const uploadedPaths: string[] = [];

      // Generar slug del producto
      let slug = productName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      if (!slug || slug.length === 0) {
        slug = `product-${Date.now()}`;
      }

      // Subir cada archivo
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("brand", brand);
        formData.append("slug", slug);
        formData.append("gallery", "true"); // Indicar que es para galería

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al subir la imagen");
        }

        uploadedPaths.push(data.path);
      }

      // Actualizar previews y notificar
      const newPreviews = [...previews, ...uploadedPaths];
      setPreviews(newPreviews);
      onImagesUploaded(newPreviews);
    } catch (err: any) {
      setError(err.message || "Error al subir las imágenes");
    } finally {
      setUploading(false);
      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onImagesUploaded(newPreviews);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    // Crear un evento sintético para reutilizar handleFileSelect
    const dataTransfer = new DataTransfer();
    Array.from(files).forEach(file => dataTransfer.items.add(file));
    
    const syntheticEvent = {
      target: {
        files: dataTransfer.files,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    await handleFileSelect(syntheticEvent);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={handleClick}
          className="w-full sm:w-auto"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Subiendo...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Agregar Imágenes a la Galería
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <AnimatePresence>
            {previews.map((preview, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative group"
              >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                  <Image
                    src={preview}
                    alt={`Galería ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                    onClick={() => handleRemove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-foreground/80 text-background text-xs px-2 py-1 rounded">
                      Principal
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {previews.length === 0 && !uploading && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
        >
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Haz clic o arrastra múltiples imágenes JPG, PNG o WEBP
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Máximo 10MB por archivo
          </p>
        </div>
      )}
    </div>
  );
}

