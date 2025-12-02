import Image from "next/image";
import Link from "next/link";
import dynamicImport from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { AnimatedSection, AnimatedItem } from "@/components/animated-section";
import { AnimatedHero } from "@/components/animated-hero";
import { getAllProducts, getAllBrands, getCachedProductsByBrand } from "@/lib/data-cache";

// Code splitting: BrandCarousel solo se carga cuando se necesita
const BrandCarousel = dynamicImport(() => import("@/components/brand-carousel").then(mod => ({ default: mod.BrandCarousel })), {
  ssr: true,
  loading: () => <div className="h-[360px] animate-pulse bg-muted rounded-2xl" />
});

// Forzar generación estática
export const dynamic = "force-static";
export const revalidate = false;

export const metadata = {
  title: "Relojes de Lujo | Elegancia y Precisión",
  description: "Descubre nuestra exclusiva colección de relojes de lujo. Elegancia, precisión y estilo en cada pieza. Marcas premium como Rolex, Omega, Patek Philippe y más.",
  keywords: ["relojes", "lujo", "relojería", "tienda", "ecommerce", "rolex", "omega", "patek philippe"],
  openGraph: {
    title: "Relojes de Lujo | Elegancia y Precisión",
    description: "Descubre nuestra exclusiva colección de relojes de lujo. Elegancia, precisión y estilo en cada pieza.",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Relojes de Lujo",
    description: "Elegancia, precisión y estilo en cada pieza.",
  },
};
import {
  Truck,
  Shield,
  CreditCard,
  Star,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function Home() {
  // Usar funciones con cache
  const products = await getAllProducts();
  const brands = await getAllBrands();
  
  // Seleccionar un producto de cada marca para la colección destacada
  const featuredProducts = brands
    .map((brand) => {
      const brandProducts = getCachedProductsByBrand(brand.name);
      return brandProducts.length > 0 ? brandProducts[0] : null;
    })
    .filter((product): product is NonNullable<typeof product> => product !== null)
    .slice(0, 6); // Limitar a 6 productos máximo

  const benefits = [
    {
      icon: Truck,
      title: "Envíos rápidos",
      description: "Entrega en 24-48 horas en toda Colombia",
    },
    {
      icon: Shield,
      title: "Garantía",
      description: "2 años de garantía en todos nuestros productos",
    },
    {
      icon: CreditCard,
      title: "Pagos seguros",
      description: "Transacciones 100% seguras y protegidas",
    },
  ];

  const testimonials = [
    {
      name: "Carlos Martínez",
      role: "Cliente",
      content:
        "Excelente calidad y servicio. El reloj superó todas mis expectativas.",
      rating: 5,
    },
    {
      name: "Ana García",
      role: "Cliente",
      content:
        "Diseño elegante y atención al detalle impecable. Totalmente recomendado.",
      rating: 5,
    },
    {
      name: "Miguel López",
      role: "Cliente",
      content:
        "La mejor inversión que he hecho. Un reloj que perdurará generaciones.",
      rating: 5,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/products/fondo/Video fondo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        <AnimatedHero className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6 tracking-tight">
            Relojes de Lujo
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Elegancia, precisión y estilo en cada pieza.
          </p>
          <Link href="/relojes/todos" prefetch className="inline-block">
            <Button size="lg" className="group">
              Explorar colección
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </AnimatedHero>
      </section>

      {/* Brands Carousel */}
      {brands.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-muted/30 to-background">
          <div className="container mx-auto">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
                Nuestras Marcas
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Descubre las marcas más prestigiosas en relojería de lujo.
              </p>
            </AnimatedSection>
            <BrandCarousel brands={brands} />
          </div>
        </section>
      )}

      {/* Featured Collection */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
              Colección Destacada
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Descubre nuestras piezas más exclusivas, seleccionadas por su
              excelencia y diseño atemporal.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          <AnimatedSection delay={0.3} className="text-center mt-12">
            <Link href="/relojes/todos" prefetch>
              <Button variant="outline" size="lg" className="group">
                Ver todos los productos
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-muted/30 to-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <AnimatedItem key={benefit.title} index={index}>
                  <Card className="border-0 shadow-apple hover:shadow-apple-hover transition-shadow">
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground text-background mb-4">
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedItem>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
              Lo que dicen nuestros clientes
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <AnimatedItem key={testimonial.name} index={index}>
                <Card className="border-0 shadow-apple h-full">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-foreground text-foreground"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

