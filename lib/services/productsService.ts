import { Product } from "@/data/products";
import * as fs from "fs";
import * as path from "path";
import { cache, createCacheKey } from "@/lib/cache";

// Leer productos desde el archivo con caché
function readProducts(): Product[] {
  const cacheKey = createCacheKey("products", "all");
  
  // Intentar obtener del caché primero
  const cached = cache.get<Product[]>(cacheKey);
  if (cached) {
    return cached;
  }
  
  try {
    const filePath = path.join(process.cwd(), "data", "products.ts");
    if (!fs.existsSync(filePath)) {
      console.warn("⚠️  Archivo products.ts no encontrado. Ejecuta: npm run generate-products");
      return [];
    }
    
    const content = fs.readFileSync(filePath, "utf-8");
    
    // Extraer el array de productos del archivo
    const productsMatch = content.match(/export const products: Product\[\] = (\[[\s\S]*?\]);/);
    if (!productsMatch) {
      console.warn("⚠️  No se pudo extraer el array de productos del archivo");
      return [];
    }
    
    // Evaluar el JSON (en producción usar un parser más seguro)
    const productsJson = productsMatch[1];
    const products = JSON.parse(productsJson);
    
    // Validar que sean productos válidos
    const validProducts = products.filter((p: any) => p && p.id && p.name);
    
    // Guardar en caché por 10 minutos
    cache.set(cacheKey, validProducts, 10 * 60 * 1000);
    
    return validProducts;
  } catch (error) {
    console.error("Error reading products:", error);
    return [];
  }
}

// Escribir productos al archivo
function writeProducts(products: Product[]): void {
  try {
    const filePath = path.join(process.cwd(), "data", "products.ts");
    
    // Leer el contenido actual
    let content = fs.readFileSync(filePath, "utf-8");
    
    // Reemplazar el array de productos
    const productsJson = JSON.stringify(products, null, 2);
    content = content.replace(
      /export const products: Product\[\] = \[[\s\S]*?\];/,
      `export const products: Product[] = ${productsJson};`
    );
    
    fs.writeFileSync(filePath, content, "utf-8");
  } catch (error) {
    console.error("Error writing products:", error);
    throw error;
  }
}

export const productsService = {
  getAll: (): Product[] => {
    return readProducts();
  },

  getById: (id: string): Product | undefined => {
    const products = readProducts();
    return products.find((p) => p.id === id);
  },

  getBySlug: (slug: string): Product | undefined => {
    const products = readProducts();
    return products.find((p) => p.slug === slug);
  },

  getByBrand: (brand: string): Product[] => {
    const products = readProducts();
    return products.filter((p) => p.brand === brand);
  },

  create: (product: Omit<Product, "id" | "slug">): Product => {
    const products = readProducts();
    const slug = product.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    const newProduct: Product = {
      ...product,
      id: `${product.brand.toLowerCase().replace(/\s+/g, "-")}-${slug}-${Date.now()}`,
      slug,
    };

    products.push(newProduct);
    writeProducts(products);
    return newProduct;
  },

  update: (id: string, updates: Partial<Product>): Product | null => {
    const products = readProducts();
    const index = products.findIndex((p) => p.id === id);
    
    if (index === -1) return null;

    const updatedProduct = {
      ...products[index],
      ...updates,
      id: products[index].id, // Mantener el ID original
    };

    // Regenerar slug si cambió el nombre
    if (updates.name && updates.name !== products[index].name) {
      updatedProduct.slug = updates.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    products[index] = updatedProduct;
    writeProducts(products);
    return updatedProduct;
  },

  delete: (id: string): boolean => {
    const products = readProducts();
    const index = products.findIndex((p) => p.id === id);
    
    if (index === -1) return false;

    products.splice(index, 1);
    writeProducts(products);
    return true;
  },

  toggleActive: (id: string): Product | null => {
    const products = readProducts();
    const product = products.find((p) => p.id === id);
    
    if (!product) return null;

    // Agregar campo active si no existe
    const updatedProduct = {
      ...product,
      active: !(product as any).active ?? true,
    };

    return this.update(id, updatedProduct);
  },

  // Búsqueda mejorada
  search: (query: string): Product[] => {
    const products = readProducts();
    const queryLower = query.toLowerCase();
    
    return products.filter((product) => {
      const searchableText = `${product.name} ${product.brand} ${product.subcategory} ${product.description}`.toLowerCase();
      return searchableText.includes(queryLower);
    });
  },

  // Obtener productos con validación
  getValidProducts: (): Product[] => {
    const products = readProducts();
    return products.filter((p) => {
      return p.id && p.name && p.brand && p.image && p.price > 0;
    });
  },
};

