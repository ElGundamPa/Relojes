import { NextRequest, NextResponse } from "next/server";
import { contactService } from "@/lib/services/contactService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const unread = searchParams.get("unread");

    if (unread === "true") {
      const messages = contactService.getUnread();
      return NextResponse.json({ messages }, { status: 200 });
    }

    const messages = contactService.getAll();
    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener mensajes de contacto" },
      { status: 500 }
    );
  }
}

