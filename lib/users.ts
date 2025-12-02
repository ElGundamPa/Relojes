// Sistema de usuarios compartido
// En producción, esto debería venir de una base de datos

export interface User {
  id: string;
  email: string;
  password: string; // En producción, esto sería un hash
  name: string;
  image?: string | null;
  createdAt: string;
}

// Usuarios iniciales
export const users: User[] = [
  {
    id: "1",
    email: "admin@relojes.com",
    password: "admin123", // En producción, usar hash bcrypt
    name: "Administrador",
    image: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "user@relojes.com",
    password: "user123",
    name: "Usuario",
    image: null,
    createdAt: new Date().toISOString(),
  },
];

// Funciones para gestionar usuarios
export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email);
}

export function findUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function createUser(user: Omit<User, "id" | "createdAt">): User {
  const newUser: User = {
    ...user,
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  return newUser;
}

export function verifyPassword(user: User, password: string): boolean {
  return user.password === password;
}


