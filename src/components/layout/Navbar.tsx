"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Mail, Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573151189795";

  const navLinks = [
    { href: "/", label: "Inicio", exact: true },
    { href: "/beneficios", label: "Beneficios" },
    { href: "/servicios", label: "Servicios" },
    { href: "/catalogo", label: "Catálogo & Precios" },
    { href: "/cotizador", label: "Cotizador" },
    { href: "/eventos", label: "Giras & Eventos" },
    { href: "/ubicacion", label: "Sedes" },
    { href: "/faqs", label: "Preguntas" },
  ];

  return (
    <>
      {/* Top Bar (Visible e informativo, no invasivo en mobile) */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 text-xs text-slate-400 py-1.5 px-4 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-[11px] sm:text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-sky-400 font-medium truncate">
              <MapPin size={12} className="shrink-0" />
              <span className="truncate">Chicó Norte: Cra 16 #96-64</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Atendiendo Citas
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://www.tiktok.com/@procapnatural" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
              <i className="fa-brands fa-tiktok text-xs text-cyan-400"></i>
              <span className="hidden xs:inline">TikTok</span>
            </a>
            <a href="https://instagram.com/protesiscapilarnatural" target="_blank" rel="noopener noreferrer" className="hover:text-pink-300 transition-colors flex items-center gap-1">
              <i className="fa-brands fa-instagram text-xs text-pink-400"></i>
              <span className="hidden xs:inline">@protesiscapilarnatural</span>
            </a>
          </div>
        </div>
      </header>

      {/* Navbar Principal (Sticky Top 0 Limpio) */}
      <nav className="glass-nav sticky top-0 z-40 transition-all duration-300 border-b border-white/10 bg-[#031C45]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400/30 via-slate-800 to-blue-900/50 p-0.5 shadow-lg shadow-sky-500/10 group-hover:scale-105 transition-transform border border-sky-400/30">
                <div className="w-full h-full bg-[#031C45] rounded-[14px] flex items-center justify-center p-1 overflow-hidden">
                  <Image
                    src="/favicons/android-chrome-192x192.png"
                    alt="Procap Logo"
                    width={36}
                    height={36}
                    className="object-contain rounded-lg"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black font-heading tracking-tight text-white flex items-center gap-1.5">
                  PROCAP <span className="text-sky-400">NATURAL</span>
                </span>
                <span className="block text-[9px] tracking-widest text-slate-400 font-bold uppercase">
                  Prótesis Capilares Indetectables
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center justify-center gap-1 lg:gap-2 text-xs lg:text-sm font-semibold text-slate-300">
              {navLinks.map((item) => {
                const isActive = item.exact 
                  ? pathname === item.href 
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-sky-500/20 text-sky-300 font-bold border border-sky-400/40"
                        : "hover:text-sky-300 hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <a
                href={`https://wa.me/${whatsappPhone}?text=¡Hola%20Procap%20Natural!%20👋%20Deseo%20agendar%20una%20cita%20de%20valoración%20gratuita%20en%20Bogotá.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 whitespace-nowrap"
              >
                <i className="fa-brands fa-whatsapp text-sm text-slate-950"></i>
                <span>Agendar Cita</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-b border-slate-800 bg-[#031C45]/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2.5 px-3.5 rounded-xl text-sm font-semibold transition-colors ${
                  pathname === item.href
                    ? "bg-sky-500/20 text-sky-300 font-bold border border-sky-400/40"
                    : "text-slate-200 hover:bg-white/10 hover:text-sky-400"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsappPhone}?text=¡Hola%20Procap%20Natural!%20👋%20Deseo%20agendar%20una%20cita%20de%20valoración%20gratuita.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <i className="fa-brands fa-whatsapp text-base"></i>
                <span>Agendar Valoración Inmediata</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
