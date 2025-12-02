import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection, AnimatedItem } from "@/components/animated-section";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros | Relojes de Lujo",
  description: "Conoce nuestra historia y compromiso con la excelencia en relojería de lujo.",
  openGraph: {
    title: "Nosotros | Relojes de Lujo",
    description: "Conoce nuestra historia y compromiso con la excelencia.",
    type: "website",
  },
};

export default function AboutPage() {
  const values = [
    {
      title: "Precisión",
      description:
        "Cada reloj es cuidadosamente seleccionado y verificado para garantizar la máxima precisión.",
    },
    {
      title: "Elegancia",
      description:
        "Diseños atemporales que combinan estética clásica con innovación moderna.",
    },
    {
      title: "Calidad",
      description:
        "Trabajamos únicamente con las mejores marcas y artesanos del mundo.",
    },
    {
      title: "Compromiso",
      description:
        "Nuestro compromiso es brindar una experiencia excepcional a cada cliente.",
    },
  ];

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
            Nosotros
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Más que una tienda, somos apasionados por la relojería de lujo.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2} className="mb-16">
          <div className="relative aspect-video rounded-lg overflow-hidden mb-8 bg-muted">
            <Image
              src="/products/sample-watch.jpg"
              alt="Nuestra historia"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-display font-bold mb-4">
              Nuestra Historia
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Fundada con la visión de hacer accesible la relojería de lujo
              auténtica, nuestra empresa nació de una pasión compartida por la
              precisión, la artesanía y el diseño atemporal.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Desde nuestros inicios, nos hemos comprometido a seleccionar
              únicamente los relojes más excepcionales, trabajando directamente
              con artesanos y marcas reconocidas mundialmente. Cada pieza en
              nuestra colección ha sido elegida por su excelencia técnica,
              diseño elegante y valor duradero.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Hoy, seguimos siendo fieles a nuestros valores fundacionales:
              calidad inigualable, servicio excepcional y una dedicación
              inquebrantable a nuestros clientes.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <AnimatedItem key={value.title} index={index}>
                <Card className="border-0 shadow-apple hover:shadow-apple-hover transition-shadow h-full">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedItem>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

