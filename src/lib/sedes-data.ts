export interface SedeInfo {
  slug: string;
  name: string;
  city: string;
  department: string;
  badge: string;
  address: string;
  neighborhood: string;
  postalCode: string;
  coverImage: string;
  gallery: {
    url: string;
    caption: string;
  }[];
  description: string;
  fullStory: string;
  amenities: string[];
  schedule: {
    weekdays: string;
    saturdays: string;
    sundays: string;
  };
  transitGuide: {
    car: string;
    publicTransport: string;
    parking: string;
  };
  googleMapsEmbed: string;
  googleMapsUrl: string;
  wazeUrl: string;
  whatsappMessage: string;
}

export const SEDES_DATA: SedeInfo[] = [
  {
    slug: "bogota",
    name: "Sede Bogotá",
    city: "Bogotá D.C.",
    department: "Cundinamarca",
    badge: "Sede Principal VIP",
    address: "Carrera 16 #96-64, Barrio Chicó Norte",
    neighborhood: "Chicó Norte • Localidad Chapinero / Usaquén",
    postalCode: "110221",
    coverImage: "/images/sedes/bogota.jpg",
    gallery: [
      { url: "/images/sedes/bogota.jpg", caption: "Fachada Torre Chicó Norte y Suite de Estilismo" },
      { url: "/images/sedes/cabina-vip.jpg", caption: "Cabina VIP Individual Climatizada" },
      { url: "/og-image.jpg", caption: "Área de Valoración Capilar y Colorimetría" }
    ],
    description: "Nuestra sede principal en el corazón empresarial y médico de Chicó Norte. Equipada con cabinas privadas ultra-discretas y la más alta tecnología en fijación capilar.",
    fullStory: "Ubicada estratégicamente sobre el corredor de la Carrera 16 entre Calles 96 y 98, la Sede Bogotá de Procap Natural fue diseñada para brindar una experiencia de total confidencialidad, confort y lujo. Cada cliente es atendido en una cabina individual con climatización independiente, sillón ergonómico de barbero de alta gama y equipo de iluminación especializada para el diseño milimétrico de la línea frontal.",
    amenities: [
      "Cabinas VIP 100% individuales e insonorizadas",
      "Climatización y purificación de aire dérmico",
      "Iluminación LED balanceada para prueba de color y densidad",
      "Bebidas de cortesía y WiFi de alta velocidad",
      "Acceso discreto para clientes de alto perfil"
    ],
    schedule: {
      weekdays: "8:00 AM – 7:00 PM (Previa Cita)",
      saturdays: "8:00 AM – 6:00 PM (Previa Cita)",
      sundays: "Citas especiales bajo reserva previa"
    },
    transitGuide: {
      car: "Fácil acceso vehicular por la Carrera 15, Carrera 11, Calle 96 o Autopista Norte.",
      publicTransport: "A 5 minutos a pie de la Estación TransMilenio Calle 100 o Virrey (Autopista Norte).",
      parking: "Parqueaderos públicos y bahías de estacionamiento a menos de 50 metros sobre la Carrera 16."
    },
    googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.5413158957445!2d-74.05569762414777!3d4.682855041870198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9a941f6e0b35%3A0x6a0397732d8479e!2sCra.%2016%20%2396-64%2C%20Bogot%C3%A1!5e0!3m2!1ses!2sco!4v1725490000000!5m2!1ses!2sco",
    googleMapsUrl: "https://maps.google.com/?q=Cra.+16+%2396-64,+Bogot%C3%A1",
    wazeUrl: "https://waze.com/ul?q=Cra.+16+%2396-64,+Bogota",
    whatsappMessage: "¡Hola Procap Natural! Deseo agendar mi valoración personalizada en la Sede Bogotá (Chicó Norte)."
  },
  {
    slug: "cali",
    name: "Sede Cali",
    city: "Cali",
    department: "Valle del Cauca",
    badge: "Sede Valle del Cauca",
    address: "Calle 16 #83A-15, Estudio 402, Edificio María Mercedes",
    neighborhood: "Barrio El Ingenio 3",
    postalCode: "760032",
    coverImage: "/images/sedes/cali.jpg",
    gallery: [
      { url: "/images/sedes/cali.jpg", caption: "Fachada Boutique y Estudio de Adaptación en Cali" },
      { url: "/images/sedes/cabina-vip.jpg", caption: "Cabina de Aplicación de Adhesivos Médicos" },
      { url: "/og-image.jpg", caption: "Muestra de Mallas French Lace y Skin Ultra Fino" }
    ],
    description: "Espacio moderno, fresco y reservado en el sur de Cali (El Ingenio 3), ideal para clientes del Valle del Cauca, Cauca, Nariño y el Eje Cafetero.",
    fullStory: "En el exclusivo sector de El Ingenio 3 en Cali, el Edificio María Mercedes alberga el Estudio 402 de Procap Natural. Un ambiente con aire acondicionado de alto rendimiento, formulado especialmente para realizar adaptaciones capilares con adhesivos acrílicos de máxima fijación resistentes al sudor, la humedad y el clima cálido.",
    amenities: [
      "Estudio privado en 4to piso con vista panorámica y reserva exclusiva",
      "Aire acondicionado de grado médico para control de humedad",
      "Adhesivos especiales Ultra Hold y Ghost Bond Platinum para clima cálido",
      "Zona de espera privada y atención 1 a 1",
      "Atención preferencial para todo el suroccidente"
    ],
    schedule: {
      weekdays: "8:30 AM – 6:30 PM (Previa Cita)",
      saturdays: "8:30 AM – 5:00 PM (Previa Cita)",
      sundays: "Citas especiales bajo reserva previa"
    },
    transitGuide: {
      car: "Acceso rápido por la Calle 16 (Pasoancho), Carrera 83 y Avenida Simón Bolívar.",
      publicTransport: "MIO: Estaciones y rutas alimentadoras cercanas sobre la Calle 16 y Cra 80.",
      parking: "Bahía de parqueo para visitantes al frente del Edificio María Mercedes."
    },
    googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.935105953046!2d-76.53697692415714!3d3.378036251787682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a1740fb872ab%3A0xb3a82f348e02d334!2sCl.%2016%20%2383a-15%2C%20Cali%2C%20Valle%20del%20Cauca!5e0!3m2!1ses!2sco!4v1725491000000!5m2!1ses!2sco",
    googleMapsUrl: "https://maps.google.com/?q=Calle+16+%2383A-15,+Cali",
    wazeUrl: "https://waze.com/ul?q=Calle+16+%2383A-15,+Cali",
    whatsappMessage: "¡Hola Procap Natural! Deseo agendar mi cita en la Sede Cali (Edificio María Mercedes Estudio 402)."
  },
  {
    slug: "neiva",
    name: "Sede Neiva",
    city: "Neiva",
    department: "Huila",
    badge: "Sede Huila & Región Sur",
    address: "Carrera 22 #25C-12",
    neighborhood: "Barrio Canaima",
    postalCode: "410008",
    coverImage: "/images/sedes/neiva.jpg",
    gallery: [
      { url: "/images/sedes/neiva.jpg", caption: "Fachada Clínica Capilar Estética en Neiva" },
      { url: "/images/sedes/cabina-vip.jpg", caption: "Cabina Privada de Instalación y Mantenimiento" },
      { url: "/og-image.jpg", caption: "Cabello 100% Humano Virgen Importado" }
    ],
    description: "Punto de atención integral para Neiva y todo el departamento del Huila, Caquetá y Putumayo, con atención especializada en prótesis indetectables.",
    fullStory: "Nuestra sede en el Barrio Canaima de Neiva acerca la tecnología capilar indetectable de estándar internacional a la región del Huila y el sur del país. Con instalaciones climatizadas y profesionales certificados en recorte de plantillas y degradados naturales.",
    amenities: [
      "Cabina individual privada con aire acondicionado",
      "Stock disponible de cintas Walker Tape, Ultra Hold y C-22 en Neiva",
      "Asesoría presencial sin costo de tono de cabello y densidad",
      "Servicio de corte, mantenimiento y recambio exprés",
      "Envíos inmediatos a Pitalito, Garzón, Florencia y Mocoa"
    ],
    schedule: {
      weekdays: "8:00 AM – 6:30 PM (Previa Cita)",
      saturdays: "8:00 AM – 5:00 PM (Previa Cita)",
      sundays: "Citas programadas"
    },
    transitGuide: {
      car: "Fácil acceso por la Carrera 22 y Avenida Max Duque en el sector de Canaima.",
      publicTransport: "Rutas de transporte urbano del sur de Neiva con parada a 1 cuadra.",
      parking: "Espacio de estacionamiento frente a la sede."
    },
    googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.71239856124!2d-75.28912362416002!3d2.901567154219871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3b7498c0919dfd%3A0x1c8b9d4219b16124!2sCra.%2022%20%2325c-12%2C%20Neiva%2C%20Huila!5e0!3m2!1ses!2sco!4v1725492000000!5m2!1ses!2sco",
    googleMapsUrl: "https://maps.google.com/?q=Cra.+22+%2325C-12,+Neiva",
    wazeUrl: "https://waze.com/ul?q=Cra.+22+%2325C-12,+Neiva",
    whatsappMessage: "¡Hola Procap Natural! Deseo agendar mi valoración en la Sede Neiva (Barrio Canaima)."
  },
  {
    slug: "barranquilla",
    name: "Sede Barranquilla",
    city: "Barranquilla",
    department: "Atlántico",
    badge: "Sede Costa Caribe",
    address: "Calle 64 #46-69",
    neighborhood: "Centro Histórico",
    postalCode: "080002",
    coverImage: "/images/sedes/barranquilla.jpg",
    gallery: [
      { url: "/images/sedes/barranquilla.jpg", caption: "Fachada Boutique en Centro Histórico de Barranquilla" },
      { url: "/images/sedes/cabina-vip.jpg", caption: "Cabina de Integración Capilar con Aire Acondicionado" },
      { url: "/og-image.jpg", caption: "Sistemas Capilares Resistentes a Piscina, Playa y Calor" }
    ],
    description: "Sede de referencia para la Costa Caribe colombiana en el Centro Histórico de Barranquilla. Especialistas en adhesivos médicos de ultra-resistencia al calor, playa y humedad.",
    fullStory: "En el tradicional y accesible Centro Histórico de Barranquilla (Calle 64 #46-69), Procap Natural brinda atención con protocolos especiales de preparación dérmica para clima caribeño. Permite a los usuarios bañarse en el mar, hacer ejercicio de alto rendimiento y disfrutar del clima costero con fijación 100% segura.",
    amenities: [
      "Instalaciones totalmente climatizadas para un confort dérmico total",
      "Protocolos anti-humedad con selladores Max Hold Sport",
      "Cabinas individuales para máxima privacidad",
      "Stock de insumos originales importados de USA",
      "Cobertura directa para Barranquilla, Cartagena, Santa Marta y Valledupar"
    ],
    schedule: {
      weekdays: "8:00 AM – 6:30 PM (Previa Cita)",
      saturdays: "8:00 AM – 5:00 PM (Previa Cita)",
      sundays: "Citas programadas con reserva previa"
    },
    transitGuide: {
      car: "Acceso directo por la Calle 64, Carrera 46 (Av. Olaya Herrera) y Carrera 44.",
      publicTransport: "Transmetro: A 3 cuadras de la estación La Catedral sobre la Carrera 46.",
      parking: "Parqueaderos vigilados a menos de 40 metros sobre la Calle 64."
    },
    googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.65421987123!2d-74.79234122409823!3d10.99289125521945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ef42d45a90181bb%3A0xc68297b41e8e4531!2sCl.%2064%20%2346-69%2C%20Nte.%20Centro%20Historico%2C%20Barranquilla%2C%20Atl%C3%A1ntico!5e0!3m2!1ses!2sco!4v1725493000000!5m2!1ses!2sco",
    googleMapsUrl: "https://maps.google.com/?q=Calle+64+%2346-69,+Barranquilla",
    wazeUrl: "https://waze.com/ul?q=Calle+64+%2346-69,+Barranquilla",
    whatsappMessage: "¡Hola Procap Natural! Deseo agendar mi valoración en la Sede Barranquilla (Centro Histórico)."
  }
];

export function getSedeBySlug(slug: string): SedeInfo | undefined {
  return SEDES_DATA.find((s) => s.slug.toLowerCase() === slug.toLowerCase());
}
