export interface CapilarEvent {
  id: string;
  city: string;
  department: string;
  date_text: string;
  schedule_text: string;
  location_name: string;
  services: string[];
  spots_remaining: string | number;
  status: string; // "Reserva Abierta" | "Pre-Registro" | "Sede Activa" | "Lista de Espera" | "Finalizado"
  color_theme?: string;
  is_active: boolean;
  order_index?: number;
}

export const INITIAL_EVENTS: CapilarEvent[] = [
  {
    id: "villavicencio",
    city: "Villavicencio",
    department: "Meta • Llanos Orientales",
    date_text: "Próxima Jornada Especial",
    schedule_text: "Jornada Continua (8:00 AM – 6:00 PM)",
    location_name: "Estudio Privado & Cabina Individual",
    services: [
      "Venta e instalación de prótesis capilar 100% natural",
      "Productos y adhesivos para mantenimiento (Walker Tape, C-22)",
      "Asesoría y valoración capilar GRATIS personalizada"
    ],
    spots_remaining: 5,
    status: "Reserva Abierta",
    color_theme: "from-emerald-500/20 to-slate-900 border-emerald-500/30 text-emerald-400",
    is_active: true,
    order_index: 1
  },
  {
    id: "cali",
    city: "Cali",
    department: "Valle del Cauca",
    date_text: "Atención Permanente en Sede",
    schedule_text: "Lunes a Sábado con cita previa",
    location_name: "Calle 16 #83A-15, Estudio 402, Edificio María Mercedes",
    services: [
      "Instalación profesional de alta gama",
      "Mantenimientos preventivos periódicos",
      "Venta directa de sistemas capilares y solventes"
    ],
    spots_remaining: "Abierto",
    status: "Sede Activa",
    color_theme: "from-amber-500/20 to-slate-900 border-amber-500/30 text-amber-400",
    is_active: true,
    order_index: 2
  },
  {
    id: "manizales",
    city: "Manizales / Pereira",
    department: "Eje Cafetero",
    date_text: "Gira Regional Programada",
    schedule_text: "Fin de Semana Especial",
    location_name: "Hotel Ejecutivo / Cabina Reservada",
    services: [
      "Colocación y corte personalizado",
      "Entrega de kits completos de mantenimiento",
      "Diseño de línea frontal a medida"
    ],
    spots_remaining: 4,
    status: "Pre-Registro",
    color_theme: "from-sky-500/20 to-slate-900 border-sky-500/30 text-sky-400",
    is_active: true,
    order_index: 3
  },
  {
    id: "medellin",
    city: "Medellín",
    department: "Antioquia",
    date_text: "Jornada VIP de Adaptación",
    schedule_text: "Bajo Agenda Exclusiva",
    location_name: "Poblado / Laureles (Privado)",
    services: [
      "Instalación de sistemas indetectables",
      "Mantenimiento express para usuarios activos",
      "Asesoría técnica y demostración de micro-malla"
    ],
    spots_remaining: 6,
    status: "Reserva Abierta",
    color_theme: "from-purple-500/20 to-slate-900 border-purple-500/30 text-purple-400",
    is_active: true,
    order_index: 4
  },
  {
    id: "barranquilla",
    city: "Barranquilla / Bucaramanga",
    department: "Costa Caribe & Santander",
    date_text: "Gira Trimestral",
    schedule_text: "Próximamente",
    location_name: "Ubicación por Confirmar",
    services: [
      "Valoraciones gratuitas 1 a 1",
      "Prótesis resistentes al clima cálido y humedad",
      "Envíos express asegurados 24h"
    ],
    spots_remaining: 8,
    status: "Lista de Espera",
    color_theme: "from-pink-500/20 to-slate-900 border-pink-500/30 text-pink-400",
    is_active: true,
    order_index: 5
  }
];
