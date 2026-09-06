import type { Metadata } from "next";
import "./globals.css";
import { AiChatBubble } from "@/components/AiChatBubble";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Procap Natural | Prótesis Capilares Indetectables en Bogotá, Cali y Colombia",
  description: "Prótesis capilares masculinas 100% indetectables de cabello humano natural en Bogotá (Chicó Norte) y Cali (Edificio María Mercedes). Instalación, mantenimiento, eventos y envíos a toda Colombia.",
  keywords: [
    "prótesis capilares bogota",
    "protesis capilares cali",
    "protesis capilar hombres colombia",
    "protesis capilar villavicencio",
    "protesis capilar medellin",
    "protesis capilar manizales",
    "mantenimiento protesis capilar bogota",
    "mantenimiento protesis capilar cali",
    "sistemas capilares chico norte",
    "sistemas capilares cali calle 16",
    "pegamento walker tape colombia",
    "procap natural cali",
    "procap natural bogota",
    "solucion natural protesis capilar"
  ],
  authors: [{ name: "J&M Tech Solutions", url: "https://www.jymtechsolutions.online/es" }],
  creator: "J&M Tech Solutions",
  metadataBase: new URL("https://protesiscapilarcolombia.com"),
  openGraph: {
    title: "Procap Natural | Prótesis Capilares Indetectables en Bogotá y Cali",
    description: "Sistemas capilares de cabello natural humano indetectables, transpirables y resistentes al agua. Sedes en Bogotá (Chicó Norte) y Cali (Edificio María Mercedes).",
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
  verification: {
    google: "OWgJcQ-rxT4oQfCfVTKLt_002O9SLeg5gRa4BfADuZM",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <meta name="google-site-verification" content="OWgJcQ-rxT4oQfCfVTKLt_002O9SLeg5gRa4BfADuZM" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5RR6XK2W');`,
          }}
        />
        
        {/* Schema JSON-LD SEO Multi-Location & J&M Tech Solutions Creator */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://protesiscapilarcolombia.com/#organization",
                  "name": "Procap Natural - Solución Natural en Prótesis Capilares",
                  "alternateName": ["Procap Natural", "ProCap Colombia", "Prótesis Capilar Natural"],
                  "url": "https://protesiscapilarcolombia.com/",
                  "logo": "https://protesiscapilarcolombia.com/favicons/android-chrome-512x512.png",
                  "telephone": "+573151189795",
                  "email": "procapnatural@gmail.com",
                  "sameAs": [
                    "https://www.instagram.com/protesiscapilarnatural",
                    "https://www.tiktok.com/@procapnatural",
                    "https://www.facebook.com/procapnatural"
                  ],
                  "areaServed": [
                    { "@type": "City", "name": "Bogotá" },
                    { "@type": "City", "name": "Cali" },
                    { "@type": "City", "name": "Villavicencio" },
                    { "@type": "City", "name": "Medellín" },
                    { "@type": "City", "name": "Barranquilla" },
                    { "@type": "City", "name": "Manizales" },
                    { "@type": "City", "name": "Bucaramanga" },
                    { "@type": "Country", "name": "Colombia" }
                  ],
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.9",
                    "reviewCount": "187",
                    "bestRating": "5",
                    "worstRating": "1"
                  }
                },
                {
                  "@type": "HairSalon",
                  "@id": "https://protesiscapilarcolombia.com/#sede-bogota",
                  "name": "Procap Natural - Sede Bogotá Chicó Norte",
                  "parentOrganization": { "@id": "https://protesiscapilarcolombia.com/#organization" },
                  "image": "https://protesiscapilarcolombia.com/favicons/android-chrome-512x512.png",
                  "url": "https://protesiscapilarcolombia.com/ubicacion",
                  "telephone": "+573151189795",
                  "priceRange": "$$$",
                  "paymentAccepted": "Efectivo, Tarjeta de Crédito, Wompi, Sistecrédito, Addi, Transferencia",
                  "currenciesAccepted": "COP",
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
                  "openingHoursSpecification": [
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                      "opens": "08:00",
                      "closes": "19:00"
                    },
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": ["Saturday"],
                      "opens": "08:00",
                      "closes": "18:00"
                    }
                  ],
                  "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Servicios y Sistemas Capilares Bogotá",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Instalación y Adaptación de Prótesis Capilar",
                          "description": "Diseño anatómico de línea frontal, moldeado, corte, desvanecido y pegado profesional con adhesivos médicos."
                        },
                        "price": "300000",
                        "priceCurrency": "COP"
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Mantenimiento Preventivo de Prótesis Capilar",
                          "description": "Retiro suave con disolvente cítrico C-22, limpieza profunda, desinfección dérmica, nuevo adhesivo y peinado."
                        },
                        "price": "75000",
                        "priceCurrency": "COP"
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Product",
                          "name": "Sistema Capilar Mixto Indetectable 100% Cabello Natural",
                          "description": "Centro resistente, perímetro poly-skin y frontal en malla ultra fina."
                        },
                        "price": "1750000",
                        "priceCurrency": "COP"
                      }
                    ]
                  }
                },
                {
                  "@type": "HairSalon",
                  "@id": "https://protesiscapilarcolombia.com/#sede-cali",
                  "name": "Procap Natural - Sede Cali Edificio María Mercedes",
                  "parentOrganization": { "@id": "https://protesiscapilarcolombia.com/#organization" },
                  "image": "https://protesiscapilarcolombia.com/favicons/android-chrome-512x512.png",
                  "url": "https://protesiscapilarcolombia.com/ubicacion",
                  "telephone": "+573151189795",
                  "priceRange": "$$$",
                  "paymentAccepted": "Efectivo, Tarjeta de Crédito, Wompi, Sistecrédito, Addi, Transferencia",
                  "currenciesAccepted": "COP",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Calle 16 #83A-15, Estudio 402, Edificio María Mercedes",
                    "addressLocality": "Cali",
                    "addressRegion": "Valle del Cauca",
                    "addressCountry": "CO"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 3.385500,
                    "longitude": -76.535000
                  }
                },
                {
                  "@type": "FAQPage",
                  "@id": "https://protesiscapilarcolombia.com/#faqs",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "¿Las prótesis capilares de Procap Natural son indetectables?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Sí, 100% indetectables. Están fabricadas con micro-membrana ultra fina (0.03mm) y cabello humano natural injertado cabello a cabello, simulando a la perfección el cuero cabelludo."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "¿Puedo hacer ejercicio, nadar o usar casco con la prótesis capilar?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Totalmente. Los adhesivos médicos hipoalergénicos que utilizamos son resistentes al agua, al sudor, al vapor y al viento, permitiéndote llevar una vida 100% activa."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "¿Dónde están ubicados en Colombia?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Contamos con sede principal en Bogotá (Carrera 16 #96-64, Barrio Chicó Norte), sede en Cali (Calle 16 #83A-15 Estudio 402, Edificio María Mercedes), y realizamos jornadas especiales en Villavicencio, Medellín, Manizales y envíos a todo el país."
                      }
                    }
                  ]
                },
                {
                  "@type": "Organization",
                  "@id": "https://protesiscapilarcolombia.com/#creator",
                  "name": "J&M Tech Solutions",
                  "url": "https://www.jymtechsolutions.online/es",
                  "description": "Agencia de automatización con IA y desarrollo de software"
                }
              ]
            })
          }}
        />
      </head>
      <body className="bg-[#031C45] text-slate-100 antialiased selection:bg-sky-400 selection:text-slate-950 relative overflow-x-hidden">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5RR6XK2W"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        
        {children}
        <AiChatBubble />
        <WhatsAppFloatingButton />
        <Analytics />
      </body>
    </html>
  );
}
