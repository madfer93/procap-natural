"use client";

import React, { useState, useEffect } from "react";
import { CapilarEvent, INITIAL_EVENTS } from "@/lib/events-store";
import { 
  Calendar, 
  MapPin, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  Save, 
  X,
  Clock,
  Eye,
  EyeOff
} from "lucide-react";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<CapilarEvent[]>(INITIAL_EVENTS);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<CapilarEvent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");

  const [formData, setFormData] = useState<Partial<CapilarEvent>>({
    city: "",
    department: "",
    date_text: "",
    schedule_text: "8:00 AM – 6:00 PM (Previa Cita)",
    location_name: "Estudio Privado & Cabina Individual",
    spots_remaining: 5,
    status: "Reserva Abierta",
    color_theme: "from-emerald-500/20 to-slate-900 border-emerald-500/30 text-emerald-400",
    services: [
      "Venta e instalación de prótesis capilar 100% natural",
      "Productos y adhesivos para mantenimiento (Walker Tape, C-22)",
      "Asesoría y valoración capilar GRATIS personalizada"
    ],
    is_active: true
  });

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.events) {
        setEvents(data.events);
      }
    } catch (e) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEdit = (ev: CapilarEvent) => {
    setEditingEvent(ev);
    setFormData(ev);
    setIsCreating(false);
  };

  const handleNew = () => {
    setEditingEvent(null);
    setFormData({
      city: "",
      department: "",
      date_text: "",
      schedule_text: "8:00 AM – 6:00 PM (Previa Cita)",
      location_name: "Estudio Privado & Cabina Individual",
      spots_remaining: 6,
      status: "Reserva Abierta",
      color_theme: "from-emerald-500/20 to-slate-900 border-emerald-500/30 text-emerald-400",
      services: [
        "Venta e instalación de prótesis capilar 100% natural",
        "Productos y adhesivos para mantenimiento",
        "Asesoría y valoración capilar GRATIS"
      ],
      is_active: true
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este evento o gira?")) return;
    try {
      await fetch(`/api/events?id=${id}`, { method: "DELETE" });
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (e) {
      alert("Error al eliminar");
    }
  };

  const handleToggleActive = async (ev: CapilarEvent) => {
    const updated = { ...ev, is_active: !ev.is_active };
    try {
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      setEvents(prev => prev.map(e => e.id === ev.id ? updated : e));
    } catch (e) {
      alert("Error al actualizar visibilidad");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.city || !formData.date_text) {
      alert("La ciudad y la fecha son obligatorias.");
      return;
    }

    const payload: CapilarEvent = {
      id: editingEvent ? editingEvent.id : `event-${Date.now()}`,
      city: formData.city || "",
      department: formData.department || "",
      date_text: formData.date_text || "",
      schedule_text: formData.schedule_text || "Previa Cita",
      location_name: formData.location_name || "Cabina Privada",
      spots_remaining: formData.spots_remaining || "Cupos Limitados",
      status: formData.status || "Reserva Abierta",
      color_theme: formData.color_theme || "from-sky-500/20 to-slate-900 border-sky-500/30 text-sky-400",
      services: formData.services || ["Instalación", "Mantenimiento", "Asesoría"],
      is_active: formData.is_active !== undefined ? formData.is_active : true
    };

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess("Evento guardado correctamente.");
        setTimeout(() => setSaveSuccess(""), 3000);
        setEditingEvent(null);
        setIsCreating(false);
        fetchEvents();
      }
    } catch (e) {
      alert("Error al guardar en el servidor.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-white flex items-center gap-2">
            <Calendar size={24} className="text-amber-400" />
            <span>Gestor de Giras & Eventos</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Administra las ciudades, fechas y cupos disponibles de las giras de Procap Natural en Colombia.
          </p>
        </div>

        <button
          onClick={handleNew}
          className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Nueva Gira / Evento</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Editor Inline Form (Sin modales invasivos) */}
      {(isCreating || editingEvent) && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl bg-slate-950 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Edit3 size={18} className="text-amber-400" />
              <span>{editingEvent ? `Editar Gira: ${editingEvent.city}` : "Crear Nueva Gira / Evento"}</span>
            </h3>
            <button
              onClick={() => { setEditingEvent(null); setIsCreating(false); }}
              className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Ciudad *
              </label>
              <input
                type="text"
                value={formData.city || ""}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="ej: Villavicencio, Manizales, Medellín"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Departamento / Región
              </label>
              <input
                type="text"
                value={formData.department || ""}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="ej: Meta • Llanos Orientales, Antioquia"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Fecha o Periodo *
              </label>
              <input
                type="text"
                value={formData.date_text || ""}
                onChange={(e) => setFormData({ ...formData, date_text: e.target.value })}
                placeholder="ej: Del 17 al 20 de Marzo, Próximo Fin de Semana"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Horario / Jornada
              </label>
              <input
                type="text"
                value={formData.schedule_text || ""}
                onChange={(e) => setFormData({ ...formData, schedule_text: e.target.value })}
                placeholder="ej: 8:00 AM – 6:00 PM (Previa Cita)"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Lugar / Espacio
              </label>
              <input
                type="text"
                value={formData.location_name || ""}
                onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                placeholder="ej: Estudio Privado & Cabina Individual, Hotel Ejecutivo"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Cupos Disponibles
              </label>
              <input
                type="text"
                value={formData.spots_remaining !== undefined ? String(formData.spots_remaining) : "5"}
                onChange={(e) => setFormData({ ...formData, spots_remaining: e.target.value })}
                placeholder="ej: 5, 8, o Cupos Limitados"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Estado del Evento
              </label>
              <select
                value={formData.status || "Reserva Abierta"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-400 outline-none"
              >
                <option value="Reserva Abierta">Reserva Abierta</option>
                <option value="Pre-Registro">Pre-Registro</option>
                <option value="Sede Activa">Sede Activa</option>
                <option value="Lista de Espera">Lista de Espera</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Color de Tarjeta
              </label>
              <select
                value={formData.color_theme || "from-emerald-500/20 to-slate-900 border-emerald-500/30 text-emerald-400"}
                onChange={(e) => setFormData({ ...formData, color_theme: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-400 outline-none"
              >
                <option value="from-emerald-500/20 to-slate-900 border-emerald-500/30 text-emerald-400">Verde Esmeralda (Llanos / Activo)</option>
                <option value="from-amber-500/20 to-slate-900 border-amber-500/30 text-amber-400">Dorado / Ámbar (Sede Oficial)</option>
                <option value="from-sky-500/20 to-slate-900 border-sky-500/30 text-sky-400">Azul Cielo (Eje Cafetero)</option>
                <option value="from-purple-500/20 to-slate-900 border-purple-500/30 text-purple-400">Púrpura VIP (Medellín)</option>
                <option value="from-pink-500/20 to-slate-900 border-pink-500/30 text-pink-400">Rosa Costa (Barranquilla)</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active !== false}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-900 border-slate-700"
              />
              <label htmlFor="is_active" className="text-xs text-slate-300 font-semibold cursor-pointer">
                Visible en la página pública de Giras & Eventos (/eventos)
              </label>
            </div>

            <div className="sm:col-span-2 flex gap-3 pt-4 border-t border-slate-800">
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2"
              >
                <Save size={15} />
                <span>Guardar Gira</span>
              </button>
              <button
                type="button"
                onClick={() => { setEditingEvent(null); setIsCreating(false); }}
                className="py-2.5 px-4 rounded-xl bg-slate-900 text-slate-400 hover:text-white font-semibold text-xs"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid de Eventos Existentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((ev) => (
          <div
            key={ev.id}
            className={`glass-panel rounded-3xl p-6 border shadow-xl flex flex-col justify-between bg-gradient-to-br ${ev.color_theme || "from-sky-500/20 to-slate-900 border-sky-500/30 text-sky-400"} ${!ev.is_active ? "opacity-50" : ""}`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-slate-900/90 text-xs font-bold border border-slate-700 text-white">
                  {ev.status}
                </span>
                <button
                  onClick={() => handleToggleActive(ev)}
                  title={ev.is_active ? "Ocultar en la web" : "Mostrar en la web"}
                  className="p-1 rounded-lg bg-slate-900/80 text-slate-400 hover:text-amber-400"
                >
                  {ev.is_active ? <Eye size={16} className="text-emerald-400" /> : <EyeOff size={16} />}
                </button>
              </div>

              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {ev.department}
              </span>
              <h3 className="text-2xl font-black font-heading text-white mt-0.5">
                {ev.city}
              </h3>

              <div className="space-y-2 text-xs text-slate-300 mt-4 pt-4 border-t border-slate-800/80">
                <p className="flex items-center gap-2">
                  <Calendar size={14} className="text-sky-400 shrink-0" />
                  <span className="font-bold text-white">{ev.date_text}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={14} className="text-amber-400 shrink-0" />
                  <span>{ev.schedule_text}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={14} className="text-emerald-400 shrink-0" />
                  <span className="truncate">{ev.location_name}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Users size={14} className="text-purple-400 shrink-0" />
                  <span>Cupos: {ev.spots_remaining}</span>
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 mt-6 flex gap-2">
              <button
                onClick={() => handleEdit(ev)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <Edit3 size={14} />
                <span>Editar</span>
              </button>
              <button
                onClick={() => handleDelete(ev.id)}
                className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-red-500/20 text-red-400 font-bold text-xs flex items-center justify-center border border-slate-800"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
