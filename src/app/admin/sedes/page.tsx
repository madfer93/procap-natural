"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { SEDES_DATA, SedeInfo } from "@/lib/sedes-data";
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Sparkles, 
  Save, 
  X, 
  Clock, 
  Eye, 
  Camera, 
  Upload, 
  ExternalLink, 
  ShieldCheck, 
  Car, 
  Navigation, 
  Loader2, 
  Image as ImageIcon,
  Video,
  Film,
  Phone,
  Mail,
  Search,
  Globe
} from "lucide-react";

export default function AdminSedesPage() {
  const [sedes, setSedes] = useState<SedeInfo[]>(SEDES_DATA);
  const [loading, setLoading] = useState(true);
  const [editingSede, setEditingSede] = useState<SedeInfo | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Estados de subida multimedia
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  // Form State
  const [formData, setFormData] = useState<SedeInfo>({
    slug: "",
    name: "",
    city: "",
    department: "",
    badge: "Sede Oficial",
    address: "",
    neighborhood: "",
    postalCode: "",
    phone: "+57 315 118 9795",
    email: "contacto@protesiscapilarcolombia.com",
    coverImage: "/images/sedes/bogota.jpg",
    gallery: [],
    videoUrl: "",
    videoTitle: "",
    description: "",
    fullStory: "",
    amenities: ["Cabinas VIP individuales", "Climatización dérmica"],
    schedule: {
      weekdays: "8:00 AM – 7:00 PM (Previa Cita)",
      saturdays: "8:00 AM – 6:00 PM (Previa Cita)",
      sundays: "Cita previa agendada"
    },
    transitGuide: {
      car: "Fácil acceso vehicular por vías principales.",
      publicTransport: "Paradas de transporte público cercanas.",
      parking: "Parqueaderos y bahías de estacionamiento a menos de 50 metros."
    },
    googleMapsEmbed: "https://www.google.com/maps/embed?pb=...",
    googleMapsUrl: "https://maps.google.com",
    wazeUrl: "https://waze.com",
    whatsappMessage: "¡Hola Procap Natural! Deseo agendar mi valoración personalizada.",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: []
  });

  const [newAmenity, setNewAmenity] = useState("");
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [newGalleryCaption, setNewGalleryCaption] = useState("");

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const fetchSedes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/sedes");
      const data = await res.json();
      if (data.sedes && Array.isArray(data.sedes) && data.sedes.length > 0) {
        setSedes(data.sedes);
      }
    } catch (e) {
      console.error("Error al cargar sedes:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSedes();
  }, []);

  const handleEdit = (sede: SedeInfo) => {
    setEditingSede(sede);
    setFormData({
      ...sede,
      gallery: sede.gallery || [],
      amenities: sede.amenities || [],
      schedule: sede.schedule || {
        weekdays: "8:00 AM – 7:00 PM (Previa Cita)",
        saturdays: "8:00 AM – 6:00 PM (Previa Cita)",
        sundays: "Cita previa agendada"
      },
      transitGuide: sede.transitGuide || {
        car: "Acceso vehicular fácil y seguro.",
        publicTransport: "Transporte público cercano.",
        parking: "Parqueadero cercano."
      }
    });
    setIsCreating(false);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleNew = () => {
    setEditingSede(null);
    setFormData({
      slug: `sede-${Date.now()}`,
      name: "Nueva Sede Procap",
      city: "",
      department: "",
      badge: "¡Nueva Sede!",
      address: "",
      neighborhood: "",
      postalCode: "",
      phone: "+57 315 118 9795",
      email: "contacto@protesiscapilarcolombia.com",
      coverImage: "/images/sedes/bogota.jpg",
      gallery: [
        { url: "/images/sedes/bogota.jpg", caption: "Fachada de la Sede" },
        { url: "/images/sedes/cabina-vip.jpg", caption: "Cabina VIP Individual" }
      ],
      videoUrl: "https://pub-426a082ba0a64de0bcf1da7c816f7c38.r2.dev/PROCAPS-OFICINA.mp4",
      videoTitle: "Recorrido de la Sede",
      description: "Espacio privado y climatizado para atención de prótesis capilares.",
      fullStory: "Instalaciones diseñadas para máxima privacidad y confort.",
      amenities: ["Cabinas VIP individuales", "Climatización y aire acondicionado", "Atención personalizada 1 a 1"],
      schedule: {
        weekdays: "8:00 AM – 6:30 PM (Previa Cita)",
        saturdays: "8:00 AM – 5:00 PM (Previa Cita)",
        sundays: "Cita previa"
      },
      transitGuide: {
        car: "Acceso vehicular fácil y seguro.",
        publicTransport: "Transporte público a pocos metros.",
        parking: "Parqueadero cercano."
      },
      googleMapsEmbed: "https://www.google.com/maps/embed?pb=...",
      googleMapsUrl: "https://maps.google.com",
      wazeUrl: "https://waze.com",
      whatsappMessage: "¡Hola Procap Natural! Deseo agendar mi valoración personalizada.",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: []
    });
    setIsCreating(true);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  // Subir portada a R2 / Supabase
  const handleCoverUpload = async (file: File) => {
    try {
      setUploadingCover(true);
      const data = new FormData();
      data.append("file", file);
      data.append("folder", "sedes-fachadas");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok || !result.url) {
        throw new Error(result.error || "Error al subir imagen");
      }

      setFormData((prev) => ({ ...prev, coverImage: result.url }));
      showNotification(`¡Foto de portada subida con éxito (${result.provider})!`);
    } catch (err: any) {
      showNotification(`Error: ${err.message || err}`, "error");
    } finally {
      setUploadingCover(false);
    }
  };

  // Subir foto a galería
  const handleGalleryUpload = async (file: File) => {
    try {
      setUploadingGallery(true);
      const data = new FormData();
      data.append("file", file);
      data.append("folder", "sedes-instalaciones");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok || !result.url) {
        throw new Error(result.error || "Error al subir imagen");
      }

      const newPhoto = { url: result.url, caption: "Instalaciones de la Sede" };
      setFormData((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), newPhoto]
      }));
      showNotification(`¡Foto de instalaciones añadida con éxito!`);
    } catch (err: any) {
      showNotification(`Error: ${err.message || err}`, "error");
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleAddManualGalleryPhoto = () => {
    if (!newGalleryUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      gallery: [...(prev.gallery || []), { url: newGalleryUrl.trim(), caption: newGalleryCaption.trim() || "Instalaciones" }]
    }));
    setNewGalleryUrl("");
    setNewGalleryCaption("");
    showNotification("Foto añadida a la galería");
  };

  // Subir video de la sede a R2 / Supabase
  const handleVideoUpload = async (file: File) => {
    try {
      setUploadingVideo(true);
      const data = new FormData();
      data.append("file", file);
      data.append("folder", "sedes-videos");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok || !result.url) {
        throw new Error(result.error || "Error al subir video");
      }

      setFormData((prev) => ({
        ...prev,
        videoUrl: result.url,
        videoTitle: prev.videoTitle || `Recorrido de ${prev.name || "la Sede"}`
      }));
      showNotification(`¡Video subido con éxito (${result.provider})!`);
    } catch (err: any) {
      showNotification(`Error al subir video: ${err.message || err}`, "error");
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const handleAddAmenity = () => {
    if (!newAmenity.trim()) return;
    setFormData((prev) => ({
      ...prev,
      amenities: [...prev.amenities, newAmenity.trim()]
    }));
    setNewAmenity("");
  };

  const handleRemoveAmenity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const handleSaveSede = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.city || !formData.address) {
      showNotification("Por favor completa el nombre, ciudad y dirección de la sede.", "error");
      return;
    }

    try {
      setSaving(true);
      const updatedSlug = formData.slug.trim() || formData.city.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const normalizedSede: SedeInfo = { ...formData, slug: updatedSlug };

      let updatedList: SedeInfo[];
      if (editingSede) {
        updatedList = sedes.map((s) => (s.slug === editingSede.slug ? normalizedSede : s));
      } else {
        updatedList = [...sedes, normalizedSede];
      }

      const res = await fetch("/api/sedes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sedes: updatedList }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No se pudo guardar la sede en Supabase");
      }

      setSedes(updatedList);
      setEditingSede(null);
      setIsCreating(false);
      showNotification("¡Sede, fotos, videos y datos de SEO guardados y sincronizados en tiempo real!");
    } catch (err: any) {
      showNotification(`Error: ${err.message || err}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSede = async (slug: string) => {
    if (!confirm("¿Estás seguro de eliminar esta sede?")) return;

    try {
      setSaving(true);
      const updatedList = sedes.filter((s) => s.slug !== slug);
      const res = await fetch("/api/sedes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sedes: updatedList }),
      });

      if (!res.ok) throw new Error("No se pudo eliminar de la base de datos");
      setSedes(updatedList);
      if (editingSede?.slug === slug) setEditingSede(null);
      showNotification("Sede eliminada correctamente.");
    } catch (err: any) {
      showNotification(`Error: ${err.message || err}`, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 text-xs font-bold mb-1">
            <MapPin size={13} />
            <span>Gestión de Ubicaciones Fijas & Multimedia</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
            Sedes Oficiales, Fotos, Videos & SEO
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Sube fotos de cabinas, videos de recorridos, administra horarios, guías de acceso y optimización SEO para cada sede.
          </p>
        </div>

        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all shrink-0"
        >
          <Plus size={16} />
          <span>Nueva Sede</span>
        </button>
      </div>

      {/* Notificaciones */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between animate-in fade-in duration-300 ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-300"
              : "bg-red-500/10 border border-red-500/40 text-red-300"
          }`}
        >
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* FORMULARIO EXPANDIBLE PARA EDITAR/CREAR SEDE */}
      {(editingSede || isCreating) && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-amber-500/40 shadow-2xl relative animate-in fade-in duration-300">
          
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Edit3 size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {editingSede ? `Editar ${editingSede.name}` : "Crear Nueva Sede"}
                </h2>
                <p className="text-xs text-slate-400">
                  Actualiza toda la información visible en /ubicacion/{formData.slug || "[slug]"} y páginas dedicadas.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingSede(null);
                setIsCreating(false);
              }}
              className="w-8 h-8 rounded-lg bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSaveSede} className="space-y-6">
            
            {/* Fila 1: Nombre, Ciudad, Departamento, Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Nombre de la Sede *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Sede Bogotá, Sede Barranquilla..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Ciudad *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Ej: Bogotá, Cali, Barranquilla, Neiva..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Departamento / Región
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Ej: Cundinamarca, Atlántico, Huila..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Slug URL *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                  placeholder="barranquilla"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-sky-400 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Fila 2: Dirección, Barrio, Código Postal, Badge, Teléfono, Email */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Dirección Exacta *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ej: Calle 64 #46-69"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Barrio / Localidad / Edificio
                </label>
                <input
                  type="text"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  placeholder="Ej: Centro Histórico"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Código Postal
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="080002"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Etiqueta / Badge
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="Sede Costa Caribe"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Fila Contacto Directo: Teléfono y Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <Phone size={13} className="text-emerald-400" />
                  <span>Teléfono Directo de la Sede</span>
                </label>
                <input
                  type="text"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+57 315 118 9795"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <Mail size={13} className="text-sky-400" />
                  <span>Email de Atención</span>
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contacto@protesiscapilarcolombia.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* SECCIÓN NUEVA: SUBIDA Y GESTIÓN DE VIDEO DE LA SEDE */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-950 to-blue-950/40 border border-sky-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                    <Video size={16} className="text-cyan-400" />
                    <span>Video de Recorrido / Presentación de la Sede</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Sube un video en formato MP4 o WebM a Cloudflare R2, o ingresa un enlace directo para mostrar a los clientes.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={videoInputRef}
                    accept="video/mp4,video/webm,video/quicktime"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleVideoUpload(e.target.files[0]);
                    }}
                  />
                  <button
                    type="button"
                    disabled={uploadingVideo}
                    onClick={() => videoInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all"
                  >
                    {uploadingVideo ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    <span>{uploadingVideo ? "Subiendo Video..." : "Subir Video a R2"}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-7 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      URL del Video (Cloudflare R2, MP4 o YouTube)
                    </label>
                    <input
                      type="text"
                      value={formData.videoUrl || ""}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="https://pub-xxxx.r2.dev/video-sede.mp4"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-sky-300 font-mono focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Título del Video
                    </label>
                    <input
                      type="text"
                      value={formData.videoTitle || ""}
                      onChange={(e) => setFormData({ ...formData, videoTitle: e.target.value })}
                      placeholder="Recorrido Sede Chicó Norte & Cabinas VIP"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div className="sm:col-span-5">
                  {formData.videoUrl ? (
                    <div className="rounded-xl overflow-hidden border border-sky-500/30 bg-slate-950 aspect-video relative">
                      <video
                        src={formData.videoUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/60 aspect-video flex flex-col items-center justify-center text-slate-500 p-4 text-center">
                      <Film size={24} className="mb-1 text-slate-600" />
                      <span className="text-xs">Sin video configurado</span>
                      <span className="text-[10px] text-slate-600">Sube uno o pega la URL</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SECCIÓN: FOTO DE FACHADA / PORTADA (CLOUDFLARE R2) */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                    <Camera size={15} />
                    <span>Foto de Fachada / Portada Principal</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Imagen de portada para la tarjeta de /ubicacion y cabecera de la página.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={coverInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleCoverUpload(e.target.files[0]);
                    }}
                  />
                  <button
                    type="button"
                    disabled={uploadingCover}
                    onClick={() => coverInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-400/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    {uploadingCover ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                    <span>{uploadingCover ? "Subiendo..." : "Subir Foto a R2"}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-8">
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://pub-xxxx.r2.dev/... o /images/sedes/bogota.jpg"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="sm:col-span-4">
                  {formData.coverImage && (
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                      <Image
                        src={formData.coverImage}
                        alt="Vista previa fachada"
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SECCIÓN: GALERÍA DE FOTOS DE LAS INSTALACIONES */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <ImageIcon size={15} />
                    <span>Galería de Instalaciones (Cabinas VIP, Sillones, Lavacabezas)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Fotos que verán los clientes en la sección "Mira las Instalaciones".
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={galleryInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleGalleryUpload(e.target.files[0]);
                    }}
                  />
                  <button
                    type="button"
                    disabled={uploadingGallery}
                    onClick={() => galleryInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-400/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    {uploadingGallery ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                    <span>{uploadingGallery ? "Subiendo..." : "+ Subir Archivo"}</span>
                  </button>
                </div>
              </div>

              {/* Agregar foto por URL directa */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-800/60">
                <input
                  type="text"
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  placeholder="O pega URL de foto (https://...)"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
                <input
                  type="text"
                  value={newGalleryCaption}
                  onChange={(e) => setNewGalleryCaption(e.target.value)}
                  placeholder="Leyenda o pie de foto (opcional)"
                  className="sm:w-64 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddManualGalleryPhoto}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                >
                  + Añadir por URL
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {formData.gallery?.map((photo, index) => (
                  <div key={index} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 relative group">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900">
                      <Image
                        src={photo.url}
                        alt={photo.caption}
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryPhoto(index)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Eliminar foto"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={photo.caption}
                      onChange={(e) => {
                        const updated = [...formData.gallery];
                        updated[index].caption = e.target.value;
                        setFormData({ ...formData, gallery: updated });
                      }}
                      placeholder="Descripción de la foto..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Fila 3: Descripción Corta & Historia */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Descripción Corta (Tarjeta Principal)
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Resumen de la sede para la tarjeta principal..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Historia / Detalle Completo de las Instalaciones
                </label>
                <textarea
                  rows={3}
                  value={formData.fullStory}
                  onChange={(e) => setFormData({ ...formData, fullStory: e.target.value })}
                  placeholder="Información detallada sobre las cabinas, equipamiento y comodidad..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            {/* SECCIÓN NUEVA: GUÍA DE TRANSPORTE Y ACCESO */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Car size={15} />
                <span>Guía de Cómo Llegar (Vehículo, Transporte Público y Parqueadero)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Acceso en Carro / Vehículo
                  </label>
                  <textarea
                    rows={2}
                    value={formData.transitGuide?.car || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      transitGuide: { ...formData.transitGuide, car: e.target.value }
                    })}
                    placeholder="Vías de acceso vehicular..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Transporte Público (TransMilenio, MIO, Metro...)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.transitGuide?.publicTransport || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      transitGuide: { ...formData.transitGuide, publicTransport: e.target.value }
                    })}
                    placeholder="Estaciones cercanas..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Parqueaderos & Bahías
                  </label>
                  <textarea
                    rows={2}
                    value={formData.transitGuide?.parking || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      transitGuide: { ...formData.transitGuide, parking: e.target.value }
                    })}
                    placeholder="Bahías o parqueaderos vigilados..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Fila: Comodidades / Protocolos (Chips) */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Comodidades & Protocolos de la Sede
              </label>
              
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(index)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 max-w-md pt-1">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddAmenity();
                    }
                  }}
                  placeholder="Ej: WiFi de alta velocidad, Café de cortesía..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddAmenity}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                >
                  + Agregar
                </button>
              </div>
            </div>

            {/* Fila: Horarios */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Lunes a Viernes
                </label>
                <input
                  type="text"
                  value={formData.schedule.weekdays}
                  onChange={(e) => setFormData({
                    ...formData,
                    schedule: { ...formData.schedule, weekdays: e.target.value }
                  })}
                  placeholder="8:00 AM – 7:00 PM (Previa Cita)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Sábados
                </label>
                <input
                  type="text"
                  value={formData.schedule.saturdays}
                  onChange={(e) => setFormData({
                    ...formData,
                    schedule: { ...formData.schedule, saturdays: e.target.value }
                  })}
                  placeholder="8:00 AM – 6:00 PM"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Domingos & Festivos
                </label>
                <input
                  type="text"
                  value={formData.schedule.sundays}
                  onChange={(e) => setFormData({
                    ...formData,
                    schedule: { ...formData.schedule, sundays: e.target.value }
                  })}
                  placeholder="Citas especiales bajo reserva"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Fila: Enlaces de Mapas & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Google Maps URL
                </label>
                <input
                  type="text"
                  value={formData.googleMapsUrl}
                  onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Waze URL
                </label>
                <input
                  type="text"
                  value={formData.wazeUrl}
                  onChange={(e) => setFormData({ ...formData, wazeUrl: e.target.value })}
                  placeholder="https://waze.com/ul?q=..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Mensaje WhatsApp de Cita
                </label>
                <input
                  type="text"
                  value={formData.whatsappMessage}
                  onChange={(e) => setFormData({ ...formData, whatsappMessage: e.target.value })}
                  placeholder="¡Hola! Deseo agendar en esta sede..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* SECCIÓN NUEVA: CONFIGURACIÓN SEO DEDICADA PARA GOOGLE */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/80 via-slate-950 to-indigo-950/40 border border-indigo-500/30 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <Search size={15} />
                <span>Optimización SEO Local para Google & Motores de Búsqueda</span>
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Meta Título SEO (Title Tag)
                  </label>
                  <input
                    type="text"
                    value={formData.seoTitle || ""}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    placeholder="Prótesis Capilar en Barranquilla • Centro Histórico | Procap Natural"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Meta Descripción SEO
                  </label>
                  <textarea
                    rows={2}
                    value={formData.seoDescription || ""}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    placeholder="Sistemas capilares indetectables en Barranquilla. Calle 64 #46-69. Adhesivos médicos ultra-resistentes al calor y la playa..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-400 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setEditingSede(null);
                  setIsCreating(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                <span>{saving ? "Guardando en Supabase..." : "Guardar Sede"}</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* LISTA DE SEDES ACTUALES (CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sedes.map((sede) => (
          <div
            key={sede.slug}
            className="p-6 rounded-3xl bg-slate-950 border border-slate-800 hover:border-slate-700 shadow-xl relative overflow-hidden flex flex-col justify-between group transition-all"
          >
            <div>
              {/* Cover Image Preview */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 mb-4 border border-slate-800">
                <Image
                  src={sede.coverImage}
                  alt={sede.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="400px"
                />
                <div className="absolute top-2.5 left-2.5 px-3 py-1 bg-slate-950/80 backdrop-blur-md text-amber-400 font-bold text-[11px] rounded-full border border-amber-500/30">
                  {sede.badge}
                </div>
                
                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
                  {sede.videoUrl && (
                    <span className="px-2.5 py-1 bg-sky-950/90 border border-sky-400/30 text-sky-300 font-bold text-[10px] rounded-lg flex items-center gap-1">
                      <Video size={11} />
                      <span>Con Video</span>
                    </span>
                  )}
                  <span className="px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-white font-semibold text-[10px] rounded-lg">
                    {sede.gallery?.length || 0} fotos
                  </span>
                </div>
              </div>

              {/* Title & Info */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-xl font-bold text-white font-heading">{sede.name}</h3>
                  <span className="text-xs text-sky-400 font-semibold">{sede.city} • {sede.department}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500 bg-slate-900 px-2.5 py-1 rounded-md">
                  /{sede.slug}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 mt-3">
                <p className="flex items-start gap-2">
                  <MapPin size={14} className="text-sky-400 shrink-0 mt-0.5" />
                  <span>{sede.address} ({sede.neighborhood})</span>
                </p>
                {sede.phone && (
                  <p className="flex items-start gap-2 text-emerald-400">
                    <Phone size={14} className="shrink-0 mt-0.5" />
                    <span>{sede.phone}</span>
                  </p>
                )}
                <p className="flex items-start gap-2 text-slate-400">
                  <Clock size={14} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>{sede.schedule.weekdays}</span>
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-5 border-t border-slate-800/80 mt-5 flex items-center justify-between gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(sede)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 transition-all"
                >
                  <Edit3 size={13} />
                  <span>Editar</span>
                </button>

                <Link
                  href={`/ubicacion/${sede.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition-all"
                >
                  <Eye size={13} />
                  <span>Ver en Vivo</span>
                </Link>
              </div>

              <button
                onClick={() => handleDeleteSede(sede.slug)}
                className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Eliminar Sede"
              >
                <Trash2 size={16} />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
