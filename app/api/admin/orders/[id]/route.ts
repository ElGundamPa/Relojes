import { NextRequest, NextResponse } from "next/server";
import { ordersService } from "@/lib/services/ordersService";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = ordersService.getById(params.id);
    if (!order) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener orden" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    const updatedOrder = ordersService.update(params.id, updates);
    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json({ order: updatedOrder }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar orden" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = ordersService.delete(params.id);
    if (!success) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar orden" },
      { status: 500 }
    );
  }
}


