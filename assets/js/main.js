/**
 * Procap Natural - Main JavaScript Engine
 * Gestión de catálogo, cotizador dinámico, filtros y redirección a WhatsApp
 */

// Teléfono oficial Procap Natural
const WHATSAPP_NUMBER = "573151189795";

// Base de Datos de Productos & Servicios
const PRODUCTS_DATA = [
  // Sistemas Capilares (Prótesis)
  {
    id: "sistema-paris",
    name: "Sistema Capilar París",
    category: "sistemas",
    priceOffer: 1950000,
    priceRegular: 2200000,
    badge: "⭐ Alta Gama",
    description: "Malla soldada premium con perímetro en Poly-skin de 0.03 - 0.05 mm. Indetectable y transpirable.",
    icon: "fa-crown",
    type: "Prótesis Capilar"
  },
  {
    id: "sistema-mixto",
    name: "Sistema Mixto Indetectable",
    category: "sistemas",
    priceOffer: 1750000,
    priceRegular: 1950000,
    badge: "🔥 Más Vendido",
    description: "Microfilamento resistente en el centro, poly-skin perimetral y encaje frontal en malla ultra fina.",
    icon: "fa-user-tie",
    type: "Prótesis Capilar"
  },
  {
    id: "sistema-afro-curly",
    name: "Sistema Afro Curly",
    category: "sistemas",
    priceOffer: 1600000,
    priceRegular: 1850000,
    badge: "Especializado",
    description: "Prótesis capilar de cabello afro 100% natural, textura auténtica e integración indetectable.",
    icon: "fa-circle-nodes",
    type: "Prótesis Capilar"
  },
  {
    id: "sistema-crespo",
    name: "Sistema Crespo / Ondulado",
    category: "sistemas",
    priceOffer: 1550000,
    priceRegular: 1650000,
    badge: "Textura Natural",
    description: "Base transpirable con encaje frontal suave para cabello ondulado o con ondas definidas.",
    icon: "fa-water",
    type: "Prótesis Capilar"
  },
  {
    id: "sistema-australiano",
    name: "Sistema Australiano Skin",
    category: "sistemas",
    priceOffer: 1450000,
    priceRegular: 1550000,
    badge: "Ultra Confort",
    description: "Base en piel transpirable y malla soldada con perímetro poly-skin fino (0.03 - 0.05 mm).",
    icon: "fa-wind",
    type: "Prótesis Capilar"
  },
  {
    id: "sistema-pompadour",
    name: "Sistema Pompadour",
    category: "sistemas",
    priceOffer: 999000,
    priceRegular: 1950000,
    badge: "⚡ Súper Descuento (50% OFF)",
    description: "Sistema transpirable con contorno en skin diseñado para peinados hacia atrás y volumen.",
    icon: "fa-fire",
    type: "Prótesis Capilar"
  },
  {
    id: "entradas-frontal",
    name: "Prótesis para Entradas Frontal",
    category: "sistemas",
    priceOffer: 450000,
    priceRegular: 550000,
    badge: "Corrección Localizada",
    description: "Encaje frontal poli-skin diseñado para cubrir recesiones capilares y entradas con precisión.",
    icon: "fa-arrows-left-right",
    type: "Prótesis Parcial"
  },

  // Servicios en Salón Bogotá
  {
    id: "servicio-instalacion",
    name: "Servicio de Instalación & Adaptación",
    category: "servicios",
    priceOffer: 300000,
    priceRegular: 380000,
    badge: "Atención 1 a 1",
    description: "Si ya tienes tu prótesis: corte, diseño de línea frontal, adaptación anatómica y pegado profesional.",
    icon: "fa-scissors",
    type: "Servicio en Bogotá"
  },
  {
    id: "servicio-mantenimiento",
    name: "Servicio de Mantenimiento Preventivo",
    category: "servicios",
    priceOffer: 750000,
    priceOfferFormatted: "75.000",
    priceRegular: 100000,
    badge: "Esencial",
    description: "Retiro cuidadoso, limpieza profunda y desinfección de cuero cabelludo, nuevo adhesivo y peinado.",
    icon: "fa-spa",
    type: "Servicio en Bogotá"
  },

  // Pegamentos & Adhesivos
  {
    id: "pegamento-fusion-multiweek",
    name: "Pegamento Fusión Multi-Week 101ml",
    category: "adhesivos",
    priceOffer: 270000,
    priceRegular: 300000,
    badge: "Larga Duración",
    description: "Pegamento fusión 101 ml (True Tape). Fijación extra fuerte resistente a sudor y ejercicio.",
    icon: "fa-bottle-droplet",
    type: "Insumo Profesional"
  },
  {
    id: "pegamento-ultra-hold",
    name: "Pegamento Ultra Hold (Walker Tape)",
    category: "adhesivos",
    priceOffer: 140000,
    priceRegular: 160000,
    badge: "Garantía Walker Tape",
    description: "Adhesivo líquido acrílico hipoalergénico de máxima retención (hasta 4 semanas).",
    icon: "fa-shield-halved",
    type: "Insumo Profesional"
  },
  {
    id: "safe-gripe-walker",
    name: "Safe Gripe Walker Tape",
    category: "adhesivos",
    priceOffer: 140000,
    priceRegular: 160000,
    badge: "Base de Agua",
    description: "Pegamento hipoalergénico a base de agua, ideal para piel sensible o climas cálidos.",
    icon: "fa-hand-holding-droplet",
    type: "Insumo Profesional"
  },
  {
    id: "pegamento-fusion-extra",
    name: "Pegamento Fusión Extra Fijación",
    category: "adhesivos",
    priceOffer: 130000,
    priceRegular: 160000,
    badge: "Resistente al Agua",
    description: "Pegamento fusión True Tape de fijación multi-semana impermeable para actividad diaria intensa.",
    icon: "fa-tint",
    type: "Insumo Profesional"
  },
  {
    id: "pegamento-conseal",
    name: "Pegamento Blanco Conseal Stylist",
    category: "adhesivos",
    priceOffer: 14000,
    priceRegular: 17000,
    badge: "Económico & Suave",
    description: "Adhesivo blanco a base de agua, secado transparente para retoques precisos y piel delicada.",
    icon: "fa-feather",
    type: "Insumo Profesional"
  },

  // Cintas Adhesivas
  {
    id: "cintas-ultra-hold",
    name: "Cintas Adhesivas Ultra Hold (*36 uds)",
    category: "cintas",
    priceOffer: 65000,
    priceRegular: 85000,
    badge: "Forma Anatómica",
    description: "Cintas adhesivas en forma de ceja / contorno para una colocación rápida y limpia sin residuos.",
    icon: "fa-tape",
    type: "Insumo Profesional"
  },
  {
    id: "cintas-super-tape",
    name: "Cintas Adhesivas Súper Tape",
    category: "cintas",
    priceOffer: 65000,
    priceRegular: 80000,
    badge: "Alta Resistencia",
    description: "Cintas de duración extrema, acabado mate sin brillo y máxima flexibilidad.",
    icon: "fa-box",
    type: "Insumo Profesional"
  },
  {
    id: "cinta-azul-doble-faz",
    name: "Cinta Azul Doble Faz Hipoalergénica",
    category: "cintas",
    priceOffer: 15000,
    priceRegular: 17000,
    badge: "Fácil Retiro",
    description: "Cinta adhesiva doble faz suave para pieles sensibles o fijaciones de corta a media duración.",
    icon: "fa-lines-leaning",
    type: "Insumo Profesional"
  },

  // Disolventes & Cuidados
  {
    id: "kit-mantenimiento",
    name: "Kit Completo de Mantenimiento",
    category: "cuidados",
    priceOffer: 410000,
    priceRegular: 460000,
    badge: "Combo Completo",
    description: "Incluye disolvente, protector de cuero cabelludo, pegamento y cintas para cuidado en casa.",
    icon: "fa-cubes",
    type: "Kit Promocional"
  },
  {
    id: "scalp-protector",
    name: "Scalp Protector (Walker Tape)",
    category: "cuidados",
    priceOffer: 85000,
    priceRegular: 105000,
    badge: "Protector Dérmico",
    description: "Barrera protectora de cuero cabelludo contra grasa, sudor e irritaciones antes del adhesivo.",
    icon: "fa-shield-virus",
    type: "Insumo Profesional"
  },
  {
    id: "just-rite-spray",
    name: "Positioning Just-Rite Spray",
    category: "cuidados",
    priceOffer: 80000,
    priceRegular: 95000,
    badge: "Ajuste Preciso",
    description: "Posicionador en spray que retarda el agarre instantáneo del adhesivo para calzar la prótesis exacta.",
    icon: "fa-spray-can",
    type: "Insumo Profesional"
  },
  {
    id: "disolvente-sas",
    name: "Disolvente SAS Super Adhesive Remover",
    category: "cuidados",
    priceOffer: 60000,
    priceRegular: 80000,
    badge: "Rápida Acción",
    description: "Removedor especializado de alta potencia para disolver pegamento y residuos de cintas.",
    icon: "fa-flask-vial",
    type: "Insumo Profesional"
  },
  {
    id: "disolvente-action",
    name: "Action Adhesive Remover",
    category: "cuidados",
    priceOffer: 60000,
    priceRegular: 70000,
    badge: "Eficacia Probada",
    description: "Disolvente suave y de rápida acción para retirar la prótesis sin tirar del cabello ni maltratar la piel.",
    icon: "fa-vial-circle-check",
    type: "Insumo Profesional"
  },
  {
    id: "disolvente-c22",
    name: "Disolvente C-22 Cítrico",
    category: "cuidados",
    priceOffer: 60000,
    priceRegular: 70000,
    badge: "Aroma Cítrico",
    description: "El removedor clásico cítrico más vendido del mundo para limpieza de cuero cabelludo y base.",
    icon: "fa-lemon",
    type: "Insumo Profesional"
  }
];

