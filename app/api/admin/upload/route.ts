import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const brand = formData.get("brand") as string;
    const slug = formData.get("slug") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    if (!brand || !slug) {
      return NextResponse.json(
        { error: "Marca y slug son requeridos" },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Solo JPG, PNG y WEBP" },
        { status: 400 }
      );
    }

    // Validar tamaño (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "El archivo es demasiado grande. Máximo 10MB" },
        { status: 400 }
      );
    }

    // Convertir marca a slug para la carpeta
    const brandSlug = brand
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Verificar si es para galería
    const isGallery = formData.get("gallery") === "true";
    
    // Crear ruta de destino
    const uploadDir = join(
      process.cwd(),
      "public",
      "products",
      brandSlug,
      slug,
      isGallery ? "gallery" : ""
    );

    // Crear carpetas si no existen
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Obtener nombre original del archivo
    const filename = file.name;
    const filePath = join(uploadDir, filename);

    // Convertir File a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Guardar archivo
    await writeFile(filePath, buffer);

    // Retornar ruta relativa para usar en el frontend
    const relativePath = isGallery
      ? `/products/${brandSlug}/${slug}/gallery/${filename}`
      : `/products/${brandSlug}/${slug}/${filename}`;

    return NextResponse.json(
      {
        success: true,
        path: relativePath,
        filename,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    logger.error("Error uploading file:", error);
    const errorObj = error as { message?: string };
    return NextResponse.json(
      { error: `Error al subir el archivo: ${errorObj.message || "Error desconocido"}` },
      { status: 500 }
    );
  }
}


