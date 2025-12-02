import { Order, OrderItem } from "@/data/orders";
import * as fs from "fs";
import * as path from "path";

function readOrders(): Order[] {
  try {
    const filePath = path.join(process.cwd(), "data", "orders.ts");
    if (!fs.existsSync(filePath)) return [];

    const content = fs.readFileSync(filePath, "utf-8");
    const ordersMatch = content.match(/export const orders: Order\[\] = (\[[\s\S]*?\]);/);
    if (!ordersMatch) return [];

    return JSON.parse(ordersMatch[1]);
  } catch (error) {
    console.error("Error reading orders:", error);
    return [];
  }
}

function writeOrders(orders: Order[]): void {
  try {
    const filePath = path.join(process.cwd(), "data", "orders.ts");
    let content = fs.readFileSync(filePath, "utf-8");

    const ordersJson = JSON.stringify(orders, null, 2);
    content = content.replace(
      /export const orders: Order\[\] = \[[\s\S]*?\];/,
      `export const orders: Order[] = ${ordersJson};`
    );

    fs.writeFileSync(filePath, content, "utf-8");
  } catch (error) {
    console.error("Error writing orders:", error);
    throw error;
  }
}

export const ordersService = {
  getAll: (): Order[] => {
    return readOrders();
  },

  getById: (id: string): Order | undefined => {
    const orders = readOrders();
    return orders.find((o) => o.id === id);
  },

  getByStatus: (status: Order["status"]): Order[] => {
    const orders = readOrders();
    return orders.filter((o) => o.status === status);
  },

  create: (order: Omit<Order, "id" | "createdAt" | "updatedAt">): Order => {
    const orders = readOrders();
    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    writeOrders(orders);
    return newOrder;
  },

  update: (id: string, updates: Partial<Order>): Order | null => {
    const orders = readOrders();
    const index = orders.findIndex((o) => o.id === id);

    if (index === -1) return null;

    const existingOrder = orders[index];
    if (!existingOrder) return null;
    
    // Si el status cambió, agregar al historial
    const statusHistory = existingOrder.statusHistory || [];
    if (updates.status && updates.status !== existingOrder.status) {
      statusHistory.push({
        status: updates.status,
        changedAt: new Date().toISOString(),
        notes: updates.statusHistory?.[updates.statusHistory.length - 1]?.notes,
      });
    }
    
    orders[index] = {
      ...existingOrder,
      ...updates,
      id: existingOrder.id, // Mantener ID original
      updatedAt: new Date().toISOString(),
      statusHistory: updates.statusHistory || statusHistory,
    };

    writeOrders(orders);
    return orders[index];
  },

  updateStatus: (id: string, status: Order["status"]): Order | null => {
    return ordersService.update(id, { status });
  },

  delete: (id: string): boolean => {
    const orders = readOrders();
    const index = orders.findIndex((o) => o.id === id);

    if (index === -1) return false;

    orders.splice(index, 1);
    writeOrders(orders);
    return true;
  },
};

