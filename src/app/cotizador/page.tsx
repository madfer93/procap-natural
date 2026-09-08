"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Crown, 
  Sparkles, 
  Package, 
  Scissors, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Calculator,
  HelpCircle
} from "lucide-react";

export default function CotizadorPage() {
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573151189795";

  const [need, setNeed] = useState<string>("protesis_completa");
  const [baseType, setBaseType] = useState<string>("mixta");
  const [texture, setTexture] = useState<string>("liso");
  const [hasCanas, setHasCanas] = useState<string>("no");
  const [city, setCity] = useState<string>("Bogotá");
  const [notes, setNotes] = useState<string>("");

  // Need mapping
  const needLabels: Record<string, { title: string; priceEst: string; desc: string }> = {
    protesis_completa: {
      title: "Prótesis Capilar Completa (Top / Corona)",
      priceEst: "$1.050.000 - $1.400.000 COP",
      desc: "Cobertura total superior y frontal con cabello 100% humano."
    },
    protesis_frontal: {
      title: "Prótesis Frontal (Corrección de Entradas)",
      priceEst: "$650.000 - $850.000 COP",
      desc: "Diseñada exclusivamente para recuperar la primera línea de entradas."
    },
    instalacion_salon: {
      title: "Servicio de Instalación & Corte en Salón",
      priceEst: "$300.000 COP",
      desc: "Preparación dérmica, recorte de base, fijación y corte estilizado."
    },
    mantenimiento: {
      title: "Servicio de Mantenimiento Periódico",
      priceEst: "$75.000 COP",
      desc: "Retiro con disolvente cítrico, exfoliación dérmica y nuevo adhesivo."
    },
    insumos: {
      title: "Compra de Insumos / Cintas / Pegamentos",
      priceEst: "Desde $50.000 COP",
      desc: "Cintas Walker Tape, Ghost Bond, Ultra Hold o removedores C-22."
    },
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedNeed = needLabels[need]?.title || need;
    
    const message = 
      `¡Hola Procap Natural! 💈 Deseo cotizar y recibir asesoría personalizada:\n\n` +
      `📋 *Requerimiento:* ${selectedNeed}\n` +
      `🛡️ *Preferencia de Base:* ${baseType.toUpperCase()}\n` +
      `💇 *Textura de Cabello:* ${texture}\n` +
      `⚪ *Canas:* ${hasCanas}\n` +
      `📍 *Ubicación / Ciudad:* ${city}\n` +
      `📝 *Detalles Adicionales:* ${notes || "Ninguno"}\n\n` +
      `¿Podrían confirmarme precios finales y agenda para valoración en sede (Bogotá, Cali, Neiva, Barranquilla) o envío nacional? Gracias.`;

    window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 pt-6 pb-20 relative z-10">
      
      {/* Ambient Glows */}
      <div className="glow-ambient top-0 left-1/4 -translate-x-1/2"></div>
      <div className="glow-ambient top-[50%] right-[-100px]"></div>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-sky-400/40 text-sky-300 text-xs sm:text-sm font-semibold mb-6 shadow-inner">
          <Calculator size={14} className="text-sky-400" />
          <span>Calculadora & Asesor de Cotización Rápida</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight leading-[1.15]">
          Cotiza tu Sistema Capilar <span className="text-cyan-gradient">en 1 Minuto</span>
        </h1>

        <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Selecciona tus requerimientos y recibe una estimación clara con atención directa y personalizada por WhatsApp.
        </p>
      </div>

      {/* Main Wizard Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-sky-400/30 shadow-2xl relative overflow-hidden">
          
          <form onSubmit={handleSendWhatsApp} className="space-y-8">
            
            {/* Paso 1: ¿Qué necesitas? */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 font-black text-xs flex items-center justify-center border border-sky-400/30">1</span>
                <label className="text-sm font-bold uppercase tracking-wider text-white">
                  ¿Cuál es tu requerimiento principal?
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: "protesis_completa", title: "Prótesis Completa", badge: "Más Vendido", icon: Crown },
                  { id: "protesis_frontal", title: "Prótesis Frontal / Entradas", badge: "Económico", icon: Sparkles },
                  { id: "instalacion_salon", title: "Instalación & Adaptación", badge: "$300.000 COP", icon: Scissors },
                  { id: "mantenimiento", title: "Mantenimiento Periódico", badge: "$75.000 COP", icon: Scissors },
                  { id: "insumos", title: "Cintas & Pegamentos", badge: "Insumos", icon: Package },
                ].map((item) => {
                  const IconComp = item.icon;
                  const isSelected = need === item.id;
                  return (
                    <label key={item.id} className="cursor-pointer">
                      <input
                        type="radio"
                        name="needOption"
                        value={item.id}
                        checked={isSelected}
                        onChange={() => setNeed(item.id)}
                        className="sr-only"
                      />
                      <div
                        className={`p-4 rounded-2xl border transition-all h-full flex flex-col justify-between ${
                          isSelected
                            ? "bg-sky-500/20 border-sky-400 shadow-lg shadow-sky-500/20"
                            : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <IconComp size={22} className={isSelected ? "text-sky-300" : "text-slate-400"} />
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected ? "bg-sky-400 text-slate-950" : "bg-slate-800 text-slate-400"
                          }`}>
                            {item.badge}
                          </span>
                        </div>
                        <span className={`text-sm font-bold ${isSelected ? "text-white" : "text-slate-200"}`}>
                          {item.title}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Paso 2: Preferencia de Base */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 font-black text-xs flex items-center justify-center border border-sky-400/30">2</span>
                <label className="text-sm font-bold uppercase tracking-wider text-white">
                  Preferencia de Tecnología de Base
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "mixta", label: "Sistema Mixto (Lace + Poly)", desc: "Máxima durabilidad y frescura" },
                  { id: "ultra_skin", label: "Ultra-Thin Skin (0.03mm)", desc: "100% invisible al tacto" },
                  { id: "malla_suiza", label: "Malla Suiza / French Lace", desc: "Transpiración total y deporte" },
                ].map((base) => (
                  <label key={base.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="baseType"
                      value={base.id}
                      checked={baseType === base.id}
                      onChange={() => setBaseType(base.id)}
                      className="sr-only"
                    />
                    <div
                      className={`p-4 rounded-2xl border transition-all text-left ${
                        baseType === base.id
                          ? "bg-sky-500/20 border-sky-400 shadow-md shadow-sky-500/10"
                          : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <span className="text-sm font-bold text-white block mb-1">{base.label}</span>
                      <span className="text-xs text-slate-400">{base.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Paso 3: Textura, Canas y Ciudad */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  3. Textura de Cabello
                </label>
                <select
                  value={texture}
                  onChange={(e) => setTexture(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-400"
                >
                  <option value="Liso / Lacio">Cabello Liso / Lacio</option>
                  <option value="Ondulado Suave (Wave)">Cabello Ondulado Suave</option>
                  <option value="Crespo / Rizado">Cabello Crespo / Rizado</option>
                  <option value="Afro Curly">Cabello Afro Curly</option>
                  <option value="Requiero valoración presencial">Requiero valoración presencial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  ¿Tienes Canas (% Gray Hair)?
                </label>
                <select
                  value={hasCanas}
                  onChange={(e) => setHasCanas(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-400"
                >
                  <option value="Sin Canas (0% Canas)">Sin Canas (0%)</option>
                  <option value="Pocas Canas (10% - 20%)">Pocas Canas (10% - 20%)</option>
                  <option value="Canas Moderadas (30% - 50%)">Canas Moderadas (30% - 50%)</option>
                  <option value="Mayormente Canoso (+60%)">Mayormente Canoso (+60%)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Ciudad de Atención
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ej: Bogotá, Medellín, Cali..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            {/* Paso 4: Notas Opcionales */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                ¿Algún detalle o pregunta que debamos tener en cuenta? (Opcional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: ¿Tienen disponibilidad para valoración este viernes en la tarde?"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 resize-none"
              />
            </div>

            {/* Resumen Estimado */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 font-semibold block">Rango de Inversión Estimado:</span>
                <span className="text-2xl font-black text-sky-400 font-heading">
                  {needLabels[need]?.priceEst || "A convenir"}
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  {needLabels[need]?.desc}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                <CheckCircle2 size={16} />
                <span>Valoración en Salón 100% Gratuita</span>
              </div>
            </div>

            {/* Botón WhatsApp */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.01]"
            >
              <i className="fa-brands fa-whatsapp text-2xl"></i>
              <span>Enviar Cotización a WhatsApp (+57 315 1189795)</span>
            </button>

          </form>

        </div>
      </div>

      {/* Mini FAQ de Cotización */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Preguntas sobre Cotizaciones</span>
          <h3 className="text-xl font-bold text-white mt-1">¿Cómo funciona el proceso después de cotizar?</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center mb-3">1</span>
            <h4 className="font-bold text-white text-sm mb-1">Contacto Inmediato</h4>
            <p className="text-slate-400 leading-relaxed">
              Un estilista especialista revisa tus datos y fotos de referencia para confirmarte las opciones de stock disponibles.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center mb-3">2</span>
            <h4 className="font-bold text-white text-sm mb-1">Cita en Chicó Norte</h4>
            <p className="text-slate-400 leading-relaxed">
              Te recibimos en cabina privada para medir tu cabeza, elegir la densidad, color exacto y fijar la fecha de colocación.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center mb-3">3</span>
            <h4 className="font-bold text-white text-sm mb-1">Transformación Total</h4>
            <p className="text-slate-400 leading-relaxed">
              En una sola sesión de 2 horas sales con tu nuevo corte, peinado y la seguridad de un cabello natural indetectable.
            </p>
          </div>
        </div>
      </div>

      </main>
      <Footer />
    </div>
  );
}
