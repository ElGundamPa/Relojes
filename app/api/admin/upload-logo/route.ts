import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const brandSlug = formData.get("brandSlug") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    if (!brandSlug) {
      return NextResponse.json(
        { error: "brandSlug es requerido" },
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

    // Validar tamaño (max 5MB para logos)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "El archivo es demasiado grande. Máximo 5MB" },
        { status: 400 }
      );
    }

    // Crear ruta de destino para logo
    const uploadDir = join(
      process.cwd(),
      "public",
      "brands",
      brandSlug
    );

    // Crear carpetas si no existen
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Guardar como logo.png (o mantener extensión original)
    const fileExtension = file.name.split('.').pop() || 'png';
    const filename = `logo.${fileExtension}`;
    const filePath = join(uploadDir, filename);

    // Convertir File a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Guardar archivo
    await writeFile(filePath, buffer);

    // Retornar ruta relativa
    const relativePath = `/brands/${brandSlug}/${filename}`;

    return NextResponse.json(
      {
        success: true,
        path: relativePath,
        filename,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    logger.error("Error uploading logo:", error);
    const errorObj = error as { message?: string };
    return NextResponse.json(
      { error: `Error al subir el logo: ${errorObj.message || "Error desconocido"}` },
      { status: 500 }
    );
  }
}
