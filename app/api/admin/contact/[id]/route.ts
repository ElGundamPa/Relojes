import { NextRequest, NextResponse } from "next/server";
import { contactService } from "@/lib/services/contactService";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();

    if (body.read !== undefined) {
      const message = contactService.markAsRead(id);
      if (!message) {
        return NextResponse.json(
          { error: "Mensaje no encontrado" },
          { status: 404 }
        );
      }
      return NextResponse.json({ message }, { status: 200 });
    }

    return NextResponse.json(
      { error: "Operación no válida" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar el mensaje" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const deleted = contactService.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Mensaje no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar el mensaje" },
      { status: 500 }
    );
  }
}

