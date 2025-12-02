import { Product } from "./products";
import { ProductMetadata } from "./filtersConfig";

export interface SearchIndexEntry {
  productId: string;
  brand: string;
  name: string;
  description: string;
  subcategory: string;
  tokens: string[];
  metadata: ProductMetadata;
}

// Índice de búsqueda generado automáticamente
export const searchIndex: SearchIndexEntry[] = [];

// Función para tokenizar texto
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

// Función para detectar color en texto
export function detectColor(text: string): string | undefined {
  const colors = [
    "negro",
    "blanco",
    "azul",
    "rojo",
    "verde",
    "rosa",
    "dorado",
    "plateado",
    "gris",
    "beige",
  ];
  const lowerText = text.toLowerCase();
  return colors.find((color) => lowerText.includes(color));
}

// Función para detectar tamaño en texto
export function detectSize(text: string): string | undefined {
  const sizeMatch = text.match(/(\d+)mm/i);
  return sizeMatch ? `${sizeMatch[1]}mm` : undefined;
}

// Función para detectar género en texto
export function detectGender(text: string): string | undefined {
  const lowerText = text.toLowerCase();
  if (lowerText.includes("dama") || lowerText.includes("mujer")) return "Dama";
  if (lowerText.includes("hombre") || lowerText.includes("caballero"))
    return "Hombre";
  if (lowerText.includes("unisex")) return "Unisex";
  return undefined;
}

// Función para detectar material en texto
export function detectMaterial(text: string): string | undefined {
  const materials = [
    "acero",
    "oro rosa",
    "oro amarillo",
    "titanio",
    "diamante",
    "caucho",
    "piel",
    "cuero",
  ];
  const lowerText = text.toLowerCase();
  return materials.find((material) => lowerText.includes(material));
}

// Función para detectar movimiento en texto
export function detectMovement(text: string): string | undefined {
  const movements = [
    "automático",
    "quartz",
    "cosc",
    "cronógrafo",
    "mecánico",
  ];
  const lowerText = text.toLowerCase();
  return movements.find((movement) => lowerText.includes(movement));
}


