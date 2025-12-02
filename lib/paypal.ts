const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "";
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || "";
const PAYPAL_BASE_URL =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export interface PayPalAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface PayPalOrder {
  id: string;
  status: string;
  purchase_units: Array<{
    amount: {
      currency_code: string;
      value: string;
    };
  }>;
  payer?: {
    email_address?: string;
    name?: {
      given_name?: string;
      surname?: string;
    };
  };
}

export async function getPayPalAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials no están configuradas");
  }

  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Error al obtener token de acceso de PayPal");
  }

  const data: PayPalAccessToken = await response.json();
  return data.access_token;
}

export async function createPayPalOrder(
  items: Array<{
    name: string;
    quantity: number;
    unit_amount: {
      currency_code: string;
      value: string;
    };
  }>,
  returnUrl: string,
  cancelUrl: string,
  customerEmail?: string
): Promise<PayPalOrder> {
  const accessToken = await getPayPalAccessToken();

  const orderData = {
    intent: "CAPTURE",
    purchase_units: [
      {
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity.toString(),
          unit_amount: item.unit_amount,
        })),
        amount: {
          currency_code: items[0]?.unit_amount.currency_code || "EUR",
          value: items
            .reduce(
              (sum, item) =>
                sum + parseFloat(item.unit_amount.value) * item.quantity,
              0
            )
            .toFixed(2),
          breakdown: {
            item_total: {
              currency_code: items[0]?.unit_amount.currency_code || "EUR",
              value: items
                .reduce(
                  (sum, item) =>
                    sum + parseFloat(item.unit_amount.value) * item.quantity,
                  0
                )
                .toFixed(2),
            },
          },
        },
      },
    ],
    application_context: {
      brand_name: "Relojes de Lujo",
      landing_page: "BILLING",
      user_action: "PAY_NOW",
      return_url: returnUrl,
      cancel_url: cancelUrl,
      ...(customerEmail && { shipping_preference: "NO_SHIPPING" }),
    },
    ...(customerEmail && {
      payer: {
        email_address: customerEmail,
      },
    }),
  };

  const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error al crear orden PayPal: ${error}`);
  }

  return await response.json();
}

export async function capturePayPalOrder(
  orderId: string
): Promise<PayPalOrder> {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error al capturar orden PayPal: ${error}`);
  }

  return await response.json();
}

export async function getPayPalOrder(orderId: string): Promise<PayPalOrder> {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener orden PayPal");
  }

  return await response.json();
}

