# Instrucciones para Agregar tus Imágenes

## 📸 Cómo reemplazar las imágenes de placeholder

### Paso 1: Preparar tus imágenes

1. Asegúrate de que tus imágenes estén en formato **JPG** o **PNG**
2. Recomendado: imágenes con relación de aspecto **1:1** (cuadradas) para mejor visualización
3. Tamaño recomendado: mínimo **800x800px**, ideal **1200x1200px** o superior
4. Nombra tus archivos de forma descriptiva, por ejemplo:
   - `reloj-chronograph-elite.jpg`
   - `reloj-heritage-classic.jpg`
   - `reloj-diver-professional.jpg`

### Paso 2: Colocar las imágenes

1. Copia tus imágenes JPG a la carpeta: `/public/products/`
2. Puedes organizarlas como prefieras, por ejemplo:
   ```
   /public/products/
     ├── reloj1.jpg
     ├── reloj2.jpg
     ├── reloj3.jpg
     └── ...
   ```

### Paso 3: Actualizar los datos de productos

1. Abre el archivo `/data/products.ts`
2. Para cada producto, actualiza las rutas de las imágenes:

```typescript
{
  id: "1",
  name: "Chronograph Elite",
  // ... otros campos ...
  image: "/products/reloj-chronograph-elite.jpg",  // ← Cambia esto
  images: [
    "/products/reloj-chronograph-elite-1.jpg",     // ← Cambia esto
    "/products/reloj-chronograph-elite-2.jpg",     // ← Cambia esto
    "/products/reloj-chronograph-elite-3.jpg",     // ← Cambia esto
  ],
  // ...
}
```

### Paso 4: Múltiples imágenes por producto

Si tienes varias imágenes del mismo producto (diferentes ángulos, detalles, etc.):

1. Nombra las imágenes de forma consistente:
   - `reloj1-principal.jpg` (imagen principal)
   - `reloj1-lateral.jpg`
   - `reloj1-detalle.jpg`
   - `reloj1-caja.jpg`

2. Actualiza el array `images` en `/data/products.ts`:

```typescript
images: [
  "/products/reloj1-principal.jpg",
  "/products/reloj1-lateral.jpg",
  "/products/reloj1-detalle.jpg",
  "/products/reloj1-caja.jpg",
]
```

### Paso 5: Verificar

1. Ejecuta el servidor de desarrollo: `npm run dev`
2. Navega a la página de productos
3. Verifica que las imágenes se muestren correctamente
4. Revisa la galería de cada producto individual

## 🎨 Consejos para mejores resultados

- **Fondo**: Si tus imágenes tienen fondo beige (como mencionaste), se verán perfectas con el diseño minimalista
- **Calidad**: Usa imágenes de alta calidad para una experiencia premium
- **Consistencia**: Mantén un estilo visual consistente entre todas las imágenes
- **Optimización**: Next.js optimiza automáticamente las imágenes, pero puedes comprimirlas antes si son muy grandes

## ⚠️ Nota importante

Si una imagen no se encuentra, verás un placeholder. Asegúrate de que:
- Las rutas en `/data/products.ts` coincidan exactamente con los nombres de archivo
- Los archivos estén en `/public/products/`
- Los nombres de archivo sean exactos (incluyendo mayúsculas/minúsculas)

## 🔄 Actualizar productos existentes

Para cambiar la imagen de un producto existente:

1. Reemplaza el archivo en `/public/products/` con el mismo nombre, O
2. Actualiza la ruta en `/data/products.ts` y agrega la nueva imagen

¡Listo! Tus imágenes se mostrarán automáticamente en toda la aplicación.


