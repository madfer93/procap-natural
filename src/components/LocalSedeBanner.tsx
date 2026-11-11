"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, ArrowRight, X, Sparkles, Building2 } from "lucide-react";

interface SedePrompt {
  city: string;
  name: string;
  address: string;
  url: string;
}

const SEDES_PROMPTS: Record<string, SedePrompt> = {
  cali: {
    city: "Cali",
    name: "Sede Cali (Edificio María Mercedes)",
    address: "Calle 16 #83A-15 • Barrio Ingenio",
    url: "/protesis-capilar-cali",
  },
  bogota: {
    city: "Bogotá",
    name: "Sede Principal Bogotá",
    address: "Cra 16 #96-64 • Chicó Norte",
    url: "/protesis-capilar-bogota",
  },
  barranquilla: {
    city: "Barranquilla",
    name: "Sede Barranquilla",
    address: "Calle 64 #46-69 • Centro Histórico",
    url: "/protesis-capilar-barranquilla",
  },
  neiva: {
    city: "Neiva",
    name: "Sede Neiva",
    address: "Cra 22 #25C-12 • Canaima",
    url: "/protesis-capilar-neiva",
  },
};

export function LocalSedeBanner() {
  const [detectedSede, setDetectedSede] = useState<SedePrompt | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const isDismissed = sessionStorage.getItem("procap_sede_dismissed");
      if (isDismissed) {
        setDismissed(true);
        return;
      }

      // Detectar zona horaria o ciudad del navegador
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      // En Colombia casi todas las IPs están en America/Bogota, mostramos sugerencia rotativa o fija de Chicó y Cali
      const savedCity = localStorage.getItem("procap_preferred_city")?.toLowerCase();
      if (savedCity && SEDES_PROMPTS[savedCity]) {
        setDetectedSede(SEDES_PROMPTS[savedCity]);
      } else {
        // Por defecto sugerir sedes con alta conversión
        setDetectedSede(SEDES_PROMPTS.bogota);
      }
    } catch (e) {}
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem("procap_sede_dismissed", "true");
    } catch (e) {}
  };

  if (dismissed || !detectedSede) return null;

  return (
    <div className="bg-gradient-to-r from-[#073374] via-[#031C45] to-[#073374] border-b border-sky-400/30 text-white text-xs py-2 px-4 relative z-30 transition-all shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span className="font-bold text-sky-300 hidden sm:inline">¿Buscas atención presencial?</span>
          <span className="truncate text-slate-200">
            Tenemos cabinas privadas en <strong>{detectedSede.city}</strong>: {detectedSede.address}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={detectedSede.url}
            className="px-3 py-1 rounded-lg bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-[11px] flex items-center gap-1 transition-colors"
          >
            <span>Ver Sede {detectedSede.city}</span>
            <ArrowRight size={12} />
          </Link>

          <button
            onClick={handleDismiss}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Cerrar aviso"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

