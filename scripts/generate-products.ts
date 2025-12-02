import * as fs from "fs";
import * as path from "path";

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  subcategory: string;
  image: string;
  images: string[];
  price: number;
  description: string;
  longDescription: string;
  specifications: {
    marca: string;
    modelo: string;
    movimiento: string;
    caja: string;
    esfera: string;
    correa: string;
    resistencia: string;
  };
}

interface Brand {
  name: string;
  slug: string;
  image: string;
  count: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseCategory(folderName: string): { brand: string; subcategory: string } {
  // Extraer marca y subcategoría del nombre de la carpeta
  // Ejemplos:
  // "Rolex Datejust 36mm" -> brand: "Rolex", subcategory: "Datejust 36mm"
  // "Omega Hombre" -> brand: "Omega", subcategory: "Hombre"
  // "Bell & Ross" -> brand: "Bell & Ross", subcategory: "General"

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

  let brand = "";
  let subcategory = "";

  // Normalizar "Petek Philippe" a "Patek Philippe"
  const normalizedFolderName = folderName.replace("Petek Philippe", "Patek Philippe");

  // Buscar la marca en el nombre de la carpeta
  for (const commonBrand of commonBrands) {
    if (normalizedFolderName.includes(commonBrand)) {
      brand = commonBrand;
      subcategory = normalizedFolderName.replace(commonBrand, "").trim() || "General";
      break;
    }
  }

  // Si no se encontró marca conocida, usar todo como marca
  if (!brand) {
    const parts = folderName.split(" ");
    brand = parts[0];
    subcategory = parts.slice(1).join(" ") || "General";
  }

  return { brand, subcategory };
}

function generatePrice(brand: string): number {
  // Generar precios basados en la marca (placeholder)
  const priceRanges: Record<string, { min: number; max: number }> = {
    Rolex: { min: 5000, max: 15000 },
    "Patek Philippe": { min: 20000, max: 50000 },
    "Audemars Piguet": { min: 15000, max: 40000 },
    "Richard Mille": { min: 50000, max: 200000 },
    Omega: { min: 3000, max: 10000 },
    "Bell & Ross": { min: 3000, max: 8000 },
    Montblanc: { min: 2000, max: 6000 },
    Tissot: { min: 500, max: 2000 },
    Tudor: { min: 2000, max: 6000 },
    Vacheron: { min: 15000, max: 40000 },
  };

  const range = priceRanges[brand] || { min: 1000, max: 5000 };
  const price = Math.floor(Math.random() * (range.max - range.min) + range.min);
  // Redondear a múltiplos de 50
  return Math.round(price / 50) * 50;
}

function generateDescription(name: string, brand: string, subcategory: string): string {
  return `Reloj ${brand} ${subcategory !== "General" ? subcategory : ""} de lujo. ${name} representa la excelencia en relojería con diseño atemporal y precisión suiza.`;
}

function generateLongDescription(name: string, brand: string, subcategory: string): string {
  return `El ${name} de ${brand} es una pieza excepcional que combina artesanía tradicional con innovación moderna. ${subcategory !== "General" ? `Pertenece a la colección ${subcategory}, ` : ""}caracterizada por su elegancia y precisión. Cada detalle ha sido cuidadosamente diseñado para ofrecer una experiencia única de relojería de lujo.`;
}

function generateSpecifications(brand: string, name: string) {
  const movements = [
    "Automático suizo",
    "Quartz de precisión",
    "Automático certificado COSC",
    "Movimiento mecánico manual",
  ];
  const cases = [
    "Acero inoxidable 316L",
    "Oro rosa 18K",
    "Titanio grado 5",
    "Acero inoxidable pulido",
  ];
  const dials = [
    "Zafiro antirreflejos",
    "Cristal mineral",
    "Zafiro con revestimiento antirreflejos",
  ];
  const straps = [
    "Cuero italiano genuino",
    "Acero inoxidable",
    "Caucho vulcanizado",
    "Cocodrilo genuino",
  ];

  return {
    marca: brand,
    modelo: name,
    movimiento: movements[Math.floor(Math.random() * movements.length)],
    caja: cases[Math.floor(Math.random() * cases.length)],
    esfera: dials[Math.floor(Math.random() * dials.length)],
    correa: straps[Math.floor(Math.random() * straps.length)],
    resistencia: `${Math.floor(Math.random() * 30) + 3} ATM (${(Math.floor(Math.random() * 30) + 3) * 10}m)`,
  };
}

function scanProducts(): { products: Product[]; brands: Brand[] } {
  const productsDir = path.join(process.cwd(), "public", "products");
  const products: Product[] = [];
  const brandsMap = new Map<string, { image: string; count: number }>();

  if (!fs.existsSync(productsDir)) {
    console.warn("⚠️  La carpeta /public/products/ no existe. Creando estructura...");
    fs.mkdirSync(productsDir, { recursive: true });
    return { products, brands: [] };
  }

  const folders = fs.readdirSync(productsDir, { withFileTypes: true });

  for (const folder of folders) {
    if (!folder.isDirectory()) continue;

    const folderName = folder.name;
    const { brand, subcategory } = parseCategory(folderName);
    const folderPath = path.join(productsDir, folderName);

    // Leer imágenes en la carpeta
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter(
      (file) =>
        /\.(jpg|jpeg|png|webp)$/i.test(file) &&
        !file.startsWith(".")
    );

    if (imageFiles.length === 0) {
      console.warn(`⚠️  No se encontraron imágenes en: ${folderName}`);
      continue;
    }

    // Usar la primera imagen como thumbnail de la marca
    if (!brandsMap.has(brand)) {
      brandsMap.set(brand, {
        image: `/products/${encodeURIComponent(folderName)}/${encodeURIComponent(imageFiles[0])}`,
        count: 0,
      });
    }

    // Crear un producto por cada imagen
    for (const imageFile of imageFiles) {
      const imageName = path.parse(imageFile).name;
      const productSlug = slugify(`${brand}-${subcategory}-${imageName}`);
      const productId = productSlug;

      const product: Product = {
        id: productId,
        name: `${brand} ${subcategory} ${imageName}`.trim(),
        slug: productSlug,
        brand,
        category: brand,
        subcategory,
        image: `/products/${encodeURIComponent(folderName)}/${encodeURIComponent(imageFile)}`,
        images: [
          `/products/${encodeURIComponent(folderName)}/${encodeURIComponent(imageFile)}`,
        ],
        price: generatePrice(brand),
        description: generateDescription(imageName, brand, subcategory),
        longDescription: generateLongDescription(imageName, brand, subcategory),
        specifications: generateSpecifications(brand, imageName),
      };

      products.push(product);
      const brandData = brandsMap.get(brand)!;
      brandData.count++;
    }
  }

  // Convertir brandsMap a array
  const brands: Brand[] = Array.from(brandsMap.entries()).map(([name, data]) => ({
    name,
    slug: slugify(name),
    image: data.image,
    count: data.count,
  }));

  return { products, brands };
}

function generateProductsFile() {
  console.log("🔍 Escaneando carpetas de productos...");

  const { products, brands } = scanProducts();

  if (products.length === 0) {
    console.warn("⚠️  No se encontraron productos. Asegúrate de tener imágenes en /public/products/");
  } else {
    console.log(`✅ Encontrados ${products.length} productos de ${brands.length} marcas`);
  }

  const productsContent = `// Este archivo se genera automáticamente. No editar manualmente.
// Ejecuta: npm run generate-products

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  subcategory: string;
  image: string;
  images: string[];
  price: number;
  description: string;
  longDescription: string;
  specifications: {
    marca: string;
    modelo: string;
    movimiento: string;
    caja: string;
    esfera: string;
    correa: string;
    resistencia: string;
  };
}

export interface Brand {
  name: string;
  slug: string;
  image: string;
  count: number;
}

export const products: Product[] = ${JSON.stringify(products, null, 2)};

export const brands: Brand[] = ${JSON.stringify(brands, null, 2)};

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductsByBrand(brandName: string): Product[] {
  return products.filter((product) => product.brand === brandName);
}

export function getProductsBySubcategory(subcategory: string): Product[] {
  return products.filter((product) => product.subcategory === subcategory);
}

export function getRelatedProducts(currentProductId: string, limit: number = 3): Product[] {
  const currentProduct = getProductById(currentProductId);
  if (!currentProduct) return [];
  
  return products
    .filter((product) => product.id !== currentProductId && product.subcategory === currentProduct.subcategory)
    .slice(0, limit);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
`;

  const outputPath = path.join(process.cwd(), "data", "products.ts");
  fs.writeFileSync(outputPath, productsContent, "utf-8");

  // Generar brands.ts
  const brandsData = brands.map((brand) => ({
    name: brand.name,
    slug: brand.slug,
    image: brand.image,
    count: brand.count,
    description: "",
    logo: brand.image,
    active: true,
    collections: [],
  }));

  const brandsContent = `import { Brand } from "./products";

export interface BrandData extends Brand {
  description?: string;
  logo?: string;
  collections?: Collection[];
  active?: boolean;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  brandId: string;
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

// Se genera automáticamente desde products.ts
export const brandsData: BrandData[] = ${JSON.stringify(brandsData, null, 2)};
`;

  const brandsPath = path.join(process.cwd(), "data", "brands.ts");
  fs.writeFileSync(brandsPath, brandsContent, "utf-8");

  // Generar searchIndex.ts
  // Funciones de detección (duplicadas del searchIndex.ts para uso en el script)
  function tokenizeSearch(text: string): string[] {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split(/\s+/)
      .filter((token) => token.length > 2);
  }

  function detectColorSearch(text: string): string | undefined {
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

  function detectSizeSearch(text: string): string | undefined {
    const sizeMatch = text.match(/(\d+)mm/i);
    return sizeMatch ? `${sizeMatch[1]}mm` : undefined;
  }

  function detectGenderSearch(text: string): string | undefined {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("dama") || lowerText.includes("mujer")) return "Dama";
    if (lowerText.includes("hombre") || lowerText.includes("caballero"))
      return "Hombre";
    if (lowerText.includes("unisex")) return "Unisex";
    return undefined;
  }

  function detectMaterialSearch(text: string): string | undefined {
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

  function detectMovementSearch(text: string): string | undefined {
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

  const searchIndex = products.map((product) => {
    const searchableText = `${product.name} ${product.description} ${product.brand} ${product.subcategory}`;
    const tokens = tokenizeSearch(searchableText);

    return {
      productId: product.id,
      brand: product.brand,
      name: product.name,
      description: product.description,
      subcategory: product.subcategory,
      tokens,
      metadata: {
        productId: product.id,
        detectedColor: detectColorSearch(searchableText),
        detectedSize: detectSizeSearch(searchableText),
        detectedGender: detectGenderSearch(searchableText),
        detectedMaterial: detectMaterialSearch(searchableText),
        detectedMovement: detectMovementSearch(searchableText),
        tags: tokens,
      },
    };
  });

  const searchIndexContent = `import { ProductMetadata } from "./filtersConfig";

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
export const searchIndex: SearchIndexEntry[] = ${JSON.stringify(searchIndex, null, 2)};
`;

  const searchIndexPath = path.join(process.cwd(), "data", "searchIndex.ts");
  fs.writeFileSync(searchIndexPath, searchIndexContent, "utf-8");

  console.log(`✅ Archivo generado: ${outputPath}`);
  console.log(`✅ Archivo generado: ${brandsPath}`);
  console.log(`✅ Archivo generado: ${searchIndexPath}`);
  console.log(`📊 Resumen:`);
  console.log(`   - Productos: ${products.length}`);
  console.log(`   - Marcas: ${brands.length}`);
  brands.forEach((brand) => {
    console.log(`   - ${brand.name}: ${brand.count} productos`);
  });
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generateProductsFile();
}

export { generateProductsFile, scanProducts };

