import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AiChatBubble } from "@/components/AiChatBubble";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import { Analytics } from "@vercel/analytics/next";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Procap Natural | Prótesis Capilares Indetectables en Bogotá y Cali",
  description: "Prótesis capilares masculinas 100% indetectables de cabello humano en Bogotá y Cali. Instalación anatómica, mantenimiento experto y envíos a Colombia.",
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
  publisher: "Procap Natural",
  metadataBase: new URL("https://protesiscapilarcolombia.com"),
  alternates: {
    canonical: "https://protesiscapilarcolombia.com",
    languages: {
      "es-CO": "https://protesiscapilarcolombia.com",
      "es": "https://protesiscapilarcolombia.com",
      "x-default": "https://protesiscapilarcolombia.com",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Procap Natural | Prótesis Capilares Indetectables en Colombia",
    description: "Prótesis capilares masculinas 100% indetectables de cabello humano en Bogotá y Cali. Instalación anatómica, mantenimiento y envíos asegurados.",
    url: "https://protesiscapilarcolombia.com",
    siteName: "Procap Natural",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "https://protesiscapilarcolombia.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Procap Natural - Prótesis Capilares Indetectables en Colombia",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Procap Natural | Prótesis Capilares Indetectables Colombia",
    description: "Prótesis capilares masculinas 100% indetectables de cabello humano en Bogotá y Cali. Instalación anatómica y mantenimiento.",
    images: ["https://protesiscapilarcolombia.com/og-image.jpg"],
    creator: "@procapnatural",
  },
  icons: {
    icon: [
      { url: "/favicons/favicon.ico" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicons/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicons/favicon.ico",
    apple: [
      { url: "/favicons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/favicons/apple-touch-icon.png",
      },
    ],
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
    <html lang="es" className={`scroll-smooth ${plusJakarta.variable} ${syne.variable}`}>
      <head>
        {/* Verification & Meta Tags */}
        <meta name="google-site-verification" content="OWgJcQ-rxT4oQfCfVTKLt_002O9SLeg5gRa4BfADuZM" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical & Hreflang Tags */}
        <link rel="canonical" href="https://protesiscapilarcolombia.com" />
        <link rel="alternate" hrefLang="es-CO" href="https://protesiscapilarcolombia.com" />
        <link rel="alternate" hrefLang="es" href="https://protesiscapilarcolombia.com" />
        <link rel="alternate" hrefLang="x-default" href="https://protesiscapilarcolombia.com" />

        {/* OpenGraph & Social Meta Fallback */}
        <meta property="og:image" content="https://protesiscapilarcolombia.com/og-image.jpg" />
        <meta property="og:image:secure_url" content="https://protesiscapilarcolombia.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta name="twitter:image" content="https://protesiscapilarcolombia.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* Preconnects para optimización de latencia */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />

        {/* FontAwesome Icons */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer"
        />
        
        {/* Google Tag Manager (Optimizado no bloqueante) */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5RR6XK2W');`,
          }}
        />
        
        {/* Schema JSON-LD SEO Multi-Location, Catalog, FAQ & J&M Tech Solutions Creator */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": ["Organization", "HealthAndBeautyBusiness", "Store"],
                  "@id": "https://protesiscapilarcolombia.com/#organization",
                  "name": "Procap Natural - Solución Capilar Indetectable",
                  "alternateName": ["Procap Natural", "ProCap Colombia", "Prótesis Capilar Natural"],
                  "url": "https://protesiscapilarcolombia.com/",
                  "logo": "https://protesiscapilarcolombia.com/favicons/android-chrome-512x512.png",
                  "image": "https://protesiscapilarcolombia.com/og-image.jpg",
                  "telephone": "+573151189795",
                  "email": "infprocap@gmail.com",
                  "priceRange": "$$",
                  "paymentAccepted": [
                    "Efectivo",
                    "Wompi",
                    "Bancolombia",
                    "PSE",
                    "Sistecrédito",
                    "Addi",
                    "Tarjeta de Crédito Visa",
                    "Mastercard",
                    "American Express",
                    "Nequi",
                    "Daviplata",
                    "Transferencia Bancaria"
                  ],
                  "currenciesAccepted": "COP",
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
                  "@type": ["HairSalon", "LocalBusiness"],
                  "@id": "https://protesiscapilarcolombia.com/#sede-bogota",
                  "name": "Procap Natural - Sede Bogotá Chicó Norte",
                  "parentOrganization": { "@id": "https://protesiscapilarcolombia.com/#organization" },
                  "image": "https://protesiscapilarcolombia.com/og-image.jpg",
                  "url": "https://protesiscapilarcolombia.com/ubicacion",
                  "telephone": "+573151189795",
                  "priceRange": "$$",
                  "paymentAccepted": [
                    "Efectivo",
                    "Wompi",
                    "Bancolombia",
                    "PSE",
                    "Sistecrédito",
                    "Addi",
                    "Tarjeta de Crédito",
                    "Nequi"
                  ],
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
                    "name": "Catálogo de Prótesis Capilares y Servicios Bogotá",
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
                          "name": "Sistema Capilar París Gama Premium",
                          "description": "Malla soldada suiza y contorno poly-skin 0.03mm de máxima transpirabilidad."
                        },
                        "price": "1950000",
                        "priceCurrency": "COP"
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Product",
                          "name": "Sistema Capilar Mixto Indetectable (Más Vendido)",
                          "description": "Centro microfilamento resistente, perímetro poly-skin y frontal en malla ultra fina."
                        },
                        "price": "1750000",
                        "priceCurrency": "COP"
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Product",
                          "name": "Sistema Capilar Pompadour en Oferta",
                          "description": "Prótesis capilar 100% cabello natural humano con 50% de descuento."
                        },
                        "price": "999000",
                        "priceCurrency": "COP"
                      }
                    ]
                  }
                },
                {
                  "@type": ["HairSalon", "LocalBusiness"],
                  "@id": "https://protesiscapilarcolombia.com/#sede-cali",
                  "name": "Procap Natural - Sede Cali Edificio María Mercedes",
                  "parentOrganization": { "@id": "https://protesiscapilarcolombia.com/#organization" },
                  "image": "https://protesiscapilarcolombia.com/og-image.jpg",
                  "url": "https://protesiscapilarcolombia.com/ubicacion",
                  "telephone": "+573151189795",
                  "priceRange": "$$",
                  "paymentAccepted": [
                    "Efectivo",
                    "Wompi",
                    "Bancolombia",
                    "PSE",
                    "Sistecrédito",
                    "Addi",
                    "Tarjeta de Crédito",
                    "Nequi"
                  ],
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
                  },
                  "openingHoursSpecification": [
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                      "opens": "08:00",
                      "closes": "18:00"
                    }
                  ]
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
                        "text": "Sí, 100% indetectables. El cabello humano natural está anudado a mano en micro-mallas ultra finas de 0.03 a 0.05 mm que replican a la perfección el nacimiento natural del cuero cabelludo."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "¿Puedo hacer ejercicio, nadar o usar casco de moto con la prótesis?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Totalmente sí. Los adhesivos médicos acrílicos e hipoalergénicos que utilizamos son impermeables y resistentes al agua de piscina, sudor intenso de gimnasio, vapor y fricción de casco de moto."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "¿Cuáles son los métodos de pago y financiamiento aceptados?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Aceptamos pagos directos a través de Wompi (Bancolombia, PSE, tarjetas de crédito y débito) y crédito financiado a cuotas mediante Sistecrédito y Addi."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "¿Cuánto dura una prótesis capilar y cada cuánto requiere mantenimiento?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Una prótesis capilar de cabello humano tiene una durabilidad de 6 a 12 meses dependiendo del cuidado. Se recomienda realizar mantenimiento preventivo cada 2 a 4 semanas."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "¿Dónde están ubicadas las sedes en Colombia?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Contamos con sede principal en Bogotá (Carrera 16 #96-64, Barrio Chicó Norte), sede en Cali (Calle 16 #83A-15 Estudio 402, Edificio María Mercedes), y realizamos jornadas especiales en Villavicencio, Medellín, Manizales y envíos a todo el país."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "¿Hacen envíos a otras ciudades de Colombia?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Sí, realizamos envíos nacionales diarios 100% asegurados con número de guía a través de Interrapidísimo, Servientrega y Coordinadora."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "¿Tienen garantía las prótesis capilares?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Sí, cuentan con garantía legal de fabricación por 30 días calendario bajo el Estatuto del Consumidor (Ley 1480 de 2011) en nuestra sede oficial."
                      }
                    }
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://protesiscapilarcolombia.com/#website",
                  "url": "https://protesiscapilarcolombia.com/",
                  "name": "Procap Natural | Prótesis Capilares Indetectables",
                  "alternateName": "Procap Colombia",
                  "description": "Prótesis capilares masculinas 100% indetectables de cabello humano en Bogotá y Cali.",
                  "publisher": { "@id": "https://protesiscapilarcolombia.com/#organization" },
                  "creator": {
                    "@type": "Organization",
                    "@id": "https://www.jymtechsolutions.online/#organization",
                    "name": "J&M Tech Solutions",
                    "url": "https://www.jymtechsolutions.online/es",
                    "description": "Agencia de automatización con IA y desarrollo de software"
                  },
                  "inLanguage": "es-CO"
                },
                {
                  "@type": "Organization",
                  "@id": "https://www.jymtechsolutions.online/#organization",
                  "name": "J&M Tech Solutions",
                  "url": "https://www.jymtechsolutions.online/es",
                  "logo": "https://www.jymtechsolutions.online/logo.png",
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
