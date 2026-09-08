import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { PosSale, StoreExpense, StaffSeller } from "@/lib/staff-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sede = searchParams.get("sede"); // 'all' | 'bogota' | 'cali' | 'neiva' | 'barranquilla'

    let posSales: PosSale[] = [];
    let storeExpenses: StoreExpense[] = [];
    let staffSellers: StaffSeller[] = [];

    if (isSupabaseConfigured()) {
      // 1. Obtener ventas POS
      let salesQuery = supabase.from("pos_sales").select("*").eq("status", "completed");
      if (sede && sede !== "all") {
        salesQuery = salesQuery.eq("sede_id", sede);
      }
      const { data: salesData } = await salesQuery;
      if (salesData) posSales = salesData;

      // 2. Obtener gastos operativos
      let expensesQuery = supabase.from("store_expenses").select("*");
      if (sede && sede !== "all") {
        expensesQuery = expensesQuery.eq("sede_id", sede);
      }
      const { data: expensesData } = await expensesQuery;
      if (expensesData) storeExpenses = expensesData;

      // 3. Obtener vendedores para cálculo de comisiones
      const { data: staffData } = await supabase.from("staff_sellers").select("*");
      if (staffData) staffSellers = staffData;
    }

    // Cálculos Financieros
    const totalSalesCOP = posSales.reduce((acc, s) => acc + (s.total_cop || 0), 0);
    const totalCostCOP = posSales.reduce((acc, s) => acc + (s.total_cost_cop || 0), 0);
    const grossProfitCOP = Math.max(0, totalSalesCOP - totalCostCOP);
    const grossMarginPercent = totalSalesCOP > 0 ? Math.round((grossProfitCOP / totalSalesCOP) * 100) : 0;

    const totalExpensesCOP = storeExpenses.reduce((acc, e) => acc + (e.amount_cop || 0), 0);
    const netProfitCOP = grossProfitCOP - totalExpensesCOP;
    const netMarginPercent = totalSalesCOP > 0 ? Math.round((netProfitCOP / totalSalesCOP) * 100) : 0;

    // Métricas por Sede
    const sedesBreakdown: Record<string, { sales: number; costs: number; gross: number; expenses: number; net: number; count: number }> = {
      bogota: { sales: 0, costs: 0, gross: 0, expenses: 0, net: 0, count: 0 },
      cali: { sales: 0, costs: 0, gross: 0, expenses: 0, net: 0, count: 0 },
      neiva: { sales: 0, costs: 0, gross: 0, expenses: 0, net: 0, count: 0 },
      barranquilla: { sales: 0, costs: 0, gross: 0, expenses: 0, net: 0, count: 0 },
    };

    posSales.forEach((s) => {
      const sId = s.sede_id || "bogota";
      if (!sedesBreakdown[sId]) {
        sedesBreakdown[sId] = { sales: 0, costs: 0, gross: 0, expenses: 0, net: 0, count: 0 };
      }
      sedesBreakdown[sId].sales += s.total_cop || 0;
      sedesBreakdown[sId].costs += s.total_cost_cop || 0;
      sedesBreakdown[sId].gross += s.gross_profit_cop || 0;
      sedesBreakdown[sId].count += 1;
    });

    storeExpenses.forEach((e) => {
      const sId = e.sede_id || "bogota";
      if (sedesBreakdown[sId]) {
        sedesBreakdown[sId].expenses += e.amount_cop || 0;
      }
    });

    Object.keys(sedesBreakdown).forEach((k) => {
      sedesBreakdown[k].net = sedesBreakdown[k].gross - sedesBreakdown[k].expenses;
    });

    // Top Vendedores
    const sellerStats: Record<string, { name: string; totalSales: number; salesCount: number; commissionEarned: number; sede: string }> = {};

    posSales.forEach((s) => {
      const sellerId = s.seller_id || "unknown";
      const sellerProfile = staffSellers.find((st) => st.id === sellerId);
      const commissionRate = sellerProfile?.commission_percent || 5;

      if (!sellerStats[sellerId]) {
        sellerStats[sellerId] = {
          name: s.seller_name || "Vendedor",
          totalSales: 0,
          salesCount: 0,
          commissionEarned: 0,
          sede: s.sede_id,
        };
      }

      sellerStats[sellerId].totalSales += s.total_cop || 0;
      sellerStats[sellerId].salesCount += 1;
      sellerStats[sellerId].commissionEarned += Math.round(((s.total_cop || 0) * commissionRate) / 100);
    });

    const topSellers = Object.values(sellerStats).sort((a, b) => b.totalSales - a.totalSales);

    // Top Productos Vendidos
    const productStats: Record<string, { name: string; quantity: number; totalRevenue: number; totalProfit: number; category: string }> = {};

    posSales.forEach((s) => {
      s.items?.forEach((item) => {
        const pId = item.product_id || item.product_name;
        if (!productStats[pId]) {
          productStats[pId] = {
            name: item.product_name,
            quantity: 0,
            totalRevenue: 0,
            totalProfit: 0,
            category: item.category,
          };
        }
        productStats[pId].quantity += item.quantity || 1;
        productStats[pId].totalRevenue += item.subtotal_cop || (item.unit_price_cop * item.quantity);
        const profit = (item.unit_price_cop - item.cost_price_cop) * item.quantity;
        productStats[pId].totalProfit += Math.max(0, profit);
      });
    });

    const topProducts = Object.values(productStats).sort((a, b) => b.totalRevenue - a.totalRevenue);

    return NextResponse.json({
      summary: {
        totalSalesCOP,
        totalCostCOP,
        grossProfitCOP,
        grossMarginPercent,
        totalExpensesCOP,
        netProfitCOP,
        netMarginPercent,
        totalOrdersCount: posSales.length,
      },
      sedesBreakdown,
      topSellers,
      topProducts,
      recentSales: posSales.slice(0, 15),
      recentExpenses: storeExpenses.slice(0, 15),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
