import { getAllProducts } from "@/lib/data-cache";
import AllProductsPageClient from "./page-client";

// Forzar generación estática
export const dynamic = "force-static";
export const revalidate = false;

export const metadata = {
  title: "Todos los Relojes | Relojes de Lujo",
  description: "Explora nuestra completa colección de relojes de lujo. Más de cientos de modelos disponibles de las mejores marcas suizas.",
  openGraph: {
    title: "Todos los Relojes | Relojes de Lujo",
    description: "Explora nuestra completa colección de relojes de lujo.",
    type: "website",
  },
};

export default async function AllProductsPage() {
  const products = await getAllProducts();
  
  return <AllProductsPageClient initialProducts={products} />;
}
