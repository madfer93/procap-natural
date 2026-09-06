import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { OrderShipment } from "@/lib/orders-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Validar estructura del webhook de Wompi
    const eventType = payload.event;
    const transaction = payload.data?.transaction;

    if (!transaction) {
      return NextResponse.json({ message: "Payload recibido sin transacción." }, { status: 200 });
    }

    const txId = transaction.id;
    const status = transaction.status; // 'APPROVED', 'DECLINED', 'VOIDED', 'ERROR'
    const amountInCents = transaction.amount_in_cents || 0;
    const amountCop = amountInCents / 100;
    const reference = transaction.reference || "Venta Web Procap";
    const paymentMethodType = transaction.payment_method_type || "Wompi";

    // Datos del cliente y envío provistos por Wompi
    const customerData = transaction.customer_data || {};
    const shippingAddress = transaction.shipping_address || {};

    const customerName = customerData.full_name || transaction.customer_email || "Cliente Wompi";
    const customerPhone = customerData.phone_number || "";
    const customerEmail = transaction.customer_email || customerData.email || "";
    const customerDocument = customerData.legal_id || "";

    const fullAddress = [
      shippingAddress.address_line_1,
      shippingAddress.address_line_2
    ].filter(Boolean).join(", ") || "Dirección ingresada en pasarela";

    const city = shippingAddress.city || "Bogotá D.C.";
    const department = shippingAddress.region || "Cundinamarca";

    const orderId = `ORD-${reference.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10)}-${txId.slice(-4)}`;

    const newOrder: OrderShipment = {
      id: orderId,
      wompi_transaction_id: txId,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      customer_document: customerDocument,
      shipping_address: fullAddress,
      shipping_city: city,
      shipping_department: department,
      product_name: reference,
      amount_cop: amountCop,
      payment_method: `Wompi (${paymentMethodType})`,
      payment_status: status,
      shipping_status: status === "APPROVED" ? "pendiente" : "pendiente",
      notes: `Pago procesado vía Wompi Event Webhook. Ref: ${reference}`,
      created_at: transaction.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      await supabase
        .from("orders")
        .upsert(newOrder, { onConflict: "id" });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Evento Wompi procesado y registrado exitosamente en despachos.",
      orderId: orderId,
      status: status
    }, { status: 200 });

  } catch (err: any) {
    console.error("Error al procesar webhook de Wompi:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
