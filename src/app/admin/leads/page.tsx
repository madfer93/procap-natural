"use client";

import React, { useState, useEffect } from "react";
import { 
  Bot, 
  MessageSquare, 
  Trash2, 
  Phone, 
  Calendar, 
  User, 
  Search, 
  Loader2, 
  X, 
  ExternalLink,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Clock
} from "lucide-react";
import { AILead } from "@/app/api/leads/route";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<AILead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<AILead | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err) {
      console.error("Error al cargar leads:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("¿Deseas eliminar este registro de conversación?")) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        if (selectedLead?.id === id) {
          setSelectedLead(null);
        }
      }
    } catch (err) {
      console.error("Error al eliminar lead:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const term = searchTerm.toLowerCase();
    const summaryMatch = lead.summary?.toLowerCase().includes(term);
    const userMatch = lead.user_name?.toLowerCase().includes(term);
    const phoneMatch = lead.user_phone?.includes(term);
    const msgMatch = lead.conversation_log?.some((m) => m.content.toLowerCase().includes(term));
    return summaryMatch || userMatch || phoneMatch || msgMatch;
  });

  return (
    <div className="space-y-8 max-w-7xl pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
              Personas Atendidas por IA (CapilarBot)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold border border-sky-400/20">
              {leads.length} conversaciones
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Historial de clientes y consultas recibidas por el Asistente Virtual en tiempo real.
          </p>
        </div>

        <button
          onClick={fetchLeads}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por mensaje, consulta o teléfono..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
        />
      </div>

      {/* Layout Grid: List on Left, Chat Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Leads List */}
        <div className={`space-y-3 ${selectedLead ? "lg:col-span-6" : "lg:col-span-12"}`}>
          {loading ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-amber-400" size={28} />
              <span className="text-xs">Cargando conversaciones desde Supabase...</span>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto">
                <Bot size={24} />
              </div>
              <h3 className="text-sm font-bold text-white">No hay conversaciones registradas aún</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Cuando los visitantes interactúen con el Asistente CapilarBot en la web, sus consultas e historial aparecerán aquí automáticamente.
              </p>
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const isSelected = selectedLead?.id === lead.id;
              const dateStr = lead.created_at 
                ? new Date(lead.created_at).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" }) 
                : "Reciente";

              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-slate-900 border-amber-400/80 shadow-lg shadow-amber-500/10"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-slate-950 shrink-0 font-bold">
                        <Bot size={20} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {lead.user_name || "Visitante Web"}
                          </span>
                          {lead.user_phone && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                              {lead.user_phone}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          "{lead.summary}"
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-1">
                          <span className="flex items-center gap-1">
                            <Clock size={11} /> {dateStr}
                          </span>
                          <span>•</span>
                          <span>{lead.conversation_log?.length || 0} mensajes</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => handleDelete(lead.id, e)}
                        disabled={deletingId === lead.id}
                        className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Eliminar conversación"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Lead Conversation Detail Panel */}
        {selectedLead && (
          <div className="lg:col-span-6 rounded-2xl bg-slate-950 border border-amber-500/40 p-5 shadow-2xl space-y-4 sticky top-6">
            
            {/* Detail Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Historial de Conversación Completo</h3>
                  <span className="text-[10px] text-slate-400">
                    ID: {selectedLead.id.slice(0, 12)}...
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {selectedLead.conversation_log && selectedLead.conversation_log.map((msg, idx) => {
                const isUser = msg.role === "user";

                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="text-[10px] font-bold text-slate-400">
                        {isUser ? "👤 Usuario" : "🤖 CapilarBot"}
                      </span>
                      {msg.time && (
                        <span className="text-[9px] text-slate-600">
                          {msg.time}
                        </span>
                      )}
                    </div>
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                        isUser
                          ? "bg-amber-500 text-slate-950 font-medium rounded-tr-sm"
                          : "bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-sm"
                      }`}
                    >
                      <div className="whitespace-pre-line space-y-1">
                        {msg.content.split('\n').map((line, lIdx) => {
                          const parts = line.split(/(\*\*.*?\*\*)/g);
                          return (
                            <p key={lIdx}>
                              {parts.map((part, pIdx) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return (
                                    <strong key={pIdx} className={isUser ? "font-black text-black" : "font-bold text-sky-400"}>
                                      {part.slice(2, -2)}
                                    </strong>
                                  );
                                }
                                return part;
                              })}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Total mensajes: {selectedLead.conversation_log?.length || 0}
              </span>

              {selectedLead.user_phone && (
                <a
                  href={`https://wa.me/${selectedLead.user_phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <Phone size={13} />
                  <span>Contactar a WhatsApp</span>
                </a>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
