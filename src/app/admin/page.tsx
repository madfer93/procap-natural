"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Package, 
  Eye, 
  EyeOff, 
  Plus, 
  ExternalLink, 
  Sparkles, 
  Database, 
  Bot,
  Scissors,
  DollarSign,
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import { Product, INITIAL_PRODUCTS, formatPriceCOP } from "@/lib/products-store";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabaseActive, setSupabaseActive] = useState(false);

  useEffect(() => {
    setSupabaseActive(isSupabaseConfigured());
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || INITIAL_PRODUCTS);
    } catch (err) {
      setProducts(INITIAL_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  const totalProducts = products.length;
  const visibleProducts = products.filter((p) => p.is_available !== false).length;
  const hiddenProducts = totalProducts - visibleProducts;
  const hairSystemsCount = products.filter((p) => p.category === "sistemas").length;

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
            Dashboard General
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Resumen del catálogo de prótesis, insumos y estado de conexión en Procap Natural.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all hover:scale-105"
          >
            <Plus size={16} />
            <span>Gestionar Catálogo</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <ExternalLink size={14} />
            <span>Ver Web</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Items</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Package size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-heading">{totalProducts}</div>
          <span className="text-xs text-slate-500 mt-1 block">En base de datos</span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Visibles al Público</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Eye size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400 font-heading">{visibleProducts}</div>
          <span className="text-xs text-slate-500 mt-1 block">Activos en la tienda</span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Sistemas Capilares</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Sparkles size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400 font-heading">{hairSystemsCount}</div>
          <span className="text-xs text-slate-500 mt-1 block">Modelos de prótesis</span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Conexión Supabase</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Database size={20} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              {supabaseActive ? "Conectado" : "Local / Listo"}
            </span>
            <CheckCircle2 size={18} className="text-emerald-400" />
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Bucket Storage Activo</span>
        </div>

      </div>

      {/* Quick Access Action Bar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
            <Bot size={18} className="text-amber-400" />
            <span>Asistente Inteligente & Leads en Tiempo Real</span>
          </h3>
          <p className="text-xs text-slate-400">
            Revisa las personas atendidas por la IA, el historial de consultas y administra tus llaves de Wompi, Sistecrédito y Addi.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/admin/leads"
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-sky-500/20"
          >
            Ver Conversaciones IA
          </Link>
          <Link
            href="/admin/settings"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            Pasarelas & Ajustes
          </Link>
        </div>
      </div>

      {/* Recent Catalog Preview Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Vista Previa del Catálogo</h3>
          <Link href="/admin/products" className="text-xs text-amber-400 hover:underline">
            Ver y editar todos ({totalProducts}) →
          </Link>
        </div>

        <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Producto / Sistema</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Precio Oferta</th>
                  <th className="p-4">Precio Regular</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {products.slice(0, 7).map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span>{prod.name}</span>
                        {prod.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {prod.badge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 capitalize text-slate-400">{prod.category}</td>
                    <td className="p-4 font-bold text-amber-400 font-heading">
                      {formatPriceCOP(prod.price_offer)}
                    </td>
                    <td className="p-4 text-slate-500 line-through">
                      {formatPriceCOP(prod.price_regular)}
                    </td>
                    <td className="p-4">
                      {prod.is_available !== false ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <Eye size={12} /> Visible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                          <EyeOff size={12} /> Oculto
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/products?edit=${prod.id}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 font-semibold transition-colors"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
