import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedSection, AnimatedItem } from "@/components/animated-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

// Forzar generación estática
export const dynamic = "force-static";
export const revalidate = false;

export const metadata = {
  title: "Preguntas Frecuentes | Relojes de Lujo",
  description: "Encuentra respuestas a las preguntas más comunes sobre nuestros productos, envíos, garantías y más.",
};

const faqCategories = [
  {
    title: "Envíos",
    icon: "🚚",
    questions: [
      {
        question: "¿Cuánto tarda el envío?",
        answer: "Los envíos estándar tardan entre 3-5 días hábiles dentro de España. Para envíos internacionales, el tiempo puede variar entre 7-14 días hábiles dependiendo del destino.",
      },
      {
        question: "¿Ofrecen envío gratuito?",
        answer: "Sí, ofrecemos envío gratuito en todas las compras superiores a €500. Para compras menores, el costo de envío es de €15.",
      },
      {
        question: "¿Puedo rastrear mi pedido?",
        answer: "Sí, una vez que tu pedido sea enviado, recibirás un email con el número de seguimiento y un enlace para rastrear tu paquete en tiempo real.",
      },
      {
        question: "¿Hacen envíos internacionales?",
        answer: "Sí, enviamos a más de 50 países. Los costos y tiempos de envío varían según el destino. Puedes calcular el costo en el checkout.",
      },
    ],
  },
  {
    title: "Garantía",
    icon: "🛡️",
    questions: [
      {
        question: "¿Qué cubre la garantía?",
        answer: "Nuestra garantía de 2 años cubre defectos de fabricación y problemas mecánicos. No cubre daños por mal uso, caídas o desgaste normal.",
      },
      {
        question: "¿Cómo activo la garantía?",
        answer: "Simplemente contáctanos con tu número de orden y una descripción del problema. Nuestro equipo de servicio al cliente te guiará en el proceso.",
      },
      {
        question: "¿La garantía es internacional?",
        answer: "Sí, nuestra garantía es válida internacionalmente. Puedes hacer uso de ella desde cualquier país donde hayamos enviado el producto.",
      },
    ],
  },
  {
    title: "Autenticidad",
    icon: "✅",
    questions: [
      {
        question: "¿Cómo garantizan la autenticidad?",
        answer: "Trabajamos directamente con distribuidores autorizados y verificamos cada reloj antes de enviarlo. Todos nuestros productos incluyen certificados de autenticidad.",
      },
      {
        question: "¿Puedo verificar la autenticidad?",
        answer: "Sí, cada reloj incluye un número de serie único que puedes verificar con la marca oficial. También proporcionamos certificados de autenticidad con cada compra.",
      },
      {
        question: "¿Qué pasa si recibo un producto no auténtico?",
        answer: "Garantizamos la autenticidad al 100%. Si alguna vez recibes un producto que no sea auténtico, te reembolsaremos el 200% del valor de tu compra.",
      },
    ],
  },
  {
    title: "Pagos",
    icon: "💳",
    questions: [
      {
        question: "¿Qué métodos de pago aceptan?",
        answer: "Aceptamos tarjetas de crédito y débito a través de Stripe, PayPal, y transferencias bancarias. Todos los pagos están protegidos con encriptación SSL.",
      },
      {
        question: "¿Es seguro pagar en línea?",
        answer: "Absolutamente. Utilizamos Stripe y PayPal, dos de las plataformas de pago más seguras del mundo. Tus datos nunca se almacenan en nuestros servidores.",
      },
      {
        question: "¿Puedo pagar en cuotas?",
        answer: "Sí, ofrecemos opciones de pago en cuotas a través de nuestros socios de financiamiento. Consulta las opciones disponibles en el checkout.",
      },
      {
        question: "¿Ofrecen reembolsos?",
        answer: "Sí, ofrecemos reembolsos completos dentro de los primeros 14 días después de recibir tu pedido, siempre que el producto esté en su estado original.",
      },
    ],
  },
  {
    title: "Cambios y Devoluciones",
    icon: "↩️",
    questions: [
      {
        question: "¿Puedo cambiar el tamaño o modelo?",
        answer: "Sí, puedes cambiar tu pedido dentro de los primeros 14 días. Los cambios están sujetos a disponibilidad. Contacta con nuestro servicio al cliente para más información.",
      },
      {
        question: "¿Cuánto tarda el proceso de devolución?",
        answer: "Una vez que recibamos tu devolución, procesaremos el reembolso en un plazo de 5-7 días hábiles. El dinero aparecerá en tu cuenta según el método de pago utilizado.",
      },
      {
        question: "¿Quién paga el envío de devolución?",
        answer: "Si la devolución es por un defecto o error nuestro, cubrimos todos los costos. Para devoluciones por cambio de opinión, el cliente es responsable del costo de envío de retorno.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 mb-6">
            <HelpCircle className="h-10 w-10 text-blue-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Encuentra respuestas rápidas a las preguntas más comunes sobre nuestros productos y servicios.
          </p>
        </AnimatedSection>

        <div className="space-y-12">
          {faqCategories.map((category, categoryIndex) => (
            <AnimatedItem key={category.title} index={categoryIndex}>
              <Card className="border-0 shadow-premium">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <span className="text-3xl">{category.icon}</span>
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                        <AccordionTrigger className="text-left font-semibold">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </AnimatedItem>
          ))}
        </div>

        <AnimatedSection delay={0.4} className="mt-16 text-center">
          <Card className="border-0 shadow-premium bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-4">¿No encuentras tu respuesta?</h3>
              <p className="text-muted-foreground mb-6">
                Nuestro equipo está aquí para ayudarte. Contáctanos y te responderemos en menos de 24 horas.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Contactar Soporte
              </a>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
}

