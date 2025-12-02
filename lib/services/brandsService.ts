import { BrandData, Collection } from "@/data/brands";
import { Brand } from "@/data/products";
import { productsService } from "./productsService";
import * as fs from "fs";
import * as path from "path";

function readBrands(): BrandData[] {
  try {
    const filePath = path.join(process.cwd(), "data", "brands.ts");
    if (!fs.existsSync(filePath)) return [];
    
    const content = fs.readFileSync(filePath, "utf-8");
    const brandsMatch = content.match(/export const brandsData: BrandData\[\] = (\[[\s\S]*?\]);/);
    if (!brandsMatch) return [];
    
    return JSON.parse(brandsMatch[1]);
  } catch (error) {
    console.error("Error reading brands:", error);
    return [];
  }
}

function writeBrands(brands: BrandData[]): void {
  try {
    const filePath = path.join(process.cwd(), "data", "brands.ts");
    let content = fs.readFileSync(filePath, "utf-8");
    
    const brandsJson = JSON.stringify(brands, null, 2);
    content = content.replace(
      /export const brandsData: BrandData\[\] = \[[\s\S]*?\];/,
      `export const brandsData: BrandData[] = ${brandsJson};`
    );
    
    fs.writeFileSync(filePath, content, "utf-8");
  } catch (error) {
    console.error("Error writing brands:", error);
    throw error;
  }
}

export const brandsService = {
  getAll: (): BrandData[] => {
    return readBrands();
  },

  getBySlug: (slug: string): BrandData | undefined => {
    const brands = readBrands();
    return brands.find((b) => b.slug === slug);
  },

  create: (brandData: Omit<BrandData, "slug" | "count" | "image">): BrandData => {
    const brands = readBrands();
    const slug = brandData.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newBrand: BrandData = {
      ...brandData,
      slug,
      count: 0,
      image: brandData.logo || "",
      active: brandData.active ?? true,
    };

    brands.push(newBrand);
    writeBrands(brands);
    return newBrand;
  },

  update: (slug: string, updates: Partial<BrandData>): BrandData | null => {
    const brands = readBrands();
    const index = brands.findIndex((b) => b.slug === slug);
    
    if (index === -1) return null;

    brands[index] = {
      ...brands[index],
      ...updates,
      slug: brands[index].slug, // Mantener slug original
    };

    writeBrands(brands);
    return brands[index];
  },

  delete: (slug: string): boolean => {
    const brands = readBrands();
    const index = brands.findIndex((b) => b.slug === slug);
    
    if (index === -1) return false;

    // Verificar que no haya productos asociados
    const products = productsService.getByBrand(brands[index].name);
    if (products.length > 0) {
      throw new Error("No se puede eliminar una marca con productos asociados");
    }

    brands.splice(index, 1);
    writeBrands(brands);
    return true;
  },

  addCollection: (brandSlug: string, collection: Omit<Collection, "id" | "slug" | "brandId">): Collection => {
    const brands = readBrands();
    const brand = brands.find((b) => b.slug === brandSlug);
    
    if (!brand) throw new Error("Marca no encontrada");

    const slug = collection.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newCollection: Collection = {
      id: `${brandSlug}-${slug}-${Date.now()}`,
      brand: brand.name,
      name: collection.name,
      slug,
      totalProducts: 0,
      description: collection.description,
      active: collection.active ?? true,
    };

    if (!brand.collections) brand.collections = [];
    brand.collections.push(newCollection);
    writeBrands(brands);

    return newCollection;
  },
};

