import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { SEDES_DATA, SedeInfo } from "@/lib/sedes-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ sedes: SEDES_DATA, source: "local" });
    }

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "sedes_list")
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ sedes: SEDES_DATA, error: error.message }, { status: 200 });
    }

    const sedes: SedeInfo[] = data?.value || SEDES_DATA;
    return NextResponse.json({ sedes, source: data?.value ? "supabase" : "local_fallback" });
  } catch (err: any) {
    return NextResponse.json({ sedes: SEDES_DATA, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase no está configurado." }, { status: 503 });
    }

    const body = await req.json();
    let sedesToSave: SedeInfo[] = [];

    if (Array.isArray(body.sedes)) {
      sedesToSave = body.sedes;
    } else if (body.sede) {
      // Obtener existentes y agregar/actualizar
      const { data: existing } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "sedes_list")
        .single();

      const currentList: SedeInfo[] = existing?.value || SEDES_DATA;
      const index = currentList.findIndex(s => s.slug === body.sede.slug);
      if (index >= 0) {
        currentList[index] = body.sede;
      } else {
        currentList.push(body.sede);
      }
      sedesToSave = currentList;
    } else {
      sedesToSave = body;
    }

    const { error } = await supabase
      .from("site_settings")
      .upsert({
        key: "sedes_list",
        value: sedesToSave,
        updated_at: new Date().toISOString()
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, sedes: sedesToSave });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
