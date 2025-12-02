"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Configuración</h1>
        <p className="text-muted-foreground">
          Configuración general de la tienda
        </p>
      </div>

      <Card className="border-0 shadow-premium">
        <CardHeader>
          <CardTitle>Configuración General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storeName">Nombre de la Tienda</Label>
            <Input id="storeName" defaultValue="Relojes de Lujo" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storeEmail">Email de Contacto</Label>
            <Input id="storeEmail" defaultValue="info@relojes.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storePhone">Teléfono</Label>
            <Input id="storePhone" defaultValue="+34 900 123 456" />
          </div>
          <Button>Guardar Cambios</Button>
        </CardContent>
      </Card>
    </div>
  );
}


