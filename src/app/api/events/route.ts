import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { INITIAL_EVENTS, CapilarEvent } from "@/lib/events-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("order_index", { ascending: true });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ events: data, source: "supabase" });
      }
    }

    return NextResponse.json({ events: INITIAL_EVENTS, source: "memory" });
  } catch (err: any) {
    return NextResponse.json({ events: INITIAL_EVENTS, source: "fallback" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: CapilarEvent = await req.json();

    if (!body.city || !body.date_text) {
      return NextResponse.json({ error: "Ciudad y fecha son obligatorias" }, { status: 400 });
    }

    const newEvent: CapilarEvent = {
      ...body,
      id: body.id || `event-${Date.now()}`,
      is_active: body.is_active !== undefined ? body.is_active : true,
      services: body.services || ["Instalación de prótesis capilar", "Mantenimiento preventivo", "Asesoría personalizada"]
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("events")
        .upsert(newEvent)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ event: data, success: true });
    }

    return NextResponse.json({ event: newEvent, success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
