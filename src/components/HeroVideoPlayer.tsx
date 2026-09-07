"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles, 
  Waves, 
  Wind, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Video
} from "lucide-react";

interface HeroVideoPlayerProps {
  initialVideoUrl?: string;
  initialPosterUrl?: string;
  initialTitle?: string;
  initialBadge?: string;
}

export function HeroVideoPlayer({
  initialVideoUrl,
  initialPosterUrl,
  initialTitle,
  initialBadge,
}: HeroVideoPlayerProps) {
  const [videoUrl, setVideoUrl] = useState<string>(
    initialVideoUrl || "/images/procap-hero-video.mp4"
  );
  const [posterUrl, setPosterUrl] = useState<string>(
    initialPosterUrl || "/og-image.jpg"
  );
  const [title, setTitle] = useState<string>(
    initialTitle || "Sistema Mixto Indetectable"
  );
  const [badge, setBadge] = useState<string>(
    initialBadge || "Transformación Real"
  );

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Obtener configuraciones dinámicas desde la API de settings si están disponibles
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            if (data.settings.hero_video_url) {
              setVideoUrl(data.settings.hero_video_url);
            }
            if (data.settings.hero_video_poster) {
              setPosterUrl(data.settings.hero_video_poster);
            }
            if (data.settings.hero_video_title) {
              setTitle(data.settings.hero_video_title);
            }
            if (data.settings.hero_video_badge) {
              setBadge(data.settings.hero_video_badge);
            }
          }
        }
      } catch (err) {
        console.error("Error al cargar settings de video:", err);
      }
    }
    loadSettings();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log("Play error:", err));
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch((err) => {
          console.error("Fullscreen error:", err);
        });
        setIsFullscreen(true);
      } else {
        document.exitFullscreen().catch((err) => console.error(err));
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="relative mx-auto max-w-md w-full" ref={containerRef}>
      {/* Resplandor ambiental de fondo */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-sky-500 via-blue-600 to-emerald-400 opacity-35 blur-xl animate-pulse"></div>

      <div className="relative glass-panel rounded-3xl p-5 sm:p-6 border border-sky-400/40 overflow-hidden shadow-2xl bg-slate-950/80 backdrop-blur-xl">
        {/* Cabecera de la tarjeta */}
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-xs font-bold px-3 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-400/40 flex items-center gap-1.5 shadow-sm">
            <Sparkles size={14} className="text-sky-400" /> {badge}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <ShieldCheck size={13} className="text-emerald-400" /> Salón VIP Chicó Norte
          </span>
        </div>

        {/* Contenedor del Reproductor de Video */}
        <div 
          className="aspect-[4/3] rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden group cursor-pointer shadow-inner"
          onClick={togglePlay}
        >
          {/* Video Element */}
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onLoadedData={() => {
              setIsLoaded(true);
              setHasError(false);
            }}
            onError={() => {
              // Si falla la carga del video local, se muestra el póster con opción de fallback
              setHasError(true);
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Gradiente de superposición elegante */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

          {/* Badge de Gama Profesional sobre el video */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none z-10">
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-400 bg-slate-950/80 px-2 py-0.5 rounded-md border border-sky-500/30">
                Gama Profesional
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white drop-shadow-md">
                {title}
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/30 text-emerald-300 text-[11px] font-bold border border-emerald-400/40 backdrop-blur-md">
              100% Invisible
            </span>
          </div>

          {/* Botón Central de Play/Pause (aparece si está pausado o en hover) */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
              !isPlaying ? "opacity-100 bg-slate-950/50 backdrop-blur-xs" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <div className="w-14 h-14 rounded-full bg-sky-500/90 text-slate-950 flex items-center justify-center shadow-lg shadow-sky-500/40 transform transition-transform group-hover:scale-110">
              {!isPlaying ? (
                <Play size={26} className="ml-1 fill-current" />
              ) : (
                <Pause size={26} className="fill-current" />
              )}
            </div>
          </div>

          {/* Controles Flotantes en la parte inferior del video */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Activar Sonido" : "Silenciar"}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700/80 backdrop-blur-md shadow-md transition-all hover:scale-105"
              >
                {isMuted ? (
                  <>
                    <VolumeX size={14} className="text-amber-400" />
                    <span className="text-[11px]">Activar Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={14} className="text-emerald-400" />
                    <span className="text-[11px]">Sonido ON</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label="Pantalla completa"
                className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md shadow-md transition-all"
              >
                <Maximize2 size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Píldoras de características rápidas */}
        <div className="mt-3.5 flex items-center justify-between text-xs text-slate-300 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5">
            <Waves size={14} className="text-cyan-400" />
            <span className="text-[11px] font-medium">Piscina & Deporte</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind size={14} className="text-sky-400" />
            <span className="text-[11px] font-medium">Transpirable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-emerald-400" />
            <span className="text-[11px] font-medium">Cabello Humano</span>
          </div>
        </div>

        {/* Lista de beneficios */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
            <span>Adaptación anatómica a la medida exacta de tu cabeza</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
            <span>Corte y desvanecido moderno según tu fisionomía</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
            <span>Fijación segura de 2 a 4 semanas continuas</span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="pt-3.5 flex gap-2">
          <Link
            href="/cotizador"
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/20 hover:scale-[1.02]"
          >
            <span>Cotizar Mi Prótesis</span>
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/beneficios"
            className="px-4 py-3 rounded-xl glass-panel hover:bg-white/10 text-white font-bold text-xs border border-slate-700 hover:border-sky-400 transition-all"
          >
            Beneficios
          </Link>
        </div>
      </div>
    </div>
  );
}
