"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploaderProps {
  currentImage?: string;
  brand: string;
  productName: string;
  onImageUploaded: (path: string) => void;
}

export function ImageUploader({
  currentImage,
  brand,
  productName,
  onImageUploaded,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Solo se permiten archivos JPG, PNG o WEBP");
      return;
    }

    // Validar tamaño (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("El archivo es demasiado grande. Máximo 10MB");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Crear preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Generar slug del producto desde el nombre
      // Ejemplo: "Audemars Piguet Dama 20250716_110536" → "audemars-piguet-dama-20250716-110536"
      let slug = productName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Si no hay nombre o está vacío, generar slug temporal basado en timestamp
      if (!slug || slug.length === 0) {
        slug = `product-${Date.now()}`;
      }

      // Subir archivo
      const formData = new FormData();
      formData.append("file", file);
      formData.append("brand", brand);
      formData.append("slug", slug);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al subir la imagen");
      }

      // Actualizar con la ruta del servidor
      setPreview(data.path);
      onImageUploaded(data.path);
    } catch (err: any) {
      setError(err.message || "Error al subir la imagen");
      setPreview(null);
    } finally {
      setUploading(false);
      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUploaded("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
              Seleccionar Imagen
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative group"
          >
            <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border bg-muted">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {preview.startsWith("/products/") && (
              <p className="text-xs text-muted-foreground mt-2 truncate">
                {preview}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!preview && !uploading && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Haz clic o arrastra una imagen JPG, PNG o WEBP
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Máximo 10MB
          </p>
        </div>
      )}
    </div>
  );
}

