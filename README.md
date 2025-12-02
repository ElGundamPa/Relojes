# Relojes - Ecommerce de Lujo

Un ecommerce moderno, minimalista y elegante para una tienda de relojes de lujo, construido con Next.js 14, TailwindCSS, Framer Motion y shadcn/ui.

## 🆕 Sistema Automático de Productos

El proyecto ahora incluye un **sistema automático de indexación** que escanea tus carpetas de productos y genera todo el catálogo automáticamente. Solo necesitas colocar tus imágenes JPG en las carpetas correspondientes y ejecutar el script de generación.

## 🚀 Características

- **Diseño Premium**: Estilo Apple/Rolex con mucho espacio en blanco y tipografía elegante
- **Totalmente Responsive**: Optimizado para todos los dispositivos
- **Dark/Light Mode**: Tema claro y oscuro con transiciones suaves
- **Carrito de Compras**: Sistema completo con Zustand y persistencia local
- **Animaciones Suaves**: Framer Motion para transiciones elegantes
- **SEO Optimizado**: Metadata y estructura optimizada para buscadores
- **Galería de Productos**: Con zoom y navegación entre imágenes
- **Checkout Completo**: Formulario con validaciones
- **Sistema de Autenticación**: Login y registro de usuarios
- **Panel de Usuario**: Perfil, pedidos y gestión personal
- **Panel Administrativo**: Gestión completa de productos, órdenes y configuración

## 👤 Funcionalidades para Usuarios

### 🔐 Autenticación y Cuenta
- **Registro de Usuario**: Crear cuenta con email y contraseña
- **Inicio de Sesión**: Acceso seguro al sistema
- **Cerrar Sesión**: Salir de la cuenta de forma segura
- **Gestión de Perfil**: Actualizar información personal (nombre, email, teléfono)

### 🛍️ Navegación y Búsqueda
- **Página de Inicio**: Hero section con carrusel de marcas destacadas
- **Catálogo de Marcas**: Ver todas las marcas disponibles (Rolex, Omega, Patek Philippe, etc.)
- **Productos por Marca**: Explorar productos filtrados por marca específica
- **Todos los Productos**: Vista completa del catálogo con paginación
- **Búsqueda Inteligente**: Búsqueda con lenguaje natural que entiende consultas como:
  - `"rolex azul 36mm"` → Filtra por marca, color y tamaño
  - `"patek rojo dama"` → Filtra por marca, color y género
  - `"malla caucho azul"` → Filtra por material y color
  - `"reloj automático mujer"` → Filtra por movimiento y género
- **Filtros Avanzados**: Sistema de filtros múltiples:
  - Por Marca (checkboxes)
  - Por Género (Hombre, Dama, Unisex)
  - Por Tamaño (28mm, 31mm, 36mm, 40mm, 41mm, etc.)
  - Por Color (detección automática)
  - Por Precio (range slider)
  - Por Material (Acero, Oro, Diamantes, Caucho, Piel, etc.)
  - Por Movimiento (Automático, Quartz, COSC, Cronógrafo)

### 🎨 Visualización de Productos
- **Página de Producto Individual**: Vista detallada con:
  - Galería de imágenes con zoom
  - Especificaciones técnicas completas
  - Descripción detallada
  - Precio y disponibilidad
  - Botón de agregar al carrito
- **Galería de Imágenes**: Navegación entre múltiples imágenes del producto
- **Zoom de Imágenes**: Vista ampliada de las imágenes del producto
- **Colecciones**: Navegación por colecciones temáticas:
  - Relojes Hombre
  - Relojes Mujer
  - Colecciones por marca (Rolex, Omega, etc.)

### 🛒 Carrito de Compras
- **Agregar Productos**: Añadir productos al carrito desde cualquier página
- **Ver Carrito**: Acceso rápido desde el navbar
- **Gestionar Cantidades**: Aumentar o disminuir cantidad de productos
- **Eliminar Productos**: Remover productos del carrito
- **Vaciar Carrito**: Limpiar todo el carrito de una vez
- **Persistencia**: El carrito se guarda en localStorage
- **Resumen de Compra**: Ver subtotal, envío y total antes de comprar

