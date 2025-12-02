"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/lib/user-store";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface RouteGuardProps {
  children: React.ReactNode;
  protectedRoutes?: string[];
}

export function RouteGuard({ children, protectedRoutes = [] }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useUserStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

    if (isProtected && !isAuthenticated) {
      setLoading(true);
      // Pequeño delay para mostrar el loader
      setTimeout(() => {
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      }, 500);
    } else {
      setLoading(false);
    }
  }, [mounted, isAuthenticated, pathname, router, protectedRoutes]);

  if (!mounted) {
    return null;
  }

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="h-8 w-8 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">Redirigiendo al login...</p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}



