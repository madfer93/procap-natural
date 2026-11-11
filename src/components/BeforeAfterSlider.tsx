"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Sparkles, MoveHorizontal, CheckCircle2, Crown, ShieldCheck } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
  subtitle?: string;
}

export function BeforeAfterSlider({
  beforeImage = "/images/antes-procap.jpg",
  afterImage = "/hero-poster.webp",
  beforeLabel = "Antes (Alopecia)",
  afterLabel = "Después (Prótesis Indetectable)",
  title = "Transformación Real e Inmediata",
  subtitle = "Desliza para comprobar cómo una prótesis capilar 100% de cabello humano transforma por completo tu apariencia."
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const position = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPosition(position);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-[#031C45] via-[#021535] to-[#031C45] border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-sky-400/40 text-sky-300 text-xs font-bold shadow-inner">
            <Sparkles size={14} className="text-amber-400 animate-pulse" />
            <span>Comparador Interactivo 50/50</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight">
            {title}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Interactive Slider Container */}
        <div className="max-w-4xl mx-auto">
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl overflow-hidden glass-panel border border-sky-400/30 shadow-2xl select-none cursor-ew-resize group"
          >
            {/* Imagen DESPUÉS (Fondo completo) */}
            <div className="absolute inset-0">
              <img
                src={afterImage}
                alt={afterLabel}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>{afterLabel}</span>
              </div>
            </div>

            {/* Imagen ANTES (Clip con posición del slider) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={beforeImage}
                alt={beforeLabel}
                className="w-full h-full object-cover filter contrast-105"
                onError={(e) => {
                  // Fallback visual si no existe la imagen local
                  (e.target as HTMLElement).style.filter = "grayscale(80%) brightness(70%)";
                }}
              />
              <div className="absolute bottom-4 left-4 bg-slate-950/90 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg backdrop-blur-md">
                <span>{beforeLabel}</span>
              </div>
            </div>

            {/* Línea Divisoria y Controlador Deslizante */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-sky-400 via-white to-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.8)] pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Botón Circular Central */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-950 border-2 border-sky-400 text-sky-400 flex items-center justify-center shadow-2xl shadow-sky-500/50 group-hover:scale-110 transition-transform">
                <MoveHorizontal size={20} className="text-sky-300" />
              </div>
            </div>

            {/* Hint en móvil */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-slate-300 font-bold border border-slate-800 pointer-events-none">
              👈 Arrastra para comparar 👉
            </div>
          </div>

          {/* Badges de confianza debajo del slider */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-center text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-300 flex items-center justify-center gap-2">
              <ShieldCheck size={16} className="text-sky-400 shrink-0" />
              <span>Base ultra fina de 0.03 mm</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-300 flex items-center justify-center gap-2">
              <Crown size={16} className="text-amber-400 shrink-0" />
              <span>Cabello 100% natural humano</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-300 flex items-center justify-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Colocación completa en 2 horas</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

