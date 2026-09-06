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
    { href: "/catalogo", label: "Catálogo & Precios" },
    { href: "/servicios", label: "Servicios" },
    { href: "/eventos", label: "Giras & Eventos" },
    { href: "/ubicacion", label: "Sedes" },
    { href: "/cotizador", label: "Cotizador" },
    { href: "/faqs", label: "Preguntas" },
  ];

  return (
    <>
      {/* Top Bar (Informativo, compacto y clickeable) */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 text-xs text-slate-400 py-1.5 px-4 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-3">
            <Link href="/ubicacion" className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors font-medium truncate">
              <MapPin size={12} className="shrink-0 text-sky-400" />
              <span className="truncate">Sede Bogotá: Calle 16 #83a-15</span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Atendiendo Citas
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a href="https://www.tiktok.com/@procapnatural" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
              <i className="fa-brands fa-tiktok text-xs text-cyan-400"></i>
              <span className="hidden md:inline">TikTok</span>
            </a>
            <a href="https://instagram.com/protesiscapilarnatural" target="_blank" rel="noopener noreferrer" className="hover:text-pink-300 transition-colors flex items-center gap-1">
              <i className="fa-brands fa-instagram text-xs text-pink-400"></i>
              <span className="hidden md:inline">@protesiscapilarnatural</span>
            </a>
          </div>
        </div>
      </header>

      {/* Navbar Principal (Sticky Top 0 Limpio y Ultra-Responsivo) */}
      <nav className="glass-nav sticky top-0 z-40 transition-all duration-300 border-b border-white/10 bg-[#031C45]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-2">

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400/30 via-slate-800 to-blue-900/50 p-0.5 shadow-lg shadow-sky-500/10 group-hover:scale-105 transition-transform border border-sky-400/30">
                <div className="w-full h-full bg-[#031C45] rounded-[14px] flex items-center justify-center p-1 overflow-hidden">
                  <Image
                    src="/favicons/android-chrome-192x192.png"
                    alt="Procap Logo"
                    width={32}
                    height={32}
                    className="object-contain rounded-lg"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black font-heading tracking-tight text-white flex items-center gap-1">
                  PROCAP <span className="text-sky-400">NATURAL</span>
                </span>
                <span className="hidden sm:block text-[8.5px] tracking-wider text-slate-400 font-bold uppercase">
                  Prótesis Capilares Indetectables
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center justify-center gap-1 text-[13px] font-semibold text-slate-300">
              {navLinks.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-2.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${isActive
                      ? "bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30 shadow-sm"
                      : "hover:text-white hover:bg-white/5 text-slate-300"
                      }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/agendar"
                className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] whitespace-nowrap"
              >
                <i className="fa-regular fa-calendar-check text-slate-950"></i>
                <span className="hidden xs:inline">Agendar Cita</span>
                <span className="xs:hidden">Cita</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-800 bg-[#031C45]/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2.5 px-3.5 rounded-xl text-sm font-semibold transition-colors ${pathname === item.href
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
      </nav >
    </>
  );
}
