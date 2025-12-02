// Sistema de roles simple (mock)
export type UserRole = "admin" | "editor" | "viewer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export const rolePermissions = {
  admin: {
    canView: true,
    canEdit: true,
    canCreate: true,
    canDelete: true,
    canManageOrders: true,
    canManageUsers: true,
  },
  editor: {
    canView: true,
    canEdit: true,
    canCreate: true,
    canDelete: false,
    canManageOrders: false,
    canManageUsers: false,
  },
  viewer: {
    canView: true,
    canEdit: false,
    canCreate: false,
    canDelete: false,
    canManageOrders: false,
    canManageUsers: false,
  },
};

export const roleService = {
  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("admin_user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  setCurrentUser: (user: User): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("admin_user", JSON.stringify(user));
  },

  hasPermission: (permission: keyof typeof rolePermissions.admin): boolean => {
    const user = roleService.getCurrentUser();
    if (!user) return false;
    const permissions = rolePermissions[user.role];
    return permissions[permission] || false;
  },

  isAdmin: (): boolean => {
    const user = roleService.getCurrentUser();
    return user?.role === "admin";
  },

  isEditor: (): boolean => {
    const user = roleService.getCurrentUser();
    return user?.role === "editor" || user?.role === "admin";
  },
};


