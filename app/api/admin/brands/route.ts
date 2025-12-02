import { NextRequest, NextResponse } from "next/server";
import { brandsService } from "@/lib/services/brandsService";
import { BrandData } from "@/data/brands";

// Forzar renderizado dinámico ya que usamos searchParams en DELETE
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const brands = brandsService.getAll();
    return NextResponse.json({ brands }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener marcas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const brandData: Omit<BrandData, "slug" | "count" | "image"> =
      await request.json();
    const newBrand = brandsService.create(brandData);
    return NextResponse.json({ brand: newBrand }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear marca" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { slug, ...updates } = await request.json();
    const updatedBrand = brandsService.update(slug, updates);
    if (!updatedBrand) {
      return NextResponse.json(
        { error: "Marca no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json({ brand: updatedBrand }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar marca" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Slug requerido" }, { status: 400 });
    }
    const success = brandsService.delete(slug);
    if (!success) {
      return NextResponse.json(
        { error: "Marca no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al eliminar marca" },
      { status: 500 }
    );
  }
}


