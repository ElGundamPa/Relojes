"use client";

import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Shield, Award, Truck, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedSection, AnimatedItem } from "@/components/animated-section";

export function Footer() {
  const footerLinks = {
    productos: [
      { label: "Colección", href: "/relojes/todos" },
      { label: "Marcas", href: "/marcas" },
      { label: "Nuevos", href: "/relojes/todos?new=true" },
    ],
    empresa: [
      { label: "Nosotros", href: "/about" },
      { label: "Contacto", href: "/contact" },
    ],
    legal: [] as Array<{ label: string; href: string }>,
  };

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  const certifications = [
    { icon: Shield, title: "Autenticidad", description: "Certificado de autenticidad" },
    { icon: Award, title: "Garantía", description: "2 años de garantía" },
    { icon: Truck, title: "Envíos", description: "Envío seguro y rápido" },
    { icon: Lock, title: "Pagos", description: "Pago 100% seguro" },
  ];

  return (
    <footer className="border-t border-border/40 bg-background">
      {/* Certifications Section */}
      <div className="border-b border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => {
              const Icon = cert.icon;
              return (
                <AnimatedItem key={cert.title} index={index}>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-background shadow-premium mb-3">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{cert.title}</h4>
                    <p className="text-xs text-muted-foreground">{cert.description}</p>
                  </div>
                </AnimatedItem>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <AnimatedSection>
              <h3 className="text-xl font-display font-bold mb-4">Relojes</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                Elegancia, precisión y estilo en cada pieza. Descubre nuestra
                colección exclusiva de relojes de lujo.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@relojes.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+34 900 123 456</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Madrid, España</span>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Links */}
          <AnimatedItem index={0}>
            <h4 className="font-semibold mb-4">Productos</h4>
            <ul className="space-y-3">
              {footerLinks.productos.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </AnimatedItem>

          <AnimatedItem index={1}>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </AnimatedItem>

          {footerLinks.legal.length > 0 && (
            <AnimatedItem index={2}>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </AnimatedItem>
          )}
        </div>

        {/* Social & Copyright */}
        <AnimatedSection delay={0.3}>
          <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex space-x-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Relojes. Todos los derechos reservados.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  );
}
