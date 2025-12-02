"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { AnimatedSection } from "@/components/animated-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Package, MessageCircle, ExternalLink, Heart, Truck, Shield, CreditCard } from "lucide-react";
import { useUserStore, UserOrder } from "@/lib/user-store";
import { Order } from "@/data/orders";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";

// Code splitting: ProductCard solo se carga cuando se necesita
const ProductCard = dynamic(() => import("@/components/product-card").then(mod => ({ default: mod.ProductCard })), {
  ssr: true,
  loading: () => <div className="aspect-square bg-muted rounded-2xl animate-pulse" />
});

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order");
  const paymentMethod = searchParams.get("payment") || "stripe";
  const { user } = useUserStore();
  const [order, setOrder] = useState<UserOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const demo = searchParams.get("demo") === "true";
    setIsDemo(demo);
    
    if (orderId && orderId !== "pending") {
      loadOrder();
    } else {
      setLoading(false);
    }
  }, [orderId, searchParams]);

  const loadOrder = async () => {
    if (!orderId || orderId === "pending") {
      setLoading(false);
      return;
    }

    try {
      // Buscar orden en el user store
      if (user) {
        const foundOrder = user.orders.find((o) => o.id === orderId);
        setOrder(foundOrder || null);
      } else if (isDemo) {
        // Crear orden demo si no hay usuario
        setOrder({
          id: orderId,
          items: [],
          total: 0,
          status: "pendiente",
          createdAt: new Date().toISOString(),
          address: {
            id: "demo_addr",
            name: "Demo",
            street: "Calle Demo",
            city: "Madrid",
            postalCode: "28001",
            country: "España",
            isDefault: true,
          },
        });
      }
    } catch (error) {
      // Error loading order - se maneja silenciosamente
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = order
    ? `Hola, acabo de hacer una compra. Mi número de orden es #${order.id.slice(0, 12)}`
    : `Hola, acabo de hacer una compra.`;
  const whatsappUrl = `https://wa.me/34600000000?text=${encodeURIComponent(whatsappMessage)}`;

  if (loading) {
    return (
      <div className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Cargando tu pedido...</p>
        </div>
      </div>
    );
  }

  const firstItem = order?.items[0];

  return (
    <div className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950 min-h-screen">
      <div className="container mx-auto max-w-4xl">
        {/* Hero Section Emocional */}
        <AnimatedSection className="text-center mb-12">
          {isDemo && (
            <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-500 text-sm font-medium">
              <span>🔍</span>
              Modo DEMO - Vista previa del checkout
            </div>
          )}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white mb-8 shadow-[0_8px_32px_rgba(34,197,94,0.3)]"
          >
            <Check className="h-12 w-12" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            ¡Gracias por confiar en nosotros!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tu pedido ha sido procesado correctamente. Estamos emocionados de que formes parte de nuestra familia.
          </p>
        </AnimatedSection>

        {/* Imagen del producto comprado */}
        {firstItem ? (
          <AnimatedSection delay={0.2} className="mb-12">
            <Card className="border-0 shadow-premium overflow-hidden">
              <div className="relative h-64 sm:h-96 bg-gradient-to-br from-muted to-muted/50">
                {firstItem.image && (
                  <Image
                    src={firstItem.image}
                    alt={firstItem.name}
                    fill
                    className="object-contain p-8"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                )}
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-semibold mb-2">{firstItem.name}</h3>
                <p className="text-muted-foreground">Cantidad: {firstItem.qty}</p>
              </CardContent>
            </Card>
          </AnimatedSection>
        ) : isDemo ? (
          <AnimatedSection delay={0.2} className="mb-12">
            <Card className="border-0 shadow-premium overflow-hidden">
              <div className="relative h-64 sm:h-96 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <div className="text-center">
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">Vista previa del checkout</p>
                </div>
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-semibold mb-2">Producto de ejemplo</h3>
                <p className="text-muted-foreground">Cantidad: 1</p>
              </CardContent>
            </Card>
          </AnimatedSection>
        ) : null}

        {/* Detalles del pedido */}
        {(order || isDemo) && (
          <AnimatedSection delay={0.3} className="mb-8">
            <Card className="border-0 shadow-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Detalles del pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Número de orden</p>
                    <p className="text-2xl font-bold font-mono bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {order ? `#${order.id.slice(0, 12)}` : "#DEMO-123456"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total pagado</p>
                    <p className="text-3xl font-bold">
                      {order ? formatPrice(order.total) : formatPrice(0)}
                    </p>
                  </div>
                  {(order?.payment || isDemo) && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Método de pago</p>
                      <p className="font-semibold capitalize flex items-center gap-2">
                        {(order?.payment?.method || paymentMethod) === "stripe" ? (
                          <>
                            <div className="relative w-16 h-8">
                              <Image
                                src="/logo/Stripe.webp"
                                alt="Stripe"
                                fill
                                className="object-contain"
                                sizes="64px"
                              />
                            </div>
                            Tarjeta (Stripe)
                          </>
                        ) : (
                          <>
                            <div className="relative w-16 h-8">
                              <Image
                                src="/logo/Paypal.png"
                                alt="PayPal"
                                fill
                                className="object-contain"
                                sizes="64px"
                              />
                            </div>
                            PayPal
                          </>
                        )}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Estado</p>
                    <p className="font-semibold capitalize flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      {order?.status || "pagada"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        )}

        {/* Barra de progreso de envío */}
        <AnimatedSection delay={0.4} className="mb-8">
          <Card className="border-0 shadow-premium bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white">
                    <Check className="h-6 w-6" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Pedido confirmado</h3>
                  <p className="text-sm text-muted-foreground">Tu pedido está siendo preparado</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Pago confirmado</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
                  <span>Preparando envío</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
                  <span>En tránsito</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
                  <span>Entregado</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Botones de acción */}
        <AnimatedSection delay={0.5} className="mb-12">
          <div className="flex flex-col sm:flex-row gap-4">
            {order && !isDemo && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push(`/profile`)}
              >
                Ver mis pedidos
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            )}
            <Button
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              onClick={() => router.push("/relojes/todos")}
            >
              Seguir comprando
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
              onClick={() => window.open(whatsappUrl, "_blank")}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contactar soporte
            </Button>
          </div>
        </AnimatedSection>

        {/* Mensaje de confirmación */}
        <AnimatedSection delay={0.6} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
            <Heart className="h-4 w-4 text-red-500" />
            <p>
              {isDemo ? (
                "En un pago real, recibirías un email de confirmación"
              ) : (
                <>
                  Te hemos enviado un email de confirmación a{" "}
                  <span className="font-semibold text-foreground">
                    {user?.email || "tu dirección de correo"}
                  </span>
                </>
              )}
            </p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Te notificaremos cuando tu pedido sea enviado.
          </p>
        </AnimatedSection>

        {/* Recomendaciones post-compra */}
        {order && order.items.length > 0 && (
          <AnimatedSection delay={0.7}>
            <h2 className="text-2xl font-display font-bold mb-6 text-center">
              También te puede gustar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder para productos recomendados - se puede conectar con getRelatedProducts */}
              <div className="text-center py-12 text-muted-foreground">
                <p>Próximamente: Recomendaciones personalizadas</p>
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}

