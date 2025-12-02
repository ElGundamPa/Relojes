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

- `/` - Home con carrusel de marcas
- `/marcas` - Lista de todas las marcas
- `/marcas/[slug]` - Productos de una marca específica
- `/relojes/todos` - Todos los productos
- `/reloj/[slug]` - Página individual de cada reloj
- `/about` - Nosotros
- `/contact` - Contacto
- `/checkout` - Checkout

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

## 📝 Notas

- El checkout es una simulación (mock). No procesa pagos reales.
- Las imágenes de ejemplo usan placeholders. Reemplázalas con tus imágenes reales.
- El carrito se guarda en localStorage del navegador.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

