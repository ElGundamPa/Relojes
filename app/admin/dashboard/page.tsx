"use client";

import { useEffect, useState } from "react";
import { productsServiceClient } from "@/lib/services/productsService.client";
import { brandsServiceClient } from "@/lib/services/brandsService.client";
import { ordersServiceClient } from "@/lib/services/ordersService.client";
import { Product } from "@/data/products";
import { BrandData } from "@/data/brands";
import { brandsData } from "@/data/brands";
import { collections } from "@/data/collections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Tag,
  TrendingUp,
  Eye,
  AlertTriangle,
  ShoppingCart,
  DollarSign,
  Image as ImageIcon,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Image from "next/image";

interface DashboardStats {
  totalProducts: number;
  totalBrands: number;
  totalCollections: number;
  activeProducts: number;
  productsWithoutPrice: number;
  productsWithoutImage: number;
  productsThisWeek: number;
  totalOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalBrands: 0,
    totalCollections: 0,
    activeProducts: 0,
    productsWithoutPrice: 0,
    productsWithoutImage: 0,
    productsThisWeek: 0,
    totalOrders: 0,
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [productsByBrand, setProductsByBrand] = useState<any[]>([]);
  const [collectionsData, setCollectionsData] = useState<any[]>([]);
  const [sizesData, setSizesData] = useState<any[]>([]);
  const [colorsData, setColorsData] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const products = await productsServiceClient.getAll();
    const serviceBrands = await brandsServiceClient.getAll();
    const brands = serviceBrands.length > 0 ? serviceBrands : (brandsData as BrandData[]);
    const orders = await ordersServiceClient.getAll();

    // Calcular estadísticas
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const productsThisWeek = products.filter((p) => {
      // Asumir que productos recientes tienen IDs con timestamp
      const productDate = new Date(parseInt(p.id.split("-").pop() || "0"));
      return productDate >= weekAgo;
    }).length;

    const productsWithoutPrice = products.filter((p) => !p.price || p.price === 0).length;
    const productsWithoutImage = products.filter((p) => !p.image || p.image === "").length;

    // Productos por marca
    const brandMap = new Map<string, number>();
    products.forEach((p) => {
      const count = brandMap.get(p.brand) || 0;
      brandMap.set(p.brand, count + 1);
    });

    const productsByBrandData = Array.from(brandMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Colecciones más pobladas
    const collectionsDataSorted = [...collections]
      .sort((a, b) => b.totalProducts - a.totalProducts)
      .slice(0, 10)
      .map((c) => ({ name: c.name, productos: c.totalProducts }));

    // Tallas detectadas
    const sizesMap = new Map<string, number>();
    products.forEach((p) => {
      const sizeMatch = p.name.match(/(\d+)mm/i) || p.subcategory.match(/(\d+)mm/i);
      if (sizeMatch) {
        const size = `${sizeMatch[1]}mm`;
        sizesMap.set(size, (sizesMap.get(size) || 0) + 1);
      }
    });
    const sizesDataArray = Array.from(sizesMap.entries())
      .map(([size, count]) => ({ size, count }))
      .sort((a, b) => parseInt(a.size) - parseInt(b.size));

    // Colores detectados
    const colorsMap = new Map<string, number>();
    const colorKeywords = ["azul", "rojo", "verde", "negro", "blanco", "rosa", "dorado", "plateado"];
    products.forEach((p) => {
      const searchText = `${p.name} ${p.description}`.toLowerCase();
      colorKeywords.forEach((color) => {
        if (searchText.includes(color)) {
          colorsMap.set(color, (colorsMap.get(color) || 0) + 1);
        }
      });
    });
    const colorsDataArray = Array.from(colorsMap.entries())
      .map(([color, count]) => ({ color: color.charAt(0).toUpperCase() + color.slice(1), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Alertas
    const alertsList: string[] = [];
    if (productsWithoutPrice > 0) {
      alertsList.push(`${productsWithoutPrice} productos sin precio`);
    }
    if (productsWithoutImage > 0) {
      alertsList.push(`${productsWithoutImage} productos sin imagen`);
    }

    // Productos duplicados (mismo nombre)
    const nameMap = new Map<string, number>();
    products.forEach((p) => {
      nameMap.set(p.name, (nameMap.get(p.name) || 0) + 1);
    });
    const duplicates = Array.from(nameMap.entries()).filter(([_, count]) => count > 1);
    if (duplicates.length > 0) {
      alertsList.push(`${duplicates.length} productos con nombres duplicados`);
    }

    // Productos sin marca
    const productsWithoutBrand = products.filter((p) => !p.brand || p.brand === "").length;
    if (productsWithoutBrand > 0) {
      alertsList.push(`${productsWithoutBrand} productos sin marca asignada`);
    }

    // Productos sin colección/subcategoría
    const productsWithoutCollection = products.filter((p) => !p.subcategory || p.subcategory === "").length;
    if (productsWithoutCollection > 0) {
      alertsList.push(`${productsWithoutCollection} productos sin colección asignada`);
    }

    setStats({
      totalProducts: products.length,
      totalBrands: brands.length,
      totalCollections: collections.length,
      activeProducts: products.length, // Asumir todos activos por ahora
      productsWithoutPrice,
      productsWithoutImage,
      productsThisWeek,
      totalOrders: orders.length,
    });

    setRecentProducts(
      [...products]
        .sort((a, b) => b.id.localeCompare(a.id))
        .slice(0, 5)
    );

    setAlerts(alertsList);
    setProductsByBrand(productsByBrandData);
    setCollectionsData(collectionsDataSorted);
    setSizesData(sizesDataArray);
    setColorsData(colorsDataArray);
  };

  const statCards = [
    {
      title: "Total Productos",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Marcas",
      value: stats.totalBrands,
      icon: Tag,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Colecciones",
      value: stats.totalCollections,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Productos Activos",
      value: stats.activeProducts,
      icon: Eye,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Sin Precio",
      value: stats.productsWithoutPrice,
      icon: DollarSign,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Sin Imagen",
      value: stats.productsWithoutImage,
      icon: ImageIcon,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Nuevos (Semana)",
      value: stats.productsThisWeek,
      icon: Calendar,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      title: "Total Órdenes",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#06b6d4", "#84cc16"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen general de tu tienda de relojes
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-premium">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} ${stat.bgColor} p-3 rounded-lg`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Alertas */}
      {alerts.length > 0 && (
        <Card className="border-0 shadow-premium border-yellow-500/20 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Alertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <div key={index} className="text-sm text-muted-foreground">
                  ⚠️ {alert}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos por Marca */}
        <Card className="border-0 shadow-premium">
          <CardHeader>
            <CardTitle>Productos por Marca</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productsByBrand}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Colecciones más Pobladas */}
        <Card className="border-0 shadow-premium">
          <CardHeader>
            <CardTitle>Colecciones más Pobladas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={collectionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="productos" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tallas */}
        {sizesData.length > 0 && (
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle>Distribución por Talla</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sizesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ size, percent }) => `${size} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {sizesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Colores */}
        {colorsData.length > 0 && (
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle>Colores Detectados</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={colorsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="color" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Products */}
      <Card className="border-0 shadow-premium">
        <CardHeader>
          <CardTitle>Productos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0 relative">
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="w-full h-full object-cover"
                      sizes="64px"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.brand} • {product.subcategory}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {new Intl.NumberFormat("es-ES", {
                      style: "currency",
                      currency: "EUR",
                    }).format(product.price)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
