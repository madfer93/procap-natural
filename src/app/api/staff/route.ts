import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { StaffSeller, INITIAL_STAFF } from "@/lib/staff-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sede = searchParams.get("sede");
    const activeOnly = searchParams.get("active") === "true";

    if (isSupabaseConfigured()) {
      let query = supabase
        .from("staff_sellers")
        .select("*")
        .order("created_at", { ascending: false });

      if (sede && sede !== "all") {
        query = query.or(`sede_id.eq.${sede},sede_id.eq.all`);
      }

      if (activeOnly) {
        query = query.eq("is_active", true);
      }

      const { data, error } = await query;

      if (!error && data) {
        return NextResponse.json({ staff: data, source: "supabase" });
      }
    }

    // Fallback inicial
    let filtered = [...INITIAL_STAFF];
    if (sede && sede !== "all") {
      filtered = filtered.filter(s => s.sede_id === sede || s.sede_id === "all");
    }
    if (activeOnly) {
      filtered = filtered.filter(s => s.is_active);
    }

    return NextResponse.json({ staff: filtered, source: "memory" });
  } catch (err: any) {
    return NextResponse.json({ staff: INITIAL_STAFF, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Caso de verificación de PIN para login en POS
    if (body.action === "verify_pin") {
      const { pin, sede_id } = body;
      if (!pin) {
        return NextResponse.json({ error: "PIN no proporcionado" }, { status: 400 });
      }

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from("staff_sellers")
          .select("*")
          .eq("pin", pin)
          .eq("is_active", true);

        if (!error && data && data.length > 0) {
          const matched = data.find(s => s.sede_id === "all" || !sede_id || s.sede_id === sede_id) || data[0];
          // Omitimos pin en la respuesta por seguridad
          const { pin: _, ...safeSeller } = matched;
          return NextResponse.json({ success: true, seller: safeSeller });
        }
      }

      // Fallback
      const fallbackSeller = INITIAL_STAFF.find(s => s.pin === pin && s.is_active);
      if (fallbackSeller) {
        const { pin: _, ...safeSeller } = fallbackSeller;
        return NextResponse.json({ success: true, seller: safeSeller });
      }

      return NextResponse.json({ success: false, error: "PIN inválido o usuario inactivo" }, { status: 401 });
    }

    // 2. Creación de nuevo vendedor
    const { name, phone, email, cedula, pin, sede_id, role, commission_percent, is_active } = body;

    if (!name || !pin || !sede_id) {
      return NextResponse.json({ error: "Nombre, PIN y Sede son obligatorios" }, { status: 400 });
    }

    const newStaff: StaffSeller = {
      id: body.id || `staff-${Date.now()}`,
      name,
      phone: phone || "",
      email: email || "",
      cedula: cedula || "",
      pin: pin.trim(),
      sede_id,
      role: role || "seller",
      commission_percent: Number(commission_percent) || 0,
      is_active: is_active !== undefined ? is_active : true,
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("staff_sellers")
        .upsert(newStaff)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ staff: data, success: true });
    }

    return NextResponse.json({ staff: newStaff, success: true, warning: "Supabase no conectado" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: Partial<StaffSeller> & { id: string } = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: "ID de empleado requerido" }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("staff_sellers")
        .update(body)
        .eq("id", body.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ staff: data, success: true });
    }

    return NextResponse.json({ staff: body, success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID de empleado requerido" }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from("staff_sellers")
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
