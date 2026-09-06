"use client";

import React, { useState, useRef } from "react";
import { 
  Play, 
  Pause, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Flame, 
  Crown,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface ReelItem {
  id: string;
  title: string;
  tag: string;
  category: "transformacion" | "instalacion" | "mantenimiento" | "deporte";
  videoUrl: string;
  posterUrl?: string;
  views?: string;
  source: "instagram" | "tiktok" | "direct";
  socialUrl?: string;
}

const DEFAULT_REELS: ReelItem[] = [
  {
    id: "reel-1",
    title: "Transformación Total: De Alopecia Severa a Línea Frontal 100% Invisible",
    tag: "🔥 Más Viral",
    category: "transformacion",
    videoUrl: "https://pub-426a082ba0a64de0bcf1da7c816f7c38.r2.dev/PROCAPS-OFICINA.mp4",
    views: "142K vistas",
    source: "tiktok",
    socialUrl: "https://www.tiktok.com/@procapnatural"
  },
  {
    id: "reel-2",
    title: "Prueba de Agua & Deporte: Resistencia Extrema en Gimnasio y Piscina",
    tag: "⚡ Indestructible",
    category: "deporte",
    videoUrl: "https://pub-426a082ba0a64de0bcf1da7c816f7c38.r2.dev/PROCAPS-OFICINA.mp4",
    views: "98K vistas",
    source: "instagram",
    socialUrl: "https://instagram.com/protesiscapilarnatural"
  },
  {
    id: "reel-3",
    title: "Paso a Paso en Cabina VIP: Adaptación y Corte Personalizado en Bogotá",
    tag: "⭐ Salón Chicó",
    category: "instalacion",
    videoUrl: "https://pub-426a082ba0a64de0bcf1da7c816f7c38.r2.dev/PROCAPS-OFICINA.mp4",
    views: "64K vistas",
    source: "tiktok",
    socialUrl: "https://www.tiktok.com/@procapnatural"
  },
  {
    id: "reel-4",
    title: "Mantenimiento Preventivo: Retiro Suave con C-22 y Cuero Cabelludo Sano",
    tag: "💆 Mantenimiento",
    category: "mantenimiento",
    videoUrl: "https://pub-426a082ba0a64de0bcf1da7c816f7c38.r2.dev/PROCAPS-OFICINA.mp4",
    views: "53K vistas",
    source: "instagram",
    socialUrl: "https://instagram.com/protesiscapilarnatural"
  }
];

export function TransformacionesReels() {
  const [activeReel, setActiveReel] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573151189795";

  const handlePlayToggle = (id: string) => {
    const currentVideo = videoRefs.current[id];
    if (!currentVideo) return;

    if (activeReel === id) {
      currentVideo.pause();
      setActiveReel(null);
    } else {
      // Pause any previously playing video
      if (activeReel && videoRefs.current[activeReel]) {
        videoRefs.current[activeReel]?.pause();
      }
      currentVideo.play();
      setActiveReel(id);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#031C45] via-[#041e4c] to-[#031C45] border-t border-slate-800/80 relative overflow-hidden">
      
      {/* Glows */}
      <div className="glow-ambient top-[20%] left-[-150px]"></div>
      <div className="glow-ambient bottom-[-100px] right-[-100px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-sky-400/40 text-sky-300 text-xs font-bold mb-3 shadow-inner">
              <Flame size={14} className="text-amber-400" />
              <span>Contenido Viral en TikTok & Instagram Reels</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-white tracking-tight">
              Transformaciones Reales & <span className="text-cyan-gradient">Resultados en Video</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
              Mira cómo cientos de hombres en Bogotá y Colombia recuperaron su imagen con prótesis 100% indetectables.
            </p>
          </div>

          {/* Social Links & Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.tiktok.com/@procapnatural"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl glass-panel hover:bg-white/10 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 hover:border-cyan-400 transition-all"
            >
              <i className="fa-brands fa-tiktok text-cyan-400 text-sm"></i>
              <span>TikTok Oficial</span>
            </a>

            <a
              href="https://instagram.com/protesiscapilarnatural"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl glass-panel hover:bg-white/10 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 hover:border-pink-400 transition-all"
            >
              <i className="fa-brands fa-instagram text-pink-400 text-sm"></i>
              <span>Instagram (5.7K)</span>
            </a>

            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => scroll("left")}
                aria-label="Desplazar a la izquierda"
                className="w-10 h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label="Desplazar a la derecha"
                className="w-10 h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Reels Carousel (Touch Friendly en Móvil) */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {DEFAULT_REELS.map((reel) => {
            const isThisPlaying = activeReel === reel.id;

            return (
              <div
                key={reel.id}
                className="w-[260px] sm:w-[280px] lg:w-[300px] shrink-0 snap-center group relative rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl transition-all duration-300 hover:border-sky-400/50 hover:shadow-sky-500/10"
              >
                {/* 9:16 Aspect Ratio Container */}
                <div className="relative aspect-[9/16] w-full bg-slate-950 overflow-hidden">
                  
                  <video
                    ref={(el) => { videoRefs.current[reel.id] = el; }}
                    src={reel.videoUrl}
                    loop
                    muted={isMuted}
                    playsInline
                    preload="none"
                    onClick={() => handlePlayToggle(reel.id)}
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-[1.02]"
                  />

                  {/* Top Overlay Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-white border border-white/10 shadow">
                      {reel.tag}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] text-slate-300 flex items-center gap-1 border border-white/5">
                      {reel.source === "instagram" ? (
                        <i className="fa-brands fa-instagram text-pink-400"></i>
                      ) : (
                        <i className="fa-brands fa-tiktok text-cyan-400"></i>
                      )}
                      <span>{reel.views}</span>
                    </span>
                  </div>

                  {/* Central Play/Pause Button on Hover or Paused */}
                  <div 
                    onClick={() => handlePlayToggle(reel.id)}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
                  >
                    {!isThisPlaying && (
                      <div className="w-14 h-14 rounded-full bg-sky-500/90 hover:bg-sky-400 text-slate-950 flex items-center justify-center shadow-xl shadow-sky-500/30 transition-transform hover:scale-110">
                        <Play size={24} className="translate-x-0.5" />
                      </div>
                    )}
                  </div>

                  {/* Sound Toggle (Top Right inside video) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                    }}
                    className="absolute bottom-24 right-3 w-8 h-8 rounded-full bg-slate-950/80 backdrop-blur-md text-white flex items-center justify-center border border-white/10 shadow z-20 hover:scale-105"
                  >
                    {isMuted ? <VolumeX size={14} className="text-slate-400" /> : <Volume2 size={14} className="text-emerald-400" />}
                  </button>

                  {/* Bottom Video Card Info */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-20">
                    <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug">
                      {reel.title}
                    </h3>

                    <div className="mt-2.5 flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                      <a
                        href={`https://wa.me/${whatsappPhone}?text=¡Hola!%20Vi%20el%20video%20"${encodeURIComponent(reel.title)}"%20y%20quiero%20cotizar.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-black text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                      >
                        <span>Quiero este cambio</span>
                        <span>→</span>
                      </a>

                      <a
                        href={reel.socialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5"
                      >
                        <span>Ver en Redes</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA to WhatsApp / Valoración */}
        <div className="mt-8 text-center">
          <a
            href={`https://wa.me/${whatsappPhone}?text=¡Hola%20Procap%20Natural!%20👋%20Vi%20sus%20videos%20de%20transformaciones%20y%20deseo%20una%20valoración%20para%20mi%20caso.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <i className="fa-brands fa-whatsapp text-lg"></i>
            <span>Solicitar Valoración para mi Caso</span>
          </a>
        </div>

      </div>

    </section>
  );
}
