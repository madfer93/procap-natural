"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Package,
  FileSpreadsheet,
  Zap,
  Film,
  CreditCard,
  Building2,
  Globe2,
  Printer,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Download,
  Share2
} from "lucide-react";

interface GuideSection {
  id: string;
  category: "productos" | "ganchos" | "videos" | "pagos" | "sedes" | "multimoneda";
  title: string;
  subtitle: string;
  badge: string;
  actionUrl?: string;
  actionText?: string;
  steps: {
    title: string;
    description: string;
    tip?: string;
    warning?: string;
    example?: string;
  }[];
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "productos-masivos",
    category: "productos",
    title: "1. Carga Masiva de Productos (50+ Productos desde Excel)",
    subtitle: "Cómo subir todo tu catálogo de prótesis y accesorios en segundos sin digitar uno por uno.",
    badge: "Indispensable",
    actionUrl: "/admin/products",
    actionText: "Ir a Gestión de Productos",
    steps: [
      {
        title: "Paso 1: Abrir la herramienta de Carga Masiva",
        description: "En el menú lateral, dirígete a 'Productos & Stock'. En la esquina superior derecha verás el botón verde 'Carga Masiva (Excel / CSV)'. Haz clic sobre él para desplegar el panel.",
        tip: "Puedes descargar la plantilla de ejemplo haciendo clic en 'Descargar Plantilla Excel/CSV' para ver la estructura exacta."
      },
      {
        title: "Paso 2: Formato de las columnas",
        description: "En tu archivo de Excel o bloc de notas, organiza tus productos con este orden por fila:\nNombre ; Precio Venta ; Categoría ; Descripción ; URL de la Foto",
        example: "Sistema París Premium; 1950000; sistemas; Malla francesa indetectable transpirable; https://misitio.com/foto1.jpg\nPegamento Ultra Hold 0.5oz; 85000; adhesivos; Adhesivo acrílico de 4 semanas; https://misitio.com/foto2.jpg",
        tip: "Las categorías válidas son: sistemas, adhesivos, cintas, cuidados, servicios. Si escribes algo parecido como 'pegamento' o 'shampoo', el sistema lo detectará automáticamente."
      },
      {
        title: "Paso 3: Pegar y procesar con 1 solo clic",
        description: "Copia todas las filas de tu Excel y pégalas dentro del cuadro de texto grande. Haz clic en 'Procesar e Importar Productos'. El sistema validará los precios y los creará al instante.",
        warning: "Si un producto ya existe con el mismo nombre o ID, el sistema actualizará sus datos sin duplicarlo."
      }
    ]
  },
  {
    id: "productos-individual",
    category: "productos",
    title: "2. Carga Individual con Fotos Dobles (Cabello + Base/Malla)",
    subtitle: "Cómo crear o editar una prótesis capilar con dos vistas para maximizar las ventas.",
    badge: "Conversión Alta",
    actionUrl: "/admin/products",
    actionText: "Crear 1 Producto",
    steps: [
      {
        title: "Paso 1: Botón 'Agregar 1 Producto'",
        description: "Haz clic en 'Agregar 1 Producto' en la parte superior. Se abrirá el formulario completo.",
        tip: "Asigna un nombre descriptivo (ej: 'Sistema París Indetectable') y una insignia llamativa como '⭐ Alta Gama' o '🔥 Más Vendido'."
      },
      {
        title: "Paso 2: Subir las 2 Fotografías Clave",
        description: "Los clientes de prótesis necesitan ver 2 cosas antes de comprar:\n1. Foto 1 (Look Puesto): Cómo se ve el cabello peinado en una persona.\n2. Foto 2 (Base o Malla Interna): El acabado de la microfibra o poly-skin indetectable.",
        tip: "Haz clic en el botón 'Subir' de cada foto y selecciona la imagen desde tu celular o computador. Se guardará automáticamente en el almacenamiento seguro en la nube."
      },
      {
        title: "Paso 3: Costo Confidencial y Margen de Utilidad",
        description: "Ingresa tu 'Costo Compra / Importación'. Este número es 100% privado y no se muestra a los clientes. El sistema calculará automáticamente tu ganancia en pesos y tu margen de rentabilidad en %."
      }
    ]
  },
  {
    id: "ganchos-promociones",
    category: "ganchos",
    title: "3. Ganchos de Venta & Promociones Cruzadas (Order Bumps)",
    subtitle: "Cómo hacer que cuando el cliente elija una prótesis, agregue un combo y aumente el valor de la compra.",
    badge: "Estrategia de Venta",
    actionUrl: "/admin/products",
    actionText: "Configurar Ganchos",
    steps: [
      {
        title: "¿Qué es un Gancho de Venta?",
        description: "Es una oferta irresistible que aparece dentro del carrito del cliente justo en el momento en que agrega un producto principal. Por ejemplo: si agrega una prótesis de $1.750.000, el carrito le ofrece: '¡Lleva el Kit de Pegamento + Removedor por solo $150.000 (Ahorras $40.000)!'."
      },
      {
        title: "Paso 1: Activar el gancho en el producto",
        description: "Al editar cualquier producto en el panel de administración, desplázate hasta la sección '⚡ Gancho de Venta / Promoción Cruzada' y activa la casilla 'Activar Gancho'.",
        tip: "Funciona especialmente bien en las prótesis capilares, ofreciendo insumos indispensables como adhesivos, cintas o protectores de cuero cabelludo."
      },
      {
        title: "Paso 2: Redactar la oferta gancho",
        description: "Define un título con llamado a la acción y el precio promocional en pesos:\n• Título: '⚡ Combo Cuidados Pro (25% OFF Especial)'\n• Precio Promocional: 150000\n• Descripción: 'Incluye Pegamento Ultra Hold + Removedor C-22 cítrico para tu primer mes.'",
        example: "El cliente verá un botón de 1 clic en su carrito: '+ Añadir Gancho'. Si lo presiona, el total se suma automáticamente y en el WhatsApp del asesor saldrá marcado como '[PROMOCIÓN GANCHO]'."
      }
    ]
  },
  {
    id: "videos-reels",
    category: "videos",
    title: "4. Gestión de Videos & Reels (TikTok / Instagram)",
    subtitle: "Cómo mantener la web entretenida con testimonios reales y videos de transformaciones.",
    badge: "Entretenimiento Visual",
    actionUrl: "/admin/videos",
    actionText: "Gestionar Videos & Reels",
    steps: [
      {
        title: "Paso 1: ¿Por qué tener videos en la web?",
        description: "Los clientes de prótesis capilares tienen desconfianza antes de comprar. Ver videos cortos verticales tipo TikTok de antes y después genera una confianza instantánea y retiene al visitante."
      },
      {
        title: "Paso 2: Subir o enlazar videos",
        description: "En 'Videos & Reels' puedes:\n1. Pegar el enlace de un video que ya tengas en TikTok o Instagram Reels.\n2. O subir directamente un archivo MP4 desde tu teléfono haciendo clic en 'Subir MP4 a Cloudflare R2'.",
        tip: "Puedes colocar un título llamativo (ej: 'Transformación Sistema París en 2 Horas') y el nombre de la sede donde se realizó (ej: 'Sede Bogotá Calle 140')."
      },
      {
        title: "Paso 3: Orden y visibilidad",
        description: "Puedes activar o pausar videos con un solo clic según las temporadas, o marcar cuáles quieres que aparezcan de primero en el carrusel de la página de inicio."
      }
    ]
  },
  {
    id: "pasarelas-pagos",
    category: "pagos",
    title: "5. Pasarelas de Pago (Wompi, Sistecrédito / Addi)",
    subtitle: "Cómo recibir pagos directos con tarjetas, Bancolombia, PSE o financiamiento a cuotas.",
    badge: "Recaudo Seguro",
    actionUrl: "/admin/settings",
    actionText: "Ver Ajustes & Pasarelas",
    steps: [
      {
        title: "1. Enlace de Pago Directo con Wompi",
        description: "Wompi (de Bancolombia) te permite generar enlaces de cobro por producto o enlace abierto. En tu cuenta de Wompi crea el link y pégalo en la casilla 'Pasarela Wompi' del producto.",
        tip: "Cuando el cliente hace clic en 'Pagar con Wompi', la pasarela le permite pagar con Bancolombia Botón, PSE (cualquier banco de Colombia), tarjetas de crédito y Nequi."
      },
      {
        title: "2. Enlace de Financiamiento (Sistecrédito o Addi)",
        description: "Muchos clientes no tienen el dinero de contado para una prótesis de alta gama. Al pegar tu link de comercio de Sistecrédito o Addi en la casilla 'Pasarela a Cuotas', aparecerá un botón azul para pagar hasta en 24 cuotas quincenales.",
        tip: "Sistecrédito y Addi le pagan a Procap de contado y ellos se encargan del cobro con el cliente, eliminando el riesgo para tu negocio."
      }
    ]
  },
  {
    id: "multimoneda-internacional",
    category: "multimoneda",
    title: "6. Ventas Internacionales (Multimoneda COP / USD)",
    subtitle: "¿Por qué NO necesitas comprar otro dominio para vender en Panamá, Venezuela o USA?",
    badge: "Ahorro & Control",
    steps: [
      {
        title: "El Switcher Multimoneda en la Cabecera",
        description: "La tienda ahora cuenta con botones inteligentes en la barra superior: '🇨🇴 COP' y '🇺🇸 USD'. El cliente puede alternar en cualquier momento y los precios se convierten al instante a la tasa de cambio vigente.",
        tip: "Si un cliente te escribe desde Panamá, Venezuela o el extranjero, simplemente indícale que seleccione 'USD'. Verá los precios en dólares exactos y el carrito consolidará su orden en dólares para transferencias internacionales (Zelle, Western Union, tarjeta o PayPal)."
      },
      {
        title: "Por qué tener un solo dominio es mucho mejor",
        description: "1. **Posicionamiento SEO:** Todo el tráfico y autoridad en Google se concentran en un solo dominio fuerte en lugar de dividir visitas en dominios nuevos sin reputación.\n2. **Ahorro de dinero:** No pagas renovaciones anuales de dominios ni licencias duplicadas.\n3. **Autonomía total:** Creas y editas un producto una sola vez en el panel y queda disponible para clientes de Colombia y de todo el mundo."
      }
    ]
  },
  {
    id: "sedes-whatsapp",
    category: "sedes",
    title: "7. Sedes, Teléfonos de WhatsApp & Enrutamiento",
    subtitle: "Cómo dirigir a cada cliente a la sede correcta de Bogotá, Cali, Neiva o Barranquilla.",
    badge: "Atención al Cliente",
    actionUrl: "/admin/sedes",
    actionText: "Gestionar Sedes Físicas",
    steps: [
      {
        title: "Configuración de Sedes Físicas",
        description: "En 'Sedes & Instalaciones' puedes editar la dirección exacta, fotos del local y horarios de atención al público de cada sede.",
        tip: "La sede principal de Bogotá cuenta con banner automático en la home indicando dirección en Calle 140 y parqueadero vigilado."
      },
      {
        title: "Enrutamiento de WhatsApp",
        description: "El botón flotante y el carrito de pedidos envían un mensaje preformateado con los productos elegidos directamente al número oficial de WhatsApp de Procap Natural para que el asesor solo tenga que confirmar el despacho o agendar la instalación."
      }
    ]
  }
];

