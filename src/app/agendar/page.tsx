"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Scissors, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Crown,
  Layers,
  HeartHandshake
} from "lucide-react";
import { CapilarEvent, INITIAL_EVENTS } from "@/lib/events-store";

const SERVICES = [
  {
    id: "instalacion-sistema",
    title: "Instalación de Prótesis Capilar",
    duration: "2 a 3 Horas",
    desc: "Personalización de base, diseño de línea frontal natural, corte, fijación y estilizado completo.",
    badge: "Más Popular",
    price: "Incluido con prótesis / Desde $250.000 COP",
    icon: Crown,
  },
  {
    id: "mantenimiento-pro",
    title: "Mantenimiento Preventivo & Recambio",
    duration: "1 Hora",
    desc: "Retiro seguro sin dolor, limpieza ultrasónica de base, exfoliación de cuero cabelludo y nuevo adhesivo ultra-resistente.",
    badge: "Recomendado mensual",
    price: "$120.000 COP",
    icon: Scissors,
  },
  {
    id: "asesoria-diagnostico",
    title: "Valoración & Prueba de Color Gratis",
    duration: "30 Minutos",
    desc: "Prueba de densidad, tono exacto, base recomendada (French Lace, Skin o Híbrida) y cotización a medida.",
    badge: "Sin Costo",
    price: "GRATIS",
    icon: Sparkles,
  },
  {
    id: "corte-integracion",
    title: "Corte de Integración & Estilizado",
    duration: "45 Minutos",
    desc: "Degradado, perfilado de laterales y difuminado para fundir tu cabello biológico con la prótesis.",
    badge: "Estética",
    price: "$60.000 COP",
    icon: Layers,
  },
];

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", 
  "01:00 PM", "02:00 PM", "03:00 PM", 
  "04:00 PM", "05:00 PM", "06:00 PM"
];

