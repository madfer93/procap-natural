"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  Sparkles, 
  MessageSquare, 
  ArrowRight,
  ShieldCheck,
  Crown,
  Waves,
  Scissors,
  Truck
} from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
  category: "general" | "deporte" | "mantenimiento" | "envios";
}

const FAQS_DATA: FaqItem[] = [
  {
    category: "general",
    q: "¿Se nota que llevo una prótesis capilar puesta?",
    a: "No, es 100% indetectable. Nuestras prótesis están fabricadas sobre micro-mallas suizas (Swiss Lace) o bases poly-skin ultrafinas (0.03 mm) donde cada cabello se injerta uno a uno manualmente. La línea frontal replica el nacimiento natural del cabello y se funde con el tono exacto de tu cuero cabelludo, siendo invisible incluso a corta distancia."
  },
  {
    category: "deporte",
    q: "¿Puedo hacer ejercicio, sudar, nadar o montar en moto con casco?",
    a: "Totalmente sí. Usamos adhesivos médicos de polímero acrílico y a base de agua (como True Tape Fusion y Walker Tape Ultra Hold) resistentes al agua dulce, agua salada, sudor y vapor de duchas. Podrás entrenar en el gimnasio, usar casco de moto y nadar sin ninguna preocupación de desprendimiento."
  },
  {
    category: "general",
    q: "¿Cuánto tiempo dura una prótesis capilar de cabello humano?",
    a: "La vida útil de una prótesis de cabello natural de alta calidad va de 6 a 12 meses dependiendo del cuidado, tipo de base y frecuencia de mantenimiento. Los sistemas mixtos (malla central + borde de poliuretano) son los más duraderos, mientras que las de ultra-skin ultrafino ofrecen máxima invisibilidad con una duración de 3 a 6 meses."
  },
  {
    category: "mantenimiento",
    q: "¿Cada cuánto tiempo se debe realizar el mantenimiento capilar?",
    a: "El servicio de mantenimiento preventivo (retiro, limpieza profunda con disolvente cítrico C-22, exfoliación dérmica y nueva fijación) se realiza aproximadamente cada 2 a 4 semanas. En nuestro salón en Chicó Norte tenemos este servicio por solo $75.000 COP, o puedes adquirir los insumos para hacerlo en casa."
  },
  {
    category: "general",
    q: "¿El adhesivo o la prótesis dañan mi piel o el cabello existente?",
    a: "No causan daño. Los productos utilizados (protectores dérmicos Scalp Protector y adhesivos de grado médico) son hipoalergénicos y están dermatológicamente probados. La base es micro-perforada y transpirable, lo que permite que el cuero cabelludo respire y se mantenga oxigenado y saludable."
  },
  {
    category: "mantenimiento",
    q: "¿Puedo lavarme el cabello y peinarme normalmente todos los días?",
    a: "Sí. Puedes ducharte diariamente. Se recomienda usar champús libres de sulfatos y acondicionadores hidratantes aplicados de medios a puntas. Al peinarte, puedes usar secador a temperatura moderada, ceras estilizadoras, pomadas o geles."
  },
  {
    category: "envios",
    q: "¿Hacen envíos de prótesis y pegamentos a otras ciudades de Colombia?",
    a: "Sí, despachamos a todo el país (Medellín, Cali, Barranquilla, Bucaramanga, Pereira, Cartagena, etc.) a través de empresas transportadoras de confianza como Servientrega, Envia o Interrapidísimo. Los pedidos incluyen número de guía para rastreo en tiempo real."
  },
  {
    category: "envios",
    q: "¿Cuáles son los medios de pago disponibles?",
    a: "Recibimos transferencias Bancolombia, Nequi, Daviplata, tarjetas de crédito/débito y efectivo en nuestra sede física de Chicó Norte en Bogotá."
  },
  {
    category: "general",
    q: "¿Cómo eligen el color y la textura que coincida con mi cabello?",
    a: "En la cita de valoración (presencial en Chicó Norte o virtual por WhatsApp mediante fotos claras con luz natural), comparamos una muestra de tu cabello con nuestra escala de tonos y texturas (desde negro natural #1B, castaños oscuros, medios, claros, hasta porcentajes de canas del 10% al 60%)."
  },
];

export default function FaqsPage() {
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573151189795";
  const [activeCategory, setActiveCategory] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const filteredFaqs = FAQS_DATA.filter((item) => {
    const matchesCategory = activeCategory === "todos" || item.category === activeCategory;
    const matchesSearch =
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 pt-6 pb-20 relative z-10">
      
      {/* Ambient Glows */}
      <div className="glow-ambient top-0 left-1/4 -translate-x-1/2"></div>
      <div className="glow-ambient top-[40%] right-[-100px]"></div>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-sky-400/40 text-sky-300 text-xs sm:text-sm font-semibold mb-6 shadow-inner">
          <HelpCircle size={14} className="text-sky-400" />
          <span>Centro de Respuestas & Asesoría Transparente</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight leading-[1.15]">
          Preguntas <span className="text-cyan-gradient">Frecuentes</span>
        </h1>

        <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Resolvemos todas tus dudas sobre materiales, fijación, mantenimiento, deportes y pedidos en Bogotá y toda Colombia.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 space-y-4">
        
        {/* Input Buscador */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar dudas sobre piscina, pegamentos, duración, precios..."
            className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 transition-colors shadow-inner"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
          {[
            { id: "todos", label: "Todas las Dudas" },
            { id: "general", label: "Prótesis & Calidad", icon: Crown },
            { id: "deporte", label: "Deporte & Agua", icon: Waves },
            { id: "mantenimiento", label: "Mantenimiento", icon: Scissors },
            { id: "envios", label: "Envíos & Pagos", icon: Truck },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === tab.id
                  ? "bg-sky-400 text-slate-950 font-bold shadow-md shadow-sky-500/20"
                  : "bg-slate-900/80 text-slate-300 hover:border-sky-400 border border-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* FAQs Accordion */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-3xl border border-slate-800 p-8">
            <p className="text-slate-400 text-sm mb-4">No encontramos respuestas para tu búsqueda específica.</p>
            <a
              href={`https://wa.me/${whatsappPhone}?text=Hola%20Procap,%20tengo%20una%20pregunta%20específica%20que%20no%20encontré%20en%20la%20web:`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
            >
              <i className="fa-brands fa-whatsapp text-sm"></i>
              <span>Preguntar a un Especialista por WhatsApp</span>
            </a>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden hover:border-slate-700 transition-all duration-200"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-sky-300 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-sky-400 shrink-0 transition-transform duration-300 ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === idx && (
                <div className="px-5 sm:px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Banner AI Chat Assistant & WhatsApp */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-sky-400/30 bg-gradient-to-r from-blue-950/60 via-[#031C45] to-slate-950 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 mx-auto">
            <Sparkles size={24} />
          </div>
          <h3 className="text-xl font-bold text-white">¿Tienes una pregunta específica sobre tu caso?</h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto">
            Puedes interactuar con nuestro Asistente de IA abajo a la derecha, o hablar de inmediato con un estilista humano por WhatsApp.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/${whatsappPhone}?text=¡Hola!%20Tengo%20algunas%20preguntas%20sobre%20las%20prótesis%20capilares%20en%20Bogotá.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <i className="fa-brands fa-whatsapp text-base"></i>
              <span>Consultar por WhatsApp</span>
            </a>

            <Link
              href="/cotizador"
              className="px-6 py-3 rounded-xl glass-panel hover:bg-white/10 text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition-all"
            >
              <span>Ir al Cotizador</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      </main>
      <Footer />
    </div>
  );
}
