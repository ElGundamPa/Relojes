import { create } from "zustand";
import { Product } from "@/data/products";

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleItem: (product: Product) => void;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("wishlist-items") || "[]")
    : [],
  addItem: (product) => {
    const items = get().items;
    if (!items.find((p) => p.id === product.id)) {
      const newItems = [...items, product];
      set({ items: newItems });
      if (typeof window !== "undefined") {
        localStorage.setItem("wishlist-items", JSON.stringify(newItems));
      }
    }
  },
  removeItem: (id) => {
    const newItems = get().items.filter((p) => p.id !== id);
    set({ items: newItems });
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlist-items", JSON.stringify(newItems));
    }
  },
  isInWishlist: (id) => {
    return get().items.some((p) => p.id === id);
  },
  toggleItem: (product) => {
    if (get().isInWishlist(product.id)) {
      get().removeItem(product.id);
    } else {
      get().addItem(product);
    }
  },
}));

