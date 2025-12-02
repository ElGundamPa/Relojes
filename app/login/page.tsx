"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { LoginCard } from "@/components/ui/login-card";
import { useUserStore } from "@/lib/user-store";
import { useToastStore } from "@/lib/toast-store";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { login, isAuthenticated } = useUserStore();
  const { success, error: showError } = useToastStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Si ya está autenticado, redirigir
  useEffect(() => {
    if (isAuthenticated) {
      router.push(callbackUrl);
    }
  }, [isAuthenticated, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      success("¡Bienvenido de nuevo!");
      setTimeout(() => {
        router.push(callbackUrl);
        router.refresh();
      }, 300);
    } else {
      setError(result.error || "Error al iniciar sesión");
      showError(result.error || "Error al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      {/* Fondo con imagen difuminada en blanco y negro */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.02\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          }}
        />
        {/* Overlay negro con opacidad 60% */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Contenedor del formulario */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md px-4 sm:px-6"
      >
        <LoginCard
          email={email}
          password={password}
          rememberMe={rememberMe}
          error={error}
          loading={loading}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onRememberMeChange={setRememberMe}
          onSubmit={handleSubmit}
        />
      </motion.div>
    </div>
  );
}

