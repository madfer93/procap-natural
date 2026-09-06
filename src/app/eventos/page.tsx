import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Send,
  Building2,
  Scissors
} from "lucide-react";

export const metadata: Metadata = {
  title: "Giras Nacionales & Eventos de Instalación | Procap Natural Colombia",
  description: "Conoce las próximas fechas y ciudades donde realizaremos jornadas especiales de instalación, mantenimiento y asesorías de prótesis capilares: Villavicencio, Cali, Manizales, Medellín y más.",
  keywords: [
    "procap natural eventos",
    "giras prótesis capilares colombia",
    "protesis capilar villavicencio fechas",
    "protesis capilar cali eventos",
    "jornadas instalacion protesis capilar medellin",
    "asesoria protesis capilar manizales"
  ],
};

const PROXIMOS_EVENTOS = [
  {
    id: "villavicencio",
    ciudad: "Villavicencio",
    departamento: "Meta • Llanos Orientales",
    fecha: "Próxima Jornada Especial",
    dias: "Cupos Limitados",
    lugar: "Estudio Privado & Cabina Individual",
    servicios: [
      "Venta e instalación de prótesis capilar 100% natural",
      "Productos y adhesivos para mantenimiento (Walker Tape, C-22)",
      "Asesoría y valoración capilar GRATIS personalizada"
    ],
    cuposRestantes: 5,
    estado: "Reserva Abierta",
    color: "from-emerald-500/20 to-slate-900 border-emerald-500/30 text-emerald-400"
  },
  {
    id: "cali",
    ciudad: "Cali",
    departamento: "Valle del Cauca",
    fecha: "Atención Permanente en Sede",
    dias: "Lunes a Sábado",
    lugar: "Calle 16 #83A-15, Estudio 402, Edificio María Mercedes",
    servicios: [
      "Instalación profesional de alta gama",
      "Mantenimientos preventivos periódicos",
      "Venta directa de sistemas capilares y solventes"
    ],
    cuposRestantes: "Abierto",
    estado: "Sede Activa",
    color: "from-amber-500/20 to-slate-900 border-amber-500/30 text-amber-400"
  },
  {
    id: "manizales",
    ciudad: "Manizales / Pereira",
    departamento: "Eje Cafetero",
    fecha: "Gira Regional Programada",
    dias: "Fin de Semana Especial",
    lugar: "Hotel Ejecutivo / Cabina Reservada",
    servicios: [
      "Colocación y corte personalizado",
      "Entrega de kits completos de mantenimiento",
      "Diseño de línea frontal a medida"
    ],
    cuposRestantes: 4,
    estado: "Pre-Registro",
    color: "from-sky-500/20 to-slate-900 border-sky-500/30 text-sky-400"
  },
  {
    id: "medellin",
    ciudad: "Medellín",
    departamento: "Antioquia",
    fecha: "Jornada VIP de Adaptación",
    dias: "Bajo Agenda",
    lugar: "Poblado / Laureles (Privado)",
    servicios: [
      "Instalación de sistemas indetectables",
      "Mantenimiento express para usuarios activos",
      "Asesoría técnica y demostración de micro-malla"
    ],
    cuposRestantes: 6,
    estado: "Reserva Abierta",
    color: "from-purple-500/20 to-slate-900 border-purple-500/30 text-purple-400"
  },
  {
    id: "barranquilla",
    ciudad: "Barranquilla / Bucaramanga",
    departamento: "Costa Caribe & Santander",
    fecha: "Gira Trimestral",
    dias: "Próximamente",
    lugar: "Ubicación por Confirmar",
    servicios: [
      "Valoraciones gratuitas 1 a 1",
      "Prótesis resistentes al clima cálido y humedad",
      "Envíos express asegurados 24h"
    ],
    cuposRestantes: 8,
    estado: "Lista de Espera",
    color: "from-pink-500/20 to-slate-900 border-pink-500/30 text-pink-400"
  }
];

