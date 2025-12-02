import { ContactMessage } from "@/data/contactMessages";
import * as fs from "fs";
import * as path from "path";

function readContactMessages(): ContactMessage[] {
  try {
    const filePath = path.join(process.cwd(), "data", "contactMessages.ts");
    if (!fs.existsSync(filePath)) return [];

    const content = fs.readFileSync(filePath, "utf-8");
    const messagesMatch = content.match(/export const contactMessages: ContactMessage\[\] = (\[[\s\S]*?\]);/);
    if (!messagesMatch) return [];

    return JSON.parse(messagesMatch[1]);
  } catch (error) {
    console.error("Error reading contact messages:", error);
    return [];
  }
}

function writeContactMessages(messages: ContactMessage[]): void {
  try {
    const filePath = path.join(process.cwd(), "data", "contactMessages.ts");
    let content = fs.readFileSync(filePath, "utf-8");

    const messagesJson = JSON.stringify(messages, null, 2);
    content = content.replace(
      /export const contactMessages: ContactMessage\[\] = \[[\s\S]*?\];/,
      `export const contactMessages: ContactMessage[] = ${messagesJson};`
    );

    fs.writeFileSync(filePath, content, "utf-8");
  } catch (error) {
    console.error("Error writing contact messages:", error);
    throw error;
  }
}

export const contactService = {
  getAll: (): ContactMessage[] => {
    return readContactMessages();
  },

  getById: (id: string): ContactMessage | undefined => {
    const messages = readContactMessages();
    return messages.find((m) => m.id === id);
  },

  getUnread: (): ContactMessage[] => {
    const messages = readContactMessages();
    return messages.filter((m) => !m.read);
  },

  create: (message: Omit<ContactMessage, "id" | "createdAt" | "read">): ContactMessage => {
    const messages = readContactMessages();
    const newMessage: ContactMessage = {
      ...message,
      id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      read: false,
    };

    messages.push(newMessage);
    writeContactMessages(messages);
    return newMessage;
  },

  markAsRead: (id: string): ContactMessage | null => {
    const messages = readContactMessages();
    const index = messages.findIndex((m) => m.id === id);

    if (index === -1) return null;

    messages[index] = {
      ...messages[index],
      read: true,
    };

    writeContactMessages(messages);
    return messages[index];
  },

  delete: (id: string): boolean => {
    const messages = readContactMessages();
    const index = messages.findIndex((m) => m.id === id);

    if (index === -1) return false;

    messages.splice(index, 1);
    writeContactMessages(messages);
    return true;
  },
};

