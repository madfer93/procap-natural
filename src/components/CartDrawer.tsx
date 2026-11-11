"use client";

import React from "react";
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { WhatsAppIcon } from "@/components/BrandIcons";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, addItem, updateQuantity, removeItem, clearCart, totalItems, totalCOP } = useCart();
  const { formatPrice, currency } = useCurrency();
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573151189795";

  if (!isOpen) return null;

  // Detectar si hay un gancho promocional activo en los productos del carrito
  const activePromoHook = items.find(
    (item) => item.product.promo_hook_active && item.product.promo_hook_title
  );
  const promoId = activePromoHook ? `promo-${activePromoHook.product.id}` : null;
  const isPromoAlreadyInCart = promoId ? items.some((i) => i.product.id === promoId) : false;

  const handleCheckoutWhatsApp = () => {
    if (items.length === 0) return;

    let message = `¡Hola Procap Natural! 💈 Deseo realizar un pedido de los siguientes productos:\n\n`;
    items.forEach((item, idx) => {
      const isPromo = item.product.id.startsWith("promo-");
      message += `${idx + 1}. ${isPromo ? "⚡ *[PROMOCIÓN GANCHO]* " : "*"}*${item.product.name}* (x${item.quantity})\n`;
      message += `   Subtotal: ${formatPrice(item.product.price_offer * item.quantity)}\n`;
    });

    message += `\n💰 *Total Estimado:* ${formatPrice(totalCOP)}\n`;
    message += `🌍 *Moneda:* ${currency}\n\n`;
    message += `¿Tienen disponibilidad inmediata para entrega en Bogotá o envío a mi ciudad? Gracias.`;

    const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div 
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#031C45] border-l border-sky-400/30 text-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h3 className="font-heading font-black text-base text-white flex items-center gap-2">
                  <span>Mi Pedido</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold">
                    {totalItems} {totalItems === 1 ? "artículo" : "artículos"}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Consolidado para pedido directo por WhatsApp</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* GANCHO DE VENTA / ORDER BUMP PROMOCIONAL */}
            {activePromoHook && !isPromoAlreadyInCart && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-amber-950/40 border border-amber-400/50 shadow-lg relative overflow-hidden group animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30">
                    <Sparkles size={18} className="animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                        ⚡ Promoción Gancho
                      </span>
                      <span className="text-[10px] text-amber-300 font-semibold">Exclusivo con tu compra</span>
                    </div>
                    <h5 className="font-bold text-xs text-white leading-tight">
                      {activePromoHook.product.promo_hook_title}
                    </h5>
                    {activePromoHook.product.promo_hook_desc && (
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        {activePromoHook.product.promo_hook_desc}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                      <span className="text-sm font-black text-amber-400 font-heading">
                        +{formatPrice(activePromoHook.product.promo_hook_price || 0)}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          addItem({
                            id: `promo-${activePromoHook.product.id}`,
                            name: activePromoHook.product.promo_hook_title || "Combo Promocional",
                            category: "cuidados",
                            type: "Promoción Combo",
                            description: activePromoHook.product.promo_hook_desc || "",
                            price_offer: activePromoHook.product.promo_hook_price || 0,
                            price_regular: (activePromoHook.product.promo_hook_price || 0) * 1.3,
                            badge: "🔥 Oferta Gancho",
                            is_available: true,
                          });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all hover:scale-105"
                      >
                        <Plus size={13} />
                        <span>Añadir Gancho</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                  <ShoppingBag size={28} />
                </div>
                <h4 className="font-bold text-white text-base">Tu carrito está vacío</h4>
                <p className="text-xs text-slate-400 max-w-xs">
                  Explora el catálogo y agrega prótesis capilares, pegamentos o removedores a tu orden.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-400/40 transition-all flex items-center gap-3"
                >
                  <div className="w-14 h-14 rounded-xl bg-white border border-white/30 overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-sm">
                    {item.product.image_url ? (
                      <img 
                        src={item.product.image_url} 
                        alt={item.product.name} 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <ShoppingBag size={20} className="text-slate-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-white truncate">{item.product.name}</h5>
                    <span className="text-xs font-black text-sky-400 block mt-0.5">
                      {formatPrice(item.product.price_offer)}
                    </span>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-slate-700 rounded-lg bg-slate-950">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:text-sky-400 text-slate-400"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:text-sky-400 text-slate-400"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors ml-auto"
                        title="Eliminar producto"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-950/80 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Subtotal ({totalItems} productos)</span>
                  <span>{formatPrice(totalCOP)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-1 border-t border-slate-800">
                  <span className="text-sm font-bold text-white">Total Estimado:</span>
                  <span className="text-xl font-heading font-black text-sky-400">
                    {formatPrice(totalCOP)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckoutWhatsApp}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02]"
              >
                <WhatsAppIcon className="w-5 h-5 text-slate-950" />
                <span>Enviar Pedido Consolidado a WhatsApp</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck size={13} /> Atención directa con asesor oficial
                </span>
                <button
                  onClick={clearCart}
                  className="hover:text-rose-400 transition-colors"
                >
                  Vaciar
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

