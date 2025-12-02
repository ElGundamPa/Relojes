import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection, AnimatedItem } from "@/components/animated-section";
import { AuthGuarantee } from "@/components/ui/auth-guarantee";
import { Award, Target, Heart, Users, Clock, Globe } from "lucide-react";

// Forzar generación estática
export const dynamic = "force-static";
export const revalidate = false;

export const metadata = {
  title: "Sobre Nosotros | Relojes de Lujo",
  description: "Conoce nuestra historia, misión y compromiso con la excelencia en relojería de lujo.",
};

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: "Excelencia",
      description: "Seleccionamos únicamente los relojes más excepcionales del mundo.",
    },
    {
      icon: Target,
      title: "Precisión",
      description: "Cada pieza es verificada y certificada para garantizar su autenticidad.",
    },
    {
      icon: Heart,
      title: "Pasión",
      description: "Nuestra dedicación a la relojería se refleja en cada detalle.",
    },
    {
      icon: Users,
      title: "Compromiso",
      description: "Tu satisfacción es nuestra prioridad número uno.",
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "Fundación",
      description: "Nacimos con la visión de hacer accesible la relojería de lujo auténtica.",
    },
    {
      year: "2022",
      title: "Expansión",
      description: "Ampliamos nuestra colección con las marcas más prestigiosas del mundo.",
    },
    {
      year: "2024",
      title: "Reconocimiento",
      description: "Nos convertimos en referente de confianza y calidad en relojería de lujo.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <AnimatedSection className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6">
            Sobre Nosotros
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Más que una tienda, somos apasionados por la relojería de lujo y la excelencia en cada detalle.
          </p>
        </div>
      </AnimatedSection>

      {/* Historia */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
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
                Fundada con la visión de hacer accesible la relojería de lujo auténtica, nuestra empresa nació de una pasión compartida por la precisión, la artesanía y el diseño atemporal.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Desde nuestros inicios, nos hemos comprometido a seleccionar únicamente los relojes más excepcionales, trabajando directamente con artesanos y marcas reconocidas mundialmente. Cada pieza en nuestra colección ha sido elegida por su excelencia técnica, diseño elegante y valor duradero.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Hoy, seguimos siendo fieles a nuestros valores fundacionales: calidad inigualable, servicio excepcional y una dedicación inquebrantable a nuestros clientes.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Valores */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Nuestros Valores
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Los principios que guían cada decisión y cada interacción.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <AnimatedItem key={value.title} index={index}>
                  <Card className="border-0 shadow-premium hover:shadow-premium-hover transition-shadow h-full">
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground text-background mb-4">
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedItem>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hitos */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Nuestro Camino
            </h2>
            <p className="text-muted-foreground text-lg">
              Momentos clave en nuestra trayectoria
            </p>
          </AnimatedSection>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <AnimatedItem key={milestone.year} index={index}>
                <Card className="border-0 shadow-premium">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                          {milestone.year}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold mb-2">{milestone.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </section>

      {/* Razones para confiar */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              ¿Por qué confiar en nosotros?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Miles de clientes satisfechos confían en nosotros para sus compras de relojes de lujo.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <AnimatedItem index={0}>
              <Card className="border-0 shadow-premium text-center">
                <CardContent className="p-8">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-2xl font-bold mb-2">+5 Años</h3>
                  <p className="text-muted-foreground">De experiencia en relojería de lujo</p>
                </CardContent>
              </Card>
            </AnimatedItem>
            <AnimatedItem index={1}>
              <Card className="border-0 shadow-premium text-center">
                <CardContent className="p-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <h3 className="text-2xl font-bold mb-2">+10,000</h3>
                  <p className="text-muted-foreground">Clientes satisfechos</p>
                </CardContent>
              </Card>
            </AnimatedItem>
            <AnimatedItem index={2}>
              <Card className="border-0 shadow-premium text-center">
                <CardContent className="p-8">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                  <h3 className="text-2xl font-bold mb-2">+50 Países</h3>
                  <p className="text-muted-foreground">Envíos internacionales</p>
                </CardContent>
              </Card>
            </AnimatedItem>
          </div>
        </div>
      </section>

      {/* Garantías */}
      <AuthGuarantee />
    </div>
  );
}

