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
  Sparkles
} from "lucide-react";

export const metadata: Metadata = {
  title: "Ubicación & Contacto Sede Chicó Norte | Procap Natural Bogotá",
  description: "Visítanos en nuestra sede privada de prótesis capilares en Chicó Norte: Carrera 16 #96-64, Bogotá D.C. Asesoría y valoración personalizada previa cita.",
  keywords: [
    "prótesis capilar chicó norte",
    "prótesis capilar bogota direccion",
    "procap natural ubicacion",
    "salón prótesis capilar carrera 16 calle 96"
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
          <span>Barrio Chicó Norte • Bogotá D.C., Colombia</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Visítanos en Nuestra Sede en <span className="text-cyan-gradient">Chicó Norte</span>
        </h1>

        <p className="mt-6 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Un espacio reservado, moderno y de máxima discreción en una de las mejores zonas de Bogotá, equipado con cabinas privadas para tu confort total.
        </p>
      </div>

      {/* Video Recorrido Oficial */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400 flex items-center justify-center gap-1.5">
            <Sparkles size={14} />
            <span>Recorrido en Video</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-white mt-1">
            Conoce el Acceso y Nuestras Instalaciones
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
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">Dirección Principal</span>
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
                href="https://facebook.com/procapnatural"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-2xl glass-panel hover:bg-white/10 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-800 hover:border-sky-400 transition-all"
              >
                <i className="fa-brands fa-facebook text-base text-blue-400"></i>
                <span>Facebook (1.7K)</span>
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
                <h3 className="text-base font-bold text-white">¿Cómo Llegar a Nuestra Sede?</h3>
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
          <h3 className="text-2xl font-black font-heading text-white mb-2">¿Deseas agendar tu visita?</h3>
          <p className="text-slate-300 text-sm mb-6 max-w-xl mx-auto">
            Recuerda que para brindarte el 100% de atención personalizada en cabina privada, atendemos con reserva previa.
          </p>
          <a
            href={`https://wa.me/${whatsappPhone}?text=¡Hola%20Procap%20Natural!%20👋%20Deseo%20agendar%20una%20visita%20en%20su%20sede%20de%20Chicó%20Norte.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <i className="fa-brands fa-whatsapp text-xl"></i>
            <span>Agendar Cita en Chicó Norte</span>
          </a>
        </div>
      </div>

      </main>
      <Footer />
    </div>
  );
}
