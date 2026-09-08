"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Settings, 
  Bot, 
  Key, 
  Phone, 
  Save, 
  ShieldCheck, 
  Check, 
  Sparkles,
  MapPin,
  Globe,
  Database,
  CreditCard,
  Wallet,
  Coins,
  Loader2,
  ExternalLink,
  Video,
  Upload,
  Cloud,
  Play,
  Image as ImageIcon,
  CheckCircle2,
  Mail,
  Send
} from "lucide-react";
import { SiteSettingsData } from "@/app/api/settings/route";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<SiteSettingsData>({
    groq_api_key: "",
    whatsapp_number: "",
    admin_pin: "",
    address: "",
    wompi_public_key: "",
    wompi_integrity_secret: "",
    wompi_checkout_url: "",
    sistecredito_merchant_id: "",
    sistecredito_url: "",
    addi_client_id: "",
    addi_widget_enabled: false,
    addi_checkout_url: "",
    hero_video_url: "",
    hero_video_poster: "",
    hero_video_title: "Sistema Mixto Indetectable",
    hero_video_badge: "Transformación Real",
    cloudflare_r2_account_id: "",
    cloudflare_r2_access_key_id: "",
    cloudflare_r2_secret_access_key: "",
    cloudflare_r2_bucket_name: "",
    cloudflare_r2_public_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Estados de subida
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState("");

  // Estado prueba de correo
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailRecipient, setTestEmailRecipient] = useState("admin@jymtechsolutions.online");
  const [testEmailResult, setTestEmailResult] = useState<{ success?: boolean; message?: string } | null>(null);

  const videoFileInputRef = useRef<HTMLInputElement | null>(null);
  const posterFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleTestEmail = async () => {
    try {
      setTestingEmail(true);
      setTestEmailResult(null);
      const res = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testEmailRecipient.trim() || "admin@jymtechsolutions.online" }),
      });
      const data = await res.json();
      if (data.success) {
        setTestEmailResult({
          success: true,
          message: `¡Correo de prueba enviado con éxito a ${data.sentTo}! Revisa tu bandeja de entrada o spam.`,
        });
      } else {
        setTestEmailResult({
          success: false,
          message: data.error || "Error al enviar correo de prueba. Verifica la variable SMTP_PASS en Vercel.",
        });
      }
    } catch (err: any) {
      setTestEmailResult({
        success: false,
        message: err.message || "Error al conectar con el endpoint de prueba.",
      });
    } finally {
      setTestingEmail(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (err: any) {
      console.error("Error al cargar ajustes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof SiteSettingsData, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Subir video directo a Cloudflare R2 vía /api/upload
  const handleFileUpload = async (
    file: File,
    type: "video" | "poster"
  ) => {
    try {
      if (type === "video") setUploadingVideo(true);
      if (type === "poster") setUploadingPoster(true);
      setUploadSuccessMessage("");
      setErrorMessage("");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", type === "video" ? "hero-videos" : "hero-posters");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Error al subir archivo");
      }

      if (type === "video") {
        setSettings((prev) => ({ ...prev, hero_video_url: data.url }));
        setUploadSuccessMessage(`¡Video subido a ${data.provider === "cloudflare_r2" ? "Cloudflare R2" : data.provider}!`);
      } else {
        setSettings((prev) => ({ ...prev, hero_video_poster: data.url }));
        setUploadSuccessMessage(`¡Póster subido a ${data.provider === "cloudflare_r2" ? "Cloudflare R2" : data.provider}!`);
      }

      setTimeout(() => setUploadSuccessMessage(""), 5000);
    } catch (err: any) {
      console.error("Error al subir archivo:", err);
      setErrorMessage(`Error al subir ${type}: ${err.message || err}`);
    } finally {
      if (type === "video") setUploadingVideo(false);
      if (type === "poster") setUploadingPoster(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMessage("");

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo guardar la configuración");
      }

      // Sincronizar en localStorage por respaldo rápido
      if (settings.groq_api_key) localStorage.setItem("procap_groq_api_key", settings.groq_api_key);
      if (settings.whatsapp_number) localStorage.setItem("procap_whatsapp_number", settings.whatsapp_number);
      if (settings.admin_pin) localStorage.setItem("procap_admin_custom_pin", settings.admin_pin);
      if (settings.address) localStorage.setItem("procap_address", settings.address);
      if (settings.hero_video_url) localStorage.setItem("procap_hero_video_url", settings.hero_video_url);

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Error al conectar con la base de datos");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
            <Settings size={13} />
            <span>Centro de Configuración Global</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
            Ajustes del Sistema & Video Hero
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Gestiona el video de presentación principal, Cloudflare R2, pasarelas de pago colombianas, Groq AI y credenciales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
            isSupabaseConfigured() 
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
              : "bg-amber-500/10 border-amber-500/30 text-amber-400"
          }`}>
            <Database size={13} />
            <span>{isSupabaseConfigured() ? "Supabase Conectado" : "Modo Local"}</span>
          </span>
        </div>
      </div>

      {/* Alerta de éxito o error */}
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3 animate-fade-in">
          <CheckCircle2 size={18} className="shrink-0" />
          <span><strong>¡Configuración guardada exitosamente!</strong> Todos los cambios ya están activos en la plataforma.</span>
        </div>
      )}

      {uploadSuccessMessage && (
        <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs flex items-center gap-3 animate-fade-in">
          <Sparkles size={18} className="shrink-0" />
          <span>{uploadSuccessMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-3 animate-fade-in">
          <ShieldCheck size={18} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-8">
        
        {/* ======================================================== */}
        {/* SECCIÓN 1: VIDEO DE PRESENTACIÓN HERO (CLOUDFLARE R2)    */}
        {/* ======================================================== */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-sky-500/40 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
                <Video size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Video de Presentación del Hero (Página de Inicio)</h3>
                <p className="text-xs text-slate-400">Reemplaza el cuadro de la portada por un video HD alojado en Cloudflare R2</p>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded bg-sky-500/10 text-sky-300 border border-sky-500/30 font-bold flex items-center gap-1">
              <Cloud size={12} /> Cloudflare R2
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Previsualizador en vivo del Video */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-bold text-slate-300 block">Vista Previa en Vivo</span>
              <div className="aspect-[4/3] rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden flex items-center justify-center shadow-lg">
                {settings.hero_video_url ? (
                  <video
                    src={settings.hero_video_url}
                    poster={settings.hero_video_poster}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-center p-6 text-slate-500 space-y-2">
                    <Video size={40} className="text-slate-600 animate-pulse" />
                    <span className="text-xs font-semibold text-slate-400">Sin video configurado aún</span>
                    <span className="text-[11px] text-slate-500">Sube un video MP4/WebM o pega una URL directa abajo.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Controles de Carga y Configuración */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Botón de Carga de Archivo de Video */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Subir Archivo de Video</span>
                    <span className="text-[11px] text-slate-400">Formatos soportados: MP4, WebM (hasta 100MB)</span>
                  </div>
                  
                  <input
                    type="file"
                    ref={videoFileInputRef}
                    accept="video/mp4,video/webm,video/quicktime"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "video");
                    }}
                  />

                  <button
                    type="button"
                    disabled={uploadingVideo}
                    onClick={() => videoFileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-sky-500/20 disabled:opacity-50"
                  >
                    {uploadingVideo ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Subiendo a R2...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={14} />
                        <span>Subir Video a Cloudflare</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    URL del Video (Cloudflare R2 o Externa)
                  </label>
                  <input
                    type="url"
                    value={settings.hero_video_url || ""}
                    onChange={(e) => handleChange("hero_video_url", e.target.value)}
                    placeholder="https://pub-xxxx.r2.dev/hero-videos/procap-video.mp4"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
                  />
                </div>
              </div>

              {/* Botón de Carga de Póster / Miniatura */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Imagen de Portada (Póster)</span>
                    <span className="text-[11px] text-slate-400">Imagen mostrada antes de reproducir el video</span>
                  </div>

                  <input
                    type="file"
                    ref={posterFileInputRef}
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "poster");
                    }}
                  />

                  <button
                    type="button"
                    disabled={uploadingPoster}
                    onClick={() => posterFileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all disabled:opacity-50"
                  >
                    {uploadingPoster ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Subiendo...</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon size={14} className="text-sky-400" />
                        <span>Subir Póster</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <input
                    type="url"
                    value={settings.hero_video_poster || ""}
                    onChange={(e) => handleChange("hero_video_poster", e.target.value)}
                    placeholder="https://pub-xxxx.r2.dev/hero-posters/poster.jpg"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
                  />
                </div>
              </div>

              {/* Textos del Video */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Título sobre el Video
                  </label>
                  <input
                    type="text"
                    value={settings.hero_video_title || ""}
                    onChange={(e) => handleChange("hero_video_title", e.target.value)}
                    placeholder="Sistema Mixto Indetectable"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Texto del Badge Superior
                  </label>
                  <input
                    type="text"
                    value={settings.hero_video_badge || ""}
                    onChange={(e) => handleChange("hero_video_badge", e.target.value)}
                    placeholder="Transformación Real"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECCIÓN 2: CREDENCIALES CLOUDFLARE R2 STORAGE             */}
        {/* ======================================================== */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <Cloud size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Credenciales Cloudflare R2 (Object Storage)</h3>
                <p className="text-xs text-slate-400">Almacenamiento ultra rápido de videos e imágenes sin límite de cuota</p>
              </div>
            </div>
            <a
              href="https://dash.cloudflare.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>Consola Cloudflare</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Cloudflare Account ID
              </label>
              <input
                type="text"
                value={settings.cloudflare_r2_account_id || ""}
                onChange={(e) => handleChange("cloudflare_r2_account_id", e.target.value)}
                placeholder="ej: a1b2c3d4e5f6..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                R2 Bucket Name
              </label>
              <input
                type="text"
                value={settings.cloudflare_r2_bucket_name || ""}
                onChange={(e) => handleChange("cloudflare_r2_bucket_name", e.target.value)}
                placeholder="procap-natural"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                R2 Access Key ID
              </label>
              <input
                type="text"
                value={settings.cloudflare_r2_access_key_id || ""}
                onChange={(e) => handleChange("cloudflare_r2_access_key_id", e.target.value)}
                placeholder="Access Key ID de Cloudflare"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                R2 Secret Access Key
              </label>
              <input
                type="password"
                value={settings.cloudflare_r2_secret_access_key || ""}
                onChange={(e) => handleChange("cloudflare_r2_secret_access_key", e.target.value)}
                placeholder="Secret Access Key"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Dominio Público R2 (R2.dev o Subdominio Personalizado)
              </label>
              <input
                type="url"
                value={settings.cloudflare_r2_public_url || ""}
                onChange={(e) => handleChange("cloudflare_r2_public_url", e.target.value)}
                placeholder="https://pub-xxxxxxxx.r2.dev o https://media.protesiscapilarcolombia.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECCIÓN 3: PASARELAS DE PAGO Y CRÉDITOS EN COLOMBIA       */}
        {/* ======================================================== */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Pasarelas de Pago & Crédito Digital</h3>
                <p className="text-xs text-slate-400">Configuración para Wompi (Bancolombia), Sistecrédito y Addi</p>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              Colombia 🇨🇴
            </span>
          </div>

          {/* Bloque Wompi */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>Wompi Bancolombia (Tarjetas, PSE, Nequi, Botón Bancolombia)</span>
              </div>
              <a
                href="https://comercios.wompi.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
              >
                <span>Dashboard Wompi</span>
                <ExternalLink size={10} />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Llave Pública Wompi (pub_prod_... / pub_test_...)
                </label>
                <input
                  type="text"
                  value={settings.wompi_public_key || ""}
                  onChange={(e) => handleChange("wompi_public_key", e.target.value)}
                  placeholder="pub_prod_xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Secreto de Integridad Wompi (prod_integrity_...)
                </label>
                <input
                  type="password"
                  value={settings.wompi_integrity_secret || ""}
                  onChange={(e) => handleChange("wompi_integrity_secret", e.target.value)}
                  placeholder="prod_integrity_xxxxxxxxxxxxxxxx"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  URL Base de Enlace de Pago General / Tienda Wompi (Opcional)
                </label>
                <input
                  type="url"
                  value={settings.wompi_checkout_url || ""}
                  onChange={(e) => handleChange("wompi_checkout_url", e.target.value)}
                  placeholder="https://checkout.wompi.co/l/procap-general"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Bloque Sistecrédito */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Sistecrédito (Crédito Inmediato sin Tarjeta)</span>
              </div>
              <a
                href="https://www.sistecredito.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Portal Sistecrédito</span>
                <ExternalLink size={10} />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Merchant ID / Código Comercio Sistecrédito
                </label>
                <input
                  type="text"
                  value={settings.sistecredito_merchant_id || ""}
                  onChange={(e) => handleChange("sistecredito_merchant_id", e.target.value)}
                  placeholder="Ej: 901234567"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  URL Enlace General Sistecrédito
                </label>
                <input
                  type="url"
                  value={settings.sistecredito_url || ""}
                  onChange={(e) => handleChange("sistecredito_url", e.target.value)}
                  placeholder="https://credito.sistecredito.com/procap-natural"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Bloque Addi */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Addi (Compra Ahora, Paga Después a Cuotas)</span>
              </div>
              <a
                href="https://co.addi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Portal Aliados Addi</span>
                <ExternalLink size={10} />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Client ID / Aliado Addi
                </label>
                <input
                  type="text"
                  value={settings.addi_client_id || ""}
                  onChange={(e) => handleChange("addi_client_id", e.target.value)}
                  placeholder="addi-procap-bogota"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  URL Enlace General Addi
                </label>
                <input
                  type="url"
                  value={settings.addi_checkout_url || ""}
                  onChange={(e) => handleChange("addi_checkout_url", e.target.value)}
                  placeholder="https://co.addi.com/solicitar/procap"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECCIÓN 4: INTELIGENCIA ARTIFICIAL (GROQ CLOUD)          */}
        {/* ======================================================== */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Inteligencia Artificial (CapilarBot)</h3>
              <p className="text-xs text-slate-400">Motor de procesamiento de lenguaje natural y cotización</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Groq API Key (gsk_...)
            </label>
            <input
              type="password"
              value={settings.groq_api_key || ""}
              onChange={(e) => handleChange("groq_api_key", e.target.value)}
              placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
            />
            <span className="text-[11px] text-slate-500 mt-1.5 block">
              Genera tu clave gratuita en <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline">console.groq.com</a>. Si no la configuras, el bot usará respuestas contextuales inteligentes automáticas.
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECCIÓN 5: CANALES COMERCIALES & CONTACTO                 */}
        {/* ======================================================== */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Phone size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Canales Comerciales</h3>
              <p className="text-xs text-slate-400">Teléfono para redirección de compras y cotizaciones</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Número de WhatsApp (con indicativo país 57...)
              </label>
              <input
                type="text"
                required
                value={settings.whatsapp_number || ""}
                onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                placeholder="573151189795"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Dirección Sede Bogotá
              </label>
              <input
                type="text"
                value={settings.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Carrera 16 #96-64, Barrio Chicó Norte"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECCIÓN 6: SERVIDOR DE CORREOS (NAMECHEAP PRIVATE EMAIL)   */}
        {/* ======================================================== */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-sky-500/30 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Servidor de Correos Corporativos (SMTP)</h3>
                <p className="text-xs text-slate-400">Envío automático de confirmaciones de citas, compras y alertas de leads</p>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded bg-sky-500/10 text-sky-300 border border-sky-500/30 font-bold flex items-center gap-1">
              <Sparkles size={12} /> Namecheap Private Email
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 block font-bold">Buzón Oficial:</span>
                <span className="font-mono text-sky-400 font-bold">admin@protesiscapilarcolombia.com</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block font-bold">Servidor Saliente SMTP:</span>
                <span className="font-mono text-slate-200">mail.privateemail.com</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block font-bold">Puerto & Seguridad:</span>
                <span className="font-mono text-emerald-400 font-bold">Puerto 465 (SSL / TLS)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1 max-w-sm">
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Enviar Correo de Prueba a:
                </label>
                <input
                  type="email"
                  value={testEmailRecipient}
                  onChange={(e) => setTestEmailRecipient(e.target.value)}
                  placeholder="admin@jymtechsolutions.online"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
                />
              </div>

              <button
                type="button"
                disabled={testingEmail}
                onClick={handleTestEmail}
                className="self-end sm:self-auto px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-sky-500/20 disabled:opacity-50 shrink-0 mt-4 sm:mt-0"
              >
                {testingEmail ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Enviando prueba...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Enviar Correo de Prueba</span>
                  </>
                )}
              </button>
            </div>

            {testEmailResult && (
              <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 mt-3 animate-fade-in ${
                testEmailResult.success 
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" 
                  : "bg-rose-500/10 border border-rose-500/30 text-rose-400"
              }`}>
                {testEmailResult.success ? <CheckCircle2 size={16} className="shrink-0" /> : <ShieldCheck size={16} className="shrink-0" />}
                <span>{testEmailResult.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECCIÓN 7: SEGURIDAD DEL PANEL ADMIN                      */}
        {/* ======================================================== */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Key size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Seguridad del Panel</h3>
              <p className="text-xs text-slate-400">PIN de acceso administrativo</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              PIN de Acceso Maestro
            </label>
            <input
              type="text"
              value={settings.admin_pin || ""}
              onChange={(e) => handleChange("admin_pin", e.target.value)}
              placeholder="procap2026"
              className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 font-mono tracking-wider"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{saving ? "Guardando en Supabase..." : "Guardar Toda la Configuración en Supabase"}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