### 💳 Proceso de Compra
- **Checkout Completo**: Formulario de compra con:
  - Información de contacto (email, nombre, teléfono)
  - Dirección de envío (dirección, ciudad, código postal, país)
  - Métodos de pago (Stripe, PayPal)
  - Validación de formularios
- **Métodos de Pago**:
  - Stripe (tarjetas de crédito/débito)
  - PayPal
- **Confirmación de Pedido**: Página de éxito después de la compra
- **Números de Seguimiento**: Cada pedido tiene un ID único

### 👤 Panel de Usuario (Perfil)
- **Mi Perfil**: 
  - Ver y editar información personal
  - Actualizar nombre, email y teléfono
  - Guardar cambios
- **Mis Pedidos**:
  - Ver historial completo de pedidos
  - Ver detalles de cada pedido
  - Seguimiento de estado del pedido (Pendiente, Procesando, Enviado, Entregado, Cancelado)
  - Barra de progreso visual del estado
  - Ver productos de cada pedido con imágenes
  - Ver totales y fechas
- **Mi Carrito**:
  - Ver productos guardados en el carrito
  - Gestionar cantidades
  - Eliminar productos
  - Ir al checkout
- **Seguridad**:
  - Cambiar contraseña
  - Gestionar preferencias de seguridad

### ❤️ Favoritos
- **Lista de Favoritos**: Guardar productos favoritos para verlos después
- **Acceso Rápido**: Página dedicada para ver todos los favoritos

### 📞 Soporte y Ayuda
- **Página de Contacto**: Formulario para contactar con el soporte
- **FAQ**: Preguntas frecuentes y respuestas
- **Sobre Nosotros**: Información de la tienda

## 🔧 Funcionalidades para Administradores

### 🔐 Acceso al Panel
- **Login Administrativo**: Acceso seguro al panel en `/admin/login`
- **Autenticación**: Sistema de autenticación con tokens
- **Roles y Permisos**: Sistema de roles (admin, editor, viewer) con permisos específicos
- **Credenciales por Defecto**:
  - Email: `admin@relojes.com`
  - Contraseña: `admin123`

### 📊 Dashboard
- **Vista General**: Estadísticas principales del negocio
- **Métricas Clave**:
  - Total de productos
  - Total de marcas
  - Total de órdenes
  - Productos recientes
- **Productos Recientes**: Lista de productos agregados recientemente
- **Gráficas y Estadísticas**: Visualización de datos del negocio

### 📦 Gestión de Productos (CRUD Completo)
- **Listar Productos**: Ver todos los productos con búsqueda y filtros
- **Crear Producto**: 
  - Nombre y slug
  - Marca y categoría
  - Precio y descripción
  - Especificaciones técnicas (marca, modelo, movimiento, caja, esfera, correa, resistencia)
  - Subir imagen principal
  - Subir galería de imágenes
  - Activar/desactivar producto
- **Editar Producto**: Modificar cualquier campo del producto
- **Eliminar Producto**: Remover productos del catálogo
- **Búsqueda de Productos**: Buscar por nombre o marca
- **Vista Previa**: Ver cómo se verá el producto antes de guardar

### 🏷️ Gestión de Marcas
- **Listar Marcas**: Ver todas las marcas disponibles
- **Crear Marca**: 
  - Nombre de la marca
  - Slug único
  - Descripción
  - Subir logo de la marca
- **Editar Marca**: Modificar información y logo
- **Eliminar Marca**: Remover marcas del sistema
- **Estadísticas**: Ver cantidad de productos por marca

### 📁 Gestión de Colecciones
- **Listar Colecciones**: Ver todas las colecciones organizadas
- **Crear Colección**: 
  - Nombre de la colección
  - Descripción
  - Asignar productos
