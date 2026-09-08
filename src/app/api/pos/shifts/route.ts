import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { PosCashShift } from "@/lib/staff-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sede = searchParams.get("sede");
    const sellerId = searchParams.get("seller_id");
    const status = searchParams.get("status"); // 'open' | 'closed'

    if (isSupabaseConfigured()) {
      let query = supabase
        .from("pos_cash_shifts")
        .select("*")
        .order("opened_at", { ascending: false });

      if (sede && sede !== "all") {
        query = query.eq("sede_id", sede);
      }
      if (sellerId) {
        query = query.eq("seller_id", sellerId);
      }
      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (!error && data) {
        return NextResponse.json({ shifts: data, currentShift: data.find(s => s.status === "open") || null });
      }
    }

    return NextResponse.json({ shifts: [], currentShift: null });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // 1. Apertura de Turno / Base de Caja
    if (action === "open_shift") {
      const { sede_id, seller_id, seller_name, opening_cash_cop, notes } = body;

      if (!sede_id || !seller_id) {
        return NextResponse.json({ error: "Sede y Vendedor requeridos" }, { status: 400 });
      }

      const newShift: PosCashShift = {
        id: `shift-${Date.now()}`,
        sede_id,
        seller_id,
        seller_name: seller_name || "Vendedor",
        opened_at: new Date().toISOString(),
        closed_at: null,
        opening_cash_cop: Number(opening_cash_cop) || 0,
        expected_cash_cop: Number(opening_cash_cop) || 0,
        actual_cash_cop: 0,
        cash_difference_cop: 0,
        total_sales_cop: 0,
        sales_count: 0,
        notes: notes || "Apertura de caja de turno",
        status: "open",
      };

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from("pos_cash_shifts")
          .insert(newShift)
          .select()
          .single();

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, shift: data });
      }

      return NextResponse.json({ success: true, shift: newShift });
    }

    // 2. Cierre de Turno / Arqueo de Caja
    if (action === "close_shift") {
      const { shift_id, actual_cash_cop, expected_cash_cop, total_sales_cop, sales_count, notes } = body;

      if (!shift_id) {
        return NextResponse.json({ error: "ID de turno requerido" }, { status: 400 });
      }

      const actualCash = Number(actual_cash_cop) || 0;
      const expectedCash = Number(expected_cash_cop) || 0;
      const difference = actualCash - expectedCash;

      const updateData = {
        closed_at: new Date().toISOString(),
        actual_cash_cop: actualCash,
        expected_cash_cop: expectedCash,
        cash_difference_cop: difference,
        total_sales_cop: Number(total_sales_cop) || 0,
        sales_count: Number(sales_count) || 0,
        notes: notes || "Cierre de turno",
        status: "closed",
      };

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from("pos_cash_shifts")
          .update(updateData)
          .eq("id", shift_id)
          .select()
          .single();

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, shift: data });
      }

      return NextResponse.json({ success: true, shift: { id: shift_id, ...updateData } });
    }

    return NextResponse.json({ error: "Acción no reconocida" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
