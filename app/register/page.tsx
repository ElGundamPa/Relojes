"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/lib/user-store";
import { useToastStore } from "@/lib/toast-store";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useUserStore();
  const { success, error: showError } = useToastStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Si ya está autenticado, redirigir
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      showError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      showError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    const result = await register(formData.name, formData.email, formData.password);

    if (result.success) {
      success("¡Cuenta creada exitosamente!");
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 500);
    } else {
      setError(result.error || "Error al crear la cuenta");
      showError(result.error || "Error al crear la cuenta");
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.42, 0, 0.58, 1],
      },
    },
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
        {/* Animación fade-in */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        />
      </div>

      {/* Contenedor del formulario */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md px-4 sm:px-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.05)] p-8 sm:p-10"
        >
          {/* Título */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-white/20 mb-4"
            >
              <UserPlus className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Registro
            </h1>
            <p className="text-white/60 text-sm">Crea tu cuenta</p>
          </motion.div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
              >
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}

            {/* Name Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-white/80 block"
              >
                Nombre completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Tu nombre"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-white/60 outline-none transition-all duration-300 focus:border-white/40 focus:bg-white/10 focus:ring-2 focus:ring-white/20"
                />
              </div>
            </motion.div>

            {/* Email Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-white/80 block"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="tu@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-white/60 outline-none transition-all duration-300 focus:border-white/40 focus:bg-white/10 focus:ring-2 focus:ring-white/20"
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-white/80 block"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-white/60 outline-none transition-all duration-300 focus:border-white/40 focus:bg-white/10 focus:ring-2 focus:ring-white/20"
                />
              </div>
            </motion.div>

            {/* Confirm Password Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-white/80 block"
              >
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-white/60 outline-none transition-all duration-300 focus:border-white/40 focus:bg-white/10 focus:ring-2 focus:ring-white/20"
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:scale-[1.02] active:scale-95 shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Crear cuenta
                  </>
                )}
              </button>
            </motion.div>

            {/* Login Link */}
            <motion.div variants={itemVariants} className="text-center">
              <p className="text-white/60 text-sm">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  href="/login"
                  className="text-white hover:text-white/80 font-medium transition-colors underline underline-offset-4"
                >
                  Inicia sesión
                </Link>
              </p>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}

