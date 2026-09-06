"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Package, 
  Search, 
  Crown, 
  Layers, 
  Sparkles, 
  Scissors, 
  ShoppingBag,
  ExternalLink,
  Filter,
  CheckCircle2
} from "lucide-react";
import { Product, INITIAL_PRODUCTS, formatPriceCOP } from "@/lib/products-store";

export default function CatalogoPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState("");

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573151189795";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.products && data.products.length > 0) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Error al cargar productos:", err);
    } finally {
      setLoading(false);
    }
  };

  const availableProducts = products.filter((p) => p.is_available !== false);

  const filteredProducts = availableProducts.filter((product) => {
    const matchesCategory = selectedCategory === "todos" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.badge?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.type?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold badge-procap">
              <ShoppingBag size={14} /> Catálogo Oficial • Precios COP
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight">
              Sistemas Capilares, Adhesivos e <span className="text-cyan-gradient">Insumos</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Disponibilidad inmediata para entrega en Bogotá y envíos nacionales asegurados a toda Colombia con transportadora y guía en tiempo real.
            </p>
          </div>

          {/* Buscador y Filtros */}
          <div className="glass-panel rounded-2xl p-4 sm:p-6 mb-12 border border-white/10 space-y-4">
            
            <div className="relative max-w-xl mx-auto">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, sistema, pegamento, cinta o removedor..."
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>

            <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
              {[
                { id: "todos", label: "Todos los Productos" },
                { id: "sistemas", label: "Sistemas Capilares", icon: Crown },
                { id: "adhesivos", label: "Pegamentos", icon: Package },
                { id: "cintas", label: "Cintas Adhesivas", icon: Layers },
                { id: "cuidados", label: "Disolventes & Cuidados", icon: Sparkles },
                { id: "servicios", label: "Servicios", icon: Scissors },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    selectedCategory === tab.id
                      ? "bg-sky-400 text-slate-950 font-bold shadow-md shadow-sky-500/20"
                      : "bg-slate-900/90 text-slate-300 hover:border-sky-400 border border-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>

          {/* Grid de Productos */}
          {loading ? (
            <div className="text-center py-20 text-sky-400">
              <Sparkles size={36} className="animate-spin mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-300">Cargando productos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-3xl p-8 max-w-md mx-auto">
              <Package size={40} className="mx-auto text-sky-400/50 mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No se encontraron productos</h3>
              <p className="text-xs text-slate-400 mb-6">Prueba buscando con otra palabra clave o restablece los filtros.</p>
              <button
                onClick={() => {
                  setSelectedCategory("todos");
                  setSearchQuery("");
                }}
                className="px-5 py-2.5 rounded-xl bg-sky-400 text-slate-950 font-bold text-xs"
              >
                Ver Todos los Productos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filteredProducts.map((product) => {
                const discount = Math.round(
                  ((product.price_regular - product.price_offer) / product.price_regular) * 100
                );

                const waMessage = encodeURIComponent(
                  `¡Hola Procap Natural! 👋 Me interesa cotizar o adquirir:\n\n` +
                  `📌 *Producto/Servicio:* ${product.name}\n` +
                  `💰 *Precio Promoción:* ${formatPriceCOP(product.price_offer)} COP\n` +
                  `🏷️ *Categoría:* ${product.type}\n\n` +
                  `¿Tienen disponibilidad y cómo es el proceso de compra/agendamiento? Gracias.`
                );

                return (
                  <div
                    key={product.id}
                    className="glass-panel rounded-2xl p-6 flex flex-col justify-between border border-white/10 hover:border-sky-400/50 transition-all duration-300 relative group"
                  >
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full badge-procap">
                        {product.badge || "Disponible"}
                      </span>
                      {discount > 0 && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/30">
                          -{discount}%
                        </span>
                      )}
                    </div>

                    {/* Body Content */}
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 text-xl mb-4 group-hover:scale-110 transition-transform">
                        {product.category === "sistemas" ? (
                          <Crown size={22} />
                        ) : product.category === "servicios" ? (
                          <Scissors size={22} />
                        ) : (
                          <Package size={22} />
                        )}
                      </div>

                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        {product.type}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1 mb-2 group-hover:text-sky-300 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed mb-6">
                        {product.description}
                      </p>
                    </div>

                    {/* Pricing & WhatsApp CTA */}
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-black text-sky-400 font-heading">
                          {formatPriceCOP(product.price_offer)}
                        </span>
                        <span className="text-sm text-slate-400 line-through">
                          {formatPriceCOP(product.price_regular)}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        {product.payment_link && (
                          <a
                            href={product.payment_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
                          >
                            <span>💳 Pagar en Línea / Crédito</span>
                          </a>
                        )}

                        <a
                          href={`https://wa.me/${whatsappPhone}?text=${waMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl ${
                            product.payment_link 
                              ? "bg-slate-900 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 border border-slate-700 hover:border-emerald-400" 
                              : "bg-slate-900/90 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 border border-slate-700 hover:border-emerald-400"
                          } font-bold text-xs transition-all duration-200 shadow-sm group`}
                        >
                          <i className="fa-brands fa-whatsapp text-base text-emerald-400 group-hover:text-slate-950"></i>
                          <span>Pedir por WhatsApp</span>
                        </a>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* Banner de Asesoría */}
          <div className="p-8 sm:p-10 rounded-3xl glass-panel-glow border border-sky-400/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-black font-heading text-white">
                ¿No estás seguro de cuál base o pegamento elegir?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Usa nuestro cotizador interactivo o consulta con un asesor en WhatsApp para recomendarte el sistema ideal según tu nivel de sudoración y estilo.
              </p>
            </div>
            <Link
              href="/cotizador"
              className="px-6 py-3.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-xs shrink-0 shadow-lg shadow-sky-500/20"
            >
              Ir al Cotizador Rápido →
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
