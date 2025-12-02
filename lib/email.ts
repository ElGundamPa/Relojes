// Sistema de emails usando Resend (o nodemailer como fallback)
// Para producción, configura RESEND_API_KEY en .env

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@relojesdelujo.com";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@relojesdelujo.com";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (RESEND_API_KEY) {
      // Usar Resend si está configurado
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text || options.html.replace(/<[^>]*>/g, ""),
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar email con Resend");
      }

      return true;
    } else {
      // Modo desarrollo: solo loguear
      console.log("📧 Email (modo desarrollo):", {
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      return true;
    }
  } catch (error) {
    console.error("Error enviando email:", error);
    return false;
  }
}

export async function sendOrderConfirmationEmail(
  customerEmail: string,
  orderId: string,
  total: number,
  items: Array<{ name: string; quantity: number; price: number }>
) {
  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>€${item.price.toFixed(2)}</td>
      <td>€${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #000; color: #fff; }
          .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Gracias por tu compra!</h1>
          </div>
          <div class="content">
            <p>Hola,</p>
            <p>Tu pedido <strong>#${orderId.slice(0, 12)}</strong> ha sido confirmado.</p>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <div class="total">Total: €${total.toFixed(2)}</div>
            <p>Te notificaremos cuando tu pedido sea enviado.</p>
            <p>Saludos,<br>Equipo de Relojes de Lujo</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `Confirmación de pedido #${orderId.slice(0, 12)}`,
    html,
  });
}

export async function sendOrderStatusUpdateEmail(
  customerEmail: string,
  orderId: string,
  status: string
) {
  const statusMessages: Record<string, string> = {
    pagada: "Tu pago ha sido confirmado y estamos preparando tu pedido.",
    enviada: "Tu pedido ha sido enviado. Pronto recibirás el número de seguimiento.",
    completada: "Tu pedido ha sido completado. ¡Esperamos que disfrutes tu compra!",
    cancelada: "Tu pedido ha sido cancelado. Si tienes preguntas, contáctanos.",
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Actualización de pedido</h1>
          </div>
          <div class="content">
            <p>Hola,</p>
            <p>El estado de tu pedido <strong>#${orderId.slice(0, 12)}</strong> ha cambiado.</p>
            <p><strong>Nuevo estado:</strong> ${status}</p>
            <p>${statusMessages[status] || "Tu pedido está siendo procesado."}</p>
            <p>Saludos,<br>Equipo de Relojes de Lujo</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `Actualización de pedido #${orderId.slice(0, 12)}`,
    html,
  });
}

export async function sendShippingNotificationEmail(
  customerEmail: string,
  orderId: string,
  trackingNumber?: string,
  carrier?: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .tracking { background: #fff; padding: 15px; border: 2px solid #000; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Tu pedido ha sido enviado!</h1>
          </div>
          <div class="content">
            <p>Hola,</p>
            <p>Tu pedido <strong>#${orderId.slice(0, 12)}</strong> ha sido enviado.</p>
            ${trackingNumber ? `
              <div class="tracking">
                <p><strong>Transportista:</strong> ${carrier || "No especificado"}</p>
                <p><strong>Número de seguimiento:</strong> ${trackingNumber}</p>
              </div>
            ` : ""}
            <p>Pronto recibirás tu pedido.</p>
            <p>Saludos,<br>Equipo de Relojes de Lujo</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `Tu pedido #${orderId.slice(0, 12)} ha sido enviado`,
    html,
  });
}

export async function sendNewOrderNotificationToAdmin(
  orderId: string,
  customerName: string,
  total: number,
  itemsCount: number
) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nueva orden recibida</h1>
          </div>
          <div class="content">
            <p>Se ha recibido una nueva orden:</p>
            <ul>
              <li><strong>ID:</strong> ${orderId}</li>
              <li><strong>Cliente:</strong> ${customerName}</li>
              <li><strong>Total:</strong> €${total.toFixed(2)}</li>
              <li><strong>Items:</strong> ${itemsCount}</li>
            </ul>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/ordenes/${orderId}" class="button">Ver orden</a>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `Nueva orden #${orderId.slice(0, 12)}`,
    html,
  });
}

