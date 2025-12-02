import { cache } from "react";
import { products, brands, getProductBySlug, getProductById, getProductsByBrand, getRelatedProducts } from "@/data/products";

// Cache de React para funciones de datos
// Esto evita que se lea el disco en cada petición
// Next.js deduplica automáticamente las llamadas durante el render

export const getAllProducts = cache(async () => {
  return products;
});

export const getCachedProductBySlug = cache(async (slug: string) => {
  return getProductBySlug(slug);
});

export const getCachedProductById = cache(async (id: string) => {
  return getProductById(id);
});

export const getCachedProductsByBrand = cache(async (brandName: string) => {
  return getProductsByBrand(brandName);
});

export const getCachedRelatedProducts = cache(async (productId: string, limit: number = 3) => {
  return getRelatedProducts(productId, limit);
});

export const getCachedSimilarProducts = cache(async (productId: string, limit: number = 4) => {
  const { getSimilarProducts } = await import("@/data/products");
  return getSimilarProducts(productId, limit);
});

export const getAllBrands = cache(async () => {
  return brands;
});

