"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Package, MapPin, CreditCard, Calendar, Truck } from "lucide-react";
import { UserOrder } from "@/lib/user-store";
import { formatPrice } from "@/lib/utils";
import { TrackingProgressBar } from "./TrackingProgressBar";
import { productsServiceClient } from "@/lib/services/productsService.client";
import Image from "next/image";

interface OrderDetailModalProps {
  order: UserOrder;
  onClose: () => void;
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const [productImages, setProductImages] = useState<Record<string, string>>({});

  useEffect(() => {
    loadProductImages();
  }, [order]);

  const loadProductImages = async () => {
    const images: Record<string, string> = {};
    
    for (const item of order.items) {
      if (!images[item.productId]) {
        try {
          const product = await productsServiceClient.getById(item.productId);
          if (product && product.image) {
            images[item.productId] = product.image;
          }
        } catch (error) {
          // Error silencioso - producto sin imagen
        }
      }
    }
    
    setProductImages(images);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0b0b0b] rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      >
          {/* Header */}
          <div className="sticky top-0 bg-white/5 backdrop-blur-xl border-b border-white/10 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Detalles del Pedido</h2>
              <p className="text-white/60 text-sm">#{order.id.slice(0, 12)}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6 space-y-6">
            {/* Tracking */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Estado del Envío
              </h3>
              <TrackingProgressBar order={order} />
            </div>

            {/* Products */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Productos
              </h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="relative w-20 h-20 rounded-xl bg-white/5 overflow-hidden flex-shrink-0">
                      {productImages[item.productId] ? (
                        <Image
                          src={productImages[item.productId]}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Package className="h-10 w-10 text-white/20" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{item.name}</h4>
                      <p className="text-sm text-white/60">
                        Cantidad: {item.qty} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{formatPrice(item.price * item.qty)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Dirección de Envío
              </h3>
              <div className="text-white/80 space-y-1">
                <p>{order.address.street}</p>
                <p>{order.address.city}, {order.address.postalCode}</p>
                <p>{order.address.country}</p>
                {order.address.phone && <p>Tel: {order.address.phone}</p>}
              </div>
            </div>

            {/* Payment */}
            {order.payment && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Método de Pago
                </h3>
                <div className="text-white/80 space-y-1">
                  <p className="capitalize">{order.payment.method}</p>
                  {order.payment.amount && (
                    <p>{formatPrice(order.payment.amount)}</p>
                  )}
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Resumen</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-white/80">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.total - 15)}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Envío</span>
                  <span>{formatPrice(15)}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between">
                  <span className="text-lg font-semibold text-white">Total</span>
                  <span className="text-2xl font-bold text-white">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
  );
}

