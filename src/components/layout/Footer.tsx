"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573151189795";

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          <div className="space-y-3 lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-lg font-black font-heading tracking-tight text-white">
                PROCAP <span className="text-sky-400">NATURAL</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Especialistas en la adaptación, instalación y mantenimiento de prótesis capilares masculinas indetectables de cabello 100% humano en <strong>Bogotá</strong>, <strong>Cali</strong>, <strong>Neiva</strong> y <strong>Barranquilla</strong>.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <a
                href="https://maps.google.com/?q=Cra.+16+%2396-64,+Bogot%C3%A1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-sky-500/20 text-slate-300 hover:text-sky-300 border border-slate-800 hover:border-sky-500/40 transition-all font-medium text-[11px] group"
              >
                <i className="fa-solid fa-location-dot text-sky-400 group-hover:scale-110 transition-transform"></i>
                <span>Cra 16 #96-64 (Bogotá)</span>
              </a>

              <a
                href="https://maps.google.com/?q=Calle+16+%2383A-15,+Cali"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-all font-medium text-[11px] group"
              >
                <i className="fa-solid fa-location-dot text-amber-400 group-hover:scale-110 transition-transform"></i>
                <span>Cali • Neiva • Barranquilla</span>
              </a>

              <a
                href={`https://wa.me/${whatsappPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-all font-medium text-[11px] group"
              >
                <i className="fa-brands fa-whatsapp text-emerald-400 group-hover:scale-110 transition-transform"></i>
                <span>+{whatsappPhone}</span>
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white block mb-2">Explorar</span>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/" className="hover:text-sky-400 transition-colors">Inicio</Link></li>
              <li><Link href="/beneficios" className="hover:text-sky-400 transition-colors">Beneficios del Sistema</Link></li>
              <li><Link href="/servicios" className="hover:text-sky-400 transition-colors">Servicios & Instalación</Link></li>
              <li><Link href="/catalogo" className="hover:text-sky-400 transition-colors">Catálogo de Productos</Link></li>
              <li><Link href="/cotizador" className="hover:text-sky-400 transition-colors">Cotizador Rápido</Link></li>
              <li><Link href="/eventos" className="hover:text-sky-400 transition-colors">Giras & Eventos</Link></li>
              <li><Link href="/ubicacion" className="hover:text-sky-400 transition-colors">4 Sedes Colombia</Link></li>
              <li><Link href="/faqs" className="hover:text-sky-400 transition-colors">Preguntas Frecuentes</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block mb-2">Políticas & Legal</span>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/legal/habeas-data" className="hover:text-sky-400 transition-colors">Habeas Data (Ley 1581)</Link></li>
              <li><Link href="/unsubscribe" className="hover:text-amber-400 text-slate-300 font-medium transition-colors">🔕 Desuscribirse de Promociones</Link></li>
              <li><Link href="/legal/devoluciones-garantias" className="hover:text-sky-400 transition-colors">Garantías & Devoluciones</Link></li>
              <li><Link href="/legal/terminos-condiciones" className="hover:text-sky-400 transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/legal/uso-ia-iso42001" className="hover:text-sky-400 transition-colors text-amber-400/90 font-medium">Uso Ético IA (ISO 42001)</Link></li>
              <li><Link href="/legal/uso-imagen" className="hover:text-sky-400 transition-colors">Uso de Imagen & Testimonios</Link></li>
              <li><Link href="/legal" className="hover:text-sky-300 text-sky-400 font-bold transition-colors">→ Centro Legal Completo</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white block mb-2">Síguenos</span>
            <div className="flex gap-3 text-base text-slate-300">
              <a href="https://www.tiktok.com/@procapnatural" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors" aria-label="TikTok">
                <i className="fa-brands fa-tiktok"></i>
              </a>
              <a href="https://instagram.com/protesiscapilarnatural" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://facebook.com/procapnatural" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors" aria-label="Facebook">
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a href={`https://wa.me/${whatsappPhone}`} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors" aria-label="WhatsApp">
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            </div>
            <p className="text-[11px] text-slate-500 pt-2 leading-relaxed">
              Atención 100% personalizada con reserva previa en cabinas individuales.
            </p>
          </div>

        </div>

        {/* Firma Oficial SEO J&M Tech Solutions */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-500 footer-copyright">
          <p>&copy; 2026 Procap Natural. Todos los derechos reservados.</p>
          <p>Desarrollado por <a href="https://www.jymtechsolutions.online/es" hrefLang="es" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "inherit" }} className="hover:text-sky-400 font-semibold transition-colors">J&M Tech Solutions</a></p>
        </div>

      </div>
    </footer>
  );
}
