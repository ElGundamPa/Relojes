import { Product, products } from "@/data/products";
import {
  tokenize,
  detectColor,
  detectSize,
  detectGender,
  detectMaterial,
  detectMovement,
  SearchIndexEntry,
} from "@/data/searchIndex";

interface SearchFilters {
  brand?: string;
  color?: string;
  size?: string;
  gender?: string;
  material?: string;
  movement?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const searchService = {
  // Búsqueda inteligente por lenguaje natural mejorada
  intelligentSearch: (query: string, productsList?: Product[]): Product[] => {
    const productsToSearch = productsList || products;
    const tokens = tokenize(query);
    const filters: SearchFilters = {};

    // Detectar filtros en la consulta
    const queryLower = query.toLowerCase();
    
    // Detección mejorada de colores
    const colorMap: Record<string, string> = {
      azul: "azul",
      blue: "azul",
      verde: "verde",
      green: "verde",
      rojo: "rojo",
      red: "rojo",
      plata: "plateado",
      silver: "plateado",
      plateado: "plateado",
      oro: "dorado",
      gold: "dorado",
      dorado: "dorado",
      negro: "negro",
      black: "negro",
      blanco: "blanco",
      white: "blanco",
      rosa: "rosa",
      pink: "rosa",
    };
    
    for (const [key, color] of Object.entries(colorMap)) {
      if (queryLower.includes(key)) {
        filters.color = color.charAt(0).toUpperCase() + color.slice(1);
        break;
      }
    }

    // Detectar marca
    const brands = [
      "rolex",
      "omega",
      "patek philippe",
      "audemars piguet",
      "richard mille",
      "bell & ross",
      "montblanc",
      "tissot",
      "tudor",
      "vacheron",
    ];
    for (const brand of brands) {
      if (queryLower.includes(brand)) {
        filters.brand = brand
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        break;
      }
    }

    // Detectar color
    const detectedColor = detectColor(query);
    if (detectedColor) {
      filters.color = detectedColor
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }

    // Detectar tamaño mejorado
    const sizeMatch = query.match(/(\d+)\s*mm/i) || query.match(/(\d+)\s*milímetros/i);
    if (sizeMatch) {
      filters.size = `${sizeMatch[1]}mm`;
    }

    // Detectar género
    filters.gender = detectGender(query);

    // Detectar material mejorado
    const materialMap: Record<string, string> = {
      acero: "Acero inoxidable",
      steel: "Acero inoxidable",
      caucho: "Caucho",
      rubber: "Caucho",
      "oro rosa": "Oro rosa",
      "rose gold": "Oro rosa",
      "oro amarillo": "Oro amarillo",
      "yellow gold": "Oro amarillo",
      piel: "Piel",
      leather: "Piel",
      cuero: "Cuero",
      diamante: "Diamantes",
      diamond: "Diamantes",
      titanio: "Titanio",
      titanium: "Titanio",
    };
    
    for (const [key, material] of Object.entries(materialMap)) {
      if (queryLower.includes(key)) {
        filters.material = material;
        break;
      }
    }

    // Detectar movimiento
    const detectedMovement = detectMovement(query);
    if (detectedMovement) {
      filters.movement = detectedMovement
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }

    // Aplicar filtros
    let results = this.filterProducts(productsToSearch, filters, tokens);
    
    // Ordenar por relevancia (productos que coinciden con más tokens primero)
    if (tokens.length > 0) {
      results = results.sort((a, b) => {
        const aText = `${a.name} ${a.description} ${a.brand}`.toLowerCase();
        const bText = `${b.name} ${b.description} ${b.brand}`.toLowerCase();
        
        const aScore = tokens.filter(token => aText.includes(token)).length;
        const bScore = tokens.filter(token => bText.includes(token)).length;
        
        return bScore - aScore;
      });
    }
    
    return results;
  },

  // Filtrar productos con múltiples criterios
  filterProducts: (
    products: Product[],
    filters: SearchFilters,
    searchTokens?: string[]
  ): Product[] => {
    let filtered = [...products];

    // Filtro por marca
    if (filters.brand) {
      filtered = filtered.filter(
        (p) => p.brand.toLowerCase() === filters.brand!.toLowerCase()
      );
    }

    // Filtro por color (buscar en nombre, descripción, subcategoría)
    if (filters.color) {
      const colorLower = filters.color.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(colorLower) ||
          p.description.toLowerCase().includes(colorLower) ||
          p.subcategory.toLowerCase().includes(colorLower)
      );
    }

    // Filtro por tamaño
    if (filters.size) {
      filtered = filtered.filter(
        (p) =>
          p.name.includes(filters.size!) ||
          p.subcategory.includes(filters.size!)
      );
    }

    // Filtro por género
    if (filters.gender) {
      filtered = filtered.filter(
        (p) =>
          p.subcategory.toLowerCase().includes(filters.gender!.toLowerCase()) ||
          p.name.toLowerCase().includes(filters.gender!.toLowerCase())
      );
    }

    // Filtro por material (buscar en especificaciones)
    if (filters.material) {
      const materialLower = filters.material.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.specifications.caja.toLowerCase().includes(materialLower) ||
          p.specifications.correa.toLowerCase().includes(materialLower) ||
          p.name.toLowerCase().includes(materialLower)
      );
    }

    // Filtro por movimiento
    if (filters.movement) {
      const movementLower = filters.movement.toLowerCase();
      filtered = filtered.filter((p) =>
        p.specifications.movimiento.toLowerCase().includes(movementLower)
      );
    }

    // Filtro por precio
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }

    // Búsqueda por tokens si se proporcionan
    if (searchTokens && searchTokens.length > 0) {
      filtered = filtered.filter((product) => {
        const searchableText = `${product.name} ${product.description} ${product.brand} ${product.subcategory}`.toLowerCase();
        return searchTokens.some((token) => searchableText.includes(token));
      });
    }

    return filtered;
  },

  // Construir índice de búsqueda
  buildSearchIndex: (products: Product[]): SearchIndexEntry[] => {
    return products.map((product) => {
      const searchableText = `${product.name} ${product.description} ${product.brand} ${product.subcategory}`;
      const tokens = tokenize(searchableText);

      return {
        productId: product.id,
        brand: product.brand,
        name: product.name,
        description: product.description,
        subcategory: product.subcategory,
        tokens,
        metadata: {
          productId: product.id,
          detectedColor: detectColor(searchableText),
          detectedSize: detectSize(searchableText),
          detectedGender: detectGender(searchableText),
          detectedMaterial: detectMaterial(searchableText),
          detectedMovement: detectMovement(searchableText),
          tags: tokens,
        },
      };
    });
  },
};

