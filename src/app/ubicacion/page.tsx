import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SedeVideoPlayer } from "@/components/SedeVideoPlayer";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Car, 
  Navigation, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  Calendar,
  Users,
  Compass
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sedes Bogotá y Cali & Giras Nacionales | Procap Natural Colombia",
  description: "Visítanos en nuestras sedes oficiales en Bogotá (Chicó Norte: Cra 16 #96-64) y Cali (Calle 16 #83A-15 Estudio 402, Edificio María Mercedes). Conoce además nuestras jornadas y giras en Villavicencio, Manizales y Medellín.",
  keywords: [
    "prótesis capilar chicó norte bogota",
    "prótesis capilar cali",
    "procap natural cali direccion",
    "protesis capilar edificio maria mercedes cali",
    "procap natural ubicacion",
    "protesis capilar villavicencio",
    "giras protesis capilares colombia",
    "salón prótesis capilar bogota cali"
  ],
};

export default function UbicacionPage() {
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573151189795";

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 pt-6 pb-20 relative z-10">
      
      {/* Ambient Glows */}
      <div className="glow-ambient top-0 left-1/3 -translate-x-1/2"></div>
      <div className="glow-ambient top-[50%] right-[-100px]"></div>

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-sky-400/40 text-sky-300 text-xs sm:text-sm font-semibold mb-6 shadow-inner">
          <MapPin size={14} className="text-sky-400" />
          <span>Sedes Oficiales Bogotá & Cali • Giras en Todo el País</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Nuestras Sedes & <span className="text-cyan-gradient">Giras Nacionales</span>
        </h1>

        <p className="mt-6 text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          Espacios reservados, modernos y de máxima discreción con cabinas privadas e individuales para tu confort total en <strong>Bogotá</strong> y <strong>Cali</strong>, además de jornadas especiales de instalación en las principales ciudades de Colombia.
        </p>
      </div>

      {/* SEDES PRINCIPALES GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* SEDE 1: BOGOTÁ */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-sky-500/30 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-sky-500/20 text-sky-300 font-bold text-xs rounded-bl-2xl border-l border-b border-sky-400/30">
              Sede Principal
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
                  <MapPin size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black font-heading text-white">Sede Bogotá</h2>
                  <span className="text-xs text-sky-400 font-bold tracking-wider uppercase">Chicó Norte</span>
                </div>
              </div>

              <div className="space-y-3 text-slate-300 text-sm mt-4">
                <p className="flex items-start gap-2.5">
                  <strong className="text-white shrink-0">Dirección:</strong>
                  <span>Carrera 16 #96-64, Barrio Chicó Norte, Bogotá D.C.</span>
                </p>
                <p className="flex items-start gap-2.5">
                  <strong className="text-white shrink-0">Comodidades:</strong>
                  <span>Cabinas VIP individuales, acceso vehicular por Cra 15 y Cra 11, parqueadero a 50m.</span>
                </p>
                <p className="flex items-start gap-2.5">
                  <strong className="text-white shrink-0">Horarios:</strong>
                  <span>Lunes a Sábado: 8:00 AM – 7:00 PM (Previa Cita)</span>
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/${whatsappPhone}?text=¡Hola%20Procap!%20Deseo%20agendar%20mi%20valoración%20en%20la%20Sede%20Bogotá%20(Chicó%20Norte).`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all"
              >
                <i className="fa-brands fa-whatsapp text-base"></i>
                <span>Agendar en Bogotá</span>
              </a>
              <a
                href="https://maps.google.com/?q=Cra.+16+%2396-64,+Bogot%C3%A1"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl glass-panel hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <ExternalLink size={14} />
                <span>Ver Mapa</span>
              </a>
            </div>
          </div>

          {/* SEDE 2: CALI */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-amber-500/20 text-amber-300 font-bold text-xs rounded-bl-2xl border-l border-b border-amber-400/30">
              ¡Nueva Sede! 🎉
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <MapPin size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black font-heading text-white">Sede Cali</h2>
                  <span className="text-xs text-amber-400 font-bold tracking-wider uppercase">Edificio María Mercedes</span>
                </div>
              </div>

              <div className="space-y-3 text-slate-300 text-sm mt-4">
                <p className="flex items-start gap-2.5">
                  <strong className="text-white shrink-0">Dirección:</strong>
                  <span>Calle 16 #83A-15, Estudio 402, Edificio María Mercedes, Cali</span>
                </p>
                <p className="flex items-start gap-2.5">
                  <strong className="text-white shrink-0">Servicios:</strong>
                  <span>Venta, instalación personalizada de cabello 100% natural, mantenimiento y asesoría experta.</span>
                </p>
                <p className="flex items-start gap-2.5">
                  <strong className="text-white shrink-0">Atención:</strong>
                  <span>Reserva exclusiva y privada para clientes del Valle del Cauca y suroccidente.</span>
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/${whatsappPhone}?text=¡Hola%20Procap!%20Deseo%20agendar%20mi%20cita%20en%20la%20Sede%20Cali%20(Edificio%20María%20Mercedes).`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all"
              >
                <i className="fa-brands fa-whatsapp text-base"></i>
                <span>Agendar en Cali</span>
              </a>
              <a
                href="https://maps.google.com/?q=Calle+16+%2383A-15,+Cali"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl glass-panel hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <ExternalLink size={14} />
                <span>Ver Mapa</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* GIRAS NACIONALES & EVENTOS ESPECIALES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-slate-950 to-blue-950/40">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-slate-800 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs mb-2">
                <Calendar size={13} />
                <span>Giras & Jornadas Especiales</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
                Procap Natural en tu Ciudad
              </h2>
              <p className="text-slate-300 text-sm mt-1">
                Realizamos eventos periódicos de valoración e instalación con cupos limitados en distintas regiones de Colombia.
              </p>
            </div>

            <a
              href={`https://wa.me/${whatsappPhone}?text=¡Hola%20Procap!%20Me%20gustaría%20saber%20cuándo%20es%20la%20próxima%20gira%20o%20evento%20en%20mi%20ciudad.`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shrink-0 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Users size={16} />
              <span>Consultar Próxima Fecha en mi Ciudad</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Ciudad 1 */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-400/40 transition-all">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Llanos Orientales</span>
              <h3 className="text-lg font-bold text-white mt-1">Villavicencio</h3>
              <p className="text-xs text-slate-400 mt-1">Jornadas especiales de instalación y productos de mantenimiento.</p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>Cupos bajo reserva previa</span>
              </div>
            </div>

            {/* Ciudad 2 */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-400/40 transition-all">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">Eje Cafetero</span>
              <h3 className="text-lg font-bold text-white mt-1">Manizales / Pereira</h3>
              <p className="text-xs text-slate-400 mt-1">Asesorías capilares gratuitas y adaptaciones a medida.</p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                <CheckCircle2 size={13} className="text-sky-400" />
                <span>Envíos express y visitas</span>
              </div>
            </div>

            {/* Ciudad 3 */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-400/40 transition-all">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Antioquia</span>
              <h3 className="text-lg font-bold text-white mt-1">Medellín</h3>
              <p className="text-xs text-slate-400 mt-1">Despacho de sistemas capilares y adhesivos importados en 24h.</p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                <CheckCircle2 size={13} className="text-amber-400" />
                <span>Cobertura permanente</span>
              </div>
            </div>

            {/* Ciudad 4 */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-400/40 transition-all">
              <span className="text-xs font-bold text-pink-400 uppercase tracking-wider block">Costa & Santanderes</span>
              <h3 className="text-lg font-bold text-white mt-1">Barranquilla / B/manga</h3>
              <p className="text-xs text-slate-400 mt-1">Envíos nacionales asegurados y videollamadas de asesoría 1 a 1.</p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                <CheckCircle2 size={13} className="text-pink-400" />
                <span>Envíos a todo el país</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Video Recorrido Oficial */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400 flex items-center justify-center gap-1.5">
            <Sparkles size={14} />
            <span>Recorrido en Video</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-white mt-1">
            Conoce el Acceso y Nuestras Instalaciones en Bogotá
          </h2>
        </div>
        <SedeVideoPlayer />
      </div>

      {/* Main Content Grid: Info & Map */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Info & Horarios */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Tarjeta Dirección */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 text-xl shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">Sede Bogotá (Chicó Norte)</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">Carrera 16 #96-64</h3>
                  <p className="text-slate-300 text-sm">Barrio Chicó Norte, Localidad de Chapinero / Usaquén</p>
                  <p className="text-xs text-slate-400 mt-1">Bogotá D.C., Colombia • CP: 110221</p>
                </div>
              </div>

              <div className="flex items-start gap-4 border-t border-slate-800 pt-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 text-xl shrink-0">
                  <i className="fa-brands fa-whatsapp"></i>
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">WhatsApp Oficial & Citas</span>
                  <a
                    href={`https://wa.me/${whatsappPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-black text-white hover:text-emerald-400 transition-colors block mt-0.5"
                  >
                    +57 315 1189795
                  </a>
                  <p className="text-xs text-slate-400">Atención y resolución de dudas 24/7</p>
                </div>
              </div>

              <div className="flex items-start gap-4 border-t border-slate-800 pt-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-sky-400 text-xl shrink-0">
                  <Mail size={22} />
                </div>
                <div>
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">Correo Electrónico</span>
                  <a
                    href="mailto:procapnatural@gmail.com"
                    className="text-sm font-bold text-white hover:text-sky-300 transition-colors block mt-0.5"
                  >
                    procapnatural@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Tarjeta Horarios */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Clock size={20} />
                </div>
                <h3 className="text-base font-bold text-white">Horarios de Atención</h3>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                  <span className="font-semibold text-slate-300">Lunes a Viernes:</span>
                  <span className="text-sky-400 font-bold">8:00 AM – 7:00 PM</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                  <span className="font-semibold text-slate-300">Sábados:</span>
                  <span className="text-sky-400 font-bold">8:00 AM – 6:00 PM</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="font-semibold text-slate-300">Domingos & Festivos:</span>
                  <span className="text-emerald-400 font-bold">Cita previa agendada</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-400/20 text-xs text-sky-300 flex items-center gap-2">
                <ShieldCheck size={16} className="shrink-0 text-sky-400" />
                <span>Atención en cabina privada para total discreción.</span>
              </div>
            </div>

            {/* Redes Sociales */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/protesiscapilarnatural"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-2xl glass-panel hover:bg-white/10 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-800 hover:border-sky-400 transition-all"
              >
                <i className="fa-brands fa-instagram text-base text-pink-400"></i>
                <span>Instagram (5.7K)</span>
              </a>
              <a
                href="https://tiktok.com/@procapnatural"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-2xl glass-panel hover:bg-white/10 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-800 hover:border-sky-400 transition-all"
              >
                <i className="fa-brands fa-tiktok text-base text-sky-300"></i>
                <span>TikTok Oficial</span>
              </a>
            </div>

          </div>

          {/* Right: Interactive Map & Arrival Guide */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Google Map Embed */}
            <div className="glass-panel rounded-3xl p-3 border border-white/10 shadow-2xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.5413158957445!2d-74.05569762414777!3d4.682855041870198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9a941f6e0b35%3A0x6a0397732d8479e!2sCra.%2016%20%2396-64%2C%20Bogot%C3%A1!5e0!3m2!1ses!2sco!4v1725490000000!5m2!1ses!2sco"
                width="100%"
                height="440"
                style={{ border: 0, borderRadius: "1.25rem", filter: "invert(90%) hue-rotate(180deg) contrast(90%)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Cómo Llegar */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <Navigation size={20} />
                </div>
                <h3 className="text-base font-bold text-white">¿Cómo Llegar a Nuestra Sede Principal?</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <Car size={16} className="text-sky-400" />
                    <span>En Vehículo / Taxi</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Fácil acceso por la Carrera 15, Carrera 11, Calle 96 o Autopista Norte. Zona con bahías de parqueo y parqueaderos públicos a menos de 50 metros.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <Navigation size={16} className="text-emerald-400" />
                    <span>En TransMilenio</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Caminando a 5 minutos de la Estación <strong>Calle 100</strong> o Estación <strong>Virrey</strong> sobre la Troncal Autopista Norte.
                  </p>
                </div>
              </div>

              {/* Botón Abrir en Google Maps o Waze */}
              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=Cra.+16+%2396-64,+Bogot%C3%A1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-sky-500 text-slate-200 hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 hover:border-sky-400 transition-all"
                >
                  <ExternalLink size={16} />
                  <span>Abrir Ruta en Google Maps / Waze</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* CTA Final */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 text-center">
        <div className="glass-panel rounded-3xl p-8 border border-sky-400/30 bg-gradient-to-r from-blue-950/60 to-slate-950">
          <h3 className="text-2xl font-black font-heading text-white mb-2">¿Deseas agendar tu valoración personalizada?</h3>
          <p className="text-slate-300 text-sm mb-6 max-w-xl mx-auto">
            Atendemos con reserva previa en cabinas individuales y privadas tanto en Bogotá como en Cali y en nuestras giras nacionales.
          </p>
          <a
            href={`https://wa.me/${whatsappPhone}?text=¡Hola%20Procap%20Natural!%20👋%20Deseo%20agendar%20una%20visita%20o%20valoración.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <i className="fa-brands fa-whatsapp text-xl"></i>
            <span>Agendar Cita en Cabina Privada</span>
          </a>
        </div>
      </div>

      </main>
      <Footer />
    </div>
  );
}

