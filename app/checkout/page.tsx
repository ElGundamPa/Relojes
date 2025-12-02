"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { CreditCard, Lock, Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserStore, UserOrder, Address } from "@/lib/user-store";
import { useToastStore } from "@/lib/toast-store";
import Image from "next/image";
import { cn } from "@/lib/utils";

type PaymentMethod = "stripe" | "paypal" | null;

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user, isAuthenticated, saveOrder, addAddress } = useUserStore();
  const { success, error: showError } = useToastStore();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "España",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showDemoDialog, setShowDemoDialog] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [demoPaymentMethod, setDemoPaymentMethod] = useState<"stripe" | "paypal" | null>(null);

  // Esperar a que el componente se monte en el cliente para evitar error de hidratación
  useEffect(() => {
    setMounted(true);
    
    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
      router.push("/login?callbackUrl=/checkout");
    }
    
    // Si hay usuario, prellenar formulario
    if (user) {
      setFormData({
        email: user.email || "",
        name: user.name || "",
        phone: user.phone || "",
        address: user.addresses.find(a => a.isDefault)?.street || "",
        city: user.addresses.find(a => a.isDefault)?.city || "",
        postalCode: user.addresses.find(a => a.isDefault)?.postalCode || "",
        country: user.addresses.find(a => a.isDefault)?.country || "España",
      });
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (searchParams.get("canceled") === "true") {
      alert("El pago fue cancelado. Puedes intentar de nuevo.");
    }
    if (searchParams.get("error")) {
      alert("Hubo un error con el pago. Por favor, intenta de nuevo.");
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Nombre requerido";
    }
    if (!formData.phone || formData.phone.length < 9) {
      newErrors.phone = "Teléfono requerido";
    }
    if (!formData.address || formData.address.length < 5) {
      newErrors.address = "Dirección requerida";
    }
    if (!formData.city || formData.city.length < 2) {
      newErrors.city = "Ciudad requerida";
    }
    if (!formData.postalCode || !/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = "Código postal inválido";
    }
    if (!formData.country || formData.country.length < 2) {
      newErrors.country = "País requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para crear orden en el user store
  const createOrder = async (paymentMethodType: "stripe" | "paypal" | "demo" = "stripe", paymentId?: string): Promise<string | null> => {
    if (!user || items.length === 0) {
      showError("No hay items en el carrito o no estás autenticado");
      return null;
    }

    try {
      // Crear dirección si no existe
      const addressData: Omit<Address, "id"> = {
        name: formData.name || "Casa",
        street: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: formData.phone,
        isDefault: user.addresses.length === 0, // Primera dirección es default
      };

      // Verificar si la dirección ya existe
      const existingAddress = user.addresses.find(
        (addr) =>
          addr.street === addressData.street &&
          addr.city === addressData.city &&
          addr.postalCode === addressData.postalCode
      );

      let address: Address;
      if (existingAddress) {
        address = existingAddress;
      } else {
        // Agregar nueva dirección
        addAddress(addressData);
        // Obtener la dirección recién agregada
        const updatedUser = useUserStore.getState().user;
        const newAddress = updatedUser?.addresses.find(
          (addr) =>
            addr.street === addressData.street &&
            addr.city === addressData.city &&
            addr.postalCode === addressData.postalCode
        );
        address = newAddress || {
          id: `temp_${Date.now()}`,
          ...addressData,
        };
      }

      // Crear items de la orden
      const orderItems = items.map((item) => ({
        productId: item.id,
        name: item.name,
        qty: item.quantity,
        price: item.price,
        image: item.image,
      }));

      // Crear orden completa
      const orderData: UserOrder = {
        id: `_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        items: orderItems,
        total: getTotalPrice(),
        status: paymentMethodType === "demo" ? "entregado" : "pendiente",
        createdAt: new Date().toISOString(),
        address: address,
        payment: {
          method: paymentMethodType === "demo" ? "stripe" : paymentMethodType,
          id: paymentId || `payment_${Date.now()}`,
          amount: getTotalPrice(),
        },
      };

      // Guardar orden
      saveOrder(orderData);

      if (orderData.id) {
        success("Orden creada exitosamente");
        return orderData.id;
      } else {
        showError("Error al crear la orden");
        return null;
      }
    } catch (error) {
      showError("Error al crear la orden");
      return null;
    }
  };

  const handleStripePayment = async () => {
    if (!validateForm()) return;
    if (!paymentMethod || paymentMethod !== "stripe") {
      setPaymentMethod("stripe");
      return;
    }

    setProcessing(true);

    try {
      // Crear orden primero (sin payment aún)
      const newOrderId = await createOrder("stripe");
      setOrderId(newOrderId);
      if (!newOrderId) {
        setProcessing(false);
        return;
      }

      // Crear sesión de Stripe
      const response = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          customerEmail: formData.email,
          orderId: newOrderId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear sesión de pago");
      }

      // Redirigir a Stripe
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: unknown) {
      const errorObj = error as { message?: string };
      const errorMessage = errorObj.message || "Error al procesar el pago";
      
      // Mostrar error más amigable
      if (errorMessage.includes("API Key") || errorMessage.includes("clave API") || errorMessage.includes("no está configurada")) {
        setPaymentError(errorMessage);
        setDemoPaymentMethod("stripe");
        setShowDemoDialog(true);
        setProcessing(false);
        return;
      }
      
      alert(errorMessage);
      setProcessing(false);
    }
  };

  const handlePayPalPayment = async () => {
    if (!validateForm()) return;
    if (!paymentMethod || paymentMethod !== "paypal") {
      setPaymentMethod("paypal");
      return;
    }

    setProcessing(true);

    try {
      // Crear orden primero (sin payment aún)
      const newOrderId = await createOrder("paypal");
      setOrderId(newOrderId);
      if (!newOrderId) {
        setProcessing(false);
        return;
      }

      // Crear orden PayPal
      const response = await fetch("/api/checkout/paypal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          customerEmail: formData.email,
          orderId: newOrderId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear orden PayPal");
      }

      // Redirigir a PayPal
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      }
    } catch (error: unknown) {
      const errorObj = error as { message?: string };
      const errorMessage = errorObj.message || "Error al procesar el pago";
      
      // Mostrar error más amigable para PayPal
      if (errorMessage.includes("token de acceso") || errorMessage.includes("credenciales") || errorMessage.includes("PayPal")) {
        setPaymentError(errorMessage);
        setDemoPaymentMethod("paypal");
        setShowDemoDialog(true);
        setProcessing(false);
        return;
      }
      
      alert(errorMessage);
      setProcessing(false);
    }
  };

  // Mostrar loading mientras se monta para evitar error de hidratación
  if (!mounted) {
    return (
      <div className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-2xl text-center">
          <AnimatedSection>
            <h1 className="text-4xl font-display font-bold mb-4">
              Carrito vacío
            </h1>
            <p className="text-muted-foreground mb-8">
              No hay productos en tu carrito.
            </p>
            <Button onClick={() => router.push("/relojes/todos")} size="lg">
              Explorar productos
            </Button>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = 15;
  const total = subtotal + shipping;

  return (
    <div className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection className="mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-3">
            Checkout
          </h1>
          <p className="text-muted-foreground text-lg">
            Completa tu información para finalizar la compra
          </p>
        </AnimatedSection>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Info */}
              <div className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-display font-bold mb-6">Información de envío</h2>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      className={cn(
                        "bg-white/5 border-white/10 px-4 py-3 rounded-xl transition-all duration-300",
                        "placeholder:text-muted-foreground/50",
                        "focus:border-blue-500 focus:shadow-[0_0_20px_rgba(0,122,255,0.4)] focus:outline-none",
                        errors.email && "border-destructive focus:border-destructive"
                      )}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                        Nombre completo
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Juan Pérez"
                        className={cn(
                          "bg-white/5 border-white/10 px-4 py-3 rounded-xl transition-all duration-300",
                          "placeholder:text-muted-foreground/50",
                          "focus:border-blue-500 focus:shadow-[0_0_20px_rgba(0,122,255,0.4)] focus:outline-none",
                          errors.name && "border-destructive focus:border-destructive"
                        )}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive mt-1">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-muted-foreground">
                        Teléfono
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+34 600 000 000"
                        className={cn(
                          "bg-white/5 border-white/10 px-4 py-3 rounded-xl transition-all duration-300",
                          "placeholder:text-muted-foreground/50",
                          "focus:border-blue-500 focus:shadow-[0_0_20px_rgba(0,122,255,0.4)] focus:outline-none",
                          errors.phone && "border-destructive focus:border-destructive"
                        )}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-muted-foreground">
                      Dirección
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Calle Principal 123"
                      className={cn(
                        "bg-white/5 border-white/10 px-4 py-3 rounded-xl transition-all duration-300",
                        "placeholder:text-muted-foreground/50",
                        "focus:border-blue-500 focus:shadow-[0_0_20px_rgba(0,122,255,0.4)] focus:outline-none",
                        errors.address && "border-destructive focus:border-destructive"
                      )}
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium text-muted-foreground">
                        Ciudad
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Madrid"
                        className={cn(
                          "bg-white/5 border-white/10 px-4 py-3 rounded-xl transition-all duration-300",
                          "placeholder:text-muted-foreground/50",
                          "focus:border-blue-500 focus:shadow-[0_0_20px_rgba(0,122,255,0.4)] focus:outline-none",
                          errors.city && "border-destructive focus:border-destructive"
                        )}
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode" className="text-sm font-medium text-muted-foreground">
                        Código postal
                      </Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="28001"
                        className={cn(
                          "bg-white/5 border-white/10 px-4 py-3 rounded-xl transition-all duration-300",
                          "placeholder:text-muted-foreground/50",
                          "focus:border-blue-500 focus:shadow-[0_0_20px_rgba(0,122,255,0.4)] focus:outline-none",
                          errors.postalCode && "border-destructive focus:border-destructive"
                        )}
                      />
                      {errors.postalCode && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.postalCode}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-sm font-medium text-muted-foreground">
                        País
                      </Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="España"
                        className={cn(
                          "bg-white/5 border-white/10 px-4 py-3 rounded-xl transition-all duration-300",
                          "placeholder:text-muted-foreground/50",
                          "focus:border-blue-500 focus:shadow-[0_0_20px_rgba(0,122,255,0.4)] focus:outline-none",
                          errors.country && "border-destructive focus:border-destructive"
                        )}
                      />
                      {errors.country && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.country}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods - Premium Design */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.42, 0, 0.58, 1] }}
                className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
              >
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                    <CreditCard className="h-[22px] w-[22px]" />
                    Método de pago
                  </h2>
                  <div className="h-[1px] bg-white/10 mt-2 mb-4 rounded-full" />
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Stripe Card - Premium Glassmorphism */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      onClick={() => !processing && setPaymentMethod("stripe")}
                      className={cn(
                        "cursor-pointer rounded-2xl px-8 py-6 border transition-all duration-300 flex flex-col items-center gap-3",
                        "bg-white/5 backdrop-blur-xl border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.25)]",
                        "hover:scale-[1.02] hover:shadow-[0_8px_35px_rgba(0,0,0,0.35)] hover:border-white/20",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent",
                        paymentMethod === "stripe"
                          ? "border-2 border-blue-500 bg-blue-500/10 shadow-[0_0_25px_rgba(0,122,255,0.5)]"
                          : ""
                      )}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="relative w-[60px] h-[30px]"
                      >
                        <Image
                          src="/logo/Stripe.webp"
                          alt="Stripe"
                          fill
                          className="object-contain"
                          sizes="60px"
                        />
                      </motion.div>
                      <p className={cn(
                        "text-lg font-semibold text-center transition-colors",
                        paymentMethod === "stripe" ? "text-blue-400" : "text-white"
                      )}>
                        Pagar con Tarjeta (Stripe)
                      </p>
                      <p className="text-sm text-white/50 text-center">
                        Visa, Mastercard, Amex
                      </p>
                    </motion.div>

                    {/* PayPal Card - Premium Glassmorphism */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                      onClick={() => !processing && setPaymentMethod("paypal")}
                      className={cn(
                        "cursor-pointer rounded-2xl px-8 py-6 border transition-all duration-300 flex flex-col items-center gap-3",
                        "bg-white/5 backdrop-blur-xl border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.25)]",
                        "hover:scale-[1.02] hover:shadow-[0_8px_35px_rgba(0,0,0,0.35)] hover:border-white/20",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent",
                        paymentMethod === "paypal"
                          ? "border-2 border-blue-500 bg-blue-500/10 shadow-[0_0_25px_rgba(0,122,255,0.5)]"
                          : ""
                      )}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.25 }}
                        className={cn(
                          "relative w-[60px] h-[30px] transition-opacity",
                          paymentMethod === "paypal" ? "opacity-100" : "opacity-70"
                        )}
                      >
                        <Image
                          src="/logo/Paypal.png"
                          alt="PayPal"
                          fill
                          className="object-contain"
                          sizes="60px"
                        />
                      </motion.div>
                      <p className={cn(
                        "text-lg font-semibold text-center transition-colors",
                        paymentMethod === "paypal" ? "text-blue-400" : "text-white"
                      )}>
                        PayPal
                      </p>
                      <p className="text-sm text-white/50 text-center">
                        Pago rápido y seguro
                      </p>
                    </motion.div>
                  </div>
                  
                  {/* Security Notice - Premium Design */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-start gap-3 pt-4 border-t border-white/10 bg-gradient-to-r from-green-600/20 to-green-400/10 border border-green-400/20 rounded-lg p-4"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.05, 1],
                        opacity: [1, 0.8, 1]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        repeatDelay: 3,
                        ease: "easeInOut"
                      }}
                    >
                      <Lock className="h-5 w-5 text-green-400" />
                    </motion.div>
                    <div>
                      <p className="text-green-400 font-medium text-sm mb-1">
                        Pago 100% seguro
                      </p>
                      <p className="text-white/60 text-xs leading-relaxed">
                        Tu información está protegida con encriptación SSL de nivel bancario. Stripe y PayPal garantizan la seguridad de tus datos.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg sticky top-24">
                <h2 className="text-2xl font-display font-bold mb-6">Resumen del pedido</h2>
                
                {/* Items */}
                <div className="space-y-4 max-h-80 overflow-y-auto mb-6">
                  {items.map((item) => {
                    // Extraer marca del nombre si es posible
                    const brandMatch = item.name.match(/^(Audemars Piguet|Rolex|Omega|Patek Philippe|Richard Mille|Bell & Ross|Montblanc|Tissot|Tudor|Vacheron)/);
                    const brand = brandMatch ? brandMatch[1] : "";
                    const productName = brand ? item.name.replace(brand, "").trim() : item.name;
                    
                    return (
                      <div key={item.id} className="flex gap-4 pb-4 border-b border-white/10 last:border-0">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-white/10">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          {brand && (
                            <p className="text-xs font-medium text-muted-foreground mb-1">
                              {brand}
                            </p>
                          )}
                          <p className="text-sm font-semibold truncate mb-1">
                            {productName}
                          </p>
                          <p className="text-xs text-muted-foreground mb-2">
                            Cantidad: {item.quantity}
                          </p>
                          <p className="text-sm font-bold">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="font-medium">{formatPrice(shipping)}</span>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-blue-400">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Payment Button */}
                <div className="mt-6">
                  {paymentMethod === "stripe" && (
                    <button
                      type="button"
                      onClick={handleStripePayment}
                      disabled={processing}
                      className={cn(
                        "w-full rounded-xl py-4 font-bold text-white",
                        "bg-gradient-to-r from-blue-600 to-blue-500",
                        "shadow-[0_8px_30px_rgba(0,122,255,0.4)]",
                        "transition-all duration-300",
                        "hover:scale-[1.01] hover:shadow-[0_8px_40px_rgba(0,122,255,0.6)]",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                        "flex items-center justify-center gap-2"
                      )}
                    >
                      {processing ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <div className="relative w-6 h-4">
                            <Image
                              src="/logo/Stripe.webp"
                              alt="Stripe"
                              fill
                              className="object-contain"
                              sizes="24px"
                            />
                          </div>
                          Pagar con Tarjeta
                        </>
                      )}
                    </button>
                  )}
                  {paymentMethod === "paypal" && (
                    <button
                      type="button"
                      onClick={handlePayPalPayment}
                      disabled={processing}
                      className={cn(
                        "w-full rounded-xl py-4 font-bold text-white",
                        "bg-gradient-to-r from-blue-600 to-blue-500",
                        "shadow-[0_8px_30px_rgba(0,122,255,0.4)]",
                        "transition-all duration-300",
                        "hover:scale-[1.01] hover:shadow-[0_8px_40px_rgba(0,122,255,0.6)]",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                        "flex items-center justify-center gap-2"
                      )}
                    >
                      {processing ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <div className="relative w-6 h-4">
                            <Image
                              src="/logo/Paypal.png"
                              alt="PayPal"
                              fill
                              className="object-contain"
                              sizes="24px"
                            />
                          </div>
                          Pagar con PayPal
                        </>
                      )}
                    </button>
                  )}
                  {!paymentMethod && (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">
                        Selecciona un método de pago arriba
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Dialog para modo DEMO */}
      <Dialog open={showDemoDialog} onOpenChange={setShowDemoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-full bg-yellow-500/10">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
              </div>
              <DialogTitle className="text-xl">Error de configuración</DialogTitle>
            </div>
            <DialogDescription className="text-base pt-2">
              {demoPaymentMethod === "stripe" 
                ? "La clave API de Stripe no es válida o no está configurada correctamente."
                : "Las credenciales de PayPal no son válidas o no están configuradas correctamente."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              ¿Deseas usar el <strong>modo DEMO</strong> para ver cómo se ve el checkout completo?
            </p>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-xs text-blue-400">
                Esto simulará un pago exitoso y te llevará a la página de confirmación para que puedas ver todo el flujo.
              </p>
            </div>
            {paymentError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-xs text-red-400">
                  <strong>Error:</strong> {paymentError}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowDemoDialog(false);
                setProcessing(false);
                setPaymentError(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                setShowDemoDialog(false);
                // Modo demo: simular pago exitoso
                try {
                  const newOrderId = orderId || await createOrder(demoPaymentMethod || "stripe", "demo_payment");
                  if (newOrderId) {
                    const paymentType = demoPaymentMethod || "stripe";
                    router.push(`/checkout/success?order=${newOrderId}&payment=${paymentType}&demo=true`);
                  }
                } catch (error) {
                  alert("Error al crear orden de demo");
                  setProcessing(false);
                }
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
            >
              Usar modo DEMO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