export default function EventosPage() {
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573151189795";

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 pt-6 pb-20 relative z-10">
        
        {/* Ambient Glows */}
        <div className="glow-ambient top-0 left-1/3 -translate-x-1/2"></div>
        <div className="glow-ambient top-[40%] right-[-100px]"></div>

        {/* Hero Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-semibold mb-6 shadow-inner">
            <Calendar size={14} className="text-emerald-400" />
            <span>Giras & Jornadas Especiales en Colombia</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Próximos Eventos & <span className="text-cyan-gradient">Giras Capilares</span>
          </h1>

          <p className="mt-6 text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Llevamos la tecnología de prótesis capilares 100% indetectables directamente a tu ciudad. Aparta tu cita individual con antelación, ya que los cupos son estrictamente limitados para garantizar máxima privacidad y detalle.
          </p>
        </div>

        {/* Eventos Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROXIMOS_EVENTOS.map((evento) => (
              <div 
                key={evento.id}
                className={`glass-panel rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col justify-between hover:scale-[1.02] transition-all bg-gradient-to-br ${evento.color}`}
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-slate-900/90 text-xs font-bold border border-slate-700">
                      {evento.estado}
                    </span>
                    <span className="text-xs font-bold flex items-center gap-1.5 text-slate-300">
                      <Users size={14} className="text-sky-400" />
                      <span>{typeof evento.cuposRestantes === 'number' ? `¡Solo ${evento.cuposRestantes} cupos!` : evento.cuposRestantes}</span>
                    </span>
                  </div>

                  {/* Ciudad & Región */}
                  <div className="mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      {evento.departamento}
                    </span>
                    <h2 className="text-2xl font-black font-heading text-white mt-0.5">
                      {evento.ciudad}
                    </h2>
                  </div>

                  {/* Info Fecha y Lugar */}
                  <div className="space-y-2.5 text-xs sm:text-sm text-slate-300 border-t border-slate-800/80 pt-4 mb-5">
                    <div className="flex items-start gap-2.5">
                      <Calendar size={16} className="text-sky-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">{evento.fecha}</strong>
                        <span className="text-xs text-slate-400">{evento.dias}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-slate-300">{evento.lugar}</span>
                      </div>
                    </div>
                  </div>

                  {/* Servicios Incluidos */}
                  <div className="space-y-2 border-t border-slate-800/80 pt-4 mb-6">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Servicios en esta jornada:
                    </span>
                    {evento.servicios.map((serv, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{serv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4 border-t border-slate-800/80">
                  <a
                    href={`https://wa.me/${whatsappPhone}?text=¡Hola%20Procap!%20👋%20Deseo%20reservar%20mi%20cupo%20para%20la%20jornada%20especial%20en%20${encodeURIComponent(evento.ciudad)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <i className="fa-brands fa-whatsapp text-base"></i>
                    <span>Apartar Turno en {evento.ciudad}</span>
                  </a>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Banner Solicitar Gira en tu Ciudad */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-sky-400/30 bg-gradient-to-r from-blue-950/80 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest flex items-center justify-center md:justify-start gap-1.5">
                <Sparkles size={14} />
                <span>¿No ves tu ciudad en la lista?</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-heading text-white">
                ¡Solicita una Visita de Procap en tu Región!
              </h3>
              <p className="text-slate-300 text-sm max-w-xl">
                Agrupamos solicitudes de usuarios interesados para programar nuevas fechas en ciudades como Neiva, Ibagué, Pasto, Cúcuta, Tunja, Montería y más.
              </p>
            </div>

            <a
              href={`https://wa.me/${whatsappPhone}?text=¡Hola%20Procap!%20👋%20Me%20gustaría%20solicitar%20que%20programen%20una%20gira%20o%20evento%20en%20mi%20ciudad.`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-8 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs shrink-0 flex items-center gap-2 shadow-xl shadow-sky-500/20 transition-all hover:scale-105"
            >
              <Send size={16} />
              <span>Solicitar Mi Ciudad</span>
            </a>
          </div>
        </div>

        {/* Garantías de las Jornadas */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-panel rounded-2xl p-6 border border-white/10 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 mx-auto">
                <ShieldCheck size={24} />
              </div>
              <h4 className="font-bold text-white text-base">Total Privacidad</h4>
              <p className="text-xs text-slate-400">Atención 1 a 1 en espacios individuales cerrados sin público.</p>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-white/10 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mx-auto">
                <Scissors size={24} />
              </div>
              <h4 className="font-bold text-white text-base">Especialistas Certificados</h4>
              <p className="text-xs text-slate-400">Técnicos capilares expertos con años de experiencia en moldeado.</p>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-white/10 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mx-auto">
                <Building2 size={24} />
              </div>
              <h4 className="font-bold text-white text-base">Sistemas Listos para Llevar</h4>
              <p className="text-xs text-slate-400">Disponibilidad de adhesivos importados y stock para entrega inmediata.</p>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
