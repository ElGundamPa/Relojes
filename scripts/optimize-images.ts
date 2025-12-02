import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";

interface OptimizationStats {
  originalSize: number;
  optimizedSize: number;
  saved: number;
  percentage: number;
}

const MAX_WIDTH = 1400;
const QUALITY = 85;
const PRODUCTS_DIR = path.join(process.cwd(), "public", "products");

// Estadísticas globales
const stats: {
  total: number;
  processed: number;
  skipped: number;
  errors: number;
  totalOriginalSize: number;
  totalOptimizedSize: number;
} = {
  total: 0,
  processed: 0,
  skipped: 0,
  errors: 0,
  totalOriginalSize: 0,
  totalOptimizedSize: 0,
};

async function optimizeImage(filePath: string): Promise<OptimizationStats | null> {
  try {
    const ext = path.extname(filePath).toLowerCase();
    
    // Solo procesar JPG, JPEG, PNG
    if (![".jpg", ".jpeg", ".png"].includes(ext)) {
      return null;
    }

    const fileStats = fs.statSync(filePath);
    const originalSize = fileStats.size;
    
    // Leer la imagen
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Calcular nuevas dimensiones
    let width = metadata.width || MAX_WIDTH;
    let height = metadata.height;
    
    if (width > MAX_WIDTH) {
      const ratio = MAX_WIDTH / width;
      width = MAX_WIDTH;
      height = Math.round((height || 0) * ratio);
    }
    
    // Generar nombre del archivo WebP
    const dir = path.dirname(filePath);
    const basename = path.basename(filePath, ext);
    const webpPath = path.join(dir, `${basename}.webp`);
    
    // Optimizar y convertir a WebP
    await image
      .resize(width, height, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: QUALITY })
      .toFile(webpPath);
    
    // Obtener tamaño del archivo optimizado
    const optimizedStats = fs.statSync(webpPath);
    const optimizedSize = optimizedStats.size;
    
    // Eliminar archivo original si el WebP es más pequeño
    if (optimizedSize < originalSize) {
      fs.unlinkSync(filePath);
      
      const saved = originalSize - optimizedSize;
      const percentage = ((saved / originalSize) * 100).toFixed(2);
      
      return {
        originalSize,
        optimizedSize,
        saved,
        percentage: parseFloat(percentage),
      };
    } else {
      // Si el WebP no es más pequeño, mantener el original y eliminar el WebP
      fs.unlinkSync(webpPath);
      return null;
    }
  } catch (error) {
    console.error(`Error procesando ${filePath}:`, error);
    stats.errors++;
    return null;
  }
}

async function processDirectory(dirPath: string): Promise<void> {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      // Ignorar directorios especiales
      if (entry.name === "fondo" || entry.name.startsWith(".")) {
        continue;
      }
      await processDirectory(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      
      // Solo procesar imágenes
      if ([".jpg", ".jpeg", ".png"].includes(ext)) {
        stats.total++;
        
        const result = await optimizeImage(fullPath);
        
        if (result) {
          stats.processed++;
          stats.totalOriginalSize += result.originalSize;
          stats.totalOptimizedSize += result.optimizedSize;
          
          const sizeMB = (result.originalSize / 1024 / 1024).toFixed(2);
          const optimizedMB = (result.optimizedSize / 1024 / 1024).toFixed(2);
          const savedMB = (result.saved / 1024 / 1024).toFixed(2);
          
          console.log(
            `✓ ${path.relative(PRODUCTS_DIR, fullPath)}: ${sizeMB}MB → ${optimizedMB}MB (${savedMB}MB ahorrado, ${result.percentage}%)`
          );
        } else {
          stats.skipped++;
        }
      }
    }
  }
}

async function main() {
  console.log("🚀 Iniciando optimización de imágenes...\n");
  console.log(`📁 Directorio: ${PRODUCTS_DIR}\n`);
  console.log(`⚙️  Configuración:`);
  console.log(`   - Ancho máximo: ${MAX_WIDTH}px`);
  console.log(`   - Calidad WebP: ${QUALITY}%`);
  console.log(`   - Formato: WebP\n`);
  
  if (!fs.existsSync(PRODUCTS_DIR)) {
    console.error(`❌ El directorio ${PRODUCTS_DIR} no existe.`);
    process.exit(1);
  }
  
  const startTime = Date.now();
  
  await processDirectory(PRODUCTS_DIR);
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log("\n" + "=".repeat(60));
  console.log("📊 RESUMEN DE OPTIMIZACIÓN");
  console.log("=".repeat(60));
  console.log(`Total de imágenes encontradas: ${stats.total}`);
  console.log(`Imágenes optimizadas: ${stats.processed}`);
  console.log(`Imágenes omitidas: ${stats.skipped}`);
  console.log(`Errores: ${stats.errors}`);
  console.log("");
  
  if (stats.processed > 0) {
    const totalOriginalMB = (stats.totalOriginalSize / 1024 / 1024).toFixed(2);
    const totalOptimizedMB = (stats.totalOptimizedSize / 1024 / 1024).toFixed(2);
    const totalSavedMB = ((stats.totalOriginalSize - stats.totalOptimizedSize) / 1024 / 1024).toFixed(2);
    const totalPercentage = (((stats.totalOriginalSize - stats.totalOptimizedSize) / stats.totalOriginalSize) * 100).toFixed(2);
    
    console.log(`Tamaño original total: ${totalOriginalMB} MB`);
    console.log(`Tamaño optimizado total: ${totalOptimizedMB} MB`);
    console.log(`Espacio ahorrado: ${totalSavedMB} MB (${totalPercentage}%)`);
    console.log("");
  }
  
  console.log(`⏱️  Tiempo total: ${duration}s`);
  console.log("\n✅ Optimización completada!");
}

main().catch((error) => {
  console.error("❌ Error fatal:", error);
  process.exit(1);
});

