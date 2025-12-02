import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  lastAddedItem: { name: string; image: string; price: number } | null;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  clearLastAddedItem: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: typeof window !== "undefined" 
    ? JSON.parse(localStorage.getItem("cart-items") || "[]")
    : [],
  isOpen: false,
  lastAddedItem: null,
  addItem: (item) => {
    const items = get().items;
    const existingItem = items.find((i) => i.id === item.id);

    let newItems;
    if (existingItem) {
      newItems = items.map((i) =>
        i.id === item.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
    } else {
      newItems = [...items, { ...item, quantity: 1 }];
    }
    
    set({ 
      items: newItems,
      lastAddedItem: {
        name: item.name,
        image: item.image,
        price: item.price,
      }
    });
    if (typeof window !== "undefined") {
      localStorage.setItem("cart-items", JSON.stringify(newItems));
    }
    
    // Limpiar lastAddedItem después de 5 segundos
    setTimeout(() => {
      get().clearLastAddedItem();
    }, 5000);
  },
  removeItem: (id) => {
    const newItems = get().items.filter((item) => item.id !== id);
    set({ items: newItems });
    if (typeof window !== "undefined") {
      localStorage.setItem("cart-items", JSON.stringify(newItems));
    }
  },
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    const newItems = get().items.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    set({ items: newItems });
    if (typeof window !== "undefined") {
      localStorage.setItem("cart-items", JSON.stringify(newItems));
    }
  },
  clearCart: () => {
    set({ items: [] });
    if (typeof window !== "undefined") {
      localStorage.setItem("cart-items", JSON.stringify([]));
    }
  },
  toggleCart: () => set({ isOpen: !get().isOpen }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  getTotalPrice: () => {
    return get().items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
  clearLastAddedItem: () => {
    set({ lastAddedItem: null });
  },
}));

