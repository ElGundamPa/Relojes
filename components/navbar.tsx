"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Moon, Sun, Menu, X, LogIn, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/lib/user-store";
import Image from "next/image";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalItems, openCart } = useCartStore();
  const { user, isAuthenticated, logout } = useUserStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/marcas", label: "Marcas" },
    { href: "/relojes/todos", label: "Todos los Relojes" },
    { href: "/sobre-nosotros", label: "Nosotros" },
    { href: "/faq", label: "FAQ" },
    { href: "/favoritos", label: "Favoritos" },
    { href: "/contact", label: "Contacto" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" prefetch className="flex items-center space-x-2">
            <span className="text-xl font-display font-bold tracking-tight">
              Relojes
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground/80",
                  pathname === link.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden sm:flex"
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )
              ) : (
                <div className="h-5 w-5" />
              )}
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={openCart}
              >
                <ShoppingBag className="h-5 w-5" />
              </Button>
              {mounted && getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background text-xs font-medium animate-in zoom-in duration-300">
                  {getTotalItems()}
                </span>
              )}
            </div>

            {/* Login/Avatar Icon */}
            {mounted && (
              <Link href={isAuthenticated ? "/profile" : "/login"} prefetch>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                >
                  {isAuthenticated && user ? (
                    <div className="h-8 w-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.name || "Usuario"}
                          width={32}
                          height={32}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-white" />
                      )}
                    </div>
                  ) : (
                    <LogIn className="h-5 w-5 text-white" />
                  )}
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border/40"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {/* Mobile Login/Avatar */}
              {mounted && (
                <Link
                  href={isAuthenticated ? "/profile" : "/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block text-sm font-medium transition-colors",
                    pathname === (isAuthenticated ? "/profile" : "/login")
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                >
                  {isAuthenticated && user ? (
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-foreground/10 border border-foreground/20 flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name || "Usuario"}
                            width={24}
                            height={24}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-3 w-3" />
                        )}
                      </div>
                      {user.name || "Mi perfil"}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      Iniciar sesión
                    </div>
                  )}
                </Link>
              )}
              <Button
                variant="ghost"
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start"
              >
                {mounted && theme === "dark" ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    Modo claro
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    Modo oscuro
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