// Helper: Formato Moneda COP
function formatCOP(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(amount);
}

// Renderizar Tarjetas de Productos
function renderProducts(items) {
  const container = document.getElementById("products-grid");
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-16 glass-panel rounded-2xl p-8">
        <i class="fa-solid fa-magnifying-glass text-4xl text-amber-500 mb-4 opacity-75"></i>
        <h3 class="text-xl font-bold text-white mb-2">No encontramos coincidencias</h3>
        <p class="text-slate-400 text-sm max-w-md mx-auto">Prueba con otra palabra clave o escríbenos directamente a WhatsApp para cotizar un producto personalizado.</p>
        <button onclick="resetFilters()" class="mt-6 px-6 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-sm hover:bg-amber-400 transition-colors">
          Restablecer Filtros
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(product => {
    // Si es mantenimiento, corregimos el display a 75.000 COP
    const offerPrice = product.id === "servicio-mantenimiento" ? 75000 : product.priceOffer;
    const regularPrice = product.priceRegular;
    const discount = Math.round(((regularPrice - offerPrice) / regularPrice) * 100);

    const waMessage = encodeURIComponent(
      `¡Hola Procap Natural! 👋 Me interesa cotizar o adquirir:\n\n` +
      `📌 *Producto/Servicio:* ${product.name}\n` +
      `💰 *Precio Promoción:* ${formatCOP(offerPrice)} COP\n` +
      `🏷️ *Categoría:* ${product.type}\n\n` +
      `¿Tienen disponibilidad y cómo es el proceso de compra/agendamiento? Gracias.`
    );

    return `
      <div class="glass-panel rounded-2xl p-6 flex flex-col justify-between glow-gold-hover border border-slate-800 transition-all duration-300 relative group">
        <!-- Top Badges -->
        <div class="flex items-center justify-between gap-2 mb-4">
          <span class="text-xs font-semibold px-3 py-1 rounded-full badge-gold">
            ${product.badge}
          </span>
          ${discount > 0 ? `
            <span class="text-xs font-bold px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/30">
              -${discount}%
            </span>
          ` : ''}
        </div>

        <!-- Content -->
        <div>
          <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl mb-4 group-hover:scale-110 transition-transform">
            <i class="fa-solid ${product.icon}"></i>
          </div>
          
          <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">${product.type}</span>
          <h3 class="text-lg font-bold text-white mt-1 mb-2 group-hover:text-amber-400 transition-colors">${product.name}</h3>
          <p class="text-slate-400 text-sm leading-relaxed mb-6">${product.description}</p>
        </div>

        <!-- Pricing & Action -->
        <div class="pt-4 border-t border-slate-800/80">
          <div class="flex items-baseline gap-2 mb-4">
            <span class="text-2xl font-black text-amber-400 font-heading">${formatCOP(offerPrice)}</span>
            <span class="text-sm text-slate-500 line-through">${formatCOP(regularPrice)}</span>
          </div>

          <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}" 
             target="_blank" 
             rel="noopener noreferrer"
             class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-amber-500 text-slate-200 hover:text-slate-950 font-bold text-sm border border-slate-700 hover:border-amber-400 transition-all duration-200 shadow-sm">
            <i class="fa-brands fa-whatsapp text-lg text-emerald-400 group-hover:text-slate-950"></i>
            <span>Pedir por WhatsApp</span>
          </a>
        </div>
      </div>
    `;
  }).join("");
}

