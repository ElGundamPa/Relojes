"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/data/products";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Truck, CreditCard, Check } from "lucide-react";

interface StickyBuyBoxProps {
  product: Product;
}

export function StickyBuyBox({ product }: StickyBuyBoxProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const benefits = [
    { icon: Shield, text: "Garantía 2 años" },
    { icon: Truck, text: "Envío gratis" },
    { icon: CreditCard, text: "Pago seguro" },
  ];

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isSticky && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed right-8 top-24 z-40 w-80 hidden lg:block"
        >
          <Card className="border-0 shadow-premium-hover backdrop-blur-xl bg-background/95">
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-2xl font-display font-bold mb-2">
                  {product.name}
                </h3>
                <p className="text-3xl font-bold mb-4">
                  {formatPrice(product.price)}
                </p>
              </div>

              <Separator />

              <div>
                <AddToCartButton product={product} />
              </div>

              <div className="space-y-3">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div
                      key={benefit.text}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-muted-foreground">{benefit.text}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


