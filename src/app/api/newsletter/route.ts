import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, phone, action } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Correo electrónico inválido" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Caso de desuscripción (Habeas Data)
    if (action === "unsubscribe") {
      if (isSupabaseConfigured()) {
        await supabase
          .from("subscribers")
          .update({ is_subscribed: false, unsubscribed_at: new Date().toISOString() })
          .eq("email", cleanEmail);
      }
      return NextResponse.json({
        success: true,
        message: "Te has desuscrito exitosamente de las comunicaciones promocionales.",
      });
    }

    // 2. Caso de suscripción
    const subscriberData = {
      email: cleanEmail,
      name: name || "",
      phone: phone || "",
      is_subscribed: true,
      source: "web_footer",
      subscribed_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      await supabase.from("subscribers").upsert(subscriberData, { onConflict: "email" });
    }

    return NextResponse.json({
      success: true,
      message: "¡Gracias por suscribirte! Recibirás promociones y novedades exclusivas.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