- **Editar Colección**: Modificar colecciones existentes
- **Organización**: Gestionar sub-colecciones y categorías

### 🛒 Gestión de Órdenes
- **Listar Órdenes**: Ver todas las órdenes con filtros y búsqueda
- **Ver Detalle de Orden**: 
  - Información del cliente
  - Productos incluidos
  - Cantidades y precios
  - Dirección de envío
  - Estado del pedido
- **Actualizar Estado**: Cambiar el estado de las órdenes:
  - Pendiente
  - Pagada
  - Enviada
  - Completada
  - Cancelada
- **Filtros**: Filtrar órdenes por estado
- **Búsqueda**: Buscar órdenes por ID o cliente
- **Exportar**: Descargar información de órdenes

### 📧 Mensajes de Contacto
- **Listar Mensajes**: Ver todos los mensajes recibidos del formulario de contacto
- **Ver Detalle**: Leer mensajes completos
- **Responder**: Gestionar respuestas a clientes
- **Marcar como Leído**: Organizar mensajes

### ⚙️ Configuración
- **Ajustes Generales**: Configuración de la tienda
- **Gestión de Usuarios**: Administrar usuarios del sistema
- **Permisos**: Configurar roles y permisos
- **Preferencias**: Ajustes del panel administrativo

### 🖼️ Gestión de Imágenes
- **Subida de Imágenes**: 
  - Imagen principal del producto
  - Galería de imágenes múltiples
  - Logo de marcas
- **Vista Previa**: Ver imágenes antes de guardar
- **Optimización**: Sistema de optimización de imágenes

### 🔍 Herramientas Adicionales
- **Búsqueda Avanzada**: Búsqueda en todo el sistema
- **Notificaciones**: Sistema de notificaciones del panel
- **Logs de Actividad**: Registro de acciones realizadas

## 🛠️ Stack Tecnológico

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Framer Motion**
- **shadcn/ui**
- **Zustand** (Estado del carrito)
- **next-themes** (Dark/Light mode)

## 📦 Instalación Rápida

1. **Instala las dependencias:**

```bash
npm install
```

2. **Genera los productos automáticamente:**

```bash
npm run generate-products
```

Este script escanea todas las carpetas en `/public/products/` y genera automáticamente:
- Productos (uno por cada imagen JPG)
- Marcas y categorías
- Precios, descripciones y especificaciones
- El archivo `/data/products.ts` completo

3. **Ejecuta el servidor de desarrollo:**

```bash
npm run dev
```

