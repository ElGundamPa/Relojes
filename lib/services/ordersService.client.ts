import { Order } from "@/data/orders";

export const ordersServiceClient = {
  getAll: async (): Promise<Order[]> => {
    const response = await fetch("/api/admin/orders");
    const data = await response.json();
    return data.orders || [];
  },

  getById: async (id: string): Promise<Order | undefined> => {
    const response = await fetch(`/api/admin/orders/${id}`);
    if (response.status === 404) return undefined;
    const data = await response.json();
    return data.order || undefined;
  },

  getByStatus: async (status: Order["status"]): Promise<Order[]> => {
    const response = await fetch(`/api/admin/orders?status=${status}`);
    const data = await response.json();
    return data.orders || [];
  },

  create: async (order: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> => {
    const response = await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    const data = await response.json();
    return data.order;
  },

  update: async (id: string, updates: Partial<Order>): Promise<Order | null> => {
    const response = await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (response.status === 404) return null;
    const data = await response.json();
    return data.order;
  },

  updateStatus: async (id: string, status: Order["status"]): Promise<Order | null> => {
    return ordersServiceClient.update(id, { status });
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await fetch(`/api/admin/orders/${id}`, {
      method: "DELETE",
    });
    return response.ok;
  },
};

