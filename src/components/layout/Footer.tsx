"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573151189795";

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="space-y-3 md:col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-lg font-black font-heading tracking-tight text-white">
                PROCAP <span className="text-sky-400">NATURAL</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Especialistas en la adaptación, instalación y mantenimiento de prótesis capilares masculinas indetectables de cabello humano en Bogotá. Sede en Barrio Chicó Norte.
            </p>
            <div className="pt-2 text-[11px] text-slate-500">
              <p>Carrera 16 #96-64, Bogotá D.C., Colombia • CP: 110221</p>
              <p>Tel: +{whatsappPhone} • Email: procapnatural@gmail.com</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white block mb-2">Páginas</span>
            <ul className="space-y-1.5">
              <li><Link href="/" className="hover:text-sky-400 transition-colors">Inicio</Link></li>
              <li><Link href="/beneficios" className="hover:text-sky-400 transition-colors">Beneficios del Sistema</Link></li>
              <li><Link href="/servicios" className="hover:text-sky-400 transition-colors">Servicios & Instalación</Link></li>
              <li><Link href="/catalogo" className="hover:text-sky-400 transition-colors">Catálogo de Productos</Link></li>
              <li><Link href="/cotizador" className="hover:text-sky-400 transition-colors">Cotizador Rápido</Link></li>
              <li><Link href="/eventos" className="hover:text-sky-400 transition-colors">Giras & Eventos Colombia</Link></li>
              <li><Link href="/ubicacion" className="hover:text-sky-400 transition-colors">Sedes Bogotá & Cali</Link></li>
              <li><Link href="/faqs" className="hover:text-sky-400 transition-colors">Preguntas Frecuentes</Link></li>
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
            <p className="text-[11px] text-slate-500 pt-2">
              Atención personalizada con reserva previa en Chicó Norte.
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
