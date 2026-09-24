import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Clock 
} from "lucide-react";
import { WhatsAppIcon } from "@/components/BrandIcons";

export const metadata: Metadata = {
  title: "Prótesis Capilares en Neiva | Sede Canaima Huila - Procap Natural",
  description: "Prótesis capilares masculinas 100% indetectables de cabello humano en Neiva y Huila. Carrera 22 #25C-12, Barrio Canaima. Instalación y mantenimiento.",
  alternates: {
    canonical: "https://www.protesiscapilarcolombia.com/protesis-capilar-neiva",
  },
  openGraph: {
    title: "Prótesis Capilares en Neiva | Procap Natural Huila",
    description: "Sistemas capilares indetectables de cabello humano en Neiva y sur de Colombia.",
    url: "https://www.protesiscapilarcolombia.com/protesis-capilar-neiva",
  },
};

export default function NeivaPage() {
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573151189795";

  return (
    <div className="min-h-screen flex flex-col bg-[#031C45] text-slate-100 selection:bg-sky-400 selection:text-slate-950">
      <Navbar />

      <main className="flex-1">
        {/* Hero Local Neiva */}
        <section className="relative pt-12 pb-20 overflow-hidden border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-sky-400/40 text-emerald-300 text-xs font-semibold">
                <MapPin size={14} className="text-emerald-400" />
                <span>Sede Oficial Neiva • Barrio Canaima</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-white tracking-tight leading-[1.15]">
                Prótesis Capilares en Neiva: <span className="text-cyan-gradient">100% Cabello Humano y Natural</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Punto oficial en el Barrio Canaima: <strong>Carrera 22 #25C-12</strong>. Especialistas en colocación anatómica de prótesis de micro-malla, stock de adhesivos Walker Tape en Neiva y cobertura para Huila, Caquetá y Putumayo.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <a
                  href={`https://wa.me/${whatsappPhone}?text=Hola%20Procap%20Neiva,%20deseo%20agendar%20mi%20cita%20de%20valoración%20en%20Neiva.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Agendar Cita en Sede Neiva por WhatsApp"
                  className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 transition-all hover:scale-105"
                >
                  <WhatsAppIcon className="w-5 h-5 text-slate-950" />
                  <span>Agendar Cita en Neiva</span>
                </a>

                <Link
                  href="/catalogo"
                  className="w-full sm:w-auto px-7 py-4 rounded-xl glass-panel hover:bg-white/10 text-white font-bold text-sm flex items-center justify-center gap-2 border border-slate-700"
                >
                  <span>Ver Modelos & Precios</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Datos de la Sede */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs text-slate-300 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-emerald-400 shrink-0" />
                  <span>Cra 22 #25C-12, Canaima</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-sky-400 shrink-0" />
                  <span>Lunes a Sábado: 8am - 6:30pm</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-amber-400 shrink-0" />
                  <span>Cabina Climatizada Privada</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Servicios en Neiva */}
        <section className="py-16 bg-slate-950/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Servicios en Neiva</span>
              <h2 className="text-2xl sm:text-4xl font-black font-heading text-white mt-1">
                Servicios Capilares en el Huila
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="glass-panel rounded-3xl p-8 border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 rounded-full text-xs font-bold badge-emerald">Primerizo o Renovación</span>
                  <span className="text-2xl font-black text-emerald-400 font-heading">$300.000 COP</span>
                </div>
                <h3 className="text-xl font-bold text-white">Instalación y Moldeado a la Medida</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Diseño de entradas naturales, adaptación precisa a tu curvatura de cráneo, pegado con adhesivo hipoalergénico y corte de estilo.
                </p>
                <a
                  href={`https://wa.me/${whatsappPhone}?text=Hola,%20deseo%20agendar%20instalación%20en%20la%20sede%20Neiva.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300"
                >
                  <span>Agendar Instalación</span>
                  <ArrowRight size={14} />
                </a>
              </div>

              <div className="glass-panel rounded-3xl p-8 border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 rounded-full text-xs font-bold badge-blue">Cada 2 a 4 semanas</span>
                  <span className="text-2xl font-black text-sky-400 font-heading">$75.000 COP</span>
                </div>
                <h3 className="text-xl font-bold text-white">Mantenimiento Periódico</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Remoción segura con disolvente cítrico C-22, higiene de cuero cabelludo, acondicionamiento de cabello y nueva fijación médica.
                </p>
                <a
                  href={`https://wa.me/${whatsappPhone}?text=Hola,%20deseo%20agendar%20mantenimiento%20en%20la%20sede%20Neiva.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-sky-400 hover:text-sky-300"
                >
                  <span>Agendar Mantenimiento</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* Mapa y Cómo Llegar */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
              ¿Cómo Llegar a la Sede Neiva?
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              Carrera 22 #25C-12, sector Canaima. Fácil acceso por la Avenida Max Duque. Bahía de parqueo frente a la sede.
            </p>
            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=Cra.+22+%2325C-12,+Neiva"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-sky-500 text-white hover:text-slate-950 font-bold text-xs border border-slate-700 transition-all"
              >
                <MapPin size={16} />
                <span>Abrir en Google Maps (Cra 22 #25C-12 Neiva)</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
