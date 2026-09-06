import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { sendOrderConfirmationEmail } from "@/lib/email-service";
import { OrderShipment, INITIAL_ORDERS } from "@/lib/orders-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "orderId es requerido" }, { status: 400 });
    }

    let order: OrderShipment | null = null;

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (!error && data) {
        order = data as OrderShipment;
      }
    }

    if (!order) {
      order = INITIAL_ORDERS.find(o => o.id === orderId) || null;
    }

    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    if (!order.customer_email) {
      return NextResponse.json({ error: "Este pedido no tiene correo electrónico asignado." }, { status: 400 });
    }

    const result = await sendOrderConfirmationEmail(order);

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: `Correo enviado exitosamente a ${order.customer_email}` 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error || "No se pudo enviar el correo" 
      }, { status: 500 });
    }

  } catch (err: any) {
    console.error("Error en API de reenvío de email:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
