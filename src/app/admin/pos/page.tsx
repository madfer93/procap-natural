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
  Share2,
  Wifi,
  WifiOff,
  CloudUpload,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { Product, INITIAL_PRODUCTS, formatPriceCOP } from "@/lib/products-store";
import { StaffSeller, INITIAL_STAFF, PosCashShift, PosSale, SEDE_LABELS } from "@/lib/staff-store";

export default function PosTerminalPage() {
  // Detector de Conectividad a Internet (Online / Offline)
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineSalesQueue, setOfflineSalesQueue] = useState<PosSale[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

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
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

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

  // Notificación Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "warning" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "warning" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Inicialización & Detección de Red Offline / Online
  useEffect(() => {
    // Establecer estado inicial de red
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      
      // Cargar cola de ventas pendientes desde localStorage
      const cachedQueue = localStorage.getItem("procap_pos_offline_sales");
      if (cachedQueue) {
        try {
          const parsed = JSON.parse(cachedQueue);
          setOfflineSalesQueue(parsed);
        } catch (e) {}
      }

      const handleOnline = () => {
        setIsOnline(true);
        showToast("🟢 Conexión a Internet restablecida. Sincronizando...", "success");
        syncOfflineSales();
      };

      const handleOffline = () => {
        setIsOnline(false);
        showToast("⚠️ Modo Sin Internet activado. Las ventas se guardarán localmente.", "warning");
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  // 2. Cargar Catálogo (Online o Cache Local)
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
      if (data.products && data.products.length > 0) {
        setProducts(data.products);
        // Guardar copia local para emergencias sin internet
        localStorage.setItem("procap_pos_products_cache", JSON.stringify(data.products));
      } else {
        loadOfflineProductsFallback();
      }
    } catch (err) {
      console.warn("No hay conexión con el servidor. Cargando catálogo local offline...");
      loadOfflineProductsFallback();
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadOfflineProductsFallback = () => {
    const cached = localStorage.getItem("procap_pos_products_cache");
    if (cached) {
      try {
        setProducts(JSON.parse(cached));
        return;
      } catch (e) {}
    }
    setProducts(INITIAL_PRODUCTS);
  };

  const fetchShiftStatus = async () => {
    try {
      const res = await fetch(`/api/pos/shifts?sede=${selectedSede}&seller_id=${authenticatedSeller?.id}&status=open`);
      const data = await res.json();
      if (data.currentShift) {
        setCurrentShift(data.currentShift);
        localStorage.setItem("procap_pos_current_shift", JSON.stringify(data.currentShift));
      } else {
        setCurrentShift(null);
      }
    } catch (err) {
      const cached = localStorage.getItem("procap_pos_current_shift");
      if (cached) {
        try {
          setCurrentShift(JSON.parse(cached));
        } catch (e) {}
      }
    }
  };

  // 3. Sincronización Automática de Ventas Offline hacia Supabase
  const syncOfflineSales = async () => {
    const cachedQueue = localStorage.getItem("procap_pos_offline_sales");
    if (!cachedQueue) return;

    let queue: PosSale[] = [];
    try {
      queue = JSON.parse(cachedQueue);
    } catch (e) {
      return;
    }

    if (queue.length === 0) return;

    setIsSyncing(true);
    let syncedCount = 0;
    const remainingQueue: PosSale[] = [];

    for (const sale of queue) {
      try {
        const res = await fetch("/api/pos/sales", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sale),
        });
        if (res.ok) {
          syncedCount++;
        } else {
          remainingQueue.push(sale);
        }
      } catch (err) {
        remainingQueue.push(sale);
      }
    }

    localStorage.setItem("procap_pos_offline_sales", JSON.stringify(remainingQueue));
    setOfflineSalesQueue(remainingQueue);
    setIsSyncing(false);

    if (syncedCount > 0) {
      showToast(`✅ ${syncedCount} venta(s) sin internet sincronizada(s) con éxito en la nube.`, "success");
      fetchCatalog();
    }
  };

  // 4. Teclado PIN y Autenticación (Funciona Online y Offline)
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

      // Intento Online
      let sellerData: StaffSeller | null = null;
      try {
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
        if (res.ok && data.success && data.seller) {
          sellerData = data.seller;
        }
      } catch (netErr) {
        console.warn("Fallo de red al autenticar PIN, usando fallback offline local.");
      }

      // Fallback Offline con lista de empleados
      if (!sellerData) {
        const matchOffline = INITIAL_STAFF.find((s) => s.pin === enteredPin && s.is_active);
        if (matchOffline) {
          const { pin: _, ...safe } = matchOffline;
          sellerData = safe as StaffSeller;
        }
      }

      if (!sellerData) {
        setPinError("PIN incorrecto o usuario no autorizado");
        setEnteredPin("");
        return;
      }

      setAuthenticatedSeller(sellerData);
      if (sellerData.sede_id !== "all") {
        setSelectedSede(sellerData.sede_id);
      }
      setEnteredPin("");
      showToast(`¡Bienvenido, ${sellerData.name}! ${!navigator.onLine ? "(Modo Offline)" : ""}`);
    } catch (err: any) {
      setPinError("Error de validación de PIN");
    } finally {
      setIsVerifyingPin(false);
    }
  };

  // 5. Gestión del Carrito
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

  // Apertura de Turno (Online & Offline)
  const handleOpenShift = async () => {
    if (!authenticatedSeller) return;
    const shiftData: PosCashShift = {
      id: `shift-${Date.now()}`,
      sede_id: selectedSede,
      seller_id: authenticatedSeller.id,
      seller_name: authenticatedSeller.name,
      opened_at: new Date().toISOString(),
      closed_at: null,
      opening_cash_cop: openingBaseAmount,
      expected_cash_cop: openingBaseAmount,
      actual_cash_cop: 0,
      cash_difference_cop: 0,
      total_sales_cop: 0,
      sales_count: 0,
      notes: "Apertura de turno",
      status: "open",
    };

    try {
      const res = await fetch("/api/pos/shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "open_shift", ...shiftData }),
      });
      const data = await res.json();
      if (data.success && data.shift) {
        setCurrentShift(data.shift);
        localStorage.setItem("procap_pos_current_shift", JSON.stringify(data.shift));
      } else {
        setCurrentShift(shiftData);
      }
    } catch (err) {
      setCurrentShift(shiftData);
      localStorage.setItem("procap_pos_current_shift", JSON.stringify(shiftData));
    }
    setIsOpeningShiftOpen(false);
    showToast("Base de caja y turno abiertos con éxito");
  };

  // Cierre de Turno / Arqueo
  const handleCloseShift = async () => {
    if (!currentShift) return;
    try {
      await fetch("/api/pos/shifts", {
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
    } catch (err) {}
    localStorage.removeItem("procap_pos_current_shift");
    setCurrentShift(null);
    setIsClosingShiftOpen(false);
    showToast("Turno de caja cerrado y arqueado correctamente");
  };

  // 6. Procesar Venta (Con soporte Offline transparente)
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

      const totalCost = itemsPayload.reduce((acc, it) => acc + (it.cost_price_cop * it.quantity), 0);
      const orderNumber = `POS-${selectedSede.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;

      const saleRecord: PosSale = {
        id: `pos-${Date.now()}`,
        order_number: orderNumber,
        sede_id: selectedSede,
        seller_id: authenticatedSeller.id,
        seller_name: authenticatedSeller.name,
        customer_name: customerName.trim() || "Cliente Mostrador",
        customer_phone: customerPhone.trim(),
        customer_cedula: customerCedula.trim(),
        customer_email: "",
        items: itemsPayload as any,
        subtotal_cop: subtotalCOP,
        discount_cop: discountAmountCOP,
        total_cop: totalCOP,
        total_cost_cop: totalCost,
        gross_profit_cop: Math.max(0, totalCOP - totalCost),
        payment_method: paymentMethod,
        payment_details: {
          cash_received: paymentMethod === "efectivo" ? cashReceived : totalCOP,
          cash_change: paymentMethod === "efectivo" ? changeCOP : 0,
          voucher_reference: voucherRef,
        },
        notes: !navigator.onLine ? "Registrada en Modo Offline" : "",
        status: "completed",
        created_at: new Date().toISOString(),
      };

      let isSavedOnline = false;

      // Intentar enviar al servidor si hay conexión
      if (navigator.onLine) {
        try {
          const res = await fetch("/api/pos/sales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(saleRecord),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.sale) {
              setCompletedSale(data.sale);
              isSavedOnline = true;
            }
          }
        } catch (netErr) {
          console.warn("Fallo de red al enviar venta, procediendo con guardado offline.");
        }
      }

      // Si no se pudo guardar online, guardarla en la cola local
      if (!isSavedOnline) {
        const existingQueueStr = localStorage.getItem("procap_pos_offline_sales");
        const existingQueue: PosSale[] = existingQueueStr ? JSON.parse(existingQueueStr) : [];
        const updatedQueue = [...existingQueue, saleRecord];
        localStorage.setItem("procap_pos_offline_sales", JSON.stringify(updatedQueue));
        setOfflineSalesQueue(updatedQueue);
        setCompletedSale(saleRecord);

        // Descontar stock localmente en cache
        setProducts((prev) =>
          prev.map((p) => {
            const inCartItem = cart.find((c) => c.product.id === p.id);
            if (inCartItem && typeof p.stock_quantity === "number") {
              return { ...p, stock_quantity: Math.max(0, p.stock_quantity - inCartItem.quantity) };
            }
            return p;
          })
        );
        showToast("⚡ Venta completada en Modo Offline. Se sincronizará al volver el internet.", "warning");
      } else {
        showToast("¡Venta completada y registrada en la nube!", "success");
      }

      setIsPaymentOpen(false);
      setIsReceiptOpen(true);
      clearCart();
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
    <div className="flex flex-col h-[calc(100vh-4.5rem)] overflow-hidden font-sans select-none -m-4 sm:-m-8 lg:-m-10">
      
      {/* Toast Notificación */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-2 animate-fade-in text-xs sm:text-sm ${
            toastMessage.type === "success"
              ? "bg-emerald-500 text-slate-950"
              : toastMessage.type === "warning"
              ? "bg-amber-500 text-slate-950"
              : "bg-red-500 text-white"
          }`}
        >
          <CheckCircle2 size={16} />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. PANTALLA DE BLOQUEO / TECLADO PIN (Si no está logueado) */}
      {/* ============================================================ */}
      {!authenticatedSeller ? (
        <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="w-full max-w-sm sm:max-w-md bg-slate-900/95 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 backdrop-blur-xl">
            
            {/* Badge de Conectividad */}
            <div className="flex items-center justify-center mb-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${
                  isOnline
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                }`}
              >
                {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
                <span>{isOnline ? "En Línea (Cloud Sync)" : "Modo Offline (Sin Internet Activo)"}</span>
              </span>
            </div>

            <div className="text-center space-y-1.5 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
                <Lock size={28} />
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-black text-white">Terminal POS Cabinas</h2>
              <p className="text-[11px] text-slate-400">
                Selecciona la sede e ingresa tu PIN de 4 dígitos para desbloquear la caja
              </p>
            </div>

            {/* Selector de Sede */}
            <div className="space-y-1 mb-4">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Sede de Operación
              </label>
              <select
                value={selectedSede}
                onChange={(e) => setSelectedSede(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-semibold"
              >
                <option value="bogota">🏢 Sede Bogotá (Chicó Norte)</option>
                <option value="cali">🌴 Sede Cali (Granada)</option>
                <option value="neiva">☀️ Sede Neiva (Ipanema)</option>
                <option value="barranquilla">🌊 Sede Barranquilla (El Prado)</option>
              </select>
            </div>

            {/* Visor de PIN */}
            <div className="mb-5">
              <div className="flex items-center justify-center gap-3 py-3 px-6 bg-slate-950 border border-amber-500/40 rounded-2xl">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      enteredPin.length > idx
                        ? "bg-amber-400 border-amber-400 scale-110 shadow-md shadow-amber-500/50"
                        : "border-slate-700 bg-slate-900"
                    }`}
                  />
                ))}
              </div>
              {pinError && (
                <p className="text-center text-red-400 text-xs font-semibold mt-1.5 animate-shake">
                  {pinError}
                </p>
              )}
            </div>

            {/* Teclado Numérico Táctil */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handlePinKeyPress(num)}
                  className="py-3 rounded-2xl bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 active:scale-95 text-white font-heading font-black text-lg border border-slate-700/60 transition-all shadow-md cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handlePinClear}
                className="py-3 rounded-2xl bg-red-950/40 hover:bg-red-900/60 active:scale-95 text-red-400 font-bold text-xs border border-red-800/40 transition-all cursor-pointer"
              >
                BORRAR
              </button>
              <button
                type="button"
                onClick={() => handlePinKeyPress("0")}
                className="py-3 rounded-2xl bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 active:scale-95 text-white font-heading font-black text-lg border border-slate-700/60 transition-all shadow-md cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                disabled={isVerifyingPin || enteredPin.length < 4}
                onClick={() => handlePinSubmit()}
                className="py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                {isVerifyingPin ? <RefreshCw className="animate-spin" size={14} /> : "ENTRAR"}
              </button>
            </div>

            <div className="mt-4 text-center text-[10px] text-slate-500">
              PIN Master de prueba: <strong className="text-amber-400">2026</strong> | Bogotá: <strong className="text-amber-400">1111</strong>
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================ */
        /* 2. INTERFAZ OPERATIVA DE LA TERMINAL POS (Logueado) */
        /* ============================================================ */
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Top Bar de Estado del POS */}
          <div className="bg-slate-900/90 border-b border-slate-800 px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs">
                <UserCheck size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-white text-xs sm:text-sm">
                    {authenticatedSeller.name}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                    {authenticatedSeller.role}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Building2 size={11} className="text-amber-400" />
                  {SEDE_LABELS[selectedSede]}
                </span>
              </div>
            </div>

            {/* Estado de Conectividad & Sincronización */}
            <div className="flex items-center gap-2">
              <span
                className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  isOnline
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                }`}
              >
                {isOnline ? <Wifi size={11} /> : <WifiOff size={11} />}
                <span>{isOnline ? "Online" : "Sin Internet"}</span>
              </span>

              {offlineSalesQueue.length > 0 && (
                <button
                  disabled={!isOnline || isSyncing}
                  onClick={syncOfflineSales}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
                  title="Sincronizar ventas offline"
                >
                  <CloudUpload size={12} className={isSyncing ? "animate-bounce" : ""} />
                  <span>{offlineSalesQueue.length} pendiente(s)</span>
                </button>
              )}

              {currentShift ? (
                <button
                  onClick={() => {
                    setClosingActualCash((currentShift.opening_cash_cop || 0) + (currentShift.total_sales_cop || 0));
                    setIsClosingShiftOpen(true);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  <Clock size={12} />
                  <span className="hidden sm:inline">Cerrar Turno</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsOpeningShiftOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  <Sparkles size={12} />
                  <span>Abrir Caja</span>
                </button>
              )}

              <button
                onClick={() => {
                  setAuthenticatedSeller(null);
                  clearCart();
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-300 text-[11px] font-semibold transition-colors cursor-pointer"
                title="Bloquear Terminal"
              >
                <Lock size={12} />
                <span className="hidden sm:inline">Bloquear</span>
              </button>
            </div>
          </div>

          {/* Layout Dividido: Catálogo a la izquierda, Carrito de Cobro a la derecha */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden relative">
            
            {/* COLUMNA IZQUIERDA: Catálogo de Productos */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full border-r border-slate-800/80 bg-slate-950 overflow-hidden pb-16 lg:pb-0">
              
              {/* Barra de Búsqueda & Categorías */}
              <div className="p-3 bg-slate-900/50 border-b border-slate-800 space-y-2 shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="Buscar prótesis, adhesivo, cinta, servicio..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Pills de Categorías */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {["todos", "sistemas", "adhesivos", "cintas", "cuidados", "servicios"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-amber-500 text-slate-950 shadow-sm"
                          : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid de Productos Táctiles */}
              <div className="flex-1 p-3 overflow-y-auto">
                {loadingProducts ? (
                  <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                    <RefreshCw className="animate-spin mr-2" size={16} />
                    Cargando catálogo...
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <ShoppingBag size={32} className="text-slate-700 mb-2" />
                    <p className="text-xs font-semibold">No se encontraron productos</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
                    {filteredProducts.map((product) => {
                      const inCart = cart.find((i) => i.product.id === product.id);
                      const stock = product.stock_quantity ?? 10;
                      const isOutOfStock = stock <= 0;

                      return (
                        <button
                          key={product.id}
                          disabled={isOutOfStock}
                          onClick={() => addToCart(product)}
                          className={`text-left p-3 rounded-2xl border transition-all flex flex-col justify-between relative group cursor-pointer active:scale-95 ${
                            inCart
                              ? "bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/10"
                              : "bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                          } ${isOutOfStock ? "opacity-40 cursor-not-allowed" : ""}`}
                        >
                          {inCart && (
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-md">
                              {inCart.quantity}
                            </span>
                          )}

                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                              {product.category}
                            </span>
                            <h4 className="font-bold text-white text-xs line-clamp-2 leading-tight">
                              {product.name}
                            </h4>
                          </div>

                          <div className="mt-2.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between">
                            <span className="font-heading font-black text-amber-400 text-xs">
                              {formatPriceCOP(product.price_offer)}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
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

            {/* BOTÓN FLOTANTE MÓVIL PARA VER CARRITO */}
            <div className="lg:hidden fixed bottom-3 left-3 right-3 z-30">
              <button
                disabled={cart.length === 0}
                onClick={() => setIsMobileCartOpen(true)}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-heading font-black text-sm shadow-2xl flex items-center justify-between disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} />
                  <span>Ver Carrito ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
                </div>
                <span>{formatPriceCOP(totalCOP)}</span>
              </button>
            </div>

            {/* COLUMNA DERECHA: Carrito & Cobro (Drawer en móvil, Sidebar en desktop) */}
            <div
              className={`fixed inset-0 z-40 lg:static lg:z-0 lg:col-span-5 xl:col-span-4 flex flex-col h-full bg-slate-900/95 lg:bg-slate-900/90 border-l border-slate-800 transition-transform duration-300 ${
                isMobileCartOpen ? "translate-y-0" : "translate-y-full lg:translate-y-0"
              }`}
            >
              
              {/* Header del Carrito */}
              <div className="p-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={16} className="text-amber-400" />
                  <h3 className="font-heading font-bold text-white text-xs sm:text-sm">
                    Orden Actual ({cart.reduce((a, b) => a + b.quantity, 0)} ítems)
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-xs text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                    >
                      Vaciar
                    </button>
                  )}
                  <button
                    onClick={() => setIsMobileCartOpen(false)}
                    className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Lista de Ítems en Carrito */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-4">
                    <ShoppingBag size={40} className="text-slate-800 mb-2" />
                    <p className="font-bold text-slate-400 text-xs">El carrito está vacío</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Toca los productos del catálogo para agregarlos.
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2.5"
                    >
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-white text-xs truncate">{item.product.name}</h5>
                        <span className="text-[10px] text-amber-400 font-semibold">
                          {formatPriceCOP(item.product.price_offer)} c/u
                        </span>
                      </div>

                      {/* Modificadores de Cantidad */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center cursor-pointer text-xs"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="font-bold text-white text-xs w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center cursor-pointer text-xs"
                        >
                          <Plus size={11} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-600 hover:text-red-400 p-1 cursor-pointer ml-0.5"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Datos del Cliente y Descuento */}
              <div className="p-3.5 bg-slate-950/70 border-t border-slate-800 space-y-2.5 shrink-0">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nombre Cliente"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="text"
                    placeholder="Teléfono / WhatsApp"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Selector de Descuento Rápido */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Descuento:</span>
                  <div className="flex items-center gap-1">
                    {[0, 5, 10, 15].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setDiscountPercent(pct)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
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
                <div className="space-y-1 pt-1.5 border-t border-slate-800/80 text-xs">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Subtotal:</span>
                    <span>{formatPriceCOP(subtotalCOP)}</span>
                  </div>
                  {discountAmountCOP > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold text-[11px]">
                      <span>Descuento ({discountPercent}%):</span>
                      <span>-{formatPriceCOP(discountAmountCOP)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm sm:text-base font-heading font-black text-white pt-0.5">
                    <span>TOTAL:</span>
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
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 font-heading font-black text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>COBRAR {formatPriceCOP(totalCOP)}</span>
                  <ArrowRight size={16} />
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-heading font-black text-white">Seleccionar Medio de Pago</h3>
                <span className="text-xs text-slate-400">
                  Total a liquidar: <strong className="text-amber-400">{formatPriceCOP(totalCOP)}</strong>
                </span>
              </div>
              <button
                onClick={() => setIsPaymentOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Selector de Medios de Pago */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "efectivo", label: "Efectivo", icon: Banknote, color: "text-emerald-400" },
                { id: "datafono", label: "Datáfono", icon: CreditCard, color: "text-sky-400" },
                { id: "nequi_daviplata", label: "Nequi/Davi", icon: Smartphone, color: "text-purple-400" },
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
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      paymentMethod === m.id
                        ? "bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-md"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <Icon size={18} className={paymentMethod === m.id ? "text-slate-950" : m.color} />
                    <span className="text-[11px] font-semibold truncate">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Detalle según método de pago */}
            {paymentMethod === "efectivo" ? (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-slate-300">
                    Dinero Recibido (COP)
                  </label>
                  <div className="flex gap-1">
                    {[50000, 100000, 200000].map((quick) => (
                      <button
                        key={quick}
                        type="button"
                        onClick={() => setCashReceived(quick)}
                        className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-amber-400 hover:bg-slate-700"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/50 text-lg font-heading font-black text-amber-400 focus:outline-none font-mono"
                />
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase">Cambio / Devuelta:</span>
                  <span className="text-base font-heading font-black text-emerald-400">
                    {formatPriceCOP(changeCOP)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-300 block">
                  Referencia de Voucher / Comprobante / Aprobación
                </label>
                <input
                  type="text"
                  placeholder="Ej: Aprobación #123456"
                  value={voucherRef}
                  onChange={(e) => setVoucherRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            )}

            {/* Botón de Confirmación */}
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsPaymentOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={processingSale || (paymentMethod === "efectivo" && cashReceived < totalCOP)}
                onClick={handleProcessPayment}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-40 text-slate-950 font-heading font-black text-xs shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5"
              >
                {processingSale ? <RefreshCw className="animate-spin" size={14} /> : <Check size={14} />}
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
          <div className="w-full max-w-sm bg-white text-slate-950 rounded-3xl p-5 shadow-2xl space-y-3 font-mono text-xs max-h-[90vh] overflow-y-auto">
            {/* Header Ticket */}
            <div className="text-center space-y-0.5 pb-2.5 border-b border-dashed border-slate-400">
              <h2 className="font-heading font-black text-sm text-slate-900">PROCAP NATURAL</h2>
              <p className="text-[9px] text-slate-600">Sistemas Capilares & Estilismo Profesional</p>
              <p className="text-[9px] font-bold text-slate-700">{SEDE_LABELS[completedSale.sede_id]}</p>
              <p className="text-[9px] text-slate-500">Orden: {completedSale.order_number}</p>
              <p className="text-[9px] text-slate-500">
                Fecha: {new Date(completedSale.created_at).toLocaleString("es-CO")}
              </p>
              <p className="text-[9px] text-slate-500">Atendido por: {completedSale.seller_name}</p>
            </div>

            {/* Items Comprados */}
            <div className="space-y-1.5 py-1.5 border-b border-dashed border-slate-400 text-[11px]">
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
            <div className="space-y-1 py-1 border-b border-dashed border-slate-400 text-[11px]">
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
              <div className="flex justify-between font-black text-xs pt-0.5">
                <span>TOTAL PAGADO:</span>
                <span>{formatPriceCOP(completedSale.total_cop)}</span>
              </div>
              <div className="flex justify-between text-[9px] text-slate-600">
                <span>Medio de Pago:</span>
                <span className="uppercase font-bold">{completedSale.payment_method}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-[9px] text-slate-500 pt-1 space-y-0.5">
              <p>¡Gracias por confiar en Procap Natural!</p>
              <p>Garantía de fijación y servicio profesional.</p>
              <p className="font-bold text-slate-700">WhatsApp: +57 324 374 8704</p>
            </div>

            {/* Botones */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="py-2 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center gap-1 cursor-pointer text-xs"
              >
                <Printer size={13} /> Imprimir
              </button>
              <button
                onClick={() => setIsReceiptOpen(false)}
                className="py-2 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center gap-1 cursor-pointer text-xs"
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
          <div className="w-full max-w-sm bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <h3 className="font-heading font-bold text-base text-white">Apertura de Base de Caja</h3>
              <button onClick={() => setIsOpeningShiftOpen(false)} className="text-slate-400">
                <X size={16} />
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Ingresa el monto en efectivo que queda en el cajón para dar cambio.
            </p>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-300">Base en Efectivo (COP)</label>
              <input
                type="number"
                value={openingBaseAmount || ""}
                onChange={(e) => setOpeningBaseAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-emerald-500 text-lg font-heading font-black text-emerald-400 font-mono"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setIsOpeningShiftOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleOpenShift}
                className="px-5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black cursor-pointer"
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
          <div className="w-full max-w-sm bg-slate-900 border border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <h3 className="font-heading font-bold text-base text-white">Cierre de Caja & Arqueo</h3>
              <button onClick={() => setIsClosingShiftOpen(false)} className="text-slate-400">
                <X size={16} />
              </button>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 space-y-1 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Base Inicial:</span>
                <span className="font-mono">{formatPriceCOP(currentShift.opening_cash_cop)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Ventas Turno:</span>
                <span className="font-mono text-emerald-400">+{formatPriceCOP(currentShift.total_sales_cop || 0)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-slate-800 pt-1 text-white">
                <span>Efectivo Esperado:</span>
                <span className="font-mono text-amber-400">
                  {formatPriceCOP((currentShift.opening_cash_cop || 0) + (currentShift.total_sales_cop || 0))}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-300">
                Efectivo Real Contado en Cajón (COP)
              </label>
              <input
                type="number"
                value={closingActualCash || ""}
                onChange={(e) => setClosingActualCash(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-amber-500 text-lg font-heading font-black text-amber-400 font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setIsClosingShiftOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleCloseShift}
                className="px-5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black cursor-pointer"
              >
                Confirmar Cierre
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
