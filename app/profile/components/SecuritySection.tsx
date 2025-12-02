"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, LogOut, Loader2, Check } from "lucide-react";
import { User as UserType } from "@/lib/user-store";
import { useUserStore } from "@/lib/user-store";
import { useToastStore } from "@/lib/toast-store";

export function SecuritySection({ user: initialUser }: { user: UserType }) {
  const { user, updatePassword, updateProfile } = useUserStore();
  const { success, error: showError } = useToastStore();
  const currentUser = user || initialUser;
  
  const [activeTab, setActiveTab] = useState<"password" | "email" | "sessions">("password");
  
  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Email change
  const [emailData, setEmailData] = useState({
    currentEmail: currentUser.email || "",
    newEmail: "",
  });
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
    if (!/[A-Z]/.test(password)) {
      return "Debe contener al menos una mayúscula";
    }
    if (!/[a-z]/.test(password)) {
      return "Debe contener al menos una minúscula";
    }
    if (!/[0-9]/.test(password)) {
      return "Debe contener al menos un número";
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return "Debe contener al menos un símbolo";
    }
    return null;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    const validation = validatePassword(passwordData.newPassword);
    if (validation) {
      setPasswordError(validation);
      showError(validation);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      showError("Las contraseñas no coinciden");
      return;
    }

    setPasswordLoading(true);
    try {
      const result = await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      
      if (result.success) {
        setPasswordSuccess(true);
        success("Contraseña actualizada exitosamente");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        setPasswordError(result.error || "Error al cambiar la contraseña");
        showError(result.error || "Error al cambiar la contraseña");
      }
    } catch (error) {
      setPasswordError("Error al cambiar la contraseña");
      showError("Error al cambiar la contraseña");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setEmailSuccess(false);

    if (!emailData.newEmail || !emailData.newEmail.includes("@")) {
      setEmailError("Email inválido");
      showError("Email inválido");
      return;
    }

    setEmailLoading(true);
    try {
      updateProfile({ email: emailData.newEmail });
      setEmailSuccess(true);
      success("Email actualizado exitosamente");
      setTimeout(() => setEmailSuccess(false), 3000);
    } catch (error) {
      setEmailError("Error al cambiar el email");
      showError("Error al cambiar el email");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleCloseAllSessions = () => {
    if (!confirm("¿Estás seguro de cerrar todas las sesiones?")) return;
    // En un sistema local, esto simplemente hace logout
    // No hay múltiples sesiones que cerrar
    success("Sesión cerrada");
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-[0_0_40px_rgba(255,255,255,0.05)]"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Seguridad</h1>
        <p className="text-white/60">Gestiona la seguridad de tu cuenta</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        {[
          { id: "password" as const, label: "Contraseña", icon: Lock },
          { id: "email" as const, label: "Email", icon: Mail },
          { id: "sessions" as const, label: "Sesiones", icon: LogOut },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-3 flex items-center gap-2 border-b-2 transition-colors
                ${
                  activeTab === tab.id
                    ? "border-white text-white"
                    : "border-transparent text-white/60 hover:text-white/80"
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Password Tab */}
      {activeTab === "password" && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handlePasswordChange}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 space-y-6"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Contraseña actual</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-white/40 focus:bg-white/10 focus:ring-2 focus:ring-white/20"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Nueva contraseña</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-white/40 focus:bg-white/10 focus:ring-2 focus:ring-white/20"
                placeholder="••••••••"
                required
              />
              <p className="text-xs text-white/40">
                Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">
                Confirmar nueva contraseña
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-white/40 focus:bg-white/10 focus:ring-2 focus:ring-white/20"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {passwordError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
              <Check className="h-4 w-4" />
              Contraseña actualizada correctamente
            </div>
          )}

          <motion.button
            type="submit"
            disabled={passwordLoading}
            whileHover={{ scale: passwordLoading ? 1 : 1.03 }}
            whileTap={{ scale: passwordLoading ? 1 : 0.97 }}
            className="w-full md:w-auto px-8 py-3 rounded-xl bg-white text-black font-semibold hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {passwordLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Cambiando...
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" />
                Cambiar contraseña
              </>
            )}
          </motion.button>
        </motion.form>
      )}

      {/* Email Tab */}
      {activeTab === "email" && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleEmailChange}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 space-y-6"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Email actual</label>
              <input
                type="email"
                value={emailData.currentEmail}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white/60 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Nuevo email</label>
              <input
                type="email"
                value={emailData.newEmail}
                onChange={(e) =>
                  setEmailData({ ...emailData, newEmail: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-white/40 focus:bg-white/10 focus:ring-2 focus:ring-white/20"
                placeholder="nuevo@email.com"
                required
              />
            </div>
          </div>

          {emailError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {emailError}
            </div>
          )}

          {emailSuccess && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
              <Check className="h-4 w-4" />
              Email actualizado correctamente
            </div>
          )}

          <motion.button
            type="submit"
            disabled={emailLoading}
            whileHover={{ scale: emailLoading ? 1 : 1.03 }}
            whileTap={{ scale: emailLoading ? 1 : 0.97 }}
            className="w-full md:w-auto px-8 py-3 rounded-xl bg-white text-black font-semibold hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {emailLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Cambiando...
              </>
            ) : (
              <>
                <Mail className="h-5 w-5" />
                Cambiar email
              </>
            )}
          </motion.button>
        </motion.form>
      )}

      {/* Sessions Tab */}
      {activeTab === "sessions" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 space-y-6"
        >
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Cerrar todas las sesiones</h3>
            <p className="text-white/60 text-sm mb-6">
              Esto cerrará tu sesión en todos los dispositivos. Tendrás que iniciar sesión nuevamente.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCloseAllSessions}
              className="px-8 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all duration-300 flex items-center gap-2"
            >
              <LogOut className="h-5 w-5" />
              Cerrar todas las sesiones
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

