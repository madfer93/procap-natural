import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { PosSale, PosSaleItem } from "@/lib/staff-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sede = searchParams.get("sede");
    const sellerId = searchParams.get("seller_id");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (isSupabaseConfigured()) {
      let query = supabase
        .from("pos_sales")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (sede && sede !== "all") {
        query = query.eq("sede_id", sede);
      }
      if (sellerId) {
        query = query.eq("seller_id", sellerId);
      }

      const { data, error } = await query;
      if (!error && data) {
        return NextResponse.json({ sales: data, source: "supabase" });
      }
    }

    return NextResponse.json({ sales: [], source: "empty" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sede_id,
      seller_id,
      seller_name,
      customer_name,
      customer_phone,
      customer_cedula,
      customer_email,
      items,
      subtotal_cop,
      discount_cop,
      total_cop,
      payment_method,
      payment_details,
      notes,
    } = body;

    if (!sede_id || !seller_id || !items || items.length === 0 || total_cop === undefined) {
      return NextResponse.json({ error: "Datos de venta incompletos" }, { status: 400 });
    }

    // Calcular costo total y ganancia bruta de la venta
    let totalCost = 0;
    const enrichedItems: PosSaleItem[] = items.map((item: any) => {
      const itemCost = Number(item.cost_price_cop) || 0;
      totalCost += itemCost * (item.quantity || 1);
      return {
        product_id: item.product_id || item.id,
        product_name: item.product_name || item.name,
        category: item.category || "general",
        unit_price_cop: Number(item.unit_price_cop || item.price_offer),
        cost_price_cop: itemCost,
        quantity: Number(item.quantity) || 1,
        subtotal_cop: Number(item.subtotal_cop || item.price_offer * item.quantity),
      };
    });

    const grossProfit = Math.max(0, total_cop - totalCost);
    const orderNumber = `POS-${sede_id.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;

    const saleRecord: PosSale = {
      id: `pos-${Date.now()}`,
      order_number: orderNumber,
      sede_id,
      seller_id,
      seller_name: seller_name || "Vendedor",
      customer_name: customer_name || "Cliente Mostrador",
      customer_phone: customer_phone || "",
      customer_cedula: customer_cedula || "",
      customer_email: customer_email || "",
      items: enrichedItems,
      subtotal_cop: Number(subtotal_cop) || total_cop,
      discount_cop: Number(discount_cop) || 0,
      total_cop: Number(total_cop),
      total_cost_cop: totalCost,
      gross_profit_cop: grossProfit,
      payment_method: payment_method || "efectivo",
      payment_details: payment_details || {},
      notes: notes || "",
      status: "completed",
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      // 1. Guardar la venta en pos_sales
      const { data: savedSale, error: saleError } = await supabase
        .from("pos_sales")
        .insert(saleRecord)
        .select()
        .single();

      if (saleError) {
        console.error("Error guardando venta POS:", saleError);
        return NextResponse.json({ error: saleError.message }, { status: 500 });
      }

      // 2. Descontar stock de cada producto vendido
      for (const item of enrichedItems) {
        try {
          const { data: prod } = await supabase
            .from("products")
            .select("stock_quantity")
            .eq("id", item.product_id)
            .single();

          if (prod && typeof prod.stock_quantity === "number") {
            const newStock = Math.max(0, prod.stock_quantity - item.quantity);
            await supabase
              .from("products")
              .update({ stock_quantity: newStock })
              .eq("id", item.product_id);
          }
        } catch (stockErr) {
          console.error("Error actualizando stock de producto:", item.product_id, stockErr);
        }
      }

      return NextResponse.json({ success: true, sale: savedSale });
    }

    return NextResponse.json({ success: true, sale: saleRecord, warning: "Guardado en memoria" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
