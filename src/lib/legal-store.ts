import { supabase, isSupabaseConfigured } from "./supabase";

export interface LegalDocument {
  slug: string;
  title: string;
  short_title: string;
  badge: string;
  category: "privacidad" | "comercial" | "tecnologia" | "derechos";
  version: string;
  last_updated: string;
  summary: string;
  content: string;
  icon_name: string;
}

export const DEFAULT_LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    slug: "habeas-data",
    title: "Política de Tratamiento de Datos Personales y Habeas Data",
    short_title: "Habeas Data",
    badge: "Ley 1581 de 2012",
    category: "privacidad",
    version: "2.1",
    last_updated: "2026-03-01",
    summary: "Regula la recolección, almacenamiento, uso y protección de los datos personales de nuestros clientes y visitantes en cumplimiento del marco normativo de la República de Colombia.",
    icon_name: "ShieldCheck",
    content: `
# POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES Y HABEAS DATA
**PROCAP NATURAL (SOLUCIÓN CAPILAR INDETECTABLE)**
*En cumplimiento de la Ley Estatutaria 1581 de 2012 y el Decreto Reglamentario 1377 de 2013 de la República de Colombia.*

---

### 1. IDENTIFICACIÓN DEL RESPONSABLE DEL TRATAMIENTO
- **Razón Comercial:** Procap Natural
- **Sede Principal Bogotá:** Carrera 16 #96-64, Barrio Chicó Norte, Bogotá D.C.
- **Sede Cali:** Calle 16 #83A-15, Estudio 402, Edificio María Mercedes, Cali, Valle del Cauca.
- **Correo Electrónico de Contacto Legal & PQR:** infprocap@gmail.com
- **Línea Oficial de Atención:** +57 315 118 9795
- **Sitio Web Oficial:** https://protesiscapilarcolombia.com

---

### 2. MARCO LEGAL Y PRINCIPIOS RECTORES
La presente Política regula el tratamiento de datos personales efectuado por Procap Natural, guiándose por los principios consagrados en el artículo 4 de la Ley 1581 de 2012:
- **Principio de Legalidad:** El tratamiento es una actividad reglada sujeta a la Constitución y la ley.
- **Principio de Finalidad:** La recolección obedece a un fin legítimo debidamente informado al titular.
- **Principio de Libertad:** Los datos solo se tratan con el consentimiento previo, expreso e informado del titular.
- **Principio de Veracidad o Calidad:** La información debe ser veraz, completa, exacta, actualizada y comprobable.
- **Principio de Transparencia:** Se garantiza el derecho del titular a obtener información sobre sus datos en cualquier momento.
- **Principio de Seguridad & Confidencialidad:** Se implementan medidas técnicas y administrativas para evitar adulteración, pérdida, consulta o acceso no autorizado.

---

### 3. FINALIDADES DE LA RECOLECCIÓN Y TRATAMIENTO DE DATOS
Los datos personales que Procap Natural recolecta a través de formularios web, WhatsApp, llamadas y citas presenciales son utilizados para:
1. **Gestión de Citas y Valoraciones:** Agendar, confirmar y reprogramar sesiones de valoración capilar e instalación en cabinas privadas.
2. **Procesamiento de Pedidos y Envíos:** Coordinar el despacho y entrega de sistemas capilares e insumos mediante empresas transportadoras aliadas (Interrapidísimo, Servientrega, Coordinadora).
3. **Facturación y Cobranza:** Gestionar comprobantes de pago a través de pasarelas seguras (Wompi Bancolombia, Sistecrédito / Addi).
4. **Atención al Cliente y Post-Venta:** Brindar asesoría personalizada, recomendaciones de cuidado preventivo y recordatorios de mantenimiento periódico.
5. **Comunicaciones Comerciales:** Enviar información sobre giras nacionales, jornadas de atención en ciudades intermedias y promociones exclusivas (con previa autorización).

---

### 4. DERECHOS DE LOS TITULARES DE LA INFORMACIÓN (DERECHOS ARCO)
Como titular de sus datos personales, usted tiene derecho a:
- **Conocer, actualizar y rectificar** sus datos personales frente a información parcial, inexacta, incompleta o fraccionada.
- **Solicitar prueba de la autorización** otorgada para el tratamiento de sus datos.
- **Ser informado** previa solicitud sobre el uso que se le ha dado a su información personal.
- **Presentar quejas** ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la ley.
- **Revocar la autorización y/o solicitar la supresión** de sus datos cuando en el tratamiento no se respeten los principios constitucionales y legales.

---

### 5. PROCEDIMIENTO PARA EL EJERCICIO DE PETICIONES, QUEJAS Y RECLAMOS (PQR)
Para ejercer sus derechos de Habeas Data, el titular o su apoderado puede enviar una comunicación formal al correo electrónico **infprocap@gmail.com** o a la línea de WhatsApp **+57 315 118 9795**, incluyendo:
- Nombre completo y documento de identidad del titular.
- Descripción clara y precisa de los hechos que dan lugar a la consulta o reclamo.
- Dirección física o electrónica para notificación.

**Tiempos de Respuesta Legal:**
- **Consultas:** Serán atendidas en un término máximo de diez (10) días hábiles contados a partir de su recepción.
- **Reclamos:** Serán atendidos en un término máximo de quince (15) días hábiles.

---

### 6. VIGENCIA DE LAS BASES DE DATOS
Las bases de datos tendrán una vigencia igual al periodo en que se mantenga la relación comercial o contractual con el cliente, más el término legal aplicable para el cumplimiento de obligaciones fiscales y contables en Colombia.
`
  },
  {
    slug: "devoluciones-garantias",
    title: "Política de Garantías, Cambios y Devoluciones",
    short_title: "Garantías y Devoluciones",
    badge: "Ley 1480 de 2011",
    category: "comercial",
    version: "2.0",
    last_updated: "2026-03-01",
    summary: "Establece las condiciones de garantía legal, derecho de retracto y restricciones sanitarias para prótesis capilares e insumos de uso personal en Colombia.",
    icon_name: "RotateCcw",
    content: `
# POLÍTICA DE GARANTÍAS, CAMBIOS Y DEVOLUCIONES
**PROCAP NATURAL**
*De conformidad con la Ley 1480 de 2011 (Estatuto del Consumidor de Colombia).*

---

### 1. NATURALEZA DE LOS PRODUCTOS CAPILARES (USO PERSONAL E HIGIENE)
Las prótesis capilares masculinas, mallas de microfilamento, adhesivos líquidos dérmicos, solventes y cintas adhesivas constituyen **bienes de uso personal y de contacto directo con el cuero cabelludo**. Por estrictas razones de bioseguridad, salubridad y sanidad pública:
- No se aceptan cambios ni devoluciones de prótesis capilares que hayan sido **cortadas, adaptadas, estilizadas, teñidas, lavadas, manipuladas o adheridas** al cuero cabelludo del cliente.
- No se aceptan devoluciones de adhesivos, solventes ni cintas cuyos sellos de seguridad originales de fábrica hayan sido abiertos o vulnerados.

---

### 2. DERECHO DE RETRACTO (COMPRAS VIRTUALES / COMERCIO ELECTRÓNICO)
Para compras realizadas a través de nuestra plataforma web oficial o canales a distancia:
- El consumidor cuenta con un término de **cinco (5) días hábiles** siguientes a la entrega del producto para ejercer su Derecho de Retracto (Artículo 47, Ley 1480 de 2011).
- **Condiciones indispensables:** El producto debe ser devuelto en su empaque original sellado, con etiquetas intactas, sin ningún indicio de uso, manipulación ni corte de malla frontal.
- Los costos de transporte y flete por concepto de devolución por retracto serán asumidos por el comprador según lo estipulado por la ley.
- La devolución del dinero se efectuará en un plazo máximo de treinta (30) días calendario tras la recepción e inspección física del producto en nuestra sede de Bogotá.

---

### 3. POLÍTICA DE GARANTÍA LEGAL DE FABRICACIÓN
Procap Natural garantiza la autenticidad y calidad de los materiales (cabello humano 100% natural y bases anatómicas de micro-malla / poly-skin):
- **Cobertura de la Garantía:** Defectos atribuibles exclusivamente a la confección de fábrica, desprendimiento anómalo masivo de anudado en los primeros **treinta (30) días calendario** posteriores a la compra, siempre que se sigan rigurosamente las pautas de cuidado oficial.
- **Exclusiones de la Garantía:**
  1. Uso de solventes industriales no autorizados (gasolina, alcohol antiséptico directo, acetona pura).
  2. Tirones mecánicos agresivos durante el cepillado o rascado excesivo con uñas.
  3. Decoloraciones químicas o tinturas no realizadas por profesionales certificados de Procap Natural.
  4. Desgaste natural por fricción o tiempo de vida útil cumplido (vida media estimada: 6 a 12 meses según el cuidado).

---

### 4. PROCEDIMIENTO PARA SOLICITUD DE GARANTÍA
1. Envíe un correo a **infprocap@gmail.com** o escriba al WhatsApp **+57 315 118 9795** con el número de pedido o cédula, fotografías claras del producto y descripción del caso.
2. Nuestro comité técnico emitirá un concepto técnico inicial en un plazo no mayor a cinco (5) días hábiles.
3. Si procede, se coordinará el envío del producto a nuestra sede central en Chicó Norte, Bogotá, para inspección, reparación o reemplazo.
`
  },
  {
    slug: "terminos-condiciones",
    title: "Términos y Condiciones Generales de Uso y Servicios",
    short_title: "Términos del Servicio",
    badge: "Contrato de Uso",
    category: "comercial",
    version: "2.2",
    last_updated: "2026-03-01",
    summary: "Reglamenta el acceso al sitio web, reservas de citas en cabina privada, cotizaciones, pasarelas de pago y responsabilidades de las partes.",
    icon_name: "FileText",
    content: `
# TÉRMINOS Y CONDICIONES GENERALES
**PROCAP NATURAL COLOMBIA**

---

### 1. OBJETO Y ACEPTACIÓN
El presente documento regula el uso de la plataforma web https://protesiscapilarcolombia.com y la contratación de los servicios de asesoría, venta de prótesis capilares indetectables, insumos de fijación, instalación y mantenimiento prestados por Procap Natural. El acceso y uso del sitio web implica la aceptación plena y sin reservas de estos términos.

---

### 2. CONDICIONES DE RESERVA DE CITAS EN SALÓN
1. **Cabinas Privadas:** Procap Natural atiende exclusivamente bajo reserva previa para garantizar la privacidad, discreción y bioseguridad del cliente.
2. **Puntualidad:** Se solicita presentarse con diez (10) minutos de anticipación a la cita programada en la sede de Bogotá (Carrera 16 #96-64, Chicó Norte) o sede Cali.
3. **Reprogramaciones:** Podrán realizarse con un mínimo de doce (12) horas de anticipación a través de nuestros canales oficiales sin costo adicional.

---

### 3. PASARELAS DE PAGO Y MEDIOS AUTORIZADOS
- **Pagos Directos (Wompi Bancolombia):** Aceptamos tarjetas de crédito (Visa, Mastercard, Amex), débito PSE y transferencias Bancolombia a través de enlaces oficiales certificados con protocolo SSL / TLS.
- **Financiamiento a Cuotas (Sistecrédito / Addi):** La aprobación y términos crediticios están sujetos a las políticas de evaluación de riesgo del proveedor financiero correspondiente.
- Procap Natural **nunca** solicitará claves bancarias, tokens ni números de seguridad CVV vía telefónica o chat.

---

### 4. DESPACHOS Y ENVÍOS NACIONALES
- Los envíos se efectúan con guía de rastreo mediante transportadoras certificadas (Interrapidísimo, Servientrega, Coordinadora).
- Tiempos promedio de entrega: Bogotá y Cali (24 a 48 horas hábiles); resto de Colombia (48 a 72 horas hábiles).
- La responsabilidad de entrega en destino final se rige bajo la normatividad postal colombiana.

---

### 5. PROPIEDAD INTELECTUAL
Todas las marcas, logotipos, textos, fotografías de transformaciones, videos de Reels y software del cotizador son propiedad exclusiva de Procap Natural o cuentan con las debidas licencias de uso. Queda prohibida su reproducción no autorizada.
`
  },
  {
    slug: "uso-ia-iso42001",
    title: "Política de Transparencia y Uso Ético de Inteligencia Artificial",
    short_title: "Uso Ético de IA (ISO 42001)",
    badge: "ISO/IEC 42001:2023",
    category: "tecnologia",
    version: "1.2",
    last_updated: "2026-03-01",
    summary: "Manifiesto de transparencia, gobernanza algorítmica y supervisión humana del asistente virtual CapilarBot bajo el estándar ISO/IEC 42001.",
    icon_name: "Cpu",
    content: `
# POLÍTICA DE TRANSPARENCIA Y USO ÉTICO DE INTELIGENCIA ARTIFICIAL
**ESTÁNDAR ISO/IEC 42001:2023 - GOBERNANZA DE IA EN PROCAP NATURAL**

---

### 1. DECLARACIÓN DE TRANSPARENCIA Y NATURALEZA DEL ASISTENTE
En cumplimiento de las buenas prácticas internacionales de gobernanza en IA (Norma ISO/IEC 42001:2023 - *Artificial Intelligence Management System*) y el marco ético de la OCDE:
- **Identificación:** El asistente "CapilarBot" disponible en nuestro sitio web es un agente automatizado de software basado en Modelos de Lenguaje Avanzados (LLM) procesado a través de la infraestructura de Groq Inc.
- **Propósito:** Brindar orientación preliminar 24/7 sobre catálogo de productos, características técnicas de las micro-mallas, insumos de fijación, tarifas referenciales y disponibilidad de citas.

---

### 2. DESCARGO DE RESPONSABILIDAD MÉDICA Y ALCANCE ESTÉTICO
1. **Naturaleza Estética No Quirúrgica:** Las prótesis capilares distribuidas por Procap Natural son dispositivos estéticos no invasivos. CapilarBot **NO es un médico dermatólogo, tricólogo ni profesional de la salud**.
2. **Cero Diagnóstico Clínico:** Las respuestas emitidas por la IA no constituyen diagnósticos médicos sobre patologías dermatológicas, dermatitis severas ni prescripciones farmacológicas (minoxidil, finasteride, etc.).
3. Si el usuario presenta afecciones cutáneas activas, heridas abiertas o alergias severas en el cuero cabelludo, se recomienda consultar a un médico especialista antes de la aplicación de adhesivos capilares.

---

### 3. PRINCIPIOS DE GOBERNANZA Y PRIVACIDAD EN IA (ISO 42001)
- **Supervisión Humana Permanente (Human-in-the-Loop):** Toda consulta compleja, cotización personalizada o solicitud de agendamiento puede ser transferida inmediatamente a un estilista humano a través del botón directo de WhatsApp (+57 315 118 9795).
- **Protección de Datos y No Entrenamiento con PII:** Las interacciones del chat no se utilizan para re-entrenar modelos públicos con datos sensibles ni información financiera de los usuarios.
- **Equidad y No Discriminación:** El modelo está parametrizado con directivas de empatía, respeto a la diversidad capilar (incluyendo sistemas para cabello afro, crespo, ondulado y liso) y lenguaje inclusivo.
- **Medidas de Ciberseguridad Activa:** El sistema cuenta con limitadores de frecuencia (Rate Limiting), filtros anti-prompt injection y bloqueo automático de direcciones IP maliciosas para salvaguardar la integridad de la plataforma.
`
  },
  {
    slug: "uso-imagen",
    title: "Autorización de Uso de Imagen y Derechos de Transformaciones",
    short_title: "Uso de Imagen y Testimonios",
    badge: "Derechos de Imagen",
    category: "derechos",
    version: "1.1",
    last_updated: "2026-03-01",
    summary: "Marco de consentimiento informado para la captación, tratamiento y difusión de testimonios audiovisuales de transformaciones capilares de antes y después.",
    icon_name: "Camera",
    content: `
# AUTORIZACIÓN DE USO DE IMAGEN Y TRANSFORMACIONES CAPILARES
**PROCAP NATURAL**

---

### 1. FINALIDAD DEL MATERIAL AUDIOVISUAL
Procap Natural documenta fotográfica y videográficamente procesos reales de adaptación, instalación y resultados de antes/después ("Transformaciones Capilares") con el propósito exclusivo de:
- Mostrar la naturalidad, estética e indetectabilidad del cabello humano y las micro-mallas a futuros clientes.
- Difundir contenido educativo sobre cuidado y mantenimiento en nuestras redes sociales oficiales (Instagram @protesiscapilarnatural, TikTok @procapnatural, Facebook y sitio web).

---

### 2. CONSENTIMIENTO LIBRE, PREVIO E INFORMADO
- Ningún cliente es grabado o fotografiado sin su consentimiento previo y verbal/escrito durante su visita a nuestras cabinas en Bogotá o Cali.
- **Derecho a la Privacidad Total:** Si el cliente prefiere absoluta reserva de su identidad, Procap Natural ofrece la opción de **no publicar** el material o realizar tomas **ocultando el rostro** (tomas cenitales, de perfil difuminado o únicamente del área capilar).

---

### 3. ALCANCE, TERRITORIO Y GRATUIDAD
- La autorización para el uso de testimonios y transformaciones se concede a título gratuito, con fines demostrativos y comerciales legítimos, sin límite territorial ni temporal.
- Procap Natural se compromete a no utilizar el material de forma denigrante, lesiva ni en contextos ajenos a la estética capilar.

---

### 4. REVOCATORIA DE LA AUTORIZACIÓN
El titular que haya consentido la difusión de su imagen podrá solicitar en cualquier momento el retiro o difuminado de sus publicaciones digitales enviando un correo a **infprocap@gmail.com** con el enlace de la publicación respectiva. La solicitud será procesada en un plazo máximo de cinco (5) días hábiles.
`
  }
];

