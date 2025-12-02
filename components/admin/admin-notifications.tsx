"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { contactServiceClient } from "@/lib/services/contactService.client";
import { ContactMessage } from "@/data/contactMessages";
import Link from "next/link";

// Función para formatear fecha relativa
const formatRelativeTime = (date: string): string => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "hace unos segundos";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `hace ${days} ${days === 1 ? "día" : "días"}`;
  } else {
    return messageDate.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  }
};

export function AdminNotifications() {
  const [unreadMessages, setUnreadMessages] = useState<ContactMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadUnreadMessages();
    // Recargar cada 30 segundos
    const interval = setInterval(loadUnreadMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Cerrar dropdown al hacer clic fuera
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const loadUnreadMessages = async () => {
    try {
      const messages = await contactServiceClient.getUnread();
      // Ordenar por fecha: más recientes primero
      messages.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setUnreadMessages(messages);
    } catch (error) {
      console.error("Error loading unread messages:", error);
    }
  };

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await contactServiceClient.markAsRead(id);
      loadUnreadMessages();
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const unreadCount = unreadMessages.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-sm">
              Notificaciones {unreadCount > 0 && `(${unreadCount})`}
            </h3>
          </div>
          <div className="overflow-y-auto max-h-80">
            {unreadMessages.length > 0 ? (
              <div className="divide-y divide-border">
                {unreadMessages.map((message) => (
                  <Link
                    key={message.id}
                    href="/admin/contacto"
                    onClick={() => setIsOpen(false)}
                    className="block p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {message.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {message.email}
                        </p>
                        <p className="text-sm mt-1 line-clamp-2">
                          {message.subject}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatRelativeTime(message.createdAt)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={(e) => handleMarkAsRead(message.id, e)}
                        title="Marcar como leído"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay notificaciones</p>
              </div>
            )}
          </div>
          {unreadMessages.length > 0 && (
            <div className="p-2 border-t border-border">
              <Link
                href="/admin/contacto"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Ver todos los mensajes
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

