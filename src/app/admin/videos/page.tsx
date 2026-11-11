"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Film, 
  Video, 
  Plus, 
  Trash2, 
  Save, 
  Upload, 
  Play, 
  Pause, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft,
  Flame,
  Globe,
  Tag
} from "lucide-react";
import { ReelItem } from "@/app/api/reels/route";

export default function AdminVideosPage() {
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadingPosterIndex, setUploadingPosterIndex] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const posterInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reels");
      const data = await res.json();
      setReels(data.reels || []);
    } catch (err) {
      setReels([]);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleAddReel = () => {
    const newReel: ReelItem = {
      id: `reel-${Date.now()}`,
      title: "Nueva Transformación en Video",
      tag: "🔥 Nuevo",
      category: "transformacion",
      videoUrl: "",
      posterUrl: "/hero-poster.webp",
      views: "1K vistas",
      source: "tiktok",
      socialUrl: "https://www.tiktok.com/@procapnatural"
    };
    setReels([newReel, ...reels]);
  };

  const handleRemoveReel = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este video?")) {
      setReels(reels.filter((r) => r.id !== id));
    }
  };

  const handleUpdateReel = (index: number, field: keyof ReelItem, value: any) => {
    const updated = [...reels];
    updated[index] = { ...updated[index], [field]: value };
    setReels(updated);
  };

  // Subir video a Cloudflare R2 / Supabase
  const handleUploadVideo = async (file: File, index: number) => {
    if (!file) return;

    try {
      setUploadingIndex(index);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "reels-videos");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Error al subir video");
      }

      handleUpdateReel(index, "videoUrl", data.url);
      showNotification("¡Video subido a la nube exitosamente!");
    } catch (err: any) {
      showNotification(`Error al subir video: ${err.message}`, "error");
    } finally {
      setUploadingIndex(null);
    }
  };

  // Subir imagen de portada / póster
  const handleUploadPoster = async (file: File, index: number) => {
    if (!file) return;

    try {
      setUploadingPosterIndex(index);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "reels-posters");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Error al subir póster");
      }

      handleUpdateReel(index, "posterUrl", data.url);
      showNotification("¡Portada subida exitosamente!");
    } catch (err: any) {
      showNotification(`Error al subir portada: ${err.message}`, "error");
    } finally {
      setUploadingPosterIndex(null);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/reels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reels }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al guardar");
      }

      showNotification("¡Todos los videos se guardaron y ya están visibles en la web!");
    } catch (err: any) {
      showNotification(`Error al guardar: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* Toast Notificación */}
      {statusMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border text-sm font-bold backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 ${
            statusMessage.type === "success"
              ? "bg-emerald-950/95 border-emerald-500/50 text-emerald-300"
              : "bg-rose-950/95 border-rose-500/50 text-rose-300"
          }`}
        >
          {statusMessage.type === "success" ? <CheckCircle2 size={18} /> : <Sparkles size={18} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
            <Film size={14} />
            <span>Gestor de Multimedia Oficial</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
            Reels & Videos de <span className="text-amber-400">Transformaciones</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Sube videos directamente desde tu celular o computadora. Se reproducen en la sección principal de la web.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleAddReel}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all"
          >
            <Plus size={16} />
            <span>Agregar Video</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>

      {/* Tarjeta de Instrucciones Rápidas */}
      <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-400/30 text-xs text-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Sparkles size={18} className="text-sky-400 shrink-0" />
          <span>
            <strong>¿Cómo subir un video?</strong> Haz clic en <strong>"Subir Video MP4"</strong> en la tarjeta correspondiente. El sistema lo aloja automáticamente en Cloudflare R2 para carga ultrarrápida sin límites de cuota.
          </span>
        </div>
        <Link
          href="/"
          target="_blank"
          className="shrink-0 px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 font-bold hover:bg-sky-500/30 transition-colors flex items-center gap-1.5"
        >
          <span>Ver en la Web</span>
          <ExternalLink size={12} />
        </Link>
      </div>

      {/* Lista de Reels */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-amber-400 mx-auto" />
          <p className="text-xs text-slate-400">Cargando biblioteca de videos...</p>
        </div>
      ) : reels.length === 0 ? (
        <div className="py-16 text-center glass-panel rounded-3xl border border-slate-800 p-8">
          <Film size={36} className="text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No hay videos en la lista</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">Empieza agregando tu primer video o reel viral.</p>
          <button
            onClick={handleAddReel}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            + Agregar Primer Video
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reels.map((reel, idx) => {
            const isUploadingThisVideo = uploadingIndex === idx;
            const isUploadingThisPoster = uploadingPosterIndex === idx;

            return (
              <div
                key={reel.id || idx}
                className="glass-panel rounded-3xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
              >
                {/* Cabecera Tarjeta */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Video #{idx + 1}
                  </span>
                  <button
                    onClick={() => handleRemoveReel(reel.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Eliminar este video"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Previsualización del Video */}
                <div className="relative aspect-[9/16] max-h-[300px] w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                  {reel.videoUrl ? (
                    <video
                      src={reel.videoUrl}
                      poster={reel.posterUrl}
                      controls
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4 text-slate-500">
                      <Film size={32} className="mx-auto mb-2 text-slate-600" />
                      <p className="text-xs font-bold text-slate-400">Sin archivo de video</p>
                      <p className="text-[10px] text-slate-600">Sube un archivo .mp4 abajo</p>
                    </div>
                  )}
                </div>

                {/* Formulario del Reel */}
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Título del Video
                    </label>
                    <input
                      type="text"
                      value={reel.title}
                      onChange={(e) => handleUpdateReel(idx, "title", e.target.value)}
                      placeholder="Ej: Transformación con Sistema Mixto..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Insignia / Tag
                      </label>
                      <input
                        type="text"
                        value={reel.tag}
                        onChange={(e) => handleUpdateReel(idx, "tag", e.target.value)}
                        placeholder="🔥 Viral"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Contador de Vistas
                      </label>
                      <input
                        type="text"
                        value={reel.views || ""}
                        onChange={(e) => handleUpdateReel(idx, "views", e.target.value)}
                        placeholder="Ej: 142K vistas"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Subir Archivo de Video */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Archivo de Video (.mp4 / .webm)
                    </label>

                    <input
                      type="file"
                      accept="video/*"
                      ref={(el) => { fileInputRefs.current[idx] = el; }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadVideo(file, idx);
                      }}
                      className="hidden"
                    />

                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={reel.videoUrl}
                        onChange={(e) => handleUpdateReel(idx, "videoUrl", e.target.value)}
                        placeholder="https://... o clic en Subir"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-[11px] text-white font-mono focus:outline-none focus:border-amber-400"
                      />

                      <button
                        type="button"
                        disabled={isUploadingThisVideo}
                        onClick={() => fileInputRefs.current[idx]?.click()}
                        className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
                      >
                        {isUploadingThisVideo ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Upload size={13} />
                        )}
                        <span>Subir</span>
                      </button>
                    </div>
                  </div>

                  {/* Enlace de Red Social */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div className="col-span-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Origen
                      </label>
                      <select
                        value={reel.source}
                        onChange={(e) => handleUpdateReel(idx, "source", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                      >
                        <option value="tiktok">TikTok</option>
                        <option value="instagram">Instagram</option>
                        <option value="direct">Directo</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Link al Reel / Perfil
                      </label>
                      <input
                        type="url"
                        value={reel.socialUrl || ""}
                        onChange={(e) => handleUpdateReel(idx, "socialUrl", e.target.value)}
                        placeholder="https://tiktok.com/@..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-[11px] focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Botón flotante inferior para guardar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-950/90 backdrop-blur-xl border border-amber-500/40 p-2 sm:px-6 sm:py-3 rounded-full shadow-2xl flex items-center gap-4">
        <span className="text-xs font-bold text-slate-300 hidden sm:inline">
          {reels.length} video(s) configurado(s)
        </span>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          <span>Guardar Cambios en la Web</span>
        </button>
      </div>

    </div>
  );
}

