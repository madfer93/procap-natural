"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Shield,
  KeyRound,
  MapPin,
  Percent,
  Phone,
  Mail,
  CreditCard,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Save,
  ArrowLeft,
  Search,
  Building2,
  Scissors,
  Store
} from "lucide-react";
import { StaffSeller, SEDE_LABELS } from "@/lib/staff-store";

export default function AdminVendedoresPage() {
  const [staffList, setStaffList] = useState<StaffSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSedeFilter, setSelectedSedeFilter] = useState<string>("all");

  // Panel de creación/edición inline (sin modales flotantes)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffSeller | null>(null);

  const [formData, setFormData] = useState<Partial<StaffSeller>>({
    name: "",
    phone: "",
    email: "",
    cedula: "",
    pin: "",
    sede_id: "bogota",
    role: "seller",
    commission_percent: 5,
    is_active: true,
  });

  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/staff");
      const data = await res.json();
      if (data.staff) {
        setStaffList(data.staff);
      }
    } catch (err) {
      console.error("Error cargando personal:", err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleOpenCreate = () => {
    setEditingStaff(null);
    setFormData({
      id: `staff-${Date.now()}`,
      name: "",
      phone: "",
      email: "",
      cedula: "",
      pin: Math.floor(1000 + Math.random() * 9000).toString(), // PIN sugerido de 4 dígitos
      sede_id: "bogota",
      role: "seller",
      commission_percent: 5,
      is_active: true,
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenEdit = (staff: StaffSeller) => {
    setEditingStaff(staff);
    setFormData({ ...staff });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.pin || !formData.sede_id) {
      showNotification("Por favor completa el Nombre, PIN y Sede.", "error");
      return;
    }

    try {
      setSaving(true);
      const method = editingStaff ? "PUT" : "POST";
      const res = await fetch("/api/staff", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al guardar empleado");
      }

      showNotification(
        editingStaff ? "Vendedor actualizado exitosamente" : "Nuevo vendedor registrado con éxito",
        "success"
      );
      setIsFormOpen(false);
      fetchStaff();
    } catch (err: any) {
      showNotification(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar a ${name}? Esta acción no se puede deshacer.`)) return;

    try {
      const res = await fetch(`/api/staff?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      showNotification("Vendedor eliminado correctamente", "success");
      fetchStaff();
    } catch (err: any) {
      showNotification(err.message, "error");
    }
  };

  const filteredStaff = staffList.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.cedula && s.cedula.includes(searchTerm));
    const matchSede = selectedSedeFilter === "all" || s.sede_id === selectedSedeFilter || s.sede_id === "all";
    return matchSearch && matchSede;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                Recursos Humanos & POS
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-heading font-black text-white mt-1 flex items-center gap-3">
              <Users className="text-amber-400" />
              Gestión de Vendedores & Sedes
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Control de personal de cabina, asignación de sedes, PINs de acceso para Terminal POS y comisiones.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <UserPlus size={16} />
              <span>Registrar Vendedor</span>
            </button>
          </div>
        </div>

        {/* Notificaciones */}
        {statusMessage && (
          <div
            className={`my-4 p-4 rounded-xl border text-sm font-medium flex items-center justify-between animate-fade-in ${
              statusMessage.type === "success"
                ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                : "bg-red-950/40 border-red-500/30 text-red-300"
            }`}
          >
            <span>{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)} className="text-xs opacity-70 hover:opacity-100">
              ✕
            </button>
          </div>
        )}

        {/* Panel Formulario Inline */}
        {isFormOpen && (
          <div className="my-6 p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                  {editingStaff ? <Edit size={20} /> : <UserPlus size={20} />}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">
                    {editingStaff ? `Editar a ${editingStaff.name}` : "Registrar Nuevo Asesor / Estilista"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Asigna la sede de trabajo y configura el PIN de 4 dígitos para que pueda facturar en la terminal POS.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                <ArrowLeft size={14} /> Cancelar
              </button>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Nombre Completo */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Carlos Rodríguez"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Sede Asignada */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Sede Asignada *
                </label>
                <select
                  value={formData.sede_id || "bogota"}
                  onChange={(e) => setFormData({ ...formData, sede_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="bogota">🏢 Sede Bogotá (Chicó Norte)</option>
                  <option value="cali">🌴 Sede Cali (Granada)</option>
                  <option value="neiva">☀️ Sede Neiva (Ipanema)</option>
                  <option value="barranquilla">🌊 Sede Barranquilla (El Prado)</option>
                  <option value="all">🌐 Todas las Sedes (Personal Móvil / Master)</option>
                </select>
              </div>

              {/* PIN de Acceso Rápido (POS) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                  <span>PIN de Acceso POS (4 Dígitos) *</span>
                  <KeyRound size={14} />
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="Ej: 1234"
                  value={formData.pin || ""}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, "") })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-amber-500/50 text-base font-mono tracking-widest text-amber-400 font-black focus:outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-slate-400 block">
                  Clave rápida para desbloquear la pantalla de cobro en cabina.
                </span>
              </div>

              {/* Rol en la Sede */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Rol / Cargo
                </label>
                <select
                  value={formData.role || "seller"}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="seller">🛍️ Asesor Comercial / Vendedor</option>
                  <option value="stylist">✂️ Estilista Capilar / Especialista</option>
                  <option value="admin">👑 Encargado de Sede / Administrador</option>
                </select>
              </div>

              {/* Porcentaje de Comisión */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                  <span>Comisión por Venta / Servicio (%)</span>
                  <Percent size={14} className="text-emerald-400" />
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={formData.commission_percent ?? 5}
                  onChange={(e) => setFormData({ ...formData, commission_percent: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-emerald-400 font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Cédula */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Cédula / Documento
                </label>
                <input
                  type="text"
                  placeholder="Ej: 1018000000"
                  value={formData.cedula || ""}
                  onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Teléfono */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Teléfono / WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="Ej: 300 123 4567"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Correo Electrónico */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  placeholder="Ej: asesor@procapnatural.com"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Estado Activo */}
              <div className="space-y-1.5 flex flex-col justify-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Estado del Empleado
                </label>
                <label className="inline-flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active ?? true}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-5 h-5 rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-400"
                  />
                  <span className="text-sm font-semibold text-slate-200">
                    {formData.is_active ? "🟢 Activo (Puede ingresar al POS)" : "🔴 Inactivo (Bloqueado)"}
                  </span>
                </label>
              </div>

              {/* Botón de Guardar */}
              <div className="md:col-span-2 lg:col-span-3 pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Save size={16} />
                  <span>{saving ? "Guardando..." : "Guardar Empleado"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filtros y Búsqueda */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Buscar por nombre, cédula o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <select
              value={selectedSedeFilter}
              onChange={(e) => setSelectedSedeFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400"
            >
              <option value="all">Filtrar por Sede: Todas</option>
              <option value="bogota">🏢 Bogotá</option>
              <option value="cali">🌴 Cali</option>
              <option value="neiva">☀️ Neiva</option>
              <option value="barranquilla">🌊 Barranquilla</option>
            </select>
          </div>
        </div>

        {/* Tabla de Vendedores */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">Asesor / Empleado</th>
                  <th className="py-3.5 px-4">Sede Asignada</th>
                  <th className="py-3.5 px-4">Rol & Comisión</th>
                  <th className="py-3.5 px-4">PIN POS</th>
                  <th className="py-3.5 px-4">Contacto</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                      Cargando personal...
                    </td>
                  </tr>
                ) : filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No se encontraron vendedores registrados.
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Asesor */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400 text-xs">
                            {staff.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div>{staff.name}</div>
                            {staff.cedula && (
                              <div className="text-[11px] text-slate-500 font-mono">C.C. {staff.cedula}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Sede */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                          <Building2 size={13} className="text-amber-400" />
                          {SEDE_LABELS[staff.sede_id] || staff.sede_id}
                        </span>
                      </td>

                      {/* Rol & Comisión */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white capitalize">
                            {staff.role === "admin"
                              ? "👑 Director / Encargado"
                              : staff.role === "stylist"
                              ? "✂️ Estilista Capilar"
                              : "🛍️ Asesor Comercial"}
                          </span>
                          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                            <Percent size={11} /> {staff.commission_percent}% Comisión
                          </span>
                        </div>
                      </td>

                      {/* PIN POS */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs tracking-wider">
                          PIN: {staff.pin}
                        </span>
                      </td>

                      {/* Contacto */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs text-slate-400 space-y-0.5">
                          {staff.phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone size={12} className="text-slate-500" />
                              <span>{staff.phone}</span>
                            </div>
                          )}
                          {staff.email && (
                            <div className="flex items-center gap-1.5 truncate max-w-[180px]">
                              <Mail size={12} className="text-slate-500" />
                              <span className="truncate">{staff.email}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="py-3.5 px-4">
                        {staff.is_active ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 size={12} /> Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                            <XCircle size={12} /> Inactivo
                          </span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(staff)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Editar empleado"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(staff.id, staff.name)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                            title="Eliminar empleado"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}
