// Cliente para el servicio de productos (usa API routes)
import { Product } from "@/data/products";

export const productsServiceClient = {
  getAll: async (): Promise<Product[]> => {
    const response = await fetch("/api/admin/products");
    const data = await response.json();
    return data.products || [];
  },

  getById: async (id: string): Promise<Product | undefined> => {
    const products = await this.getAll();
    return products.find((p: Product) => p.id === id);
  },

  create: async (product: Omit<Product, "id" | "slug">): Promise<Product> => {
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    const data = await response.json();
    return data.product;
  },

  update: async (
    id: string,
    updates: Partial<Product>
  ): Promise<Product | null> => {
    const response = await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    if (response.status === 404) return null;
    const data = await response.json();
    return data.product;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await fetch(`/api/admin/products?id=${id}`, {
      method: "DELETE",
    });
    return response.ok;
  },
};

