import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { StoreExpense } from "@/lib/staff-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sede = searchParams.get("sede");

    if (isSupabaseConfigured()) {
      let query = supabase
        .from("store_expenses")
        .select("*")
        .order("expense_date", { ascending: false });

      if (sede && sede !== "all") {
        query = query.eq("sede_id", sede);
      }

      const { data, error } = await query;
      if (!error && data) {
        return NextResponse.json({ expenses: data, source: "supabase" });
      }
    }

    return NextResponse.json({ expenses: [], source: "empty" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sede_id, category, concept, amount_cop, expense_date, paid_by } = body;

    if (!sede_id || !concept || !amount_cop) {
      return NextResponse.json({ error: "Sede, concepto y monto son requeridos" }, { status: 400 });
    }

    const expenseRecord: StoreExpense = {
      id: body.id || `exp-${Date.now()}`,
      sede_id,
      category: category || "otros",
      concept,
      amount_cop: Number(amount_cop),
      expense_date: expense_date || new Date().toISOString().split("T")[0],
      paid_by: paid_by || "Caja Menor / Transferencia",
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("store_expenses")
        .insert(expenseRecord)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, expense: data });
    }

    return NextResponse.json({ success: true, expense: expenseRecord });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID de gasto requerido" }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from("store_expenses")
        .delete()
        .eq("id", id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
