import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-display font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Página no encontrada</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <Link href="/">
        <Button size="lg">
          <Home className="mr-2 h-4 w-4" />
          Volver al inicio
        </Button>
      </Link>
    </div>
  );
}


