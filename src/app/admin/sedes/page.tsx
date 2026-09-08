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
  Image as ImageIcon
} from "lucide-react";

export default function AdminSedesPage() {
  const [sedes, setSedes] = useState<SedeInfo[]>(SEDES_DATA);
  const [loading, setLoading] = useState(true);
  const [editingSede, setEditingSede] = useState<SedeInfo | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Estados de subida de imágenes a Cloudflare R2
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

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
    coverImage: "/images/sedes/bogota.jpg",
    gallery: [],
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
    whatsappMessage: "¡Hola Procap Natural! Deseo agendar mi valoración personalizada."
  });

  const [newAmenity, setNewAmenity] = useState("");

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
    setFormData({ ...sede });
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
      coverImage: "/images/sedes/bogota.jpg",
      gallery: [
        { url: "/images/sedes/bogota.jpg", caption: "Fachada de la Sede" },
        { url: "/images/sedes/cabina-vip.jpg", caption: "Cabina VIP Individual" }
      ],
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
      whatsappMessage: "¡Hola Procap Natural! Deseo agendar mi valoración personalizada."
    });
    setIsCreating(true);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  // Subir portada a Cloudflare R2
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
      showNotification(`¡Foto de fachada subida con éxito a ${result.provider === "cloudflare_r2" ? "Cloudflare R2" : result.provider}!`);
    } catch (err: any) {
      showNotification(`Error: ${err.message || err}`, "error");
    } finally {
      setUploadingCover(false);
    }
  };

  // Subir foto a la galería de la sede (Cloudflare R2)
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
      showNotification(`¡Foto de instalaciones añadida a Cloudflare R2!`);
    } catch (err: any) {
      showNotification(`Error: ${err.message || err}`, "error");
    } finally {
      setUploadingGallery(false);
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
      showNotification("¡Sede guardada y sincronizada en Supabase con éxito!");
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
            <span>Gestión de Ubicaciones Fijas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
            Sedes Oficiales & Instalaciones
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Administra las fachadas, galerías de fotos de las cabinas, direcciones, horarios y enlaces de mapas para cada sede.
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

      {/* FORMULARIO EXPANDIBLE INLINE PARA EDITAR/CREAR SEDE */}
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
                  Modifica la información que se muestra en la web pública (/ubicacion y /ubicacion/{formData.slug || "[slug]"}).
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
                  placeholder="Ej: Sede Bogotá, Sede Cali..."
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
                  placeholder="Ej: Bogotá, Cali, Neiva..."
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
                  placeholder="Ej: Cundinamarca, Valle, Huila..."
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
                  placeholder="bogota"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-sky-400 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Fila 2: Dirección, Barrio, Código Postal, Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Dirección Exacta *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ej: Carrera 16 #96-64"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Barrio / Edificio / Estudio
                </label>
                <input
                  type="text"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  placeholder="Ej: Barrio Chicó Norte"
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
                  placeholder="110221"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Etiqueta / Badge
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="Sede Principal"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* SECCIÓN: FOTO DE FACHADA / PORTADA (CLOUDFLARE R2) */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                    <Camera size={15} />
                    <span>Foto de Fachada / Portada de la Sede</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Esta imagen se muestra en la tarjeta de /ubicacion y como cabecera en /ubicacion/{formData.slug || "[slug]"}.
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
                    <span>{uploadingCover ? "Subiendo a R2..." : "Subir Foto a R2"}</span>
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
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <ImageIcon size={15} />
                    <span>Galería de Instalaciones (Cabinas, Sillones, Lavado)</span>
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
                    <span>{uploadingGallery ? "Subiendo..." : "+ Añadir Foto a R2"}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

            {/* Fila 4: Comodidades / Protocolos (Chips) */}
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

            {/* Fila 5: Horarios */}
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

            {/* Fila 6: Enlaces de Mapas & WhatsApp */}
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

      {/* LISTA DE SEDES ACTUALES (4 CARDS) */}
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
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-white font-semibold text-[10px] rounded-lg">
                  {sede.gallery?.length || 0} fotos en galería
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