4. **Abre [http://localhost:3000](http://localhost:3000) en tu navegador.**

## 📁 Estructura de Carpetas de Productos

Coloca tus imágenes JPG en carpetas organizadas por marca:

```
/public/products/
  ├── Rolex Datejust 36mm/
  │   ├── reloj1.jpg
  │   ├── reloj2.jpg
  │   └── ...
  ├── Omega Hombre/
  │   ├── reloj1.jpg
  │   └── ...
  └── ...
```

El sistema detecta automáticamente:
- **Marca**: Rolex, Omega, Patek Philippe, etc.
- **Subcategoría**: Datejust 36mm, Hombre, Dama, etc.
- **Productos**: Un producto por cada imagen JPG

## 📁 Estructura del Proyecto

```
├── app/                    # Páginas y rutas (App Router)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página de inicio
│   ├── products/          # Páginas de productos
│   ├── about/             # Página "Nosotros"
│   ├── contact/           # Página "Contacto"
│   └── checkout/          # Página de checkout
├── components/            # Componentes React
│   ├── ui/                # Componentes shadcn/ui
│   ├── navbar.tsx         # Barra de navegación
│   ├── footer.tsx         # Pie de página
│   ├── product-card.tsx   # Tarjeta de producto
│   ├── product-gallery.tsx # Galería de imágenes
│   └── cart.tsx           # Carrito de compras
├── lib/                   # Utilidades y helpers
│   ├── utils.ts           # Funciones utilitarias
│   └── store.ts           # Store de Zustand (carrito)
├── data/                  # Datos estáticos
│   └── products.ts       # Productos de ejemplo
└── public/                # Archivos estáticos
    └── products/         # Imágenes de productos
```

## 🔄 Actualizar Productos

Cada vez que agregues nuevas imágenes o carpetas:

1. Coloca las imágenes en las carpetas correspondientes en `/public/products/`
2. Ejecuta: `npm run generate-products`
3. Los productos se actualizarán automáticamente

**Nota**: El archivo `/data/products.ts` se genera automáticamente. No lo edites manualmente.

## 🎯 Páginas Disponibles

### Páginas Públicas (Usuarios)
- `/` - Home con carrusel de marcas y productos destacados
- `/marcas` - Lista de todas las marcas disponibles
- `/marcas/[slug]` - Productos de una marca específica
- `/relojes/todos` - Todos los productos con filtros avanzados
- `/reloj/[slug]` - Página individual de cada reloj con galería
- `/colecciones/relojes-hombre` - Colección de relojes para hombre
- `/colecciones/relojes-mujer` - Colección de relojes para mujer
- `/colecciones/rolex` - Colección específica de Rolex
- `/colecciones/omega` - Colección específica de Omega
- `/sobre-nosotros` - Información sobre la tienda
- `/faq` - Preguntas frecuentes
- `/favoritos` - Lista de productos favoritos
- `/contact` - Formulario de contacto
- `/checkout` - Proceso de compra
- `/checkout/success` - Confirmación de pedido exitoso
- `/login` - Inicio de sesión de usuarios
- `/register` - Registro de nuevos usuarios
- `/profile` - Panel de usuario (requiere autenticación)

### Páginas Administrativas
- `/admin/login` - Login del panel administrativo
- `/admin` - Redirección al dashboard
- `/admin/dashboard` - Dashboard con estadísticas
- `/admin/productos` - Gestión de productos (CRUD)
- `/admin/marcas` - Gestión de marcas
- `/admin/colecciones` - Gestión de colecciones
- `/admin/ordenes` - Gestión de órdenes
- `/admin/ordenes/[id]` - Detalle de orden específica
- `/admin/contacto` - Mensajes de contacto
- `/admin/configuracion` - Configuración del sistema

### Personalizar colores y estilos

Los colores se definen en `app/globals.css` usando variables CSS. Puedes modificar los valores HSL para cambiar la paleta de colores.

### Fuentes

El proyecto usa:
- **Inter** (Google Fonts) - para texto general
- **Neue Montreal** (local) - para títulos

Si no tienes Neue Montreal, puedes:
1. Descargarla desde [Neue Montreal](https://pangrampangram.com/products/neue-montreal)
2. Colocarla en `/public/fonts/`
3. O cambiar a otra fuente en `app/layout.tsx`

## 🚢 Build para Producción

```bash
npm run build
npm start
```

## 🔐 Acceso al Panel Administrativo

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

## 📝 Notas Importantes

### Para Usuarios
- El carrito se guarda en localStorage del navegador
- Los favoritos se guardan localmente
- El sistema de autenticación es funcional para gestión de perfil y pedidos
- Los métodos de pago (Stripe y PayPal) están integrados

### Para Administradores
- Los cambios en productos, marcas y colecciones se guardan en archivos TypeScript
- En producción, se recomienda usar una base de datos
- El sistema de subida de imágenes actualmente usa URLs
- Los roles y permisos están configurados (admin, editor, viewer)
- El dashboard muestra estadísticas en tiempo real

### Desarrollo
- El checkout procesa pagos de forma simulada en desarrollo
- Las imágenes deben colocarse en `/public/products/` organizadas por carpetas
- Ejecuta `npm run generate-products` después de agregar nuevas imágenes

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