// Filtros de Categoría
function setupFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("product-search");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-category");
      filterAndSearch(category, searchInput ? searchInput.value : "");
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const activeBtn = document.querySelector(".filter-btn.active");
      const category = activeBtn ? activeBtn.getAttribute("data-category") : "todos";
      filterAndSearch(category, e.target.value);
    });
  }
}

function filterAndSearch(category, query) {
  let filtered = PRODUCTS_DATA;

  if (category && category !== "todos") {
    filtered = filtered.filter(p => p.category === category);
  }

  if (query && query.trim() !== "") {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.badge.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q)
    );
  }

  renderProducts(filtered);
}

function resetFilters() {
  const searchInput = document.getElementById("product-search");
  if (searchInput) searchInput.value = "";

  const allBtn = document.querySelector('.filter-btn[data-category="todos"]');
  if (allBtn) {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    allBtn.classList.add("active");
  }

  renderProducts(PRODUCTS_DATA);
}

// Cotizador / Asistente Interactivo de WhatsApp
function setupQuoteWizard() {
  const quoteForm = document.getElementById("quote-wizard-form");
  if (!quoteForm) return;

  quoteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const needType = document.querySelector('input[name="need-type"]:checked')?.value || "Prótesis Capilar Nueva";
    const hairStyle = document.getElementById("wizard-style")?.value || "Por definir con el asesor";
    const userCity = document.getElementById("wizard-city")?.value || "Bogotá";
    const userComments = document.getElementById("wizard-notes")?.value || "Ninguna adicional";

    const msg = encodeURIComponent(
      `¡Hola Procap Natural! 💈 Deseo agendar una valoración o cotización personalizada:\n\n` +
      `📋 *Interés Principal:* ${needType}\n` +
      `💇 *Estilo o Textura:* ${hairStyle}\n` +
      `📍 *Ubicación:* ${userCity}\n` +
      `📝 *Detalles:* ${userComments}\n\n` +
      `¿Podrían indicarme los horarios disponibles para atención en la sede de Chicó Norte o asesoría virtual?`
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  });
}

// Acordeón de FAQs
function setupFaqs() {
  const faqButtons = document.querySelectorAll(".faq-toggle");

  faqButtons.forEach(button => {
    button.addEventListener("click", () => {
      const content = button.nextElementSibling;
      const icon = button.querySelector(".faq-icon");
      const isOpen = !content.classList.contains("hidden");

      // Cerrar los otros
      document.querySelectorAll(".faq-content").forEach(c => c.classList.add("hidden"));
      document.querySelectorAll(".faq-icon").forEach(i => i.style.transform = "rotate(0deg)");

      if (!isOpen) {
        content.classList.remove("hidden");
        if (icon) icon.style.transform = "rotate(180deg)";
      }
    });
  });
}

// Mobile Menu Toggle
function setupMobileMenu() {
  const toggleBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const navLinks = document.querySelectorAll(".mobile-nav-link");

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  });
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(PRODUCTS_DATA);
  setupFilters();
  setupQuoteWizard();
  setupFaqs();
  setupMobileMenu();
});
