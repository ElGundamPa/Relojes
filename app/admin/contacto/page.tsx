"use client";

import { useEffect, useState } from "react";
import { contactServiceClient } from "@/lib/services/contactService.client";
import { ContactMessage } from "@/data/contactMessages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Mail, Search, Trash2, Eye, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [readFilter, setReadFilter] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchQuery, readFilter]);

  const loadMessages = async () => {
    const allMessages = await contactServiceClient.getAll();
    // Ordenar por fecha: más recientes primero
    allMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setMessages(allMessages);
    setFilteredMessages(allMessages);
  };

  const filterMessages = () => {
    let filtered = [...messages];

    // Filtro por estado de lectura
    if (readFilter === "unread") {
      filtered = filtered.filter((m) => !m.read);
    } else if (readFilter === "read") {
      filtered = filtered.filter((m) => m.read);
    }

    // Filtro por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.email.toLowerCase().includes(query) ||
          m.subject.toLowerCase().includes(query) ||
          m.message.toLowerCase().includes(query)
      );
    }

    setFilteredMessages(filtered);
  };

  const handleMarkAsRead = async (id: string) => {
    await contactServiceClient.markAsRead(id);
    loadMessages();
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este mensaje?")) {
      await contactServiceClient.delete(id);
      loadMessages();
      if (selectedMessage?.id === id) {
        setIsDialogOpen(false);
        setSelectedMessage(null);
      }
    }
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
    // Marcar como leído automáticamente si no está leído
    if (!message.read) {
      handleMarkAsRead(message.id);
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Mensajes de Contacto</h1>
          <p className="text-muted-foreground">
            Gestiona los mensajes recibidos desde el formulario de contacto
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="text-lg px-4 py-2">
            {unreadCount} {unreadCount === 1 ? "no leído" : "no leídos"}
          </Badge>
        )}
      </div>

      {/* Filtros */}
      <Card className="border-0 shadow-premium">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email, asunto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={readFilter} onValueChange={setReadFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="unread">No leídos</SelectItem>
                <SelectItem value="read">Leídos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Mensajes */}
      <Card className="border-0 shadow-premium">
        <CardHeader>
          <CardTitle>
            {filteredMessages.length} {filteredMessages.length === 1 ? "mensaje" : "mensajes"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMessages.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estado</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Asunto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((message, index) => (
                  <motion.tr
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={!message.read ? "bg-muted/30" : ""}
                  >
                    <TableCell>
                      {message.read ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Leído
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                          <XCircle className="h-3 w-3 mr-1" />
                          No leído
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell className="max-w-xs truncate">{message.subject}</TableCell>
                    <TableCell>
                      {new Date(message.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewMessage(message)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!message.read && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsRead(message.id)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(message.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No hay mensajes</h3>
              <p className="text-muted-foreground">
                {messages.length === 0
                  ? "Aún no se han recibido mensajes de contacto."
                  : "No se encontraron mensajes con los filtros seleccionados."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para ver mensaje completo */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
            <DialogDescription>
              Mensaje de {selectedMessage?.name} ({selectedMessage?.email})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Fecha:</p>
              <p className="text-sm">
                {selectedMessage &&
                  new Date(selectedMessage.createdAt).toLocaleString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Mensaje:</p>
              <p className="text-sm whitespace-pre-wrap">{selectedMessage?.message}</p>
            </div>
            {selectedMessage && (
              <div className="flex gap-2 pt-4 border-t">
                {!selectedMessage.read && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleMarkAsRead(selectedMessage.id);
                      setIsDialogOpen(false);
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Marcar como leído
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDelete(selectedMessage.id);
                    setIsDialogOpen(false);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

