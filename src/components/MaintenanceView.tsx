"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Server,
  RotateCw,
  Activity,
  Clock,
  Lock,
  ArrowRight
} from "lucide-react";
import { WhatsAppIcon } from "@/components/BrandIcons";

export function MaintenanceView() {
  const [checking, setChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Línea oficial del dueño del sitio (Procap Natural) para atención directa
  const ownerWhatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573151189795";
  const whatsappOwnerUrl = `https://wa.me/${ownerWhatsapp}?text=${encodeURIComponent(
    "Hola, intento ingresar a la página web de Procap Natural pero me aparece un aviso de mantenimiento técnico (Código SVC-INFRA-402). Deseo comunicarme directamente con ustedes."
  )}`;

  const handleRefresh = () => {
    setChecking(true);
    setStatusMessage(null);
    setTimeout(() => {
      setChecking(false);
      setStatusMessage("Verificación del sistema: El servicio permanece en pausa programada de mantenimiento y actualización.");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#031C45] text-slate-100 flex flex-col justify-between font-sans selection:bg-sky-500 selection:text-white">
      {/* Background Glows & Ambient Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_120%,rgba(3,105,161,0.2),rgba(255,255,255,0))] pointer-events-none" />

      {/* Grid de fondo estilo Cloud Infrastructure */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      {/* Top Header */}
      <header className="relative z-10 w-full border-b border-white/10 bg-[#031C45]/80 backdrop-blur-xl px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Logo y Nombre */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400/30 via-slate-800 to-blue-900/50 p-0.5 shadow-lg shadow-sky-500/10 border border-sky-400/30">
              <div className="w-full h-full bg-[#031C45] rounded-[14px] flex items-center justify-center p-1 overflow-hidden">
                <Image
                  src="/favicons/android-chrome-192x192.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="object-contain rounded-lg"
                />
              </div>
            </div>
            <div>
              <span className="text-base sm:text-lg font-black font-heading tracking-tight text-white flex items-center gap-1">
                PROCAP <span className="text-sky-400">NATURAL</span>
              </span>
              <p className="text-[10px] tracking-wider text-slate-400 font-semibold uppercase">
                Servicios Web & Plataforma Digital
              </p>
            </div>
          </div>

          {/* Badge de Estado del Sistema */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>Mantenimiento Preventivo & Actualización de Servidores</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col justify-center">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-2xl p-6 sm:p-12 shadow-2xl relative overflow-hidden">

          {/* Luz de acento superior */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent" />

          {/* Icono central de servidor */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-sky-500/20 via-blue-600/10 to-indigo-950/40 border border-sky-400/30 flex items-center justify-center shadow-xl shadow-sky-500/10">
                <Server className="w-10 h-10 sm:w-12 sm:h-12 text-sky-400 animate-pulse" />
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 backdrop-blur-md">
                <Activity className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Título Principal */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight mb-3">
              Plataforma en Mantenimiento de Infraestructura
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Actualmente los servicios web de este portal se encuentran en una <span className="text-sky-300 font-semibold">pausa técnica programada</span> por optimización de servidores, actualización de base de datos y verificación de protocolos de servicio.
            </p>
          </div>

          {/* Matriz Técnica de Estado */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-white/5 mb-8 text-xs">
            <div className="p-2.5 rounded-xl bg-white/[0.02]">
              <span className="text-slate-500 block mb-1">Código de Evento</span>
              <span className="font-mono font-bold text-sky-400">SVC-INFRA-402</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02]">
              <span className="text-slate-500 block mb-1">Módulo Afectado</span>
              <span className="font-semibold text-slate-200">Core Web Application</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02]">
              <span className="text-slate-500 block mb-1">Estado de Operación</span>
              <span className="font-semibold text-amber-400">Pausa Preventiva</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02]">
              <span className="text-slate-500 block mb-1">Seguridad del Nodo</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> TLS 1.3 Activo
              </span>
            </div>
          </div>

          {/* Tarjetas Informativas */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {/* Clientes y Visitantes */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-2.5 text-sky-400 font-bold text-sm mb-2">
                <Clock className="w-4 h-4" />
                <span>Para Clientes y Visitantes</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lamentamos los posibles inconvenientes. Las labores de actualización y ajuste en infraestructura se encuentran en curso para restablecer el servicio a la brevedad.
              </p>
            </div>

            {/* Administración del Servicio */}
            <div className="p-5 rounded-2xl bg-amber-500/[0.04] border border-amber-500/20">
              <div className="flex items-center gap-2.5 text-amber-300 font-bold text-sm mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Titular & Administración de Cuenta</span>
              </div>
              <p className="text-xs text-slate-300/90 leading-relaxed">
                Si usted es el titular o administrador de este servicio, por favor comuníquese directamente con su proveedor de infraestructura técnica y desarrollo web para gestionar la reactivación de la plataforma.
              </p>
            </div>
          </div>

          {/* Zona de Botones de Acción */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={whatsappOwnerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>Contactar a Procap Natural (Atención Directa)</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>

            <button
              onClick={handleRefresh}
              disabled={checking}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-white/10 text-slate-300 font-semibold text-sm transition-all disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${checking ? "animate-spin text-sky-400" : ""}`} />
              <span>{checking ? "Comprobando..." : "Verificar Estatus"}</span>
            </button>
          </div>

          {/* Feedback de Verificación */}
          {statusMessage && (
            <div className="mt-4 p-3 rounded-xl bg-sky-950/50 border border-sky-500/30 text-sky-300 text-xs text-center">
              {statusMessage}
            </div>
          )}

        </div>
      </main>

      {/* Footer Neutral */}
      <footer className="relative z-10 w-full border-t border-white/5 py-4 px-4 text-center text-xs text-slate-500 bg-[#031C45]/80 backdrop-blur-md">
        <p>
          Infraestructura de servidores bajo protocolos de monitoreo, actualización y mantenimiento de servicios cloud.
        </p>
        <p className="mt-1 text-[11px] text-slate-600">
          Procap Natural © {new Date().getFullYear()} • Desarrollado y administrado por{" "}
          <a
            href="https://www.jymtechsolutions.online/es"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300 underline font-medium transition-colors"
          >
            J&M Tech Solutions
          </a>
        </p>
      </footer>
    </div>
  );
}
