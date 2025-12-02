import { NextRequest, NextResponse } from "next/server";
import { productsService } from "@/lib/services/productsService";
import { Product } from "@/data/products";

// Forzar renderizado dinámico ya que usamos searchParams en DELETE
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = productsService.getAll();
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const product: Omit<Product, "id" | "slug"> = await request.json();
    const newProduct = productsService.create(product);
    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();
    const updatedProduct = productsService.update(id, updates);
    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json({ product: updatedProduct }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar producto" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "ID requerido" },
        { status: 400 }
      );
    }
    const success = productsService.delete(id);
    if (!success) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar producto" },
      { status: 500 }
    );
  }
}


