import type { Metadata } from "next";
import "./globals.css";
import { AiChatBubble } from "@/components/AiChatBubble";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Procap Natural | Prótesis Capilares Indetectables para Hombres en Bogotá",
  description: "Recupera tu cabello y confianza con prótesis capilares masculinas 100% indetectables de cabello natural humano en Bogotá. Instalación, mantenimiento y productos en Chicó Norte.",
  keywords: [
    "prótesis capilares bogota",
    "protesis capilar hombres colombia",
    "mantenimiento protesis capilar bogota",
    "sistemas capilares chico norte",
    "pegamento walker tape bogota",
    "procap natural"
  ],
  authors: [{ name: "J&M Tech Solutions", url: "https://www.jymtechsolutions.online/es" }],
  creator: "J&M Tech Solutions",
  metadataBase: new URL("https://protesiscapilarcolombia.com"),
  openGraph: {
    title: "Procap Natural | Prótesis Capilares Indetectables en Bogotá",
    description: "Sistemas capilares de cabello natural humano indetectables, transpirables y resistentes al agua. Sede en Chicó Norte, Bogotá.",
    url: "https://protesiscapilarcolombia.com",
    siteName: "Procap Natural",
    locale: "es_CO",
    type: "website",
  },
  icons: {
    icon: "/favicons/favicon.ico",
    shortcut: "/favicons/favicon.ico",
    apple: "/favicons/apple-touch-icon.png",
  },
  manifest: "/favicons/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        
        {/* Schema JSON-LD SEO & J&M Tech Solutions Creator */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HairSalon",
              "name": "Procap Natural - Prótesis Capilares para Hombres",
              "image": "https://protesiscapilarcolombia.com/favicons/android-chrome-512x512.png",
              "@id": "https://protesiscapilarcolombia.com/#salon",
              "url": "https://protesiscapilarcolombia.com/",
              "telephone": "+573151189795",
              "email": "procapnatural@gmail.com",
              "priceRange": "$$$",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Carrera 16 #96-64, Barrio Chicó Norte",
                "addressLocality": "Bogotá",
                "addressRegion": "Bogotá D.C.",
                "postalCode": "110221",
                "addressCountry": "CO"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 4.682855,
                "longitude": -74.053123
              },
              "sameAs": [
                "https://www.instagram.com/protesiscapilarnatural",
                "https://www.facebook.com/procapnatural"
              ],
              "creator": {
                "@type": "Organization",
                "name": "J&M Tech Solutions",
                "url": "https://www.jymtechsolutions.online/es",
                "description": "Agencia de automatización con IA y desarrollo de software"
              }
            })
          }}
        />
      </head>
      <body className="bg-[#031C45] text-slate-100 antialiased selection:bg-sky-400 selection:text-slate-950 relative overflow-x-hidden">
        {children}
        <AiChatBubble />
        <WhatsAppFloatingButton />
        <Analytics />
      </body>
    </html>
  );
}
