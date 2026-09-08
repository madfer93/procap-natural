"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Building2,
  Users,
  Package,
  Receipt,
  Plus,
  Trash2,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Percent,
  Wallet,
  Coins,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter
} from "lucide-react";
import { formatPriceCOP } from "@/lib/products-store";
import { StoreExpense, SEDE_LABELS } from "@/lib/staff-store";

export default function AdminContabilidadPage() {
  const [selectedSede, setSelectedSede] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // Formulario Inline de Gastos (Cero modales)
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState<Partial<StoreExpense>>({
    sede_id: "bogota",
    category: "arriendo",
    concept: "",
    amount_cop: 0,
    expense_date: new Date().toISOString().split("T")[0],
    paid_by: "Transferencia Bancaria",
  });
  const [savingExpense, setSavingExpense] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchContabilidadData();
  }, [selectedSede]);

  const fetchContabilidadData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/contabilidad?sede=${selectedSede}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error cargando contabilidad:", err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.concept || !expenseForm.amount_cop || !expenseForm.sede_id) {
      alert("Por favor completa todos los campos del gasto");
      return;
    }

    try {
      setSavingExpense(true);
      const res = await fetch("/api/admin/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseForm),
      });
      const resJson = await res.json();
      if (!res.ok || !resJson.success) {
        throw new Error(resJson.error || "Error al registrar gasto");
      }

      showNotification("Gasto de sede registrado exitosamente");
      setIsExpenseFormOpen(false);
      setExpenseForm({
        sede_id: "bogota",
        category: "arriendo",
        concept: "",
        amount_cop: 0,
        expense_date: new Date().toISOString().split("T")[0],
        paid_by: "Transferencia Bancaria",
      });
      fetchContabilidadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingExpense(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("¿Deseas eliminar este registro de gasto?")) return;
    try {
      await fetch(`/api/admin/expenses?id=${id}`, { method: "DELETE" });
      showNotification("Gasto eliminado");
      fetchContabilidadData();
    } catch (err) {
      alert("Error al eliminar gasto");
    }
  };

  const summary = data?.summary || {
    totalSalesCOP: 0,
    totalCostCOP: 0,
    grossProfitCOP: 0,
    grossMarginPercent: 0,
    totalExpensesCOP: 0,
    netProfitCOP: 0,
    netMarginPercent: 0,
    totalOrdersCount: 0,
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                Finanzas & P&L Procap
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-heading font-black text-white mt-1 flex items-center gap-3">
              <TrendingUp className="text-emerald-400" />
              Contabilidad & Business Analytics
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Estado de resultados en tiempo real: Ingresos brutos, Costos de importación (COGS), Gastos operativos y Utilidad neta real.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedSede}
              onChange={(e) => setSelectedSede(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-bold focus:outline-none focus:border-amber-400"
            >
              <option value="all">🌐 Consolidado Todas las Sedes</option>
              <option value="bogota">🏢 Sede Bogotá (Chicó Norte)</option>
              <option value="cali">🌴 Sede Cali (Granada)</option>
              <option value="neiva">☀️ Sede Neiva (Ipanema)</option>
              <option value="barranquilla">🌊 Sede Barranquilla (El Prado)</option>
            </select>

            <button
              onClick={() => setIsExpenseFormOpen(!isExpenseFormOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-lg shadow-red-600/20 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Registrar Gasto de Sede</span>
            </button>
          </div>
        </div>

        {/* Notificación Toast */}
        {statusMessage && (
          <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-sm font-semibold flex items-center justify-between">
            <span>{statusMessage}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* FORMULARIO INLINE DE GASTOS OPERATIVOS (Expandible) */}
        {/* ============================================================ */}
        {isExpenseFormOpen && (
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-red-500/30 shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                  <Receipt size={16} />
                </div>
                <h3 className="font-heading font-bold text-base text-white">
                  Nuevo Gasto Operativo de Sede
                </h3>
              </div>
              <button
                onClick={() => setIsExpenseFormOpen(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-300">Sede Afectada *</label>
                <select
                  value={expenseForm.sede_id || "bogota"}
                  onChange={(e) => setExpenseForm({ ...expenseForm, sede_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  <option value="bogota">🏢 Sede Bogotá</option>
                  <option value="cali">🌴 Sede Cali</option>
                  <option value="neiva">☀️ Sede Neiva</option>
                  <option value="barranquilla">🌊 Sede Barranquilla</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-300">Categoría *</label>
                <select
                  value={expenseForm.category || "arriendo"}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  <option value="arriendo">🏢 Arriendo / Local</option>
                  <option value="servicios">💡 Servicios Públicos / Internet</option>
                  <option value="insumos_cabina">✂️ Insumos Cabina / Guantes / Alcohol</option>
                  <option value="mantenimiento">🛠️ Mantenimiento / Adecuaciones</option>
                  <option value="viaticos">✈️ Viáticos / Giras</option>
                  <option value="comisiones">💰 Comisiones Pagadas</option>
                  <option value="otros">📦 Otros Gastos</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-300">Concepto / Descripción *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Pago arriendo Septiembre"
                  value={expenseForm.concept || ""}
                  onChange={(e) => setExpenseForm({ ...expenseForm, concept: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-red-400">Monto Gasto (COP) *</label>
                <input
                  type="number"
                  required
                  placeholder="Ej: 1500000"
                  value={expenseForm.amount_cop || ""}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount_cop: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-red-500/50 text-xs font-bold text-red-400 font-mono"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingExpense}
                  className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg cursor-pointer"
                >
                  {savingExpense ? "Guardando..." : "Guardar Gasto"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================ */}
        {/* KPI CARDS: ESTADO FINANCIERO PRINCIPAL */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* 1. Ventas Totales (Revenue) */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/30 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ventas Totales</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <DollarSign size={16} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-heading font-black text-amber-400">
                {formatPriceCOP(summary.totalSalesCOP)}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {summary.totalOrdersCount} transacciones registradas
              </span>
            </div>
          </div>

          {/* 2. Costo Mercancía (COGS) */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Costo Mercancía (COGS)</span>
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
                <Package size={16} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-heading font-black text-slate-200">
                {formatPriceCOP(summary.totalCostCOP)}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Costo adquisición de prótesis & insumos
              </span>
            </div>
          </div>

          {/* 3. Margen Bruto */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-sky-500/30 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Margen Bruto</span>
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Percent size={16} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-heading font-black text-sky-400">
                {formatPriceCOP(summary.grossProfitCOP)}
              </span>
              <span className="text-[11px] text-sky-300 font-bold block mt-0.5">
                {summary.grossMarginPercent}% margen sobre venta
              </span>
            </div>
          </div>

          {/* 4. Gastos Operativos de Sede */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-red-500/30 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Gastos Operativos</span>
              <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
                <Receipt size={16} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-heading font-black text-red-400">
                -{formatPriceCOP(summary.totalExpensesCOP)}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Arriendos, servicios e insumos de sede
              </span>
            </div>
          </div>

          {/* 5. Utilidad Neta Real */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                Utilidad Neta Real
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Sparkles size={16} />
              </div>
            </div>
            <div className="mt-3">
              <span className={`text-2xl font-heading font-black ${summary.netProfitCOP >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {formatPriceCOP(summary.netProfitCOP)}
              </span>
              <span className="text-[11px] text-emerald-300 font-black block mt-0.5">
                {summary.netMarginPercent}% Rendimiento Neto
              </span>
            </div>
          </div>

        </div>

        {/* ============================================================ */}
        {/* DESGLOSE POR SEDE (Bogotá, Cali, Neiva, Barranquilla) */}
        {/* ============================================================ */}
        <div className="space-y-4">
          <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
            <Building2 className="text-amber-400" size={20} />
            Rendimiento Financiero por Sede Física
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {["bogota", "cali", "neiva", "barranquilla"].map((sId) => {
              const sData = data?.sedesBreakdown?.[sId] || { sales: 0, costs: 0, gross: 0, expenses: 0, net: 0, count: 0 };
              return (
                <div
                  key={sId}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-sm text-white capitalize">{SEDE_LABELS[sId]}</span>
                    <span className="text-[11px] text-slate-400 font-semibold">{sData.count} ventas</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Ventas:</span>
                      <span className="font-bold text-amber-400">{formatPriceCOP(sData.sales)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Gastos Sede:</span>
                      <span className="text-red-400">-{formatPriceCOP(sData.expenses)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-white border-t border-slate-800 pt-1">
                      <span>Utilidad Neta:</span>
                      <span className={sData.net >= 0 ? "text-emerald-400" : "text-red-400"}>
                        {formatPriceCOP(sData.net)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* RANKINGS: VENDEDORES & PRODUCTOS MÁS VENDIDOS */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top Vendedores & Comisiones */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <Users className="text-amber-400" size={18} />
                Ranking de Vendedores & Comisiones
              </h3>
              <span className="text-[11px] text-slate-400">Personal de Cabina</span>
            </div>

            <div className="divide-y divide-slate-800">
              {data?.topSellers?.length > 0 ? (
                data.topSellers.map((seller: any, idx: number) => (
                  <div key={idx} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-white text-xs block">{seller.name}</span>
                        <span className="text-[10px] text-slate-400">{SEDE_LABELS[seller.sede] || seller.sede} • {seller.salesCount} ventas</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-amber-400 text-xs block">
                        {formatPriceCOP(seller.totalSales)}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-400 block">
                        Comisión: +{formatPriceCOP(seller.commissionEarned)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-6 text-center">No hay ventas registradas aún</p>
              )}
            </div>
          </div>

          {/* Top Productos Más Vendidos */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <Package className="text-emerald-400" size={18} />
                Productos & Servicios Más Vendidos
              </h3>
              <span className="text-[11px] text-slate-400">Por Ingresos</span>
            </div>

            <div className="divide-y divide-slate-800">
              {data?.topProducts?.length > 0 ? (
                data.topProducts.slice(0, 5).map((prod: any, idx: number) => (
                  <div key={idx} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 font-bold text-xs flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-white text-xs block">{prod.name}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{prod.category} • {prod.quantity} unidades</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-white text-xs block">
                        {formatPriceCOP(prod.totalRevenue)}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-400 block">
                        Ganancia: +{formatPriceCOP(prod.totalProfit)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-6 text-center">No hay datos de productos aún</p>
              )}
            </div>
          </div>

        </div>
    </div>
  );
}
