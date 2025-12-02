"use client";

import { useEffect, useState } from "react";
import { ordersServiceClient } from "@/lib/services/ordersService.client";
import { Order } from "@/data/orders";
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
import { ShoppingCart, Search, Download, Eye, Edit, Printer } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { productsServiceClient } from "@/lib/services/productsService.client";
import Image from "next/image";

const statusColors = {
  pendiente: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  pagada: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  enviada: "bg-green-500/10 text-green-600 border-green-500/20",
  completada: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  cancelada: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [productImages, setProductImages] = useState<Record<string, string>>({});

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    loadProductImages();
  }, [orders]);

  const loadProductImages = async () => {
    const images: Record<string, string> = {};
    const uniqueProductIds = new Set<string>();
    
    orders.forEach((order) => {
      order.items.forEach((item) => {
        uniqueProductIds.add(item.productId);
      });
    });

    // Cargar imágenes de productos
    for (const productId of uniqueProductIds) {
      try {
        const product = await productsServiceClient.getById(productId);
        if (product && product.image) {
          images[productId] = product.image;
        }
      } catch (error) {
        // Error silencioso - producto sin imagen
      }
    }

    setProductImages(images);
  };

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter]);

  const loadOrders = async () => {
    const allOrders = await ordersServiceClient.getAll();
    setOrders(allOrders);
    setFilteredOrders(allOrders);
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Filtro por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    // Filtro por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(query) ||
          o.customer.name.toLowerCase().includes(query) ||
          o.customer.email.toLowerCase().includes(query) ||
          o.customer.phone.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(filtered);
  };

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    await ordersServiceClient.updateStatus(orderId, newStatus);
    loadOrders();
  };

  const exportToCSV = () => {
    const headers = ["ID", "Cliente", "Email", "Teléfono", "Total", "Estado", "Fecha"];
    const rows = filteredOrders.map((order) => [
      order.id,
      order.customer.name,
      order.customer.email,
      order.customer.phone,
      order.total.toString(),
      order.status,
      new Date(order.createdAt).toLocaleDateString("es-ES"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `ordenes-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Órdenes</h1>
          <p className="text-muted-foreground">
            Gestiona las órdenes de tus clientes
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button onClick={() => window.print()} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="border-0 shadow-premium">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID, nombre, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="pagada">Pagada</SelectItem>
                <SelectItem value="enviada">Enviada</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Órdenes */}
      <Card className="border-0 shadow-premium">
        <CardHeader>
          <CardTitle>
            {filteredOrders.length} {filteredOrders.length === 1 ? "orden" : "órdenes"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <TableCell className="font-mono text-sm">
                      {order.id.slice(0, 12)}...
                    </TableCell>
                    <TableCell>{order.customer.name}</TableCell>
                    <TableCell>{order.customer.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <div
                              key={idx}
                              className="relative w-8 h-8 rounded-full border-2 border-background overflow-hidden bg-muted"
                            >
                              {productImages[item.productId] ? (
                                <Image
                                  src={productImages[item.productId]}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  sizes="32px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs">
                                  {item.name.charAt(0)}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {order.items.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{order.items.length - 3}
                          </span>
                        )}
                        <span className="text-sm text-muted-foreground">
                          ({order.items.length})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">
                      {formatPrice(order.total)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          handleStatusChange(order.id, value as Order["status"])
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendiente">Pendiente</SelectItem>
                          <SelectItem value="pagada">Pagada</SelectItem>
                          <SelectItem value="enviada">Enviada</SelectItem>
                          <SelectItem value="completada">Completada</SelectItem>
                          <SelectItem value="cancelada">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString("es-ES")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/admin/ordenes/${order.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No hay órdenes</h3>
              <p className="text-muted-foreground">
                {orders.length === 0
                  ? "Aún no se han realizado órdenes."
                  : "No se encontraron órdenes con los filtros seleccionados."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
