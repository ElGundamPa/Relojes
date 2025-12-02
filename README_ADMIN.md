# Panel Administrativo - Relojes de Lujo

## 🚀 Inicio Rápido

### Acceso al Panel

1. Inicia el servidor de desarrollo:
```bash
npm run dev
```

2. Accede al panel administrativo:
```
http://localhost:3000/admin/login
```

3. Credenciales por defecto:
- **Email:** `admin@relojes.com`
- **Contraseña:** `admin123`

## 📋 Características

### ✅ Panel Administrativo Completo

- **Dashboard:** Vista general con estadísticas y productos recientes
- **Productos:** CRUD completo de productos
- **Marcas:** Gestión de marcas y logos
- **Colecciones:** Organización por colecciones y sub-colecciones
- **Órdenes:** Sistema de órdenes (placeholder)
- **Configuración:** Ajustes generales de la tienda

### ✅ CRUD de Productos

- Crear, editar y eliminar productos
- Editar nombre, marca, categoría, precio, descripción
- Gestionar especificaciones técnicas
- Cambiar imágenes
- Activar/desactivar productos

### ✅ Gestión de Marcas

- Crear y editar marcas
- Subir logos
- Gestionar colecciones por marca
- Ver estadísticas de productos por marca

### ✅ Búsqueda Inteligente con IA

La búsqueda entiende lenguaje natural:

- `"rolex azul 36mm"` → Filtra por marca, color y tamaño
- `"patek rojo dama"` → Filtra por marca, color y género
- `"malla caucho azul"` → Filtra por material y color
- `"reloj automático mujer"` → Filtra por movimiento y género

**Ruta API:** `/api/search?q=consulta`

### ✅ Filtros Profesionales

En la página `/relojes/todos` encontrarás filtros avanzados:

- **Por Marca:** Lista de checkboxes
- **Por Género:** Hombre, Dama, Unisex
- **Por Tamaño:** 28mm, 31mm, 36mm, 40mm, 41mm, etc.
- **Por Color:** Detección automática
- **Por Precio:** Range slider
- **Por Material:** Acero, Oro, Diamantes, Caucho, Piel, etc.
- **Por Movimiento:** Automático, Quartz, COSC, Cronógrafo

Los filtros se combinan entre sí para búsquedas precisas.

## 🔧 Estructura de Datos

### Archivos Generados Automáticamente

- `/data/products.ts` - Productos y marcas
- `/data/brands.ts` - Datos extendidos de marcas
- `/data/collections.ts` - Colecciones y sub-colecciones
- `/data/searchIndex.ts` - Índice de búsqueda
- `/data/filtersConfig.ts` - Configuración de filtros

### Regenerar Datos

Para regenerar todos los archivos de datos desde las imágenes:

```bash
npm run generate-products
```

Este comando:
1. Escanea `/public/products/`
2. Genera productos automáticamente
3. Crea marcas desde las carpetas
4. Construye el índice de búsqueda
5. Actualiza `brands.ts` y `searchIndex.ts`

## 📁 Estructura de Carpetas

```
/public/products/
├── Rolex Datejust 36mm/
│   ├── reloj1.jpg
│   ├── reloj2.jpg
│   └── ...
├── Omega Hombre/
│   └── ...
└── ...
```

Cada carpeta representa una marca/subcategoría, y cada imagen dentro es un producto.

## 🔐 Autenticación

El sistema usa autenticación mock local. En producción, deberías:

1. Implementar JWT o sesiones seguras
2. Conectar con una base de datos
3. Agregar roles y permisos
4. Implementar rate limiting

## 🎨 UI/UX

El panel administrativo mantiene el estilo premium y minimalista:

- Sidebar fijo tipo Shopify
- Navbar superior con búsqueda
- Cards con sombras premium
- Animaciones suaves con Framer Motion
- Diseño responsive

## 📝 Notas Importantes

1. **Servicios:** Los servicios del servidor (`productsService`, `brandsService`) solo funcionan en el servidor. Los componentes cliente usan `productsServiceClient` y `brandsServiceClient` que llaman a las API routes.

2. **Persistencia:** Los cambios se guardan directamente en los archivos TypeScript. En producción, deberías usar una base de datos.

3. **Subida de Imágenes:** Actualmente se usa URLs. Para subida real de archivos, necesitarías:
   - API route para manejar `multipart/form-data`
   - Almacenamiento (local o cloud)
   - Validación de tipos de archivo

4. **Compatibilidad:** El sistema es compatible con el ecommerce existente. No rompe ninguna funcionalidad actual.

## 🚧 Próximas Mejoras

- [ ] Subida real de imágenes
- [ ] Sistema de órdenes completo
- [ ] Dashboard con gráficas (Recharts)
- [ ] Exportación de datos
- [ ] Importación masiva
- [ ] Sistema de notificaciones
- [ ] Logs de actividad