export default function AdminGuiaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "productos-masivos": true,
    "ganchos-promociones": true
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredSections = GUIDE_SECTIONS.filter((section) => {
    const matchesCat = selectedCategory === "todos" || section.category === selectedCategory;
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      section.title.toLowerCase().includes(query) ||
      section.subtitle.toLowerCase().includes(query) ||
      section.steps.some((s) => s.title.toLowerCase().includes(query) || s.description.toLowerCase().includes(query));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">

      {/* Header Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Manual Oficial de Operación
            </span>
            <span className="text-[11px] text-slate-400">J&M Tech Solutions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white flex items-center gap-2.5">
            <BookOpen size={28} className="text-amber-400" />
            <span>Guía de Uso & Manual del Administrador</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Aprende paso a paso cómo gestionar productos, crear promociones gancho, subir videos y operar tu plataforma con total autonomía.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition-colors shadow-sm"
            title="Imprimir o Guardar como PDF"
          >
            <Printer size={15} className="text-amber-400" />
            <span>Imprimir / Guardar PDF</span>
          </button>
        </div>
      </div>

      {/* Buscador & Filtros de Categoría */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-lg">
        <div className="relative w-full">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="¿Qué deseas hacer? (Ej: 'excel', 'gancho', 'subir video', 'wompi', 'dolar', 'fotos')..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {[
            { id: "todos", label: "Todas las Guías" },
            { id: "productos", label: "📦 Productos & Excel" },
            { id: "ganchos", label: "⚡ Ganchos & Promociones" },
            { id: "videos", label: "🎬 Videos & Reels" },
            { id: "pagos", label: "💳 Pasarelas & Pagos" },
            { id: "multimoneda", label: "🌍 Multimoneda (USD/COP)" },
            { id: "sedes", label: "🏢 Sedes & WhatsApp" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedCategory === cat.id
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tarjetas de Acceso Rápido Resumido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-slate-900 border border-emerald-500/30 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <FileSpreadsheet size={16} />
          </div>
          <h4 className="font-bold text-white text-xs">Carga Rápida Excel (50+)</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Pega tus productos desde Excel separados por punto y coma y se publicarán en 1 segundo.
          </p>
          <Link
            href="/admin/products"
            className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 pt-1"
          >
            <span>Ir a Carga Masiva</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-slate-900 border border-amber-500/30 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Zap size={16} />
          </div>
          <h4 className="font-bold text-white text-xs">Ganchos de Venta (Upsells)</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Ofrece un pegamento o kit con descuento dentro del carrito para duplicar el valor de la orden.
          </p>
          <Link
            href="/admin/products"
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-1"
          >
            <span>Configurar Gancho</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/10 to-slate-900 border border-sky-500/30 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
            <Film size={16} />
          </div>
          <h4 className="font-bold text-white text-xs">Videos & Reels TikTok</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Sube videos cortos de transformaciones para entretener y convencer a clientes indecisos.
          </p>
          <Link
            href="/admin/videos"
            className="text-[11px] font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 pt-1"
          >
            <span>Gestionar Videos</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Acordeón de Guías Detalladas */}
      <div className="space-y-4">
        {filteredSections.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-950 border border-slate-800 text-slate-400 space-y-2">
            <BookOpen size={36} className="mx-auto text-amber-500/50 mb-2" />
            <h3 className="text-sm font-bold text-white">No se encontraron guías para tu búsqueda</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Intenta con otra palabra clave como &ldquo;excel&rdquo;, &ldquo;gancho&rdquo;, &ldquo;video&rdquo;, o haz clic en &ldquo;Todas las Guías&rdquo;.
            </p>
          </div>
        ) : (
          filteredSections.map((section) => {
            const isOpen = !!openSections[section.id];

            return (
              <div
                key={section.id}
                className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl transition-all"
              >
                {/* Header Acordeón */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4 hover:bg-slate-900/60 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {section.badge}
                      </span>
                      <span className="text-[11px] text-slate-400 capitalize">
                        {section.category}
                      </span>
                    </div>
                    <h3 className="font-heading font-black text-base sm:text-lg text-white">
                      {section.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                      {section.subtitle}
                    </p>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-900 text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {/* Contenido Expandible */}
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-900 space-y-5 animate-in fade-in duration-200">

                    {/* Pasos */}
                    <div className="space-y-4">
                      {section.steps.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2.5"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </div>
                            <h4 className="font-bold text-white text-sm">
                              {step.title}
                            </h4>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line pl-8">
                            {step.description}
                          </p>

                          {step.example && (
                            <div className="ml-8 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                              <span className="text-[9.5px] uppercase font-bold text-slate-500 block mb-1 font-sans">
                                Ejemplo exacto para copiar y pegar:
                              </span>
                              <pre className="whitespace-pre-wrap">{step.example}</pre>
                            </div>
                          )}

                          {step.tip && (
                            <div className="ml-8 p-3 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs flex items-start gap-2">
                              <Lightbulb size={16} className="text-sky-400 shrink-0 mt-0.5" />
                              <span className="leading-relaxed"><strong>Consejo Pro:</strong> {step.tip}</span>
                            </div>
                          )}

                          {step.warning && (
                            <div className="ml-8 p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-300 text-xs flex items-start gap-2">
                              <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                              <span className="leading-relaxed"><strong>Atención:</strong> {step.warning}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Botón de acción directa */}
                    {section.actionUrl && (
                      <div className="pt-2 flex justify-end">
                        <Link
                          href={section.actionUrl}
                          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all hover:scale-105"
                        >
                          <span>{section.actionText || "Ir al Módulo"}</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer de Soporte Técnico J&M Tech Solutions */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 border border-sky-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <h4 className="font-bold text-white text-sm flex items-center justify-center sm:justify-start gap-2">
            <Sparkles size={16} className="text-amber-400" />
            <span>¿Necesitas una personalización adicional o soporte técnico?</span>
          </h4>
          <p className="text-xs text-slate-400">
            Desarrollado y respaldado por <strong>J&M Tech Solutions</strong>. Soporte técnico prioritario y automatizaciones a medida.
          </p>
        </div>

        <a
          href="https://wa.me/573151189795?text=Hola%20J%26M%20Tech%20Solutions%2C%20requiero%20asistencia%20t%C3%A9cnica%20con%20el%20panel%20admin%20de%20Procap%20Natural."
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 border border-slate-700 hover:border-emerald-400 font-bold text-xs transition-all shrink-0 flex items-center gap-2"
        >
          <span>Contactar Soporte J&M</span>
          <ExternalLink size={14} />
        </a>
      </div>

    </div>
  );
}