export default function AgendarPage() {
  const [step, setStep] = useState(1);
  const [events, setEvents] = useState<CapilarEvent[]>(INITIAL_EVENTS);
  const [selectedLocationType, setSelectedLocationType] = useState<"bogota" | "gira">("bogota");
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>(SERVICES[0].id);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  
  // Contact info
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [appointmentRef, setAppointmentRef] = useState("");

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573151189795";

  useEffect(() => {
    // Cargar eventos activos para giras
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        if (data.events && data.events.length > 0) {
          setEvents(data.events.filter((e: CapilarEvent) => e.is_active));
        }
      })
      .catch(() => {});
  }, []);

  // Set min date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !selectedDate || !selectedTime) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    setIsSubmitting(true);
    try {
      const locationName = selectedLocationType === "bogota" 
        ? "Sede Principal Bogotá (Calle 16 #83a-15)" 
        : `Gira: ${events.find(ev => ev.id === selectedEventId)?.city || "Gira Nacional"}`;

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: clientName,
          client_phone: clientPhone,
          client_email: clientEmail,
          service_type: selectedService,
          location: locationName,
          event_id: selectedLocationType === "gira" ? selectedEventId : null,
          date: selectedDate,
          time_slot: selectedTime,
          notes: notes,
          origin: "web_booking"
        }),
      });

      const data = await res.json();
      if (data.success && data.appointment) {
        setAppointmentRef(data.appointment.id);
        setIsSuccess(true);
      } else {
        alert("Hubo un detalle al guardar la cita, pero te atenderemos por WhatsApp.");
        setIsSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedServiceObj = SERVICES.find(s => s.id === selectedService) || SERVICES[0];

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold badge-procap">
              <Sparkles size={14} /> Sistema de Reservas Online
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight">
              Agenda tu Cita o <span className="text-cyan-gradient">Valoración</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Elige tu sede o gira nacional, selecciona fecha y asegura tu espacio con nuestros especialistas en prótesis capilares.
            </p>
          </div>

          {!isSuccess ? (
            <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl space-y-8">
              
              {/* Stepper Progress */}
              <div className="flex items-center justify-between relative max-w-md mx-auto">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 -z-0"></div>
                <div 
                  className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-sky-400 to-cyan-400 -translate-y-1/2 -z-0 transition-all duration-300"
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                ></div>

                {[
                  { num: 1, label: "Ubicación" },
                  { num: 2, label: "Servicio" },
                  { num: 3, label: "Horario" },
                  { num: 4, label: "Confirmación" },
                ].map((s) => (
                  <div key={s.num} className="flex flex-col items-center gap-1.5 z-10">
                    <div 
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        step >= s.num
                          ? "bg-sky-400 text-slate-950 shadow-md shadow-sky-500/30 scale-105"
                          : "bg-slate-900 border border-slate-700 text-slate-400"
                      }`}
                    >
                      {step > s.num ? "✓" : s.num}
                    </div>
                    <span className={`text-[11px] font-medium hidden sm:block ${step >= s.num ? "text-white font-bold" : "text-slate-500"}`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* PASO 1: Ubicación / Gira */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center space-y-1">
                    <h2 className="text-xl font-bold text-white font-heading">¿Dónde deseas ser atendido?</h2>
                    <p className="text-xs text-slate-400">Selecciona nuestra sede fija en Bogotá o una de nuestras fechas en gira nacional.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sede Bogotá */}
                    <div 
                      onClick={() => {
                        setSelectedLocationType("bogota");
                        setSelectedEventId("");
                      }}
                      className={`p-6 rounded-2xl cursor-pointer border transition-all ${
                        selectedLocationType === "bogota"
                          ? "border-sky-400 bg-sky-500/10 shadow-lg shadow-sky-500/10"
                          : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                          <MapPin size={22} />
                        </div>
                        {selectedLocationType === "bogota" && (
                          <CheckCircle2 size={20} className="text-sky-400" />
                        )}
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400 block mb-1">Sede Principal Fija</span>
                      <h3 className="text-base font-bold text-white mb-2">Bogotá D.C.</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        📍 Calle 16 # 83a-15, Bogotá.<br />
                        Atención permanente de Lunes a Sábado con cita previa.
                      </p>
                    </div>

                    {/* Gira Nacional */}
                    <div 
                      onClick={() => setSelectedLocationType("gira")}
                      className={`p-6 rounded-2xl cursor-pointer border transition-all ${
                        selectedLocationType === "gira"
                          ? "border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10"
                          : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                          <Sparkles size={22} />
                        </div>
                        {selectedLocationType === "gira" && (
                          <CheckCircle2 size={20} className="text-amber-400" />
                        )}
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block mb-1">Eventos & Giras</span>
                      <h3 className="text-base font-bold text-white mb-2">Gira Nacional por Colombia</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Medellín, Cali, Barranquilla, Bucaramanga, Pereira y más ciudades con cupos limitados.
                      </p>
                    </div>
                  </div>

                  {/* Selector de ciudad de gira si seleccionó gira */}
                  {selectedLocationType === "gira" && (
                    <div className="space-y-3 pt-2">
                      <label className="text-xs font-bold text-slate-300 block">
                        Selecciona el Evento / Ciudad de Gira Disponible:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {events.map((ev) => (
                          <div
                            key={ev.id}
                            onClick={() => setSelectedEventId(ev.id)}
                            className={`p-4 rounded-xl cursor-pointer border text-left transition-all ${
                              selectedEventId === ev.id
                                ? "border-amber-400 bg-amber-400/20"
                                : "border-slate-800 bg-slate-950/80 hover:border-slate-700"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-sm text-white">{ev.city}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                {ev.spots_remaining} cupos
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 block mb-1">📅 {ev.date_text}</span>
                            <span className="text-[11px] text-slate-300 truncate block">🏨 {ev.location_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => {
                        if (selectedLocationType === "gira" && !selectedEventId && events.length > 0) {
                          setSelectedEventId(events[0].id);
                        }
                        setStep(2);
                      }}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/20 transition-all"
                    >
                      <span>Siguiente: Seleccionar Servicio</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 2: Servicio */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center space-y-1">
                    <h2 className="text-xl font-bold text-white font-heading">¿Qué servicio necesitas?</h2>
                    <p className="text-xs text-slate-400">Todos nuestros procedimientos son realizados de forma privada y personalizada.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SERVICES.map((srv) => {
                      const Icon = srv.icon;
                      const isSelected = selectedService === srv.id;

                      return (
                        <div
                          key={srv.id}
                          onClick={() => setSelectedService(srv.id)}
                          className={`p-5 rounded-2xl cursor-pointer border flex flex-col justify-between transition-all ${
                            isSelected
                              ? "border-sky-400 bg-sky-500/10 shadow-lg shadow-sky-500/10"
                              : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-sky-400 border border-sky-400/20">
                                {srv.badge}
                              </span>
                              {isSelected && <CheckCircle2 size={18} className="text-sky-400" />}
                            </div>

                            <div className="flex items-start gap-3 mb-2">
                              <div className="w-9 h-9 rounded-xl bg-sky-400/10 text-sky-400 flex items-center justify-center shrink-0">
                                <Icon size={20} />
                              </div>
                              <div>
                                <h3 className="font-bold text-white text-sm">{srv.title}</h3>
                                <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                  <Clock size={12} /> {srv.duration}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed mb-4">
                              {srv.desc}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400">Inversión:</span>
                            <span className="text-xs font-bold text-sky-400">{srv.price}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 transition-colors"
                    >
                      <ChevronLeft size={16} />
                      <span>Volver</span>
                    </button>

                    <button
                      onClick={() => setStep(3)}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/20 transition-all"
                    >
                      <span>Siguiente: Elegir Fecha & Hora</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 3: Fecha & Hora */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center space-y-1">
                    <h2 className="text-xl font-bold text-white font-heading">Elige la Fecha y Horario Ideal</h2>
                    <p className="text-xs text-slate-400">Selecciona el día a partir de mañana y la franja horaria que prefieras.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Fecha */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                        <CalendarIcon size={14} className="text-sky-400" />
                        Selecciona el Día:
                      </label>
                      <input
                        type="date"
                        min={minDateStr}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
                      />
                      <p className="text-[11px] text-slate-500">
                        Atendemos de Lunes a Sábado de 9:00 AM a 7:00 PM.
                      </p>
                    </div>

                    {/* Horas */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                        <Clock size={14} className="text-sky-400" />
                        Selecciona la Franja Horaria:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {TIME_SLOTS.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                              selectedTime === time
                                ? "bg-sky-400 text-slate-950 shadow-md shadow-sky-500/20"
                                : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-600"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 transition-colors"
                    >
                      <ChevronLeft size={16} />
                      <span>Volver</span>
                    </button>

                    <button
                      onClick={() => {
                        if (!selectedDate || !selectedTime) {
                          alert("Por favor selecciona una fecha y una hora.");
                          return;
                        }
                        setStep(4);
                      }}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/20 transition-all"
                    >
                      <span>Siguiente: Tus Datos</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 4: Datos y Confirmación */}
              {step === 4 && (
                <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                  <div className="text-center space-y-1">
                    <h2 className="text-xl font-bold text-white font-heading">Completa tus Datos de Contacto</h2>
                    <p className="text-xs text-slate-400">Te enviaremos la confirmación instantánea a tu WhatsApp y correo.</p>
                  </div>

                  {/* Resumen previo */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="text-slate-500">Servicio:</span>
                      <span className="font-bold text-white">{selectedServiceObj.title}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="text-slate-500">Ubicación:</span>
                      <span className="font-bold text-sky-400">
                        {selectedLocationType === "bogota" ? "Sede Bogotá" : `Gira ${events.find(e => e.id === selectedEventId)?.city || "Nacional"}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="text-slate-500">Fecha y Hora:</span>
                      <span className="font-bold text-emerald-400">{selectedDate} a las {selectedTime}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <User size={13} className="text-sky-400" /> Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Ej. Carlos Rodríguez"
                        className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Phone size={13} className="text-emerald-400" /> WhatsApp / Teléfono *
                      </label>
                      <input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="Ej. 315 118 9795"
                        className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Mail size={13} className="text-slate-400" /> Correo Electrónico (Opcional)
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="nombre@ejemplo.com"
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Notas o Preguntas Especiales (Opcional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="¿Tienes alguna preferencia de base, alopecia total/parcial o alergia a algún adhesivo?"
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 transition-colors"
                    >
                      <ChevronLeft size={16} />
                      <span>Volver</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Agendando...</span>
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          <span>Confirmar y Reservar Cita</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>
          ) : (
            /* Pantalla de Éxito */
            <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 border border-emerald-500/40 text-center space-y-6 max-w-xl mx-auto animate-fade-in shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl shadow-lg shadow-emerald-500/20">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ¡Reserva Recibida con Éxito!
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
                  ¡Gracias, {clientName}!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Tu cita para <strong className="text-white">{selectedServiceObj.title}</strong> el día <strong className="text-emerald-400">{selectedDate}</strong> a las <strong className="text-emerald-400">{selectedTime}</strong> ha quedado registrada.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left text-xs space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Código de Referencia:</span>
                  <span className="font-mono font-bold text-sky-400">{appointmentRef || "PROC-APP"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Teléfono:</span>
                  <span className="font-bold text-white">{clientPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ubicación:</span>
                  <span className="font-bold text-white">
                    {selectedLocationType === "bogota" ? "Calle 16 #83a-15, Bogotá" : `Gira ${events.find(e => e.id === selectedEventId)?.city || "Nacional"}`}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    `¡Hola Procap Natural! 👋 Acabo de agendar una cita para *${selectedServiceObj.title}* el *${selectedDate}* a las *${selectedTime}* a nombre de *${clientName}* (Ref: ${appointmentRef}). ¿Me confirman los detalles?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <i className="fa-brands fa-whatsapp text-base"></i>
                  <span>Confirmar Inmediato por WhatsApp</span>
                </a>

                <Link
                  href="/"
                  className="flex items-center justify-center px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 transition-colors"
                >
                  Volver al Inicio
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
