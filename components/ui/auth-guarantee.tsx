"use client";

import { motion } from "framer-motion";
import { Shield, CheckCircle2, Lock, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function AuthGuarantee() {
  const guarantees = [
    {
      icon: Shield,
      title: "Autenticidad Garantizada",
      description: "Todos nuestros relojes son 100% auténticos y verificados",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Lock,
      title: "Pago Seguro",
      description: "Protegido por Stripe y PayPal. Tus datos están seguros",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Award,
      title: "Garantía 2 Años",
      description: "Cobertura completa en todos nuestros productos",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: CheckCircle2,
      title: "Envío Gratis",
      description: "Envío gratuito en compras superiores a €500",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Confianza y Garantía
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tu tranquilidad es nuestra prioridad. Cada compra está respaldada por nuestras garantías.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((guarantee, index) => {
            const Icon = guarantee.icon;
            return (
              <motion.div
                key={guarantee.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Card className="border-0 shadow-premium hover:shadow-premium-hover transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${guarantee.bgColor} ${guarantee.color} mb-4`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{guarantee.title}</h3>
                    <p className="text-sm text-muted-foreground">{guarantee.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Sellos de confianza */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-60"
        >
          <div className="text-sm font-medium">Protegido por:</div>
          <div className="flex items-center gap-2">
            <div className="relative w-20 h-8">
              <Image
                src="/logo/Stripe.webp"
                alt="Stripe"
                fill
                className="object-contain"
                sizes="80px"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-20 h-8">
              <Image
                src="/logo/Paypal.png"
                alt="PayPal"
                fill
                className="object-contain"
                sizes="80px"
              />
            </div>
          </div>
          <div className="text-sm font-medium">✓ SSL Encriptado</div>
        </motion.div>
      </div>
    </section>
  );
}

