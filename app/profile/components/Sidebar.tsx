"use client";

import { motion } from "framer-motion";
import { User, Package, ShoppingCart, Shield, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { User as UserType } from "@/lib/user-store";
import Image from "next/image";

type ProfileSectionType = "profile" | "orders" | "cart" | "security" | "logout";

interface SidebarProps {
  user: UserType;
  activeSection: ProfileSectionType;
  onSectionChange: (section: ProfileSectionType) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: "profile" as const, label: "Mi Perfil", icon: User },
  { id: "orders" as const, label: "Mis Pedidos", icon: Package },
  { id: "cart" as const, label: "Mi Carrito", icon: ShoppingCart },
  { id: "security" as const, label: "Seguridad", icon: Shield },
];

export function Sidebar({
  user,
  activeSection,
  onSectionChange,
  onLogout,
}: SidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white"
      >
        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-auto
          w-80 lg:w-72
          bg-white/5 backdrop-blur-xl border-r border-white/10
          p-6 lg:p-6
          z-40
          transform transition-transform duration-300
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* User Info */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name || "Usuario"}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-white/60" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-semibold text-lg truncate">
                {user.name || "Usuario"}
              </h2>
              <p className="text-white/60 text-sm truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  setMobileMenuOpen(false);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-white/10 border border-white/20 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white/80"
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}

          {/* Logout Button */}
          <motion.button
            onClick={() => {
              onLogout();
              setMobileMenuOpen(false);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 mt-4"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </motion.button>
        </nav>
      </motion.aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

