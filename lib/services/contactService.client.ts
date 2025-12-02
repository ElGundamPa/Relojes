import { ContactMessage } from "@/data/contactMessages";

export const contactServiceClient = {
  create: async (message: Omit<ContactMessage, "id" | "createdAt" | "read">): Promise<ContactMessage> => {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
    
    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al enviar el mensaje");
      } catch (parseError) {
        throw new Error("Error al enviar el mensaje. Por favor, intenta de nuevo.");
      }
    }
    
    const data = await response.json();
    return data.message;
  },

  getAll: async (): Promise<ContactMessage[]> => {
    const response = await fetch("/api/admin/contact");
    const data = await response.json();
    return data.messages || [];
  },

  getUnread: async (): Promise<ContactMessage[]> => {
    const response = await fetch("/api/admin/contact?unread=true");
    const data = await response.json();
    return data.messages || [];
  },

  markAsRead: async (id: string): Promise<ContactMessage | null> => {
    const response = await fetch(`/api/admin/contact/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    if (response.status === 404) return null;
    const data = await response.json();
    return data.message;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await fetch(`/api/admin/contact/${id}`, {
      method: "DELETE",
    });
    return response.ok;
  },
};

