import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  ShieldCheck, 
  Waves, 
  Wind, 
  Scissors, 
  CheckCircle2, 
  Sparkles, 
  Crown, 
  Zap, 
  ArrowRight,
  Award
} from "lucide-react";

export const metadata: Metadata = {
  title: "Beneficios de las Prótesis Capilares Indetectables | Procap Natural Bogotá",
  description: "Descubre por qué las prótesis capilares de cabello natural en Bogotá son la mejor alternativa frente a cirugías o injertos. Resultados inmediatos, resistentes al agua y 100% indetectables.",
  keywords: [
    "beneficios prótesis capilar",
    "prótesis capilar vs trasplante",
    "prótesis capilar gimnasio piscina",
    "malla suiza micro piel bogota",
    "procap natural beneficios"
  ],
};

export default function BeneficiosPage() {
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573151189795";

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 pt-6 pb-20 relative z-10">
      
      {/* Ambient Glows */}
      <div className="glow-ambient top-0 left-1/3 -translate-x-1/2"></div>
      <div className="glow-ambient top-[40%] right-[-80px]"></div>

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-sky-400/40 text-sky-300 text-xs sm:text-sm font-semibold mb-6 shadow-inner">
          <Sparkles size={14} className="text-sky-400 animate-pulse" />
          <span>Tecnología Capilar de Vanguardia • Chicó Norte, Bogotá</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          ¿Por Qué Elegir una <span className="text-cyan-gradient">Prótesis Capilar Indetectable</span>?
        </h1>

        <p className="mt-6 text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          Una solución estética no quirúrgica, sin dolor ni tiempos de recuperación, que te devuelve una cabellera densa, juvenil y con libertad absoluta para realizar cualquier actividad deportiva o social.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`https://wa.me/${whatsappPhone}?text=¡Hola%20Procap%20Natural!%20👋%20Deseo%20conocer%20más%20sobre%20los%20beneficios%20y%20agendar%20mi%20valoración.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-sm flex items-center gap-2.5 shadow-xl shadow-emerald-500/25 transition-all hover:scale-105"
          >
            <i className="fa-brands fa-whatsapp text-lg"></i>
            <span>Agendar Valoración Gratuita</span>
          </a>

          <Link
            href="/cotizador"
            className="px-6 py-3.5 rounded-xl glass-panel hover:bg-white/10 text-white font-bold text-sm flex items-center gap-2 border border-white/20 hover:border-sky-400 transition-all"
          >
            <Zap size={16} className="text-sky-400" />
            <span>Cotizador en Línea</span>
          </Link>
        </div>
      </div>

      {/* 4 Pilares Principales */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="glass-panel rounded-3xl p-7 border border-slate-800 hover:border-sky-400/50 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sky-300 transition-colors">100% Indetectable</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Fabricadas sobre micro-mallas suizas o ultra-skin de 0.03 mm donde cada cabello humano se anuda artesanalmente imitando los folículos naturales.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 border-t border-slate-800/80 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" /> Línea frontal invisible
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" /> Fundición dérmica exacta
              </li>
            </ul>
          </div>

          <div className="glass-panel rounded-3xl p-7 border border-slate-800 hover:border-sky-400/50 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <Waves size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">Vida Activa & Agua</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Adhesivos poliméricos de grado médico resistentes al sudor extremo, agua de piscina, mar, duchas calientes y uso de casco de moto.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 border-t border-slate-800/80 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" /> Cero riesgo de desprendimiento
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" /> Natación y crossfit diarios
              </li>
            </ul>
          </div>

          <div className="glass-panel rounded-3xl p-7 border border-slate-800 hover:border-sky-400/50 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-sky-400 mb-6 group-hover:scale-110 transition-transform">
              <Wind size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sky-300 transition-colors">Transpirable & Cómoda</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Micro-poros que permiten oxigenar el cuero cabelludo impidiendo la acumulación de humedad, malos olores o irritaciones dérmicas.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 border-t border-slate-800/80 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" /> Materiales hipoalergénicos
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" /> Sensación ultra ligera
              </li>
            </ul>
          </div>

          <div className="glass-panel rounded-3xl p-7 border border-slate-800 hover:border-sky-400/50 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
              <Scissors size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">Corte & Peinado Libre</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Al ser 100% cabello humano genuino, puedes aplicar cera, gel, plancha moderada o pedir cualquier estilo: degradado (fade), tupé o clásico.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 border-t border-slate-800/80 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" /> Desvanecido impecable
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" /> Libertad de peinado
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Tabla Comparativa: Prótesis vs Injerto vs Medicamentos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-sky-400/30 shadow-2xl">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Análisis Comparativo</span>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-white mt-2 mb-4">
              Prótesis Capilar vs. Trasplante Capilar vs. Fármacos
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Compara de manera transparente las diferentes opciones disponibles para solucionar la alopecia masculina.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-4 font-bold text-white">Factor de Decisión</th>
                  <th className="py-4 px-4 font-black text-sky-400 bg-sky-500/10 border-x border-sky-400/30">
                    <div className="flex items-center gap-2">
                      <Crown size={16} />
                      <span>Prótesis Procap Natural</span>
                    </div>
                  </th>
                  <th className="py-4 px-4 font-semibold text-slate-300">Injerto / Trasplante FUE</th>
                  <th className="py-4 px-4 font-semibold text-slate-300">Medicamentos / Minoxidil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="py-4 px-4 font-bold text-white">Tiempo de Resultados</td>
                  <td className="py-4 px-4 font-black text-emerald-400 bg-sky-500/5 border-x border-sky-400/20">
                    Inmediato (en 2 horas sales con cabello completo)
                  </td>
                  <td className="py-4 px-4 text-slate-400">9 a 18 meses de espera postoperatoria</td>
                  <td className="py-4 px-4 text-slate-400">Mínimo 6 meses (resultados muy lentos y variables)</td>
                </tr>

                <tr>
                  <td className="py-4 px-4 font-bold text-white">Densidad y Cobertura</td>
                  <td className="py-4 px-4 font-black text-emerald-400 bg-sky-500/5 border-x border-sky-400/20">
                    100% personalizada (densidad alta y volumen perfecto)
                  </td>
                  <td className="py-4 px-4 text-slate-400">Limitada por tu zona donante occipital</td>
                  <td className="py-4 px-4 text-slate-400">Baja a moderada; no cubre calvicies avanzadas</td>
                </tr>

                <tr>
                  <td className="py-4 px-4 font-bold text-white">Dolor & Cirugía</td>
                  <td className="py-4 px-4 font-black text-emerald-400 bg-sky-500/5 border-x border-sky-400/20">
                    0% Dolor • Cero Cirugías • No Invasivo
                  </td>
                  <td className="py-4 px-4 text-red-400">Quirófano, anestesia, cicatrices y dolor postoperatorio</td>
                  <td className="py-4 px-4 text-slate-400">Sin dolor físico directo</td>
                </tr>

                <tr>
                  <td className="py-4 px-4 font-bold text-white">Efectos Secundarios</td>
                  <td className="py-4 px-4 font-black text-emerald-400 bg-sky-500/5 border-x border-sky-400/20">
                    Ninguno (materiales hipoalergénicos certificados)
                  </td>
                  <td className="py-4 px-4 text-red-400">Infecciones, rechazo folicular, pérdida por shock loss</td>
                  <td className="py-4 px-4 text-red-400">Riesgo de efectos hormonales, disfunción o rebote al suspender</td>
                </tr>

                <tr>
                  <td className="py-4 px-4 font-bold text-white">Costo de Entrada</td>
                  <td className="py-4 px-4 font-black text-emerald-400 bg-sky-500/5 border-x border-sky-400/20">
                    Accesible desde $850.000 COP
                  </td>
                  <td className="py-4 px-4 text-red-400">Alto ($8.000.000 a $25.000.000 COP)</td>
                  <td className="py-4 px-4 text-slate-400">Gasto mensual continuo de por vida</td>
                </tr>

                <tr>
                  <td className="py-4 px-4 font-bold text-white">Garantía Estética</td>
                  <td className="py-4 px-4 font-black text-emerald-400 bg-sky-500/5 border-x border-sky-400/20">
                    Total control sobre color, corte y diseño frontal
                  </td>
                  <td className="py-4 px-4 text-slate-400">Incierta (depende del prendimiento folicular)</td>
                  <td className="py-4 px-4 text-slate-400">Incierta e impredecible</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* Tipos de Bases Tecnológicas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Ingeniería Capilar</span>
          <h2 className="text-3xl sm:text-4xl font-black font-heading text-white mt-2 mb-4">
            Bases Capilares de <span className="text-cyan-gradient">Última Generación</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Utilizamos las 3 tecnologías de base líderes a nivel mundial para garantizar máxima durabilidad e invisibilidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-panel rounded-3xl p-8 border border-white/10 flex flex-col justify-between hover:border-sky-400/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 mb-6">
                <Crown size={24} />
              </div>
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest block mb-1">Malla Suiza / French Lace</span>
              <h3 className="text-xl font-bold text-white mb-3">Máxima Transpiración</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Estructura de malla con micro-tejido ultraligero. Permite que el agua y el aire fluyan directamente hacia la piel. Ideal para deportistas de alto rendimiento o personas que sudan con facilidad.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-1">
              <p>• Transpirabilidad: <strong>10/10</strong></p>
              <p>• Durabilidad promedio: <strong>4 a 8 meses</strong></p>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-8 border border-white/10 flex flex-col justify-between hover:border-sky-400/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-6">
                <ShieldCheck size={24} />
              </div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">Ultra-Thin Skin (0.03 mm)</span>
              <h3 className="text-xl font-bold text-white mb-3">Línea Frontal 100% Invisible</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Película de poliuretano hiperfina que se adhiere como una segunda piel. No tiene textura perceptible al tacto y permite peinados hacia atrás con total seguridad.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-1">
              <p>• Invisibilidad frontal: <strong>10/10</strong></p>
              <p>• Durabilidad promedio: <strong>3 a 6 meses</strong></p>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-8 border border-white/10 flex flex-col justify-between hover:border-sky-400/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-6">
                <Award size={24} />
              </div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">Sistemas Mixtos / Híbridos</span>
              <h3 className="text-xl font-bold text-white mb-3">El Equilibrio Perfecto</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Centro de malla para frescura total, frontal de ultra-skin invisible y perímetro reforzado con poliuretano para facilitar la limpieza y prolongar su vida útil.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-1">
              <p>• Versatilidad y resistencia: <strong>10/10</strong></p>
              <p>• Durabilidad promedio: <strong>6 a 12 meses</strong></p>
            </div>
          </div>

        </div>
      </section>

      {/* Banner CTA Final */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-sky-400/40 text-center relative overflow-hidden bg-gradient-to-r from-blue-950/60 via-[#031C45] to-slate-950">
          <div className="max-w-2xl mx-auto space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Atención Privada en Bogotá</span>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-white">
              ¿Listo para dar el paso hacia tu mejor versión?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Ven a nuestra sede en Chicó Norte o solicita asesoría virtual privada por WhatsApp. Evaluamos tu tipo de cabello y te sugerimos el sistema ideal sin compromiso.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href={`https://wa.me/${whatsappPhone}?text=¡Hola%20Procap%20Natural!%20👋%20Leí%20los%20beneficios%20y%20quiero%20agendar%20mi%20cita%20en%20Chicó%20Norte.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all hover:scale-105"
              >
                <i className="fa-brands fa-whatsapp text-xl"></i>
                <span>Chatear con un Especialista</span>
              </a>

              <Link
                href="/catalogo"
                className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel hover:bg-white/10 text-white font-bold text-sm flex items-center justify-center gap-2 border border-white/20 transition-all"
              >
                <span>Ver Catálogo Completo</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
}
