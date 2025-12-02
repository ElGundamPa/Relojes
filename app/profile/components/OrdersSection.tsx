"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Eye, Calendar } from "lucide-react";
import { UserOrder } from "@/lib/user-store";
import { useUserStore } from "@/lib/user-store";
import { productsServiceClient } from "@/lib/services/productsService.client";
import { formatPrice } from "@/lib/utils";
import { TrackingProgressBar } from "./TrackingProgressBar";
import { OrderDetailModal } from "./OrderDetailModal";
import Image from "next/image";

export function OrdersSection() {
  const { user } = useUserStore();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null);
  const [productImages, setProductImages] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setOrders(user.orders.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (orders.length > 0) {
      loadProductImages();
    }
  }, [orders]);

  const loadProductImages = async () => {
    const images: Record<string, string> = {};
    
    for (const order of orders) {
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
    }
    
    setProductImages(images);
  };

  const getStatusColor = (status: UserOrder["status"]) => {
    const colors = {
      pendiente: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      procesando: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      enviado: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      entregado: "bg-green-500/10 text-green-400 border-green-500/20",
      cancelado: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return colors[status] || colors.pendiente;
  };

  const getStatusLabel = (status: UserOrder["status"]) => {
    const labels = {
      pendiente: "Pendiente",
      procesando: "Procesando",
      enviado: "En camino",
      entregado: "Entregado",
      cancelado: "Cancelado",
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-[0_0_40px_rgba(255,255,255,0.05)]"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Mis Pedidos</h1>
        <p className="text-white/60">Gestiona y rastrea tus compras</p>
      </motion.div>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center"
        >
          <Package className="h-16 w-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No tienes pedidos</h3>
          <p className="text-white/60">Tus pedidos aparecerán aquí</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-[0_0_40px_rgba(255,255,255,0.05)]"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Product Image */}
                {order.items[0] && (
                  <div className="relative w-full lg:w-32 h-32 rounded-xl bg-white/5 overflow-hidden flex-shrink-0">
                    {productImages[order.items[0].productId] ? (
                      <Image
                        src={productImages[order.items[0].productId]}
                        alt={order.items[0].name}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="h-12 w-12 text-white/20" />
                      </div>
                    )}
                  </div>
                )}

                {/* Order Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {order.items[0]?.name || "Pedido"}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.createdAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <span>#{order.id.slice(0, 12)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                      <span className="text-2xl font-bold text-white">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Tracking Progress */}
                  <TrackingProgressBar order={order} />

                  {/* Actions */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
                    >
                      <Eye className="h-4 w-4" />
                      Ver detalles
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <AnimatePresence>
          <OrderDetailModal
            key={selectedOrder.id}
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        </AnimatePresence>
      )}
    </div>
  );
}

