"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function CartSection() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-[0_0_40px_rgba(255,255,255,0.05)]"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Mi Carrito</h1>
          <p className="text-white/60">Gestiona tus productos</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center"
        >
          <ShoppingCart className="h-16 w-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Tu carrito está vacío</h3>
          <p className="text-white/60 mb-6">Agrega productos para continuar</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/relojes/todos")}
            className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:shadow-2xl transition-all duration-300"
          >
            Explorar productos
          </motion.button>
        </motion.div>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Mi Carrito</h1>
            <p className="text-white/60">{items.length} producto(s)</p>
          </div>
          {items.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={clearCart}
              className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all duration-200 text-sm"
            >
              Vaciar carrito
            </motion.button>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            >
              <div className="flex gap-4">
                {/* Image */}
                <div className="relative w-24 h-24 rounded-xl bg-white/5 overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShoppingCart className="h-8 w-8 text-white/20" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white mb-1 truncate">{item.name}</h3>
                  <p className="text-2xl font-bold text-white mb-4">
                    {formatPrice(item.price)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </motion.button>
                    <span className="text-white font-semibold min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeItem(item.id)}
                      className="ml-auto p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sticky top-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Resumen</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-white/80">
                <span>Subtotal</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Envío</span>
                <span>{formatPrice(15)}</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between">
                <span className="text-lg font-semibold text-white">Total</span>
                <span className="text-2xl font-bold text-white">
                  {formatPrice(getTotalPrice() + 15)}
                </span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCheckout}
              className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              Finalizar Compra
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


