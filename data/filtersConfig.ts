export interface FilterConfig {
  sizes: string[];
  colors: string[];
  genders: string[];
  materials: string[];
  movements: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

export const filterConfig: FilterConfig = {
  sizes: ["28mm", "31mm", "36mm", "40mm", "41mm", "42mm", "44mm"],
  colors: [
    "Negro",
    "Blanco",
    "Azul",
    "Rojo",
    "Verde",
    "Rosa",
    "Dorado",
    "Plateado",
    "Gris",
    "Beige",
  ],
  genders: ["Hombre", "Dama", "Unisex"],
  materials: [
    "Acero inoxidable",
    "Oro rosa",
    "Oro amarillo",
    "Titanio",
    "Diamantes",
    "Caucho",
    "Piel",
    "Cuero",
  ],
  movements: [
    "Automático",
    "Quartz",
    "COSC",
    "Cronógrafo",
    "Mecánico manual",
  ],
  priceRange: {
    min: 0,
    max: 200000,
  },
};

export interface ProductMetadata {
  productId: string;
  detectedColor?: string;
  detectedSize?: string;
  detectedGender?: string;
  detectedMaterial?: string;
  detectedMovement?: string;
  tags: string[];
}


