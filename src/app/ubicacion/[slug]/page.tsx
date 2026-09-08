import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEDES_DATA, getSedeBySlug } from "@/lib/sedes-data";
import { 
  MapPin, 
  Clock, 
  Car, 
  Navigation, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  ArrowLeft,
  Phone,
  Calendar,
  Layers,
  ChevronRight,
  Eye,
  Camera
} from "lucide-react";

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return SEDES_DATA.map((sede) => ({
    slug: sede.slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const sede = getSedeBySlug(params.slug);
  if (!sede) {
    return {
      title: "Sede No Encontrada | Procap Natural Colombia",
    };
  }

  return {
    title: `${sede.name} (${sede.city}) • Instalaciones y Dirección | Procap Natural`,
    description: `Conoce las instalaciones, galería de fotos y dirección de ${sede.name} en ${sede.neighborhood}, ${sede.city}. ${sede.address}. Cabinas privadas para prótesis capilares.`,
    keywords: [
      `prótesis capilar ${sede.city.toLowerCase()}`,
      `procap natural ${sede.slug}`,
      `instalaciones protesis capilar ${sede.city.toLowerCase()}`,
      `${sede.address.toLowerCase()}`,
      `salón prótesis capilar ${sede.city.toLowerCase()}`
    ],
    openGraph: {
      title: `${sede.name} (${sede.city}) • Procap Natural Colombia`,
      description: sede.description,
      images: [
        {
          url: sede.coverImage,
          width: 1200,
          height: 675,
          alt: `Instalaciones de ${sede.name} en ${sede.city}`,
        }
      ]
    }
  };
}

export default function SedeDetailPage({ params }: PageProps) {
  const sede = getSedeBySlug(params.slug);
  if (!sede) {
    notFound();
  }

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573151189795";
  const otherSedes = SEDES_DATA.filter((s) => s.slug !== sede.slug);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 pt-6 pb-20 relative z-10">
        
        {/* Ambient Glows */}
        <div className="glow-ambient top-0 left-1/3 -translate-x-1/2"></div>
        <div className="glow-ambient top-[40%] right-[-100px]"></div>

        {/* Back Link & Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
          <Link
            href="/ubicacion"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-sky-400 transition-colors py-1 px-3 rounded-full bg-slate-900/80 border border-slate-800"
          >
            <ArrowLeft size={14} />
            <span>Volver a Todas las Sedes</span>
          </Link>
        </div>

        {/* HERO SECTION DE LA SEDE */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Info */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-bold">
                <MapPin size={13} className="text-sky-400" />
                <span>{sede.badge} • {sede.city}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight leading-[1.15]">
                {sede.name} <span className="text-cyan-gradient">({sede.city})</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                {sede.description}
              </p>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-sm text-slate-300">
                <div className="flex items-start gap-2.5">
                  <MapPin size={18} className="text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">{sede.address}</strong>
                    <span className="text-xs text-slate-400">{sede.neighborhood} • Código Postal: {sede.postalCode}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(sede.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                >
                  <i className="fa-brands fa-whatsapp text-lg"></i>
                  <span>Agendar en {sede.city}</span>
                </a>

                <a
                  href={sede.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-5 rounded-xl glass-panel hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700"
                >
                  <ExternalLink size={15} />
                  <span>Abrir en Google Maps</span>
                </a>
              </div>
            </div>

            {/* Right: Featured Cover Photo with Badge */}
            <div className="lg:col-span-6">
              <div className="glass-panel rounded-3xl p-3 border border-white/10 shadow-2xl overflow-hidden relative group">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900">
                  <Image
                    src={sede.coverImage}
                    alt={`Fachada e instalaciones de ${sede.name}`}
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <span className="font-bold flex items-center gap-1.5 bg-slate-950/80 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                      <Camera size={13} className="text-sky-400" />
                      <span>Instalaciones Oficiales</span>
                    </span>
                    <span className="text-[11px] text-slate-300 font-medium bg-slate-950/80 px-2.5 py-1 rounded-full">
                      {sede.city}, Colombia
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* GALERÍA DE FOTOS DE LAS INSTALACIONES */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="border-t border-slate-800/80 pt-12">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-bold mb-2">
                <Sparkles size={13} />
                <span>Tour Fotográfico</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
                Mira las Instalaciones de <span className="text-cyan-gradient">{sede.name}</span>
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-2">
                Espacios higiénicos, climatizados e individuales diseñados para tu absoluta comodidad y discreción.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sede.gallery.map((photo, index) => (
                <div 
                  key={index}
                  className="glass-panel rounded-2xl p-2.5 border border-white/10 hover:border-sky-400/40 transition-all group overflow-hidden shadow-xl"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-3">
                    <Image
                      src={photo.url}
                      alt={photo.caption}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-slate-950/80 backdrop-blur-md flex items-center justify-center text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye size={14} />
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-slate-300 px-2 pb-1 text-center">
                    {photo.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COMODIDADES & HISTORIA DE LA SEDE */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Descripción detallada */}
            <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white font-heading mb-2">Sobre Nuestras Instalaciones</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {sede.fullStory}
                </p>
              </div>

              <div className="border-t border-slate-800 pt-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-sky-400 mb-4 flex items-center gap-2">
                  <ShieldCheck size={16} />
                  <span>Comodidades y Protocolos de la Sede</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sede.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Horarios y Asesoría */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Horarios de Atención</h3>
                    <span className="text-xs text-amber-400 font-semibold">Exclusivo con Cita Previa</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm text-slate-300 pt-2">
                  <div className="flex items-center justify-between py-2 border-b border-slate-800">
                    <span className="font-semibold text-slate-300">Lunes a Viernes:</span>
                    <span className="text-sky-400 font-bold">{sede.schedule.weekdays}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-800">
                    <span className="font-semibold text-slate-300">Sábados:</span>
                    <span className="text-sky-400 font-bold">{sede.schedule.saturdays}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="font-semibold text-slate-300">Domingos & Festivos:</span>
                    <span className="text-emerald-400 font-bold">{sede.schedule.sundays}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <Link
                    href="/agendar"
                    className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/20"
                  >
                    <Calendar size={15} />
                    <span>Reservar Cita en Línea</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* MAPA INTERACTIVO & GUÍA DE CÓMO LLEGAR */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block mb-1">Ubicación Exacta</span>
                <h2 className="text-2xl font-black font-heading text-white">¿Cómo Llegar a {sede.name}?</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">{sede.address}, {sede.neighborhood} • {sede.city}</p>
              </div>

              <div className="flex gap-2 shrink-0">
                <a
                  href={sede.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-sky-500 text-slate-200 hover:text-slate-950 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <Navigation size={14} />
                  <span>Google Maps</span>
                </a>
                <a
                  href={sede.wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-cyan-500 text-slate-200 hover:text-slate-950 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <ExternalLink size={14} />
                  <span>Waze</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Mapa Embed */}
              <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                <iframe
                  src={sede.googleMapsEmbed}
                  width="100%"
                  height="360"
                  style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(90%)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              {/* Transit Details */}
              <div className="lg:col-span-5 space-y-4 text-xs text-slate-300">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <Car size={16} className="text-sky-400" />
                    <span>En Vehículo / Taxi</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{sede.transitGuide.car}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <Navigation size={16} className="text-emerald-400" />
                    <span>Transporte Público</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{sede.transitGuide.publicTransport}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <MapPin size={16} className="text-amber-400" />
                    <span>Parqueadero</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{sede.transitGuide.parking}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EXPLORAR OTRAS SEDES */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="border-t border-slate-800/80 pt-10">
            <h3 className="text-lg font-bold text-white font-heading mb-6 text-center sm:text-left">
              Explorar Otras Sedes en Colombia
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {otherSedes.map((other) => (
                <Link
                  key={other.slug}
                  href={`/ubicacion/${other.slug}`}
                  className="glass-panel rounded-2xl p-4 border border-white/10 hover:border-sky-400/40 transition-all group block"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-3">
                    <Image
                      src={other.coverImage}
                      alt={other.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm group-hover:text-sky-400 transition-colors">{other.name}</h4>
                      <p className="text-xs text-slate-400">{other.city}</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
