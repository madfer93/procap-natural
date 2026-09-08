import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export interface AILead {
  id: string;
  user_name?: string;
  user_phone?: string;
  interest_product?: string;
  summary?: string;
  conversation_log: Array<{
    role: "user" | "assistant";
    content: string;
    time?: string;
  }>;
  created_at?: string;
}

export async function GET(req: NextRequest) {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("ai_leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return NextResponse.json({ leads: data, source: "supabase" });
      }
    }

    return NextResponse.json({ leads: [], source: "empty" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, leads: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: Partial<AILead> = await req.json();

    if (!body.conversation_log || body.conversation_log.length === 0) {
      return NextResponse.json({ error: "Log de conversación requerido" }, { status: 400 });
    }

    // Extraer resumen automático del último mensaje o intención
    const lastUserMessage = body.conversation_log
      .slice()
      .reverse()
      .find((m) => m.role === "user")?.content || "Consulta general";

    const leadRecord = {
      user_name: body.user_name || "Prospecto Web",
      user_phone: body.user_phone || "",
      interest_product: body.interest_product || "Prótesis Capilar / Consulta",
      summary: body.summary || lastUserMessage.slice(0, 140),
      conversation_log: body.conversation_log,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("ai_leads")
        .insert(leadRecord)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Enviar alerta de lead por correo al administrador si cuenta con teléfono o nombre
      if (leadRecord.user_phone) {
        import("@/lib/email-service").then(({ sendNewLeadAlertEmail }) => {
          sendNewLeadAlertEmail(leadRecord).catch(() => {});
        });
      }

      return NextResponse.json({ success: true, lead: data });
    }

    if (leadRecord.user_phone) {
      import("@/lib/email-service").then(({ sendNewLeadAlertEmail }) => {
        sendNewLeadAlertEmail(leadRecord).catch(() => {});
      });
    }

    return NextResponse.json({ success: true, lead: leadRecord, warning: "Supabase no conectado" });
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
        .from("ai_leads")
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
