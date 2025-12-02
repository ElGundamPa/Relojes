import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder, getPayPalOrder } from "@/lib/paypal";
import { ordersService } from "@/lib/services/ordersService";
import { sendOrderConfirmationEmail, sendNewOrderNotificationToAdmin } from "@/lib/email";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const paypalOrderId = searchParams.get("token");
    const orderId = searchParams.get("orderId");

    if (!paypalOrderId) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout?error=missing_token`
      );
    }

    // Capturar el pago
    const capture = await capturePayPalOrder(paypalOrderId);

    if (capture.status !== "COMPLETED") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout?error=payment_failed`
      );
    }

    // Si tenemos orderId, actualizar la orden
    if (orderId && orderId !== "pending") {
      const order = ordersService.getById(orderId);
      if (order) {
        const amount = parseFloat(
          capture.purchase_units[0]?.amount?.value || order.total.toString()
        );

        ordersService.update(orderId, {
          status: "pagada",
          payment: {
            method: "paypal",
            id: capture.id || paypalOrderId,
            amount: amount,
            currency: capture.purchase_units[0]?.amount?.currency_code || "EUR",
            status: "completed",
            createdAt: new Date().toISOString(),
          },
          statusHistory: [
            ...(order.statusHistory || []),
            {
              status: "pagada",
              changedAt: new Date().toISOString(),
              notes: `Pago confirmado vía PayPal (${paypalOrderId})`,
            },
          ],
        });

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

    // Redirigir a página de éxito
    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success?order=${orderId || "pending"}&payment=paypal`;
    return NextResponse.redirect(successUrl);
  } catch (error: unknown) {
    logger.error("Error capturing PayPal payment:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout?error=capture_failed`
    );
  }
}

