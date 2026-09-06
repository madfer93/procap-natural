"use client";

import React, { useState, useEffect } from "react";
import { 
  Package, 
  Truck, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Save, 
  Copy, 
  Printer, 
  X, 
  Send, 
  DollarSign, 
  CreditCard,
  FileText
} from "lucide-react";
import { OrderShipment, INITIAL_ORDERS, CARRIERS_LIST } from "@/lib/orders-store";
import { formatPriceCOP } from "@/lib/products-store";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderShipment[]>(INITIAL_ORDERS);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderShipment | null>(null);

  // Form edit fields
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [shippingStatus, setShippingStatus] = useState<OrderShipment['shipping_status']>("pendiente");
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573151189795";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.orders && data.orders.length > 0) {
        setOrders(data.orders);
        if (!selectedOrder) {
          selectOrderForEdit(data.orders[0]);
        }
      }
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectOrderForEdit = (order: OrderShipment) => {
    setSelectedOrder(order);
    setCarrier(order.carrier || "Interrapidísimo");
    setTrackingNumber(order.tracking_number || "");
    setTrackingUrl(order.tracking_url || "");
    setShippingStatus(order.shipping_status || "pendiente");
    setShippingCost(order.shipping_cost || 0);
    setNotes(order.notes || "");
    setSaveSuccess(false);
  };

  const handleCarrierChange = (newCarrierName: string) => {
    setCarrier(newCarrierName);
    const foundCarrier = CARRIERS_LIST.find(c => c.name.toLowerCase() === newCarrierName.toLowerCase());
    if (foundCarrier && foundCarrier.trackingUrlPrefix && trackingNumber) {
      setTrackingUrl(`${foundCarrier.trackingUrlPrefix}${trackingNumber}`);
    }
  };

  const handleTrackingNumberChange = (newNumber: string) => {
    setTrackingNumber(newNumber);
    const foundCarrier = CARRIERS_LIST.find(c => c.name.toLowerCase() === carrier.toLowerCase());
    if (foundCarrier && foundCarrier.trackingUrlPrefix && newNumber) {
      setTrackingUrl(`${foundCarrier.trackingUrlPrefix}${newNumber}`);
    }
  };

  const handleSaveShipment = async () => {
    if (!selectedOrder) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedOrder.id,
          carrier,
          tracking_number: trackingNumber,
          tracking_url: trackingUrl,
          shipping_status: shippingStatus,
          shipping_cost: shippingCost,
          notes
        }),
      });

      if (res.ok) {
        const updated = {
          ...selectedOrder,
          carrier,
          tracking_number: trackingNumber,
          tracking_url: trackingUrl,
          shipping_status: shippingStatus,
          shipping_cost: shippingCost,
          notes
        };
        setSelectedOrder(updated);
        setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error al actualizar envío:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: OrderShipment['shipping_status']) => {
    switch (status) {
      case "pendiente":
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold">📋 Pendiente</span>;
      case "preparando":
        return <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-400/20 text-[11px] font-bold">📦 Preparando</span>;
      case "despachado":
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-400/20 text-[11px] font-bold">🚚 Despachado</span>;
      case "en_transito":
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-400/20 text-[11px] font-bold">🛣️ En Tránsito</span>;
      case "entregado":
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">✅ Entregado</span>;
      case "devuelto":
        return <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[11px] font-bold">🔄 Devuelto</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px]">{status}</span>;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "todos" || order.shipping_status === filterStatus;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      order.customer_name?.toLowerCase().includes(query) ||
      order.customer_phone?.includes(query) ||
      order.id?.toLowerCase().includes(query) ||
      order.tracking_number?.toLowerCase().includes(query) ||
      order.shipping_city?.toLowerCase().includes(query) ||
      order.product_name?.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const generateWhatsAppMessage = () => {
    if (!selectedOrder) return "";
    return encodeURIComponent(
      `¡Hola ${selectedOrder.customer_name}! 👋 Te saludamos de *Procap Natural*.\n\n` +
      `📦 Tu pedido de *${selectedOrder.product_name}* (Ref: ${selectedOrder.id}) ha sido preparado y despachado con éxito.\n\n` +
      `🚚 *Transportadora:* ${carrier || "Transportadora Nacional"}\n` +
      `📌 *Número de Guía:* ${trackingNumber || "Por asignar"}\n` +
      (trackingUrl ? `🔗 *Rastreo en línea:* ${trackingUrl}\n` : "") +
      `📍 *Destino:* ${selectedOrder.shipping_address}, ${selectedOrder.shipping_city}\n\n` +
      `Cualquier duda quedamos atentos a este chat. ¡Gracias por confiar en Procap Natural!`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
              Gestor de Envíos & Transportadora
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
              {orders.length} pedidos
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Control de despachos, asignación de guías (Servientrega, Interrapidísimo, Coordinadora) y notificaciones automáticas al cliente.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-[11px] font-bold uppercase text-slate-500">Pendientes</span>
          <p className="text-2xl font-black text-amber-400 mt-1">
            {orders.filter(o => o.shipping_status === "pendiente").length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-[11px] font-bold uppercase text-slate-500">En Preparación</span>
          <p className="text-2xl font-black text-sky-400 mt-1">
            {orders.filter(o => o.shipping_status === "preparando").length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-[11px] font-bold uppercase text-slate-500">En Tránsito / Despachados</span>
          <p className="text-2xl font-black text-purple-400 mt-1">
            {orders.filter(o => o.shipping_status === "en_transito" || o.shipping_status === "despachado").length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-[11px] font-bold uppercase text-slate-500">Entregados</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {orders.filter(o => o.shipping_status === "entregado").length}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por cliente, cédula, guía, ciudad o pedido..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "todos", label: "Todos" },
            { id: "pendiente", label: "Pendiente" },
            { id: "preparando", label: "Preparando" },
            { id: "en_transito", label: "En Tránsito" },
            { id: "entregado", label: "Entregado" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === tab.id
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Grid: Order List on Left, Dispatch Editor on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Orders List */}
        <div className="lg:col-span-6 space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <Truck size={32} className="mx-auto text-slate-600" />
              <h3 className="text-sm font-bold text-white">No se encontraron pedidos</h3>
              <p className="text-xs text-slate-400">Prueba cambiando el filtro de búsqueda.</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isSelected = selectedOrder?.id === order.id;

              return (
                <div
                  key={order.id}
                  onClick={() => selectOrderForEdit(order)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-slate-900 border-amber-400/80 shadow-lg shadow-amber-500/10"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400">{order.id}</span>
                        <span className="text-xs font-bold text-white">{order.customer_name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin size={11} className="text-sky-400" /> {order.shipping_city} {order.shipping_department ? `• ${order.shipping_department}` : ""}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      {getStatusBadge(order.shipping_status)}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs text-slate-300">
                    <span className="truncate max-w-[200px] font-medium text-slate-200">
                      📦 {order.product_name}
                    </span>
                    <span className="font-bold text-emerald-400 font-heading">
                      {formatPriceCOP(order.amount_cop)}
                    </span>
                  </div>

                  {order.tracking_number && (
                    <div className="mt-2 pt-2 border-t border-slate-900/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>🚚 {order.carrier || "Transportadora"}: <strong className="text-white font-mono">{order.tracking_number}</strong></span>
                      <span className="text-sky-400 text-[10px]">Editar →</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Dispatch Editor Panel (Zero Modals) */}
        {selectedOrder && (
          <div className="lg:col-span-6 rounded-2xl bg-slate-950 border border-amber-500/40 p-5 shadow-2xl space-y-5 sticky top-6">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Truck size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Despacho & Guía de Envío</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Pedido #{selectedOrder.id}</span>
                </div>
              </div>

              {getStatusBadge(shippingStatus)}
            </div>

            {/* Client Info Summary Card */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Destinatario:</span>
                <span className="font-bold text-white">{selectedOrder.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Teléfono / WhatsApp:</span>
                <span className="font-mono text-emerald-400 font-bold">{selectedOrder.customer_phone}</span>
              </div>
              {selectedOrder.customer_document && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Cédula / NIT:</span>
                  <span className="font-mono text-slate-200">{selectedOrder.customer_document}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Dirección de Envío:</span>
                <span className="font-bold text-white text-right max-w-[240px] truncate">{selectedOrder.shipping_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ciudad / Destino:</span>
                <span className="font-bold text-sky-400">{selectedOrder.shipping_city}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800/80">
                <span className="text-slate-500">Producto Comprado:</span>
                <span className="font-bold text-amber-300">{selectedOrder.product_name}</span>
              </div>
            </div>

            {/* Dispatch Edit Form */}
            <div className="space-y-4">
              
              {/* Transportadora y Guía */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Transportadora</label>
                  <select
                    value={carrier}
                    onChange={(e) => handleCarrierChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {CARRIERS_LIST.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Número de Guía (Tracking)</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => handleTrackingNumberChange(e.target.value)}
                    placeholder="Ej. 70008942155"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* URL de Rastreo */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Enlace Directo de Rastreo</span>
                  {trackingUrl && (
                    <a href={trackingUrl} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline flex items-center gap-0.5 text-[10px]">
                      <span>Probar link</span>
                      <ExternalLink size={10} />
                    </a>
                  )}
                </label>
                <input
                  type="url"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://www.interrapidisimo.com/..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Estado del Envío y Costo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Estado del Envío</label>
                  <select
                    value={shippingStatus}
                    onChange={(e) => setShippingStatus(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="pendiente">📋 Pendiente de despacho</option>
                    <option value="preparando">📦 Preparando / Empacando</option>
                    <option value="despachado">🚚 Despachado en transportadora</option>
                    <option value="en_transito">🛣️ En Tránsito a destino</option>
                    <option value="entregado">✅ Entregado al cliente</option>
                    <option value="devuelto">🔄 Novedad / Devuelto</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Costo de Envío (COP)</label>
                  <input
                    type="number"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(Number(e.target.value))}
                    placeholder="0"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Notas de Despacho */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Observaciones / Notas Internas</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observaciones de empaque, número de flete o requerimientos especiales..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleSaveShipment}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-105 disabled:opacity-50"
              >
                <Save size={14} />
                <span>{isSaving ? "Guardando..." : "Guardar Envío"}</span>
              </button>

              {saveSuccess && (
                <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 size={14} /> ¡Guardado con éxito!
                </span>
              )}

              {/* Botón de Enviar Guía por WhatsApp */}
              <a
                href={`https://wa.me/${selectedOrder.customer_phone.replace(/\D/g, "")}?text=${generateWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
              >
                <i className="fa-brands fa-whatsapp text-sm"></i>
                <span>Enviar Guía por WhatsApp</span>
              </a>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
