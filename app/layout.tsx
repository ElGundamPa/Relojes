import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Cart } from "@/components/cart";
import { ProgressBar } from "@/components/progress-bar";
import { CartNotificationWrapper } from "@/components/cart-notification-wrapper";
import { RouteGuard } from "@/components/route-guard";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Neue Montreal se puede agregar más tarde si tienes la fuente
// Por ahora usamos Inter para todo
const neueMontreal = Inter({
  subsets: ["latin"],
  variable: "--font-neue-montreal",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Relojes de Lujo | Elegancia y Precisión",
    template: "%s | Relojes de Lujo",
  },
  description:
    "Descubre nuestra exclusiva colección de relojes de lujo. Elegancia, precisión y estilo en cada pieza. Marcas premium como Rolex, Omega, Patek Philippe y más.",
  keywords: ["relojes", "lujo", "relojería", "tienda", "ecommerce", "rolex", "omega", "patek philippe", "relojes suizos"],
  authors: [{ name: "Relojes de Lujo" }],
  creator: "Relojes de Lujo",
  publisher: "Relojes de Lujo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    title: "Relojes de Lujo | Elegancia y Precisión",
    description: "Descubre nuestra exclusiva colección de relojes de lujo. Elegancia, precisión y estilo en cada pieza.",
    siteName: "Relojes de Lujo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Relojes de Lujo",
    description: "Elegancia, precisión y estilo en cada pieza.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} ${neueMontreal.variable} font-sans antialiased`}
      >
        <Providers>
          <ProgressBar />
          <RouteGuard protectedRoutes={["/checkout", "/favoritos", "/profile"]}>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <Cart />
              <CartNotificationWrapper />
            </div>
          </RouteGuard>
        </Providers>
      </body>
    </html>
  );
}

