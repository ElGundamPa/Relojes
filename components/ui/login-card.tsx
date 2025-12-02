"use client";

import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface LoginCardProps {
  email: string;
  password: string;
  rememberMe: boolean;
  error: string;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRememberMeChange: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginCard({
  email,
  password,
  rememberMe,
  error,
  loading,
  onEmailChange,
  onPasswordChange,
  onRememberMeChange,
  onSubmit,
}: LoginCardProps) {
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
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
          <LogIn className="h-8 w-8 text-white" />
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Login</h1>
        <p className="text-white/60 text-sm">Accede a tu cuenta</p>
      </motion.div>

      {/* Formulario */}
      <form onSubmit={onSubmit} className="space-y-6">
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
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
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
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-white/60 outline-none transition-all duration-300 focus:border-white/40 focus:bg-white/10 focus:ring-2 focus:ring-white/20"
            />
          </div>
        </motion.div>

        {/* Remember Me & Forgot Password */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between text-sm"
        >
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => onRememberMeChange(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-white focus:ring-2 focus:ring-white/20 focus:ring-offset-0 cursor-pointer accent-white"
            />
            <span className="text-white/60 group-hover:text-white/80 transition-colors">
              Recordarme
            </span>
          </label>
          {/* Enlace de recuperación de contraseña pendiente de implementar */}
          {/* <Link
            href="/forgot-password"
            className="text-white/60 hover:text-white/80 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link> */}
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
                Iniciando sesión...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Iniciar sesión
              </>
            )}
          </button>
        </motion.div>

        {/* Register Link */}
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-white/60 text-sm">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/register"
              className="text-white hover:text-white/80 font-medium transition-colors underline underline-offset-4"
            >
              Regístrate
            </Link>
          </p>
        </motion.div>
      </form>
    </motion.div>
  );
}

