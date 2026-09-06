"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Scissors, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  ArrowRight,
  Sparkle
} from "lucide-react";

export default function ServiciosPage() {
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573151189795";

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header de Página */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold badge-procap">
              <Scissors size={14} /> Salón Especializado • Bogotá
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight">
              Servicios Profesionales de <span className="text-cyan-gradient">Prótesis Capilar</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Atención personalizada en cabinas 100% privadas en el Barrio Chicó Norte. Estilistas y técnicos capilares con experiencia para garantizar un acabado impecable e indetectable.
            </p>
          </div>

          {/* Grid de Servicios Principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            
            {/* Servicio 1: Instalación */}
            <div className="glass-panel rounded-3xl p-8 border border-white/10 flex flex-col justify-between hover:border-sky-400/40 transition-all shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold badge-procap">Servicio Estrella</span>
                  <div className="text-right">
                    <span className="text-3xl font-black text-sky-400 font-heading">$300.000 COP</span>
                    <span className="block text-xs text-slate-400 line-through">$380.000 COP</span>
                  </div>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 text-2xl mb-6">
                  <Scissors size={28} />
                </div>

                <h2 className="text-2xl font-black text-white font-heading mb-3">Servicio de Instalación & Adaptación</h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Si compraste tu prótesis con nosotros o ya tienes la tuya, realizamos todo el procedimiento técnico para que quede fija, natural y perfectamente integrada con tu cabello:
                </p>

                <ul className="space-y-3.5 text-sm text-slate-300 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>1. Diagnóstico & Limpieza Dérmica:</strong> Preparación y desinfección profunda del cuero cabelludo para garantizar máxima adherencia.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>2. Diseño Anatómico Frontal:</strong> Marcación simétrica de la línea de nacimiento del cabello según tu edad y fisionomía.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>3. Moldeado y Recorte de Malla:</strong> Ajuste milimétrico de la base poly-skin o suiza para adaptarla a la zona despoblada.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>4. Adhesión de Grado Médico:</strong> Aplicación de pegamento acrílico o cintas impermeables hipoalergénicas.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>5. Corte, Fade & Estilizado:</strong> Desvanecido y peinado moderno a tu elección.</span>
                  </li>
                </ul>
              </div>

              <a
                href={`https://wa.me/${whatsappPhone}?text=¡Hola%20Procap!%20Deseo%20agendar%20mi%20Servicio%20de%20Instalación%20de%20Prótesis%20Capilar%20($300.000%20COP).`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-center flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
              >
                <i className="fa-brands fa-whatsapp text-lg"></i>
                <span>Agendar Instalación por WhatsApp</span>
              </a>
            </div>

            {/* Servicio 2: Mantenimiento */}
            <div className="glass-panel rounded-3xl p-8 border border-white/10 flex flex-col justify-between hover:border-sky-400/40 transition-all shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold badge-blue">Cuidado Periódico</span>
                  <div className="text-right">
                    <span className="text-3xl font-black text-sky-400 font-heading">$75.000 COP</span>
                    <span className="block text-xs text-slate-400 line-through">$100.000 COP</span>
                  </div>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-sky-400 text-2xl mb-6">
                  <Sparkles size={28} />
                </div>

                <h2 className="text-2xl font-black text-white font-heading mb-3">Servicio de Mantenimiento Integral</h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Recomendado cada 2 a 4 semanas para renovar la fijación, mantener la base impecable y cuidar la salud de tu cuero cabelludo:
                </p>

                <ul className="space-y-3.5 text-sm text-slate-300 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>1. Retiro Seguro sin Tirones:</strong> Aplicación de removedor cítrico protector C-22 para desprender suavemente la base.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>2. Limpieza & Desinfección de Base:</strong> Remoción total de residuos de pegamento, lavado y nutrición de las fibras capilares.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>3. Cuidado Capilar y Exfoliación:</strong> Lavado de tu cuero cabelludo y corte o pulido del cabello biológico lateral.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>4. Re-Adhesión de Alta Resistencia:</strong> Colocación de nuevas cintas o pegamento impermeable.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>5. Peinado y Fijación Final:</strong> Definición de estilo con productos profesionales.</span>
                  </li>
                </ul>
              </div>

              <a
                href={`https://wa.me/${whatsappPhone}?text=¡Hola%20Procap!%20Deseo%20agendar%20mi%20Servicio%20de%20Mantenimiento%20Capilar%20($75.000%20COP).`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl bg-slate-900/90 hover:bg-emerald-500 text-white hover:text-slate-950 font-bold text-center flex items-center justify-center gap-2 border border-slate-700 hover:border-emerald-400 transition-all shadow-sm"
              >
                <i className="fa-brands fa-whatsapp text-lg text-emerald-400 group-hover:text-slate-950"></i>
                <span>Agendar Mantenimiento por WhatsApp</span>
              </a>
            </div>

          </div>

          {/* Por qué elegir nuestro salón */}
          <div className="p-8 sm:p-12 rounded-3xl glass-panel-glow border border-sky-400/30 text-center space-y-6">
            <h3 className="text-2xl sm:text-3xl font-black font-heading text-white">
              ¿Por qué confiar en Procap Natural para tus servicios capilares?
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-left">
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <ShieldCheck size={24} className="text-sky-400 mb-3" />
                <h4 className="text-base font-bold text-white mb-1">Privacidad 100%</h4>
                <p className="text-xs text-slate-300">Cabinas individuales para que te sientas cómodo, seguro y con total discreción durante tu cita.</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <Clock size={24} className="text-sky-400 mb-3" />
                <h4 className="text-base font-bold text-white mb-1">Puntualidad & Rapidez</h4>
                <p className="text-xs text-slate-300">Procedimientos en tiempos óptimos (1.5 a 2 horas para instalación, 45 min para mantenimiento).</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <Sparkle size={24} className="text-sky-400 mb-3" />
                <h4 className="text-base font-bold text-white mb-1">Insumos Importados</h4>
                <p className="text-xs text-slate-300">Trabajamos exclusivamente con marcas reconocidas internacionalmente (Walker Tape, True Tape, C-22).</p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/catalogo"
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700"
              >
                Ver Catálogo de Prótesis e Insumos →
              </Link>
              <Link
                href="/cotizador"
                className="px-6 py-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-xs"
              >
                Cotizar mi Servicio Online →
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
