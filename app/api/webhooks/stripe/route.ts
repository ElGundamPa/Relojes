import { NextRequest, NextResponse } from "next/server";
import { verifyStripeWebhook, retrieveStripeSession } from "@/lib/stripe";
import { ordersService } from "@/lib/services/ordersService";
import { sendOrderConfirmationEmail, sendNewOrderNotificationToAdmin } from "@/lib/email";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Falta la firma de Stripe" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      logger.warn("⚠️  STRIPE_WEBHOOK_SECRET no está configurado");
      // En desarrollo, procesar sin verificar
      const event = JSON.parse(body);
      await handleStripeEvent(event);
      return NextResponse.json({ received: true });
    }

    const event = verifyStripeWebhook(body, signature, webhookSecret);
    await handleStripeEvent(event);

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    logger.error("Error processing Stripe webhook:", error);
    const errorObj = error as { message?: string };
    return NextResponse.json(
      { error: errorObj.message || "Error al procesar webhook" },
      { status: 500 }
    );
  }
}

interface StripeEvent {
  type: string;
  data: {
    object: {
      id: string;
      metadata?: {
        orderId?: string;
      };
      amount_total?: number;
      currency?: string;
    };
  };
}

async function handleStripeEvent(event: StripeEvent) {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (!orderId || orderId === "pending") {
      logger.warn("⚠️  Orden sin ID en metadata de Stripe");
      return;
    }

    // Buscar la orden
    const order = ordersService.getById(orderId);
    if (!order) {
      logger.warn(`⚠️  Orden ${orderId} no encontrada`);
      return;
    }

    // Obtener detalles completos de la sesión
    const fullSession = await retrieveStripeSession(session.id);

    // Actualizar orden con información de pago
    ordersService.update(orderId, {
      status: "pagada",
      payment: {
        method: "stripe",
        id: session.id,
        amount: session.amount_total ? session.amount_total / 100 : order.total,
        currency: session.currency || "eur",
        status: "completed",
        createdAt: new Date().toISOString(),
      },
      statusHistory: [
        ...(order.statusHistory || []),
        {
          status: "pagada",
          changedAt: new Date().toISOString(),
          notes: `Pago confirmado vía Stripe (${session.id})`,
        },
      ],
    });

    // Enviar emails
    const updatedOrder = ordersService.getById(orderId);
    if (updatedOrder) {
      await sendOrderConfirmationEmail(
        updatedOrder.customer.email,
        updatedOrder.id,
        updatedOrder.total,
        updatedOrder.items.map((item) => ({
          name: item.name,
          quantity: item.qty,
          price: item.price,
        }))
      );

      await sendNewOrderNotificationToAdmin(
        updatedOrder.id,
        updatedOrder.customer.name,
        updatedOrder.total,
        updatedOrder.items.length
      );
    }
  }
}

