// Sistema de autenticación simple (mock)
// En producción, usar JWT o sesiones seguras

import { User, UserRole, roleService } from "./roles";

const ADMIN_PASSWORD = "admin123"; // Cambiar en producción
const EDITOR_PASSWORD = "editor123";
const VIEWER_PASSWORD = "viewer123";

export interface AdminUser extends User {}

export const authService = {
  login: (
    email: string,
    password: string
  ): { success: boolean; token?: string; user?: AdminUser } => {
    // Mock login - en producción validar contra base de datos
    let role: UserRole = "viewer";
    let name = "Usuario";

    if (email === "admin@relojes.com" && password === ADMIN_PASSWORD) {
      role = "admin";
      name = "Administrador";
    } else if (email === "editor@relojes.com" && password === EDITOR_PASSWORD) {
      role = "editor";
      name = "Editor";
    } else if (email === "viewer@relojes.com" && password === VIEWER_PASSWORD) {
      role = "viewer";
      name = "Visualizador";
    } else {
      return { success: false };
    }

    const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");
    const user: AdminUser = {
      id: "1",
      email,
      name,
      role,
    };

    // Guardar usuario con rol
    roleService.setCurrentUser(user);

    return { success: true, token, user };
  },

  verifyToken: (token: string): AdminUser | null => {
    try {
      // Mock verification - en producción validar JWT
      const decoded = Buffer.from(token, "base64").toString("utf-8");
      if (decoded.includes("admin@relojes.com")) {
        return {
          id: "1",
          email: "admin@relojes.com",
          name: "Administrador",
        };
      }
      return null;
    } catch {
      return null;
    }
  },
};

