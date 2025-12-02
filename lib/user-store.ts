import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface UserOrder {
  id: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    qty: number;
    image?: string;
  }>;
  total: number;
  status: "pendiente" | "procesando" | "enviado" | "entregado" | "cancelado";
  createdAt: string;
  address: Address;
  payment?: {
    method: "stripe" | "paypal";
    id: string;
    amount: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // En producción, esto sería un hash
  avatar: string | null;
  phone?: string;
  addresses: Address[];
  orders: UserOrder[];
  createdAt: string;
}

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, "name" | "email" | "phone" | "avatar">>) => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  addAddress: (address: Omit<Address, "id">) => void;
  removeAddress: (addressId: string) => void;
  updateAddress: (addressId: string, address: Partial<Address>) => void;
  setDefaultAddress: (addressId: string) => void;
  saveOrder: (order: UserOrder) => void;
  updateOrderStatus: (orderId: string, status: UserOrder["status"]) => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

// Función para generar ID único
const generateId = () => `_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        if (typeof window === "undefined") {
          return { success: false, error: "No disponible en servidor" };
        }

        try {
          // Obtener usuarios del localStorage
          const storedUsers = localStorage.getItem("app-users");
          const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

          // Buscar usuario
          const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

          if (!user) {
            return { success: false, error: "Email o contraseña incorrectos" };
          }

          if (user.password !== password) {
            return { success: false, error: "Email o contraseña incorrectos" };
          }

          // Login exitoso
          set({ user, isAuthenticated: true });
          return { success: true };
        } catch (error) {
          return { success: false, error: "Error al iniciar sesión" };
        }
      },

      register: async (name: string, email: string, password: string) => {
        if (typeof window === "undefined") {
          return { success: false, error: "No disponible en servidor" };
        }

        try {
          // Validar email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            return { success: false, error: "Email no válido" };
          }

          // Validar contraseña
          if (password.length < 6) {
            return { success: false, error: "La contraseña debe tener al menos 6 caracteres" };
          }

          // Obtener usuarios del localStorage
          const storedUsers = localStorage.getItem("app-users");
          const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

          // Verificar si el email ya existe
          if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, error: "Este email ya está registrado" };
          }

          // Crear nuevo usuario
          const newUser: User = {
            id: generateId(),
            name,
            email: email.toLowerCase(),
            password, // En producción, hashear con bcrypt
            avatar: null,
            phone: "",
            addresses: [],
            orders: [],
            createdAt: new Date().toISOString(),
          };

          // Guardar usuario
          users.push(newUser);
          localStorage.setItem("app-users", JSON.stringify(users));

          // Auto-login
          set({ user: newUser, isAuthenticated: true });
          return { success: true };
        } catch (error) {
          return { success: false, error: "Error al crear la cuenta" };
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        const { user } = get();
        if (!user) return;

        const updatedUser = { ...user, ...data };
        set({ user: updatedUser });

        // Actualizar en localStorage
        if (typeof window !== "undefined") {
          const storedUsers = localStorage.getItem("app-users");
          const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
          const index = users.findIndex((u) => u.id === user.id);
          if (index !== -1) {
            users[index] = updatedUser;
            localStorage.setItem("app-users", JSON.stringify(users));
          }
        }
      },

      updatePassword: async (currentPassword: string, newPassword: string) => {
        const { user } = get();
        if (!user) {
          return { success: false, error: "Usuario no autenticado" };
        }

        if (user.password !== currentPassword) {
          return { success: false, error: "Contraseña actual incorrecta" };
        }

        if (newPassword.length < 6) {
          return { success: false, error: "La nueva contraseña debe tener al menos 6 caracteres" };
        }

        const updatedUser = { ...user, password: newPassword };
        set({ user: updatedUser });

        // Actualizar en localStorage
        if (typeof window !== "undefined") {
          const storedUsers = localStorage.getItem("app-users");
          const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
          const index = users.findIndex((u) => u.id === user.id);
          if (index !== -1) {
            users[index] = updatedUser;
            localStorage.setItem("app-users", JSON.stringify(users));
          }
        }

        return { success: true };
      },

      addAddress: (address) => {
        const { user } = get();
        if (!user) return;

        const newAddress: Address = {
          ...address,
          id: generateId(),
        };

        // Si es la primera dirección o está marcada como default, hacerla default
        if (user.addresses.length === 0 || address.isDefault) {
          newAddress.isDefault = true;
          // Quitar default de otras direcciones
          user.addresses.forEach((addr) => {
            addr.isDefault = false;
          });
        }

        const updatedUser = {
          ...user,
          addresses: [...user.addresses, newAddress],
        };

        set({ user: updatedUser });

        // Actualizar en localStorage
        if (typeof window !== "undefined") {
          const storedUsers = localStorage.getItem("app-users");
          const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
          const index = users.findIndex((u) => u.id === user.id);
          if (index !== -1) {
            users[index] = updatedUser;
            localStorage.setItem("app-users", JSON.stringify(users));
          }
        }
      },

      removeAddress: (addressId) => {
        const { user } = get();
        if (!user) return;

        const updatedUser = {
          ...user,
          addresses: user.addresses.filter((addr) => addr.id !== addressId),
        };

        set({ user: updatedUser });

        // Actualizar en localStorage
        if (typeof window !== "undefined") {
          const storedUsers = localStorage.getItem("app-users");
          const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
          const index = users.findIndex((u) => u.id === user.id);
          if (index !== -1) {
            users[index] = updatedUser;
            localStorage.setItem("app-users", JSON.stringify(users));
          }
        }
      },

      updateAddress: (addressId, addressData) => {
        const { user } = get();
        if (!user) return;

        const updatedUser = {
          ...user,
          addresses: user.addresses.map((addr) =>
            addr.id === addressId ? { ...addr, ...addressData } : addr
          ),
        };

        set({ user: updatedUser });

        // Actualizar en localStorage
        if (typeof window !== "undefined") {
          const storedUsers = localStorage.getItem("app-users");
          const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
          const index = users.findIndex((u) => u.id === user.id);
          if (index !== -1) {
            users[index] = updatedUser;
            localStorage.setItem("app-users", JSON.stringify(users));
          }
        }
      },

      setDefaultAddress: (addressId) => {
        const { user } = get();
        if (!user) return;

        const updatedUser = {
          ...user,
          addresses: user.addresses.map((addr) => ({
            ...addr,
            isDefault: addr.id === addressId,
          })),
        };

        set({ user: updatedUser });

        // Actualizar en localStorage
        if (typeof window !== "undefined") {
          const storedUsers = localStorage.getItem("app-users");
          const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
          const index = users.findIndex((u) => u.id === user.id);
          if (index !== -1) {
            users[index] = updatedUser;
            localStorage.setItem("app-users", JSON.stringify(users));
          }
        }
      },

      saveOrder: (order) => {
        const { user } = get();
        if (!user) return;

        const updatedUser = {
          ...user,
          orders: [order, ...user.orders],
        };

        set({ user: updatedUser });

        // Actualizar en localStorage
        if (typeof window !== "undefined") {
          const storedUsers = localStorage.getItem("app-users");
          const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
          const index = users.findIndex((u) => u.id === user.id);
          if (index !== -1) {
            users[index] = updatedUser;
            localStorage.setItem("app-users", JSON.stringify(users));
          }
        }
      },

      updateOrderStatus: (orderId, status) => {
        const { user } = get();
        if (!user) return;

        const updatedUser = {
          ...user,
          orders: user.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        };

        set({ user: updatedUser });

        // Actualizar en localStorage
        if (typeof window !== "undefined") {
          const storedUsers = localStorage.getItem("app-users");
          const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
          const index = users.findIndex((u) => u.id === user.id);
          if (index !== -1) {
            users[index] = updatedUser;
            localStorage.setItem("app-users", JSON.stringify(users));
          }
        }
      },

      resetPassword: async (email: string) => {
        if (typeof window === "undefined") {
          return { success: false, error: "No disponible en servidor" };
        }

        try {
          const storedUsers = localStorage.getItem("app-users");
          const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

          const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

          if (!user) {
            // Por seguridad, no revelamos si el email existe o no
            return { success: true }; // Simulamos éxito
          }

          // Resetear contraseña a "password123" (simulado)
          const newPassword = "password123";
          const index = users.findIndex((u) => u.id === user.id);
          if (index !== -1) {
            users[index].password = newPassword;
            localStorage.setItem("app-users", JSON.stringify(users));

            // Si el usuario está logueado, actualizar su sesión
            const { user: currentUser } = get();
            if (currentUser?.id === user.id) {
              set({ user: { ...currentUser, password: newPassword } });
            }
          }

          return { success: true };
        } catch (error) {
          return { success: false, error: "Error al resetear contraseña" };
        }
      },
    }),
    {
      name: "user-data",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);


