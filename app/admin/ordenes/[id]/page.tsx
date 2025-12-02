"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ordersServiceClient } from "@/lib/services/ordersService.client";
import { Order } from "@/data/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Package, User, MapPin, CreditCard, Download, Printer, Truck, Save, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { productsServiceClient } from "@/lib/services/productsService.client";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [productImages, setProductImages] = useState<Record<string, string>>({});
  const [shippingData, setShippingData] = useState({
    carrier: "",
    trackingNumber: "",
  });
  const [savingShipping, setSavingShipping] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [params.id]);

  useEffect(() => {
    if (order) {
      loadProductImages();
      setShippingData({
        carrier: order.shipping?.carrier || "",
        trackingNumber: order.shipping?.trackingNumber || "",
      });
    }
  }, [order]);

  const loadProductImages = async () => {
    if (!order) return;
    
    const images: Record<string, string> = {};
    
    for (const item of order.items) {
      try {
        const product = await productsServiceClient.getById(item.productId);
        if (product && product.image) {
          images[item.productId] = product.image;
        }
      } catch (error) {
        // Error silencioso - producto sin imagen
      }
    }

    setProductImages(images);
  };

  const loadOrder = async () => {
    if (!params.id || typeof params.id !== "string") return;
    
    const orderData = await ordersServiceClient.getById(params.id);
    setOrder(orderData || null);
    setLoading(false);
  };

  const handleStatusChange = async (newStatus: Order["status"]) => {
    if (!order) return;
    await ordersServiceClient.updateStatus(order.id, newStatus);
    loadOrder();
  };

  const handleSaveShipping = async () => {
    if (!order) return;
    setSavingShipping(true);

    try {
      await ordersServiceClient.update(order.id, {
        shipping: {
          carrier: shippingData.carrier,
          trackingNumber: shippingData.trackingNumber,
          sentAt: shippingData.trackingNumber ? new Date().toISOString() : order.shipping?.sentAt,
        },
        status: shippingData.trackingNumber ? "enviada" : order.status,
      });
      loadOrder();
      alert("Información de envío guardada");
    } catch (error) {
      alert("Error al guardar información de envío");
    } finally {
      setSavingShipping(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <Card className="border-0 shadow-premium">
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">Orden no encontrada</h3>
            <p className="text-muted-foreground">
              La orden que buscas no existe o ha sido eliminada.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">
              Orden #{order.id.slice(0, 12)}
            </h1>
            <p className="text-muted-foreground">
              Creada el {new Date(order.createdAt).toLocaleString("es-ES")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select
            value={order.status}
            onValueChange={(value) =>
              handleStatusChange(value as Order["status"])
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="pagada">Pagada</SelectItem>
            <SelectItem value="enviada">Enviada</SelectItem>
            <SelectItem value="completada">Completada</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => window.print()} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button
            onClick={() => {
              const csvContent = [
                ["ID", "Producto", "Cantidad", "Precio Unitario", "Subtotal"],
                ...order.items.map((item) => [
                  item.productId,
                  item.name,
                  item.qty.toString(),
                  formatPrice(item.price),
                  formatPrice(item.subtotal),
                ]),
                ["", "", "", "Total", formatPrice(order.total)],
              ]
                .map((row) => row.map((cell) => `"${cell}"`).join(","))
                .join("\n");

              const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
              const link = document.createElement("a");
              const url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", `orden-${order.id.slice(0, 12)}.csv`);
              link.style.visibility = "hidden";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información del Cliente */}
        <Card className="border-0 shadow-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Nombre</p>
              <p className="font-semibold">{order.customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-semibold">{order.customer.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Teléfono</p>
              <p className="font-semibold">{order.customer.phone}</p>
            </div>
          </CardContent>
        </Card>

        {/* Dirección de Envío */}
        <Card className="border-0 shadow-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Dirección de Envío
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Ciudad</p>
              <p className="font-semibold">{order.address.ciudad}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dirección</p>
              <p className="font-semibold">{order.address.direccion}</p>
            </div>
            {order.address.barrio && (
              <div>
                <p className="text-sm text-muted-foreground">Barrio</p>
                <p className="font-semibold">{order.address.barrio}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumen */}
        <Card className="border-0 shadow-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Resumen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{formatPrice(order.total)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Items</p>
              <p className="font-semibold">{order.items.length} productos</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <p className="font-semibold capitalize">{order.status}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información de Envío */}
      <Card className="border-0 shadow-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Información de Envío
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carrier">Transportista</Label>
              <Input
                id="carrier"
                value={shippingData.carrier}
                onChange={(e) =>
                  setShippingData({ ...shippingData, carrier: e.target.value })
                }
                placeholder="Ej: DHL, Correos, FedEx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trackingNumber">Número de seguimiento</Label>
              <Input
                id="trackingNumber"
                value={shippingData.trackingNumber}
                onChange={(e) =>
                  setShippingData({
                    ...shippingData,
                    trackingNumber: e.target.value,
                  })
                }
                placeholder="Ej: 1234567890"
              />
            </div>
          </div>
          {order.shipping?.sentAt && (
            <div>
              <p className="text-sm text-muted-foreground">Enviado el</p>
              <p className="font-semibold">
                {new Date(order.shipping.sentAt).toLocaleString("es-ES")}
              </p>
            </div>
          )}
          <Button
            onClick={handleSaveShipping}
            disabled={savingShipping}
            className="w-full"
          >
            {savingShipping ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar información de envío
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Historial de Estados */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <Card className="border-0 shadow-premium">
          <CardHeader>
            <CardTitle>Historial de Estados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.statusHistory
                .sort(
                  (a, b) =>
                    new Date(b.changedAt).getTime() -
                    new Date(a.changedAt).getTime()
                )
                .map((history, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-3 rounded-lg border border-border"
                  >
                    <div className="flex-1">
                      <p className="font-semibold capitalize">{history.status}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(history.changedAt).toLocaleString("es-ES")}
                      </p>
                      {history.notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {history.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Items de la Orden */}
      <Card className="border-0 shadow-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Productos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-lg border border-border"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {productImages[item.productId] ? (
                    <Image
                      src={productImages[item.productId]}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      <Package className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Cantidad: {item.qty} • Precio unitario: {formatPrice(item.price)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold">{formatPrice(item.subtotal)}</p>
                </div>
              </motion.div>
            ))}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <p className="text-xl font-bold">Total</p>
              <p className="text-2xl font-bold">{formatPrice(order.total)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


