"use client";

import React, { useState, useEffect } from "react";
import { Appointment, INITIAL_APPOINTMENTS } from "@/lib/appointments-store";
import { 
  Calendar, 
  Phone, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Trash2, 
  Filter, 
  Search, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  User,
  MapPin,
  Scissors
} from "lucide-react";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      if (data.appointments) {
        setAppointments(data.appointments);
      }
    } catch (e) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: Appointment['status']) => {
    try {
      await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (e) {
      alert("Error al actualizar estado");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Deseas eliminar esta cita del registro?")) return;
    try {
      await fetch(`/api/appointments?id=${id}`, { method: "DELETE" });
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      alert("Error al eliminar cita");
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = filterStatus === "all" || apt.status === filterStatus;
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      apt.client_name.toLowerCase().includes(query) ||
      apt.client_phone.includes(query) ||
      apt.location_name.toLowerCase().includes(query) ||
      apt.service_name.toLowerCase().includes(query);
    return matchesStatus && matchesQuery;
  });

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case "confirmed":
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1"><CheckCircle2 size={12} /> Confirmada</span>;
      case "completed":
        return <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold flex items-center gap-1"><CheckCircle2 size={12} /> Realizada</span>;
      case "cancelled":
        return <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold flex items-center gap-1"><XCircle size={12} /> Cancelada</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1"><Clock size={12} /> Pendiente</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-white flex items-center gap-2">
            <Calendar size={24} className="text-amber-400" />
            <span>Agenda de Citas & Reservas</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Revisa y gestiona en tiempo real las citas agendadas desde la web o a través del asistente de IA CapilarBot.
          </p>
        </div>

        <button
          onClick={fetchAppointments}
          className="py-2.5 px-4 rounded-xl glass-panel hover:bg-white/10 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700 self-start sm:self-auto"
        >
          <Sparkles size={14} className="text-amber-400" />
          <span>Actualizar Citas</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-4 border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block">Total Citas</span>
          <span className="text-2xl font-black text-white mt-1 block">{appointments.length}</span>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-amber-500/30">
          <span className="text-xs text-amber-400 font-semibold block">Pendientes</span>
          <span className="text-2xl font-black text-amber-400 mt-1 block">
            {appointments.filter(a => a.status === 'pending').length}
          </span>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-emerald-500/30">
          <span className="text-xs text-emerald-400 font-semibold block">Confirmadas</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">
            {appointments.filter(a => a.status === 'confirmed').length}
          </span>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-sky-500/30">
          <span className="text-xs text-sky-400 font-semibold block">Realizadas</span>
          <span className="text-2xl font-black text-sky-400 mt-1 block">
            {appointments.filter(a => a.status === 'completed').length}
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por cliente, teléfono, sede..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex gap-1.5 flex-wrap w-full sm:w-auto justify-start sm:justify-end">
          {[
            { id: "all", label: "Todas" },
            { id: "pending", label: "Pendientes" },
            { id: "confirmed", label: "Confirmadas" },
            { id: "completed", label: "Realizadas" },
            { id: "cancelled", label: "Canceladas" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === tab.id
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="text-center py-16 text-amber-400">
          <Sparkles size={32} className="animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-300">Cargando agenda de citas...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl p-8 max-w-md mx-auto">
          <Calendar size={36} className="mx-auto text-slate-600 mb-2" />
          <h3 className="text-base font-bold text-white">No hay citas en esta categoría</h3>
          <p className="text-xs text-slate-400 mt-1">Prueba cambiando los filtros o buscando con otro término.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAppointments.map((apt) => {
            const cleanPhone = apt.client_phone.replace(/\D/g, "");
            const waPhone = cleanPhone.startsWith("57") ? cleanPhone : `57${cleanPhone}`;
            const confirmMsg = encodeURIComponent(
              `¡Hola ${apt.client_name}! 👋 Te saludamos de Procap Natural.\n\n` +
              `Confirmamos tu cita para:\n` +
              `📅 *Fecha:* ${apt.appointment_date} (${apt.appointment_time})\n` +
              `📍 *Sede:* ${apt.location_name}\n` +
              `✂️ *Servicio:* ${apt.service_name}\n\n` +
              `¿Nos confirmas tu asistencia? ¡Te esperamos en cabina privada!`
            );

            return (
              <div
                key={apt.id}
                className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {getStatusBadge(apt.status)}
                    <span className="text-[10px] text-slate-500">
                      Origen: {apt.created_by === 'capilarbot_ai' ? '🤖 CapilarBot IA' : '🌐 Web Directa'}
                    </span>
                  </div>

                  {/* Client Info */}
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <User size={16} className="text-amber-400" />
                      <span>{apt.client_name}</span>
                    </h3>

                    <p className="text-xs text-slate-300 flex items-center gap-2">
                      <Phone size={13} className="text-emerald-400" />
                      <span>{apt.client_phone}</span>
                    </p>

                    <p className="text-xs text-slate-300 flex items-center gap-2">
                      <MapPin size={13} className="text-sky-400" />
                      <span>{apt.location_name}</span>
                    </p>

                    <p className="text-xs text-slate-300 flex items-center gap-2">
                      <Scissors size={13} className="text-amber-400" />
                      <span className="font-semibold text-white">{apt.service_name}</span>
                    </p>

                    <div className="mt-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-white font-bold">
                        <Calendar size={13} className="text-amber-400" />
                        {apt.appointment_date}
                      </span>
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Clock size={13} />
                        {apt.appointment_time}
                      </span>
                    </div>

                    {apt.notes && (
                      <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2 rounded-lg mt-2 border border-slate-900">
                        "{apt.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
                  <a
                    href={`https://wa.me/${waPhone}?text=${confirmMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-500/30 transition-all"
                  >
                    <MessageSquare size={14} />
                    <span>Contactar / Confirmar por WhatsApp</span>
                  </a>

                  <div className="flex gap-1.5">
                    {apt.status !== "confirmed" && (
                      <button
                        onClick={() => handleUpdateStatus(apt.id, "confirmed")}
                        className="flex-1 py-1.5 rounded-lg bg-slate-900 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-slate-800"
                      >
                        Confirmar
                      </button>
                    )}
                    {apt.status !== "completed" && (
                      <button
                        onClick={() => handleUpdateStatus(apt.id, "completed")}
                        className="flex-1 py-1.5 rounded-lg bg-slate-900 hover:bg-sky-500/20 text-sky-400 text-xs font-semibold border border-slate-800"
                      >
                        Realizada
                      </button>
                    )}
                    {apt.status !== "cancelled" && (
                      <button
                        onClick={() => handleUpdateStatus(apt.id, "cancelled")}
                        className="flex-1 py-1.5 rounded-lg bg-slate-900 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-slate-800"
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(apt.id)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-500/20 text-slate-500 hover:text-red-400 border border-slate-800"
                      title="Eliminar registro"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
