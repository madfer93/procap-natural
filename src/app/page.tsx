"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SedeVideoPlayer } from "@/components/SedeVideoPlayer";
import { TransformacionesReels } from "@/components/TransformacionesReels";
import { 
  Sparkles, 
  MapPin, 
  Scissors, 
  ShieldCheck, 
  Waves, 
  Wind, 
  ChevronDown, 
  CheckCircle2, 
  ArrowRight, 
  Crown,
  Package,
  Layers,
  Zap,
  Clock,
  ExternalLink
} from "lucide-react";
import { Product, INITIAL_PRODUCTS, formatPriceCOP } from "@/lib/products-store";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Mini Wizard State
  const [wizardNeed, setWizardNeed] = useState("Prótesis Capilar Nueva");
  const [wizardStyle, setWizardStyle] = useState("Cabello Liso / Lacio");
  const [wizardCity, setWizardCity] = useState("Bogotá");

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573151189795";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.products && data.products.length > 0) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Error al cargar productos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleWizardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `¡Hola Procap Natural! 💈 Deseo agendar una valoración o cotización personalizada:\n\n` +
      `📋 *Interés Principal:* ${wizardNeed}\n` +
      `💇 *Estilo o Textura:* ${wizardStyle}\n` +
      `📍 *Ubicación:* ${wizardCity}\n\n` +
      `¿Podrían indicarme los horarios disponibles para atención en la sede de Chicó Norte o asesoría virtual?`
    );
    window.open(`https://wa.me/${whatsappPhone}?text=${msg}`, "_blank");
  };

  // Solo productos visibles y seleccionar los 6 más destacados
  const featuredProducts = products
    .filter((p) => p.is_available !== false)
    .slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 relative z-10">
        
        {/* Ambient Glows */}
        <div className="glow-ambient top-0 left-1/4 -translate-x-1/2"></div>
        <div className="glow-ambient top-[35%] right-[-100px]"></div>
        <div className="glow-ambient top-[75%] left-[-100px]"></div>

        {/* Hero Section */}
        <section className="relative pt-10 pb-16 md:pt-16 md:pb-28 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-sky-400/40 text-sky-300 text-xs sm:text-sm font-semibold shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
                  <span>Especialistas en Prótesis Capilares Indetectables • Bogotá</span>
                </div>

                {/* Main Title */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-white tracking-tight leading-[1.15]">
                  Recupera tu Cabello y Confianza con <span className="text-cyan-gradient">Resultados 100% Naturales</span>
                </h1>

                {/* Description */}
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Sistemas capilares de <strong>cabello 100% natural humano</strong> de última generación. Malla ultra fina transpirable, resistentes al agua, sudor, gimnasio y vida diaria en Bogotá.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                  <a
                    href={`https://wa.me/${whatsappPhone}?text=Hola%20Procap%20Natural,%20quiero%20solicitar%20asesoría%20personalizada%20para%20una%20prótesis%20capilar.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 transition-all hover:scale-105"
                  >
                    <i className="fa-brands fa-whatsapp text-lg"></i>
                    <span>Agendar Valoración Gratuita</span>
                  </a>

                  <Link
                    href="/catalogo"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl glass-panel hover:bg-white/10 text-white font-bold text-sm flex items-center justify-center gap-2 border border-white/20 hover:border-sky-400 transition-all"
                  >
                    <Sparkles size={16} className="text-sky-400" />
                    <span>Ver Catálogo & Precios</span>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
                  <div className="flex flex-col items-center lg:items-start">
                    <span className="text-2xl font-black text-sky-400 font-heading">100%</span>
                    <span className="text-xs text-slate-400 font-medium">Cabello Humano</span>
                  </div>
                  <div className="flex flex-col items-center lg:items-start">
                    <span className="text-2xl font-black text-white font-heading">0.03mm</span>
                    <span className="text-xs text-slate-400 font-medium">Base Indetectable</span>
                  </div>
                  <div className="flex flex-col items-center lg:items-start">
                    <span className="text-2xl font-black text-emerald-400 font-heading">+5.7K</span>
                    <span className="text-xs text-slate-400 font-medium">Comunidad Instagram</span>
                  </div>
                  <div className="flex flex-col items-center lg:items-start">
                    <span className="text-2xl font-black text-sky-400 font-heading">Chicó</span>
                    <span className="text-xs text-slate-400 font-medium">Sede Norte Bogotá</span>
                  </div>
                </div>

              </div>

              {/* Right Visual Card */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md">
                  
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-sky-500 via-blue-600 to-sky-400 opacity-30 blur-xl"></div>

                  <div className="relative glass-panel rounded-3xl p-6 border border-sky-400/30 overflow-hidden shadow-2xl">
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold px-3 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-400/30 flex items-center gap-1.5">
                        <Sparkles size={14} /> Transformación Real
                      </span>
                      <span className="text-xs text-slate-400">Atención en Salón VIP</span>
                    </div>

                    <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-4 flex flex-col justify-between relative overflow-hidden">
                      <div className="flex justify-between items-start z-10">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Gama Profesional</span>
                          <h3 className="text-lg font-bold text-white">Sistema Mixto Indetectable</h3>
                        </div>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold">100% Invisible</span>
                      </div>

                      <div className="my-4 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-sky-500/10 border-2 border-sky-400 flex items-center justify-center text-sky-400 text-3xl shadow-lg shadow-sky-500/20">
                          <Crown size={36} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800 z-10">
                        <div className="flex items-center gap-2">
                          <Waves size={14} className="text-cyan-400" />
                          <span>Piscina y Deporte</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wind size={14} className="text-sky-400" />
                          <span>Transpirable</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2.5">
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                        <span>Adaptación anatómica a la medida exacta de tu cabeza</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                        <span>Corte y desvanecido moderno según tu fisionomía</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                        <span>Fijación segura de 2 a 4 semanas continuas</span>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-2">
                      <Link
                        href="/cotizador"
                        className="flex-1 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                      >
                        <span>Cotizar Mi Prótesis</span>
                        <ArrowRight size={14} />
                      </Link>
                      <Link
                        href="/beneficios"
                        className="px-4 py-3 rounded-xl glass-panel hover:bg-white/10 text-white font-bold text-xs border border-slate-700"
                      >
                        Beneficios
                      </Link>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Sección 2: Pilares / Beneficios Destacados */}
        <section className="py-16 bg-slate-950/60 border-y border-slate-900 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-sky-400">¿Por Qué Procap Natural?</span>
                <h2 className="text-2xl sm:text-4xl font-black font-heading text-white mt-1">
                  Diseñado para tu Ritmo de Vida <span className="text-cyan-gradient">Sin Límites</span>
                </h2>
              </div>
              <Link
                href="/beneficios"
                className="inline-flex items-center gap-2 text-sm font-bold text-sky-400 hover:text-sky-300 transition-colors"
              >
                <span>Ver comparativa y tecnología completa</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-sky-400/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 mb-4">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">100% Indetectable</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Línea frontal invisible que replica el nacimiento folicular exacto, imperceptible a simple vista.
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-emerald-400/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-4">
                  <Waves size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Vida Activa & Deporte</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Entrena en el gimnasio, usa casco de moto o nada en piscina sin miedo a desprendimientos.
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-sky-400/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-sky-400 mb-4">
                  <Wind size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Transpirable & Cómodo</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Micro-malla que permite a tu cuero cabelludo respirar con naturalidad y frescura continua.
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-amber-400/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-4">
                  <Scissors size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Estilo & Corte Libre</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  100% cabello humano genuino para moldear con ceras, secador o corte degradado personalizado.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* Sección 3: Servicios en Bogotá */}
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Atención en Salón VIP</span>
                <h2 className="text-2xl sm:text-4xl font-black font-heading text-white mt-1">
                  Servicios Profesionales en <span className="text-cyan-gradient">Chicó Norte</span>
                </h2>
              </div>
              <Link
                href="/servicios"
                className="inline-flex items-center gap-2 text-sm font-bold text-sky-400 hover:text-sky-300 transition-colors"
              >
                <span>Ver todos los pasos del servicio</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Instalación */}
              <div className="glass-panel rounded-3xl p-7 border border-white/10 flex flex-col justify-between hover:border-sky-400/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold badge-procap">Servicio Estrella</span>
                    <span className="text-2xl font-black text-sky-400 font-heading">$300.000 COP</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">Instalación & Adaptación</h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    Preparación dérmica, trazado frontal simétrico, recorte a medida, fijación médica y corte estilizado completo.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                  <a
                    href={`https://wa.me/${whatsappPhone}?text=Hola,%20deseo%20agendar%20instalación%20en%20Bogotá.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                    <span>Agendar Cita</span>
                  </a>
                  <Link
                    href="/servicios"
                    className="py-3 px-4 rounded-xl glass-panel text-white hover:bg-white/10 text-xs font-semibold border border-slate-700"
                  >
                    Detalles
                  </Link>
                </div>
              </div>

              {/* Mantenimiento */}
              <div className="glass-panel rounded-3xl p-7 border border-white/10 flex flex-col justify-between hover:border-sky-400/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold badge-blue">Cuidado Periódico</span>
                    <span className="text-2xl font-black text-sky-400 font-heading">$75.000 COP</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">Mantenimiento Integral</h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    Retiro no invasivo con disolvente cítrico C-22, lavado y nutrición de base, exfoliación de piel y re-adhesión nueva.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                  <a
                    href={`https://wa.me/${whatsappPhone}?text=Hola,%20deseo%20agendar%20mantenimiento%20en%20Bogotá.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-emerald-500 text-white hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 hover:border-emerald-400 transition-all"
                  >
                    <i className="fa-brands fa-whatsapp text-emerald-400"></i>
                    <span>Agendar Mantenimiento</span>
                  </a>
                  <Link
                    href="/servicios"
                    className="py-3 px-4 rounded-xl glass-panel text-white hover:bg-white/10 text-xs font-semibold border border-slate-700"
                  >
                    Detalles
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* Sección: Transformaciones & Reels de TikTok / Instagram */}
        <TransformacionesReels />

        {/* Sección 4: Catálogo Destacado */}
        <section className="py-16 bg-[#031C45]/90 border-t border-slate-800 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Catálogo Oficial & Precios COP</span>
                <h2 className="text-2xl sm:text-4xl font-black font-heading text-white mt-1">
                  Sistemas, Cintas & <span className="text-cyan-gradient">Adhesivos Disponibles</span>
                </h2>
              </div>
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 text-sm font-bold text-sky-400 hover:text-sky-300 transition-colors"
              >
                <span>Ver todos los 23+ productos con buscador</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Grid de 6 productos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => {
                const discount = Math.round(
                  ((product.price_regular - product.price_offer) / product.price_regular) * 100
                );

                const waMessage = encodeURIComponent(
                  `¡Hola Procap Natural! 👋 Me interesa adquirir o cotizar:\n` +
                  `📌 *Producto:* ${product.name}\n` +
                  `💰 *Precio:* ${formatPriceCOP(product.price_offer)} COP\n` +
                  `¿Tienen disponibilidad para entrega en Bogotá o envío nacional?`
                );

                return (
                  <div
                    key={product.id}
                    className="glass-panel rounded-2xl p-6 flex flex-col justify-between border border-slate-800 hover:border-sky-400/50 transition-all duration-300 group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full badge-procap">
                          {product.badge || "Disponible"}
                        </span>
                        {discount > 0 && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/30">
                            -{discount}%
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">
                        {product.type}
                      </span>
                      <h3 className="text-base font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-xl font-black text-sky-400 font-heading">
                          {formatPriceCOP(product.price_offer)}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          {formatPriceCOP(product.price_regular)}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        {/* Botón Wompi */}
                        {product.payment_link && (
                          <a
                            href={product.payment_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
                          >
                            <span>💳 Pagar con Wompi (PSE / Tarjeta)</span>
                          </a>
                        )}

                        {/* Botón Sistecrédito / Addi */}
                        {product.payment_link_credit && (
                          <a
                            href={product.payment_link_credit}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs shadow-md shadow-sky-500/20 transition-all hover:scale-[1.02]"
                          >
                            <span>⚡ Financiar a Cuotas (Sistecrédito / Addi)</span>
                          </a>
                        )}

                        {/* Botón WhatsApp */}
                        <a
                          href={`https://wa.me/${whatsappPhone}?text=${waMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900/90 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 font-bold text-xs border border-slate-700 hover:border-emerald-400 transition-all"
                        >
                          <i className="fa-brands fa-whatsapp text-sm text-emerald-400 group-hover:text-slate-950"></i>
                          <span>Pedir por WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl glass-panel hover:bg-white/10 text-white font-bold text-sm border border-sky-400/30 transition-all shadow-lg"
              >
                <span>Explorar Catálogo Completo (23+ Artículos)</span>
                <ArrowRight size={16} className="text-sky-400" />
              </Link>
            </div>

          </div>
        </section>

        {/* Sección 5: Cotizador Rápido */}
        <section className="py-16 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-sky-400/30 relative overflow-hidden shadow-2xl">
              
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Cotización Inmediata</span>
                <h2 className="text-2xl sm:text-3xl font-black font-heading text-white mt-1 mb-2">
                  ¿Tienes dudas sobre tu caso? <span className="text-cyan-gradient">Te asesoramos al instante</span>
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm">
                  Completa estos datos y recibe presupuesto estimado y fotos de referencia vía WhatsApp.
                </p>
              </div>

              <form onSubmit={handleWizardSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      1. Necesidad
                    </label>
                    <select
                      value={wizardNeed}
                      onChange={(e) => setWizardNeed(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400"
                    >
                      <option value="Prótesis Capilar Nueva">Prótesis Capilar Nueva</option>
                      <option value="Mantenimiento o Reinstalación">Mantenimiento o Reinstalación</option>
                      <option value="Compra de Insumos / Cintas">Compra de Insumos / Cintas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      2. Textura
                    </label>
                    <select
                      value={wizardStyle}
                      onChange={(e) => setWizardStyle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400"
                    >
                      <option value="Cabello Liso / Lacio">Cabello Liso / Lacio</option>
                      <option value="Cabello Ondulado">Cabello Ondulado</option>
                      <option value="Cabello Crespo / Afro">Cabello Crespo / Afro</option>
                      <option value="Requiero valoración presencial">Requiero valoración</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      3. Tu Ciudad
                    </label>
                    <input
                      type="text"
                      value={wizardCity}
                      onChange={(e) => setWizardCity(e.target.value)}
                      placeholder="Ej: Bogotá, Medellín..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01]"
                  >
                    <i className="fa-brands fa-whatsapp text-lg"></i>
                    <span>Cotizar Directo por WhatsApp</span>
                  </button>

                  <Link
                    href="/cotizador"
                    className="px-6 py-3.5 rounded-xl glass-panel hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700"
                  >
                    <span>Cotizador Avanzado</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </form>

            </div>

          </div>
        </section>

        {/* Sección 6: Sede Chicó Norte (Video & Info) */}
        <section className="py-20 bg-slate-950/80 border-t border-slate-900 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-400 inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel mb-3">
                <MapPin size={13} />
                <span>Sede Chicó Norte • Bogotá D.C.</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-black font-heading text-white">
                Atención Privada & Discreta en <span className="text-cyan-gradient">Bogotá</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                Carrera 16 #96-64, Barrio Chicó Norte. Cabinas individuales climatizadas para tu confort y privacidad total.
              </p>
            </div>

            {/* Video Player Showcase */}
            <div className="max-w-4xl mx-auto mb-16">
              <SedeVideoPlayer />
            </div>

            {/* Quick Actions & FAQ Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
                <h3 className="text-lg font-bold text-white">¿Listo para dar el paso?</h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Te atendemos en cabina privada e individual con cita previa para garantizarte privacidad absoluta.
                </p>

                <div className="space-y-3 pt-2">
                  <a
                    href={`https://wa.me/${whatsappPhone}?text=¡Hola%20Procap%20Natural!%20👋%20Deseo%20agendar%20una%20cita%20o%20valoración%20en%20Chicó%20Norte.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                  >
                    <i className="fa-brands fa-whatsapp text-lg"></i>
                    <span>Agendar Cita en Chicó Norte</span>
                  </a>

                  <div className="flex gap-2">
                    <Link
                      href="/ubicacion"
                      className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-sky-500 text-slate-200 hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                    >
                      <MapPin size={14} />
                      <span>Cómo Llegar</span>
                    </Link>
                    <Link
                      href="/catalogo"
                      className="flex-1 py-3 px-4 rounded-xl glass-panel hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                    >
                      <span>Ver Catálogo</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* FAQ Accordion */}
              <div className="lg:col-span-7 space-y-3">
                <div className="mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Dudas Comunes</span>
                  <h3 className="text-lg font-bold text-white">Preguntas Frecuentes</h3>
                </div>

                {[
                  {
                    q: "¿Se nota que llevo una prótesis capilar?",
                    a: "No, es 100% indetectable. Nuestras bases ultrafinas de 0.03 mm y mallas suizas imitan perfectamente los folículos y el tono de tu cuero cabelludo."
                  },
                  {
                    q: "¿Puedo hacer ejercicio, nadar o montar en moto?",
                    a: "Totalmente sí. Empleamos adhesivos impermeables de grado médico resistentes al sudor, gimnasio, agua de piscina y casco de moto."
                  },
                  {
                    q: "¿Cuánto tiempo dura y cada cuánto se hace mantenimiento?",
                    a: "Dura entre 6 y 12 meses con el cuidado adecuado. El mantenimiento de limpieza y nueva adhesión se realiza cada 2 a 4 semanas."
                  },
                ].map((faq, idx) => (
                  <div key={idx} className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
                    <button
                      onClick={() => handleToggleFaq(idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-sky-300 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        size={16}
                        className={`text-sky-400 transition-transform duration-300 ${
                          openFaqIndex === idx ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openFaqIndex === idx && (
                      <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
