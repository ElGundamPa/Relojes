import { NextRequest, NextResponse } from "next/server";
import { ordersService } from "@/lib/services/ordersService";
import { Order } from "@/data/orders";

// Forzar renderizado dinámico ya que usamos searchParams
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as Order["status"] | null;

    if (status) {
      const orders = ordersService.getByStatus(status);
      return NextResponse.json({ orders }, { status: 200 });
    }

    const orders = ordersService.getAll();
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener órdenes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const order: Omit<Order, "id" | "createdAt" | "updatedAt"> =
      await request.json();
    const newOrder = ordersService.create(order);
    return NextResponse.json({ order: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear orden" },
      { status: 500 }
    );
  }
}


