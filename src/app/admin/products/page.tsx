"use client";

import React, { useState, useEffect } from "react";
import { 
  Package, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  UploadCloud, 
  Check, 
  X, 
  Sparkles, 
  Save, 
  ArrowLeft,
  DollarSign,
  Tag,
  Layers,
  Image as ImageIcon,
  Loader2,
  CreditCard
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Product, INITIAL_PRODUCTS, formatPriceCOP } from "@/lib/products-store";

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  
  // Panel de edición / creación (Inline Panel, cero modales)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    category: "sistemas",
    type: "Prótesis Capilar",
    description: "",
    price_offer: 0,
    price_regular: 0,
    badge: "",
    image_url: "",
    payment_link: "",
    payment_link_credit: "",
    is_available: true,
    is_featured: false,
    order_index: 0
  });

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
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

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      id: `prod-${Date.now()}`,
      name: "",
      category: "sistemas",
      type: "Prótesis Capilar",
      description: "",
      price_offer: 100000,
      price_regular: 120000,
      badge: "Nuevo",
      image_url: "",
      payment_link: "",
      payment_link_credit: "",
      is_available: true,
      is_featured: false,
      order_index: products.length + 1
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ 
      ...product,
      payment_link: product.payment_link || "",
      payment_link_credit: product.payment_link_credit || ""
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  // Subir imagen a Supabase Storage (Bucket 'products')
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isSupabaseConfigured()) {
      showNotification("Supabase no configurado; usa una URL externa o configura .env.local", "error");
      return;
    }

    try {
      setUploadingImage(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `items/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("products")
        .getPublicUrl(filePath);

      setFormData((prev) => ({
        ...prev,
        image_url: publicUrlData.publicUrl
      }));

      showNotification("¡Imagen subida exitosamente al Storage de Supabase!");
    } catch (err: any) {
      console.error("Error al subir imagen:", err);
      showNotification(`Error al subir imagen: ${err.message || err}`, "error");
    } finally {
      setUploadingImage(false);
    }
  };

  // Guardar producto (Crear o Actualizar)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price_offer) {
      showNotification("Por favor completa el nombre y precio del producto.", "error");
      return;
    }

    try {
      setSaving(true);
      const method = editingProduct ? "PUT" : "POST";
      const payload = {
        ...formData,
        id: editingProduct ? editingProduct.id : formData.id || `prod-${Date.now()}`,
        price_offer: Number(formData.price_offer),
        price_regular: Number(formData.price_regular || formData.price_offer)
      };

      const res = await fetch("/api/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al guardar el producto");
      }

      // Actualizar estado local
      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? (payload as Product) : p))
        );
        showNotification("¡Producto actualizado exitosamente!");
      } else {
        setProducts((prev) => [payload as Product, ...prev]);
        showNotification("¡Nuevo producto agregado al catálogo!");
      }

      handleCloseForm();
    } catch (err: any) {
      showNotification(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // Cambiar Visibilidad (Ocultar / Mostrar producto)
  const handleToggleVisibility = async (product: Product) => {
    const newStatus = product.is_available === false ? true : false;
    try {
      // Optimistic update
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_available: newStatus } : p))
      );

      await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, is_available: newStatus })
      });

      showNotification(
        newStatus ? `"${product.name}" ahora es visible al público.` : `"${product.name}" ha sido ocultado.`
      );
    } catch (err) {
      showNotification("Error al cambiar visibilidad", "error");
      fetchProducts();
    }
  };

  // Eliminar producto
  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente "${product.name}"?`)) {
      return;
    }

    try {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));

      await fetch(`/api/products?id=${product.id}`, {
        method: "DELETE"
      });

      showNotification(`"${product.name}" ha sido eliminado.`);
    } catch (err) {
      showNotification("Error al eliminar", "error");
      fetchProducts();
    }
  };

  // Filtros
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "todos" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.badge?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
            Gestión de Productos & Sistemas
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Agrega nuevos sistemas capilares, edita precios, sube fotos y controla qué se muestra en la tienda.
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={handleOpenCreate}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-105"
          >
            <Plus size={18} />
            <span>Agregar Nuevo Producto</span>
          </button>
        )}
      </div>

      {/* Notificaciones */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between animate-in fade-in duration-300 ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-300"
              : "bg-red-500/10 border border-red-500/40 text-red-300"
          }`}
        >
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* FORMULARIO EXPANDIBLE INLINE (Cero modales molestos) */}
      {isFormOpen && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-amber-500/40 shadow-2xl relative animate-in fade-in duration-300">
          
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                {editingProduct ? <Edit size={20} /> : <Plus size={20} />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {editingProduct ? `Editar: ${editingProduct.name}` : "Crear Nuevo Producto / Sistema"}
                </h2>
                <span className="text-xs text-slate-400">Completa los campos del producto</span>
              </div>
            </div>

            <button
              onClick={handleCloseForm}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Volver a la Lista</span>
            </button>
          </div>

          <form onSubmit={handleSaveProduct} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
              
              {/* Nombre del Producto */}
              <div className="sm:col-span-8">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Nombre del Producto o Sistema *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Sistema Capilar Ultra HD París"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Categoría */}
              <div className="sm:col-span-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Categoría *
                </label>
                <select
                  value={formData.category || "sistemas"}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="sistemas">Sistemas Capilares (Prótesis)</option>
                  <option value="adhesivos">Pegamentos & Adhesivos</option>
                  <option value="cintas">Cintas Doble Faz</option>
                  <option value="cuidados">Disolventes & Cuidados</option>
                  <option value="servicios">Servicios en Salón</option>
                </select>
              </div>

              {/* Tipo / Subtítulo */}
              <div className="sm:col-span-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Tipo o Etiqueta Secundaria
                </label>
                <input
                  type="text"
                  value={formData.type || ""}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="Ej: Prótesis Capilar / Insumo Profesional / Servicio"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Badge Destacado */}
              <div className="sm:col-span-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Insignia / Badge (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.badge || ""}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="Ej: 🔥 Más Vendido / ⭐ Alta Gama / 50% OFF"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Precio Oferta */}
              <div className="sm:col-span-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Precio Promoción (COP) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.price_offer || ""}
                  onChange={(e) => setFormData({ ...formData, price_offer: Number(e.target.value) })}
                  placeholder="Ej: 1750000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-amber-400 font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Precio Regular */}
              <div className="sm:col-span-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Precio Regular / Antes (COP)
                </label>
                <input
                  type="number"
                  value={formData.price_regular || ""}
                  onChange={(e) => setFormData({ ...formData, price_regular: Number(e.target.value) })}
                  placeholder="Ej: 1950000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-400 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Descripción */}
              <div className="sm:col-span-12">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Descripción Detallada
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe las características, grosor de malla, tipo de cabello o beneficios..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Imagen / Subida a Storage */}
              <div className="sm:col-span-12 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <ImageIcon size={16} className="text-amber-400" />
                    <span>Foto del Producto (Storage Supabase)</span>
                  </label>
                  {uploadingImage && (
                    <span className="text-xs text-amber-400 flex items-center gap-1.5">
                      <Loader2 size={14} className="animate-spin" /> Subiendo archivo...
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <input
                    type="text"
                    value={formData.image_url || ""}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://... o sube una imagen directa"
                    className="flex-1 w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                  />

                  <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all shrink-0">
                    <UploadCloud size={16} />
                    <span>Subir Imagen</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              {/* Pasarela 1: Link de Pago Wompi */}
              <div className="sm:col-span-12 p-4 rounded-2xl bg-slate-900/60 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Sparkles size={14} />
                    <span>1. Pasarela Wompi (Link de Pago Directo / Bancolombia / PSE / Tarjeta)</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Opcional</span>
                </div>
                <input
                  type="url"
                  value={formData.payment_link || ""}
                  onChange={(e) => setFormData({ ...formData, payment_link: e.target.value })}
                  placeholder="https://checkout.wompi.co/l/..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
                <span className="text-[11px] text-slate-400 block">
                  Los clientes verán el botón de pago con Wompi (tarjetas de crédito, débito, transferencias Bancolombia y PSE).
                </span>
              </div>

              {/* Pasarela 2: Link de Financiamiento / Sistecrédito / Addi */}
              <div className="sm:col-span-12 p-4 rounded-2xl bg-slate-900/60 border border-sky-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                    <CreditCard size={14} />
                    <span>2. Pasarela a Cuotas / Crédito (Sistecrédito / Addi / Financiamiento)</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Opcional</span>
                </div>
                <input
                  type="url"
                  value={formData.payment_link_credit || ""}
                  onChange={(e) => setFormData({ ...formData, payment_link_credit: e.target.value })}
                  placeholder="https://... (Link de pago Sistecrédito o Addi para compra a cuotas)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
                />
                <span className="text-[11px] text-slate-400 block">
                  Los clientes verán un botón adicional para financiar la compra a cuotas con Sistecrédito o Addi.
                </span>
              </div>

              {/* Opciones de Visibilidad */}
              <div className="sm:col-span-12 flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_available !== false}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-amber-400"
                  />
                  <span className="text-xs font-semibold text-slate-200">
                    Producto Visible en la Tienda Pública
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured === true}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-amber-400"
                  />
                  <span className="text-xs font-semibold text-slate-200">
                    Destacar en la portada (Hero / Top)
                  </span>
                </label>
              </div>

            </div>

            {/* Actions Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={handleCloseForm}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                <span>{editingProduct ? "Guardar Cambios" : "Crear Producto"}</span>
              </button>
            </div>

          </form>

        </div>
      )}

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o descripción..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center flex-wrap gap-1.5 w-full sm:w-auto">
          {["todos", "sistemas", "adhesivos", "cintas", "cuidados", "servicios"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                selectedCategory === cat
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* LISTA / TABLA DE PRODUCTOS */}
      <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-amber-400">
            <Loader2 size={32} className="animate-spin mx-auto mb-2" />
            <span className="text-xs font-bold text-slate-400">Cargando catálogo...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Package size={36} className="mx-auto text-amber-500/50 mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">No se encontraron productos</h3>
            <p className="text-xs text-slate-500">Intenta con otra búsqueda o agrega un nuevo producto.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Producto</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Precio Oferta</th>
                  <th className="p-4">Precio Regular</th>
                  <th className="p-4">Visibilidad</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`hover:bg-slate-900/40 transition-colors ${
                      product.is_available === false ? "opacity-60 bg-slate-950/40" : ""
                    }`}
                  >
                    
                    {/* Nombre & Badge */}
                    <td className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                          <Package size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-sm">{product.name}</span>
                            {product.badge && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                                {product.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-500 text-[11px] line-clamp-1 max-w-sm mt-0.5">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Categoría */}
                    <td className="p-4 capitalize text-slate-400">
                      <span className="px-2.5 py-1 rounded-md bg-slate-900 text-[11px] font-medium border border-slate-800">
                        {product.category}
                      </span>
                    </td>

                    {/* Precio Promo */}
                    <td className="p-4 font-black text-amber-400 text-sm font-heading">
                      {formatPriceCOP(product.price_offer)}
                    </td>

                    {/* Precio Regular */}
                    <td className="p-4 text-slate-500 line-through">
                      {formatPriceCOP(product.price_regular)}
                    </td>

                    {/* Visibilidad Switch */}
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleVisibility(product)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                          product.is_available !== false
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                            : "bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300"
                        }`}
                        title="Click para cambiar visibilidad"
                      >
                        {product.is_available !== false ? (
                          <>
                            <Eye size={13} />
                            <span>Visible</span>
                          </>
                        ) : (
                          <>
                            <EyeOff size={13} />
                            <span>Oculto</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Acciones */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-colors"
                          title="Editar producto"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-red-500 hover:text-white text-slate-400 transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
