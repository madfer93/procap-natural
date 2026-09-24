"use client";

import React, { useRef, useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  Zap
} from "lucide-react";

interface SedeVideoPlayerProps {
  title?: string;
  subtitle?: string;
  className?: string;
  autoPlay?: boolean;
  videoUrl?: string;
  badgeText?: string;
  addressText?: string;
}

export function SedeVideoPlayer({
  title = "Recorrido & Acceso a Nuestras Instalaciones",
  subtitle = "Conoce nuestra sede privada antes de tu visita.",
  className = "",
  autoPlay = false,
  videoUrl = "https://pub-426a082ba0a64de0bcf1da7c816f7c38.r2.dev/PROCAPS-OFICINA.mp4",
  badgeText = "Sede Chicó Norte • Bogotá",
  addressText = "Cra 16 #96-64 • Chicó Norte",
}: SedeVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const togglePlay = () => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div ref={containerRef} className={`relative group ${className}`}>
      
      {/* Decorative Glow */}
      <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-sky-500/20 via-cyan-400/20 to-amber-500/20 blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

      <div className="glass-panel rounded-[2rem] p-3 sm:p-4 border border-white/10 shadow-2xl bg-slate-950/80 backdrop-blur-xl overflow-hidden">
        
        {/* Video Container */}
        <div className="relative aspect-video sm:aspect-[16/9] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-white/5">
          
          <video
            ref={videoRef}
            src={hasStarted ? videoUrl : undefined}
            poster="/hero-poster.webp"
            muted={isMuted}
            loop
            playsInline
            preload="none"
            onLoadedData={() => setIsLoaded(true)}
            onClick={togglePlay}
            className="w-full h-full object-cover cursor-pointer transition-transform duration-700 group-hover:scale-[1.01]"
          >
            <track 
              kind="captions" 
              src="/captions/empty.vtt" 
              srcLang="es" 
              label="Español" 
              default 
            />
          </video>

          {/* Top Floating Badges */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between gap-2 pointer-events-none z-20">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-[11px] sm:text-xs font-bold shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <MapPin size={13} className="text-sky-400" />
              <span>{badgeText}</span>
            </div>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-slate-300 text-[11px] font-semibold shadow-lg">
              <Zap size={12} className="text-amber-400" />
              <span>Cloudflare CDN Fast</span>
            </div>
          </div>

          {/* Center Play Overlay when not playing */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-slate-950/30 backdrop-blur-[2px] cursor-pointer transition-opacity z-10"
            >
              <div className="w-16 h-16 rounded-full bg-sky-500/90 text-slate-950 flex items-center justify-center shadow-xl shadow-sky-500/40 transform transition-transform hover:scale-110">
                <Play size={28} className="translate-x-0.5 fill-current" />
              </div>
            </div>
          )}

          {/* Bottom Gradient Overlay & Controls Bar */}
          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent flex items-center justify-between gap-3 z-20">
            
            {/* Play/Pause & Sound controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pausar video de la sede" : "Reproducir video de la sede"}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center justify-center shadow-lg shadow-sky-500/30 transition-all hover:scale-105 active:scale-95"
                title={isPlaying ? "Pausar video" : "Reproducir video"}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="translate-x-0.5" />}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Activar audio del video" : "Silenciar audio del video"}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-white/10 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                title={isMuted ? "Activar audio" : "Silenciar audio"}
              >
                {isMuted ? <VolumeX size={18} className="text-slate-400" /> : <Volume2 size={18} className="text-emerald-400" />}
              </button>

              <div className="hidden sm:flex flex-col ml-2">
                <span className="text-xs font-bold text-white tracking-wide">Acceso & Cabinas VIP</span>
                <span className="text-[10px] text-slate-400">{addressText}</span>
              </div>
            </div>

            {/* Right: Maximize */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleFullscreen}
                aria-label="Ver video en pantalla completa"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-all hover:scale-105"
                title="Pantalla Completa"
              >
                <Maximize size={18} />
              </button>
            </div>

          </div>

        </div>

        {/* Caption below video */}
        <div className="mt-3.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-sky-400 shrink-0" />
            <span>Cabinas individuales y privadas para máxima discreción.</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-amber-400 shrink-0" />
            <span className="text-slate-300 font-medium">Atención con cita previa</span>
          </div>
        </div>

      </div>

    </div>
  );
}
