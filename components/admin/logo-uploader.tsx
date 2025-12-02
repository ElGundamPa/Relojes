"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface LogoUploaderProps {
  currentLogo?: string;
  brandSlug: string;
  onLogoUploaded: (path: string) => void;
}

export function LogoUploader({
  currentLogo,
  brandSlug,
  onLogoUploaded,
}: LogoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentLogo || null);
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

    // Validar tamaño (max 5MB para logos)
    if (file.size > 5 * 1024 * 1024) {
      setError("El archivo es demasiado grande. Máximo 5MB");
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

      // Subir archivo
      const formData = new FormData();
      formData.append("file", file);
      formData.append("brandSlug", brandSlug);

      const response = await fetch("/api/admin/upload-logo", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al subir el logo");
      }

      // Actualizar con la ruta del servidor
      setPreview(data.path);
      onLogoUploaded(data.path);
    } catch (err: any) {
      setError(err.message || "Error al subir el logo");
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
    onLogoUploaded("");
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
              Subir Logo
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
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border bg-muted">
              <Image
                src={preview}
                alt="Logo preview"
                fill
                className="object-contain p-2"
                sizes="128px"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {preview.startsWith("/brands/") && (
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
            Haz clic o arrastra un logo JPG, PNG o WEBP
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Máximo 5MB
          </p>
        </div>
      )}
    </div>
  );
}

