# Procap Natural - Prótesis Capilares Indetectables (Next.js & Supabase)

Plataforma Web y Catálogo Interactivo en **Next.js 14 (App Router)** para **Procap Natural** (Bogotá, Colombia), integrada con **Supabase**, **Storage de Imágenes**, **Asistente de IA (Groq - Llama 3.3 70B)** y **Panel de Administración Completo** para gestión de catálogo en tiempo real.

---

## 🎨 Paleta Oficial ProCap (Extraída de los Píxeles del Logo)

| Color | Hex | Uso en la Web y Branding |
|---|---|---|
| **Azul marino profundo** | `#031C45` | Fondo principal, esquinas, sombras y tarjetas oscuras |
| **Azul medio / glow** | `#073374` | Resplandor radial central y degradados de profundidad |
| **Gris pizarra oscuro** | `#393945` | Bordes, separadores y relieve 3D |
| **Blanco plateado** | `#FCFDFE` | Tono dominante de textos, títulos e isotipo |
| **Blanco puro** | `#FFFFFF` | Highlights y bordes iluminados |
| **Cyan Eléctrico** | `#38bdf8` | Acento tech, enlaces activos y badges destacados |
| **Verde Esmeralda** | `#25D366` | Acciones directas a WhatsApp y estados en línea |

---

## 🚀 Módulos & Arquitectura del Proyecto

1. **Tienda Pública & Landing (`/`):**
   - Héroe de alto impacto con propuesta de valor.
   - 4 Pilares de confianza (Indetectable, Vida Activa, Transpirable, Libertad de Corte).
   - Servicios de Salón en Chicó Norte (Instalación $300k, Mantenimiento $75k).
   - **Catálogo Interactivo:** Búsqueda en vivo, filtrado por categorías, cálculo de descuentos y botón individual de compra/agendamiento directo a WhatsApp.
   - **Cotizador Rápido en 3 Pasos:** Asistente interactivo sin modales intrusivos.
   - **Ubicación & Google Maps:** Dirección oficial Cra 16 #96-64, Bogotá D.C.
   - **Preguntas Frecuentes (Accordion):** Respuestas a dudas comunes.
   - **Firma Oficial SEO:** Enlace a [J&M Tech Solutions](https://www.jymtechsolutions.online/es) y Schema JSON-LD `HairSalon` / `LocalBusiness`.

2. **Burbuja de Inteligencia Artificial (Groq Fast):**
   - Asistente virtual **CapilarBot** alimentado por `llama-3.3-70b-versatile`.
   - Entrenado con el catálogo, precios en COP, servicios, dirección en Bogotá y directivas comerciales.
   - Escalado fluido hacia WhatsApp humano en cualquier momento.

3. **Panel Administrativo (`/admin`):**
   - **Acceso Protegido por PIN:** Clave configurable dinámicamente desde Supabase.
   - **Dashboard General (`/admin`):** Métricas en vivo (Total items, visibles, ocultos, conexión).
   - **Gestor de Productos (`/admin/products`):**
     - Crear nuevos productos y sistemas capilares.
     - Editar nombres, precios de oferta, precios regulares, categorías, link de pago directo y badges.
     - Subida de fotos directamente al bucket de Supabase Storage.
     - Ocultar / Mostrar productos (Toggle de visibilidad al instante).
     - Eliminar productos con confirmación.
   - **Módulo de Leads IA (`/admin/leads`):** Historial y seguimiento en vivo de conversaciones con prospectos.
   - **Ajustes del Sistema (`/admin/settings`):** Configurar pasarelas de pago (Wompi, Sistecrédito, Addi), Groq API Key, WhatsApp y PIN de acceso.

---

## 🗄️ Variables de Entorno & Configuración

Configurar en `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GROQ_API_KEY`
- `ADMIN_ACCESS_PIN`

---

## 📦 Despliegue en GitHub y Vercel

```bash
# 1. Inicializar repositorio Git y subir a GitHub
git init
git add .
git commit -m "feat: Procap Natural platform with Next.js, Supabase, Groq AI & Admin Panel"
git branch -M main
git remote add origin https://github.com/madfer93/procap-natural.git
git push -u origin main

# 2. Despliegue en Vercel
# Importar desde GitHub en Vercel Dashboard y configurar las variables de entorno de .env.local
```