/**
 * Obtiene la lista completa de documentos legales desde Supabase con fallback a los predeterminados
 */
export async function getLegalDocuments(): Promise<LegalDocument[]> {
  if (isSupabaseConfigured()) {
    try {
      // 1. Intentar consultar la tabla dedicada legal_documents
      const { data: dbDocs, error: dbErr } = await supabase
        .from("legal_documents")
        .select("slug, title, short_title, badge, category, version, last_updated, summary, content, icon_name, order_index, is_active")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

      if (!dbErr && dbDocs && dbDocs.length > 0) {
        return dbDocs as LegalDocument[];
      }

      // 2. Fallback a site_settings si no existe la tabla
      const { data: settingsData } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "legal_documents_v1")
        .maybeSingle();

      if (settingsData?.value && Array.isArray(settingsData.value) && settingsData.value.length > 0) {
        return settingsData.value as LegalDocument[];
      }
    } catch (err) {
      console.warn("[LegalStore] Error al consultar Supabase, usando catálogo predeterminado:", err);
    }
  }

  return DEFAULT_LEGAL_DOCUMENTS;
}

/**
 * Obtiene un documento legal por su slug
 */
export async function getLegalDocumentBySlug(slug: string): Promise<LegalDocument | undefined> {
  const docs = await getLegalDocuments();
  return docs.find(d => d.slug === slug);
}

/**
 * Guarda o actualiza los documentos legales en Supabase (tabla legal_documents y site_settings)
 */
export async function saveLegalDocuments(docs: LegalDocument[]): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase no está configurado en las variables de entorno." };
  }

  try {
    // 1. Guardar en tabla legal_documents
    const upsertRows = docs.map((doc, idx) => ({
      slug: doc.slug,
      title: doc.title,
      short_title: doc.short_title,
      badge: doc.badge,
      category: doc.category,
      version: doc.version,
      last_updated: doc.last_updated,
      summary: doc.summary,
      content: doc.content,
      icon_name: doc.icon_name,
      order_index: idx + 1,
      is_active: true,
      updated_at: new Date().toISOString()
    }));

    await supabase.from("legal_documents").upsert(upsertRows, { onConflict: "slug" });

    // 2. Guardar backup en site_settings
    await supabase.from("site_settings").upsert({
      key: "legal_documents_v1",
      value: docs,
      updated_at: new Date().toISOString()
    }, { onConflict: "key" });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error al guardar en Supabase" };
  }
}
