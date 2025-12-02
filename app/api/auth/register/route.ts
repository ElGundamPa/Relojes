import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/lib/users";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validaciones
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Este email ya está registrado" },
        { status: 409 }
      );
    }

    // Crear nuevo usuario
    // En producción, aquí hashearías la contraseña con bcrypt
    // const hashedPassword = await hash(password, 10);
    const newUser = createUser({
      email,
      password, // En producción: hashedPassword
      name,
      image: null,
    });

    // En producción, guardarías en la base de datos aquí

    return NextResponse.json(
      {
        message: "Usuario creado exitosamente",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    logger.error("Error en registro:", error);
    return NextResponse.json(
      { error: "Error al crear la cuenta" },
      { status: 500 }
    );
  }
}

