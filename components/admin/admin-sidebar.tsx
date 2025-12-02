"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Tag,
  FolderTree,
  ShoppingCart,
  Settings,
  LogOut,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { roleService } from "@/lib/roles";

const menuItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, permission: "canView" },
  { href: "/admin/productos", label: "Productos", icon: Package, permission: "canView" },
  { href: "/admin/marcas", label: "Marcas", icon: Tag, permission: "canView" },
  { href: "/admin/colecciones", label: "Colecciones", icon: FolderTree, permission: "canView" },
  { href: "/admin/ordenes", label: "Órdenes", icon: ShoppingCart, permission: "canManageOrders" },
  { href: "/admin/contacto", label: "Mensajes de Contacto", icon: Mail, permission: "canView" },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings, permission: "canManageUsers" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-display font-bold">Admin Panel</h2>
        <p className="text-sm text-muted-foreground">Relojes de Lujo</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const hasPermission = roleService.hasPermission(item.permission as any);
          
          if (!hasPermission) return null;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-foreground text-background"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}

