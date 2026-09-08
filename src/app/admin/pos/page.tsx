"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Trash2,
  Lock,
  Unlock,
  Building2,
  UserCheck,
  CreditCard,
  Banknote,
  Smartphone,
  QrCode,
  Receipt,
  Printer,
  CheckCircle2,
  X,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  LogOut,
  Sparkles,
  Percent,
  Check,
  Share2
} from "lucide-react";
import { Product, formatPriceCOP } from "@/lib/products-store";
import { StaffSeller, PosCashShift, PosSale, SEDE_LABELS } from "@/lib/staff-store";
import { AdminNav } from "@/components/admin/AdminNav";

export default function PosTerminalPage() {
  // Estado de Autenticación de la Terminal POS
  const [authenticatedSeller, setAuthenticatedSeller] = useState<StaffSeller | null>(null);
  const [selectedSede, setSelectedSede] = useState<string>("bogota");
  const [enteredPin, setEnteredPin] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);

  // Catálogo de Productos
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");

  // Carrito de Compras POS
  interface CartItem {
    product: Product;
    quantity: number;
  }
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCedula, setCustomerCedula] = useState("");

  // Turno de Caja (Shift)
  const [currentShift, setCurrentShift] = useState<PosCashShift | null>(null);
  const [isOpeningShiftOpen, setIsOpeningShiftOpen] = useState(false);
  const [openingBaseAmount, setOpeningBaseAmount] = useState<number>(100000); // Base sugerida $100.000
  const [isClosingShiftOpen, setIsClosingShiftOpen] = useState(false);
  const [closingActualCash, setClosingActualCash] = useState<number>(0);

  // Proceso de Pago
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'datafono' | 'nequi_daviplata' | 'wompi_qr' | 'sistecredito' | 'addi'>('efectivo');
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [voucherRef, setVoucherRef] = useState("");
  const [processingSale, setProcessingSale] = useState(false);

  // Recibo / Ticket final
  const [completedSale, setCompletedSale] = useState<PosSale | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Notificación
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  useEffect(() => {
    if (authenticatedSeller) {
      fetchShiftStatus();
    }
  }, [authenticatedSeller, selectedSede]);

  const fetchCatalog = async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Error cargando productos:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchShiftStatus = async () => {
    try {
      const res = await fetch(`/api/pos/shifts?sede=${selectedSede}&seller_id=${authenticatedSeller?.id}&status=open`);
      const data = await res.json();
      if (data.currentShift) {
        setCurrentShift(data.currentShift);
      } else {
        setCurrentShift(null);
      }
    } catch (err) {
      console.error("Error verificando turno:", err);
    }
  };

  // Teclado PIN
  const handlePinKeyPress = (digit: string) => {
    if (enteredPin.length < 6) {
      setEnteredPin((prev) => prev + digit);
    }
  };

  const handlePinClear = () => {
    setEnteredPin("");
    setPinError("");
  };

  const handlePinSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!enteredPin) return;

    try {
      setIsVerifyingPin(true);
      setPinError("");
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_pin",
          pin: enteredPin,
          sede_id: selectedSede,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.seller) {
        setPinError(data.error || "PIN incorrecto o no autorizado para esta sede");
        setEnteredPin("");
        return;
      }

      setAuthenticatedSeller(data.seller);
      if (data.seller.sede_id !== "all") {
        setSelectedSede(data.seller.sede_id);
      }
      setEnteredPin("");
      showToast(`¡Bienvenido, ${data.seller.name}!`);
    } catch (err: any) {
      setPinError("Error de conexión al validar PIN");
    } finally {
      setIsVerifyingPin(false);
    }
  };

  // Gestión de Carrito
  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscountPercent(0);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerCedula("");
  };

  // Cálculos de Totales
  const subtotalCOP = cart.reduce((acc, item) => acc + item.product.price_offer * item.quantity, 0);
  const discountAmountCOP = Math.round((subtotalCOP * discountPercent) / 100);
  const totalCOP = Math.max(0, subtotalCOP - discountAmountCOP);
  const changeCOP = cashReceived >= totalCOP ? cashReceived - totalCOP : 0;

  // Apertura de Turno
  const handleOpenShift = async () => {
    if (!authenticatedSeller) return;
    try {
      const res = await fetch("/api/pos/shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "open_shift",
          sede_id: selectedSede,
          seller_id: authenticatedSeller.id,
          seller_name: authenticatedSeller.name,
          opening_cash_cop: openingBaseAmount,
        }),
      });
      const data = await res.json();
      if (data.success && data.shift) {
        setCurrentShift(data.shift);
        setIsOpeningShiftOpen(false);
        showToast("Turno y base de caja abiertos exitosamente");
      }
    } catch (err) {
      alert("Error al abrir turno");
    }
  };

  // Cierre de Turno / Arqueo
  const handleCloseShift = async () => {
    if (!currentShift) return;
    try {
      const res = await fetch("/api/pos/shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "close_shift",
          shift_id: currentShift.id,
          actual_cash_cop: closingActualCash,
          expected_cash_cop: (currentShift.opening_cash_cop || 0) + (currentShift.total_sales_cop || 0),
          total_sales_cop: currentShift.total_sales_cop || 0,
          sales_count: currentShift.sales_count || 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentShift(null);
        setIsClosingShiftOpen(false);
        showToast("Turno de caja cerrado y arqueado correctamente");
      }
    } catch (err) {
      alert("Error al cerrar turno");
    }
  };

  // Procesar Cobro
  const handleProcessPayment = async () => {
    if (cart.length === 0 || !authenticatedSeller) return;

    try {
      setProcessingSale(true);
      const itemsPayload = cart.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        category: item.product.category,
        unit_price_cop: item.product.price_offer,
        cost_price_cop: item.product.cost_price_cop || 0,
        quantity: item.quantity,
        subtotal_cop: item.product.price_offer * item.quantity,
      }));

      const payload = {
        sede_id: selectedSede,
        seller_id: authenticatedSeller.id,
        seller_name: authenticatedSeller.name,
        customer_name: customerName.trim() || "Cliente Mostrador",
        customer_phone: customerPhone.trim(),
        customer_cedula: customerCedula.trim(),
        items: itemsPayload,
        subtotal_cop: subtotalCOP,
        discount_cop: discountAmountCOP,
        total_cop: totalCOP,
        payment_method: paymentMethod,
        payment_details: {
          cash_received: paymentMethod === "efectivo" ? cashReceived : totalCOP,
          cash_change: paymentMethod === "efectivo" ? changeCOP : 0,
          voucher_reference: voucherRef,
        },
      };

      const res = await fetch("/api/pos/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error procesando venta");
      }

      setCompletedSale(data.sale);
      setIsPaymentOpen(false);
      setIsReceiptOpen(true);
      clearCart();
      fetchCatalog(); // Actualizar stock
      fetchShiftStatus();
      showToast("¡Venta completada con éxito!");
    } catch (err: any) {
      alert("Error en venta: " + err.message);
    } finally {
      setProcessingSale(false);
    }
  };

  // Filtrado de productos
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === "todos" || p.category === selectedCategory;
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery && p.is_available !== false;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans select-none">
      <AdminNav />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Toast Notificación */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-slate-950 px-5 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* 1. PANTALLA DE BLOQUEO / TECLADO PIN (Si no está logueado) */}
        {/* ============================================================ */}
        {!authenticatedSeller ? (
          <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="w-full max-w-md bg-slate-900/90 border border-amber-500/30 rounded-3xl p-8 shadow-2xl shadow-amber-500/10 backdrop-blur-xl">
              <div className="text-center space-y-2 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
                  <Lock size={32} />
                </div>
                <h2 className="text-2xl font-heading font-black text-white">Terminal POS Cabinas</h2>
                <p className="text-xs text-slate-400">
                  Selecciona la sede e ingresa tu PIN de 4 dígitos para desbloquear la caja
                </p>
              </div>

              {/* Selector de Sede */}
              <div className="space-y-1.5 mb-5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Sede de Operación
                </label>
                <select
                  value={selectedSede}
                  onChange={(e) => setSelectedSede(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400 font-semibold"
                >
                  <option value="bogota">🏢 Sede Bogotá (Chicó Norte)</option>
                  <option value="cali">🌴 Sede Cali (Granada)</option>
                  <option value="neiva">☀️ Sede Neiva (Ipanema)</option>
                  <option value="barranquilla">🌊 Sede Barranquilla (El Prado)</option>
                </select>
              </div>

              {/* Visor de PIN */}
              <div className="mb-6">
                <div className="flex items-center justify-center gap-3 py-4 px-6 bg-slate-950 border border-amber-500/40 rounded-2xl">
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className={`w-5 h-5 rounded-full border-2 transition-all ${
                        enteredPin.length > idx
                          ? "bg-amber-400 border-amber-400 scale-110 shadow-lg shadow-amber-500/50"
                          : "border-slate-700 bg-slate-900"
                      }`}
                    />
                  ))}
                </div>
                {pinError && (
                  <p className="text-center text-red-400 text-xs font-semibold mt-2 animate-shake">
                    {pinError}
                  </p>
                )}
              </div>

              {/* Teclado Numérico Táctil */}
              <div className="grid grid-cols-3 gap-3">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handlePinKeyPress(num)}
                    className="py-3.5 rounded-2xl bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 active:scale-95 text-white font-heading font-black text-xl border border-slate-700/60 transition-all shadow-md cursor-pointer"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handlePinClear}
                  className="py-3.5 rounded-2xl bg-red-950/40 hover:bg-red-900/60 active:scale-95 text-red-400 font-bold text-sm border border-red-800/40 transition-all cursor-pointer"
                >
                  BORRAR
                </button>
                <button
                  type="button"
                  onClick={() => handlePinKeyPress("0")}
                  className="py-3.5 rounded-2xl bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 active:scale-95 text-white font-heading font-black text-xl border border-slate-700/60 transition-all shadow-md cursor-pointer"
                >
                  0
                </button>
                <button
                  type="button"
                  disabled={isVerifyingPin || enteredPin.length < 4}
                  onClick={() => handlePinSubmit()}
                  className="py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  {isVerifyingPin ? <RefreshCw className="animate-spin" size={16} /> : "ENTRAR"}
                </button>
              </div>

              <div className="mt-6 text-center text-[11px] text-slate-500">
                ¿Olvidaste tu PIN? Contacta a Manuel o al Administrador Master.
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* 2. INTERFAZ OPERATIVA DE LA TERMINAL POS (Logueado) */
          /* ============================================================ */
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Top Bar de Estado del POS */}
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                  <UserCheck size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-black text-white text-sm">
                      {authenticatedSeller.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                      {authenticatedSeller.role}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Building2 size={12} className="text-amber-400" />
                    {SEDE_LABELS[selectedSede]}
                  </span>
                </div>
              </div>

              {/* Controles de Turno y Salida */}
              <div className="flex items-center gap-2.5">
                {currentShift ? (
                  <button
                    onClick={() => {
                      setClosingActualCash((currentShift.opening_cash_cop || 0) + (currentShift.total_sales_cop || 0));
                      setIsClosingShiftOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Clock size={14} />
                    <span>Turno Abierto (Cerrar / Arqueo)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsOpeningShiftOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Sparkles size={14} />
                    <span>Abrir Turno / Base de Caja</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setAuthenticatedSeller(null);
                    clearCart();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 text-xs font-semibold transition-colors cursor-pointer"
                  title="Bloquear Terminal"
                >
                  <Lock size={14} />
                  <span>Bloquear</span>
                </button>
              </div>
            </div>

            {/* Layout Dividido: Catálogo a la izquierda, Carrito de Cobro a la derecha */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
              
              {/* COLUMNA IZQUIERDA: Catálogo de Productos (8 columnas en desktop) */}
              <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full border-r border-slate-800/80 bg-slate-950 overflow-hidden">
                {/* Barra de Búsqueda & Categorías */}
                <div className="p-4 bg-slate-900/50 border-b border-slate-800 space-y-3 shrink-0">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Buscar prótesis, adhesivo, cinta, servicio..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Pills de Categorías */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {["todos", "sistemas", "adhesivos", "cintas", "cuidados", "servicios"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                            : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid de Productos Táctiles */}
                <div className="flex-1 p-4 overflow-y-auto">
                  {loadingProducts ? (
                    <div className="h-full flex items-center justify-center text-slate-500">
                      <RefreshCw className="animate-spin mr-2" size={20} />
                      Cargando catálogo...
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500">
                      <ShoppingBag size={40} className="text-slate-700 mb-2" />
                      <p className="text-sm font-semibold">No se encontraron productos</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
                      {filteredProducts.map((product) => {
                        const inCart = cart.find((i) => i.product.id === product.id);
                        const stock = product.stock_quantity ?? 10;
                        const isOutOfStock = stock <= 0;

                        return (
                          <button
                            key={product.id}
                            disabled={isOutOfStock}
                            onClick={() => addToCart(product)}
                            className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between relative group cursor-pointer active:scale-95 ${
                              inCart
                                ? "bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/10"
                                : "bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                            } ${isOutOfStock ? "opacity-40 cursor-not-allowed" : ""}`}
                          >
                            {inCart && (
                              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                                {inCart.quantity}
                              </span>
                            )}

                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                {product.category}
                              </span>
                              <h4 className="font-bold text-white text-xs sm:text-sm line-clamp-2 leading-tight">
                                {product.name}
                              </h4>
                            </div>

                            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                              <span className="font-heading font-black text-amber-400 text-xs sm:text-sm">
                                {formatPriceCOP(product.price_offer)}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  stock <= 2
                                    ? "bg-red-500/10 text-red-400"
                                    : "bg-slate-800 text-slate-400"
                                }`}
                              >
                                {stock} disp.
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* COLUMNA DERECHA: Carrito & Cobro (5 columnas en desktop) */}
              <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-full bg-slate-900/90 border-l border-slate-800">
                
                {/* Header del Carrito */}
                <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={18} className="text-amber-400" />
                    <h3 className="font-heading font-bold text-white text-sm">
                      Orden Actual ({cart.reduce((a, b) => a + b.quantity, 0)} ítems)
                    </h3>
                  </div>
                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-xs text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                    >
                      Vaciar
                    </button>
                  )}
                </div>

                {/* Lista de Ítems en Carrito */}
                <div className="flex-1 p-4 overflow-y-auto space-y-2.5">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-6">
                      <ShoppingBag size={48} className="text-slate-800 mb-3" />
                      <p className="font-bold text-slate-400 text-sm">El carrito está vacío</p>
                      <p className="text-xs text-slate-600 mt-1">
                        Toca los productos del catálogo a la izquierda para agregarlos a la venta.
                      </p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-white text-xs truncate">{item.product.name}</h5>
                          <span className="text-[11px] text-amber-400 font-semibold">
                            {formatPriceCOP(item.product.price_offer)} c/u
                          </span>
                        </div>

                        {/* Modificadores de Cantidad */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center cursor-pointer"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-bold text-white text-xs w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-600 hover:text-red-400 p-1 cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Datos del Cliente y Descuento */}
                <div className="p-4 bg-slate-950/60 border-t border-slate-800 space-y-3 shrink-0">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nombre Cliente (Opcional)"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="text"
                      placeholder="Teléfono / WhatsApp"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Selector de Descuento Rápido */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Descuento:</span>
                    <div className="flex items-center gap-1.5">
                      {[0, 5, 10, 15].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setDiscountPercent(pct)}
                          className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                            discountPercent === pct
                              ? "bg-amber-500 text-slate-950"
                              : "bg-slate-900 text-slate-400 hover:text-white"
                          }`}
                        >
                          {pct === 0 ? "0%" : `${pct}%`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resumen de Totales */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal:</span>
                      <span>{formatPriceCOP(subtotalCOP)}</span>
                    </div>
                    {discountAmountCOP > 0 && (
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>Descuento ({discountPercent}%):</span>
                        <span>-{formatPriceCOP(discountAmountCOP)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-heading font-black text-white pt-1">
                      <span>TOTAL A COBRAR:</span>
                      <span className="text-amber-400">{formatPriceCOP(totalCOP)}</span>
                    </div>
                  </div>

                  {/* Botón Principal de Cobro */}
                  <button
                    disabled={cart.length === 0}
                    onClick={() => {
                      setCashReceived(totalCOP);
                      setIsPaymentOpen(true);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 font-heading font-black text-base shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>COBRAR {formatPriceCOP(totalCOP)}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL 1: PROCESO DE PAGO MULTI-MÉTODO */}
        {/* ============================================================ */}
        {isPaymentOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-xl font-heading font-black text-white">Seleccionar Medio de Pago</h3>
                  <span className="text-xs text-slate-400">
                    Total a liquidar: <strong className="text-amber-400">{formatPriceCOP(totalCOP)}</strong>
                  </span>
                </div>
                <button
                  onClick={() => setIsPaymentOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Selector de Medios de Pago */}
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5">
                {[
                  { id: "efectivo", label: "Efectivo", icon: Banknote, color: "text-emerald-400" },
                  { id: "datafono", label: "Datáfono / Tarjeta", icon: CreditCard, color: "text-sky-400" },
                  { id: "nequi_daviplata", label: "Nequi / Daviplata", icon: Smartphone, color: "text-purple-400" },
                  { id: "wompi_qr", label: "Wompi QR", icon: QrCode, color: "text-amber-400" },
                  { id: "sistecredito", label: "Sistecrédito", icon: Sparkles, color: "text-rose-400" },
                  { id: "addi", label: "Addi Cuotas", icon: CreditCard, color: "text-indigo-400" },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                        paymentMethod === m.id
                          ? "bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-lg"
                          : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <Icon size={20} className={paymentMethod === m.id ? "text-slate-950" : m.color} />
                      <span className="text-xs font-semibold">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Detalle según método de pago */}
              {paymentMethod === "efectivo" ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-slate-300">
                      Dinero Recibido (COP)
                    </label>
                    <div className="flex gap-1.5">
                      {[50000, 100000, 200000].map((quick) => (
                        <button
                          key={quick}
                          type="button"
                          onClick={() => setCashReceived(quick)}
                          className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-amber-400 hover:bg-slate-700"
                        >
                          ${quick / 1000}k
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="number"
                    value={cashReceived || ""}
                    onChange={(e) => setCashReceived(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-amber-500/50 text-xl font-heading font-black text-amber-400 focus:outline-none font-mono"
                  />
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-xs font-bold text-slate-400 uppercase">Cambio / Devuelta:</span>
                    <span className="text-lg font-heading font-black text-emerald-400">
                      {formatPriceCOP(changeCOP)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-300 block">
                    Referencia de Transacción / Voucher / Aprobación
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Aprobación #123456"
                    value={voucherRef}
                    onChange={(e) => setVoucherRef(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              )}

              {/* Botón de Confirmación */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentOpen(false)}
                  className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={processingSale || (paymentMethod === "efectivo" && cashReceived < totalCOP)}
                  onClick={handleProcessPayment}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-40 text-slate-950 font-heading font-black text-sm shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center gap-2"
                >
                  {processingSale ? <RefreshCw className="animate-spin" size={16} /> : <Check size={16} />}
                  <span>FINALIZAR VENTA</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL 2: TICKET / RECIBO DIGITAL */}
        {/* ============================================================ */}
        {isReceiptOpen && completedSale && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white text-slate-950 rounded-3xl p-6 shadow-2xl space-y-4 font-mono text-xs">
              {/* Header Ticket */}
              <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-400">
                <h2 className="font-heading font-black text-base text-slate-900">PROCAP NATURAL</h2>
                <p className="text-[10px] text-slate-600">Sistemas Capilares & Estilismo Profesional</p>
                <p className="text-[10px] font-bold text-slate-700">{SEDE_LABELS[completedSale.sede_id]}</p>
                <p className="text-[10px] text-slate-500">Orden: {completedSale.order_number}</p>
                <p className="text-[10px] text-slate-500">
                  Fecha: {new Date(completedSale.created_at).toLocaleString("es-CO")}
                </p>
                <p className="text-[10px] text-slate-500">Atendido por: {completedSale.seller_name}</p>
              </div>

              {/* Items Comprados */}
              <div className="space-y-2 py-2 border-b border-dashed border-slate-400">
                {completedSale.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div>
                      <span className="font-bold">{item.quantity}x {item.product_name}</span>
                    </div>
                    <span className="font-bold">{formatPriceCOP(item.subtotal_cop)}</span>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="space-y-1 py-1 border-b border-dashed border-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPriceCOP(completedSale.subtotal_cop)}</span>
                </div>
                {completedSale.discount_cop > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Descuento:</span>
                    <span>-{formatPriceCOP(completedSale.discount_cop)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-sm pt-1">
                  <span>TOTAL PAGADO:</span>
                  <span>{formatPriceCOP(completedSale.total_cop)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-600">
                  <span>Medio de Pago:</span>
                  <span className="uppercase font-bold">{completedSale.payment_method}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-[10px] text-slate-500 pt-2 space-y-1">
                <p>¡Gracias por confiar en Procap Natural!</p>
                <p>Garantía de fijación y servicio profesional.</p>
                <p className="font-bold text-slate-700">WhatsApp: +57 324 374 8704</p>
              </div>

              {/* Botones */}
              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  onClick={() => window.print()}
                  className="py-2.5 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer size={14} /> Imprimir
                </button>
                <button
                  onClick={() => setIsReceiptOpen(false)}
                  className="py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Nueva Venta
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL 3: APERTURA DE BASE DE CAJA */}
        {/* ============================================================ */}
        {isOpeningShiftOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-heading font-bold text-lg text-white">Apertura de Base de Caja</h3>
                <button onClick={() => setIsOpeningShiftOpen(false)} className="text-slate-400">
                  <X size={18} />
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Ingresa el monto de dinero en efectivo que queda como base inicial en el cajón para dar vueltos.
              </p>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-300">Base en Efectivo (COP)</label>
                <input
                  type="number"
                  value={openingBaseAmount || ""}
                  onChange={(e) => setOpeningBaseAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-emerald-500 text-xl font-heading font-black text-emerald-400 font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsOpeningShiftOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleOpenShift}
                  className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black cursor-pointer"
                >
                  Abrir Turno
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL 4: CIERRE DE TURNO / ARQUEO */}
        {/* ============================================================ */}
        {isClosingShiftOpen && currentShift && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-heading font-bold text-lg text-white">Cierre de Caja & Arqueo</h3>
                <button onClick={() => setIsClosingShiftOpen(false)} className="text-slate-400">
                  <X size={18} />
                </button>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 space-y-1 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Base Inicial:</span>
                  <span className="font-mono">{formatPriceCOP(currentShift.opening_cash_cop)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Ventas Turno:</span>
                  <span className="font-mono text-emerald-400">+{formatPriceCOP(currentShift.total_sales_cop || 0)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-slate-800 pt-1 text-white">
                  <span>Efectivo Esperado en Cajón:</span>
                  <span className="font-mono text-amber-400">
                    {formatPriceCOP((currentShift.opening_cash_cop || 0) + (currentShift.total_sales_cop || 0))}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-300">
                  Efectivo Real Contado en Cajón (COP)
                </label>
                <input
                  type="number"
                  value={closingActualCash || ""}
                  onChange={(e) => setClosingActualCash(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-amber-500 text-xl font-heading font-black text-amber-400 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsClosingShiftOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCloseShift}
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black cursor-pointer"
                >
                  Confirmar Cierre de Caja
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
