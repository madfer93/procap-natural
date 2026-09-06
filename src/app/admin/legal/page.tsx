"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  LegalDocument, 
  DEFAULT_LEGAL_DOCUMENTS 
} from "@/lib/legal-store";
import { 
  ShieldCheck, 
  FileText, 
  RotateCcw, 
  Cpu, 
  Camera, 
  Save, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Edit3, 
  Sparkles,
  Scale
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  ShieldCheck,
  FileText,
  RotateCcw,
  Cpu,
  Camera
};

export default function AdminLegalPage() {
  const [documents, setDocuments] = useState<LegalDocument[]>(DEFAULT_LEGAL_DOCUMENTS);
  const [selectedSlug, setSelectedSlug] = useState<string>("habeas-data");
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Cargar documentos desde la API / Supabase
  const loadDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/legal");
      const data = await res.json();
      if (data.docs && Array.isArray(data.docs) && data.docs.length > 0) {
        setDocuments(data.docs);
      }
    } catch (err) {
      console.error("Error al cargar documentos legales:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const selectedDoc = documents.find((d) => d.slug === selectedSlug) || documents[0];

  const handleFieldChange = (field: keyof LegalDocument, value: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.slug === selectedSlug ? { ...doc, [field]: value } : doc
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/legal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docs: documents })
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "¡Políticas legales actualizadas con éxito en Supabase!" });
      } else {
        setMessage({ type: "error", text: data.error || "Error al guardar en el servidor" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error de conexión al guardar" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleResetToDefault = async () => {
    if (!confirm(`¿Estás seguro de restablecer "${selectedDoc.title}" a su redacción legal colombiana oficial predeterminada?`)) {
      return;
    }

    const defaultDoc = DEFAULT_LEGAL_DOCUMENTS.find((d) => d.slug === selectedSlug);
    if (!defaultDoc) return;

    setDocuments((prev) =>
      prev.map((doc) => (doc.slug === selectedSlug ? { ...defaultDoc } : doc))
    );

    setMessage({ type: "success", text: "Documento restablecido. Haz clic en 'Guardar Cambios' para sincronizar con la base de datos." });
  };

  const IconComp = ICON_MAP[selectedDoc.icon_name] || FileText;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
              Gestión de Políticas Legales & Normativas
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              ISO 42001 & Ley 1581
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Edita los textos jurídicos de Habeas Data, Devoluciones, Términos, Uso de IA y Derechos de Imagen en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/legal/${selectedDoc.slug}`}
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <span>Ver Pública</span>
            <ExternalLink size={14} />
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{saving ? "Guardando..." : "Guardar Cambios"}</span>
          </button>
        </div>
      </div>

      {/* Message Banner */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs border animate-in fade-in ${
            message.type === "success"
              ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-300"
              : "bg-red-950/80 border-red-500/40 text-red-300"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Selector de Políticas Legales (Tabs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {documents.map((doc) => {
          const TabIcon = ICON_MAP[doc.icon_name] || FileText;
          const isSelected = doc.slug === selectedSlug;

          return (
            <button
              key={doc.slug}
              onClick={() => {
                setSelectedSlug(doc.slug);
                setActiveTab("editor");
              }}
              className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between gap-3 ${
                isSelected
                  ? "bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 border-amber-500/60 shadow-lg shadow-amber-500/10"
                  : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? "bg-amber-500 text-slate-950" : "bg-slate-900 text-slate-400"}`}>
                  <TabIcon size={16} />
                </div>
                <span className="text-[10px] font-semibold text-slate-400">v{doc.version}</span>
              </div>
              <div>
                <p className={`text-xs font-bold leading-tight ${isSelected ? "text-amber-300" : "text-white"}`}>
                  {doc.short_title}
                </p>
                <p className="text-[10px] text-slate-500 mt-1 truncate">{doc.badge}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Editor Main Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 shadow-2xl">
        
        {/* Document Metadata Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Título Completo
            </label>
            <input
              type="text"
              value={selectedDoc.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Normativa / Badge
            </label>
            <input
              type="text"
              value={selectedDoc.badge}
              onChange={(e) => handleFieldChange("badge", e.target.value)}
              placeholder="Ej: Ley 1581 de 2012"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Versión
              </label>
              <input
                type="text"
                value={selectedDoc.version}
                onChange={(e) => handleFieldChange("version", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Fecha
              </label>
              <input
                type="date"
                value={selectedDoc.last_updated}
                onChange={(e) => handleFieldChange("last_updated", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Resumen Ejecutivo (Aparece en las tarjetas y vista previa)
          </label>
          <textarea
            rows={2}
            value={selectedDoc.summary}
            onChange={(e) => handleFieldChange("summary", e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 leading-relaxed"
          />
        </div>

        {/* View Toggle (Editor vs Preview) */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveTab("editor")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "editor"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Edit3 size={13} />
              <span>Editor de Texto / Markdown</span>
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "preview"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Eye size={13} />
              <span>Vista Previa en Vivo</span>
            </button>
          </div>

          <button
            onClick={handleResetToDefault}
            className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1.5 underline transition-colors"
          >
            <RefreshCw size={12} />
            <span>Restablecer redacción jurídica predeterminada</span>
          </button>
        </div>

        {/* Editor Area */}
        {activeTab === "editor" ? (
          <div className="space-y-2">
            <textarea
              rows={18}
              value={selectedDoc.content}
              onChange={(e) => handleFieldChange("content", e.target.value)}
              placeholder="Escribe o pega el texto legal en formato Markdown (# Título, ### Sección, - Viñetas, **Negritas**)..."
              className="w-full bg-slate-900/90 border border-slate-700 focus:border-amber-400 rounded-2xl p-4 text-xs font-mono text-slate-200 leading-relaxed focus:outline-none scrollbar-thin scrollbar-thumb-slate-700"
            />
            <p className="text-[11px] text-slate-500 flex items-center gap-2">
              <span>Soporta Markdown:</span>
              <code className="text-amber-400 font-mono"># Título</code>
              <code className="text-amber-400 font-mono">### Subtítulo</code>
              <code className="text-amber-400 font-mono">**Negrita**</code>
              <code className="text-amber-400 font-mono">- Viñeta</code>
              <code className="text-amber-400 font-mono">1. Lista</code>
            </p>
          </div>
        ) : (
          /* Live Preview Area */
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                {selectedDoc.badge}
              </span>
              <h2 className="text-lg font-bold text-white mt-2">{selectedDoc.title}</h2>
              <p className="text-xs text-slate-400">Versión {selectedDoc.version} • {selectedDoc.last_updated}</p>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              {selectedDoc.content.split("\n\n").map((para, idx) => {
                const trimmed = para.trim();
                if (!trimmed) return null;
                if (trimmed.startsWith("# ")) {
                  return <h2 key={idx} className="text-base font-bold text-sky-400 pt-2">{trimmed.replace(/^#\s+/, '')}</h2>;
                }
                if (trimmed.startsWith("### ")) {
                  return <h3 key={idx} className="text-sm font-bold text-amber-400 pt-1">{trimmed.replace(/^###\s+/, '')}</h3>;
                }
                if (trimmed === "---") {
                  return <hr key={idx} className="border-slate-800" />;
                }
                if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                  return (
                    <ul key={idx} className="list-disc pl-4 space-y-1">
                      {trimmed.split("\n").map((li, lIdx) => (
                        <li key={lIdx}>{li.replace(/^[-*]\s+/, '')}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={idx}>{trimmed}</p>;
              })}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
