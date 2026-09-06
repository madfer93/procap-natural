export interface OrderShipment {
  id: string;
  wompi_transaction_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_document?: string; // Cédula o NIT
  shipping_address: string;
  shipping_city: string;
  shipping_department?: string;
  product_name: string;
  product_sku?: string;
  amount_cop: number;
  payment_method?: string; // Wompi, Transferencia, Contraentrega, Sistecrédito
  payment_status: 'APPROVED' | 'PENDING' | 'DECLINED' | 'VOIDED';
  carrier?: string; // Servientrega, Interrapidísimo, Coordinadora, Envía, TCC, Mensajería Local
  tracking_number?: string;
  tracking_url?: string;
  shipping_status: 'pendiente' | 'preparando' | 'despachado' | 'en_transito' | 'entregado' | 'devuelto';
  shipping_cost?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const INITIAL_ORDERS: OrderShipment[] = [
  {
    id: "ORD-98214",
    wompi_transaction_id: "wmp_tx_7834921",
    customer_name: "Juan Sebastián Morales",
    customer_phone: "3124567890",
    customer_email: "juan.morales@gmail.com",
    customer_document: "1020789456",
    shipping_address: "Carrera 43A #1-50, Apto 802, El Poblado",
    shipping_city: "Medellín",
    shipping_department: "Antioquia",
    product_name: "Sistema Capilar París",
    product_sku: "SIST-PARIS",
    amount_cop: 1950000,
    payment_method: "Wompi (Tarjeta Crédito)",
    payment_status: "APPROVED",
    carrier: "Interrapidísimo",
    tracking_number: "70008942155",
    tracking_url: "https://www.interrapidisimo.com/sigue-tu-envio/?guia=70008942155",
    shipping_status: "en_transito",
    shipping_cost: 25000,
    notes: "Paquete asegurado por valor total. Incluye kit de mantenimiento de regalo.",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "ORD-98215",
    wompi_transaction_id: "wmp_tx_7834990",
    customer_name: "Diego Fernando Rojas",
    customer_phone: "3189901122",
    customer_email: "diego.rojas@hotmail.com",
    customer_document: "80123456",
    shipping_address: "Calle 140 #19-45, Barrio Cedritos",
    shipping_city: "Bogotá D.C.",
    shipping_department: "Cundinamarca",
    product_name: "Kit Completo de Mantenimiento",
    product_sku: "KIT-MANT-FULL",
    amount_cop: 410000,
    payment_method: "Wompi (PSE Nequi)",
    payment_status: "APPROVED",
    carrier: "Servientrega",
    tracking_number: "9921445582",
    tracking_url: "https://www.servientrega.com/wps/portal/rastreo-envio",
    shipping_status: "preparando",
    shipping_cost: 15000,
    notes: "Entregar en horario de oficina.",
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const CARRIERS_LIST = [
  { id: "interrapidisimo", name: "Interrapidísimo", trackingUrlPrefix: "https://www.interrapidisimo.com/sigue-tu-envio/?guia=" },
  { id: "servientrega", name: "Servientrega", trackingUrlPrefix: "https://www.servientrega.com/wps/portal/rastreo-envio?guia=" },
  { id: "coordinadora", name: "Coordinadora", trackingUrlPrefix: "https://coordinadora.com/rastreo/rastreo-de-guia/?guia=" },
  { id: "envia", name: "Envía", trackingUrlPrefix: "https://enviacolvanes.com/rastreo-de-guias?guia=" },
  { id: "tcc", name: "TCC", trackingUrlPrefix: "https://tcc.com.co/rastreo/?guia=" },
  { id: "domicilio_bogota", name: "Mensajería Express Bogotá", trackingUrlPrefix: "" }
];
