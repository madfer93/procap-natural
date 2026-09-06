"use client";

import React from "react";
import { usePathname } from "next/navigation";

export function WhatsAppFloatingButton() {
  const pathname = usePathname();
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573151189795";

  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-5 sm:right-6 z-40 flex items-center gap-2 group">
      
      {/* Tooltip on hover */}
      <span className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-slate-950/90 text-slate-200 text-xs font-bold border border-emerald-500/30 shadow-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        ¿Dudas? Escríbenos a WhatsApp
      </span>

      {/* Floating Button */}
      <a
        href={`https://wa.me/${whatsappPhone}?text=¡Hola%20Procap%20Natural!%20👋%20Deseo%20solicitar%20asesoría%20sobre%20prótesis%20capilares%20en%20Bogotá.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp a Procap Natural"
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/40 transition-transform hover:scale-110 active:scale-95 pulse-whatsapp"
        style={{ width: "54px", height: "54px" }}
      >
        <i className="fa-brands fa-whatsapp text-2xl text-white"></i>
      </a>

    </div>
  );
}
