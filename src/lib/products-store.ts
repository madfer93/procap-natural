export interface Product {
  id: string;
  name: string;
  category: 'sistemas' | 'adhesivos' | 'cintas' | 'cuidados' | 'servicios';
  type: string;
  description: string;
  price_offer: number;
  price_regular: number;
  badge: string;
  icon?: string;
  image_url?: string;
  payment_link?: string; // Pasarela 1: Enlace directo Wompi (Bancolombia / PSE / Tarjeta)
  payment_link_credit?: string; // Pasarela 2: Enlace directo Sistecrédito / Addi (Financiamiento a Cuotas)
  is_available: boolean;
  is_featured?: boolean;
  order_index?: number;
}

export const INITIAL_PRODUCTS: Product[] = [
  // Sistemas Capilares (Prótesis)
  {
    id: "sistema-paris",
    name: "Sistema Capilar París",
    category: "sistemas",
    type: "Prótesis Capilar",
    description: "Malla soldada premium con perímetro en Poly-skin de 0.03 - 0.05 mm. Indetectable y transpirable.",
    price_offer: 1950000,
    price_regular: 2200000,
    badge: "⭐ Alta Gama",
    is_available: true,
    is_featured: true,
    order_index: 1
  },
  {
    id: "sistema-mixto",
    name: "Sistema Mixto Indetectable",
    category: "sistemas",
    type: "Prótesis Capilar",
    description: "Microfilamento resistente en el centro, poly-skin perimetral y encaje frontal en malla ultra fina.",
    price_offer: 1750000,
    price_regular: 1950000,
    badge: "🔥 Más Vendido",
    is_available: true,
    is_featured: true,
    order_index: 2
  },
  {
    id: "sistema-afro-curly",
    name: "Sistema Afro Curly",
    category: "sistemas",
    type: "Prótesis Capilar",
    description: "Prótesis capilar de cabello afro 100% natural, textura auténtica e integración indetectable.",
    price_offer: 1600000,
    price_regular: 1850000,
    badge: "Especializado",
    is_available: true,
    order_index: 3
  },
  {
    id: "sistema-crespo",
    name: "Sistema Crespo / Ondulado",
    category: "sistemas",
    type: "Prótesis Capilar",
    description: "Base transpirable con encaje frontal suave para cabello ondulado o con ondas definidas.",
    price_offer: 1550000,
    price_regular: 1650000,
    badge: "Textura Natural",
    is_available: true,
    order_index: 4
  },
  {
    id: "sistema-australiano",
    name: "Sistema Australiano Skin",
    category: "sistemas",
    type: "Prótesis Capilar",
    description: "Base en piel transpirable y malla soldada con perímetro poly-skin fino (0.03 - 0.05 mm).",
    price_offer: 1450000,
    price_regular: 1550000,
    badge: "Ultra Confort",
    is_available: true,
    order_index: 5
  },
  {
    id: "sistema-pompadour",
    name: "Sistema Pompadour",
    category: "sistemas",
    type: "Prótesis Capilar",
    description: "Sistema transpirable con contorno en skin diseñado para peinados hacia atrás y volumen.",
    price_offer: 999000,
    price_regular: 1950000,
    badge: "⚡ Súper Descuento (50% OFF)",
    is_available: true,
    is_featured: true,
    order_index: 6
  },
  {
    id: "entradas-frontal",
    name: "Prótesis para Entradas Frontal",
    category: "sistemas",
    type: "Prótesis Parcial",
    description: "Encaje frontal poli-skin diseñado para cubrir recesiones capilares y entradas con precisión.",
    price_offer: 450000,
    price_regular: 550000,
    badge: "Corrección Localizada",
    is_available: true,
    order_index: 7
  },

  // Servicios en Salón Bogotá
  {
    id: "servicio-instalacion",
    name: "Servicio de Instalación & Adaptación",
    category: "servicios",
    type: "Servicio en Bogotá",
    description: "Si ya tienes tu prótesis: corte, diseño de línea frontal, adaptación anatómica y pegado profesional.",
    price_offer: 300000,
    price_regular: 380000,
    badge: "Atención 1 a 1",
    is_available: true,
    is_featured: true,
    order_index: 8
  },
  {
    id: "servicio-mantenimiento",
    name: "Servicio de Mantenimiento Integral",
    category: "servicios",
    type: "Servicio en Bogotá",
    description: "Retiro cuidadoso, limpieza profunda y desinfección de cuero cabelludo, nuevo adhesivo y peinado.",
    price_offer: 75000,
    price_regular: 100000,
    badge: "Esencial",
    is_available: true,
    is_featured: true,
    order_index: 9
  },

  // Pegamentos & Adhesivos
  {
    id: "pegamento-fusion-multiweek",
    name: "Pegamento Fusión Multi-Week 101ml",
    category: "adhesivos",
    type: "Insumo Profesional",
    description: "Pegamento fusión 101 ml (True Tape). Fijación extra fuerte resistente a sudor y ejercicio.",
    price_offer: 270000,
    price_regular: 300000,
    badge: "Larga Duración",
    is_available: true,
    order_index: 10
  },
  {
    id: "pegamento-ultra-hold",
    name: "Pegamento Ultra Hold (Walker Tape)",
    category: "adhesivos",
    type: "Insumo Profesional",
    description: "Adhesivo líquido acrílico hipoalergénico de máxima retención (hasta 4 semanas).",
    price_offer: 140000,
    price_regular: 160000,
    badge: "Garantía Walker Tape",
    is_available: true,
    order_index: 11
  },
  {
    id: "safe-gripe-walker",
    name: "Safe Gripe Walker Tape",
    category: "adhesivos",
    type: "Insumo Profesional",
    description: "Pegamento hipoalergénico a base de agua, ideal para piel sensible o climas cálidos.",
    price_offer: 140000,
    price_regular: 160000,
    badge: "Base de Agua",
    is_available: true,
    order_index: 12
  },
  {
    id: "pegamento-fusion-extra",
    name: "Pegamento Fusión Extra Fijación",
    category: "adhesivos",
    type: "Insumo Profesional",
    description: "Pegamento fusión True Tape de fijación multi-semana impermeable para actividad diaria intensa.",
    price_offer: 130000,
    price_regular: 160000,
    badge: "Resistente al Agua",
    is_available: true,
    order_index: 13
  },
  {
    id: "pegamento-conseal",
    name: "Pegamento Blanco Conseal Stylist",
    category: "adhesivos",
    type: "Insumo Profesional",
    description: "Adhesivo blanco a base de agua, secado transparente para retoques precisos y piel delicada.",
    price_offer: 14000,
    price_regular: 17000,
    badge: "Económico & Suave",
    is_available: true,
    order_index: 14
  },

  // Cintas Adhesivas
  {
    id: "cintas-ultra-hold",
    name: "Cintas Adhesivas Ultra Hold (*36 uds)",
    category: "cintas",
    type: "Insumo Profesional",
    description: "Cintas adhesivas en forma de ceja / contorno para una colocación rápida y limpia sin residuos.",
    price_offer: 65000,
    price_regular: 85000,
    badge: "Forma Anatómica",
    is_available: true,
    order_index: 15
  },
  {
    id: "cintas-super-tape",
    name: "Cintas Adhesivas Súper Tape",
    category: "cintas",
    type: "Insumo Profesional",
    description: "Cintas de duración extrema, acabado mate sin brillo y máxima flexibilidad.",
    price_offer: 65000,
    price_regular: 80000,
    badge: "Alta Resistencia",
    is_available: true,
    order_index: 16
  },
  {
    id: "cinta-azul-doble-faz",
    name: "Cinta Azul Doble Faz Hipoalergénica",
    category: "cintas",
    type: "Insumo Profesional",
    description: "Cinta adhesiva doble faz suave para pieles sensibles o fijaciones de corta a media duración.",
    price_offer: 15000,
    price_regular: 17000,
    badge: "Fácil Retiro",
    is_available: true,
    order_index: 17
  },

  // Disolventes & Cuidados
  {
    id: "kit-mantenimiento",
    name: "Kit Completo de Mantenimiento",
    category: "cuidados",
    type: "Kit Promocional",
    description: "Incluye disolvente, protector de cuero cabelludo, pegamento y cintas para cuidado en casa.",
    price_offer: 410000,
    price_regular: 460000,
    badge: "Combo Completo",
    is_available: true,
    order_index: 18
  },
  {
    id: "scalp-protector",
    name: "Scalp Protector (Walker Tape)",
    category: "cuidados",
    type: "Insumo Profesional",
    description: "Barrera protectora de cuero cabelludo contra grasa, sudor e irritaciones antes del adhesivo.",
    price_offer: 85000,
    price_regular: 105000,
    badge: "Protector Dérmico",
    is_available: true,
    order_index: 19
  },
  {
    id: "just-rite-spray",
    name: "Positioning Just-Rite Spray",
    category: "cuidados",
    type: "Insumo Profesional",
    description: "Posicionador en spray que retarda el agarre instantáneo del adhesivo para calzar la prótesis exacta.",
    price_offer: 80000,
    price_regular: 95000,
    badge: "Ajuste Preciso",
    is_available: true,
    order_index: 20
  },
  {
    id: "disolvente-sas",
    name: "Disolvente SAS Super Adhesive Remover",
    category: "cuidados",
    type: "Insumo Profesional",
    description: "Removedor especializado de alta potencia para disolver pegamento y residuos de cintas.",
    price_offer: 60000,
    price_regular: 80000,
    badge: "Rápida Acción",
    is_available: true,
    order_index: 21
  },
  {
    id: "disolvente-action",
    name: "Action Adhesive Remover",
    category: "cuidados",
    type: "Insumo Profesional",
    description: "Disolvente suave y de rápida acción para retirar la prótesis sin tirar del cabello ni maltratar la piel.",
    price_offer: 60000,
    price_regular: 70000,
    badge: "Eficacia Probada",
    is_available: true,
    order_index: 22
  },
  {
    id: "disolvente-c22",
    name: "Disolvente C-22 Cítrico",
    category: "cuidados",
    type: "Insumo Profesional",
    description: "El removedor clásico cítrico más vendido del mundo para limpieza de cuero cabelludo y base.",
    price_offer: 60000,
    price_regular: 70000,
    badge: "Aroma Cítrico",
    is_available: true,
    order_index: 23
  }
];

export function formatPriceCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(amount);
}
