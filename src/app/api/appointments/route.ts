import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { INITIAL_APPOINTMENTS, Appointment } from "@/lib/appointments-store";

export const dynamic = "force-dynamic";

let inMemoryAppointments: Appointment[] = [...INITIAL_APPOINTMENTS];

export async function GET(req: NextRequest) {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .order("appointment_date", { ascending: true });

      if (!error && data) {
        return NextResponse.json({ appointments: data, source: "supabase" });
      }
    }

    return NextResponse.json({ appointments: inMemoryAppointments, source: "memory" });
  } catch (err: any) {
    return NextResponse.json({ appointments: inMemoryAppointments, source: "fallback" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: Appointment = await req.json();

    if (!body.client_name || !body.client_phone || !body.appointment_date) {
      return NextResponse.json({ error: "Nombre, teléfono y fecha son obligatorios." }, { status: 400 });
    }

    const newAppointment: Appointment = {
      ...body,
      id: body.id || `apt-${Date.now()}`,
      status: body.status || 'pending',
      created_by: body.created_by || 'client_web',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("appointments")
        .upsert(newAppointment)
        .select()
        .single();

      if (error) {
        // Fallback a memoria si la tabla aún no se ha creado
        inMemoryAppointments.unshift(newAppointment);
        return NextResponse.json({ appointment: newAppointment, success: true, warning: error.message });
      }
      return NextResponse.json({ appointment: data, success: true });
    }

    inMemoryAppointments.unshift(newAppointment);
    return NextResponse.json({ appointment: newAppointment, success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("appointments")
        .update({ status, ...(notes !== undefined ? { notes } : {}) })
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ appointment: data, success: true });
      }
    }

    inMemoryAppointments = inMemoryAppointments.map(a => a.id === id ? { ...a, status, ...(notes !== undefined ? { notes } : {}) } : a);
    return NextResponse.json({ success: true });
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
      await supabase
        .from("appointments")
        .delete()
        .eq("id", id);
    }

    inMemoryAppointments = inMemoryAppointments.filter(a => a.id !== id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
