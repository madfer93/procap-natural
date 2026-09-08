export interface StaffSeller {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  cedula?: string;
  pin: string; // PIN numérico de 4 a 6 dígitos para POS
  sede_id: string; // 'bogota' | 'cali' | 'neiva' | 'barranquilla' | 'all'
  role: 'admin' | 'seller' | 'stylist';
  commission_percent: number;
  is_active: boolean;
  created_at?: string;
}

export interface PosSaleItem {
  product_id: string;
  product_name: string;
  category: string;
  unit_price_cop: number;
  cost_price_cop: number;
  quantity: number;
  subtotal_cop: number;
}

export interface PosSale {
  id: string;
  order_number: string;
  sede_id: string;
  seller_id: string;
  seller_name: string;
  customer_name?: string;
  customer_phone?: string;
  customer_cedula?: string;
  customer_email?: string;
  items: PosSaleItem[];
  subtotal_cop: number;
  discount_cop: number;
  total_cop: number;
  total_cost_cop: number;
  gross_profit_cop: number;
  payment_method: 'efectivo' | 'datafono' | 'nequi_daviplata' | 'wompi_qr' | 'sistecredito' | 'addi' | 'mixto';
  payment_details?: {
    cash_received?: number;
    cash_change?: number;
    voucher_reference?: string;
    credit_reference?: string;
    mixed_breakdown?: Record<string, number>;
  };
  notes?: string;
  status: 'completed' | 'cancelled';
  created_at: string;
}

export interface PosCashShift {
  id: string;
  sede_id: string;
  seller_id: string;
  seller_name: string;
  opened_at: string;
  closed_at?: string | null;
  opening_cash_cop: number;
  expected_cash_cop?: number;
  actual_cash_cop?: number;
  cash_difference_cop?: number;
  total_sales_cop?: number;
  sales_count?: number;
  notes?: string;
  status: 'open' | 'closed';
}

export interface StoreExpense {
  id: string;
  sede_id: string;
  category: 'arriendo' | 'servicios' | 'insumos_cabina' | 'mantenimiento' | 'viaticos' | 'comisiones' | 'otros';
  concept: string;
  amount_cop: number;
  expense_date: string;
  paid_by?: string;
  receipt_url?: string;
  created_at: string;
}

export const INITIAL_STAFF: StaffSeller[] = [
  {
    id: "staff-master",
    name: "Manuel Madrid (Director)",
    phone: "324 374 8704",
    email: "admin@protesiscapilarcolombia.com",
    cedula: "1000000000",
    pin: "2026",
    sede_id: "all",
    role: "admin",
    commission_percent: 0,
    is_active: true,
  },
  {
    id: "staff-bogota-01",
    name: "Estilista Principal Chicó",
    phone: "300 123 4567",
    email: "bogota@procapnatural.com",
    cedula: "1018000001",
    pin: "1111",
    sede_id: "bogota",
    role: "stylist",
    commission_percent: 5,
    is_active: true,
  },
  {
    id: "staff-cali-01",
    name: "Asesor Especialista Granada",
    phone: "315 987 6543",
    email: "cali@procapnatural.com",
    cedula: "1144000002",
    pin: "2222",
    sede_id: "cali",
    role: "seller",
    commission_percent: 4,
    is_active: true,
  },
  {
    id: "staff-neiva-01",
    name: "Encargado Sede Ipanema",
    phone: "310 555 7890",
    email: "neiva@procapnatural.com",
    cedula: "1075000003",
    pin: "3333",
    sede_id: "neiva",
    role: "seller",
    commission_percent: 4,
    is_active: true,
  },
  {
    id: "staff-baq-01",
    name: "Estilista Prado Norte",
    phone: "301 444 3210",
    email: "barranquilla@procapnatural.com",
    cedula: "1045000004",
    pin: "4444",
    sede_id: "barranquilla",
    role: "stylist",
    commission_percent: 5,
    is_active: true,
  }
];

export const SEDE_LABELS: Record<string, string> = {
  all: "🌐 Todas las Sedes (Master)",
  bogota: "🏢 Sede Bogotá (Chicó Norte)",
  cali: "🌴 Sede Cali (Granada)",
  neiva: "☀️ Sede Neiva (Ipanema)",
  barranquilla: "🌊 Sede Barranquilla (El Prado / Villa Santos)"
};
