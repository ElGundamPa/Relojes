# 🚀 Proyecto Ecommerce Actualizado - Sistema Automático de Productos

## ✨ Nuevas Características

El proyecto ahora incluye un **sistema automático de indexación** que escanea tus carpetas de productos y genera todo el catálogo automáticamente.

## 📋 Pasos para Configurar

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Generar Productos Automáticamente

Ejecuta el script que escanea tus carpetas y genera el archivo de productos:

```bash
npm run generate-products
```

Este script:
- ✅ Escanea todas las carpetas en `/public/products/`
- ✅ Detecta automáticamente marcas y subcategorías
- ✅ Crea un producto por cada imagen JPG encontrada
- ✅ Genera precios, descripciones y especificaciones automáticamente
- ✅ Crea el archivo `/data/products.ts` con todos los productos

### 3. Ejecutar el Proyecto

```bash
npm run dev
```

## 📁 Estructura de Carpetas

Tu estructura actual es perfecta:

```
/public/products/
  ├── Audemars Piguet Dama/
  │   ├── reloj1.jpg
  │   ├── reloj2.jpg
  │   └── ...
  ├── Rolex Datejust 36mm/
  │   ├── reloj1.jpg
  │   └── ...
  └── ...
```

## 🎯 Páginas Disponibles

### Páginas Principales
- `/` - Home con carrusel de marcas
- `/marcas` - Lista de todas las marcas
- `/marcas/[slug]` - Productos de una marca específica
- `/relojes/todos` - Todos los productos
- `/reloj/[slug]` - Página individual de cada reloj

### Otras Páginas
- `/about` - Nosotros
- `/contact` - Contacto
- `/checkout` - Checkout

## 🔄 Actualizar Productos

Cada vez que agregues nuevas imágenes o carpetas:

1. Coloca las imágenes en las carpetas correspondientes
2. Ejecuta: `npm run generate-products`
3. Los productos se actualizarán automáticamente

## 🎨 Características del Sistema

### Detección Automática de Marcas
El sistema detecta automáticamente las marcas conocidas:
- Rolex
- Omega
- Patek Philippe / Petek Philippe
- Audemars Piguet
- Richard Mille
- Bell & Ross
- Montblanc
- Tissot
- Tudor
- Vacheron

### Generación de Precios
Los precios se generan automáticamente según la marca:
- Rolex: €5,000 - €15,000
- Patek Philippe: €20,000 - €50,000
- Richard Mille: €50,000 - €200,000
- Y más...

### URLs Amigables
Cada producto tiene un slug único:
- `/reloj/rolex-datejust-36mm-reloj1`
- `/reloj/omega-hombre-reloj2`

## 🎯 Carrusel de Marcas

El carrusel horizontal aparece en:
- Home page
- Página de marcas
- Páginas individuales de marca

Características:
- Scroll horizontal suave
- Botones de navegación
- Animaciones con Framer Motion
- Totalmente responsive

## 📝 Notas Importantes

1. **Primera Ejecución**: Debes ejecutar `npm run generate-products` antes de iniciar el proyecto
2. **Actualizaciones**: Ejecuta el script cada vez que agregues nuevas imágenes
3. **Nombres de Archivos**: Los nombres de las imágenes se usan para generar los nombres de productos
4. **Formato de Imágenes**: Solo se procesan archivos JPG, JPEG, PNG y WEBP

## 🐛 Solución de Problemas

### No se encuentran productos
- Verifica que las carpetas estén en `/public/products/`
- Asegúrate de que haya imágenes JPG dentro de las carpetas
- Ejecuta `npm run generate-products` nuevamente

### Errores de tipos TypeScript
- Asegúrate de haber ejecutado `npm run generate-products`
- Verifica que `/data/products.ts` exista y tenga contenido

### Imágenes no se muestran
- Verifica que las rutas en `/data/products.ts` sean correctas
- Asegúrate de que las imágenes estén en las carpetas correctas
- Los nombres de archivo deben coincidir exactamente

## 🚀 Próximos Pasos

1. Ejecuta `npm run generate-products` para generar tus productos
2. Revisa `/data/products.ts` para ver los productos generados
3. Inicia el servidor con `npm run dev`
4. Navega a `/marcas` para ver todas tus marcas
5. Explora los productos en `/relojes/todos`

¡Todo está listo para funcionar con tus imágenes reales! 🎉


