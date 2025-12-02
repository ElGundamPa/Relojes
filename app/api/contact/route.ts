import { NextRequest, NextResponse } from "next/server";
import { contactService } from "@/lib/services/contactService";
import { ContactMessage } from "@/data/contactMessages";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    let message: Omit<ContactMessage, "id" | "createdAt" | "read">;
    
    try {
      message = await request.json();
    } catch (parseError) {
      logger.error("Error parsing JSON:", parseError);
      return NextResponse.json(
        { error: "Error al procesar los datos del formulario" },
        { status: 400 }
      );
    }

    // Validar que el objeto existe
    if (!message) {
      return NextResponse.json(
        { error: "No se recibieron datos" },
        { status: 400 }
      );
    }

    // Validar campos requeridos con mensajes específicos
    if (!message.name || message.name.trim() === "") {
      return NextResponse.json(
        { error: "El nombre es requerido" },
        { status: 400 }
      );
    }

    if (!message.email || message.email.trim() === "") {
      return NextResponse.json(
        { error: "El email es requerido" },
        { status: 400 }
      );
    }

    if (!message.subject || message.subject.trim() === "") {
      return NextResponse.json(
        { error: "El asunto es requerido" },
        { status: 400 }
      );
    }

    if (!message.message || message.message.trim() === "") {
      return NextResponse.json(
        { error: "El mensaje es requerido" },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(message.email.trim())) {
      return NextResponse.json(
        { error: "El formato del email no es válido. Debe incluir un dominio (ej: usuario@dominio.com)" },
        { status: 400 }
      );
    }

    // Limpiar y normalizar los datos
    const cleanMessage: Omit<ContactMessage, "id" | "createdAt" | "read"> = {
      name: message.name.trim(),
      email: message.email.trim().toLowerCase(),
      subject: message.subject.trim(),
      message: message.message.trim(),
    };

    try {
      const newMessage = contactService.create(cleanMessage);
      return NextResponse.json({ message: newMessage }, { status: 201 });
    } catch (serviceError) {
      logger.error("Error en contactService.create:", serviceError);
      return NextResponse.json(
        { error: "Error al guardar el mensaje. Por favor, intenta de nuevo." },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error("Error inesperado al crear mensaje de contacto:", error);
    return NextResponse.json(
      { error: "Error al enviar el mensaje. Por favor, intenta de nuevo." },
      { status: 500 }
    );
  }
}

