"use client";

import React, { useState, useEffect } from "react";
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
  ExternalLink
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
    addi_checkout_url: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Error al conectar con la base de datos");
    } finally {
      setSaving(false);
    }
  };

  const supabaseReady = isSupabaseConfigured();

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-amber-400 gap-3">
        <Loader2 className="animate-spin" size={32} />
        <span className="text-xs text-slate-400">Cargando configuración desde Supabase...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
              Ajustes del Sistema & Pasarelas
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Configura tus credenciales de Wompi, Sistecrédito, Addi, Groq IA y WhatsApp conectadas a Supabase.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Database size={14} className={supabaseReady ? "text-emerald-400" : "text-amber-400"} />
            <span>{supabaseReady ? "Supabase Cloud Conectado" : "Almacenamiento Local"}</span>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-300">
          <Check size={16} />
          <span>¡Ajustes guardados correctamente en Supabase y aplicados a la tienda!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 text-xs font-bold">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-8">
        
        {/* ======================================================== */}
        {/* SECCIÓN 1: PASARELAS DE PAGO Y CRÉDITOS EN COLOMBIA       */}
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
                  ID de Comercio / Merchant ID Sistecrédito
                </label>
                <input
                  type="text"
                  value={settings.sistecredito_merchant_id || ""}
                  onChange={(e) => handleChange("sistecredito_merchant_id", e.target.value)}
                  placeholder="Ej: SC-PROCAP-9664"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  URL / Enlace Directo de Cobro Sistecrédito
                </label>
                <input
                  type="url"
                  value={settings.sistecredito_url || ""}
                  onChange={(e) => handleChange("sistecredito_url", e.target.value)}
                  placeholder="https://credito.sistecredito.com/tienda/procap"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Bloque Addi */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                <span>Addi (Compra a Cuotas con Cédula y WhatsApp)</span>
              </div>
              <a
                href="https://co.addi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-pink-400 hover:underline flex items-center gap-1"
              >
                <span>Comercios Addi</span>
                <ExternalLink size={10} />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Client ID / ID de Comercio Addi
                </label>
                <input
                  type="text"
                  value={settings.addi_client_id || ""}
                  onChange={(e) => handleChange("addi_client_id", e.target.value)}
                  placeholder="addi_procap_natural_bogota"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  URL / Link Directo de Pago Addi
                </label>
                <input
                  type="url"
                  value={settings.addi_checkout_url || ""}
                  onChange={(e) => handleChange("addi_checkout_url", e.target.value)}
                  placeholder="https://checkout.addi.com/procap-natural"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECCIÓN 2: ASISTENTE DE INTELIGENCIA ARTIFICIAL (GROQ)    */}
        {/* ======================================================== */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Asistente Virtual (Groq AI)</h3>
              <p className="text-xs text-slate-400">Modelo ultra-rápido Llama 3.3 70B para atención al cliente</p>
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
        {/* SECCIÓN 3: CANALES COMERCIALES & CONTACTO                 */}
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
        {/* SECCIÓN 4: SEGURIDAD DEL PANEL ADMIN                      */}
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
