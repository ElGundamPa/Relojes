"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Save, Loader2 } from "lucide-react";
import { User as UserType } from "@/lib/user-store";
import { useUserStore } from "@/lib/user-store";
import { useToastStore } from "@/lib/toast-store";

export function ProfileSection({ user: initialUser }: { user: UserType }) {
  const { user, updateProfile } = useUserStore();
  const { success, error: showError } = useToastStore();
  const currentUser = user || initialUser;
  
  const [formData, setFormData] = useState({
    name: currentUser.name || "",
    email: currentUser.email || "",
    phone: currentUser.phone || "",
  });
  const [loading, setLoading] = useState(false);
  const [successState, setSuccessState] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessState(false);

    try {
      updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });

      setSuccessState(true);
      success("Perfil actualizado exitosamente");
      setTimeout(() => setSuccessState(false), 3000);
    } catch (error) {
      showError("Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-[0_0_40px_rgba(255,255,255,0.05)]"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Mi Perfil</h1>
        <p className="text-white/60">Gestiona tu información personal</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-[0_0_40px_rgba(255,255,255,0.05)] space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 flex items-center gap-2">
              <User className="h-4 w-4" />
              Nombre
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-white/40 focus:bg-white/10 focus:ring-2 focus:ring-white/20"
              placeholder="Tu nombre"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-white/40 focus:bg-white/10 focus:ring-2 focus:ring-white/20"
              placeholder="tu@email.com"
              required
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-white/40 focus:bg-white/10 focus:ring-2 focus:ring-white/20"
              placeholder="+34 600 000 000"
            />
          </div>

        </div>

        {/* Success Message */}
        {successState && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
          >
            Perfil actualizado correctamente
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
          className="w-full md:w-auto px-8 py-3 rounded-xl bg-white text-black font-semibold hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Guardar Cambios
            </>
          )}
        </motion.button>
      </motion.form>
    </div>
  );
}

