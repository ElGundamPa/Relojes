// Stripe se importa dinámicamente para evitar errores si no está instalado
let Stripe: any = null;
try {
  Stripe = require("stripe").default;
} catch (e) {
  console.warn("⚠️  Stripe no está instalado. Ejecuta: npm install stripe");
}

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("⚠️  STRIPE_SECRET_KEY no está configurada. Usando modo de prueba.");
}

export const stripe = process.env.STRIPE_SECRET_KEY && Stripe
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20.acacia",
    })
  : null;

export interface StripeCheckoutItem {
  price_data: {
    currency: string;
    product_data: {
      name: string;
      images?: string[];
    };
    unit_amount: number;
  };
  quantity: number;
}

export async function createStripeCheckoutSession(
  items: StripeCheckoutItem[],
  customerEmail: string,
  successUrl: string,
  cancelUrl: string,
  metadata?: Record<string, string>
) {
  if (!stripe) {
    throw new Error("Stripe no está configurado. Configura STRIPE_SECRET_KEY en .env");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items,
    mode: "payment",
    customer_email: customerEmail,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: metadata || {},
  });

  return session;
}

export async function retrieveStripeSession(sessionId: string) {
  if (!stripe) {
    throw new Error("Stripe no está configurado");
  }

  return await stripe.checkout.sessions.retrieve(sessionId);
}

export function verifyStripeWebhook(
  payload: string | Buffer,
  signature: string,
  secret: string
) {
  if (!stripe) {
    throw new Error("Stripe no está configurado");
  }

  return stripe.webhooks.constructEvent(payload, signature, secret);
}

