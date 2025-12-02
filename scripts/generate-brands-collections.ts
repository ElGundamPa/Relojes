import * as fs from "fs";
import * as path from "path";

interface Brand {
  id: string;
  name: string;
  slug: string;
  totalProducts: number;
  logo: string | null;
  description: string;
}

interface Collection {
  id: string;
  brand: string;
  name: string;
  slug: string;
  totalProducts: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getBrandDescription(brandName: string): string {
  const descriptions: Record<string, string> = {
    "Rolex": "Rolex es una marca suiza de relojes de lujo reconocida mundialmente por su precisión, durabilidad y diseño icónico. Fundada en 1905, Rolex ha establecido el estándar en relojería de alta gama.",
    "Omega": "Omega es una marca suiza de relojes de prestigio, conocida por ser el cronómetro oficial de los Juegos Olímpicos y por haber acompañado a los astronautas en la Luna. Sinónimo de precisión y elegancia.",
    "Audemars Piguet": "Audemars Piguet es una manufactura suiza independiente que crea relojes de alta relojería desde 1875. Famosa por su Royal Oak, combina tradición artesanal con innovación técnica.",
    "Patek Philippe": "Patek Philippe es una de las marcas de relojes más prestigiosas del mundo. Fundada en 1839, representa la excelencia en relojería suiza con piezas únicas y complicaciones excepcionales.",
    "Richard Mille": "Richard Mille es una marca francesa de relojes de ultra lujo conocida por sus materiales innovadores y diseños futuristas. Cada pieza es una obra maestra de ingeniería y diseño.",
    "Bell & Ross": "Bell & Ross es una marca franco-suiza especializada en relojes de aviación. Sus diseños inspirados en instrumentos de vuelo combinan funcionalidad y estética militar.",
    "Montblanc": "Montblanc es una marca alemana de lujo que combina artesanía tradicional con diseño contemporáneo. Sus relojes reflejan la excelencia y el refinamiento de la marca.",
    "Tissot": "Tissot es una marca suiza de relojes que combina tradición relojera con innovación tecnológica. Ofrece calidad suiza a precios accesibles desde 1853.",
    "Tudor": "Tudor es una marca suiza de relojes de lujo, hermana de Rolex. Ofrece calidad excepcional con un diseño distintivo y robustez probada en condiciones extremas.",
    "Vacheron": "Vacheron Constantin es una de las marcas de relojes más antiguas del mundo, fundada en 1755. Representa la excelencia en relojería suiza con complicaciones excepcionales.",
  };

  return descriptions[brandName] || `${brandName} es una marca de relojes de lujo reconocida por su calidad, precisión y diseño excepcional.`;
}

function extractBrand(folderName: string): string {
  // Normalizar "Petek Philippe" a "Patek Philippe"
  const normalized = folderName.replace("Petek Philippe", "Patek Philippe");

  const commonBrands = [
    "Rolex",
    "Omega",
    "Audemars Piguet",
    "Patek Philippe",
    "Richard Mille",
    "Bell & Ross",
    "Montblanc",
    "Tissot",
    "Tudor",
    "Vacheron",
  ];

  // Buscar la marca en el nombre de la carpeta
  for (const brand of commonBrands) {
    if (normalized.includes(brand)) {
      return brand;
    }
  }

  // Si no se encuentra, usar la primera palabra o parte hasta números
  const parts = normalized.split(" ");
  if (parts.length > 0) {
    // Tomar la primera parte que no contenga números
    for (const part of parts) {
      if (!/\d/.test(part)) {
        return part;
      }
    }
    return parts[0];
  }

  return normalized;
}

function extractCollection(folderName: string, brand: string): string {
  // Remover la marca del nombre de la carpeta para obtener la colección
  let collection = folderName.replace(brand, "").trim();
  
  // Si queda vacío o solo espacios, usar "General"
  if (!collection || collection.length === 0) {
    return "General";
  }

  return collection;
}

function scanBrandsAndCollections(): {
  brands: Brand[];
  collections: Collection[];
} {
  const productsDir = path.join(process.cwd(), "public", "products");
  const brandsMap = new Map<string, { name: string; totalProducts: number }>();
  const collectionsMap = new Map<string, Collection>();

  if (!fs.existsSync(productsDir)) {
    console.warn("⚠️  La carpeta /public/products/ no existe.");
    return { brands: [], collections: [] };
  }

  const folders = fs.readdirSync(productsDir, { withFileTypes: true });

  for (const folder of folders) {
    if (!folder.isDirectory()) continue;

    const folderName = folder.name;
    const brandName = extractBrand(folderName);
    const collectionName = extractCollection(folderName, brandName);

    // Contar productos en esta carpeta
    const folderPath = path.join(productsDir, folderName);
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter(
      (file) =>
        /\.(jpg|jpeg|png|webp)$/i.test(file) && !file.startsWith(".")
    );

    const productCount = imageFiles.length;

    // Agregar/actualizar marca
    if (!brandsMap.has(brandName)) {
      brandsMap.set(brandName, {
        name: brandName,
        totalProducts: 0,
      });
    }
    const brandData = brandsMap.get(brandName)!;
    brandData.totalProducts += productCount;

    // Agregar/actualizar colección
    const collectionKey = `${brandName}-${collectionName}`;
    if (!collectionsMap.has(collectionKey)) {
      collectionsMap.set(collectionKey, {
        id: slugify(`${brandName}-${collectionName}`),
        brand: brandName,
        name: collectionName,
        slug: slugify(collectionName),
        totalProducts: 0,
      });
    }
    const collection = collectionsMap.get(collectionKey)!;
    collection.totalProducts += productCount;
  }

  // Convertir a arrays
  const brands: Brand[] = Array.from(brandsMap.entries()).map(
    ([name, data]) => {
      const brandSlug = slugify(name);
      const logoPath = path.join(process.cwd(), "public", "brands", brandSlug, "logo.png");
      const logoExists = fs.existsSync(logoPath);
      
      return {
        id: brandSlug,
        name: data.name,
        slug: brandSlug,
        totalProducts: data.totalProducts,
        logo: logoExists ? `/brands/${brandSlug}/logo.png` : null,
        description: getBrandDescription(data.name),
      };
    }
  );

  const collections: Collection[] = Array.from(collectionsMap.values());

  return { brands, collections };
}

function generateBrandsFile() {
  console.log("🔍 Escaneando marcas y colecciones...");

  const { brands, collections } = scanBrandsAndCollections();

  // Generar brands.ts
  const brandsContent = `import { Brand } from "./products";

export interface BrandData extends Brand {
  description?: string;
  logo?: string | null;
  collections?: Collection[];
  active?: boolean;
  totalProducts?: number;
}

export interface Collection {
  id: string;
  brand: string;
  name: string;
  slug: string;
  totalProducts: number;
  description?: string;
  image?: string;
  subCollections?: SubCollection[];
  active?: boolean;
}

export interface SubCollection {
  id: string;
  name: string;
  slug: string;
  collectionId: string;
  description?: string;
  active?: boolean;
}

// Se genera automáticamente desde /public/products/
export const brandsData: BrandData[] = ${JSON.stringify(
    brands.map((b) => ({
      name: b.name,
      slug: b.slug,
      image: "",
      count: b.totalProducts,
      description: b.description,
      logo: b.logo,
      active: true,
      totalProducts: b.totalProducts,
    })),
    null,
    2
  )};
`;

  const brandsPath = path.join(process.cwd(), "data", "brands.ts");
  fs.writeFileSync(brandsPath, brandsContent, "utf-8");

  // Generar collections.ts
  const collectionsContent = `import { Collection } from "./brands";

// Se genera automáticamente desde /public/products/
export const collections: Collection[] = ${JSON.stringify(
    collections,
    null,
    2
  )};

export const subCollections: SubCollection[] = [];
`;

  const collectionsPath = path.join(process.cwd(), "data", "collections.ts");
  fs.writeFileSync(collectionsPath, collectionsContent, "utf-8");

  console.log(`✅ Archivo generado: ${brandsPath}`);
  console.log(`✅ Archivo generado: ${collectionsPath}`);
  console.log(`📊 Resumen:`);
  console.log(`   - Marcas: ${brands.length}`);
  console.log(`   - Colecciones: ${collections.length}`);
  brands.forEach((brand) => {
    console.log(`   - ${brand.name}: ${brand.totalProducts} productos`);
  });
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generateBrandsFile();
}

export { generateBrandsFile, scanBrandsAndCollections };


