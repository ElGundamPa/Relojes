import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal";
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

    // Convertir items a formato PayPal
    const paypalItems = items.map((item: { name: string; price: number; quantity: number }) => ({
      name: item.name,
      quantity: item.quantity,
      unit_amount: {
        currency_code: "EUR",
        value: item.price.toFixed(2),
      },
    }));

    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/paypal/capture?orderId=${orderId || "pending"}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout?canceled=true`;

    const paypalOrder = await createPayPalOrder(
      paypalItems,
      returnUrl,
      cancelUrl,
      customerEmail
    );

    // Buscar link de aprobación
    const approvalLink = paypalOrder.links?.find(
      (link: { rel: string; href: string }) => link.rel === "approve"
    );

    return NextResponse.json({
      orderId: paypalOrder.id,
      approvalUrl: approvalLink?.href,
    });
  } catch (error: unknown) {
    logger.error("Error creating PayPal order:", error);
    
    // Mensajes de error más específicos
    let errorMessage = "Error al crear orden PayPal";
    const errorObj = error as { message?: string };
    
    if (errorObj.message?.includes("token de acceso") || errorObj.message?.includes("access token")) {
      errorMessage = "Las credenciales de PayPal no son válidas. Por favor, verifica tu configuración en el archivo .env.local";
    } else if (errorObj.message?.includes("credentials") || errorObj.message?.includes("credenciales")) {
      errorMessage = "Las credenciales de PayPal no están configuradas. Verifica PAYPAL_CLIENT_ID y PAYPAL_CLIENT_SECRET en .env.local";
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

