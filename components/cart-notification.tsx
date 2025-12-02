"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

interface CartNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    image: string;
    price: number;
  } | null;
}

export function CartNotification({ isOpen, onClose, product }: CartNotificationProps) {
  const router = useRouter();

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          />

          {/* Notification */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-4 right-4 z-50 w-full max-w-md bg-background border border-border rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">¡Agregado al carrito!</h3>
                    <button
                      onClick={onClose}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {product.name}
                  </p>
                  <p className="text-lg font-bold">{formatPrice(product.price)}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Seguir navegando
                </Button>
                <Button
                  onClick={() => {
                    router.push("/checkout");
                    onClose();
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Ir al carrito
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

