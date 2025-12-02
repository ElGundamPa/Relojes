import { NextRequest, NextResponse } from "next/server";
import { createStripeCheckoutSession } from "@/lib/stripe";
import { formatPrice } from "@/lib/utils";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerEmail, orderId } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 }
      );
    }

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Email del cliente es requerido" },
        { status: 400 }
      );
    }

    // Convertir items del carrito a formato Stripe
    const stripeItems = items.map((item: { name: string; price: number; quantity: number; image?: string }) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: item.image ? [new URL(item.image, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").href] : undefined,
        },
        unit_amount: Math.round(item.price * 100), // Convertir a centavos
      },
      quantity: item.quantity,
    }));

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success?order=${orderId || "pending"}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout?canceled=true`;

    const session = await createStripeCheckoutSession(
      stripeItems,
      customerEmail,
      successUrl,
      cancelUrl,
      {
        orderId: orderId || "pending",
      }
    );

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: unknown) {
    logger.error("Error creating Stripe session:", error);
    
    // Mensajes de error más específicos
    let errorMessage = "Error al crear sesión de pago";
    const errorObj = error as { message?: string };
    
    if (errorObj.message?.includes("Invalid API Key")) {
      errorMessage = "La clave API de Stripe no es válida. Por favor, verifica tu configuración en el archivo .env.local";
    } else if (errorObj.message?.includes("No such")) {
      errorMessage = "Error de configuración de Stripe. Verifica tus credenciales.";
    } else if (errorObj.message) {
      errorMessage = errorObj.message;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? errorObj.message : undefined
      },
      { status: 500 }
    );
  }
}

